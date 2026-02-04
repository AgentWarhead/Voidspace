'use client';

import { useState } from 'react';

interface CategoryPickerProps {
  onSelect: (categorySlug: string) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  onCustomStart: () => void;
}

// NEAR Strategic Priority Categories (what the NEAR team is pushing)
const NEAR_PRIORITIES = [
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
    slug: 'intents',
    name: 'Intents & Chain Abstraction',
    icon: '🔗',
    description: 'Cross-chain operations, define outcomes',
    tech: ['NEAR Intents', 'Chain Signatures', 'Omnibridge'],
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
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
];

// Standard Voidspace Categories
const STANDARD_CATEGORIES = [
  { slug: 'defi', name: 'DeFi', icon: '💰', description: 'Lending, yield, stablecoins' },
  { slug: 'dex-trading', name: 'DEX & Trading', icon: '📈', description: 'AMMs, order books, trading bots' },
  { slug: 'gaming', name: 'Gaming & Metaverse', icon: '🎮', description: 'GameFi, play-to-earn, in-game assets' },
  { slug: 'nfts', name: 'NFTs & Digital Art', icon: '🎨', description: 'Collections, marketplaces, royalties' },
  { slug: 'daos', name: 'DAOs & Governance', icon: '🏛️', description: 'Voting, treasury, multi-sig' },
  { slug: 'social', name: 'Social & Creator', icon: '💬', description: 'Tipping, gated content, communities' },
  { slug: 'dev-tools', name: 'Developer Tools', icon: '🛠️', description: 'SDKs, testing, libraries' },
  { slug: 'wallets', name: 'Wallets & Identity', icon: '👛', description: 'Account management, auth' },
  { slug: 'data-analytics', name: 'Data & Analytics', icon: '📊', description: 'Indexers, dashboards, oracles' },
  { slug: 'infrastructure', name: 'Infrastructure', icon: '🔧', description: 'RPC, validators, storage' },
];

export function CategoryPicker({ onSelect, customPrompt, setCustomPrompt, onCustomStart }: CategoryPickerProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  return (
    <div className="max-w-5xl mx-auto">
      {/* NEAR Priorities Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-near-green">⭐</span>
          <h3 className="text-lg font-semibold text-text-primary">NEAR Superpowers</h3>
          <span className="px-2 py-0.5 text-xs bg-near-green/20 text-near-green rounded-full">Strategic Priority</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NEAR_PRIORITIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onSelect(cat.slug)}
              className={`group relative p-4 rounded-xl border ${cat.borderColor} bg-gradient-to-br ${cat.color} hover:scale-[1.02] transition-all text-left`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary group-hover:text-near-green transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-sm text-text-muted mt-1">{cat.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cat.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-xs bg-void-black/30 rounded text-text-secondary">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-near-green text-sm">Build →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Standard Categories */}
      <div className="mb-8">
        <button
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="flex items-center gap-2 mb-4 text-text-secondary hover:text-text-primary transition-colors"
        >
          <span>📦</span>
          <h3 className="text-lg font-semibold">More Categories</h3>
          <span className="text-sm">({STANDARD_CATEGORIES.length})</span>
          <span className={`transition-transform ${showAllCategories ? 'rotate-180' : ''}`}>▼</span>
        </button>
        
        {showAllCategories && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {STANDARD_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => onSelect(cat.slug)}
                className="group p-3 rounded-lg border border-border-subtle bg-void-gray/30 hover:bg-void-gray/50 hover:border-near-green/30 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium text-text-primary text-sm group-hover:text-near-green transition-colors">
                    {cat.name}
                  </span>
                </div>
                <p className="text-xs text-text-muted">{cat.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Project */}
      <div className="border-t border-border-subtle pt-8">
        <div className="flex items-center gap-2 mb-4">
          <span>✨</span>
          <h3 className="text-lg font-semibold text-text-primary">Or describe your own project...</h3>
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onCustomStart()}
            placeholder="I want to build a token that rewards holders every time someone trades..."
            className="flex-1 px-4 py-3 rounded-xl bg-void-gray border border-border-subtle focus:border-near-green/50 focus:outline-none focus:ring-1 focus:ring-near-green/30 text-text-primary placeholder:text-text-muted transition-all"
          />
          <button
            onClick={onCustomStart}
            disabled={!customPrompt.trim()}
            className="px-6 py-3 rounded-xl bg-near-green text-void-black font-semibold hover:bg-near-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Start Building →
          </button>
        </div>
      </div>
    </div>
  );
}
