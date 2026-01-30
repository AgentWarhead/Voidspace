-- ============================================================
-- Voidspace Initial Schema
-- Run this in the Supabase Dashboard SQL Editor
-- ============================================================

-- 1. TABLES
-- ============================================================

-- Categories (seed data)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_strategic BOOLEAN DEFAULT false,
  strategic_multiplier DECIMAL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (synced from APIs)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  website_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  logo_url TEXT,
  tvl_usd DECIMAL DEFAULT 0,
  github_stars INTEGER DEFAULT 0,
  last_github_commit TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities (calculated gaps)
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  gap_score INTEGER NOT NULL,
  demand_score DECIMAL,
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  reasoning TEXT,
  suggested_features JSONB,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (NEAR wallet linked)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  near_account_id TEXT UNIQUE NOT NULL,
  email TEXT,
  tier TEXT DEFAULT 'shade' CHECK (tier IN ('shade', 'specter', 'legion', 'leviathan')),
  xp_points INTEGER DEFAULT 0,
  badges JSONB DEFAULT '["shade"]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'shade' CHECK (tier IN ('shade', 'specter', 'legion', 'leviathan')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  near_payment_tx TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('brief_generated', 'brief_preview', 'export')),
  opportunity_id UUID REFERENCES opportunities(id),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved opportunities
CREATE TABLE saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'researching', 'building', 'launched')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- Project briefs (AI-generated, cached)
CREATE TABLE project_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync logs
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 2. INDEXES
-- ============================================================

CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_active ON projects(is_active);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_opportunities_gap_score ON opportunities(gap_score DESC);
CREATE INDEX idx_opportunities_category ON opportunities(category_id);
CREATE INDEX idx_users_near_account ON users(near_account_id);
CREATE INDEX idx_usage_user_month ON usage(user_id, created_at);
CREATE INDEX idx_saved_user ON saved_opportunities(user_id);
CREATE INDEX idx_sync_logs_source ON sync_logs(source, started_at DESC);

-- 3. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Public read policies (app uses NEAR wallet auth, not Supabase Auth)
-- Writes go through API routes using service_role key
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Public read subscriptions" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Public read usage" ON usage FOR SELECT USING (true);
CREATE POLICY "Public read saved_opportunities" ON saved_opportunities FOR SELECT USING (true);
CREATE POLICY "Public read project_briefs" ON project_briefs FOR SELECT USING (true);
CREATE POLICY "Public read sync_logs" ON sync_logs FOR SELECT USING (true);

-- 4. UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. SEED DATA
-- ============================================================

INSERT INTO categories (name, slug, description, icon, is_strategic, strategic_multiplier) VALUES
  ('AI & Agents', 'ai-agents', 'AI agents, inference, autonomous systems leveraging Shade Agents', '🤖', true, 2.0),
  ('Privacy', 'privacy', 'Private transactions, identity protection, ZK proofs', '🔒', true, 2.0),
  ('Intents & Chain Abstraction', 'intents', 'Intent solvers, cross-chain operations, account abstraction', '🔗', true, 2.0),
  ('Real World Assets', 'rwa', 'Oracles, RWA tokenization, payments, real-world bridges', '🌍', true, 2.0),
  ('DeFi', 'defi', 'DEX, lending, stablecoins, yield aggregators, derivatives', '💰', false, 1.0),
  ('Infrastructure', 'infrastructure', 'Wallets, explorers, RPC nodes, indexers, dev tools', '🔧', false, 1.0),
  ('Consumer & Social', 'consumer', 'Social apps, gaming, NFT marketplaces, DAOs, creator tools', '👥', false, 1.0);
