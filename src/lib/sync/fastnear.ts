import { SupabaseClient } from '@supabase/supabase-js';

const BASE_URL = 'https://api.fastnear.com';

interface FastNearAccountState {
  balance: string;
  locked: string;
  storage_bytes: number;
}

interface FastNearFullResponse {
  pools?: { pool_id: string; last_update_block_height: number | null }[];
  tokens?: { contract_id: string; balance: string; last_update_block_height: number | null }[];
  nfts?: { contract_id: string; last_update_block_height: number | null }[];
  state?: FastNearAccountState;
}

/**
 * Derive a plausible NEAR account ID from a project's data.
 * Checks raw ecosystem data for `nearAccountId` or well-known patterns.
 */
function deriveNearAccount(project: {
  slug: string;
  name: string;
  website_url: string | null;
  raw_data: Record<string, unknown> | null;
}): string | null {
  // Check raw_data for explicit NEAR account
  if (project.raw_data) {
    const raw = project.raw_data;
    if (typeof raw.nearAccountId === 'string') return raw.nearAccountId;
    if (typeof raw.contract === 'string' && raw.contract.endsWith('.near')) return raw.contract;
    if (typeof raw.accountId === 'string') return raw.accountId;
  }

  // Try well-known slug → account mappings for major NEAR protocols
  const knownAccounts: Record<string, string> = {
    'ref-finance': 'v2.ref-finance.near',
    'burrow': 'contract.main.burrow.near',
    'meta-pool': 'meta-pool.near',
    'linear-protocol': 'linear-protocol.near',
    'aurora': 'aurora',
    'sweat-economy': 'sweat_welcome.near',
    'paras': 'x.paras.near',
    'mintbase': 'mintbase1.near',
    'near-social': 'social.near',
    'keypom': 'v2.keypom.near',
    'here-wallet': 'here.storage.near',
    'sender-wallet': 'sender.near',
    'hot-wallet': 'game.hot.tg',
    'bitte-wallet': 'bitte.near',
  };

  return knownAccounts[project.slug] || null;
}

export async function syncFastNear(supabase: SupabaseClient) {
  let enriched = 0;
  let failed = 0;
  let skipped = 0;

  const { data: projects } = await supabase
    .from('projects')
    .select('id, slug, name, website_url, raw_data');

  if (!projects || projects.length === 0) {
    return { enriched: 0, failed: 0, skipped: 0, total: 0 };
  }

  for (const project of projects) {
    const nearAccount = deriveNearAccount(project);
    if (!nearAccount) {
      skipped++;
      continue;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/v1/account/${encodeURIComponent(nearAccount)}/full`,
        {
          headers: { 'Accept': 'application/json' },
        }
      );

      if (!res.ok) {
        failed++;
        continue;
      }

      const data: FastNearFullResponse = await res.json();

      // Merge FastNEAR enrichment into raw_data
      const existingRaw = (project.raw_data || {}) as Record<string, unknown>;
      const nearBalance = data.state?.balance
        ? (Number(data.state.balance) / 1e24) // Convert yoctoNEAR to NEAR
        : null;

      await supabase
        .from('projects')
        .update({
          raw_data: {
            ...existingRaw,
            fastnear: {
              account_id: nearAccount,
              balance_near: nearBalance,
              storage_bytes: data.state?.storage_bytes || 0,
              ft_count: data.tokens?.length || 0,
              nft_count: data.nfts?.length || 0,
              staking_pools: data.pools?.length || 0,
              synced_at: new Date().toISOString(),
            },
          },
        })
        .eq('id', project.id);

      enriched++;

      // Rate limiting: 30ms delay between requests
      await new Promise((resolve) => setTimeout(resolve, 30));
    } catch {
      failed++;
    }
  }

  return { enriched, failed, skipped, total: projects.length };
}
