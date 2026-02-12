import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ExplorerModuleLayout } from './ExplorerModuleLayout';

// ─── Module Registry ───────────────────────────────────────────────────────────

export interface ExplorerModule {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  order: number;
}

export const EXPLORER_MODULES: ExplorerModule[] = [
  { slug: 'what-is-blockchain', title: 'What is Blockchain?', description: 'Discover the technology that\'s rewriting the rules of trust, ownership, and the internet itself.', readTime: '15 min', order: 1 },
  { slug: 'what-is-near', title: 'What is NEAR?', description: 'Meet the blockchain built for usability — fast, cheap, and designed for humans.', readTime: '12 min', order: 2 },
  { slug: 'create-a-wallet', title: 'Create a Wallet', description: 'Your passport to the decentralized world. Set up your first NEAR wallet in minutes.', readTime: '10 min', order: 3 },
  { slug: 'your-first-transaction', title: 'Your First Transaction', description: 'Send your first on-chain transaction and see the magic of trustless transfers.', readTime: '10 min', order: 4 },
  { slug: 'understanding-dapps', title: 'Understanding dApps', description: 'What makes an app "decentralized" — and why that matters for you.', readTime: '12 min', order: 5 },
  { slug: 'reading-smart-contracts', title: 'Reading Smart Contracts', description: 'Learn to read the code that runs the decentralized world — no coding required.', readTime: '15 min', order: 6 },
  { slug: 'near-ecosystem-tour', title: 'NEAR Ecosystem Tour', description: 'Explore DeFi, NFTs, DAOs, gaming, and AI projects thriving on NEAR.', readTime: '12 min', order: 7 },
  { slug: 'near-vs-other-chains', title: 'NEAR vs Other Chains', description: 'How NEAR stacks up against Ethereum, Solana, and Sui — speed, cost, and developer experience.', readTime: '10 min', order: 8 },
  { slug: 'reading-the-explorer', title: 'Reading the Explorer', description: 'Become a chain detective — decode blocks, transactions, and accounts on NearBlocks.', readTime: '12 min', order: 9 },
  { slug: 'defi-basics', title: 'DeFi Basics on NEAR', description: 'Swapping, staking, lending — unlock the financial layer of the decentralized world.', readTime: '15 min', order: 10 },
  { slug: 'choose-your-path', title: 'Choose Your Path', description: 'You\'ve explored the void. Now choose your destiny — Builder or Hacker?', readTime: '8 min', order: 11 },
  { slug: 'nft-basics-on-near', title: 'NFT Basics on NEAR', description: 'Unique digital assets — how NFTs work on NEAR, marketplaces, minting, and royalties.', readTime: '14 min', order: 12 },
  { slug: 'staking-and-validators', title: 'Staking & Validators', description: 'Earn rewards by securing the network — delegation, liquid staking, and validator selection.', readTime: '15 min', order: 13 },
  { slug: 'daos-on-near', title: 'DAOs on NEAR', description: 'Community-governed organizations — proposals, voting, treasury, and how to participate.', readTime: '14 min', order: 14 },
  { slug: 'staying-safe-in-web3', title: 'Staying Safe in Web3', description: 'Protect yourself from scams, phishing, and social engineering in the decentralized world.', readTime: '15 min', order: 15 },
  { slug: 'near-data-tools', title: 'NEAR Data Tools', description: 'On-chain intelligence — explore, analyze, and understand the NEAR ecosystem with data tools.', readTime: '13 min', order: 16 },
];

// ─── Static Params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return EXPLORER_MODULES.map((mod) => ({ slug: mod.slug }));
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mod = EXPLORER_MODULES.find((m) => m.slug === slug);
  if (!mod) return { title: 'Module Not Found' };
  return {
    title: `${mod.title} — Explorer Track | Voidspace`,
    description: mod.description,
    alternates: {
      canonical: `https://voidspace.io/learn/explorer/${mod.slug}`,
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function ExplorerModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moduleIndex = EXPLORER_MODULES.findIndex((m) => m.slug === slug);
  if (moduleIndex === -1) notFound();

  const currentModule = EXPLORER_MODULES[moduleIndex];
  const prevModule = moduleIndex > 0 ? EXPLORER_MODULES[moduleIndex - 1] : null;
  const nextModule = moduleIndex < EXPLORER_MODULES.length - 1 ? EXPLORER_MODULES[moduleIndex + 1] : null;

  return (
    <ExplorerModuleLayout
      currentModule={currentModule}
      prevModule={prevModule}
      nextModule={nextModule}
      totalModules={EXPLORER_MODULES.length}
      currentIndex={moduleIndex}
    />
  );
}
