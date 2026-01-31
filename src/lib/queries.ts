import { createAdminClient } from '@/lib/supabase/admin';
import { calculateGapScore } from '@/lib/gap-score';
import type {
  EcosystemStats,
  CategoryWithStats,
  Opportunity,
  Project,
  Category,
  SyncLog,
  ChainStatsRecord,
  GitHubAggregateStats,
} from '@/types';

// --- Dashboard Queries ---

export async function getEcosystemStats(): Promise<EcosystemStats> {
  const supabase = createAdminClient();

  const [
    { count: totalProjects },
    { count: activeProjects },
    { data: tvlData },
    { count: categoryCount },
    { data: lastSync },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('projects').select('tvl_usd'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase
      .from('sync_logs')
      .select('completed_at')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1),
  ]);

  const totalTVL = tvlData?.reduce((sum, p) => sum + (Number(p.tvl_usd) || 0), 0) || 0;

  return {
    totalProjects: totalProjects || 0,
    activeProjects: activeProjects || 0,
    totalTVL,
    categoryCount: categoryCount || 0,
    lastSyncAt: lastSync?.[0]?.completed_at || null,
  };
}

export async function getCategoriesWithStats(): Promise<CategoryWithStats[]> {
  const supabase = createAdminClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: categories }, { data: allProjects }, { data: newsData }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('projects').select('id, category_id, tvl_usd, is_active, github_stars, github_forks, github_open_issues, last_github_commit'),
    supabase.from('news_articles').select('category').gte('published_at', sevenDaysAgo),
  ]);

  if (!categories) return [];

  const projects = allProjects || [];

  // Count news articles by news category, then map to Voidspace slugs
  const slugToNewsCategory: Record<string, string[]> = {
    'defi': ['defi', 'market'], 'dex-trading': ['defi', 'exchange'],
    'nfts': ['nft'], 'privacy': ['security', 'regulatory'],
    'ai-agents': ['market'], 'intents': ['layer2', 'market'],
    'rwa': ['regulatory', 'market'], 'data-analytics': ['market'],
    'gaming': ['nft', 'market'], 'daos': ['market'],
    'social': ['market'], 'dev-tools': ['market', 'layer1'],
    'wallets': ['security', 'market'], 'education': ['market'],
    'infrastructure': ['layer1', 'layer2'],
  };
  const newsCategoryCounts = new Map<string, number>();
  for (const n of (newsData || [])) {
    if (n.category) newsCategoryCounts.set(n.category, (newsCategoryCounts.get(n.category) || 0) + 1);
  }
  const newsCountBySlug = new Map<string, number>();
  for (const [slug, newsCats] of Object.entries(slugToNewsCategory)) {
    let count = 0;
    for (const nc of newsCats) count += newsCategoryCounts.get(nc) || 0;
    newsCountBySlug.set(slug, count);
  }

  // Group projects by category_id
  const projectsByCategory = new Map<string, typeof projects>();
  for (const p of projects) {
    if (!p.category_id) continue;
    const arr = projectsByCategory.get(p.category_id) || [];
    arr.push(p);
    projectsByCategory.set(p.category_id, arr);
  }

  // Compute cross-category context for rank-based scoring
  const allCategoryActiveProjects: number[] = [];
  const allCategoryTVLs: number[] = [];

  for (const cat of categories) {
    const catProjects = projectsByCategory.get(cat.id) || [];
    allCategoryActiveProjects.push(catProjects.filter((p) => p.is_active).length);
    allCategoryTVLs.push(catProjects.reduce((s, p) => s + (Number(p.tvl_usd) || 0), 0));
  }

  const ecosystemAverageTVL = allCategoryTVLs.length > 0
    ? allCategoryTVLs.reduce((s, v) => s + v, 0) / allCategoryTVLs.length
    : 0;

  const results: CategoryWithStats[] = [];

  for (const cat of categories) {
    const catProjects = projectsByCategory.get(cat.id) || [];
    const projectCount = catProjects.length;
    const activeProjectCount = catProjects.filter((p) => p.is_active).length;
    const totalTVL = catProjects.reduce((s, p) => s + (Number(p.tvl_usd) || 0), 0);

    const gapScore = calculateGapScore({
      categorySlug: cat.slug,
      totalProjects: projectCount,
      activeProjects: activeProjectCount,
      totalTVL,
      isStrategic: cat.is_strategic,
      strategicMultiplier: Number(cat.strategic_multiplier) || 1,
      projectTVLs: catProjects.map((p) => Number(p.tvl_usd) || 0),
      projectGithubStats: catProjects.map((p) => ({
        stars: p.github_stars || 0,
        forks: p.github_forks || 0,
        openIssues: p.github_open_issues || 0,
        lastCommit: p.last_github_commit,
        isActive: p.is_active,
      })),
      allCategoryActiveProjects,
      ecosystemAverageTVL,
      newsArticleCount: newsCountBySlug.get(cat.slug) || 0,
    });

    results.push({
      ...cat,
      projectCount,
      activeProjectCount,
      totalTVL,
      gapScore,
    });
  }

  return results;
}

export async function getTopOpportunities(limit: number = 5): Promise<Opportunity[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('opportunities')
    .select('*, category:categories(*)')
    .order('gap_score', { ascending: false })
    .limit(limit);

  return (data || []) as Opportunity[];
}

export async function getRecentProjects(limit: number = 5): Promise<Project[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data || []) as Project[];
}

