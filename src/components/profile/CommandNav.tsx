/* ─── CommandNav — Void Command Center sidebar navigation ─────
 * Left sidebar on desktop, horizontal tab bar on mobile.
 * Dark glass aesthetic with scan line effects.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Layout,
  Zap,
  Sparkles,
  Target,
  Activity,
  Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { ScanLine } from '@/components/effects/ScanLine';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { totalAchievementXP, getRank } from '@/lib/achievements';
import type { TierName } from '@/types';
import { TIERS } from '@/lib/tiers';

export type CommandSection =
  | 'overview'
  | 'arsenal'
  | 'skills'
  | 'missions'
  | 'activity'
  | 'vault';

interface NavItem {
  id: CommandSection;
  label: string;
  icon: typeof Layout;
  emoji: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',  label: 'Overview',      icon: Layout,   emoji: '🎖️' },
  { id: 'arsenal',   label: 'Arsenal',       icon: Zap,      emoji: '⚡' },
  { id: 'skills',    label: 'Skills',        icon: Sparkles, emoji: '🌟' },
  { id: 'missions',  label: 'Missions',      icon: Target,   emoji: '🎯' },
  { id: 'activity',  label: 'Activity',      icon: Activity, emoji: '📊' },
  { id: 'vault',     label: 'Achievements',  icon: Crown,    emoji: '🏆' },
];

interface CommandNavProps {
  active: CommandSection;
  onNavigate: (section: CommandSection) => void;
  tier: TierName;
  accountId: string;
  missionCount?: number;
  activeMissionCount?: number;
  stats?: { voidsExplored: number; briefsGenerated: number; shipped: number; sanctumSessions: number };
}

export function CommandNav({
  active,
  onNavigate,
  tier,
  accountId,
  activeMissionCount = 0,
  stats,
}: CommandNavProps) {
  const { unlocked } = useAchievementContext();

  const { xp, currentRank, progressToNext } = useMemo(() => {
    const activityXP =
      ((stats?.voidsExplored || 0) * 10) +
      ((stats?.briefsGenerated || 0) * 50) +
      ((stats?.sanctumSessions || 0) * 100) +
      ((stats?.shipped || 0) * 500);
    const achievementXP = totalAchievementXP(unlocked);
    const total = activityXP + achievementXP;
    const rank = getRank(total);
    return { xp: total, currentRank: rank.current, progressToNext: rank.progress };
  }, [unlocked, stats]);

  const tierConfig = TIERS[tier];
  const truncatedId = accountId.length > 16
    ? `${accountId.slice(0, 8)}...${accountId.slice(-6)}`
    : accountId;

  const getBadgeCount = (id: CommandSection): number | null => {
    if (id === 'missions' && activeMissionCount > 0) return activeMissionCount;
    if (id === 'vault') return unlocked.size || null;
    return null;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 flex-shrink-0 bg-surface/80 backdrop-blur-xl border-r border-border/50 rounded-l-2xl relative overflow-hidden">
        <ScanLine className="opacity-30" />

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border/30">
          <h2 className="text-sm font-bold uppercase tracking-widest text-near-green/80 font-mono">
            Void Command
          </h2>
          <p className="text-[10px] text-text-muted mt-0.5 font-mono">
            SYSTEM ONLINE
          </p>
        </div>

        {/* Nav Items */}
        <div className="flex-1 py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            const badge = getBadgeCount(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group min-h-[44px] active:scale-[0.98]',
                  isActive
                    ? 'bg-near-green/10 text-near-green'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover',
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-near-green rounded-r-full shadow-[0_0_8px_rgba(0,236,151,0.6)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                <span className="text-base">{item.emoji}</span>
                <span className={cn(
                  'text-sm font-medium flex-1',
                  isActive && 'text-near-green',
                )}>
                  {item.label}
                </span>

                {badge !== null && (
                  <span className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'bg-near-green/20 text-near-green'
                      : 'bg-surface-hover text-text-muted',
                  )}>
                    {badge}
                  </span>
                )}

                {/* Glow on hover */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-near-green/5 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer: XP + Tier + Account */}
        <div className="px-4 pb-4 pt-3 border-t border-border/30 space-y-3">
          {/* XP Progress */}
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-text-muted">{currentRank.icon} {currentRank.name}</span>
              <span className="font-mono text-near-green">{xp.toLocaleString()} XP</span>
            </div>
            <Progress value={progressToNext} size="sm" color="green" />
          </div>

          {/* Tier Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="tier" tier={tier} className="text-[10px]">
              {tierConfig?.name ?? tier}
            </Badge>
          </div>

          {/* Account ID */}
          <p className="text-[10px] text-text-muted font-mono truncate" title={accountId}>
            {truncatedId}
          </p>
        </div>
      </nav>

      {/* Mobile Tab Bar */}
      <nav className="md:hidden flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide px-2 -mx-2">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const badge = getBadgeCount(item.id);

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] min-w-[44px] rounded-lg text-xs font-medium transition-all whitespace-nowrap active:scale-[0.97]',
                isActive
                  ? 'bg-near-green/10 text-near-green border border-near-green/30'
                  : 'text-text-muted border border-transparent hover:text-text-secondary',
              )}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
              {badge !== null && (
                <span className={cn(
                  'text-[9px] font-mono px-1 py-0.5 rounded-full ml-0.5',
                  isActive ? 'bg-near-green/20' : 'bg-surface-hover',
                )}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
