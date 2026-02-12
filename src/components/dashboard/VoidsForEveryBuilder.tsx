'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import { COMPETITION_LABELS } from '@/lib/constants';
import type { Opportunity } from '@/types';

interface VoidsForEveryBuilderProps {
  opportunities: Opportunity[];
}

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const DIFFICULTY_META: Record<Difficulty, { label: string; emoji: string; color: string; bgColor: string; borderColor: string }> = {
  beginner: {
    label: 'Beginner',
    emoji: '🟢',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
  },
  intermediate: {
    label: 'Intermediate',
    emoji: '🟡',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/20',
  },
  advanced: {
    label: 'Advanced',
    emoji: '🔴',
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/20',
  },
};

function getGapScoreColor(score: number): string {
  if (score >= 80) return 'text-accent';
  if (score >= 60) return 'text-yellow-400';
  return 'text-text-muted';
}

function getGapScoreBg(score: number): string {
  if (score >= 80) return 'bg-accent/10 border-accent/20';
  if (score >= 60) return 'bg-yellow-400/10 border-yellow-400/20';
  return 'bg-surface-secondary border-border-primary';
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function VoidsForEveryBuilder({ opportunities }: VoidsForEveryBuilderProps) {
  const [collapsedMobile, setCollapsedMobile] = useState<Record<Difficulty, boolean>>({
    beginner: true,
    intermediate: true,
    advanced: true,
  });

  const allOpps = [...(opportunities ?? [])].sort((a, b) => b.gap_score - a.gap_score);

  const grouped: Record<Difficulty, Opportunity[]> = {
    beginner: allOpps.filter((o) => o?.difficulty === 'beginner'),
    intermediate: allOpps.filter((o) => o?.difficulty === 'intermediate'),
    advanced: allOpps.filter((o) => o?.difficulty === 'advanced'),
  };

  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

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

      {/* Desktop: 3-column layout | Mobile: stacked collapsible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((diff) => {
          const meta = DIFFICULTY_META[diff];
          const opps = grouped[diff]?.slice(0, 5) ?? [];
          const totalCount = grouped[diff]?.length ?? 0;
          const isCollapsed = collapsedMobile[diff];

          return (
            <div key={diff} className="space-y-2">
              {/* Column Header */}
              <button
                onClick={() =>
                  setCollapsedMobile((prev) => ({ ...prev, [diff]: !prev[diff] }))
                }
                className="w-full cursor-pointer"
              >
                <div className={`flex items-center justify-between rounded-lg px-3 py-2.5 border ${meta.bgColor} ${meta.borderColor}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{meta.emoji}</span>
                    <span className={`font-semibold text-sm ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      ({totalCount})
                    </span>
                  </div>
                  <span className="text-text-muted text-xs">
                    {isCollapsed ? '▼' : '▲'}
                  </span>
                </div>
              </button>

              {/* Cards — collapsible on all screen sizes */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-2"
                  >
                    <motion.div
                      variants={container}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      className="space-y-2"
                    >
                      {opps.length > 0 ? (
                        opps.map((opp) => (
                          <motion.div key={opp.id} variants={item}>
                            <Link href={`/opportunities/${opp.id}`}>
                              <GlowCard className="group" padding="sm">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
                                    {opp.title}
                                  </h4>

                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {opp.category && (
                                      <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                                        <span>{opp.category?.icon ?? '📦'}</span>
                                        <span>{opp.category?.name}</span>
                                      </span>
                                    )}
                                    <Badge variant="competition" competition={opp.competition_level}>
                                      {COMPETITION_LABELS[opp?.competition_level] ?? opp?.competition_level}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <span className={`text-xs font-mono font-bold border rounded px-1.5 py-0.5 ${getGapScoreColor(opp.gap_score)} ${getGapScoreBg(opp.gap_score)}`}>
                                      Void: {opp.gap_score}
                                    </span>
                                  </div>
                                </div>
                              </GlowCard>
                            </Link>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-text-muted py-4">
                          No {meta.label.toLowerCase()} voids yet.
                        </p>
                      )}
                    </motion.div>

                    {totalCount > 5 && (
                      <Link
                        href={`/opportunities?difficulty=${diff}`}
                        className={`block text-center text-xs font-medium py-2 rounded-lg border transition-all duration-200 hover:bg-surface-secondary ${meta.color} ${meta.borderColor}`}
                      >
                        View all {totalCount} {meta.label.toLowerCase()} voids →
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-secondary border border-border-primary hover:border-accent/30 text-text-secondary hover:text-accent rounded-lg transition-all duration-200 text-sm font-medium"
        >
          Explore All Voids
        </Link>
      </div>
    </div>
  );
}
