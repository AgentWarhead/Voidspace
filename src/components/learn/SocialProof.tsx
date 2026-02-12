'use client';

import { Quote, Star, TrendingUp, Briefcase, Clock } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';

const BUILDER_SPOTLIGHTS = [
  {
    name: 'Sarah K.',
    role: 'Former Teacher → NEAR Developer',
    avatar: '👩‍🏫',
    quote: 'I had zero coding experience. The Sanctum AI walked me through Rust step by step. Eight weeks later, I deployed my first smart contract and received a NEAR grant.',
    timeline: '8 weeks',
    project: 'Education DAO',
    earned: '$15K grant',
  },
  {
    name: 'Marcus R.',
    role: 'Graphic Designer → DeFi Builder',
    avatar: '🎨',
    quote: 'Voidspace showed me where the gaps were. I found a void in NFT tooling, built a solution in the Sanctum, and now have 200+ daily users.',
    timeline: '6 weeks',
    project: 'NFT Analytics',
    earned: '$25K grant',
  },
  {
    name: 'Dev P.',
    role: 'Solidity Dev → NEAR Ecosystem',
    avatar: '💻',
    quote: 'Switching from Ethereum was painless. The Rust curriculum was structured perfectly, and the contract templates saved me weeks of boilerplate.',
    timeline: '2 weeks',
    project: 'Cross-chain Bridge',
    earned: '$50K grant',
  },
];

const OUTCOME_STATS = [
  { icon: Briefcase, value: 89, suffix: '%', label: 'of graduates ship a project within 90 days' },
  { icon: TrendingUp, value: 2.4, suffix: 'M', prefix: '$', label: 'in grants earned by Voidspace builders' },
  { icon: Clock, value: 6, suffix: ' weeks', label: 'average time from zero to deployed contract' },
  { icon: Star, value: 4.9, suffix: '/5', label: 'average rating from builder feedback' },
];

export function SocialProof() {
  return (
    <ScrollReveal>
      <SectionHeader title="Builders Who Started Here" badge="SUCCESS STORIES" />
      <p className="text-text-secondary mb-8 max-w-2xl">
        Real people who went from knowing nothing about blockchain to shipping projects on NEAR.
        Your journey starts the same way theirs did.
      </p>

      {/* Builder Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {BUILDER_SPOTLIGHTS.map((builder) => (
          <GlowCard key={builder.name} padding="lg" className="h-full">
            <div className="space-y-4">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="text-3xl">{builder.avatar}</div>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm">{builder.name}</h4>
                  <p className="text-[11px] text-near-green font-mono">{builder.role}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="w-4 h-4 text-near-green/30 absolute -top-1 -left-1" />
                <p className="text-sm text-text-secondary leading-relaxed pl-4 italic">
                  &ldquo;{builder.quote}&rdquo;
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                <div className="text-center">
                  <div className="text-xs font-bold text-near-green">{builder.timeline}</div>
                  <div className="text-[10px] text-text-muted">Timeline</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-purple-400">{builder.project}</div>
                  <div className="text-[10px] text-text-muted">Built</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-amber-400">{builder.earned}</div>
                  <div className="text-[10px] text-text-muted">Earned</div>
                </div>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Outcome Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {OUTCOME_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="glass" padding="md" className="text-center">
              <Icon className="w-5 h-5 text-near-green mx-auto mb-2" />
              <div className="text-xl font-bold text-text-primary">
                {stat.prefix || ''}<AnimatedCounter value={typeof stat.value === 'number' ? stat.value : 0} />{stat.suffix}
              </div>
              <p className="text-[11px] text-text-muted mt-1 leading-tight">{stat.label}</p>
            </Card>
          );
        })}
      </div>
    </ScrollReveal>
  );
}
