'use client';

import { useWallet } from './useWallet';

export function useUser() {
  const { user, userLoading, isConnected, refetchUser } = useWallet();
  return { user, isLoading: userLoading, isConnected, refetchUser };
}
