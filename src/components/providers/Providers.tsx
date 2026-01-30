'use client';

import { WalletProvider } from '@/contexts/WalletContext';
import { SavedOpportunitiesProvider } from '@/contexts/SavedOpportunitiesContext';
import { ToastProvider } from '@/contexts/ToastContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <SavedOpportunitiesProvider>
        <ToastProvider>{children}</ToastProvider>
      </SavedOpportunitiesProvider>
    </WalletProvider>
  );
}
