'use client';

import { useCallback } from 'react';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { useKonamiCode } from '@/hooks/useKonamiCode';

/**
 * Global achievement tracker — place inside AchievementProvider.
 * Handles: Konami code, and other global/passive triggers.
 */
export function GlobalAchievementTracker() {
  const { triggerCustom } = useAchievementContext();

  const handleKonami = useCallback(() => {
    triggerCustom('konami_code');
  }, [triggerCustom]);

  useKonamiCode(handleKonami);

  return null;
}
