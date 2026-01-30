import { createClient } from './supabase/client';

const supabase = createClient();

export async function fetchEcosystem() {
  const { data, error } = await supabase.functions.invoke('fetch-ecosystem');
  if (error) throw error;
  return data;
}

export async function fetchDeFiLlama() {
  const { data, error } = await supabase.functions.invoke('fetch-defillama');
  if (error) throw error;
  return data;
}

export async function fetchGitHub(owner: string, repo: string) {
  const { data, error } = await supabase.functions.invoke('fetch-github', {
    body: { owner, repo },
  });
  if (error) throw error;
  return data;
}

export async function generateBrief(opportunityId: string, userId: string) {
  const { data, error } = await supabase.functions.invoke('generate-brief', {
    body: { opportunityId, userId },
  });
  if (error) throw error;
  return data;
}
