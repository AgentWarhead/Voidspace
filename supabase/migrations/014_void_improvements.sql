-- ============================================================
-- Migration 014: Void Engine Credibility Overhaul
-- ============================================================

-- evidence_projects: the real NEAR projects Claude analyzed to identify this void
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS evidence_projects TEXT[] DEFAULT '{}';

-- void_confidence: Claude's self-rated confidence score 1-10 that this gap is real
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS void_confidence INT DEFAULT 5;

-- void_status: lifecycle tracking
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS void_status TEXT DEFAULT 'active' CHECK (void_status IN ('active', 'filling', 'filled', 'flagged'));

-- stable_id: hash of category+title for upsert-based syncing (no more delete-all)
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS stable_id TEXT UNIQUE;

-- updated_at: track when a void was last refreshed by the sync
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_opportunities_stable_id ON opportunities(stable_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_void_status ON opportunities(void_status);

-- ============================================================
-- Tier 4: Community void flagging
-- ============================================================

CREATE TABLE IF NOT EXISTS void_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  flagged_by TEXT NOT NULL,  -- wallet address
  project_name TEXT,          -- "This void is already filled by X"
  project_url TEXT,
  note TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_void_flags_opportunity ON void_flags(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_void_flags_status ON void_flags(status);
