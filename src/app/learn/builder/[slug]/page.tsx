import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BuilderModuleLayout } from './BuilderModuleLayout';

// ─── Module Registry ───────────────────────────────────────────────────────────

export interface BuilderModule {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  order: number;
}

export const BUILDER_MODULES: BuilderModule[] = [
  { slug: 'dev-environment-setup', title: 'Dev Environment Setup', description: 'Set up your local development environment for building on NEAR — Rust, near-cli, and everything you need.', readTime: '15 min', order: 1 },
  { slug: 'rust-fundamentals', title: 'Rust Fundamentals', description: 'Learn the Rust programming language essentials you need to write smart contracts on NEAR.', readTime: '25 min', order: 2 },
  { slug: 'your-first-contract', title: 'Your First Contract', description: 'Write, compile, and deploy your first Rust smart contract to the NEAR testnet.', readTime: '20 min', order: 3 },
  { slug: 'account-model-access-keys', title: 'Account Model & Access Keys', description: 'Understand NEAR\'s unique account model, access keys, and permission system.', readTime: '15 min', order: 4 },
  { slug: 'state-management', title: 'State Management', description: 'Master on-chain state storage patterns — collections, serialization, and gas-efficient data structures.', readTime: '18 min', order: 5 },
  { slug: 'near-cli-mastery', title: 'NEAR CLI Mastery', description: 'Become proficient with near-cli for deploying, calling, and managing contracts from the terminal.', readTime: '15 min', order: 6 },
  { slug: 'testing-debugging', title: 'Testing & Debugging', description: 'Write unit tests, integration tests, and debug your smart contracts effectively.', readTime: '18 min', order: 7 },
  { slug: 'frontend-integration', title: 'Frontend Integration', description: 'Connect your smart contract to a React frontend using near-api-js and wallet selectors.', readTime: '20 min', order: 8 },
  { slug: 'token-standards', title: 'Token Standards', description: 'Implement NEP-141 (fungible tokens) and NEP-171 (NFTs) on NEAR Protocol.', readTime: '18 min', order: 9 },
  { slug: 'nep-standards-deep-dive', title: 'NEP Standards Deep Dive', description: 'Explore NEAR Enhancement Proposals and how they shape the ecosystem\'s interoperability.', readTime: '15 min', order: 10 },
  { slug: 'building-a-dapp', title: 'Building a dApp', description: 'Put it all together — build a complete decentralized application from contract to frontend.', readTime: '30 min', order: 11 },
  { slug: 'security-best-practices', title: 'Security Best Practices', description: 'Learn common smart contract vulnerabilities and how to write secure Rust code on NEAR.', readTime: '18 min', order: 12 },
  { slug: 'upgrading-contracts', title: 'Upgrading Contracts', description: 'Safely upgrade deployed contracts — migration patterns, state versioning, and proxy contracts.', readTime: '15 min', order: 13 },
  { slug: 'deployment', title: 'Deployment', description: 'Deploy your contracts to mainnet — account setup, deployment strategies, and verification.', readTime: '15 min', order: 14 },
  { slug: 'optimization', title: 'Optimization', description: 'Optimize your contracts for gas efficiency, storage costs, and execution speed.', readTime: '15 min', order: 15 },
  { slug: 'launch-checklist', title: 'Launch Checklist', description: 'Everything you need to verify before shipping your dApp to production on NEAR mainnet.', readTime: '12 min', order: 16 },
  { slug: 'building-an-nft-contract', title: 'Building an NFT Contract', description: 'Implement NEP-171 NFTs with minting, royalties (NEP-199), and marketplace integration patterns.', readTime: '75 min', order: 17 },
  { slug: 'building-a-dao-contract', title: 'Building a DAO Contract', description: 'Governance contract architecture with proposals, voting, role-based permissions, and treasury management.', readTime: '70 min', order: 18 },
  { slug: 'defi-contract-patterns', title: 'DeFi Contract Patterns', description: 'AMM mechanics, constant product formula, liquidity pools, and swap contract architecture on NEAR.', readTime: '80 min', order: 19 },
  { slug: 'aurora-evm-compatibility', title: 'Aurora EVM Compatibility', description: 'Deploy Solidity contracts on NEAR via Aurora — EVM runtime, Rainbow Bridge, and dev tooling.', readTime: '55 min', order: 20 },
  { slug: 'wallet-selector-integration', title: 'Wallet Selector Integration', description: 'Multi-wallet support with @near-wallet-selector/core — sign-in flows and transaction signing UX.', readTime: '50 min', order: 21 },
  { slug: 'near-social-bos', title: 'NEAR Social & BOS', description: 'Build composable on-chain widgets with NEAR Social, Social DB, and the Blockchain Operating System.', readTime: '60 min', order: 22 },
];

// ─── Static Params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return BUILDER_MODULES.map((mod) => ({ slug: mod.slug }));
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mod = BUILDER_MODULES.find((m) => m.slug === slug);
  if (!mod) return { title: 'Module Not Found' };
  return {
    title: `${mod.title} — Builder Track | Voidspace`,
    description: mod.description,
    alternates: {
      canonical: `https://voidspace.io/learn/builder/${mod.slug}`,
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function BuilderModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moduleIndex = BUILDER_MODULES.findIndex((m) => m.slug === slug);
  if (moduleIndex === -1) notFound();

  const currentModule = BUILDER_MODULES[moduleIndex];
  const prevModule = moduleIndex > 0 ? BUILDER_MODULES[moduleIndex - 1] : null;
  const nextModule = moduleIndex < BUILDER_MODULES.length - 1 ? BUILDER_MODULES[moduleIndex + 1] : null;

  return (
    <BuilderModuleLayout
      currentModule={currentModule}
      prevModule={prevModule}
      nextModule={nextModule}
      totalModules={BUILDER_MODULES.length}
      currentIndex={moduleIndex}
    />
  );
}
