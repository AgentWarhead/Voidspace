'use client';

import { createContext, useCallback, useEffect, useState, useRef } from 'react';
import type { NearConnector } from '@hot-labs/near-connect';
import type { User } from '@/types';

export interface WalletContextValue {
  connector: NearConnector | null;
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
  connector: null,
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
  const [connector, setConnector] = useState<NearConnector | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const connectorRef = useRef<NearConnector | null>(null);

  // Try to restore session from existing cookie (no signature needed)
  const tryRestoreSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          return true;
        }
      }
    } catch {
      // Session restore failed silently
    }
    return false;
  }, []);

  // Authenticate user via signed message (NEP-413) and create/fetch in Supabase
  const authenticateUser = useCallback(async (nearAccountId: string, conn: NearConnector) => {
    setUserLoading(true);
    try {
      // First, try to restore existing session (avoids re-signing)
      const restored = await tryRestoreSession();
      if (restored) return;

      const wallet = await conn.wallet();

      // Generate nonce (32 bytes, as required by NEP-413)
      const nonce = crypto.getRandomValues(new Uint8Array(32));
      const message = `Sign in to Voidspace`;
      const recipient = 'voidspace.io';

      const signed = await wallet.signMessage({
        message,
        recipient,
        nonce,
      });

      if (!signed) {
        // User declined to sign
        return;
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: signed.accountId || nearAccountId,
          publicKey: signed.publicKey,
          signature: signed.signature,
          message,
          recipient,
          nonce: Buffer.from(nonce).toString('base64'),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        console.error('[Auth] Auth failed:', res.status, await res.text());
      }
    } catch (err) {
      console.error('Failed to authenticate user:', err);
    } finally {
      setUserLoading(false);
    }
  }, [tryRestoreSession]);

  const refetchUser = useCallback(async () => {
    if (accountId && connectorRef.current) {
      await authenticateUser(accountId, connectorRef.current);
    }
  }, [accountId, authenticateUser]);

  // Initialize NearConnector
  useEffect(() => {
    async function init() {
      try {
        const { initConnector } = await import('@/lib/near/wallet-selector');
        const conn = initConnector();
        connectorRef.current = conn;
        setConnector(conn);

        // Listen for sign-in events
        conn.on('wallet:signIn', async (payload) => {
          const newAccountId = payload.accounts?.[0]?.accountId || null;
          if (newAccountId) {
            setAccountId(newAccountId);
            authenticateUser(newAccountId, conn);
          }
        });

        // Listen for sign-out events
        conn.on('wallet:signOut', () => {
          setAccountId(null);
          setUser(null);
        });

        // Check for existing connection (autoConnect)
        // IMPORTANT: Only restore session silently here — do NOT trigger wallet signing.
        // Calling authenticateUser() on auto-connect opens the wallet modal on every page
        // refresh when the cookie is expired. Instead, just restore the cookie-backed session.
        // Full re-auth only happens on explicit wallet:signIn events.
        try {
          const { wallet, accounts } = await conn.getConnectedWallet();
          if (wallet && accounts.length > 0) {
            const existingAccountId = accounts[0].accountId;
            setAccountId(existingAccountId);
            // Silently restore server session from cookie — no wallet modal
            await tryRestoreSession();
          }
        } catch {
          // No existing connection — that's fine
        }
      } catch (err) {
        console.error('Failed to initialize NearConnector:', err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [authenticateUser]);

  const openModal = useCallback(async () => {
    if (!connectorRef.current) return;
    try {
      const walletId = await connectorRef.current.selectWallet();
      await connectorRef.current.connect(walletId);
    } catch (err) {
      // User closed modal or cancelled — that's fine
      console.debug('[Wallet] Modal closed or connection cancelled:', err);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!connectorRef.current) return;
    try {
      await connectorRef.current.disconnect();
    } catch (err) {
      console.error('[Wallet] Disconnect error:', err);
    }
    // Clear server session cookie
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setAccountId(null);
    setUser(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connector,
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
