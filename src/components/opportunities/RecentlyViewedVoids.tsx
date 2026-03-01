/* ─── RecentlyViewedVoids ───────────────────────────────────────────────────
 * Horizontal strip showing the last ≤5 opportunity pages this browser visited.
 * Pure client-side — reads from localStorage via useRecentlyViewed.
 * Renders nothing if the user has no history.
 * ─────────────────────────────────────────────────────────────────────────── */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
// @ts-ignore
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RecentlyViewedItem } from '@/hooks/useRecentlyViewed';

interface RecentlyViewedVoidsProps {
  items: RecentlyViewedItem[];
}

// ── Score ring colour ────────────────────────────────────────────────────────

function scoreColor(score: number): { text: string; ring: string } {
  if (score >= 80) return { text: 'text-accent-cyan', ring: 'stroke-accent-cyan' };
  if (score >= 60) return { text: 'text-warning',     ring: 'stroke-warning' };
  return               { text: 'text-text-muted',     ring: 'stroke-text-muted' };
}

// ── Tiny score ring (28 px) ──────────────────────────────────────────────────

function MiniScoreRing({ score }: { score: number }) {
  const { text, ring } = scoreColor(score);
  const r = 11;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-7 h-7 flex-shrink-0">
      <svg className="w-7 h-7 -rotate-90" viewBox="0 0 26 26">
        <circle cx="13" cy="13" r={r} fill="none" stroke="#222222" strokeWidth="2" />
        <circle
          cx="13" cy="13" r={r}
          fill="none"
          className={ring}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
      </svg>
      <span className={cn('absolute text-[9px] font-bold font-mono leading-none', text)}>
        {Math.round(score)}
      </span>
    </div>
  );
}

// ── Individual card ──────────────────────────────────────────────────────────

function RecentCard({ item, index }: { item: RecentlyViewedItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
    >
      <Link
        href={`/opportunities/${item.id}`}
        className={cn(
          'group flex flex-col gap-2 min-w-[148px] max-w-[172px] p-3 rounded-xl',
          'bg-surface border border-border',
          'hover:border-border-hover hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]',
          'transition-all duration-200 active:scale-[0.97] touch-manipulation',
        )}
      >
        {/* Top row: icon + score */}
        <div className="flex items-center justify-between gap-1">
          <span
            className="text-base leading-none"
            aria-hidden="true"
            title={item.category_name}
          >
            {item.category_icon}
          </span>
          <MiniScoreRing score={item.gap_score} />
        </div>

        {/* Title */}
        <p className="text-xs font-medium text-text-primary leading-snug line-clamp-2 group-hover:text-near-green transition-colors">
          {item.title}
        </p>

        {/* Category label */}
        <p className="text-[10px] text-text-muted truncate">{item.category_name}</p>
      </Link>
    </motion.div>
  );
}

// ── Public component ─────────────────────────────────────────────────────────

export function RecentlyViewedVoids({ items }: RecentlyViewedVoidsProps) {
  if (items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      aria-label="Recently viewed opportunities"
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-xs uppercase tracking-wide text-text-muted font-mono">
          Recently Viewed
        </span>
      </div>

      {/* Scrollable strip */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {items.map((item, i) => (
          <RecentCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
