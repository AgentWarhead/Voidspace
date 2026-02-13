'use client';

import { useState } from 'react';

interface CategoryPickerProps {
  onSelect: (categorySlug: string) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  onCustomStart: () => void;
}

interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
  tech?: string[];
  color: string;
  borderColor: string;
  beginner?: boolean;
}

// Popular categories - top 5, reduced for decision clarity
const POPULAR_CATEGORIES: Category[] = [
  {
    slug: 'ai-agents',
    name: 'AI & Shade Agents',
    icon: '🤖',
    description: 'Autonomous AI agents with Chain Signatures',
    tech: ['Shade Agents', 'TEEs', 'NEAR AI'],
    color: 'from-purple-500/20 to-indigo-500/20',
    borderColor: 'border-purple-500/30',
  },
  {
    slug: 'defi',
    name: 'DeFi',
    icon: '💰',
    description: 'Lending, yield, stablecoins',
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
  },
  {
    slug: 'nfts',
    name: 'NFTs & Digital Art',
    icon: '🎨',
    description: 'Collections, marketplaces, royalties',
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/30',
    beginner: true,
  },
  {
    slug: 'meme-tokens',
    name: 'Meme Coins & Tokens',
    icon: '🪙',
    description: 'Fungible tokens, meme coins, tax/burn mechanics',
    tech: ['NEP-141', 'Tokenomics', 'Fair Launch'],
    color: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
    beginner: true,
  },
  {
    slug: 'gaming',
    name: 'Gaming & Metaverse',
    icon: '🎮',
    description: 'GameFi, play-to-earn, in-game assets',
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-blue-500/30',
    beginner: true,
  },
];

// Advanced categories - for experienced developers
const ADVANCED_CATEGORIES: Category[] = [
  {
    slug: 'staking-rewards',
    name: 'Staking & Rewards',
    icon: '💎',
    description: 'Staking pools, lockups, reward distribution',
    tech: ['Staking', 'Vesting', 'Yield'],
    color: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
  },
  {
    slug: 'chain-signatures',
    name: 'Chain Signatures',
    icon: '✍️',
    description: 'Sign transactions on any blockchain from NEAR',
    tech: ['MPC', 'Cross-chain', 'Multi-chain wallets'],
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
  },
  {
    slug: 'social',
    name: 'Social & Creator',
    icon: '💬',
    description: 'Tipping, gated content, communities',
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
  },
  {
    slug: 'intents',
    name: 'Intents & Chain Abstraction',
    icon: '🔗',
    description: 'Cross-chain operations, define outcomes',
    tech: ['NEAR Intents', 'Chain Signatures', 'Omnibridge'],
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
  },
  {
    slug: 'privacy',
    name: 'Privacy',
    icon: '🔒',
    description: 'Private transactions, ZK proofs, anonymous voting',
    tech: ['ZK Proofs', 'Private transfers'],
    color: 'from-slate-500/20 to-zinc-500/20',
    borderColor: 'border-slate-500/30',
  },
  {
    slug: 'rwa',
    name: 'Real World Assets',
    icon: '🌍',
    description: 'Tokenize real assets, payments, oracles',
    tech: ['Oracles', 'Tokenization', 'Payments'],
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
  },
  {
    slug: 'dex-trading',
    name: 'DEX & Trading',
    icon: '📈',
    description: 'AMMs, order books, trading bots',
    color: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/30',
  },
  {
    slug: 'daos',
    name: 'DAOs & Governance',
    icon: '🏛️',
    description: 'Voting, treasury, multi-sig',
    color: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
  },
  {
    slug: 'dev-tools',
    name: 'Developer Tools',
    icon: '🛠️',
    description: 'SDKs, testing, libraries',
    color: 'from-gray-500/20 to-slate-500/20',
    borderColor: 'border-gray-500/30',
  },
  {
    slug: 'wallets',
    name: 'Wallets & Identity',
    icon: '👛',
    description: 'Account management, auth',
    color: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-500/30',
  },
  {
    slug: 'data-analytics',
    name: 'Data & Analytics',
    icon: '📊',
    description: 'Indexers, dashboards, oracles',
    color: 'from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-500/30',
  },
  {
    slug: 'prediction-markets',
    name: 'Prediction Markets',
    icon: '🎰',
    description: 'Betting, binary options, outcome markets',
    tech: ['Oracles', 'Resolution', 'Payouts'],
    color: 'from-fuchsia-500/20 to-pink-500/20',
    borderColor: 'border-fuchsia-500/30',
  },
  {
    slug: 'launchpads',
    name: 'Launchpads & IDOs',
    icon: '📱',
    description: 'Token launches, fair mints, IDO platforms',
    tech: ['Token Sales', 'Vesting', 'Whitelist'],
    color: 'from-rose-500/20 to-red-500/20',
    borderColor: 'border-rose-500/30',
  },
  {
    slug: 'bridges',
    name: 'Bridges & Cross-Chain',
    icon: '🌉',
    description: 'Wrapped tokens, cross-chain messaging',
    tech: ['Chain Signatures', 'Bridges', 'Relayers'],
    color: 'from-teal-500/20 to-cyan-500/20',
    borderColor: 'border-teal-500/30',
  },
  {
    slug: 'infrastructure',
    name: 'Infrastructure',
    icon: '🔧',
    description: 'RPC, validators, storage',
    color: 'from-neutral-500/20 to-stone-500/20',
    borderColor: 'border-neutral-500/30',
  },
];

