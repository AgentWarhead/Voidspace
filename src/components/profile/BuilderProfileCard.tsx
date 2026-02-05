'use client';

import { useState } from 'react';
import { 
  Shield, 
  Calendar, 
  Search,
  FileText,
  Zap,
  Rocket,
  Star,
  Share2,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { AnimatedBorderCard } from '@/components/effects/AnimatedBorderCard';
import { cn } from '@/lib/utils';
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

interface BuilderProfileCardProps {
  accountId: string;
  tier: TierName;
  joinedAt: string;
  stats: BuilderStats;
  reputation?: WalletReputation | null;
  missions: SavedOpportunity[];
}

const RANK_THRESHOLDS = [
  { name: 'Void Initiate', minXp: 0, icon: '👤', color: 'text-zinc-400' },
  { name: 'Void Explorer', minXp: 100, icon: '🔍', color: 'text-cyan-400' },
  { name: 'Rust Apprentice', minXp: 500, icon: '🦀', color: 'text-amber-400' },
  { name: 'Builder', minXp: 1500, icon: '🔨', color: 'text-purple-400' },
  { name: 'Deployer', minXp: 5000, icon: '🚀', color: 'text-near-green' },
  { name: 'Void Master', minXp: 15000, icon: '👑', color: 'text-amber-300' },
];

const ACHIEVEMENTS = [
  { id: 'first_steps', icon: '👣', name: 'First Steps', desc: 'Connected wallet' },
  { id: 'void_hunter', icon: '🔍', name: 'Void Hunter', desc: 'Explored 10 voids' },
  { id: 'brief_collector', icon: '📋', name: 'Brief Collector', desc: 'Generated 5 briefs' },
  { id: 'rust_initiate', icon: '🦀', name: 'Rust Initiate', desc: 'Completed Sanctum session' },
  { id: 'first_deploy', icon: '🚀', name: 'First Deploy', desc: 'Deployed via Sanctum' },
  { id: 'category_master', icon: '🗺️', name: 'Category Master', desc: 'Explored all categories' },
];

export function BuilderProfileCard({ 
  accountId, 
  tier, 
  joinedAt, 
  stats,
  reputation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  missions 
}: BuilderProfileCardProps) {
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  // Calculate XP from stats
  const xp = (stats.voidsExplored * 10) + 
             (stats.briefsGenerated * 50) + 
             (stats.sanctumSessions * 100) + 
             (stats.shipped * 500);

  // Determine rank
  const currentRank = [...RANK_THRESHOLDS].reverse().find(r => xp >= r.minXp) || RANK_THRESHOLDS[0];
  const nextRank = RANK_THRESHOLDS.find(r => r.minXp > xp);
  const progressToNext = nextRank 
    ? ((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100
    : 100;

  // Determine unlocked achievements
  const unlockedAchievements = [
    stats.voidsExplored > 0 && 'first_steps',
    stats.voidsExplored >= 10 && 'void_hunter',
    stats.briefsGenerated >= 5 && 'brief_collector',
    stats.sanctumSessions >= 1 && 'rust_initiate',
    stats.shipped >= 1 && 'first_deploy',
  ].filter(Boolean);

  const tierConfig = TIERS[tier];

  // Format join date
  const joinDate = new Date(joinedAt);
  const joinYear = joinDate.getFullYear();
  const joinMonth = joinDate.toLocaleString('default', { month: 'short' });

  return (
    <AnimatedBorderCard className="relative overflow-hidden" padding="none">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(0,236,151,0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar Area */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-near-green/20 to-cyan-500/20 border border-near-green/30 flex items-center justify-center">
              <span className="text-4xl">{currentRank.icon}</span>
            </div>
            {/* Tier Badge */}
            <div className="absolute -bottom-2 -right-2">
              <Badge variant="tier" tier={tier} className="text-xs shadow-lg">
                {tierConfig.name}
              </Badge>
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-text-primary truncate font-mono">
              {accountId}
            </h2>
            <div className={cn('text-sm font-medium mt-0.5', currentRank.color)}>
              {currentRank.icon} {currentRank.name}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Since {joinMonth} {joinYear}
              </span>
              {reputation && (
                <span className={cn(
                  'flex items-center gap-1',
                  reputation.riskLevel === 'LOW' ? 'text-near-green' : 
                  reputation.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
                )}>
                  <Shield className="w-3 h-3" />
                  Rep: {reputation.score}/100
                </span>
              )}
            </div>
          </div>

          {/* Share Button */}
          <Button variant="ghost" size="sm" className="text-text-muted hover:text-near-green">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* XP Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-secondary">Experience</span>
            <span className="font-mono text-near-green">{xp.toLocaleString()} XP</span>
          </div>
          <Progress value={progressToNext} size="md" color="green" />
          {nextRank && (
            <div className="flex items-center justify-between text-xs text-text-muted mt-1">
              <span>{currentRank.name}</span>
              <span className="flex items-center gap-1">
                {nextRank.icon} {nextRank.name} 
                <span className="text-text-secondary">({nextRank.minXp - xp} XP to go)</span>
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-surface rounded-xl p-3 text-center border border-border hover:border-near-green/30 transition-colors">
            <div className="text-2xl font-bold text-text-primary">{stats.voidsExplored}</div>
            <div className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
              <Search className="w-3 h-3" /> Explored
            </div>
          </div>
          <div className="bg-surface rounded-xl p-3 text-center border border-border hover:border-near-green/30 transition-colors">
            <div className="text-2xl font-bold text-text-primary">{stats.briefsGenerated}</div>
            <div className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
              <FileText className="w-3 h-3" /> Briefs
            </div>
          </div>
          <div className="bg-surface rounded-xl p-3 text-center border border-border hover:border-near-green/30 transition-colors">
            <div className="text-2xl font-bold text-amber-400">{stats.building}</div>
            <div className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
              <Zap className="w-3 h-3" /> Building
            </div>
          </div>
          <div className="bg-surface rounded-xl p-3 text-center border border-border hover:border-near-green/30 transition-colors">
            <div className="text-2xl font-bold text-near-green">{stats.shipped}</div>
            <div className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
              <Rocket className="w-3 h-3" /> Shipped
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Achievements
            </h3>
            <button 
              onClick={() => setShowAllAchievements(!showAllAchievements)}
              className="text-xs text-near-green/70 hover:text-near-green flex items-center gap-0.5"
            >
              {showAllAchievements ? 'Show less' : 'Show all'}
              <ChevronRight className={cn('w-3 h-3 transition-transform', showAllAchievements && 'rotate-90')} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ACHIEVEMENTS.slice(0, showAllAchievements ? undefined : 4).map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all',
                    isUnlocked
                      ? 'bg-near-green/10 border-near-green/30 text-near-green'
                      : 'bg-surface border-border text-text-muted opacity-50'
                  )}
                  title={achievement.desc}
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-xs font-medium">{achievement.name}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-2 text-xs text-text-muted">
            {unlockedAchievements.length}/{ACHIEVEMENTS.length} unlocked
          </div>
        </div>
      </div>
    </AnimatedBorderCard>
  );
}
