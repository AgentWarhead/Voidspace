import { SupabaseClient } from '@supabase/supabase-js';

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('github.com')) return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') };
  } catch {
    return null;
  }
}

export async function syncGitHub(supabase: SupabaseClient) {
  let updated = 0;
  let failed = 0;
  let skipped = 0;

  const { data: projects } = await supabase
    .from('projects')
    .select('id, github_url')
    .not('github_url', 'is', null);

  if (!projects || projects.length === 0) {
    return { updated: 0, failed: 0, skipped: 0, total: 0 };
  }

  const token = process.env.GITHUB_ACCESS_TOKEN;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Voidspace',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  for (const project of projects) {
    const parsed = parseGitHubUrl(project.github_url!);
    if (!parsed) {
      skipped++;
      continue;
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
        { headers }
      );

      if (!res.ok) {
        failed++;
        continue;
      }

      const data = await res.json();

      await supabase
        .from('projects')
        .update({
          github_stars: data.stargazers_count || 0,
          last_github_commit: data.pushed_at || null,
        })
        .eq('id', project.id);

      updated++;

      // Basic rate limiting: 50ms delay between requests
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch {
      failed++;
    }
  }

  return { updated, failed, skipped, total: projects.length };
}
