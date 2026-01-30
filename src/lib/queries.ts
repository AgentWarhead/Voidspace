import { createAdminClient } from '@/lib/supabase/admin';
import { calculateGapScore } from '@/lib/gap-score';
import type {
  EcosystemStats,
  CategoryWithStats,
  Opportunity,
  Project,
  Category,
  SyncLog,
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

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (!categories) return [];

  const results: CategoryWithStats[] = [];

  for (const cat of categories) {
    const [
      { count: projectCount },
      { count: activeCount },
      { data: tvlData },
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('category_id', cat.id),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('category_id', cat.id).eq('is_active', true),
      supabase.from('projects').select('tvl_usd').eq('category_id', cat.id),
    ]);

    const totalTVL = tvlData?.reduce((sum, p) => sum + (Number(p.tvl_usd) || 0), 0) || 0;
    const active = activeCount || 0;

    const gapScore = calculateGapScore({
      categorySlug: cat.slug,
      totalProjects: projectCount || 0,
      activeProjects: active,
      totalTVL,
      transactionVolume: 0,
      isStrategic: cat.is_strategic,
      strategicMultiplier: Number(cat.strategic_multiplier) || 1,
    });

    results.push({
      ...cat,
      projectCount: projectCount || 0,
      activeProjectCount: active,
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
    minScore,
    maxScore,
    page = 1,
    pageSize = 12,
  } = options;

  let query = supabase
    .from('opportunities')
    .select('*, category:categories(*)', { count: 'exact' });

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
