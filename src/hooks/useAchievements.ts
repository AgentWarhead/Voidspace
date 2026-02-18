/* ─── useAchievements — Wallet-Gated Achievement Hook ────────
 * All achievement tracking requires wallet connection.
 * Persists to localStorage (keyed by account) + syncs to Supabase.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { WalletContext } from '@/contexts/WalletContext';
import {
  type AchievementDef,
  type AchievementRarity,
  type UserAchievementStats,
  ACHIEVEMENT_MAP,
  ACHIEVEMENTS,
  defaultStats,
  evaluateAchievements,
} from '@/lib/achievements';

// ─── Rarity priority (higher = shown first) ───────────────────
const RARITY_PRIORITY: Record<AchievementRarity, number> = {
  legendary: 5,
  epic:      4,
  rare:      3,
  uncommon:  2,
  common:    1,
};

function sortByRarityPriority(achievements: AchievementDef[]): AchievementDef[] {
  return [...achievements].sort(
    (a, b) => RARITY_PRIORITY[b.rarity] - RARITY_PRIORITY[a.rarity],
  );
}

function storageKey(accountId: string, suffix: string) {
  return `voidspace-achievements-${accountId}-${suffix}`;
}

export interface AchievementTimelineEntry {
  id: string;
  unlockedAt: number; // timestamp ms
}

export interface UseAchievementsReturn {
  /** Set of unlocked achievement IDs */
  unlocked: Set<string>;
  /** Current stats */
  stats: UserAchievementStats;
  /** Featured achievement IDs (max 3) pinned to profile */
  featured: string[];
  /** Timeline of when achievements were unlocked */
  timeline: AchievementTimelineEntry[];
  /** Queue of newly unlocked achievements to show popups for */
  pendingPopups: AchievementDef[];
  /** Whether the user is connected (achievements gated behind this) */
  isConnected: boolean;
  /** Whether initial data has loaded */
  isLoaded: boolean;
  /** Dismiss the next popup */
  dismissPopup: () => void;
  /** Increment a numeric stat and re-evaluate achievements */
  trackStat: (key: keyof UserAchievementStats, delta?: number) => AchievementDef[];
  /** Set a stat to a specific value */
  setStat: (key: keyof UserAchievementStats, value: number | boolean) => AchievementDef[];
  /** Unlock a specific achievement by custom trigger ID */
  triggerCustom: (customId: string) => AchievementDef | null;
  /** Directly unlock an achievement by ID */
  unlock: (achievementId: string) => AchievementDef | null;
  /** Set featured achievements (max 3 IDs) */
  setFeatured: (ids: string[]) => void;
  /** Check if a specific achievement is unlocked */
  isUnlocked: (id: string) => boolean;
  /** Re-evaluate all achievements against current stats */
  reevaluate: () => AchievementDef[];
}

// No-op return for when wallet is not connected
const NOOP_ACHIEVEMENTS: AchievementDef[] = [];

