-- ============================================================
-- Sanctum Conversation History (server-side persistence)
-- Paid users (Specter+) get cloud-saved conversations.
-- Free users use localStorage only.
-- ============================================================

-- Conversations table (one per project session)
CREATE TABLE IF NOT EXISTS sanctum_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES sanctum_projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Session',
  category TEXT,
  persona TEXT DEFAULT 'shade',
  mode TEXT DEFAULT 'learn',
  message_count INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages table (individual chat messages)
CREATE TABLE IF NOT EXISTS sanctum_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES sanctum_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_conversations_user ON sanctum_conversations(user_id, updated_at DESC);
CREATE INDEX idx_messages_conversation ON sanctum_messages(conversation_id, created_at ASC);

-- RLS
ALTER TABLE sanctum_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanctum_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own conversations
CREATE POLICY "Users read own conversations"
  ON sanctum_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own conversations"
  ON sanctum_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own conversations"
  ON sanctum_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own conversations"
  ON sanctum_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Messages inherit access through conversation ownership
CREATE POLICY "Users read own messages"
  ON sanctum_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM sanctum_conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own messages"
  ON sanctum_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM sanctum_conversations WHERE user_id = auth.uid()
    )
  );
