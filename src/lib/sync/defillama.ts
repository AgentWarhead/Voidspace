import { SupabaseClient } from '@supabase/supabase-js';

interface DeFiLlamaProtocol {
  name: string;
  slug: string;
  tvl: number;
  chains: string[];
  url?: string;
  category?: string;
  logo?: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function syncDeFiLlama(supabase: SupabaseClient) {
  let matched = 0;
  let unmatched = 0;
  let totalTVL = 0;

  // Fetch DeFiLlama data directly
  const res = await fetch('https://api.llama.fi/protocols');
  if (!res.ok) {
    throw new Error(`DeFiLlama API error: ${res.status}`);
  }

  const allProtocols: DeFiLlamaProtocol[] = await res.json();
  const nearProtocols = allProtocols
    .filter((p) => p.chains && p.chains.includes('Near'))
    .map((p) => ({
      name: p.name,
      slug: p.slug,
      tvl: p.tvl || 0,
      chains: p.chains,
      url: p.url,
      category: p.category,
      logo: p.logo,
    }));

  // Fetch all existing projects
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, slug');

  if (!projects) return { matched: 0, unmatched: nearProtocols.length, totalTVL: 0 };

  // Try to match each protocol to a project
  for (const protocol of nearProtocols) {
    const protoSlug = slugify(protocol.name);
    const protoNameLower = protocol.name.toLowerCase();

    const match = projects.find((p) => {
      const pSlug = p.slug.toLowerCase();
      const pName = p.name.toLowerCase();
      return (
        pSlug === protoSlug ||
        pSlug === protocol.slug ||
        pName === protoNameLower ||
        pSlug.includes(protoSlug) ||
        protoSlug.includes(pSlug)
      );
    });

    if (match) {
      const { error } = await supabase
        .from('projects')
        .update({ tvl_usd: protocol.tvl })
        .eq('id', match.id);

      if (!error) {
        matched++;
        totalTVL += protocol.tvl;
      }
    } else {
      unmatched++;
    }
  }

  return { matched, unmatched, totalTVL, nearProtocolCount: nearProtocols.length };
}
