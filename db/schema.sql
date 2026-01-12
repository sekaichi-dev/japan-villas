-- =====================================================
-- Supabase SQL Schema: Reservations Table
-- =====================================================
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Stripe identifiers
    stripe_session_id TEXT UNIQUE NOT NULL,
    stripe_payment_intent_id TEXT,
    
    -- Payment details
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'jpy',
    
    -- Reservation status
    -- pending: checkout started but not completed
    -- paid: payment confirmed via webhook
    -- confirmed: booking created in external system (e.g., Beds24)
    -- cancelled: reservation cancelled
    -- refunded: payment refunded
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'paid', 'confirmed', 'cancelled', 'refunded')),
    
    -- Customer info (from Stripe checkout)
    customer_email TEXT,
    customer_name TEXT,
    
    -- Booking details (to be populated from frontend/Beds24)
    property_name TEXT,
    check_in_date DATE,
    check_out_date DATE,
    guests INTEGER,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on stripe_session_id for fast lookups (webhook idempotency)
CREATE INDEX IF NOT EXISTS idx_reservations_stripe_session_id 
    ON reservations(stripe_session_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_reservations_status 
    ON reservations(status);

-- Create index on customer_email for future user lookups
CREATE INDEX IF NOT EXISTS idx_reservations_customer_email 
    ON reservations(customer_email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS) - Prepare for future auth
-- =====================================================
-- Enable RLS on the table
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS, so webhook can still insert
-- When we add user auth, we'll add policies like:
-- CREATE POLICY "Users can view own reservations" 
--     ON reservations FOR SELECT 
--     USING (auth.email() = customer_email);

-- =====================================================
-- Comments for documentation
-- =====================================================
COMMENT ON TABLE reservations IS 'Stores confirmed Stripe payments and booking reservations';
COMMENT ON COLUMN reservations.stripe_session_id IS 'Unique Stripe Checkout Session ID - used for idempotency';
COMMENT ON COLUMN reservations.status IS 'Reservation lifecycle: pending → paid → confirmed → cancelled/refunded';
