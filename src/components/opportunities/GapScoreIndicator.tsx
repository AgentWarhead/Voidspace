'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GapScoreIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 67) return '#00EC97';
  if (score >= 34) return '#FFA502';
  return '#FF4757';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Deep Void';
  if (score >= 60) return 'Open Void';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Shallow';
  return 'Filled';
}

export function GapScoreIndicator({ score, size = 'md', showLabel = false }: GapScoreIndicatorProps) {
  const color = getScoreColor(score);

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs font-semibold" style={{ color }}>
          {score}
        </span>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#222222"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - score / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold" style={{ color }}>
              {score}
            </span>
          </div>
        </div>
        {showLabel && (
          <span className="text-sm text-text-secondary">{getScoreLabel(score)}</span>
        )}
      </div>
    );
  }

  // md (default) - horizontal bar
  return (
    <div className={cn('flex items-center gap-3', showLabel && 'flex-col items-start gap-1')}>
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="text-sm font-semibold min-w-[2rem] text-right" style={{ color }}>
          {score}
        </span>
      </div>
      {showLabel && (
        <span className="text-xs text-text-muted">{getScoreLabel(score)}</span>
      )}
    </div>
  );
}
