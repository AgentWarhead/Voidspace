'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CategoryWithStats, Opportunity } from '@/types';

/* ── Prize Track Config ─────────────────────────────────── */

interface PrizeTrack {
  name: string;
  icon: string;
  description: string;
  categorySlugs: string[];
}

const PRIZE_TRACKS: PrizeTrack[] = [
  {
    name: 'The Private Web & Private Life',
    icon: '🔒',
    description:
      'Build consumer apps or Web3 widgets where privacy is the default across finance, assets, identity, and user data.',
    categorySlugs: ['privacy', 'wallets'],
  },
  {
    name: 'AI That Works for You',
    icon: '🤖',
    description:
      'Leverage NEAR\'s AI stack, including private cloud, private chat, Shade Agents, and agentic payments to build user-owned AI.',
    categorySlugs: ['ai-agents'],
  },
  {
    name: 'Open Society: Finance → Real World',
    icon: '🌐',
    description:
      'Build solutions that integrate stablecoins, tokenized assets, and NEAR Intents, or products that turn real-world facts into reliable on-chain outcomes.',
    categorySlugs: ['rwa', 'defi', 'intents'],
  },
  {
    name: 'Only on NEAR',
    icon: '⚡',
    description:
      'Exceptional use of NEAR-native capabilities such as account model, global contracts, chain abstraction, off-chain computation patterns, and Shade Agents.',
    categorySlugs: ['chain-signatures', 'bridges', 'dev-tools'],
  },
];

/* ── Score utilities ────────────────────────────────────── */

function getScoreTheme(score: number) {
  if (score >= 80)
    return {
      text: 'text-accent-cyan',
      ring: 'stroke-accent-cyan',
      glow: 'rgba(0,212,255,0.35)',
      gradient: 'from-accent-cyan/8 via-transparent to-near-green/6',
      border: 'border-accent-cyan/20 hover:border-accent-cyan/40',
      badge: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25',
    };
  if (score >= 60)
    return {
      text: 'text-warning',
      ring: 'stroke-warning',
      glow: 'rgba(255,165,2,0.30)',
      gradient: 'from-warning/8 via-transparent to-amber-400/5',
      border: 'border-warning/20 hover:border-warning/40',
      badge: 'bg-warning/10 text-warning border-warning/25',
    };
  return {
    text: 'text-text-muted',
    ring: 'stroke-text-muted',
    glow: 'rgba(136,136,136,0.15)',
    gradient: 'from-white/[0.03] via-transparent to-white/[0.02]',
    border: 'border-border-primary/40 hover:border-border-hover',
    badge: 'bg-white/5 text-text-muted border-white/10',
  };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-near-green bg-near-green/10 border-near-green/25',
  intermediate: 'text-warning bg-warning/10 border-warning/25',
  advanced: 'text-rose-400 bg-rose-400/10 border-rose-400/25',
};

/* ── Mini ScoreRing ─────────────────────────────────────── */

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
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 240, damping: 22 },
  },
};

/* ── Props ──────────────────────────────────────────────── */

interface PriorityVoidsProps {
  categories: CategoryWithStats[];
  opportunities: Opportunity[];
}

/* ── Main component ────────────────────────────────────── */

export function PriorityVoids({ categories, opportunities }: PriorityVoidsProps) {
  const [expandedTrack, setExpandedTrack] = useState<number | null>(null);

  // Build lookup: slug → category
  const catBySlug = (categories ?? []).reduce<Record<string, CategoryWithStats>>((acc, cat) => {
    acc[cat.slug] = cat;
    return acc;
  }, {});

  // Build lookup: category_id → opportunities
  const oppsByCatId = (opportunities ?? []).reduce<Record<string, Opportunity[]>>((acc, opp) => {
    const catId = opp?.category_id;
    if (!catId) return acc;
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(opp);
    return acc;
  }, {});

  // Total opportunity count
  const totalVoidCount = opportunities?.length ?? 0;

  // Build track data
  const trackData = PRIZE_TRACKS.map((track) => {
    const matchedCats = track.categorySlugs
      .map((slug) => catBySlug[slug])
      .filter(Boolean);

    const allOpps = matchedCats.flatMap((cat) => oppsByCatId[cat.id] ?? []);
    const topVoids = [...allOpps]
      .sort((a, b) => b.gap_score - a.gap_score)
      .slice(0, 3);

    const avgScore =
      matchedCats.length > 0
        ? matchedCats.reduce((sum, c) => sum + c.gapScore, 0) / matchedCats.length
        : 0;

    return {
      ...track,
      matchedCats,
      voidCount: allOpps.length,
      topVoids,
      avgScore,
    };
  });

  if (trackData.every((t) => t.voidCount === 0)) return null;

  return (
    <div className="space-y-8">
      {/* ── Track Cards Grid ───────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        {trackData.map((track, idx) => {
          const isExpanded = expandedTrack === idx;
          const theme = getScoreTheme(track.avgScore);

          return (
            <motion.div key={track.name} variants={cardVariant} className="col-span-1">
              {/* ── Track Card ─────────────────────────── */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpandedTrack(isExpanded ? null : idx)}
                onKeyDown={(e) => e.key === 'Enter' && setExpandedTrack(isExpanded ? null : idx)}
                className="cursor-pointer"
              >
                <motion.div
                  className={cn(
                    'relative rounded-xl overflow-hidden border transition-colors duration-300',
                    'bg-gradient-to-br bg-surface',
                    theme.gradient,
                    theme.border
                  )}
                  whileHover={{
                    y: -4,
                    boxShadow: `0 0 24px ${theme.glow}, 0 8px 32px rgba(0,0,0,0.3)`,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px] opacity-60"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${theme.glow}, transparent)`,
                    }}
                  />

                  <div className="relative z-10 p-4 space-y-3">
                    {/* Icon + score */}
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{track.icon}</span>
                      <MiniScoreRing score={track.avgScore} size={40} />
                    </div>

                    {/* Track name */}
                    <h3 className="font-bold text-text-primary text-sm leading-snug">
                      {track.name}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] text-text-muted leading-relaxed line-clamp-3">
                      {track.description}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border',
                          theme.badge
                        )}
                      >
                        <span className="opacity-70">◈</span>
                        {track.voidCount} void{track.voidCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {track.matchedCats.length} categor{track.matchedCats.length !== 1 ? 'ies' : 'y'}
                      </span>
                    </div>

                    {/* Expand hint */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-text-muted">
                        {isExpanded ? 'Hide top voids' : 'Show top voids'}
                      </span>
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

              {/* ── Expanded: top voids ────────────────── */}
              <AnimatePresence>
                {isExpanded && track.topVoids.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden mt-2 space-y-1.5"
                  >
                    {track.topVoids.map((opp, i) => {
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Explore All Link ───────────────────────────── */}
      {totalVoidCount > 0 && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/categories"
            className={cn(
              'group inline-flex items-center gap-2 text-sm font-medium',
              'text-text-secondary hover:text-accent-cyan transition-colors duration-200'
            )}
          >
            Explore all {totalVoidCount} ecosystem voids
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
