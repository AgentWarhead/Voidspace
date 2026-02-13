'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GradientText } from '@/components/effects/GradientText';
import {
  TRACK_CONFIG, TOTAL_MODULES, RotateCcw,
  type TrackId, type Level,
} from './constellation-data';

/* ─── Progress Ring ────────────────────────────────────────── */

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;

  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={radius} fill="none"
          stroke="url(#ring-gradient)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00EC97" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-near-green font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {completed}
        </motion.span>
        <span className="text-[10px] text-text-muted">/ {total} modules</span>
      </div>
    </div>
  );
}

/* ─── Track Summary Card ───────────────────────────────────── */

function TrackSummary({
  trackId,
  stats,
}: {
  trackId: TrackId;
  stats: { completed: number; total: number; earnedXP: number; totalXP: number; pct: number };
}) {
  const config = TRACK_CONFIG[trackId];
  const Icon = config.icon;
  const isMastered = stats.pct === 100;

  return (
    <div className={cn('relative p-4 rounded-xl bg-surface/60 border space-y-3 overflow-hidden transition-all duration-500',
      isMastered ? 'border-yellow-500/40' : 'border-border/50')}>
      {/* Mastered overlay */}
      {isMastered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/10 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500/15 border border-yellow-500/30 rounded-full px-2 py-0.5">
            <span className="text-[9px] font-bold text-yellow-400">MASTERED ✨</span>
          </div>
        </motion.div>
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center border', config.bg, config.border)}>
            <Icon className={cn('w-5 h-5', config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className={cn('text-sm font-bold', config.color)}>{config.label}</h4>
              <span className="text-xs font-mono text-text-muted">{stats.completed}/{stats.total}</span>
            </div>
            <p className="text-[10px] text-text-muted">{config.description}</p>
          </div>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/30 mt-3">
          <motion.div
            className="h-full rounded-full"
            style={{ background: isMastered
              ? 'linear-gradient(90deg, #EAB308, #F59E0B, #FBBF24)'
              : `linear-gradient(90deg, ${config.glow}, rgba(0,236,151,0.5))` }}
            initial={{ width: 0 }}
            animate={{ width: `${stats.pct}%` }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-text-muted mt-2">
          <span>{stats.pct}% complete</span>
          <span className="font-mono text-near-green">{stats.earnedXP}/{stats.totalXP} XP</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Streak Badge ─────────────────────────────────────────── */

function StreakBadge({ streak }: { streak: number }) {
  if (streak <= 0) return null;
  return (
    <motion.div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <motion.span
        className="text-sm"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        🔥
      </motion.span>
      <span className="text-xs font-bold text-orange-400 font-mono">{streak} day streak</span>
    </motion.div>
  );
}

/* ─── Main Header ──────────────────────────────────────────── */

interface HeaderProps {
  completedCount: number;
  earnedXP: number;
  level: Level;
  nextLevel: Level | undefined;
  activeTrack: TrackId | 'all';
  onSetTrack: (t: TrackId | 'all') => void;
  onReset: () => void;
  getTrackStats: (t: TrackId) => { completed: number; total: number; earnedXP: number; totalXP: number; pct: number };
  streak: number;
}

export function ConstellationHeader({
  completedCount, earnedXP, level, nextLevel,
  activeTrack, onSetTrack, onReset, getTrackStats, streak,
}: HeaderProps) {
  const trackIds: TrackId[] = ['explorer', 'builder', 'hacker', 'founder'];

  return (
    <div className="space-y-6">
      {/* Top row */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <ProgressRing completed={completedCount} total={TOTAL_MODULES} />
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                <GradientText>Skill Constellation</GradientText>
              </h1>
              <StreakBadge streak={streak} />
            </div>
            <p className="text-text-secondary text-sm mt-1">
              {completedCount}/{TOTAL_MODULES} modules completed · {earnedXP} XP earned
            </p>
          </div>
          {/* Level bar */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">{level.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-text-primary">{level.name}</span>
                {nextLevel && (
                  <span className="text-[10px] text-text-muted font-mono">
                    {nextLevel.minXP - earnedXP} XP to {nextLevel.name}
                  </span>
                )}
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-near-green via-accent-cyan to-purple-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: nextLevel
                      ? `${((earnedXP - level.minXP) / (nextLevel.minXP - level.minXP)) * 100}%`
                      : '100%',
                  }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
          {completedCount > 0 && (
            <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-red-400 transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset Progress
            </button>
          )}
        </div>
      </div>

      {/* Track filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSetTrack('all')}
          className={cn(
            'text-xs px-3 py-1.5 rounded-full border font-medium transition-all',
            activeTrack === 'all'
              ? 'border-near-green bg-near-green/10 text-near-green'
              : 'border-border bg-surface text-text-muted hover:text-text-primary',
          )}
        >
          All Tracks
        </button>
        {trackIds.map(trackId => {
          const cfg = TRACK_CONFIG[trackId];
          return (
            <button
              key={trackId}
              onClick={() => onSetTrack(trackId)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border font-medium transition-all',
                activeTrack === trackId
                  ? `${cfg.border} ${cfg.bg} ${cfg.color}`
                  : 'border-border bg-surface text-text-muted hover:text-text-primary',
              )}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Track summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {trackIds.map(trackId => (
          <TrackSummary key={trackId} trackId={trackId} stats={getTrackStats(trackId)} />
        ))}
      </div>
    </div>
  );
}
