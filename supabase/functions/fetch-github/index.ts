import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { owner, repo } = await req.json();

    if (!owner || !repo) {
      return new Response(
        JSON.stringify({ error: 'owner and repo are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = Deno.env.get('GITHUB_ACCESS_TOKEN');
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Voidspace',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    if (!repoRes.ok) {
      return new Response(
        JSON.stringify({ error: `GitHub API error: ${repoRes.status}` }),
        { status: repoRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const repoData = await repoRes.json();

    return new Response(JSON.stringify({
      name: repoData.full_name,
      stars: repoData.stargazers_count,
      description: repoData.description,
      language: repoData.language,
      updated_at: repoData.updated_at,
      pushed_at: repoData.pushed_at,
      forks: repoData.forks_count,
      open_issues: repoData.open_issues_count,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
