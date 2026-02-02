'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import type { WalletSelector, AccountState } from '@near-wallet-selector/core';
import type { WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import type { User } from '@/types';

import '@near-wallet-selector/modal-ui/styles.css';

export interface WalletContextValue {
  selector: WalletSelector | null;
  modal: WalletSelectorModal | null;
  accountId: string | null;
  isConnected: boolean;
  isLoading: boolean;
  user: User | null;
  userLoading: boolean;
  openModal: () => void;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextValue>({
  selector: null,
  modal: null,
  accountId: null,
  isConnected: false,
  isLoading: true,
  user: null,
  userLoading: false,
  openModal: () => {},
  signOut: async () => {},
  refetchUser: async () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  // Fetch or create user in Supabase
  const fetchUser = useCallback(async (nearAccountId: string) => {
    setUserLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: nearAccountId }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setUserLoading(false);
    }
  }, []);

  const refetchUser = useCallback(async () => {
    if (accountId) {
      await fetchUser(accountId);
    }
  }, [accountId, fetchUser]);

  // Initialize wallet selector
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    async function init() {
      try {
        const { initWalletSelector } = await import('@/lib/near/wallet-selector');
        const { selector: sel, modal: mod } = await initWalletSelector();
        setSelector(sel);
        setModal(mod);

        // Get initial account
        const state = sel.store.getState();
        const activeAccount = state.accounts.find(
          (a: AccountState) => a.active
        );
        const initialAccountId = activeAccount?.accountId || null;
        setAccountId(initialAccountId);

        if (initialAccountId) {
          fetchUser(initialAccountId);
        }

        // Subscribe to account changes
        subscription = sel.store.observable.subscribe((state) => {
          const active = state.accounts.find(
            (a: AccountState) => a.active
          );
          const newAccountId = active?.accountId || null;
          setAccountId((prev) => {
            if (prev !== newAccountId) {
              if (newAccountId) {
                fetchUser(newAccountId);
              } else {
                setUser(null);
              }
            }
            return newAccountId;
          });
        });
      } catch (err) {
        console.error('Failed to initialize wallet selector:', err);
      } finally {
        setIsLoading(false);
      }
    }

    init();

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUser]);

  const openModal = useCallback(() => {
    modal?.show();
  }, [modal]);

  const signOut = useCallback(async () => {
    if (!selector) return;
    const wallet = await selector.wallet();
    await wallet.signOut();
    // Clear server session cookie
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setAccountId(null);
    setUser(null);
  }, [selector]);

  return (
    <WalletContext.Provider
      value={{
        selector,
        modal,
        accountId,
        isConnected: !!accountId,
        isLoading,
        user,
        userLoading,
        openModal,
        signOut,
        refetchUser,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
