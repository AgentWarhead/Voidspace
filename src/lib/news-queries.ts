import { createAdminClient } from '@/lib/supabase/admin';
import type { NewsArticle } from '@/types';

// Map Voidspace category slugs to news categories
const SLUG_TO_NEWS_CATEGORY: Record<string, string[]> = {
  'defi': ['defi', 'market'],
  'dex-trading': ['defi', 'exchange'],
  'nfts': ['nft'],
  'privacy': ['security', 'regulatory'],
  'ai-agents': ['market'],
  'intents': ['layer2', 'market'],
  'rwa': ['regulatory', 'market'],
  'data-analytics': ['market'],
  'gaming': ['nft', 'market'],
  'daos': ['market'],
  'social': ['market'],
  'dev-tools': ['market', 'layer1'],
  'wallets': ['security', 'market'],
  'education': ['market'],
  'infrastructure': ['layer1', 'layer2'],
};

export async function getRecentNews(options: {
  category?: string;
  limit?: number;
  minScore?: number;
  nearOnly?: boolean;
} = {}): Promise<NewsArticle[]> {
  const supabase = createAdminClient();
  const { category, limit = 20, minScore = 0, nearOnly = true } = options;

  let query = supabase
    .from('news_articles')
    .select('*')
    .gte('relevance_score', minScore)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  if (nearOnly) {
    query = query.eq('near_relevant', true);
  }

  const { data } = await query;
  return (data || []) as NewsArticle[];
}

export async function getNewsByCategory(
  categorySlug: string,
  limit: number = 5,
): Promise<NewsArticle[]> {
  const supabase = createAdminClient();
  const newsCategories = SLUG_TO_NEWS_CATEGORY[categorySlug] || ['market'];

  const { data } = await supabase
    .from('news_articles')
    .select('*')
    .in('category', newsCategories)
    .eq('near_relevant', true)
    .order('relevance_score', { ascending: false })
    .limit(limit);

  return (data || []) as NewsArticle[];
}

export async function getNearNews(limit: number = 10): Promise<NewsArticle[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('news_articles')
    .select('*')
    .eq('near_relevant', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  return (data || []) as NewsArticle[];
}

export interface HotTopic {
  category: string;
  recentCount: number;
  baselineCount: number;
  spike: number; // multiplier vs baseline
}

export async function getNewsVelocity(): Promise<HotTopic[]> {
  const supabase = createAdminClient();

  const now = new Date();
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Fetch recent articles (last 6h) and baseline (last 7d)
  const [{ data: recent }, { data: baseline }] = await Promise.all([
    supabase
      .from('news_articles')
      .select('category')
      .gte('published_at', sixHoursAgo)
      .eq('near_relevant', true),
    supabase
      .from('news_articles')
      .select('category')
      .gte('published_at', sevenDaysAgo)
      .eq('near_relevant', true),
  ]);

  if (!recent || !baseline) return [];

  // Count by category
  const recentCounts = new Map<string, number>();
  for (const a of recent) {
    if (a.category) recentCounts.set(a.category, (recentCounts.get(a.category) || 0) + 1);
  }

  const baselineCounts = new Map<string, number>();
  for (const a of baseline) {
    if (a.category) baselineCounts.set(a.category, (baselineCounts.get(a.category) || 0) + 1);
  }

  // Calculate spikes: recent rate vs 7-day average rate
  const hotTopics: HotTopic[] = [];

  Array.from(recentCounts.entries()).forEach(([cat, count]) => {
    const totalBaseline = baselineCounts.get(cat) || 1;
    // Average 6h-window count over 7 days = totalBaseline / 28
    const avgPer6h = totalBaseline / 28;
    const spike = avgPer6h > 0 ? count / avgPer6h : count;

    if (spike > 1.3) { // Only show if at least 30% above average
      hotTopics.push({
        category: cat,
        recentCount: count,
        baselineCount: totalBaseline,
        spike: Math.round(spike * 10) / 10,
      });
    }
  });

  return hotTopics.sort((a, b) => b.spike - a.spike);
}

export async function getNewsCountByCategory(periodHours: number = 168): Promise<Map<string, number>> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - periodHours * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('news_articles')
    .select('category')
    .gte('published_at', since)
    .eq('near_relevant', true);

  const counts = new Map<string, number>();
  if (data) {
    for (const a of data) {
      if (a.category) {
        // Map news categories back to Voidspace slugs
        for (const [slug, newsCats] of Object.entries(SLUG_TO_NEWS_CATEGORY)) {
          if (newsCats.includes(a.category)) {
            counts.set(slug, (counts.get(slug) || 0) + 1);
          }
        }
      }
    }
  }

  return counts;
}
