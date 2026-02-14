'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';

interface SavedContextValue {
  savedIds: Set<string>;
  save: (opportunityId: string) => Promise<{ success: boolean; error?: string }>;
  unsave: (opportunityId: string) => Promise<{ success: boolean; error?: string }>;
  isSaved: (opportunityId: string) => boolean;
  isLoading: boolean;
}

const SavedContext = createContext<SavedContextValue>({
  savedIds: new Set(),
  save: async () => ({ success: false }),
  unsave: async () => ({ success: false }),
  isSaved: () => false,
  isLoading: false,
});

export function SavedOpportunitiesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved IDs once when user changes
  useEffect(() => {
    if (!user?.id) {
      setSavedIds(new Set());
      return;
    }

    setIsLoading(true);
    fetch('/api/saved')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch saved');
        return r.json();
      })
      .then((data) => {
        const saved = Array.isArray(data?.saved) ? data.saved : [];
        const ids = new Set<string>(
          saved.map((s: { opportunity_id: string }) => s.opportunity_id)
        );
        setSavedIds(ids);
      })
      .catch(() => {
        setSavedIds(new Set());
      })
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const save = useCallback(
    async (opportunityId: string) => {
      if (!user?.id) return { success: false, error: 'Not connected' };

      try {
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId }),
        });

        if (res.ok) {
          setSavedIds((prev) => new Set(prev).add(opportunityId));
          return { success: true };
        }

        const data = await res.json();
        return { success: false, error: data.error };
      } catch {
        return { success: false, error: 'Network error' };
      }
    },
    [user?.id]
  );

  const unsave = useCallback(
    async (opportunityId: string) => {
      if (!user?.id) return { success: false, error: 'Not connected' };

      try {
        const res = await fetch('/api/saved', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId }),
        });

        if (res.ok) {
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(opportunityId);
            return next;
          });
          return { success: true };
        }

        const data = await res.json();
        return { success: false, error: data.error };
      } catch {
        return { success: false, error: 'Network error' };
      }
    },
    [user?.id]
  );

  const isSaved = useCallback(
    (opportunityId: string) => savedIds.has(opportunityId),
    [savedIds]
  );

  return (
    <SavedContext.Provider value={{ savedIds, save, unsave, isSaved, isLoading }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSavedContext() {
  return useContext(SavedContext);
}
