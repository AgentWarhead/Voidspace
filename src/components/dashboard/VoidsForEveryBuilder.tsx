'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import { GradientText } from '@/components/effects/GradientText';
import { COMPETITION_LABELS } from '@/lib/constants';
import type { Opportunity } from '@/types';

interface VoidsForEveryBuilderProps {
  opportunities: Opportunity[];
}

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const DIFFICULTY_META: Record<Difficulty, { label: string; tagline: string }> = {
  beginner: { label: 'Beginner', tagline: 'First smart contract? Start here.' },
  intermediate: { label: 'Intermediate', tagline: 'Complex integrations and DeFi.' },
  advanced: { label: 'Advanced', tagline: 'Novel cryptography and infrastructure.' },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function VoidsForEveryBuilder({ opportunities }: VoidsForEveryBuilderProps) {
  const [activeTab, setActiveTab] = useState<Difficulty>('beginner');

  const grouped: Record<Difficulty, Opportunity[]> = {
    beginner: opportunities.filter((o) => o.difficulty === 'beginner').slice(0, 3),
    intermediate: opportunities.filter((o) => o.difficulty === 'intermediate').slice(0, 3),
    advanced: opportunities.filter((o) => o.difficulty === 'advanced').slice(0, 3),
  };

  const tabs: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
  const currentOpps = grouped[activeTab];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
          Voids For Every Builder
        </GradientText>
        <p className="text-text-secondary mt-2 max-w-lg mx-auto text-sm">
          Whether you&apos;re writing your first smart contract or building cross-chain infrastructure — there&apos;s a void for you.
        </p>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex justify-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${
              activeTab === tab
                ? 'text-near-green bg-near-green/10 border border-near-green/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent'
            }`}
          >
            {DIFFICULTY_META[tab].label}
            <span className="text-[10px] font-mono text-text-muted ml-1.5">
              ({grouped[tab].length})
            </span>
          </button>
        ))}
      </div>

      {/* Tab Description */}
      <p className="text-center text-xs text-text-muted font-mono">
        {DIFFICULTY_META[activeTab].tagline}
      </p>

      {/* Opportunity Cards */}
      <motion.div
        key={activeTab}
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {currentOpps.length > 0 ? (
          currentOpps.map((opp) => (
            <motion.div key={opp.id} variants={item}>
              <Link href={`/opportunities/${opp.id}`}>
                <GlowCard padding="md">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-primary truncate">{opp.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {opp.category && (
                          <Badge variant="default" className="text-xs">
                            {opp.category.name}
                          </Badge>
                        )}
                        <Badge variant="competition" competition={opp.competition_level}>
                          {COMPETITION_LABELS[opp.competition_level]}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-20 shrink-0">
                      <GapScoreIndicator score={opp.gap_score} size="sm" />
                    </div>
                  </div>
                </GlowCard>
              </Link>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-sm text-text-muted py-4">
            No {DIFFICULTY_META[activeTab].label.toLowerCase()} voids available yet.
          </p>
        )}
      </motion.div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-near-green/30 text-text-secondary hover:text-near-green rounded-lg transition-colors text-sm"
        >
          See All Voids
        </Link>
      </div>
    </div>
  );
}
