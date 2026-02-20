import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export const maxDuration = 300; // 5 min — Vercel Pro max
import { rateLimit } from '@/lib/auth/rate-limit';
import { syncEcosystem } from '@/lib/sync/ecosystem';
import { syncDeFiLlama } from '@/lib/sync/defillama';
import { generateOpportunities } from '@/lib/sync/opportunities';
import { syncGitHub } from '@/lib/sync/github';
import { syncNearBlocks } from '@/lib/sync/nearblocks';
import { syncFastNear } from '@/lib/sync/fastnear';
import { syncPikespeak } from '@/lib/sync/pikespeak';
import { syncMintbase } from '@/lib/sync/mintbase';
import { syncAstroDAO } from '@/lib/sync/astrodao';

const CATEGORIES = [
  // Strategic categories (2x multiplier)
  { name: 'AI & Agents', slug: 'ai-agents', description: 'AI agents, inference, autonomous systems leveraging Shade Agents', icon: '🤖', is_strategic: true, strategic_multiplier: 2.0 },
  { name: 'Privacy', slug: 'privacy', description: 'Private transactions, identity protection, ZK proofs', icon: '🔒', is_strategic: true, strategic_multiplier: 2.0 },
  { name: 'Intents & Chain Abstraction', slug: 'intents', description: 'Intent solvers, cross-chain operations, account abstraction', icon: '🔗', is_strategic: true, strategic_multiplier: 2.0 },
  { name: 'Real World Assets', slug: 'rwa', description: 'Oracles, RWA tokenization, payments, real-world bridges', icon: '🌍', is_strategic: true, strategic_multiplier: 2.0 },
  { name: 'Data & Analytics', slug: 'data-analytics', description: 'On-chain analytics, data indexing, blockchain intelligence', icon: '📊', is_strategic: true, strategic_multiplier: 1.5 },
  // Standard categories
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

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`sync:${ip}`, 2, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Auth check: fail-closed with timing-safe comparison
    const expectedKey = process.env.SYNC_API_KEY;
    if (!expectedKey) {
      console.error('SYNC_API_KEY not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    if (!token || token.length !== expectedKey.length ||
        !timingSafeEqual(Buffer.from(token), Buffer.from(expectedKey))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const results: Record<string, unknown> = {};

    // Log sync start
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .insert({ source: 'ecosystem', status: 'started', records_processed: 0 })
      .select()
      .single();

    // Step 0: Ensure all categories exist (upsert)
    const { error: catError } = await supabase
      .from('categories')
      .upsert(CATEGORIES, { onConflict: 'slug', ignoreDuplicates: false });

    if (catError) {
      console.error('Category upsert error:', catError.message);
    }

    // Also remove the old "Consumer & Social" category if it exists
    // (projects will be re-mapped to the new specific categories)
    const { data: oldConsumer } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'consumer')
      .single();

    if (oldConsumer) {
      // Nullify category_id on projects that were in the old category
      // (they'll be re-categorized by the ecosystem sync)
      await supabase
        .from('projects')
        .update({ category_id: null })
        .eq('category_id', oldConsumer.id);

      // Delete old opportunities linked to the old category
      await supabase
        .from('opportunities')
        .delete()
        .eq('category_id', oldConsumer.id);

      // Delete the old category
      await supabase
        .from('categories')
        .delete()
        .eq('id', oldConsumer.id);
    }

    results.categories = { count: CATEGORIES.length };

    // Step 1: Sync ecosystem data
    results.ecosystem = await syncEcosystem(supabase);

    // Step 2: Sync DeFiLlama TVL data
    results.defillama = await syncDeFiLlama(supabase);

    // Step 2.5: Sync GitHub data (stars, last commit)
    results.github = await syncGitHub(supabase);

    // Step 2.75: Sync NearBlocks chain stats
    results.nearblocks = await syncNearBlocks(supabase);

    // Step 3: Enrich with FastNEAR on-chain data
    results.fastnear = await syncFastNear(supabase);

    // Step 3.5: Enrich with Pikespeak analytics
    results.pikespeak = await syncPikespeak(supabase);

    // Step 3.75: Enrich with Mintbase NFT data
    results.mintbase = await syncMintbase(supabase);

    // Step 3.85: Enrich with Sputnik DAO governance data
    results.astrodao = await syncAstroDAO(supabase);

    // Step 4: Generate/update opportunities
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

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Sync error:', error);

    // Log failure
    try {
      const supabase = createAdminClient();
      await supabase
        .from('sync_logs')
        .insert({
          source: 'ecosystem',
          status: 'failed',
          error_message: message,
        });
    } catch {
      // Ignore logging errors
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to trigger a data sync.',
    usage: 'curl -X POST http://localhost:3000/api/sync -H "Authorization: Bearer YOUR_SYNC_API_KEY"',
  });
}
