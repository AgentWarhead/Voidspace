import { SupabaseClient } from '@supabase/supabase-js';

interface EcosystemEntity {
  title?: string;
  slug?: string;
  oneliner?: string;
  category?: string; // comma-separated: "defi, tools, infrastructure"
  status?: string;
  website?: string;
  github?: string;
  twitter?: string;
  logo?: string;
  [key: string]: unknown;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapToCategory(
  entity: EcosystemEntity,
  categoryMap: Map<string, string>
): string | null {
  const tags = (entity.category || '').split(',').map((t: string) => t.trim().toLowerCase());
  const desc = (entity.oneliner || '').toLowerCase();
  const name = (entity.title || '').toLowerCase();
  const combined = [...tags, desc, name].join(' ');

  if (/\b(ai|agent|inference|machine.?learning|shade|llm|gpt)\b/.test(combined)) {
    return categoryMap.get('ai-agents') || null;
  }
  if (/\b(privacy|zk|zero.?knowledge|private|confidential|secret)\b/.test(combined)) {
    return categoryMap.get('privacy') || null;
  }
  if (/\b(intent|chain.?abstraction|cross.?chain|bridge|multichain|interop)\b/.test(combined)) {
    return categoryMap.get('intents') || null;
  }
  if (/\b(rwa|real.?world|oracle|payment|tokeniz|payroll|remittance)\b/.test(combined)) {
    return categoryMap.get('rwa') || null;
  }
  if (/\b(defi|dex|swap|lend|borrow|yield|stablecoin|liquidity|amm|derivatives)\b/.test(combined)) {
    return categoryMap.get('defi') || null;
  }
  if (/\b(wallet|explorer|tool|infra|sdk|indexer|rpc|node|api|dev.?tool|cli)\b/.test(combined)) {
    return categoryMap.get('infrastructure') || null;
  }
  if (/\b(social|gaming|game|nft|dao|community|creator|metaverse|marketplace|art)\b/.test(combined)) {
    return categoryMap.get('consumer') || null;
  }

  // Default to infrastructure
  return categoryMap.get('infrastructure') || null;
}

export async function syncEcosystem(supabase: SupabaseClient) {
  const errors: string[] = [];
  let processed = 0;

  // Fetch categories to build slug -> id map
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug');

  if (!categories || categories.length === 0) {
    throw new Error('No categories found. Run seed data first.');
  }

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    categoryMap.set(cat.slug, cat.id);
  }

  // Fetch ecosystem data directly (server-side, no need for Edge Function)
  const res = await fetch(
    'https://raw.githubusercontent.com/near/ecosystem/main/entities.json'
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch ecosystem data: ${res.status}`);
  }

  const entities: EcosystemEntity[] = await res.json();

  // Process entities in batches
  const batchSize = 50;
  for (let i = 0; i < entities.length; i += batchSize) {
    const batch = entities.slice(i, i + batchSize);
    const rows = batch
      .filter((e) => e.title)
      .map((entity) => {
        const slug = entity.slug || slugify(entity.title!);
        const categoryId = mapToCategory(entity, categoryMap);

        return {
          name: entity.title!,
          slug,
          description: entity.oneliner || null,
          category_id: categoryId,
          website_url: entity.website || null,
          github_url: entity.github || null,
          twitter_url: entity.twitter || null,
          logo_url: entity.logo || null,
          raw_data: entity as Record<string, unknown>,
          is_active: true,
        };
      });

    if (rows.length === 0) continue;

    const { error } = await supabase
      .from('projects')
      .upsert(rows, { onConflict: 'slug', ignoreDuplicates: false });

    if (error) {
      errors.push(`Batch ${i}: ${error.message}`);
    } else {
      processed += rows.length;
    }
  }

  return { processed, total: entities.length, errors };
}
