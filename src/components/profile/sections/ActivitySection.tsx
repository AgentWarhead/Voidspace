/* ─── ActivitySection — Recent achievement timeline + stats ──
 * Shows recent unlock activity and usage summary.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/effects/GradientText';
import { AchievementTimeline } from '@/components/achievements/AchievementTimeline';
import { useAchievementContext } from '@/contexts/AchievementContext';

interface ActivitySectionProps {
  stats?: {
    voidsExplored: number;
    briefsGenerated: number;
    building: number;
    shipped: number;
  };
}

export function ActivitySection({ stats }: ActivitySectionProps) {
  const { timeline, unlocked } = useAchievementContext();

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
        📊 <GradientText>Activity</GradientText>
      </h2>

      {/* Usage Summary */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Voids Explored', value: stats.voidsExplored, emoji: '🌌' },
            { label: 'Briefs Generated', value: stats.briefsGenerated, emoji: '📄' },
            { label: 'Currently Building', value: stats.building, emoji: '🔨' },
            { label: 'Achievements', value: unlocked.size, emoji: '🏆' },
          ].map(({ label, value, emoji }) => (
            <Card key={label} variant="glass" padding="md" className="text-center">
              <span className="text-lg">{emoji}</span>
              <div className="text-2xl font-bold text-text-primary mt-1">{value}</div>
              <div className="text-xs text-text-muted mt-0.5">{label}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Achievement Timeline */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary mb-3">
          Recent Unlocks
        </h3>
        <Card variant="glass" padding="md">
          <AchievementTimeline timeline={timeline} limit={20} />
        </Card>
      </div>
    </div>
  );
}
