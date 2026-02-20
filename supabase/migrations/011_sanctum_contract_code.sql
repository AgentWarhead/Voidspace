-- ============================================================
-- Sanctum Session Protection: Add contract_code column
-- Persists the current contract code alongside conversation history.
-- This enables cloud backup of generated contracts so users never
-- lose work if browser clears or they switch devices.
-- ============================================================

ALTER TABLE sanctum_conversations
  ADD COLUMN IF NOT EXISTS contract_code TEXT,
  ADD COLUMN IF NOT EXISTS contract_versions JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN sanctum_conversations.contract_code IS 'Latest generated contract code for this conversation';
COMMENT ON COLUMN sanctum_conversations.contract_versions IS 'Version history stack (last 5), each: {code, timestamp, label}';
