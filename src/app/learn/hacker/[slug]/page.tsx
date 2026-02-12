import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { HackerModuleLayout } from './HackerModuleLayout';

// ─── Module Registry ───────────────────────────────────────────────────────────

export interface HackerModule {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  order: number;
}

export const HACKER_MODULES: HackerModule[] = [
  { slug: 'near-architecture-deep-dive', title: 'NEAR Architecture Deep Dive', description: 'Understand NEAR\'s sharded architecture, Nightshade consensus, and how blocks are produced and finalized.', readTime: '20 min', order: 1 },
  { slug: 'cross-contract-calls', title: 'Cross-Contract Calls', description: 'Master asynchronous cross-contract calls, callbacks, and promise-based patterns on NEAR.', readTime: '18 min', order: 2 },
  { slug: 'advanced-storage', title: 'Advanced Storage', description: 'Deep dive into storage staking, efficient data structures, and cost optimization patterns.', readTime: '18 min', order: 3 },
  { slug: 'chain-signatures', title: 'Chain Signatures', description: 'Use NEAR\'s MPC chain signatures to sign transactions on any blockchain from a NEAR account.', readTime: '20 min', order: 4 },
  { slug: 'intents-chain-abstraction', title: 'Intents & Chain Abstraction', description: 'Build with NEAR\'s intent-based architecture for seamless cross-chain user experiences.', readTime: '20 min', order: 5 },
  { slug: 'shade-agents', title: 'Shade Agents', description: 'Build autonomous AI agents that can interact with NEAR Protocol and execute on-chain actions.', readTime: '18 min', order: 6 },
  { slug: 'ai-agent-integration', title: 'AI Agent Integration', description: 'Integrate AI models with smart contracts for intelligent on-chain decision making.', readTime: '18 min', order: 7 },
  { slug: 'mev-transaction-ordering', title: 'MEV & Transaction Ordering', description: 'Understand MEV on NEAR, transaction ordering, and how to protect your users from extraction.', readTime: '15 min', order: 8 },
  { slug: 'building-an-indexer', title: 'Building an Indexer', description: 'Build custom indexers using NEAR Lake Framework to process and query on-chain data efficiently.', readTime: '20 min', order: 9 },
  { slug: 'multi-chain-with-near', title: 'Multi-Chain with NEAR', description: 'Leverage NEAR as a coordination layer for multi-chain applications and cross-chain workflows.', readTime: '18 min', order: 10 },
  { slug: 'production-patterns', title: 'Production Patterns', description: 'Battle-tested patterns for production NEAR dApps — monitoring, upgrades, and incident response.', readTime: '18 min', order: 11 },
];

// ─── Static Params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return HACKER_MODULES.map((mod) => ({ slug: mod.slug }));
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mod = HACKER_MODULES.find((m) => m.slug === slug);
  if (!mod) return { title: 'Module Not Found' };
  return {
    title: `${mod.title} — Hacker Track | Voidspace`,
    description: mod.description,
    alternates: {
      canonical: `https://voidspace.io/learn/hacker/${mod.slug}`,
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function HackerModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moduleIndex = HACKER_MODULES.findIndex((m) => m.slug === slug);
  if (moduleIndex === -1) notFound();

  const currentModule = HACKER_MODULES[moduleIndex];
  const prevModule = moduleIndex > 0 ? HACKER_MODULES[moduleIndex - 1] : null;
  const nextModule = moduleIndex < HACKER_MODULES.length - 1 ? HACKER_MODULES[moduleIndex + 1] : null;

  return (
    <HackerModuleLayout
      currentModule={currentModule}
      prevModule={prevModule}
      nextModule={nextModule}
      totalModules={HACKER_MODULES.length}
      currentIndex={moduleIndex}
    />
  );
}
