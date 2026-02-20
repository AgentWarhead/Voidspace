-- AI-generated enrichment data per void (persona targeting, build angles, vision, revenue model)
-- Cached per opportunity, auto-expires after 7 days via updated_at check in API

CREATE TABLE IF NOT EXISTS void_enrichments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(opportunity_id)
);

-- Fast lookup by void ID
CREATE INDEX IF NOT EXISTS idx_void_enrichments_opportunity_id ON void_enrichments(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_void_enrichments_updated_at ON void_enrichments(updated_at);

-- No RLS needed — this is public read, admin write only
