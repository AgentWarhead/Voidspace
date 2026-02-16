/* ─── ArsenalSection — Credit Dashboard wrapper ──────────────
 * Wraps the existing CreditDashboard in the command center.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { CreditDashboard } from '@/components/credits/CreditDashboard';
import { GradientText } from '@/components/effects/GradientText';
import type { TierName } from '@/types';

interface ArsenalSectionProps {
  userId: string;
  tier: TierName;
}

export function ArsenalSection({ userId, tier }: ArsenalSectionProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-text-primary flex items-center gap-2">
        ⚡ <GradientText>Sanctum Arsenal</GradientText>
      </h2>
      <CreditDashboard userId={userId} tier={tier} />
    </div>
  );
}
