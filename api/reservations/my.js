/**
 * Vercel Serverless Function: Get User's Reservations
 * 
 * This endpoint returns all reservations for the authenticated user.
 * Uses RLS policies to ensure users only see their own data.
 * 
 * GET /api/reservations/my
 * Headers: Authorization: Bearer <access_token>
 */

import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabase.js';

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured()) {
        console.error('[my-reservations] Missing Supabase configuration');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get the authorization token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const accessToken = authHeader.replace('Bearer ', '');

    try {
        const supabase = getSupabaseClient();

        // Verify the token and get user
        const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

        if (userError || !user) {
            console.error('[my-reservations] Invalid token:', userError?.message);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        console.log('[my-reservations] Fetching for user:', user.id, user.email);

        // Fetch reservations linked to this user OR matching their email
        const { data: reservations, error: queryError } = await supabase
            .from('reservations')
            .select(`
                id,
                stripe_session_id,
                amount,
                currency,
                status,
                customer_email,
                customer_name,
                property_name,
                check_in_date,
                check_out_date,
                guests,
                created_at,
                updated_at
            `)
            .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
            .order('created_at', { ascending: false });

        if (queryError) {
            console.error('[my-reservations] Query error:', queryError.message);
            return res.status(500).json({ error: 'Failed to fetch reservations' });
        }

        console.log('[my-reservations] Found', reservations.length, 'reservations');

        // Transform to camelCase for frontend
        const transformedReservations = reservations.map(r => ({
            id: r.id,
            stripeSessionId: r.stripe_session_id,
            amount: r.amount,
            currency: r.currency,
            status: r.status,
            customerEmail: r.customer_email,
            customerName: r.customer_name,
            propertyName: r.property_name,
            checkInDate: r.check_in_date,
            checkOutDate: r.check_out_date,
            guests: r.guests,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
        }));

        return res.status(200).json({
            reservations: transformedReservations,
            count: transformedReservations.length
        });

    } catch (err) {
        console.error('[my-reservations] Error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
}
