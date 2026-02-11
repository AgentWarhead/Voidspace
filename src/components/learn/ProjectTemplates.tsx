import Link from 'next/link';
import { GitBranch, ExternalLink, Clock } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';

const TEMPLATES = [
  {
    emoji: '🪙',
    title: 'Fungible Token (NEP-141)',
    description: 'Complete token contract with mint, burn, transfer, and storage management. Production-ready boilerplate.',
    difficulty: 'BEGINNER',
    diffColor: 'text-green-400 bg-green-500/10 border-green-500/20',
    time: '30 min deploy',
    features: ['Mint & Burn', 'Transfer', 'Storage staking', 'Events'],
    repo: 'https://github.com/near-examples/FT',
    sanctumLink: '/sanctum?template=ft',
  },
  {
    emoji: '🖼️',
    title: 'NFT Collection (NEP-171)',
    description: 'Full NFT contract with metadata, royalties, enumeration, and approval management.',
    difficulty: 'BEGINNER',
    diffColor: 'text-green-400 bg-green-500/10 border-green-500/20',
    time: '45 min deploy',
    features: ['Mint & Transfer', 'Royalties', 'Enumeration', 'Approval'],
    repo: 'https://github.com/near-examples/NFT',
    sanctumLink: '/sanctum?template=nft',
  },
  {
    emoji: '🏛️',
    title: 'DAO Governance',
    description: 'Proposal system, voting, execution, and treasury management. Based on Sputnik DAO patterns.',
    difficulty: 'INTERMEDIATE',
    diffColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    time: '1 hr deploy',
    features: ['Proposals', 'Weighted voting', 'Auto-execution', 'Treasury'],
    repo: 'https://github.com/near-examples/dao',
    sanctumLink: '/sanctum?template=dao',
  },
  {
    emoji: '🔄',
    title: 'AMM / DEX',
    description: 'Automated market maker with liquidity pools, swaps, and fee distribution. Constant product formula.',
    difficulty: 'ADVANCED',
    diffColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    time: '2 hr deploy',
    features: ['Liquidity pools', 'Swap engine', 'Fee distribution', 'Slippage protection'],
    repo: 'https://github.com/near-examples/amm',
    sanctumLink: '/sanctum?template=amm',
  },
  {
    emoji: '🔐',
    title: 'Staking Vault',
    description: 'Lock tokens, earn rewards over time. Configurable lockup periods and reward rates.',
    difficulty: 'INTERMEDIATE',
    diffColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    time: '1 hr deploy',
    features: ['Stake & Unstake', 'Reward calculation', 'Lockup periods', 'Compounding'],
    repo: 'https://github.com/near-examples/staking',
    sanctumLink: '/sanctum?template=staking',
  },
  {
    emoji: '🎰',
    title: 'Prediction Market',
    description: 'Binary outcome betting with oracle resolution. Users bet on yes/no outcomes.',
    difficulty: 'ADVANCED',
    diffColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    time: '2 hr deploy',
    features: ['Create markets', 'Place bets', 'Oracle resolution', 'Payout distribution'],
    repo: 'https://github.com/near-examples/prediction-market',
    sanctumLink: '/sanctum?template=prediction',
  },
];

export function ProjectTemplates() {
  return (
    <ScrollReveal>
      <div id="templates">
        <SectionHeader title="Starter Templates" count={TEMPLATES.length} badge="CLONE & BUILD" />
        <p className="text-text-secondary mb-4 max-w-2xl">
          Don&apos;t start from scratch. Clone a battle-tested template, customize it in the Sanctum,
          and deploy. Each template includes a full walkthrough.
        </p>
        <div className="flex items-center gap-2 mb-8">
          <GitBranch className="w-4 h-4 text-near-green" />
          <span className="text-xs text-text-muted font-mono">git clone → customize → deploy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => (
            <GlowCard key={template.title} padding="lg" className="h-full group">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{template.emoji}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">{template.title}</h4>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${template.diffColor}`}>
                        {template.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-text-secondary leading-relaxed mb-3 flex-1">{template.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {template.features.map((f) => (
                    <span key={f} className="text-[10px] font-mono text-text-muted bg-surface-hover px-1.5 py-0.5 rounded border border-border/50">
                      {f}
                    </span>
                  ))}
                </div>

                {/* Time */}
                <div className="flex items-center gap-1 text-[11px] text-text-muted mb-3">
                  <Clock className="w-3 h-3" /> {template.time}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <a
                    href={template.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    <GitBranch className="w-3 h-3" /> Clone Repo <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <Link
                    href={template.sanctumLink}
                    className="flex items-center gap-1 text-xs text-near-green hover:text-near-green/80 transition-colors ml-auto"
                  >
                    Build in Sanctum →
                  </Link>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