export async function getRecentSyncLogs(limit: number = 5): Promise<SyncLog[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('sync_logs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  return (data || []) as SyncLog[];
}

// --- Category Queries ---

export async function getAllCategories(): Promise<Category[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (data || []) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  return data as Category | null;
}

export async function getProjectsByCategory(
  categoryId: string,
  options: { sort?: string; activeOnly?: boolean } = {}
): Promise<Project[]> {
  const supabase = createAdminClient();
  const { sort = 'tvl', activeOnly = false } = options;

  let query = supabase
    .from('projects')
    .select('*')
    .eq('category_id', categoryId);

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  switch (sort) {
    case 'tvl':
      query = query.order('tvl_usd', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'recent':
      query = query.order('updated_at', { ascending: false });
      break;
    case 'stars':
      query = query.order('github_stars', { ascending: false });
      break;
    case 'forks':
      query = query.order('github_forks', { ascending: false });
      break;
    case 'issues':
      query = query.order('github_open_issues', { ascending: false });
      break;
    default:
      query = query.order('tvl_usd', { ascending: false });
  }

  const { data } = await query;
  return (data || []) as Project[];
}

export async function getCategoryProjectStats(categoryId: string): Promise<{
  total: number;
  active: number;
  tvl: number;
}> {
  const supabase = createAdminClient();

  const [
    { count: total },
    { count: active },
    { data: tvlData },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('category_id', categoryId),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('category_id', categoryId).eq('is_active', true),
    supabase.from('projects').select('tvl_usd').eq('category_id', categoryId),
  ]);

  const tvl = tvlData?.reduce((sum, p) => sum + (Number(p.tvl_usd) || 0), 0) || 0;

  return {
    total: total || 0,
    active: active || 0,
    tvl,
  };
}

// --- Opportunity Queries ---

export async function getOpportunities(options: {
  category?: string;
  difficulty?: string;
  sort?: string;
  search?: string;
  minScore?: number;
  maxScore?: number;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ data: Opportunity[]; total: number }> {
  const supabase = createAdminClient();
  const {
    category,
    difficulty,
    sort = 'gap_score',
    search,
    minScore,
    maxScore,
    page = 1,
    pageSize = 12,
  } = options;

  let query = supabase
    .from('opportunities')
    .select('*, category:categories(*)', { count: 'exact' });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }

  if (minScore !== undefined) {
    query = query.gte('gap_score', minScore);
  }

  if (maxScore !== undefined) {
    query = query.lte('gap_score', maxScore);
  }

  switch (sort) {
    case 'gap_score':
      query = query.order('gap_score', { ascending: false });
      break;
    case 'date':
      query = query.order('updated_at', { ascending: false });
      break;
    case 'demand':
      query = query.order('demand_score', { ascending: false });
      break;
    default:
      query = query.order('gap_score', { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count } = await query;

  return {
    data: (data || []) as Opportunity[],
    total: count || 0,
  };
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('opportunities')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  return data as Opportunity | null;
}

export async function getRelatedProjects(categoryId: string, limit: number = 5): Promise<Project[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('tvl_usd', { ascending: false })
    .limit(limit);

  return (data || []) as Project[];
}

// --- Chain Stats Queries ---

export async function getLatestChainStats(): Promise<ChainStatsRecord | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('chain_stats')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  return data as ChainStatsRecord | null;
}

export async function getChainStatsHistory(days: number = 30): Promise<ChainStatsRecord[]> {
  const supabase = createAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from('chain_stats')
    .select('*')
    .gte('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: true });

  return (data || []) as ChainStatsRecord[];
}

// --- GitHub Aggregate Stats ---

export async function getGitHubAggregateStats(): Promise<GitHubAggregateStats> {
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('github_stars, github_forks, github_open_issues, github_language, last_github_commit, github_url');

  if (!projects) {
    return { totalStars: 0, totalForks: 0, totalOpenIssues: 0, projectsWithGithub: 0, recentlyActive: 0, topLanguages: [] };
  }

  const withGithub = projects.filter((p) => p.github_url);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentlyActive = withGithub.filter(
    (p) => p.last_github_commit && new Date(p.last_github_commit) > thirtyDaysAgo
  ).length;

  const totalStars = projects.reduce((s, p) => s + (p.github_stars || 0), 0);
  const totalForks = projects.reduce((s, p) => s + (p.github_forks || 0), 0);
  const totalOpenIssues = projects.reduce((s, p) => s + (p.github_open_issues || 0), 0);

  // Count languages
  const langMap: Record<string, number> = {};
  for (const p of projects) {
    if (p.github_language) {
      langMap[p.github_language] = (langMap[p.github_language] || 0) + 1;
    }
  }
  const topLanguages = Object.entries(langMap)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalStars,
    totalForks,
    totalOpenIssues,
    projectsWithGithub: withGithub.length,
    recentlyActive,
    topLanguages,
  };
}

// --- Project Queries ---

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  return data as Project | null;
}

// --- Search ---

export async function searchAll(query: string): Promise<{
  projects: Project[];
  opportunities: Opportunity[];
  categories: Category[];
}> {
  const supabase = createAdminClient();
  const term = `%${query}%`;

  const [projectsRes, opportunitiesRes, categoriesRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .or(`name.ilike.${term},description.ilike.${term}`)
      .order('tvl_usd', { ascending: false })
      .limit(20),
    supabase
      .from('opportunities')
      .select('*, category:categories(*)')
      .or(`title.ilike.${term},description.ilike.${term}`)
      .order('gap_score', { ascending: false })
      .limit(20),
    supabase
      .from('categories')
      .select('*')
      .or(`name.ilike.${term},description.ilike.${term}`)
      .order('name')
      .limit(20),
  ]);

  return {
    projects: (projectsRes.data || []) as Project[],
    opportunities: (opportunitiesRes.data || []) as Opportunity[],
    categories: (categoriesRes.data || []) as Category[],
  };
}
