'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { ScanLine } from '@/components/effects/ScanLine';
import { cn } from '@/lib/utils';
import type { CategoryWithStats, Opportunity } from '@/types';

interface PriorityVoidsProps {
  categories: CategoryWithStats[];
  opportunities: Opportunity[];
}

/* ── Score utilities ────────────────────────────────────── */

function getScoreTheme(score: number) {
  if (score >= 80)
    return {
      text: 'text-accent-cyan',
      ring: 'stroke-accent-cyan',
      glow: 'rgba(0,212,255,0.35)',
      glowSoft: 'rgba(0,212,255,0.08)',
      gradient: 'from-accent-cyan/8 via-transparent to-near-green/6',
      border: 'border-accent-cyan/20 hover:border-accent-cyan/40',
      badge: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25',
      emojiGlow: '0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.15)',
    };
  if (score >= 60)
    return {
      text: 'text-warning',
      ring: 'stroke-warning',
      glow: 'rgba(255,165,2,0.30)',
      glowSoft: 'rgba(255,165,2,0.06)',
      gradient: 'from-warning/8 via-transparent to-amber-400/5',
      border: 'border-warning/20 hover:border-warning/40',
      badge: 'bg-warning/10 text-warning border-warning/25',
      emojiGlow: '0 0 18px rgba(255,165,2,0.35), 0 0 36px rgba(255,165,2,0.12)',
    };
  return {
    text: 'text-text-muted',
    ring: 'stroke-text-muted',
    glow: 'rgba(136,136,136,0.15)',
    glowSoft: 'rgba(136,136,136,0.04)',
    gradient: 'from-white/[0.03] via-transparent to-white/[0.02]',
    border: 'border-border-primary/40 hover:border-border-hover',
    badge: 'bg-white/5 text-text-muted border-white/10',
    emojiGlow: '0 0 12px rgba(136,136,136,0.2)',
  };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-near-green bg-near-green/10 border-near-green/25',
  intermediate: 'text-warning bg-warning/10 border-warning/25',
  advanced: 'text-rose-400 bg-rose-400/10 border-rose-400/25',
};

/* ── Mini ScoreRing (compact for category cards) ───────── */

function MiniScoreRing({ score, size = 36 }: { score: number; size?: number }) {
  const theme = getScoreTheme(score);
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={theme.ring}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <span className={cn('absolute text-[10px] font-bold font-mono', theme.text)}>
        {Math.round(score)}
      </span>
    </div>
  );
}

/* ── Stagger animation config ──────────────────────────── */

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
  },
};

/* ── Main component ────────────────────────────────────── */

