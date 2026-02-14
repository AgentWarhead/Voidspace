'use client';

import { WalletProvider } from '@/contexts/WalletContext';
import { SavedOpportunitiesProvider } from '@/contexts/SavedOpportunitiesContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AchievementProvider } from '@/contexts/AchievementContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
import { AchievementToastLayer } from '@/components/achievements/AchievementToastLayer';
import { GlobalAchievementTracker } from '@/components/tracking/GlobalAchievementTracker';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <AchievementProvider>
        <SavedOpportunitiesProvider>
          <ToastProvider>
            {children}
            <OnboardingOverlay />
            <AchievementToastLayer />
            <GlobalAchievementTracker />
          </ToastProvider>
        </SavedOpportunitiesProvider>
      </AchievementProvider>
    </WalletProvider>
  );
}