export function useAchievements(): UseAchievementsReturn {
  const { accountId, isConnected } = useContext(WalletContext);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<UserAchievementStats>(defaultStats());
  const [featured, setFeaturedState] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<AchievementTimelineEntry[]>([]);
  const [pendingPopups, setPendingPopups] = useState<AchievementDef[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSyncRef = useRef<string[]>([]);
  const currentAccountRef = useRef<string | null>(null);

  // ─── Load data when wallet connects ────────────────────────

  useEffect(() => {
    if (!accountId || !isConnected) {
      // Reset state when disconnected
      setUnlocked(new Set());
      setStats(defaultStats());
      setFeaturedState([]);
      setTimeline([]);
      setPendingPopups([]);
      setIsLoaded(false);
      currentAccountRef.current = null;
      return;
    }

    // Prevent double-load for same account
    if (currentAccountRef.current === accountId) return;
    currentAccountRef.current = accountId;

    async function loadData() {
      // 1. Load from localStorage first (instant)
      try {
        const storedUnlocked = localStorage.getItem(storageKey(accountId!, 'unlocked'));
        if (storedUnlocked) setUnlocked(new Set(JSON.parse(storedUnlocked)));

        const storedStats = localStorage.getItem(storageKey(accountId!, 'stats'));
        if (storedStats) setStats(prev => ({ ...prev, ...JSON.parse(storedStats) }));

        const storedFeatured = localStorage.getItem(storageKey(accountId!, 'featured'));
        if (storedFeatured) setFeaturedState(JSON.parse(storedFeatured));

        const storedTimeline = localStorage.getItem(storageKey(accountId!, 'timeline'));
        if (storedTimeline) setTimeline(JSON.parse(storedTimeline));
      } catch {
        // Corrupted localStorage
      }

      // 2. Fetch from Supabase (authoritative, merge)
      try {
        const res = await fetch('/api/achievements');
        if (res.ok) {
          const data = await res.json();

          // Merge server achievements with local (server is authoritative)
          if (data.achievements?.length) {
            setUnlocked(prev => {
              const merged = new Set(prev);
              const newTimeline: AchievementTimelineEntry[] = [];
              for (const a of data.achievements) {
                merged.add(a.achievement_id);
                newTimeline.push({
                  id: a.achievement_id,
                  unlockedAt: new Date(a.unlocked_at).getTime(),
                });
              }
              // Persist merged set locally
              localStorage.setItem(storageKey(accountId!, 'unlocked'), JSON.stringify(Array.from(merged)));
              // Set timeline from server (authoritative timestamps)
              setTimeline(newTimeline);
              localStorage.setItem(storageKey(accountId!, 'timeline'), JSON.stringify(newTimeline));
              return merged;
            });
          }

          // Merge stats
          if (data.stats && Object.keys(data.stats).length > 0) {
            setStats(prev => {
              // Take the higher value for each stat (local might be ahead of server)
              const merged = { ...prev };
              for (const [key, serverVal] of Object.entries(data.stats)) {
                if (key === 'featured') continue;
                const localVal = merged[key as keyof UserAchievementStats];
                if (typeof localVal === 'number' && typeof serverVal === 'number') {
                  (merged as Record<string, unknown>)[key] = Math.max(localVal, serverVal);
                } else if (typeof localVal === 'boolean') {
                  (merged as Record<string, unknown>)[key] = localVal || serverVal;
                }
              }
              localStorage.setItem(storageKey(accountId!, 'stats'), JSON.stringify(merged));
              return merged;
            });
          }

          if (data.featured?.length) {
            setFeaturedState(data.featured);
            localStorage.setItem(storageKey(accountId!, 'featured'), JSON.stringify(data.featured));
          }
        }
      } catch {
        // Offline — local data is fine
      }

      setIsLoaded(true);
    }

    loadData();
  }, [accountId, isConnected]);

  // ─── Debounced sync to Supabase ────────────────────────────

  const syncToServer = useCallback((newAchievementIds?: string[]) => {
    if (!isConnected || !accountId) return;

    // Accumulate new achievement IDs
    if (newAchievementIds?.length) {
      pendingSyncRef.current.push(...newAchievementIds);
    }

    // Debounce: wait 2 seconds before syncing
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      const toSync = Array.from(new Set(pendingSyncRef.current));
      pendingSyncRef.current = [];

      // Read current state from localStorage (most up-to-date)
      let currentStats: Record<string, unknown> = {};
      let currentFeatured: string[] = [];
      try {
        const s = localStorage.getItem(storageKey(accountId, 'stats'));
        if (s) currentStats = JSON.parse(s);
        const f = localStorage.getItem(storageKey(accountId, 'featured'));
        if (f) currentFeatured = JSON.parse(f);
      } catch { /* ok */ }

      fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newAchievements: toSync.length > 0 ? toSync : undefined,
          stats: currentStats,
          featured: currentFeatured,
        }),
      }).catch(() => {
        // Offline — will sync next time
      });
    }, 2000);
  }, [isConnected, accountId]);

  // ─── Persist + process helpers ─────────────────────────────

  const persistLocal = useCallback((
    newUnlocked: Set<string>,
    newStats: UserAchievementStats,
    newTimeline: AchievementTimelineEntry[],
    newFeatured?: string[],
  ) => {
    if (!accountId) return;
    localStorage.setItem(storageKey(accountId, 'unlocked'), JSON.stringify(Array.from(newUnlocked)));
    localStorage.setItem(storageKey(accountId, 'stats'), JSON.stringify(newStats));
    localStorage.setItem(storageKey(accountId, 'timeline'), JSON.stringify(newTimeline));
    if (newFeatured) {
      localStorage.setItem(storageKey(accountId, 'featured'), JSON.stringify(newFeatured));
    }
  }, [accountId]);

  const processNewUnlocks = useCallback((
    newAchievements: AchievementDef[],
    currentUnlocked: Set<string>,
    currentTimeline: AchievementTimelineEntry[],
  ): Set<string> => {
    if (newAchievements.length === 0) return currentUnlocked;

    const updated = new Set(currentUnlocked);
    const updatedTimeline = [...currentTimeline];
    const now = Date.now();
    const newIds: string[] = [];

    for (const a of newAchievements) {
      if (!updated.has(a.id)) {
        updated.add(a.id);
        updatedTimeline.push({ id: a.id, unlockedAt: now });
        newIds.push(a.id);
      }
    }

    setUnlocked(updated);
    setTimeline(updatedTimeline);
    // Sort new achievements by rarity priority (legendary first), then append to queue
    const newPending = sortByRarityPriority(newAchievements.filter(a => newIds.includes(a.id)));
    setPendingPopups(prev => {
      // Re-sort entire queue so any existing lower-rarity items yield to incoming legendaries
      return sortByRarityPriority([...prev, ...newPending]);
    });

    // Persist locally
    if (accountId) {
      localStorage.setItem(storageKey(accountId, 'unlocked'), JSON.stringify(Array.from(updated)));
      localStorage.setItem(storageKey(accountId, 'timeline'), JSON.stringify(updatedTimeline));
    }

    // Sync to server
    syncToServer(newIds);

    return updated;
  }, [accountId, syncToServer]);

  // ─── Public API ────────────────────────────────────────────

  const trackStat = useCallback((key: keyof UserAchievementStats, delta = 1): AchievementDef[] => {
    if (!isConnected || !accountId) return NOOP_ACHIEVEMENTS;

    let newlyUnlocked: AchievementDef[] = [];

    setStats(prev => {
      const currentValue = prev[key];
      let updated: UserAchievementStats;

      if (typeof currentValue === 'number') {
        updated = { ...prev, [key]: currentValue + delta };
      } else if (typeof currentValue === 'boolean' && delta > 0) {
        updated = { ...prev, [key]: true };
      } else {
        return prev;
      }

      localStorage.setItem(storageKey(accountId, 'stats'), JSON.stringify(updated));
      newlyUnlocked = evaluateAchievements(updated, unlocked);
      if (newlyUnlocked.length > 0) {
        processNewUnlocks(newlyUnlocked, unlocked, timeline);
      } else {
        // Still sync stats even without new achievements
        syncToServer();
      }
      return updated;
    });

    return newlyUnlocked;
  }, [isConnected, accountId, unlocked, timeline, processNewUnlocks, syncToServer]);

  const setStat = useCallback((key: keyof UserAchievementStats, value: number | boolean): AchievementDef[] => {
    if (!isConnected || !accountId) return NOOP_ACHIEVEMENTS;

    let newlyUnlocked: AchievementDef[] = [];

    setStats(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(storageKey(accountId, 'stats'), JSON.stringify(updated));
      newlyUnlocked = evaluateAchievements(updated, unlocked);
      if (newlyUnlocked.length > 0) {
        processNewUnlocks(newlyUnlocked, unlocked, timeline);
      } else {
        syncToServer();
      }
      return updated;
    });

    return newlyUnlocked;
  }, [isConnected, accountId, unlocked, timeline, processNewUnlocks, syncToServer]);

  const triggerCustom = useCallback((customId: string): AchievementDef | null => {
    if (!isConnected || !accountId) return null;

    const achievement = ACHIEVEMENTS.find(
      a => a.trigger?.custom === customId && !unlocked.has(a.id)
    );
    if (!achievement) return null;

    processNewUnlocks([achievement], unlocked, timeline);
    return achievement;
  }, [isConnected, accountId, unlocked, timeline, processNewUnlocks]);

  const unlock = useCallback((achievementId: string): AchievementDef | null => {
    if (!isConnected || !accountId) return null;
    if (unlocked.has(achievementId)) return null;

    const achievement = ACHIEVEMENT_MAP[achievementId];
    if (!achievement) return null;

    processNewUnlocks([achievement], unlocked, timeline);
    return achievement;
  }, [isConnected, accountId, unlocked, timeline, processNewUnlocks]);

  const dismissPopup = useCallback(() => {
    setPendingPopups(prev => prev.slice(1));
  }, []);

  const setFeatured = useCallback((ids: string[]) => {
    if (!isConnected || !accountId) return;
    const valid = ids.filter(id => unlocked.has(id)).slice(0, 3);
    setFeaturedState(valid);
    localStorage.setItem(storageKey(accountId, 'featured'), JSON.stringify(valid));
    syncToServer();
  }, [isConnected, accountId, unlocked, syncToServer]);

  const isUnlockedFn = useCallback((id: string) => unlocked.has(id), [unlocked]);

  const reevaluate = useCallback((): AchievementDef[] => {
    if (!isConnected) return NOOP_ACHIEVEMENTS;
    const newAchievements = evaluateAchievements(stats, unlocked);
    if (newAchievements.length > 0) {
      processNewUnlocks(newAchievements, unlocked, timeline);
    }
    return newAchievements;
  }, [isConnected, stats, unlocked, timeline, processNewUnlocks]);

  return {
    unlocked,
    stats,
    featured,
    timeline,
    pendingPopups,
    isConnected,
    isLoaded,
    dismissPopup,
    trackStat,
    setStat,
    triggerCustom,
    unlock,
    setFeatured,
    isUnlocked: isUnlockedFn,
    reevaluate,
  };
}
