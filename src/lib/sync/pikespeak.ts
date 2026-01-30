import { SupabaseClient } from '@supabase/supabase-js';

const BASE_URL = 'https://api.pikespeak.ai';

export interface PikespeakAccountBalance {
  account_id: string;
  amount: string;
  block_height: number;
}

export interface HotWallet {
  account_id: string;
  amount: number;
}

/**
 * Derive a plausible NEAR account ID from a project's data.
 */
function deriveNearAccount(project: {
  slug: string;
  raw_data: Record<string, unknown> | null;
}): string | null {
  if (project.raw_data) {
    const raw = project.raw_data;
    // Check if FastNEAR sync already identified an account
    if (
      typeof raw.fastnear === 'object' &&
      raw.fastnear !== null &&
      typeof (raw.fastnear as Record<string, unknown>).account_id === 'string'
    ) {
      return (raw.fastnear as Record<string, unknown>).account_id as string;
    }
    if (typeof raw.nearAccountId === 'string') return raw.nearAccountId;
    if (typeof raw.contract === 'string' && raw.contract.endsWith('.near')) return raw.contract;
    if (typeof raw.accountId === 'string') return raw.accountId;
  }
  return null;
}

export async function syncPikespeak(supabase: SupabaseClient) {
  const apiKey = process.env.PIKESPEAK_API_KEY;
  if (!apiKey) {
    return { enriched: 0, hotWallets: 0, error: 'PIKESPEAK_API_KEY not configured' };
  }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'x-api-key': apiKey,
  };

  let enriched = 0;
  let failed = 0;
  let skipped = 0;
  let hotWalletsCount = 0;

  // Step 1: Fetch hot wallets (most active NEAR accounts)
  try {
    const hotRes = await fetch(`${BASE_URL}/hot-wallets/near`, { headers });
    if (hotRes.ok) {
      const hotWallets: HotWallet[] = await hotRes.json();
      hotWalletsCount = Array.isArray(hotWallets) ? hotWallets.length : 0;

      // Log hot wallets data for ecosystem insight
      await supabase
        .from('sync_logs')
        .insert({
          source: 'pikespeak',
          status: 'completed',
          records_processed: hotWalletsCount,
          completed_at: new Date().toISOString(),
        });
    }
  } catch {
    // Non-fatal: hot wallets fetch is supplementary
  }

  // Step 2: Enrich projects that have a known NEAR account with balance data
  const { data: projects } = await supabase
    .from('projects')
    .select('id, slug, raw_data');

  if (!projects || projects.length === 0) {
    return { enriched: 0, hotWallets: hotWalletsCount, failed: 0, skipped: 0, total: 0 };
  }

  for (const project of projects) {
    const nearAccount = deriveNearAccount(project);
    if (!nearAccount) {
      skipped++;
      continue;
    }

    try {
      const balRes = await fetch(
        `${BASE_URL}/account/balance/${encodeURIComponent(nearAccount)}`,
        { headers }
      );

      if (!balRes.ok) {
        failed++;
        continue;
      }

      const balData = await balRes.json();

      // Merge Pikespeak enrichment into raw_data
      const existingRaw = (project.raw_data || {}) as Record<string, unknown>;
      await supabase
        .from('projects')
        .update({
          raw_data: {
            ...existingRaw,
            pikespeak: {
              account_id: nearAccount,
              balance: balData,
              synced_at: new Date().toISOString(),
            },
          },
        })
        .eq('id', project.id);

      enriched++;

      // Rate limiting: 100ms delay (Pikespeak has lower rate limits)
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch {
      failed++;
    }
  }

  return { enriched, failed, skipped, hotWallets: hotWalletsCount, total: projects.length };
}
