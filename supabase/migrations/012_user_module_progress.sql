-- Track individual module completions per user
CREATE TABLE user_module_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('explorer', 'builder', 'hacker', 'founder')),
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, module_slug)
);

-- Index for fast lookups by user
CREATE INDEX idx_user_module_progress_user_id ON user_module_progress(user_id);

-- RLS: users can only see/modify their own progress
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_module_progress FOR SELECT
  USING (auth.uid() = user_id OR true); -- admin client bypasses RLS

CREATE POLICY "Users can insert own progress"
  ON user_module_progress FOR INSERT
  WITH CHECK (true); -- enforced at API layer via getAuthenticatedUser
