import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let body: Record<string, string> = {};
    if (req.method === 'POST') {
      body = await req.json().catch(() => ({}));
    }

    const apiKey = Deno.env.get('NEARBLOCKS_API_KEY');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const url = body.accountId
      ? `https://api.nearblocks.io/v1/account/${body.accountId}`
      : 'https://api.nearblocks.io/v1/stats';

    const res = await fetch(url, { headers });
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
