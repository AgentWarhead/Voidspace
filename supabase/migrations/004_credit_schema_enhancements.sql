-- ============================================================
-- Credit Schema Enhancements
-- Add missing transaction types (refund, adjustment)
-- Update balance precision from NUMERIC(10,2) to NUMERIC(10,4)
-- ============================================================

-- Add missing enum values for credit_transaction_type
ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'refund';
ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'adjustment';

-- Update balance precision to NUMERIC(10,4) for sub-cent accuracy
ALTER TABLE credit_balances
  ALTER COLUMN subscription_credits TYPE NUMERIC(10,4),
  ALTER COLUMN topup_credits TYPE NUMERIC(10,4);
