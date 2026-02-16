'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Opportunity } from '@/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  index?: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return { text: 'text-accent-cyan', border: 'border-accent-cyan/30', glow: 'hover:shadow-glow-cyan', bg: 'bg-accent-cyan', ring: 'stroke-accent-cyan' };
  if (score >= 60) return { text: 'text-warning', border: 'border-warning/30', glow: 'hover:shadow-[0_0_20px_rgba(255,165,2,0.3)]', bg: 'bg-warning', ring: 'stroke-warning' };
  return { text: 'text-text-muted', border: 'border-border-hover', glow: 'hover:shadow-[0_0_15px_rgba(136,136,136,0.15)]', bg: 'bg-text-muted', ring: 'stroke-text-muted' };
}

const difficultyConfig = {
  beginner: { emoji: '🟢', label: 'Beginner', cls: 'text-near-green bg-near-green/10' },
  intermediate: { emoji: '🟡', label: 'Intermediate', cls: 'text-warning bg-warning/10' },
  advanced: { emoji: '🔴', label: 'Advanced', cls: 'text-error bg-error/10' },
};

const competitionConfig = {
  low: { icon: '↓', label: 'Low', cls: 'text-near-green' },
  medium: { icon: '→', label: 'Med', cls: 'text-warning' },
  high: { icon: '↑', label: 'High', cls: 'text-error' },
};

function ScoreRing({ score }: { score: number }) {
  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 18;
  const filled = (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
      <svg className="w-12 h-12 sm:w-14 sm:h-14 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#222222" strokeWidth="2.5" />
        <circle
          cx="20" cy="20" r="18" fill="none"
          className={colors.ring}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className={cn('absolute text-xs sm:text-sm font-bold font-mono', colors.text)}>
        {Math.round(score)}
      </span>
    </div>
  );
}

export function OpportunityCard({ opportunity, index = 0 }: OpportunityCardProps) {
  const colors = getScoreColor(opportunity.gap_score);
  const diff = difficultyConfig[opportunity.difficulty] || difficultyConfig.beginner;
  const comp = competitionConfig[opportunity.competition_level] || competitionConfig.low;
  const categoryIcon = opportunity.category?.icon || '◈';
  const categoryName = opportunity.category?.name || 'Uncategorized';
  const isStrategic = opportunity.category?.is_strategic ?? false;
  const features = opportunity.suggested_features ?? [];
  const visibleFeatures = features.slice(0, 3);
  const extraCount = features.length - 3;

  return (
    <Link
      href={`/opportunities/${opportunity.id}`}
      className={cn(
        'group block rounded-lg bg-surface border border-border overflow-hidden',
        'transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] touch-manipulation',
        colors.glow,
        `hover:${colors.border}`
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Main content area */}
      <div className="p-3 sm:p-4 flex gap-3">
        {/* Left: info */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{categoryIcon}</span>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-text-muted truncate">
              {categoryName}
            </span>
          </div>
          <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {opportunity.title}
          </h3>
          {opportunity.description && (
            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 hidden sm:block">
              {opportunity.description}
            </p>
          )}
        </div>

        {/* Right: score ring */}
        <ScoreRing score={opportunity.gap_score} />
      </div>

      {/* Feature tags */}
      {visibleFeatures.length > 0 && (
        <div className="px-3 sm:px-4 pb-2 flex flex-wrap gap-1">
          {visibleFeatures.map((feat) => (
            <span
              key={feat}
              className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-hover border border-border text-text-muted truncate max-w-[120px] sm:max-w-[140px]"
            >
              {feat}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 text-text-muted">
              +{extraCount} more
            </span>
          )}
        </div>
      )}

      {/* Bottom metrics strip */}
      <div className="border-t border-border bg-void-gray/50 px-3 sm:px-4 py-2 flex items-center gap-1.5 sm:gap-2 flex-wrap text-[10px] sm:text-[11px] font-mono">
        <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded', diff.cls)}>
          {diff.emoji} {diff.label}
        </span>
        <span className={cn('inline-flex items-center gap-0.5', comp.cls)}>
          {comp.icon} {comp.label}
        </span>
        <span className="text-text-muted truncate hidden sm:inline">
          {categoryIcon} {categoryName}
        </span>
        {isStrategic && (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-tier-leviathan/10 text-tier-leviathan border border-tier-leviathan/20">
            ⚡ Strategic
          </span>
        )}
      </div>
    </Link>
  );
}
