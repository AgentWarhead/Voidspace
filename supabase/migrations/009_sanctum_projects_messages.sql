-- Migration: Add messages and persona columns to sanctum_projects
-- These fields allow full conversation context to be stored alongside code

-- Create table if not already present (idempotent)
CREATE TABLE IF NOT EXISTS sanctum_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  code TEXT NOT NULL DEFAULT '',
  mode TEXT DEFAULT 'build',
  version INTEGER DEFAULT 1,
  concepts_learned JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns (safe to run even if already added)
ALTER TABLE sanctum_projects
  ADD COLUMN IF NOT EXISTS messages JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS persona TEXT NOT NULL DEFAULT '';

-- Ensure index exists
CREATE INDEX IF NOT EXISTS idx_sanctum_projects_user ON sanctum_projects(user_id);
