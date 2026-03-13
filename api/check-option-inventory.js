/**
 * Vercel Serverless Function: /api/check-option-inventory
 *
 * Checks if a specific option (e.g. BBQ) is still available for a given stay period.
 * Used before initiating Stripe checkout to prevent overbooking.
 *
 * GET /api/check-option-inventory?option=bbq&property=lake-side-inn&arrival=2025-07-01&departure=2025-07-03
 *
 * Returns:
 *   { available: true, remaining: 1, max: 2 }
 *   { available: false, remaining: 0, max: 2 }
 */

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';

// Inventory limits: Options and Room IDs
const INVENTORY_LIMITS = {
    // Options
    'bbq': 2,       // Lake Side Inn has 2 BBQ sets
    'jacuzzi': 1,   // Lake House has 1 Jacuzzi
    // Room IDs
    '557549': 1,    // Mountain Villa Niseko
    '557548': 1,    // Lake House Nojiriko
    '586803': 4     // Lake Side Inn Nojiriko (4 rooms)
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { option, property, arrival, departure } = req.query;

    if (!option || !property || !arrival || !departure) {
        return res.status(400).json({ error: 'Missing required params: option, property, arrival, departure' });
    }

    const maxInventory = INVENTORY_LIMITS[option.toLowerCase()];
    if (maxInventory === undefined) {
        return res.status(200).json({ available: true, remaining: null, max: null });
    }

    if (!isSupabaseConfigured()) {
        console.warn('[check-option-inventory] Supabase not configured');
        return res.status(200).json({ available: true, remaining: maxInventory, max: maxInventory });
    }

    try {
        const supabase = getSupabaseClient();
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

        // 1. Paid reservations
        const { count: paidCount, error: paidError } = await supabase
            .from('reservations')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'paid')
            .contains('metadata', { property: property, option: option })
            .lt('check_in_date', departure)
            .gt('check_out_date', arrival);

        // 2. Pending reservations (within last 10 minutes)
        const { count: pendingCount, error: pendingError } = await supabase
            .from('reservations')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')
            .gt('created_at', tenMinutesAgo)
            .contains('metadata', { property: property, option: option })
            .lt('check_in_date', departure)
            .gt('check_out_date', arrival);

        if (paidError || pendingError) {
            console.error('[check-option-inventory] Supabase query error:', paidError || pendingError);
            return res.status(200).json({ available: true, remaining: maxInventory, max: maxInventory });
        }

        const booked = (paidCount || 0) + (pendingCount || 0);
        const remaining = Math.max(0, maxInventory - booked);
        const available = remaining > 0;

        console.log(`[check-option-inventory] option=${option} property=${property} arrival=${arrival} departure=${departure} | booked=${booked} (paid=${paidCount}, pending=${pendingCount}) / max=${maxInventory} → available=${available}`);

        return res.status(200).json({ available, remaining, max: maxInventory, booked });

    } catch (err) {
        console.error('[check-option-inventory] Unexpected error:', err.message);
        return res.status(200).json({ available: true, remaining: maxInventory, max: maxInventory });
    }
}
