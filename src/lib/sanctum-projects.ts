/**
 * Sanctum Projects — Supabase CRUD operations
 * 
 * SQL to create the table (run manually in Supabase SQL editor):
 * 
 * CREATE TABLE sanctum_projects (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id TEXT NOT NULL,              -- NEAR wallet address
 *   name TEXT NOT NULL,
 *   description TEXT,
 *   category TEXT,
 *   code TEXT NOT NULL,
 *   mode TEXT DEFAULT 'learn',
 *   version INTEGER DEFAULT 1,
 *   concepts_learned JSONB DEFAULT '[]',
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_sanctum_projects_user ON sanctum_projects(user_id);
 */

import { createAdminClient } from '@/lib/supabase/admin';

export interface SanctumProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  code: string;
  mode: string;
  version: number;
  concepts_learned: string[];
  messages: Array<{ role: string; content: string }>;
  persona: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  user_id: string;
  name: string;
  description?: string;
  category?: string;
  code: string;
  mode?: string;
  concepts_learned?: string[];
  messages?: Array<{ role: string; content: string }>;
  persona?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  category?: string;
  code?: string;
  mode?: string;
  concepts_learned?: string[];
  messages?: Array<{ role: string; content: string }>;
  persona?: string;
}

export async function listProjects(userId: string): Promise<SanctumProject[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sanctum_projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error listing projects:', error);
    return [];
  }
  return (data || []) as SanctumProject[];
}

export async function createProject(input: CreateProjectInput): Promise<SanctumProject | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sanctum_projects')
    .insert({
      user_id: input.user_id,
      name: input.name,
      description: input.description || null,
      category: input.category || null,
      code: input.code,
      mode: input.mode || 'build',
      concepts_learned: input.concepts_learned || [],
      messages: input.messages || [],
      persona: input.persona || '',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  return data as SanctumProject;
}

export async function updateProject(
  projectId: string,
  userId: string,
  input: UpdateProjectInput
): Promise<SanctumProject | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sanctum_projects')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
      version: undefined, // will use SQL increment below
    })
    .eq('id', projectId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  // Increment version
  await supabase.rpc('increment_sanctum_version', { project_id: projectId }).catch(() => {
    // If RPC doesn't exist, that's ok — version stays
  });

  return data as SanctumProject;
}

export async function deleteProject(projectId: string, userId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('sanctum_projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  return true;
}

export async function getProject(projectId: string, userId: string): Promise<SanctumProject | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sanctum_projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error getting project:', error);
    return null;
  }
  return data as SanctumProject;
}
