/* ─── VaultNextUnlocks — "You're Almost There" Panel ─────────
 * Shows the top 5 achievements the user is closest to earning.
 * Computed from stat triggers: pct = current / threshold.
 * Only shown when wallet is connected and user has progress.
 * Part of Phase 4 — Achievement Overhaul (next-unlock suggestions).
 * ─────────────────────────────────────────────────────────── */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAchievementContext } from '@/contexts/AchievementContext';
import {
  ACHIEVEMENTS,
  RARITY_CONFIG,
  type AchievementDef,
  type AchievementRarity,
  type UserAchievementStats,
} from '@/lib/achievements';

// ─── Friendly stat labels for action hints ────────────────────

const STAT_LABELS: Partial<Record<keyof UserAchievementStats, string>> = {
  voidsExplored:            'projects explored',
  uniqueCategoriesExplored: 'categories visited',
  categoriesFullyExplored:  'categories completed',
  observatoryVisits:        'Observatory visits',
  pulseStreamsRead:          'Pulse entries read',
  briefsGenerated:          'briefs generated',
  opportunitiesSaved:       'opportunities saved',
  walletsAnalyzed:          'wallets analyzed',
  bubblesVisits:            'Void Bubbles sessions',
  bubblesMinutesSpent:      'minutes in Void Bubbles',
  bubblesClicked:           'bubbles clicked',
  constellationVisits:      'Constellation visits',
  nodesExpanded:            'nodes expanded',
  maxDepthReached:          'depth levels reached',
  screenshotsTaken:         'screenshots taken',
  sanctumMessages:          'Sanctum messages sent',
  codeGenerations:          'contracts generated',
  contractsDeployed:        'contracts deployed',
  contractsBuilt:           'contracts built',
  uniquePersonasUsed:       'personas explored',
  uniqueCategoriesBuilt:    'build categories tried',
  tokensUsed:               'tokens used in Sanctum',
  conceptsLearned:          'concepts learned',
  modulesCompleted:         'learning modules done',
  explorerModules:          'Explorer modules done',
  builderModules:           'Builder modules done',
  hackerModules:            'Hacker modules done',
  founderModules:           'Founder modules done',
  certificatesEarned:       'certificates earned',
  profileShares:            'profile shares',
};

// ─── Rarity glow colors ───────────────────────────────────────

const RARITY_GLOW: Record<AchievementRarity, string> = {
  legendary: 'rgba(245,158,11,0.35)',
  epic:      'rgba(139,92,246,0.35)',
  rare:      'rgba(0,212,255,0.35)',
  uncommon:  'rgba(52,211,153,0.25)',
  common:    'rgba(100,116,139,0.2)',
};

const RARITY_BAR: Record<AchievementRarity, string> = {
  legendary: 'linear-gradient(90deg, #f59e0b, #fcd34d)',
  epic:      'linear-gradient(90deg, #8b5cf6, #c084fc)',
  rare:      'linear-gradient(90deg, #00D4FF, #00EC97)',
  uncommon:  'linear-gradient(90deg, #34d399, #6ee7b7)',
  common:    'linear-gradient(90deg, #64748b, #94a3b8)',
};

// ─── Types ────────────────────────────────────────────────────

interface NearUnlock {
  achievement: AchievementDef;
  current: number;
  threshold: number;
  pct: number;          // 0–1
  remaining: number;
  statLabel: string;
}

// ─── Compute near-unlocks ─────────────────────────────────────

function computeNearUnlocks(
  stats: UserAchievementStats,
  unlocked: Set<string>,
  limit = 5,
): NearUnlock[] {
  const results: NearUnlock[] = [];

  for (const a of ACHIEVEMENTS) {
    // Skip already unlocked, secret, or non-stat triggers
    if (unlocked.has(a.id)) continue;
    if (a.secret) continue;
    if (!a.trigger?.stat || a.trigger.threshold === undefined) continue;

    const statKey = a.trigger.stat as keyof UserAchievementStats;
    const threshold = a.trigger.threshold;
    const rawValue = stats[statKey];

    // Only handle numeric stats
    if (typeof rawValue !== 'number') continue;
    const current = rawValue;

    // Skip if user has zero progress (nothing to show)
    if (current === 0) continue;

    const pct = Math.min(current / threshold, 1);
    // Exclude already-maxed (shouldn't happen since we check unlocked, but guard)
    if (pct >= 1) continue;

    const label = STAT_LABELS[statKey] ?? statKey;

    results.push({
      achievement: a,
      current,
      threshold,
      pct,
      remaining: threshold - current,
      statLabel: label,
    });
  }

  // Sort by highest progress first (closest to unlock)
  results.sort((a, b) => b.pct - a.pct);

  return results.slice(0, limit);
}

