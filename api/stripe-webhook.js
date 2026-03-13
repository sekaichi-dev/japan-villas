/**
 * Vercel Serverless Function: Stripe Webhook Handler
 * 
 * This endpoint receives webhook events from Stripe to confirm payment completion.
 * It verifies the webhook signature to ensure requests are authentic and haven't been tampered with.
 * 
 * CRITICAL SECURITY:
 * - Never trust the frontend success_url alone - it can be spoofed
 * - Always verify payment via webhook before confirming a reservation
 * - Webhook signatures prove the event came from Stripe, not an attacker
 * 
 * POST /api/stripe-webhook
 * Headers: stripe-signature (provided by Stripe)
 * Body: Raw webhook payload
 */

import Stripe from 'stripe';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';
import { getBeds24Token } from './beds24/auth.js';

export const config = {
    api: {
        // Disable body parsing - we need raw body for signature verification
        bodyParser: false,
    },
};

/**
 * Collect raw body from request stream
 * Required for Stripe signature verification
 */
async function getRawBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get Stripe secret key
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
        console.error('[stripe-webhook] Missing STRIPE_SECRET_KEY');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get webhook secret for signature verification
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('[stripe-webhook] Missing STRIPE_WEBHOOK_SECRET');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured()) {
        console.warn('[stripe-webhook] ⚠️ Missing Supabase configuration - proceeding without DB inserts for testing');
    }

    const stripe = new Stripe(stripeSecretKey);

    // Get the signature from headers
    const signature = req.headers['stripe-signature'];
    if (!signature) {
        console.error('[stripe-webhook] Missing stripe-signature header');
        return res.status(400).json({ error: 'Missing signature' });
    }

    let event;
    let rawBody;

    try {
        // Get raw body for signature verification
        rawBody = await getRawBody(req);

        // Verify the webhook signature
        // This ensures the request came from Stripe and hasn't been tampered with
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    } catch (err) {
        console.error('[stripe-webhook] Signature verification failed:', err.message);
        return res.status(400).json({
            error: 'Webhook signature verification failed',
            message: err.message
        });
    }

    // Log the event type for debugging
    console.log(`[stripe-webhook] Received event: ${event.type}`);

    // Handle specific event types
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;

            case 'checkout.session.expired':
                await handleCheckoutSessionExpired(event.data.object);
                break;

            case 'payment_intent.succeeded':
                // Additional confirmation - can be used for extra validation
                console.log('[stripe-webhook] Payment intent succeeded:', event.data.object.id);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            default:
                // Log unhandled events for future implementation
                console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
        }

        // Acknowledge receipt of the event
        // Always return 200 for valid events (Stripe will retry on non-2xx)
        return res.status(200).json({ received: true, type: event.type });

    } catch (err) {
        console.error('[stripe-webhook] Error processing event:', err.message);
        // Still return 200 to prevent Stripe from retrying indefinitely
        // Log the error for investigation
        return res.status(200).json({
            received: true,
            type: event.type,
            warning: 'Event received but processing encountered an error'
        });
    }
}

/**
 * Handle successful checkout session completion
 * This is the primary event for confirming a reservation payment
 */
