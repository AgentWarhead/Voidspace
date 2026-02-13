'use client';

import { useState } from 'react';

interface CategoryLearnBannerProps {
  category: string;
  mode: string;
}

const CATEGORY_LEARNING: Record<string, { emoji: string; title: string; concepts: string[] }> = {
  defi: {
    emoji: '🏦',
    title: 'DeFi on NEAR',
    concepts: [
      'Token standards (NEP-141) and the fungible token interface',
      'Liquidity pools and Automated Market Makers (AMMs)',
      'Flash loans and their security considerations',
      'Storage staking and NEAR\'s unique account model',
      'Cross-contract calls for composable DeFi',
    ],
  },
  nfts: {
    emoji: '🎨',
    title: 'NFTs on NEAR',
    concepts: [
      'NEP-171 standard and metadata extensions',
      'Royalty enforcement with NEP-199',
      'Enumeration and approval management',
      'On-chain vs off-chain metadata (IPFS, Arweave)',
      'Marketplace integration patterns',
    ],
  },
  daos: {
    emoji: '🏛️',
    title: 'DAOs on NEAR',
    concepts: [
      'Proposal lifecycle and voting mechanisms',
      'Role-based access control (RBAC)',
      'Treasury management and multi-sig patterns',
      'Sputnik DAO v2 architecture',
      'On-chain governance best practices',
    ],
  },
  gaming: {
    emoji: '🎮',
    title: 'Gaming on NEAR',
    concepts: [
      'In-game token economies and reward systems',
      'NFT-based game assets and composability',
      'Randomness on-chain (commit-reveal schemes)',
      'Gas-efficient batch operations for game state',
      'Play-to-earn mechanics and anti-cheat patterns',
    ],
  },
  'ai-agents': {
    emoji: '🤖',
    title: 'AI Agents on NEAR',
    concepts: [
      'Autonomous agent architecture on NEAR',
      'TEE (Trusted Execution Environment) integration',
      'Chain Signatures for multi-chain control',
      'Key management and delegation patterns',
      'Agent-to-agent communication protocols',
    ],
  },
  'chain-signatures': {
    emoji: '🔗',
    title: 'Chain Signatures',
    concepts: [
      'MPC threshold signing fundamentals',
      'Deriving keys for foreign chains (BTC, ETH, SOL)',
      'Cross-chain transaction construction',
      'Payload signing and verification',
      'Security model of NEAR\'s MPC network',
    ],
  },
  'meme-tokens': {
    emoji: '🐸',
    title: 'Meme Tokens on NEAR',
    concepts: [
      'Fungible token creation with NEP-141',
      'Bonding curves and fair launch mechanics',
      'Liquidity bootstrapping strategies',
      'Anti-rug-pull safety patterns',
      'Community governance integration',
    ],
  },
  'staking-rewards': {
    emoji: '🥩',
    title: 'Staking & Rewards',
    concepts: [
      'Staking pool mechanics and reward distribution',
      'Validator selection and delegation',
      'Liquid staking token design',
      'Reward calculation and compounding',
      'Slashing protection patterns',
    ],
  },
  'dex-trading': {
    emoji: '📊',
    title: 'DEX & Trading',
    concepts: [
      'AMM mathematics (constant product, stable swap)',
      'Order book mechanics on NEAR',
      'Slippage protection and MEV resistance',
      'Multi-hop routing and path optimization',
      'Limit orders via callback patterns',
    ],
  },
  social: {
    emoji: '👥',
    title: 'Social on NEAR',
    concepts: [
      'Social graph storage patterns',
      'Content-gated access with token ownership',
      'Tipping and micro-payment flows',
      'NEAR Social (BOS) widget architecture',
      'Creator economy and fan token design',
    ],
  },
};

export function CategoryLearnBanner({ category, mode }: CategoryLearnBannerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Only show in learn mode
  if (mode !== 'learn') return null;

  const info = CATEGORY_LEARNING[category];
  if (!info) return null;

  return (
    <div className="mx-4 mt-3 rounded-xl border border-near-green/20 bg-near-green/5 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{info.emoji}</span>
          <span className="text-sm font-medium text-near-green">
            {info.title} — What You&apos;ll Learn:
          </span>
        </div>
        <span className="text-xs text-text-muted">{isCollapsed ? '▶' : '▼'}</span>
      </button>

      {!isCollapsed && (
        <div className="px-4 pb-4">
          <ul className="space-y-1.5">
            {info.concepts.map((concept, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-near-green/60 mt-0.5">•</span>
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
