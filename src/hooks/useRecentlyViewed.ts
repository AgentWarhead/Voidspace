/* ─── useRecentlyViewed ─────────────────────────────────────────────────────
 * Tracks the last 5 opportunity pages a user visits, persisted to localStorage.
 * Snapshot shape is intentionally minimal — just enough to render a card.
 * ─────────────────────────────────────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'vs:recently-viewed-voids';
const MAX_ITEMS = 5;

export interface RecentlyViewedItem {
  id: string;
  title: string;
  gap_score: number;
  category_name: string;
  category_icon: string;
  slug?: string;
}

function readStorage(): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as RecentlyViewedItem[];
  } catch {
    return [];
  }
}

function writeStorage(items: RecentlyViewedItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded or private browsing — silent fail
  }
}

/**
 * Returns [items, recordView].
 * - `items`      : the last ≤5 viewed opportunities (excludes the current one)
 * - `recordView` : call once when landing on an opportunity page
 */
export function useRecentlyViewed(currentId?: string): [RecentlyViewedItem[], (item: RecentlyViewedItem) => void] {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    const stored = readStorage();
    // Exclude current page from display list
    setItems(stored.filter((i) => i.id !== currentId));
  }, [currentId]);

  const recordView = useCallback((item: RecentlyViewedItem) => {
    const stored = readStorage();
    // Remove any existing entry for this id
    const without = stored.filter((i) => i.id !== item.id);
    // Prepend and cap
    const updated = [item, ...without].slice(0, MAX_ITEMS);
    writeStorage(updated);
    // Update display list (exclude the page we're currently on)
    setItems(updated.filter((i) => i.id !== item.id));
  }, []);

  return [items, recordView];
}