async function handleCheckoutSessionCompleted(session) {
    console.log('[stripe-webhook] Processing checkout.session.completed');
    console.log('[stripe-webhook] Session ID:', session.id);

    // Only process if payment was actually successful
    if (session.payment_status !== 'paid') {
        console.log('[stripe-webhook] ⚠️ Session completed but payment_status is:', session.payment_status);
        return;
    }

    let metadata = session.metadata || {};

    if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();

        // Check for existing reservation (idempotency or pending hold)
        const { data: existing, error: lookupError } = await supabase
            .from('reservations')
            .select('id, status')
            .eq('stripe_session_id', session.id)
            .single();

        if (lookupError && lookupError.code !== 'PGRST116') {
            console.error('[stripe-webhook] Error checking for existing reservation:', lookupError);
            throw lookupError;
        }

        if (existing) {
            console.log('[stripe-webhook] ℹ️ Reservation already exists status:', existing.status);
            if (existing.status === 'paid') {
                console.log('[stripe-webhook] ✅ Already paid, skipping DB update.');
                return;
            }

            if (existing.status === 'pending') {
                const { error: updateError } = await supabase
                    .from('reservations')
                    .update({ 
                        status: 'paid',
                        stripe_payment_intent_id: session.payment_intent,
                        amount: session.amount_total,
                        currency: session.currency,
                        customer_email: session.customer_details?.email || null,
                        customer_name: session.customer_details?.name || null,
                    })
                    .eq('id', existing.id);

                if (updateError) {
                    console.error('[stripe-webhook] Error updating pending reservation:', updateError);
                    throw updateError;
                }
                console.log('[stripe-webhook] ✅ Pending reservation updated to paid');
            } else {
                return; // Cancelled or other
            }
        } else {
            // Create new record
            let resolvedArrival = metadata.check_in_date || null;
            let resolvedDeparture = metadata.check_out_date || null;

            if (metadata.option && metadata.beds24_booking_id && (!resolvedArrival || !resolvedDeparture)) {
                try {
                    const beds24BookingRes = await fetch(
                        `https://api.beds24.com/v2/bookings?id=${encodeURIComponent(metadata.beds24_booking_id)}`,
                        { headers: { 'token': await getBeds24Token() } }
                    );
                    if (beds24BookingRes.ok) {
                        const b24Data = await beds24BookingRes.json();
                        const b24Booking = Array.isArray(b24Data) ? b24Data[0] : b24Data?.data?.[0];
                        if (b24Booking) {
                            resolvedArrival = b24Booking.arrival || resolvedArrival;
                            resolvedDeparture = b24Booking.departure || resolvedDeparture;
                        }
                    }
                } catch (err) {
                    console.warn('[stripe-webhook] Could not resolve dates from Beds24:', err.message);
                }
            }

            const { error: insertError } = await supabase
                .from('reservations')
                .insert([{
                    stripe_session_id: session.id,
                    stripe_payment_intent_id: session.payment_intent,
                    amount: session.amount_total,
                    currency: session.currency,
                    status: 'paid',
                    customer_email: session.customer_details?.email || null,
                    customer_name: session.customer_details?.name || null,
                    property_name: metadata.property_name || metadata.property || null,
                    check_in_date: resolvedArrival,
                    check_out_date: resolvedDeparture,
                    guests: metadata.guests ? parseInt(metadata.guests) : null,
                    metadata: metadata
                }]);

            if (insertError) {
                if (insertError.code === '23505') return;
                console.error('[stripe-webhook] Error inserting reservation:', insertError);
                throw insertError;
            }
            console.log('[stripe-webhook] ✅ New reservation created');
        }
    }

    // --- PHASE 2: Notifications & Beds24 Updates ---
    if (metadata.room_id) {
        // 1. For a NEW room booking
        try {
            await createBeds24Booking({
                roomId: metadata.room_id,
                arrival: metadata.check_in_date,
                departure: metadata.check_out_date,
                numAdult: metadata.guests || 1,
                firstName: session.customer_details?.name?.split(' ')[0] || 'Guest',
                lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || 'Customer',
                email: session.customer_details?.email,
                price: session.amount_total,
                notes: `Stripe Session: ${session.id} (Paid: ${session.amount_total} ${session.currency.toUpperCase()})`
            });
            console.log('[stripe-webhook] ✅ Beds24 room booking created with price');
        } catch (err) {
            console.error('[stripe-webhook] Failed to create Beds24 booking:', err.message);
        }
    } else if (metadata.beds24_booking_id) {
        // 2. For an OPTION purchase on an EXISTING booking
        try {
            const bookingId = parseInt(metadata.beds24_booking_id);
            const itemName = metadata.option_name || (metadata.option ? `Option: ${metadata.option}` : 'Optional Service');
            
            await addBeds24InvoiceItem(bookingId, {
                description: `Stripe: ${itemName}`,
                amount: session.amount_total,
                qty: 1,
                status: 'total' // ensures it counts toward the total booking value
            });
            console.log(`[stripe-webhook] ✅ Invoice item added to Beds24 booking #${bookingId}`);
        } catch (err) {
            console.error('[stripe-webhook] Failed to add invoice item to Beds24:', err.message);
        }
    }

    await sendConfirmationEmail(session, metadata);
}


/**
 * Helper to create a booking in Beds24 v2 API
 * Uses getBeds24Token() to automatically refresh the access token when needed.
 */
