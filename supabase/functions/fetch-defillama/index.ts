import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const res = await fetch('https://api.llama.fi/protocols');

    if (!res.ok) {
      throw new Error(`DeFiLlama API error: ${res.status}`);
    }

    const protocols = await res.json();

    // Filter for NEAR chain protocols
    const nearProtocols = protocols
      .filter((p: any) => p.chains && p.chains.includes('Near'))
      .map((p: any) => ({
        name: p.name,
        slug: p.slug,
        tvl: p.tvl || 0,
        chains: p.chains,
        url: p.url,
        category: p.category,
        logo: p.logo,
      }));

    return new Response(JSON.stringify(nearProtocols), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
