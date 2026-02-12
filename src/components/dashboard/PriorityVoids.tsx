'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import type { CategoryWithStats, Opportunity } from '@/types';

interface PriorityVoidsProps {
  categories: CategoryWithStats[];
  opportunities: Opportunity[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  advanced: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

function getGapScoreColor(score: number): string {
  if (score >= 80) return 'text-accent';
  if (score >= 60) return 'text-yellow-400';
  return 'text-text-muted';
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function PriorityVoids({ categories, opportunities }: PriorityVoidsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Build category → opportunity mapping
  const oppsByCategory = opportunities?.reduce<Record<string, Opportunity[]>>((acc, opp) => {
    const catId = opp?.category_id;
    if (!catId) return acc;
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(opp);
    return acc;
  }, {}) ?? {};

  // Filter categories that have voids, sort by gap score
  const visibleCategories = (categories ?? [])
    .filter((c) => (oppsByCategory[c.id]?.length ?? 0) > 0)
    .sort((a, b) => b.gapScore - a.gapScore);

  if (visibleCategories.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
          Here&apos;s What NEAR Needs
        </GradientText>
        <p className="text-text-secondary mt-2 max-w-lg mx-auto text-sm">
          Categories ranked by void density. Click to explore the top opportunities in each area.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        {visibleCategories.map((cat) => {
          const catOpps = oppsByCategory[cat.id] ?? [];
          const count = catOpps.length;
          const topVoids = [...catOpps]
            .sort((a, b) => b.gap_score - a.gap_score)
            .slice(0, 3);
          const isExpanded = expanded === cat.id;

          return (
            <motion.div key={cat.id} variants={item} className="col-span-1">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpanded(isExpanded ? null : cat.id)}
                onKeyDown={(e) => e.key === 'Enter' && setExpanded(isExpanded ? null : cat.id)}
                className="cursor-pointer"
              >
                <GlowCard className="h-full" padding="sm">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{cat.icon ?? '📦'}</span>
                        <h3 className="font-semibold text-text-primary text-sm truncate">
                          {cat.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-text-muted">
                        {count} void{count !== 1 ? 's' : ''}
                      </span>
                      {cat.is_strategic && (
                        <Badge variant="default" className="bg-accent/10 text-accent text-[10px] px-1.5 py-0 border border-accent/20">
                          Strategic
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-mono font-bold ${getGapScoreColor(cat.gapScore)}`}>
                        Gap: {cat.gapScore}
                      </span>
                      <span className="text-text-muted">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                </GlowCard>
              </div>

              {/* Expanded: top 3 voids */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-1.5 space-y-1.5"
                  >
                    {topVoids.map((opp) => (
                      <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                        <div className="rounded-lg bg-surface-secondary/60 border border-border-primary/50 p-2.5 hover:border-accent/30 hover:bg-surface-secondary transition-all duration-200">
                          <h4 className="text-xs font-medium text-text-primary line-clamp-1">
                            {opp.title}
                          </h4>
                          {opp.description && (
                            <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5">
                              {opp.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`text-[10px] border rounded px-1 py-0 ${DIFFICULTY_COLORS[opp.difficulty] ?? 'text-text-muted'}`}>
                              {opp.difficulty}
                            </span>
                            <span className={`text-[10px] font-mono font-bold ${getGapScoreColor(opp.gap_score)}`}>
                              {opp.gap_score}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="block text-center text-[10px] text-accent hover:text-accent/80 font-medium py-1 transition-colors"
                    >
                      View all {count} voids →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
