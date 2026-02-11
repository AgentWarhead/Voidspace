import Link from 'next/link';
import { Target, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';

const CATEGORIES = [
  {
    name: 'AI & Agents',
    status: 'OPEN VOID',
    statusColor: 'text-near-green bg-near-green/10',
    projects: 2,
    voidScore: 92,
    priority: true,
    description: 'Shade Agents, autonomous AI, TEE-based intelligence',
    href: '/opportunities?category=ai-agents',
  },
  {
    name: 'Privacy',
    status: 'OPEN VOID',
    statusColor: 'text-near-green bg-near-green/10',
    projects: 1,
    voidScore: 88,
    priority: true,
    description: 'ZK proofs, private transactions, confidential DeFi',
    href: '/opportunities?category=privacy',
  },
  {
    name: 'Intents & Abstraction',
    status: 'OPEN VOID',
    statusColor: 'text-near-green bg-near-green/10',
    projects: 3,
    voidScore: 85,
    priority: true,
    description: 'Cross-chain UX, solver networks, chain abstraction tooling',
    href: '/opportunities?category=intents',
  },
  {
    name: 'Data & Analytics',
    status: 'CLOSING',
    statusColor: 'text-amber-400 bg-amber-500/10',
    projects: 6,
    voidScore: 65,
    priority: true,
    description: 'On-chain intelligence, dashboards, indexing',
    href: '/opportunities?category=data',
  },
  {
    name: 'DeFi',
    status: 'CLOSING',
    statusColor: 'text-amber-400 bg-amber-500/10',
    projects: 8,
    voidScore: 58,
    priority: false,
    description: 'Lending, AMMs, yield vaults, derivatives',
    href: '/opportunities?category=defi',
  },
  {
    name: 'NFT & Gaming',
    status: 'CLOSING',
    statusColor: 'text-amber-400 bg-amber-500/10',
    projects: 7,
    voidScore: 52,
    priority: false,
    description: 'Marketplaces, gaming infra, social NFTs',
    href: '/opportunities?category=nft',
  },
  {
    name: 'RWA',
    status: 'OPEN VOID',
    statusColor: 'text-near-green bg-near-green/10',
    projects: 1,
    voidScore: 90,
    priority: true,
    description: 'Real-world assets, tokenized securities, property',
    href: '/opportunities?category=rwa',
  },
  {
    name: 'Social',
    status: 'CLOSING',
    statusColor: 'text-amber-400 bg-amber-500/10',
    projects: 5,
    voidScore: 60,
    priority: false,
    description: 'Decentralized social, identity, reputation',
    href: '/opportunities?category=social',
  },
];

export function EcosystemMap() {
  const openVoids = CATEGORIES.filter((c) => c.status === 'OPEN VOID').length;

  return (
    <ScrollReveal>
      <div id="ecosystem-map">
        <SectionHeader title="Where You Fit" badge="ECOSYSTEM MAP" />
        <p className="text-text-secondary mb-4 max-w-2xl">
          The NEAR ecosystem has gaps — categories with high demand but few builders.
          These &ldquo;voids&rdquo; are your opportunity. Find where your skills match a real need.
        </p>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-near-green" />
            <span className="text-near-green">Open Void</span>
            <span className="text-text-muted">— massive opportunity</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-amber-400">Closing</span>
            <span className="text-text-muted">— competition growing</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-purple-400">⭐ NEAR PRIORITY</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group"
            >
              <GlowCard padding="md" className="h-full">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text-primary group-hover:text-near-green transition-colors">
                      {cat.name}
                    </h4>
                    {cat.priority && (
                      <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-full border border-purple-500/20">
                        ⭐ PRIORITY
                      </span>
                    )}
                  </div>

                  {/* Void Score Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-text-muted">Void Score</span>
                      <span className="text-[10px] font-mono font-bold text-near-green">{cat.voidScore}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${cat.voidScore}%`,
                          background: cat.voidScore > 75
                            ? 'linear-gradient(90deg, #00EC97, #00EC97)'
                            : cat.voidScore > 50
                            ? 'linear-gradient(90deg, #f59e0b, #f59e0b)'
                            : 'linear-gradient(90deg, #6b7280, #6b7280)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Status + Projects */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${cat.statusColor}`}>
                      {cat.status}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{cat.projects} projects</span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-text-muted leading-relaxed">{cat.description}</p>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-[11px] text-near-green font-medium group-hover:translate-x-1 transition-transform">
                    Explore voids <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </GlowCard>
            </Link>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 rounded-xl bg-near-green/5 border border-near-green/10 text-center">
          <p className="text-sm text-text-secondary">
            <Target className="w-4 h-4 inline text-near-green mr-1" />
            <strong className="text-text-primary">{openVoids} open voids</strong> with high demand and few builders.
            These are the best opportunities in the NEAR ecosystem right now.
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}
