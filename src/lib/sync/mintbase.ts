import { SupabaseClient } from '@supabase/supabase-js';

const GRAPHQL_URL = 'https://graph.mintbase.xyz/mainnet';
const API_KEY = process.env.MINTBASE_API_KEY ?? '';

interface MintbaseStore {
  id: string;
  name: string;
  owner: string;
  minted_count: number;
  listed_count: number;
}

interface MintbaseEcosystemStats {
  totalStores: number;
  totalListings: number;
  totalTokens: number;
}

async function graphqlQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  // Add timeout to prevent hanging if API is unresponsive
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'mb-api-key': API_KEY,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Mintbase GraphQL error: ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      throw new Error(`Mintbase GraphQL: ${json.errors[0]?.message || 'Unknown error'}`);
    }

    return json.data as T;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Mintbase API timeout (10s)');
    }
    throw err;
  }
}

/**
 * Fetch aggregate NFT ecosystem stats from Mintbase.
 */
async function fetchEcosystemStats(): Promise<MintbaseEcosystemStats> {
  const data = await graphqlQuery<{
    nft_contracts_aggregate: { aggregate: { count: number } };
    nft_listings_aggregate: { aggregate: { count: number } };
    nft_tokens_aggregate: { aggregate: { count: number } };
  }>(`
    query {
      nft_contracts_aggregate {
        aggregate { count }
      }
      nft_listings_aggregate(where: { unlisted_at: { _is_null: true } }) {
        aggregate { count }
      }
      nft_tokens_aggregate(where: { burned_timestamp: { _is_null: true } }) {
        aggregate { count }
      }
    }
  `);

  return {
    totalStores: data.nft_contracts_aggregate?.aggregate?.count || 0,
    totalListings: data.nft_listings_aggregate?.aggregate?.count || 0,
    totalTokens: data.nft_tokens_aggregate?.aggregate?.count || 0,
  };
}

/**
 * Fetch top stores from Mintbase for project enrichment.
 */
async function fetchTopStores(): Promise<MintbaseStore[]> {
  const data = await graphqlQuery<{
    nft_contracts: MintbaseStore[];
  }>(`
    query {
      nft_contracts(limit: 100, order_by: { id: asc }) {
        id
        name
        owner
      }
    }
  `);

  return data.nft_contracts || [];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function syncMintbase(supabase: SupabaseClient) {
  let enriched = 0;
  let failed = 0;
  let skipped = 0;
  let ecosystemStats: MintbaseEcosystemStats = { totalStores: 0, totalListings: 0, totalTokens: 0 };

  try {
    // Step 1: Fetch ecosystem-wide NFT stats
    ecosystemStats = await fetchEcosystemStats();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // Return gracefully with status indicating API unavailable
    return {
      enriched: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      ecosystemStats,
      status: 'api_unavailable',
      error: message,
    };
  }

  // Step 2: Fetch Mintbase stores for matching
  let stores: MintbaseStore[] = [];
  try {
    stores = await fetchTopStores();
  } catch {
    // Continue without store matching — we still have ecosystem stats
  }

  // Step 3: Fetch projects in NFT category for enrichment
  const { data: nftCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'nfts')
    .single();

  if (!nftCategory) {
    return { enriched: 0, failed: 0, skipped: 0, total: 0, ecosystemStats, error: 'NFT category not found' };
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('id, slug, name, raw_data')
    .eq('category_id', nftCategory.id);

  if (!projects || projects.length === 0) {
    return { enriched: 0, failed: 0, skipped: 0, total: 0, ecosystemStats };
  }

  // Step 4: Try to match projects to Mintbase stores
  for (const project of projects) {
    const projSlug = project.slug.toLowerCase();
    const projName = project.name.toLowerCase();

    // Try to find a matching Mintbase store
    const matchedStore = stores.find((s) => {
      const storeName = (s.name || '').toLowerCase();
      const storeSlug = slugify(s.name || '');
      const storeId = (s.id || '').toLowerCase();
      return (
        storeSlug === projSlug ||
        storeName === projName ||
        storeId.includes(projSlug) ||
        projSlug.includes(storeSlug)
      );
    });

    if (!matchedStore) {
      skipped++;
      continue;
    }

    try {
      const existingRaw = (project.raw_data || {}) as Record<string, unknown>;
      await supabase
        .from('projects')
        .update({
          raw_data: {
            ...existingRaw,
            mintbase: {
              store_id: matchedStore.id,
              store_name: matchedStore.name,
              owner: matchedStore.owner,
              ecosystem_total_stores: ecosystemStats.totalStores,
              ecosystem_active_listings: ecosystemStats.totalListings,
              ecosystem_total_tokens: ecosystemStats.totalTokens,
              synced_at: new Date().toISOString(),
            },
          },
        })
        .eq('id', project.id);

      enriched++;

      // Rate limiting: 30ms delay
      await new Promise((resolve) => setTimeout(resolve, 30));
    } catch {
      failed++;
    }
  }

  return { enriched, failed, skipped, total: projects.length, ecosystemStats };
}
