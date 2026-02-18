'use client';

import { WalletProvider } from '@/contexts/WalletContext';
import { SavedOpportunitiesProvider } from '@/contexts/SavedOpportunitiesContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AchievementProvider } from '@/contexts/AchievementContext';
import { XPEventProvider } from '@/contexts/XPEventContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
import { AchievementToastLayer } from '@/components/achievements/AchievementToastLayer';
import { GlobalAchievementTracker } from '@/components/tracking/GlobalAchievementTracker';
import { XPPopupLayer } from '@/components/xp/XPPopupLayer';
import { LevelUpCelebration } from '@/components/xp/LevelUpCelebration';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <AchievementProvider>
        <XPEventProvider>
          <SavedOpportunitiesProvider>
            <ToastProvider>
              {children}
              <OnboardingOverlay />
              <AchievementToastLayer />
              <GlobalAchievementTracker />
              <XPPopupLayer />
              <LevelUpCelebration />
            </ToastProvider>
          </SavedOpportunitiesProvider>
        </XPEventProvider>
      </AchievementProvider>
    </WalletProvider>
  );
}
