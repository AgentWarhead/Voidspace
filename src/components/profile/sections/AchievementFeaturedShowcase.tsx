'use client';

import { ACHIEVEMENTS } from '@/lib/achievements';
import { AchievementCard } from '@/components/achievements/AchievementCard';

interface FeaturedShowcaseProps {
  featured: string[];
  timelineMap: Map<string, number>;
  onToggleFeatured: (id: string) => void;
}

export function AchievementFeaturedShowcase({
  featured,
  timelineMap,
  onToggleFeatured,
}: FeaturedShowcaseProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs uppercase tracking-wider text-text-muted font-medium">
        ⭐ Featured ({featured.length}/3)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {featured.map((id) => {
          const achievement = ACHIEVEMENTS.find((a) => a.id === id);
          if (!achievement) return null;
          return (
            <AchievementCard
              key={id}
              achievement={achievement}
              isUnlocked={true}
              isFeatured={true}
              unlockedAt={timelineMap.get(id)}
              onToggleFeatured={onToggleFeatured}
              featuredCount={featured.length}
            />
          );
        })}
      </div>
    </div>
  );
}
