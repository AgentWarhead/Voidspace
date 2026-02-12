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

  // Strategic categories first (order matters — first match wins)
  if (/\b(ai|agent|inference|machine.?learning|shade|llm|gpt|neural|model)\b/.test(combined)) {
    return categoryMap.get('ai-agents') || null;
  }
  if (/\b(privacy|zk|zero.?knowledge|private|confidential|secret|mixnet)\b/.test(combined)) {
    return categoryMap.get('privacy') || null;
  }
  if (/\b(intent|chain.?abstraction|cross.?chain|bridge|multichain|interop|relay)\b/.test(combined)) {
    return categoryMap.get('intents') || null;
  }
  if (/\b(rwa|real.?world|tokeniz|payroll|remittance|invoice)\b/.test(combined)) {
    return categoryMap.get('rwa') || null;
  }
  if (/\b(analytics|data\s|indexer|indexing|intelligence|dashboard|tracker|insight)\b/.test(combined)) {
    return categoryMap.get('data-analytics') || null;
  }

  // Standard categories
  if (/\b(dex|swap|amm|order.?book|trading|exchange)\b/.test(combined)) {
    return categoryMap.get('dex-trading') || null;
  }
  if (/\b(lend|borrow|yield|stablecoin|liquidity|vault|derivatives|margin)\b/.test(combined)) {
    return categoryMap.get('defi') || null;
  }
  if (/\b(gaming|game|play.?to|metaverse|gamefi|p2e|virtual.?world)\b/.test(combined)) {
    return categoryMap.get('gaming') || null;
  }
  if (/\b(nft|art|collectible|mint|digital.?art|generative|pfp)\b/.test(combined)) {
    return categoryMap.get('nfts') || null;
  }
  if (/\b(dao|governance|voting|treasury|proposal|multisig)\b/.test(combined)) {
    return categoryMap.get('daos') || null;
  }
  if (/\b(social|community|creator|content|messaging|chat|forum|feed)\b/.test(combined)) {
    return categoryMap.get('social') || null;
  }
  if (/\b(education|learn|tutorial|bootcamp|course|academy|onboard)\b/.test(combined)) {
    return categoryMap.get('education') || null;
  }
  if (/\b(wallet|identity|auth|login|account|signer|key.?manage)\b/.test(combined)) {
    return categoryMap.get('wallets') || null;
  }
  if (/\b(sdk|tool|debug|test|framework|library|cli|boilerplate|template|dev)\b/.test(combined)) {
    return categoryMap.get('dev-tools') || null;
  }
  if (/\b(oracle|payment|rpc|node|validator|storage|explorer|infra)\b/.test(combined)) {
    return categoryMap.get('infrastructure') || null;
  }

  // Broad DeFi catch-all
  if (/\b(defi|finance|protocol|staking|farm)\b/.test(combined)) {
    return categoryMap.get('defi') || null;
  }

  // Default to infrastructure for unmatched
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

  // --- Mark abandoned projects as inactive ---
  // Criteria: no GitHub commits in 6 months AND TVL is 0/null
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Fetch projects that might be abandoned
  const { data: candidates } = await supabase
    .from('projects')
    .select('id, last_github_commit, tvl_usd')
    .eq('is_active', true);

  if (candidates && candidates.length > 0) {
    const abandonedIds = candidates
      .filter((p) => {
        const noRecentCommits =
          !p.last_github_commit ||
          new Date(p.last_github_commit) < sixMonthsAgo;
        const noTVL = !p.tvl_usd || Number(p.tvl_usd) === 0;
        return noRecentCommits && noTVL;
      })
      .map((p) => p.id);

    if (abandonedIds.length > 0) {
      // Update in batches of 100
      for (let i = 0; i < abandonedIds.length; i += 100) {
        const batch = abandonedIds.slice(i, i + 100);
        const { error } = await supabase
          .from('projects')
          .update({ is_active: false })
          .in('id', batch);

        if (error) {
          errors.push(`Mark inactive batch ${i}: ${error.message}`);
        }
      }
    }
  }

  return { processed, total: entities.length, errors };
}
