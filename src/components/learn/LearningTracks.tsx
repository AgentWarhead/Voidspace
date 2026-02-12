'use client';

import Link from 'next/link';
import { Code2, Brain, BarChart3, Shield } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';

const TRACKS = [
  {
    icon: Code2,
    title: 'Smart Contract Builder',
    difficulty: 'INTERMEDIATE',
    diffColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'Master Rust and NEAR smart contracts. Build fungible tokens, NFTs, DAOs, and DeFi protocols from scratch.',
    skills: ['Rust fundamentals', 'near-sdk-rs', 'Token standards', 'Cross-contract calls'],
    href: '/sanctum',
    cta: 'Enter Sanctum',
    accent: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400 bg-amber-500/10',
  },
  {
    icon: Brain,
    title: 'AI & Agents Pioneer',
    difficulty: 'ADVANCED',
    diffColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Build autonomous AI agents on NEAR. Learn about TEEs, Shade Agents, and the intersection of AI and blockchain.',
    skills: ['Shade Agents', 'TEE architecture', 'On-chain AI', 'Agent orchestration'],
    href: '/opportunities?category=ai-agents',
    cta: 'Explore AI Voids',
    accent: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400 bg-purple-500/10',
  },
  {
    icon: BarChart3,
    title: 'DeFi Architect',
    difficulty: 'ADVANCED',
    diffColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Design and deploy DeFi protocols. AMMs, lending, staking, prediction markets — master the financial primitives.',
    skills: ['AMM mechanics', 'Yield optimization', 'Liquidity pools', 'Risk management'],
    href: '/opportunities?category=defi',
    cta: 'Explore DeFi Voids',
    accent: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-400 bg-cyan-500/10',
  },
  {
    icon: Shield,
    title: 'Security Specialist',
    difficulty: 'EXPERT',
    diffColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    description: 'Audit and secure smart contracts. Learn common vulnerabilities, formal verification, and security best practices.',
    skills: ['Reentrancy guards', 'Access control', 'Formal verification', 'Audit methodology'],
    href: '/sanctum?mode=advanced',
    cta: 'Advanced Sanctum',
    accent: 'from-red-500/20 to-rose-500/20',
    iconColor: 'text-red-400 bg-red-500/10',
  },
];

export function LearningTracks() {
  return (
    <ScrollReveal>
      <div id="tracks">
        <SectionHeader title="Learning Tracks" count={TRACKS.length} badge="CHOOSE YOUR PATH" />
        <p className="text-text-secondary mb-6 max-w-2xl">
          Pick a track based on your interests and skill level. Each path leads to real, deployable projects on NEAR.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <GlowCard key={track.title} padding="lg" className="h-full group">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${track.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{track.title}</h3>
                        <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${track.diffColor}`}>
                          {track.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed">{track.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {track.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-mono text-text-muted bg-surface-hover px-2 py-1 rounded-md border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={track.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-near-green hover:text-near-green/80 transition-colors group-hover:translate-x-1 transition-transform"
                  >
                    {track.cta} →
                  </Link>
                </div>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </ScrollReveal>
  );
}
