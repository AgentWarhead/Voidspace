import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://voidspace.io';
  const now = new Date();

  // ─── Static Pages ──────────────────────────────────────────────────────────

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, priority: 1.0, changeFrequency: 'weekly' },
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
    { url: `${baseUrl}/profile/skills`, lastModified: now, priority: 0.5, changeFrequency: 'monthly' },
  ];

  // ─── Explorer Modules (11) ────────────────────────────────────────────────

  const explorerSlugs = [
    'what-is-blockchain', 'what-is-near', 'create-a-wallet', 'your-first-transaction',
    'understanding-dapps', 'reading-smart-contracts', 'near-ecosystem-tour',
    'near-vs-other-chains', 'reading-the-explorer', 'defi-basics', 'choose-your-path',
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

  return [
    ...staticPages,
    ...moduleEntries('explorer', explorerSlugs),
    ...moduleEntries('builder', builderSlugs),
    ...moduleEntries('hacker', hackerSlugs),
    ...moduleEntries('founder', founderSlugs),
  ];
}
