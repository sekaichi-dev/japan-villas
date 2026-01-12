/**
 * Supabase Client - Server-side only
 * 
 * This module initializes the Supabase client for use in Vercel Serverless Functions.
 * Uses the Service Role key which bypasses Row Level Security (RLS).
 * 
 * SECURITY:
 * - This file should ONLY be imported in server-side code (api/ functions)
 * - NEVER import this in client-side code
 * - Service Role key has full database access - keep it secret
 */

import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

/**
 * Get or create Supabase client instance (singleton pattern)
 * Uses lazy initialization to avoid issues during import
 */
export function getSupabaseClient() {
    if (supabaseClient) {
        return supabaseClient;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        throw new Error('Missing SUPABASE_URL environment variable');
    }

    if (!supabaseServiceKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }

    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            // Disable auto-refresh since we're using service role
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return supabaseClient;
}

/**
 * Helper to check if Supabase is properly configured
 */
export function isSupabaseConfigured() {
    return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
