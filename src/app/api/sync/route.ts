import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { syncEcosystem } from '@/lib/sync/ecosystem';
import { syncDeFiLlama } from '@/lib/sync/defillama';
import { generateOpportunities } from '@/lib/sync/opportunities';

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
  { name: 'Education & Onboarding', slug: 'education', description: 'Learning platforms, tutorials, bootcamps, developer education', icon: '📚', is_strategic: false, strategic_multiplier: 1.0 },
  { name: 'Infrastructure', slug: 'infrastructure', description: 'RPC nodes, indexers, explorers, validators, storage', icon: '🔧', is_strategic: false, strategic_multiplier: 1.0 },
];

export async function POST(request: Request) {
  try {
    // Simple auth check
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SYNC_API_KEY;
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
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

    // Step 3: Generate/update opportunities
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
      { success: false, error: message },
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
