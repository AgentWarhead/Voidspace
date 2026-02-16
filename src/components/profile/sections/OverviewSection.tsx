/* ─── OverviewSection — Profile identity + quick stats ────────
 * Avatar, rank, tier badge, 4-stat grid, quick actions.
 * ────────────────────────────────────────────────────────────── */

'use client';

import {
  Shield,
  Calendar,
  Search,
  FileText,
  Zap,
  Rocket,
  Share2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { AnimatedBorderCard } from '@/components/effects/AnimatedBorderCard';
import { QuickActionsBar } from '@/components/profile/QuickActionsBar';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { cn } from '@/lib/utils';
import { totalAchievementXP, getRank } from '@/lib/achievements';
import type { TierName, SavedOpportunity } from '@/types';
import { TIERS } from '@/lib/tiers';

interface BuilderStats {
  voidsExplored: number;
  briefsGenerated: number;
  building: number;
  shipped: number;
  sanctumSessions: number;
  totalTokensUsed: number;
}

interface WalletReputation {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  accountAge: string;
  transactionCount: number;
}

interface OverviewSectionProps {
  accountId: string;
  tier: TierName;
  joinedAt: string;
  stats: BuilderStats;
  reputation?: WalletReputation | null;
  missions: SavedOpportunity[];
}

export function OverviewSection({
  accountId,
  tier,
  joinedAt,
  stats,
  reputation,
  missions,
}: OverviewSectionProps) {
  const { unlocked, trackStat } = useAchievementContext();

  const activityXP =
    stats.voidsExplored * 10 +
    stats.briefsGenerated * 50 +
    stats.sanctumSessions * 100 +
    stats.shipped * 500;
  const achievementXP = totalAchievementXP(unlocked);
  const xp = activityXP + achievementXP;
  const { current: currentRank, next: nextRank, progress: progressToNext } = getRank(xp);

  const tierConfig = TIERS[tier];
  const joinDate = new Date(joinedAt);
  const joinYear = joinDate.getFullYear();
  const joinMonth = joinDate.toLocaleString('default', { month: 'short' });

  const lastBuildingMission = missions.find((m) => m.status === 'building');

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 overflow-x-hidden">
      <AnimatedBorderCard className="relative overflow-hidden" padding="none">
        {/* Background Glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(0,236,151,0.15) 0%, transparent 60%)',
          }}
        />

        <div className="relative p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-near-green/20 to-cyan-500/20 border border-near-green/30 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">{currentRank.icon}</span>
              </div>
              <div className="absolute -bottom-2 -right-2">
                <Badge variant="tier" tier={tier} className="text-xs shadow-lg">
                  {tierConfig?.name ?? tier}
                </Badge>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary truncate font-mono break-words">
                {accountId}
              </h2>
              <div className={cn('text-xs sm:text-sm font-medium mt-0.5', currentRank.color)}>
                {currentRank.icon} {currentRank.name}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-2 text-xs text-text-muted flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  Since {joinMonth} {joinYear}
                </span>
                {reputation && (
                  <span
                    className={cn(
                      'flex items-center gap-1',
                      reputation.riskLevel === 'LOW'
                        ? 'text-near-green'
                        : reputation.riskLevel === 'MEDIUM'
                          ? 'text-amber-400'
                          : 'text-red-400',
                    )}
                  >
                    <Shield className="w-3 h-3 flex-shrink-0" />
                    Rep: {reputation.score}/100
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-near-green min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.97] transition-transform flex-shrink-0"
              onClick={() => trackStat('profileShares')}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* XP Progress */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
              <span className="text-text-secondary">Experience</span>
              <span className="font-mono text-near-green">{xp.toLocaleString()} XP</span>
            </div>
            <Progress value={progressToNext} size="md" color="green" />
            {nextRank && (
              <div className="flex items-center justify-between text-xs text-text-muted mt-1 flex-wrap gap-1">
                <span>{currentRank.name}</span>
                <span className="flex items-center gap-1">
                  {nextRank.icon} {nextRank.name}
                  <span className="text-text-secondary">({nextRank.minXp - xp} XP to go)</span>
                </span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { value: stats.voidsExplored, label: 'Explored', icon: Search, color: 'text-text-primary' },
              { value: stats.briefsGenerated, label: 'Briefs', icon: FileText, color: 'text-text-primary' },
              { value: stats.building, label: 'Building', icon: Zap, color: 'text-amber-400' },
              { value: stats.shipped, label: 'Shipped', icon: Rocket, color: 'text-near-green' },
            ].map(({ value, label, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-surface rounded-xl p-3 text-center border border-border hover:border-near-green/30 transition-colors min-w-0"
              >
                <div className={cn('text-xl sm:text-2xl font-bold', color)}>{value}</div>
                <div className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
                  <Icon className="w-3 h-3 flex-shrink-0" /> {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedBorderCard>

      {/* Quick Actions */}
      <QuickActionsBar
        hasActiveMission={!!lastBuildingMission}
        lastSanctumVoid={lastBuildingMission?.opportunity_id}
        accountId={accountId}
      />
    </div>
  );
}
