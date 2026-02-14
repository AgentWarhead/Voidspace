'use client';

import { useEffect } from 'react';
import { useAchievementContext } from '@/contexts/AchievementContext';

interface ProjectViewTrackerProps {
  category?: string;
}

/**
 * Thin client component to track project page views for achievements.
 * Drop into server-rendered project detail pages.
 */
export function ProjectViewTracker({ category }: ProjectViewTrackerProps) {
  const { trackStat, setStat } = useAchievementContext();

  useEffect(() => {
    trackStat('voidsExplored');

    // Track unique categories explored via localStorage
    if (category) {
      try {
        const key = 'voidspace-categories-explored';
        const stored = localStorage.getItem(key);
        const categories: string[] = stored ? JSON.parse(stored) : [];
        if (!categories.includes(category)) {
          categories.push(category);
          localStorage.setItem(key, JSON.stringify(categories));
        }
        setStat('uniqueCategoriesExplored', categories.length);
      } catch { /* silent */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
