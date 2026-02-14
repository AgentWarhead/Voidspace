/* ─── AchievementContext — App-Wide Achievement Provider ──────
 * Wraps useAchievements (wallet-gated) and provides it to all
 * child components. Must be placed INSIDE WalletProvider.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useAchievements, type UseAchievementsReturn } from '@/hooks/useAchievements';
import { defaultStats } from '@/lib/achievements';

const NOOP: UseAchievementsReturn = {
  unlocked: new Set(),
  stats: defaultStats(),
  featured: [],
  timeline: [],
  pendingPopups: [],
  isConnected: false,
  isLoaded: false,
  dismissPopup: () => {},
  trackStat: () => [],
  setStat: () => [],
  triggerCustom: () => null,
  unlock: () => null,
  setFeatured: () => {},
  isUnlocked: () => false,
  reevaluate: () => [],
};

const AchievementContext = createContext<UseAchievementsReturn>(NOOP);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const achievements = useAchievements();
  return (
    <AchievementContext.Provider value={achievements}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievementContext(): UseAchievementsReturn {
  return useContext(AchievementContext);
}
