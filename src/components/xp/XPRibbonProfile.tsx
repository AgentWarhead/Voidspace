/* ─── XPRibbonProfile — XP ribbon for /profile and /learn ──────
 * Reads cumulative stats from AchievementContext to compute XP.
 * No session props needed — uses persisted platform-wide stats.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useAchievementContext } from '@/contexts/AchievementContext';
import { ACHIEVEMENT_MAP } from '@/lib/achievements';
import { calculateActivityXP } from '@/lib/xp';
import { XPRibbon } from './XPRibbon';

interface XPRibbonProfileProps {
  /** Extra Tailwind classes */
  className?: string;
}

export function XPRibbonProfile({ className = '' }: XPRibbonProfileProps) {
  const { stats, unlocked, isConnected, isLoaded } = useAchievementContext();

  // Show nothing while loading or not connected
  if (!isConnected || !isLoaded) return null;

  // Compute total XP: activity stats (cumulative) + all unlocked achievement XP
  const activityXP = calculateActivityXP(
    stats.sanctumMessages,
    stats.codeGenerations,
    stats.contractsDeployed,
    stats.conceptsLearned,
    stats.maxQuizStreak, // best quiz streak as a proxy for correct answers
  );

  const achievementXP = Array.from(unlocked).reduce((sum, id) => {
    return sum + (ACHIEVEMENT_MAP[id]?.xp ?? 0);
  }, 0);

  const totalXP = activityXP + achievementXP;

  return (
    <XPRibbon
      totalXP={totalXP}
      showNext
      className={className}
    />
  );
}