async function createBeds24Booking(bookingInfo) {
    const token = await getBeds24Token();

    const response = await fetch('https://api.beds24.com/v2/bookings', {
        method: 'POST',
        headers: {
            'token': token.trim(),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify([{
            roomId: parseInt(bookingInfo.roomId),
            arrival: bookingInfo.arrival,
            departure: bookingInfo.departure,
            numAdult: parseInt(bookingInfo.numAdult),
            firstName: bookingInfo.firstName,
            lastName: bookingInfo.lastName,
            email: bookingInfo.email,
            price: bookingInfo.price, // Still sent at top level
            status: 'confirmed',
            notes: bookingInfo.notes,
            // Include explicit invoice charge so LINE notifications etc. see the total correctly
            invoice: [{
                description: "Reservation Charge (Stripe)",
                amount: bookingInfo.price,
                qty: 1,
                status: 'total'
            }]
        }])
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Beds24 API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    // Beds24 v2 POST /bookings returns an array of results
    if (data && data.length > 0 && data[0].success && data[0].new?.id) {
        return data[0].new.id;
    }

    console.error('[createBeds24Booking] Unexpected response:', data);
    return null;
}

/**
 * Add an invoice item to an existing Beds24 booking
 * API v2: POST /v2/bookings/invoice
 */
async function addBeds24InvoiceItem(bookingId, invoiceItem) {
    const token = await getBeds24Token();
    const response = await fetch('https://api.beds24.com/v2/bookings/invoice', {
        method: 'POST',
        headers: {
            'token': token.trim(),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify([{
            bookingId: parseInt(bookingId),
            invoice: [invoiceItem]
        }])
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Beds24 Invoice API Error (${response.status}): ${text}`);
    }

    return await response.json();
}

/**
 * Handle expired checkout sessions
 */
async function handleCheckoutSessionExpired(session) {
    console.log('[stripe-webhook] Checkout session expired:', session.id);

    if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();

        // Update reservation status if it exists
        const { error } = await supabase
            .from('reservations')
            .update({ status: 'cancelled' })
            .eq('stripe_session_id', session.id)
            .eq('status', 'pending');

        if (error) {
            console.error('[stripe-webhook] Error updating expired session:', error);
            // Don't throw - session expiry is not critical
        }
    }
}

/**
 * Handle failed payments
 */
async function handlePaymentFailed(paymentIntent) {
    console.log('[stripe-webhook] Payment failed:', paymentIntent.id);
    console.log('[stripe-webhook] Failure reason:', paymentIntent.last_payment_error?.message);

    // TODO: Notify customer of failed payment
    // TODO: Release reserved inventory
}

/**
 * Helper to send payment notifications via Beds24 messages + host email.
 *
 * - Beds24 message: sent to guest (OTA channel) and as internal note (host)
 * - Host email: sent to ryosuke@sekaichi.org and stay@sekaichi.org via Resend
 *   (free plan: 3,000 emails/month, 100/day – more than enough for host notifications)
 *
 * Required env vars:
 *   RESEND_API_KEY  – API key from resend.com (free plan OK)
 *   BEDS24_REFRESH_TOKEN – already configured
 */
async function sendConfirmationEmail(session, metadata) {
    const customerName = session.customer_details?.name || 'Customer';
    const customerEmail = session.customer_details?.email || '';
    const amount = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: session.currency }).format(session.amount_total);
    const isOption = !!metadata.option;
    const propertyName = metadata.property_name || metadata.property || 'Japan Villas';

    // The beds24 booking id – present for stay bookings, may be absent for option-only purchases
    const beds24BookingId = metadata.beds24_booking_id
        ? parseInt(metadata.beds24_booking_id)
        : null;

    // Build message / email body texts
    let guestMessage = '';
    let internalNote = '';
    let hostEmailSubject = '';
    let hostEmailHtml = '';

    if (isOption) {
        const optionName = metadata.option_name || 'オプション';
        guestMessage = `【Japan Villas】オプション購入のご確認\n\n${customerName} 様\n\nJapan Villas をご利用いただきありがとうございます。以下のオプション購入が完了いたしました。\n\n施設: ${propertyName}\nオプション: ${optionName}\n金額: ${amount}\n\nご滞在をお楽しみくださいませ。`;
        internalNote = `[Stripe決済完了] オプション購入\nお客様名: ${customerName}\nメール: ${customerEmail}\n施設: ${propertyName}\nオプション: ${optionName}\n金額: ${amount}\nStripe Session: ${session.id}`;
        hostEmailSubject = `【決済通知】オプション購入がありました – ${propertyName} / ${optionName}`;
        hostEmailHtml = `
            <h2 style="color:#333;">【Japan Villas】オプション購入の決済が完了しました</h2>
            <table style="border-collapse:collapse; width:100%; max-width:500px; font-size:15px; color:#333;">
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">お客様名</td><td style="padding:8px; border-bottom:1px solid #eee;">${customerName}</td></tr>
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">メールアドレス</td><td style="padding:8px; border-bottom:1px solid #eee;">${customerEmail || '未取得'}</td></tr>
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">施設</td><td style="padding:8px; border-bottom:1px solid #eee;">${propertyName}</td></tr>
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">オプション</td><td style="padding:8px; border-bottom:1px solid #eee;">${optionName}</td></tr>
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">金額</td><td style="padding:8px; border-bottom:1px solid #eee; font-size:18px; color:#c0392b;"><strong>${amount}</strong></td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Stripe Session</td><td style="padding:8px; font-size:12px; color:#888;">${session.id}</td></tr>
            </table>`;
    } else {
        guestMessage = `【Japan Villas】ご予約の決済が完了しました\n\n${customerName} 様\n\nJapan Villas をご利用いただきありがとうございます。以下のご宿泊予約の決済が完了いたしました。\n\n施設: ${propertyName}\nチェックイン: ${metadata.check_in_date || '未指定'}\nチェックアウト: ${metadata.check_out_date || '未指定'}\n金額: ${amount}\n\nご来館をお待ちしております。`;
        internalNote = `[Stripe決済完了] 宿泊予約\nお客様名: ${customerName}\nメール: ${customerEmail}\n施設: ${propertyName}\nチェックイン: ${metadata.check_in_date || '未指定'}\nチェックアウト: ${metadata.check_out_date || '未指定'}\n金額: ${amount}\nStripe Session: ${session.id}`;
        hostEmailSubject = `【決済通知】宿泊予約の決済がありました – ${propertyName}`;
        hostEmailHtml = `
            <h2 style="color:#333;">【Japan Villas】宿泊予約の決済が完了しました</h2>
            <table style="border-collapse:collapse; width:100%; max-width:500px; font-size:15px; color:#333;">
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">お客様名</td><td style="padding:8px; border-bottom:1px solid #eee;">${customerName}</td></tr>
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">メールアドレス</td><td style="padding:8px; border-bottom:1px solid #eee;">${customerEmail || '未取得'}</td></tr>
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">施設</td><td style="padding:8px; border-bottom:1px solid #eee;">${propertyName}</td></tr>
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">チェックイン</td><td style="padding:8px; border-bottom:1px solid #eee;">${metadata.check_in_date || '未指定'}</td></tr>
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">チェックアウト</td><td style="padding:8px; border-bottom:1px solid #eee;">${metadata.check_out_date || '未指定'}</td></tr>
                <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">金額</td><td style="padding:8px; border-bottom:1px solid #eee; font-size:18px; color:#c0392b;"><strong>${amount}</strong></td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Stripe Session</td><td style="padding:8px; font-size:12px; color:#888;">${session.id}</td></tr>
            </table>`;
    }

    // ── 1. Beds24 message (guest notification + internal note) ─────────────────
    if (!beds24BookingId) {
        console.warn('[stripe-webhook] ⚠️ No beds24_booking_id in metadata. Skipping Beds24 message.');
        console.info('[stripe-webhook] 📋 Payment summary:\n' + internalNote);
    } else {
        try {
            const token = await getBeds24Token();
            const messages = [
                { bookingId: beds24BookingId, message: guestMessage },
                { bookingId: beds24BookingId, message: internalNote, source: 'internalNote' },
            ];

            const b24Res = await fetch('https://api.beds24.com/v2/bookings/messages', {
                method: 'POST',
                headers: { 'token': token, 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(messages),
            });
            const b24Result = await b24Res.json();

            if (b24Result.success === false) {
                console.error('[stripe-webhook] ❌ Beds24 message error:', JSON.stringify(b24Result));
            } else {
                console.log('[stripe-webhook] ✅ Beds24 messages sent.');
            }
        } catch (err) {
            console.error('[stripe-webhook] ❌ Beds24 message failed:', err.message);
        }
    }

    // ── 2. Host email notification via Resend ──────────────────────────────────
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.warn('[stripe-webhook] ⚠️ RESEND_API_KEY not set. Skipping host email notification.');
        return;
    }

    const hostRecipients = ['ryosuke@sekaichi.org', 'stay@sekaichi.org'];

    try {
        const emailRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Japan Villas <noreply@sekaichi.org>',
                to: hostRecipients,
                subject: hostEmailSubject,
                html: hostEmailHtml,
            }),
        });

        const emailResult = await emailRes.json();
        if (emailResult.id) {
            console.log('[stripe-webhook] ✅ Host notification emails sent to:', hostRecipients.join(', '));
        } else {
            console.error('[stripe-webhook] ❌ Resend API error:', JSON.stringify(emailResult));
        }
    } catch (err) {
        console.error('[stripe-webhook] ❌ Host email failed:', err.message);
    }
}

