-- Add preferred_model column to credit_balances for storing user's AI model preference
ALTER TABLE credit_balances ADD COLUMN IF NOT EXISTS preferred_model TEXT DEFAULT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN credit_balances.preferred_model IS 'User preferred AI model ID (e.g. claude-sonnet-4-6, claude-opus-4-6). NULL = use tier default.';
