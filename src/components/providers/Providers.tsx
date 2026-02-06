'use client';

import { WalletProvider } from '@/contexts/WalletContext';
import { SavedOpportunitiesProvider } from '@/contexts/SavedOpportunitiesContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <SavedOpportunitiesProvider>
        <ToastProvider>
          {children}
          <OnboardingOverlay />
        </ToastProvider>
      </SavedOpportunitiesProvider>
    </WalletProvider>
  );
}
