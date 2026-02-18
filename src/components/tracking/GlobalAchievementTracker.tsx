'use client';

import { useCallback, useEffect } from 'react';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { useKonamiCode } from '@/hooks/useKonamiCode';

/**
 * Global achievement tracker — place inside AchievementProvider.
 * Handles: Konami code, wallet-connect evaluation, first-visit grant,
 * and other passive global triggers.
 */
export function GlobalAchievementTracker() {
  const { triggerCustom, isConnected, isLoaded, reevaluate } = useAchievementContext();

  // Konami code → legendary achievement
  const handleKonami = useCallback(() => {
    triggerCustom('konami_code');
  }, [triggerCustom]);

  useKonamiCode(handleKonami);

  // On wallet connect + initial load: fire wallet_connected and first_visit triggers
  // and re-evaluate all stat-based achievements against stored stats
  useEffect(() => {
    if (!isConnected || !isLoaded) return;

    // Slight delay so state is fully settled
    const t = setTimeout(() => {
      // wallet_connected → first_steps achievement
      triggerCustom('wallet_connected');
      // first_visit → dark_mode_only achievement
      triggerCustom('first_visit');
      // Re-evaluate all threshold achievements against persisted stats
      reevaluate();
    }, 500);

    return () => clearTimeout(t);
  // Only run when the wallet connection state or load state changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isLoaded]);

  return null;
}