export function CategoryPicker({ onSelect, customPrompt, setCustomPrompt, onCustomStart }: CategoryPickerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const renderCategoryCard = (cat: Category) => (
    <button
      key={cat.slug}
      onClick={() => onSelect(cat.slug)}
      className={`group relative p-4 rounded-xl border ${cat.borderColor} bg-gradient-to-br ${cat.color} hover:scale-[1.02] transition-all text-left`}
    >
      {/* Beginner Friendly badge */}
      {cat.beginner && (
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-near-green/10 text-near-green border border-near-green/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-near-green" />
          Beginner Friendly
        </span>
      )}
      <div className="flex items-start gap-3">
        <span className="text-2xl">{cat.icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-text-primary group-hover:text-near-green transition-colors">
            {cat.name}
          </h4>
          <p className="text-sm text-text-muted mt-1">{cat.description}</p>
          {cat.tech && (
            <div className="flex flex-wrap gap-1 mt-2">
              {cat.tech.map((t) => (
                <span key={t} className="px-2 py-0.5 text-xs bg-void-black/30 rounded text-text-secondary">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Build arrow — only show when no beginner badge (avoid overlap) */}
      {!cat.beginner && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-near-green text-sm">Build →</span>
        </div>
      )}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Custom Project — Elevated, above templates */}
      <div className="mb-10">
        <div className="rounded-2xl border border-near-green/20 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <span>✨</span> Describe Your Idea
            </h3>
            <p className="text-sm text-text-muted mt-1">
              Tell Sanctum what you want to build — in plain English
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onCustomStart()}
              placeholder="I want to build a token that rewards holders every time someone trades..."
              className="flex-1 px-4 py-4 rounded-xl bg-void-gray border border-border-subtle focus:border-near-green/50 focus:outline-none focus:ring-1 focus:ring-near-green/30 text-text-primary placeholder:text-text-muted transition-all text-base"
            />
            <button
              onClick={onCustomStart}
              disabled={!customPrompt.trim()}
              className="px-8 py-4 rounded-xl bg-near-green text-void-black font-bold text-base hover:bg-near-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-near-green/20 hover:shadow-near-green/40 whitespace-nowrap"
            >
              Start Building →
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-muted font-mono uppercase tracking-wider">— or pick a template —</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      {/* Popular Categories */}
      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">POPULAR</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_CATEGORIES.map((cat) => renderCategoryCard(cat))}
        </div>
      </div>

      {/* Advanced Categories Toggle */}
      <div className="mb-8">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-border-subtle bg-white/[0.02] hover:bg-white/[0.05] hover:border-text-muted text-text-secondary hover:text-text-primary transition-all mb-4"
        >
          <span className="text-sm font-medium">More Templates</span>
          <span className="px-1.5 py-0.5 text-xs bg-white/[0.08] rounded text-text-muted font-mono">{ADVANCED_CATEGORIES.length}</span>
          <span className={`text-text-muted transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showAdvanced ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {ADVANCED_CATEGORIES.map((cat) => renderCategoryCard(cat))}
          </div>
        </div>
      </div>
    </div>
  );
}