// ─── Progress Bar ─────────────────────────────────────────────

function NearUnlockBar({ item, index }: { item: NearUnlock; index: number }) {
  const { achievement, current, threshold, pct, remaining, statLabel } = item;
  const cfg = RARITY_CONFIG[achievement.rarity];
  const pctDisplay = Math.round(pct * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl p-3 group cursor-default"
      style={{
        background: 'rgba(15,15,20,0.75)',
        border: `1px solid rgba(255,255,255,0.07)`,
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.2s',
      }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Header row */}
      <div className="flex items-center gap-2.5 mb-2">
        {/* Emoji */}
        <span
          className="text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
          style={{
            background: `rgba(255,255,255,0.05)`,
            boxShadow: `0 0 10px ${RARITY_GLOW[achievement.rarity]}`,
          }}
        >
          {achievement.emoji}
        </span>

        {/* Name + rarity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-xs font-semibold text-text-primary truncate">
              {achievement.name}
            </p>
            <span
              className={cn('text-[9px] uppercase tracking-widest font-bold flex-shrink-0', cfg.color)}
            >
              {achievement.rarity}
            </span>
          </div>
          {/* "X more to unlock" hint */}
          <p className="text-[10px] text-text-muted truncate">
            <span className="text-near-green font-medium">{remaining.toLocaleString()}</span>
            {' '}more {statLabel}
          </p>
        </div>

        {/* Pct badge */}
        <div
          className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: pct >= 0.8
              ? 'rgba(0,236,151,0.12)'
              : pct >= 0.5
                ? 'rgba(0,212,255,0.1)'
                : 'rgba(255,255,255,0.05)',
            color: pct >= 0.8 ? '#00EC97' : pct >= 0.5 ? '#00D4FF' : '#64748b',
            border: `1px solid ${pct >= 0.8 ? 'rgba(0,236,151,0.3)' : pct >= 0.5 ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {pctDisplay}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        {/* Track */}
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          {/* Fill */}
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pctDisplay}%` }}
            transition={{ duration: 0.9, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: RARITY_BAR[achievement.rarity],
              boxShadow: `0 0 6px ${RARITY_GLOW[achievement.rarity]}`,
            }}
          />
        </div>

        {/* Current / threshold label */}
        <div className="flex justify-between items-center mt-1">
          <span className="text-[9px] text-text-muted">
            {current.toLocaleString()} / {threshold.toLocaleString()}
          </span>
          <span className="text-[9px] text-text-muted">
            +{achievement.xp} XP
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export function VaultNextUnlocks() {
  const { unlocked, stats, isConnected, isLoaded } = useAchievementContext();

  const nearUnlocks = useMemo(
    () => computeNearUnlocks(stats, unlocked, 5),
    [stats, unlocked],
  );

  // Only render when connected, loaded, and there's something to show
  if (!isConnected || !isLoaded || nearUnlocks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-4 sm:p-5 mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(0,236,151,0.02))',
        border: '1px solid rgba(0,212,255,0.15)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,236,151,0.1))',
              border: '1px solid rgba(0,212,255,0.25)',
            }}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xs uppercase tracking-widest text-cyan-400/80 font-semibold">
            Next to Unlock
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-text-muted">
          <span>Based on your activity</span>
          <ChevronRight className="w-3 h-3 opacity-50" />
        </div>
      </div>

      {/* Progress list */}
      <div className="space-y-2">
        {nearUnlocks.map((item, i) => (
          <NearUnlockBar key={item.achievement.id} item={item} index={i} />
        ))}
      </div>

      {/* Footer nudge */}
      <p className="text-[10px] text-text-muted text-center mt-3 opacity-60">
        Keep exploring the Void to unlock these trophies.
      </p>
    </motion.div>
  );
}
