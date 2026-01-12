/**
 * Vercel Serverless Function: Link Reservation to User
 * 
 * This endpoint allows authenticated users to link a reservation to their account.
 * The reservation must exist and match the user's email.
 * 
 * POST /api/reservations/link
 * Headers: Authorization: Bearer <access_token>
 * Body: { sessionId: string }
 */

import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabase.js';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured()) {
        console.error('[link-reservation] Missing Supabase configuration');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get the authorization token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const accessToken = authHeader.replace('Bearer ', '');

    // Get session ID from body
    const { sessionId } = req.body;
    if (!sessionId) {
        return res.status(400).json({ error: 'Missing sessionId in request body' });
    }

    try {
        // Create a Supabase client with the user's access token
        // This respects RLS policies
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseAnonKey) {
            // Fallback: verify token and use service role
            return await linkWithServiceRole(req, res, accessToken, sessionId);
        }

        const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        });

        // Get the current user from the token
        const { data: { user }, error: userError } = await supabaseUser.auth.getUser(accessToken);

        if (userError || !user) {
            console.error('[link-reservation] Invalid token:', userError?.message);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        console.log('[link-reservation] User authenticated:', user.id, user.email);

        // Use service role to update (bypasses RLS for this specific operation)
        const supabaseAdmin = getSupabaseClient();

        // Find the reservation and verify it matches the user's email
        const { data: reservation, error: findError } = await supabaseAdmin
            .from('reservations')
            .select('id, customer_email, user_id, status')
            .eq('stripe_session_id', sessionId)
            .single();

        if (findError || !reservation) {
            console.error('[link-reservation] Reservation not found:', findError?.message);
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Check if already linked to this user
        if (reservation.user_id === user.id) {
            return res.status(200).json({
                success: true,
                message: 'Reservation already linked to your account'
            });
        }

        // Check if already linked to another user
        if (reservation.user_id && reservation.user_id !== user.id) {
            return res.status(403).json({
                error: 'Reservation is linked to another account'
            });
        }

        // Verify email matches (security check)
        if (reservation.customer_email &&
            reservation.customer_email.toLowerCase() !== user.email.toLowerCase()) {
            console.warn('[link-reservation] Email mismatch:', reservation.customer_email, user.email);
            return res.status(403).json({
                error: 'Email does not match reservation'
            });
        }

        // Link the reservation to the user
        const { error: updateError } = await supabaseAdmin
            .from('reservations')
            .update({ user_id: user.id })
            .eq('id', reservation.id);

        if (updateError) {
            console.error('[link-reservation] Update error:', updateError.message);
            return res.status(500).json({ error: 'Failed to link reservation' });
        }

        console.log('[link-reservation] ✅ Reservation linked:', reservation.id, '→', user.id);

        return res.status(200).json({
            success: true,
            message: 'Reservation linked to your account'
        });

    } catch (err) {
        console.error('[link-reservation] Error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
}

/**
 * Fallback method using service role when anon key is not available
 */
async function linkWithServiceRole(req, res, accessToken, sessionId) {
    const supabaseAdmin = getSupabaseClient();

    // Verify the token using admin client
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Find and update reservation
    const { data: reservation, error: findError } = await supabaseAdmin
        .from('reservations')
        .select('id, customer_email, user_id')
        .eq('stripe_session_id', sessionId)
        .single();

    if (findError || !reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
    }

    if (reservation.user_id === user.id) {
        return res.status(200).json({ success: true, message: 'Already linked' });
    }

    if (reservation.user_id) {
        return res.status(403).json({ error: 'Reservation linked to another account' });
    }

    if (reservation.customer_email?.toLowerCase() !== user.email.toLowerCase()) {
        return res.status(403).json({ error: 'Email does not match' });
    }

    const { error: updateError } = await supabaseAdmin
        .from('reservations')
        .update({ user_id: user.id })
        .eq('id', reservation.id);

    if (updateError) {
        return res.status(500).json({ error: 'Failed to link reservation' });
    }

    return res.status(200).json({ success: true });
}
