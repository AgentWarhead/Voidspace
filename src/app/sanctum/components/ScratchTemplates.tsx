'use client';

import { BarChart3, Image, Vote, Coins, LineChart, MessageCircle, BookOpen, Link2 } from 'lucide-react';

export interface ScratchTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  starterPrompt: string;
}

export const SCRATCH_TEMPLATES: ScratchTemplate[] = [
  {
    id: 'defi-dashboard',
    name: 'DeFi Dashboard',
    emoji: '📊',
    description: 'Token prices, portfolio tracking, swap interface',
    color: 'text-emerald-400',
    icon: BarChart3,
    starterPrompt: 'Build me a DeFi dashboard for NEAR Protocol. I want to see token prices with live charts, a portfolio tracker showing my NEAR and NEP-141 token balances, and a simple swap interface using Ref Finance. Include wallet connection with @hot-labs/near-connect, a clean dark theme, and responsive layout.',
  },
  {
    id: 'nft-gallery',
    name: 'NFT Gallery',
    emoji: '🖼️',
    description: 'Browse, mint, and trade NFTs on NEAR',
    color: 'text-purple-400',
    icon: Image,
    starterPrompt: 'Build me an NFT gallery dApp on NEAR. I want a grid layout to browse NFT collections, the ability to mint new NFTs with image upload and metadata, and a trading/marketplace section. Include wallet connect, NEAR wallet integration, collection filtering, and a sleek dark UI with card hover effects.',
  },
  {
    id: 'dao-voting',
    name: 'DAO Voting',
    emoji: '🗳️',
    description: 'Create proposals, vote, treasury view',
    color: 'text-blue-400',
    icon: Vote,
    starterPrompt: 'Build me a DAO voting dApp on NEAR. I need a proposal creation form with title/description/options, a voting interface where token holders can vote, a proposals list with status (active/passed/rejected), and a treasury dashboard showing the DAO balance. Include wallet connection and role-based access.',
  },
  {
    id: 'token-launchpad',
    name: 'Token Launchpad',
    emoji: '🚀',
    description: 'Create and launch NEP-141 tokens',
    color: 'text-amber-400',
    icon: Coins,
    starterPrompt: 'Build me a token launchpad on NEAR. I want a form to create new NEP-141 fungible tokens with name, symbol, total supply, and icon. Add a token list page showing launched tokens, a token detail page with distribution charts, and the ability to transfer tokens. Include wallet connection and clean forms.',
  },
  {
    id: 'portfolio-tracker',
    name: 'Portfolio Tracker',
    emoji: '📈',
    description: 'Multi-wallet tracking with charts',
    color: 'text-cyan-400',
    icon: LineChart,
    starterPrompt: 'Build me a portfolio tracker for NEAR wallets. I want to track multiple NEAR accounts, see token balances across all wallets, a chart showing portfolio value over time, transaction history, and staking positions. Include wallet connect, account search, and data visualization with charts.',
  },
  {
    id: 'social-dapp',
    name: 'Social dApp',
    emoji: '💬',
    description: 'Profiles, posts, and tipping on NEAR',
    color: 'text-pink-400',
    icon: MessageCircle,
    starterPrompt: 'Build me a social dApp on NEAR. I want user profiles tied to NEAR accounts, a feed of posts/messages, the ability to tip other users in NEAR, a follow system, and profile customization. Include wallet connection, real-time updates feel, and a modern social media-style UI.',
  },
  {
    id: 'guestbook',
    name: 'Guestbook',
    emoji: '📝',
    description: 'The NEAR hello-world. Perfect for learning.',
    color: 'text-teal-400',
    icon: BookOpen,
    starterPrompt: 'Build me a simple guestbook contract on NEAR. Users can post messages tied to their NEAR account, view all messages, and optionally tip the poster. Include proper Borsh serialization, unit tests, and clear comments explaining each part. This is a learning project — explain everything.',
  },
  {
    id: 'cross-contract-call',
    name: 'Cross-Contract Call',
    emoji: '🔗',
    description: 'Contract that talks to other contracts',
    color: 'text-indigo-400',
    icon: Link2,
    starterPrompt: 'Build me a NEAR smart contract that demonstrates cross-contract calls using Promises. Create a main contract that calls an external token contract to check balances and transfer tokens. Show proper callback handling, gas attachment, and error recovery patterns. Include both the caller and callee contracts.',
  },
];

interface ScratchTemplatesProps {
  onSelect: (template: ScratchTemplate) => void;
  selectedId: string | null;
}

export function ScratchTemplates({ onSelect, selectedId }: ScratchTemplatesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {SCRATCH_TEMPLATES.map((template) => {
        const Icon = template.icon;
        const isSelected = selectedId === template.id;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`group p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
              isSelected
                ? 'border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                : 'border-white/[0.08] bg-white/[0.03] hover:border-amber-500/30 hover:bg-amber-500/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected ? 'bg-amber-500/20' : 'bg-white/[0.05] group-hover:bg-amber-500/10'
              }`}>
                <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-text-muted group-hover:text-amber-400'}`} />
              </div>
              <div>
                <h4 className={`font-semibold text-sm mb-1 transition-colors ${
                  isSelected ? 'text-amber-400' : 'text-text-primary group-hover:text-amber-400'
                }`}>
                  {template.emoji} {template.name}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">{template.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
