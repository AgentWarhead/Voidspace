'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';

export function useSavedOpportunities() {
  const { user } = useUser();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!user?.id) {
      setSavedIds(new Set());
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/saved');
      if (res.ok) {
        const data = await res.json();
        const ids = new Set<string>(
          data.saved.map((s: { opportunity_id: string }) => s.opportunity_id)
        );
        setSavedIds(ids);
      }
    } catch (err) {
      console.error('Failed to fetch saved:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

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

  return { savedIds, save, unsave, isSaved, isLoading, refetch: fetchSaved };
}
