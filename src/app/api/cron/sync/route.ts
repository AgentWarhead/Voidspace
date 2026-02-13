import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { syncEcosystem } from '@/lib/sync/ecosystem';
import { syncDeFiLlama } from '@/lib/sync/defillama';
import { generateOpportunities } from '@/lib/sync/opportunities';
import { syncGitHub } from '@/lib/sync/github';
import { syncNearBlocks } from '@/lib/sync/nearblocks';
import { syncFastNear } from '@/lib/sync/fastnear';
import { syncPikespeak } from '@/lib/sync/pikespeak';
import { syncMintbase } from '@/lib/sync/mintbase';
import { syncAstroDAO } from '@/lib/sync/astrodao';

// 20 categories — same as /api/sync
const CATEGORIES = [
  { name: 'AI & Agents', slug: 'ai-agents', description: 'AI agents, inference, autonomous systems leveraging Shade Agents', icon: '🤖', is_strategic: true, strategic_multiplier: 2.0 },
  { name: 'Privacy', slug: 'privacy', description: 'Private transactions, identity protection, ZK proofs', icon: '🔒', is_strategic: true, strategic_multiplier: 2.0 },
  { name: 'Intents & Chain Abstraction', slug: 'intents', description: 'Intent solvers, cross-chain operations, account abstraction', icon: '🔗', is_strategic: true, strategic_multiplier: 2.0 },
  { name: 'Real World Assets', slug: 'rwa', description: 'Oracles, RWA tokenization, payments, real-world bridges', icon: '🌍', is_strategic: true, strategic_multiplier: 2.0 },
  { name: 'Data & Analytics', slug: 'data-analytics', description: 'On-chain analytics, data indexing, blockchain intelligence', icon: '📊', is_strategic: true, strategic_multiplier: 1.5 },
  { name: 'DeFi', slug: 'defi', description: 'Lending, borrowing, yield aggregation, derivatives, stablecoins', icon: '💰', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'DEX & Trading', slug: 'dex-trading', description: 'Decentralized exchanges, AMMs, order books, trading tools', icon: '📈', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Gaming & Metaverse', slug: 'gaming', description: 'Blockchain games, metaverse worlds, GameFi, play-to-earn', icon: '🎮', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'NFTs & Digital Art', slug: 'nfts', description: 'NFT marketplaces, minting tools, digital art platforms, collectibles', icon: '🎨', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'DAOs & Governance', slug: 'daos', description: 'DAO tooling, governance frameworks, treasury management, voting', icon: '🏛️', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Social & Creator Economy', slug: 'social', description: 'Social platforms, creator tools, content monetization, community', icon: '💬', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Developer Tools', slug: 'dev-tools', description: 'SDKs, testing frameworks, debugging tools, smart contract libraries', icon: '🛠️', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Wallets & Identity', slug: 'wallets', description: 'Wallet apps, account management, identity, authentication', icon: '👛', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Infrastructure', slug: 'infrastructure', description: 'RPC nodes, indexers, explorers, validators, storage', icon: '🔧', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Chain Signatures', slug: 'chain-signatures', description: 'MPC-powered cross-chain signing, multi-chain wallets, transaction relaying', icon: '✍️', is_strategic: true, strategic_multiplier: 2.0 },
  { name: 'Meme Coins & Tokens', slug: 'meme-tokens', description: 'Fungible tokens, meme coins, tax/burn/reflection mechanics, fair launches', icon: '🪙', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Staking & Rewards', slug: 'staking-rewards', description: 'Staking pools, lockup contracts, reward distribution, yield strategies', icon: '💎', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Prediction Markets', slug: 'prediction-markets', description: 'Binary betting, outcome markets, oracle-based resolution, prediction pools', icon: '🎰', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Launchpads & IDOs', slug: 'launchpads', description: 'Token sale platforms, IDO infrastructure, whitelist management, vesting', icon: '📱', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Bridges & Cross-Chain', slug: 'bridges', description: 'Cross-chain bridges, wrapped tokens, message relaying, interoperability', icon: '🌉', is_strategic: false, strategic_multiplier: 1.0 },
];

// Allow up to 60s for full ecosystem sync (10+ data sources + opportunity generation)
export const maxDuration = 60;

/**
 * Vercel Cron Job — runs internally, bypasses SSO/auth protection.
 * Triggered by Vercel's scheduler based on vercel.json config.
 * 
 * Vercel sends: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: Request) {
  // Verify this is a legitimate Vercel cron invocation
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    // If CRON_SECRET is set, enforce it
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    // Fallback: only allow from Vercel's internal cron (user-agent check)
    const ua = request.headers.get('user-agent') || '';
    if (!ua.includes('vercel-cron')) {
      return NextResponse.json({ error: 'Unauthorized — set CRON_SECRET env var' }, { status: 401 });
    }
  }

  try {
    const supabase = createAdminClient();
    const results: Record<string, unknown> = {};

    // Log sync start
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .insert({ source: 'cron-ecosystem', status: 'started', records_processed: 0 })
      .select()
      .single();

    // Step 0: Ensure all categories exist
    const { error: catError } = await supabase
      .from('categories')
      .upsert(CATEGORIES, { onConflict: 'slug', ignoreDuplicates: false });

    if (catError) {
      console.error('Category upsert error:', catError.message);
    }
    results.categories = { count: CATEGORIES.length };

    // Step 1: Sync ecosystem data from NEAR GitHub
    results.ecosystem = await syncEcosystem(supabase);

    // Step 2: Sync DeFiLlama TVL data
    results.defillama = await syncDeFiLlama(supabase);

    // Step 3: Sync GitHub stars & activity
    results.github = await syncGitHub(supabase);

    // Step 4: Sync NearBlocks chain stats
    results.nearblocks = await syncNearBlocks(supabase);

    // Step 5: Enrich with FastNEAR on-chain data
    results.fastnear = await syncFastNear(supabase);

    // Step 6: Enrich with Pikespeak analytics
    results.pikespeak = await syncPikespeak(supabase);

    // Step 7: Enrich with Mintbase NFT data
    results.mintbase = await syncMintbase(supabase);

    // Step 8: Enrich with Sputnik DAO governance data
    results.astrodao = await syncAstroDAO(supabase);

    // Step 9: Generate/update opportunities (AI-detected voids)
    results.opportunities = await generateOpportunities(supabase);

    // Log sync completion
    if (syncLog) {
      await supabase
        .from('sync_logs')
        .update({
          status: 'completed',
          records_processed: (results.ecosystem as { processed?: number })?.processed || 0,
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncLog.id);
    }

    console.log('[CRON SYNC] Complete:', JSON.stringify({
      projects: (results.ecosystem as { processed?: number })?.processed || 0,
      timestamp: new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[CRON SYNC] Failed:', message);

    try {
      const supabase = createAdminClient();
      await supabase
        .from('sync_logs')
        .insert({
          source: 'cron-ecosystem',
          status: 'failed',
          error_message: message,
        });
    } catch {
      // Ignore logging errors
    }

    return NextResponse.json(
      { success: false, error: 'Sync failed', message },
      { status: 500 }
    );
  }
}
