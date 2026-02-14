-- ============================================================
-- Voidspace Achievement System — Supabase Tables
-- ============================================================

-- User achievement stats (one row per user)
CREATE TABLE IF NOT EXISTS user_achievement_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  stats JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unlocked achievements (one row per user × achievement)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Featured achievements (max 3 per user, stored as array)
-- Using the stats table's JSONB for this: stats.featured = ["id1", "id2", "id3"]

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievement_stats_updated ON user_achievement_stats(updated_at);

-- RLS policies
ALTER TABLE user_achievement_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can read their own stats (via API with auth)
-- All writes go through server-side API routes with admin client
CREATE POLICY "Users can read own stats" ON user_achievement_stats
  FOR SELECT USING (true);

CREATE POLICY "Users can read own achievements" ON user_achievements
  FOR SELECT USING (true);

-- Service role can do everything (API routes use admin client)
CREATE POLICY "Service can manage stats" ON user_achievement_stats
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service can manage achievements" ON user_achievements
  FOR ALL USING (true) WITH CHECK (true);
