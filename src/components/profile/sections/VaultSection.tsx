/* ─── VaultSection — Trophy Vault embedded in Void Command Center
 * Wraps TrophyVault component for use inside the profile command center.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { TrophyVault } from '@/components/trophies/TrophyVault';

export function VaultSection() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-text-primary">Achievements</h2>
        <p className="text-sm text-text-muted">Your trophy collection, featured pins, and legendary conquests.</p>
      </div>
      <TrophyVault embedded />
    </div>
  );
}
