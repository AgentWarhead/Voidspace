import { MetadataRoute } from 'next';
import { getAllCategories, getAllProjectSlugs, getAllOpportunityIds } from '@/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://voidspace.io';
  const now = new Date();

  // ─── Static Pages ──────────────────────────────────────────────────────────

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, priority: 1.0, changeFrequency: 'weekly' },

    // Core tools
    { url: `${baseUrl}/observatory`, lastModified: now, priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/void-bubbles`, lastModified: now, priority: 0.8, changeFrequency: 'daily' },
    { url: `${baseUrl}/void-lens`, lastModified: now, priority: 0.8, changeFrequency: 'daily' },
    { url: `${baseUrl}/constellation`, lastModified: now, priority: 0.8, changeFrequency: 'daily' },

    // Opportunities & discovery
    { url: `${baseUrl}/opportunities`, lastModified: now, priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/search`, lastModified: now, priority: 0.7, changeFrequency: 'weekly' },

    // Builder tools
    { url: `${baseUrl}/sanctum`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/pricing`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' },

    // Learn
    { url: `${baseUrl}/learn`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/learn/quick-start`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/learn/certificate`, lastModified: now, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/learn/rust-for-blockchain`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/learn/solana-vs-near`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/learn/for-solana-developers`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/learn/wallet-setup`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/learn/key-technologies`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/learn/why-rust`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/learn/rust-curriculum`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' },

    // Trophies / gamification
    { url: `${baseUrl}/trophies`, lastModified: now, priority: 0.5, changeFrequency: 'weekly' },
    { url: `${baseUrl}/profile/skills`, lastModified: now, priority: 0.5, changeFrequency: 'monthly' },

    // Legal
    { url: `${baseUrl}/legal/terms`, lastModified: now, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${baseUrl}/legal/privacy`, lastModified: now, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${baseUrl}/legal/cookies`, lastModified: now, priority: 0.2, changeFrequency: 'yearly' },
    { url: `${baseUrl}/legal/disclaimer`, lastModified: now, priority: 0.2, changeFrequency: 'yearly' },
    { url: `${baseUrl}/legal/acceptable-use`, lastModified: now, priority: 0.2, changeFrequency: 'yearly' },
  ];

  // ─── Explorer Modules (16) ────────────────────────────────────────────────

  const explorerSlugs = [
    'what-is-blockchain', 'what-is-near', 'create-a-wallet', 'your-first-transaction',
    'understanding-dapps', 'reading-smart-contracts', 'near-ecosystem-tour',
    'near-vs-other-chains', 'reading-the-explorer', 'defi-basics', 'choose-your-path',
    'nft-basics-on-near', 'staking-and-validators', 'daos-on-near',
    'staying-safe-in-web3', 'near-data-tools',
  ];

  // ─── Builder Modules (16) ─────────────────────────────────────────────────

  const builderSlugs = [
    'dev-environment-setup', 'rust-fundamentals', 'your-first-contract',
    'account-model-access-keys', 'state-management', 'near-cli-mastery',
    'testing-debugging', 'frontend-integration', 'token-standards',
    'nep-standards-deep-dive', 'building-a-dapp', 'security-best-practices',
    'upgrading-contracts', 'deployment', 'optimization', 'launch-checklist',
  ];

  // ─── Hacker Modules (11) ──────────────────────────────────────────────────

  const hackerSlugs = [
    'near-architecture-deep-dive', 'cross-contract-calls', 'advanced-storage',
    'chain-signatures', 'intents-chain-abstraction', 'shade-agents',
    'ai-agent-integration', 'mev-transaction-ordering', 'building-an-indexer',
    'multi-chain-with-near', 'production-patterns',
  ];

  // ─── Founder Modules (5) ──────────────────────────────────────────────────

  const founderSlugs = [
    'near-grants-funding', 'tokenomics-design', 'building-in-public',
    'pitching-your-project', 'revenue-models-for-dapps',
  ];

  // ─── Generate Module Entries ──────────────────────────────────────────────

  const moduleEntries = (track: string, slugs: string[]): MetadataRoute.Sitemap =>
    slugs.map((slug) => ({
      url: `${baseUrl}/learn/${track}/${slug}`,
      lastModified: now,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    }));

  // ─── Dynamic Pages from Supabase ──────────────────────────────────────────

  let projectEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];
  let opportunityEntries: MetadataRoute.Sitemap = [];

  try {
    const [projectSlugs, categories, opportunityIds] = await Promise.all([
      getAllProjectSlugs(),
      getAllCategories(),
      getAllOpportunityIds(),
    ]);

    projectEntries = projectSlugs.map(({ slug, updated_at }) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: updated_at ? new Date(updated_at) : now,
      priority: 0.7,
      changeFrequency: 'daily' as const,
    }));

    categoryEntries = categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: 'daily' as const,
    }));

    opportunityEntries = opportunityIds.map(({ id, updated_at }) => ({
      url: `${baseUrl}/opportunities/${id}`,
      lastModified: updated_at ? new Date(updated_at) : now,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    }));
  } catch {
    // Supabase unavailable at build time — skip dynamic entries gracefully
  }

  return [
    ...staticPages,
    ...moduleEntries('explorer', explorerSlugs),
    ...moduleEntries('builder', builderSlugs),
    ...moduleEntries('hacker', hackerSlugs),
    ...moduleEntries('founder', founderSlugs),
    ...categoryEntries,
    ...projectEntries,
    ...opportunityEntries,
  ];
}
