import { SupabaseClient } from '@supabase/supabase-js';
import { calculateGapScore, getCompetitionLevel, getDifficulty } from '@/lib/gap-score';
import type { Category } from '@/types';

function generateTitle(categoryName: string, competition: string): string {
  if (competition === 'low') return `Build the Next ${categoryName} Solution on NEAR`;
  if (competition === 'medium') return `${categoryName} Innovation Opportunity on NEAR`;
  return `${categoryName} Differentiation Gap on NEAR`;
}

function generateDescription(
  category: Category,
  activeCount: number,
  totalTVL: number
): string {
  const tvlStr = totalTVL > 0
    ? `$${(totalTVL / 1_000_000).toFixed(1)}M in TVL`
    : 'minimal TVL';

  const strategic = category.is_strategic
    ? ' This is a strategic priority area for NEAR Protocol.'
    : '';

  return `The ${category.name} category on NEAR has ${activeCount} active project${activeCount !== 1 ? 's' : ''} with ${tvlStr}.${strategic} There is room for new projects that bring fresh approaches to ${category.description?.toLowerCase() || 'this space'}.`;
}

function getSuggestedFeatures(slug: string): string[] {
  const features: Record<string, string[]> = {
    'ai-agents': ['Autonomous AI agent framework', 'TEE-based secure execution', 'Multi-model orchestration', 'On-chain agent registry'],
    'privacy': ['ZK proof generation', 'Private transaction mixing', 'Confidential smart contracts', 'Identity-preserving verification'],
    'intents': ['Intent solver network', 'Cross-chain transaction routing', 'Account abstraction layer', 'Gas abstraction'],
    'rwa': ['Asset tokenization framework', 'On-chain price oracle', 'Compliance verification', 'Fractional ownership'],
    'defi': ['Automated market maker', 'Lending/borrowing protocol', 'Yield optimization', 'Composable DeFi primitives'],
    'infrastructure': ['Block explorer', 'RPC provider dashboard', 'Developer SDK', 'Indexing service'],
    'consumer': ['Social graph protocol', 'NFT marketplace', 'DAO governance tools', 'Creator monetization'],
  };
  return features[slug] || ['Core protocol feature', 'User dashboard', 'API integration', 'Analytics'];
}

export async function generateOpportunities(supabase: SupabaseClient) {
  let created = 0;
  let updated = 0;

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  if (!categories) throw new Error('No categories found');

  for (const category of categories) {
    // Count total and active projects in this category
    const { count: totalCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id);

    const { count: activeCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id)
      .eq('is_active', true);

    // Sum TVL for this category
    const { data: tvlData } = await supabase
      .from('projects')
      .select('tvl_usd')
      .eq('category_id', category.id);

    const totalTVL = tvlData?.reduce((sum, p) => sum + (Number(p.tvl_usd) || 0), 0) || 0;

    // Calculate gap score
    const gapScore = calculateGapScore({
      categorySlug: category.slug,
      totalProjects: totalCount || 0,
      activeProjects: activeCount || 0,
      totalTVL,
      transactionVolume: 0, // Not available yet
      isStrategic: category.is_strategic,
      strategicMultiplier: Number(category.strategic_multiplier),
    });

    const competitionLevel = getCompetitionLevel(activeCount || 0);
    const difficulty = getDifficulty(category.slug);
    const title = generateTitle(category.name, competitionLevel);
    const description = generateDescription(category, activeCount || 0, totalTVL);

    // Check if opportunity exists for this category
    const { data: existing } = await supabase
      .from('opportunities')
      .select('id')
      .eq('category_id', category.id)
      .limit(1)
      .single();

    const opportunityData = {
      category_id: category.id,
      title,
      description,
      gap_score: gapScore,
      demand_score: Math.log10(totalTVL + 1),
      competition_level: competitionLevel,
      reasoning: `Based on ${activeCount || 0} active projects and ${totalTVL > 0 ? `$${(totalTVL / 1_000_000).toFixed(1)}M TVL` : 'minimal TVL'} in the ${category.name} category.`,
      suggested_features: getSuggestedFeatures(category.slug),
      difficulty,
    };

    if (existing) {
      await supabase
        .from('opportunities')
        .update(opportunityData)
        .eq('id', existing.id);
      updated++;
    } else {
      await supabase
        .from('opportunities')
        .insert(opportunityData);
      created++;
    }
  }

  return { created, updated };
}
