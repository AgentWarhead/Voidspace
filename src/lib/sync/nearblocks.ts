import { SupabaseClient } from '@supabase/supabase-js';

export interface ChainStats {
  totalTransactions: number;
  totalAccounts: number;
  blockHeight: number;
  nodesOnline: number;
  avgBlockTime: number;
}

export async function syncNearBlocks(supabase: SupabaseClient): Promise<{
  chainStats: ChainStats | null;
  error: string | null;
}> {
  const apiKey = process.env.NEARBLOCKS_API_KEY;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const res = await fetch('https://api.nearblocks.io/v1/stats', { headers });

    if (!res.ok) {
      return { chainStats: null, error: `NearBlocks API returned ${res.status}` };
    }

    const data = await res.json();
    const stats = data.stats?.[0] || data;

    const chainStats: ChainStats = {
      totalTransactions: Number(stats.total_txns || stats.totalTransactions || 0),
      totalAccounts: Number(stats.total_accounts || stats.totalAccounts || 0),
      blockHeight: Number(stats.block_height || stats.blockHeight || 0),
      nodesOnline: Number(stats.nodes_online || stats.nodesOnline || 0),
      avgBlockTime: Number(stats.avg_block_time || stats.avgBlockTime || 0),
    };

    // Log the sync
    await supabase
      .from('sync_logs')
      .insert({
        source: 'nearblocks',
        status: 'completed',
        records_processed: 1,
        completed_at: new Date().toISOString(),
      });

    return { chainStats, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { chainStats: null, error: message };
  }
}

/**
 * Fetch NEAR chain stats directly from NearBlocks API.
 * Used by dashboard queries for real-time chain data display.
 */
export async function fetchChainStats(): Promise<ChainStats | null> {
  const apiKey = process.env.NEARBLOCKS_API_KEY;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const res = await fetch('https://api.nearblocks.io/v1/stats', {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) return null;

    const data = await res.json();
    const stats = data.stats?.[0] || data;

    return {
      totalTransactions: Number(stats.total_txns || stats.totalTransactions || 0),
      totalAccounts: Number(stats.total_accounts || stats.totalAccounts || 0),
      blockHeight: Number(stats.block_height || stats.blockHeight || 0),
      nodesOnline: Number(stats.nodes_online || stats.nodesOnline || 0),
      avgBlockTime: Number(stats.avg_block_time || stats.avgBlockTime || 0),
    };
  } catch {
    return null;
  }
}
