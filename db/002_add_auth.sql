-- =====================================================
-- Supabase SQL Migration: Add User Authentication
-- =====================================================
-- Run this in Supabase SQL Editor AFTER the initial schema.sql
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
-- =====================================================

-- Add user_id column to reservations table
-- Nullable because reservations may be created before user logs in
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for efficient user-based queries
CREATE INDEX IF NOT EXISTS idx_reservations_user_id 
    ON reservations(user_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- First, ensure RLS is enabled (idempotent)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for clean migration)
DROP POLICY IF EXISTS "Users can view own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can update own reservations" ON reservations;
DROP POLICY IF EXISTS "Service role can do anything" ON reservations;

-- Policy: Users can only SELECT their own reservations
-- Uses auth.uid() which returns the current user's ID from the JWT
CREATE POLICY "Users can view own reservations"
    ON reservations
    FOR SELECT
    USING (
        -- User can see reservations linked to their account
        auth.uid() = user_id
        -- OR reservations matching their email (for pre-login reservations)
        OR auth.email() = customer_email
    );

-- Policy: Users can UPDATE their own reservations (limited)
-- This allows linking a reservation to their account
CREATE POLICY "Users can update own reservations"
    ON reservations
    FOR UPDATE
    USING (
        -- Can only update if email matches (for claiming reservations)
        auth.email() = customer_email
        -- OR already linked to their account
        OR auth.uid() = user_id
    )
    WITH CHECK (
        -- Can only set user_id to their own ID
        user_id = auth.uid()
    );

-- =====================================================
-- Note: Service Role Key bypasses RLS entirely
-- The webhook uses service_role key, so it can INSERT without policies
-- =====================================================

-- =====================================================
-- Additional helpful views/functions
-- =====================================================

-- Function to get current user's reservations count
CREATE OR REPLACE FUNCTION get_my_reservations_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM reservations 
        WHERE user_id = auth.uid() 
           OR customer_email = auth.email()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON COLUMN reservations.user_id IS 'References auth.users - nullable for guest checkouts, can be linked later';
COMMENT ON POLICY "Users can view own reservations" ON reservations IS 'RLS: Users see only their reservations (by user_id or email match)';