export function PriorityVoids({ categories, opportunities }: PriorityVoidsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const oppsByCategory =
    opportunities?.reduce<Record<string, Opportunity[]>>((acc, opp) => {
      const catId = opp?.category_id;
      if (!catId) return acc;
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(opp);
      return acc;
    }, {}) ?? {};

  const visibleCategories = (categories ?? [])
    .filter((c) => (oppsByCategory[c.id]?.length ?? 0) > 0)
    .sort((a, b) => b.gapScore - a.gapScore);

  if (visibleCategories.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* ── Section Header ─────────────────────────────── */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent-cyan/40" />
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent-cyan/40" />
        </div>

        <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
          Here&apos;s What NEAR Needs
        </GradientText>

        <motion.p
          className="text-text-secondary max-w-md mx-auto text-sm"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Categories ranked by void density — where the biggest opportunities await.
        </motion.p>
      </div>

      {/* ── Category Grid ──────────────────────────────── */}
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
          const isHovered = hoveredCard === cat.id;
          const theme = getScoreTheme(cat.gapScore);

          return (
            <motion.div key={cat.id} variants={item} className="col-span-1">
              {/* ── Category Card ──────────────────────── */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpanded(isExpanded ? null : cat.id)}
                onKeyDown={(e) => e.key === 'Enter' && setExpanded(isExpanded ? null : cat.id)}
                onMouseEnter={() => setHoveredCard(cat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="cursor-pointer"
              >
                <motion.div
                  className={cn(
                    'relative rounded-lg overflow-hidden border transition-colors duration-300',
                    'bg-gradient-to-br',
                    theme.gradient,
                    'bg-surface',
                    theme.border
                  )}
                  whileHover={{
                    y: -4,
                    boxShadow: `0 0 24px ${theme.glow}, 0 8px 32px rgba(0,0,0,0.3)`,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Scan line on hover */}
                  {isHovered && <ScanLine />}

                  {/* Subtle top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px] opacity-60"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${theme.glow}, transparent)`,
                    }}
                  />

                  <div className="relative z-10 p-3 space-y-3">
                    {/* Top row: emoji + score ring */}
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <span
                          className="text-3xl block"
                          style={{
                            filter: isHovered ? `drop-shadow(${theme.emojiGlow})` : 'none',
                            transition: 'filter 0.3s ease',
                          }}
                        >
                          {cat.icon ?? '📦'}
                        </span>
                      </div>
                      <MiniScoreRing score={cat.gapScore} />
                    </div>

                    {/* Category name + description */}
                    <h3 className="font-semibold text-text-primary text-sm leading-snug truncate">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-[11px] text-text-muted leading-tight line-clamp-2">
                        {cat.description}
                      </p>
                    )}

                    {/* Badges row */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {cat.is_strategic && (
                        <Badge
                          variant="default"
                          className={cn(
                            'text-[10px] px-2 py-0.5 border font-semibold',
                            'bg-accent/10 text-accent border-accent/25'
                          )}
                        >
                          <span className="relative flex h-1.5 w-1.5 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                          </span>
                          Strategic
                        </Badge>
                      )}
                      <span className={cn(
                        'inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full border',
                        theme.badge
                      )}>
                        <span className="opacity-70">◈</span>
                        {count} void{count !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Expand indicator */}
                    <div className="flex items-center justify-end">
                      <motion.span
                        className="text-text-muted text-[10px]"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ── Expanded: top 3 voids ─────────────── */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden mt-2 space-y-1.5"
                  >
                    {topVoids.map((opp, i) => {
                      const oppTheme = getScoreTheme(opp.gap_score);
                      return (
                        <motion.div
                          key={opp.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <Link href={`/opportunities/${opp.id}`}>
                            <div
                              className={cn(
                                'group/void relative rounded-lg border p-2.5 transition-all duration-200',
                                'bg-surface-secondary/60 border-border-primary/40',
                                'hover:border-accent/30 hover:bg-surface-secondary',
                                'hover:shadow-[0_0_16px_rgba(0,236,151,0.1)]'
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-medium text-text-primary line-clamp-1 group-hover/void:text-white transition-colors">
                                    {opp.title}
                                  </h4>
                                  {opp.description && (
                                    <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5">
                                      {opp.description}
                                    </p>
                                  )}
                                </div>
                                <span className={cn('text-[11px] font-mono font-bold shrink-0', oppTheme.text)}>
                                  {opp.gap_score}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span
                                  className={cn(
                                    'text-[10px] border rounded-full px-1.5 py-0 font-medium capitalize',
                                    DIFFICULTY_COLORS[opp.difficulty] ?? 'text-text-muted bg-white/5 border-white/10'
                                  )}
                                >
                                  {opp.difficulty}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                    <Link
                      href={`/categories/${cat.slug}`}
                      className={cn(
                        'group/link block text-center text-[10px] font-medium py-1.5 rounded-md transition-all duration-200',
                        'text-accent hover:text-white hover:bg-accent/10'
                      )}
                    >
                      View all {count} voids
                      <span className="inline-block ml-1 transition-transform group-hover/link:translate-x-0.5">
                        →
                      </span>
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
