/* ─── MissionsSection — Void Missions grid with filters ──────
 * Moved from ProfileContent. Same filter, sort, grid logic.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Filter, Bookmark } from 'lucide-react';
import { Card, Button, VoidEmptyState } from '@/components/ui';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { VoidMissionCard } from '@/components/profile/VoidMissionCard';
import type { SavedOpportunity, MissionStatus } from '@/types';

type FilterStatus = 'all' | MissionStatus;

interface MissionsSectionProps {
  missions: SavedOpportunity[];
  focusedMission: string | null;
  missionsLoading: boolean;
  buildingCount: number;
  onUpdate: (opportunityId: string, updates: Partial<SavedOpportunity>) => Promise<void>;
  onSetFocus: (opportunityId: string) => void;
}

export function MissionsSection({
  missions,
  focusedMission,
  missionsLoading,
  buildingCount,
  onUpdate,
  onSetFocus,
}: MissionsSectionProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredMissions = useMemo(
    () => missions.filter((m) => filterStatus === 'all' || m.status === filterStatus),
    [missions, filterStatus],
  );

  const sortedMissions = useMemo(
    () =>
      [...filteredMissions].sort((a, b) => {
        if (a.opportunity_id === focusedMission) return -1;
        if (b.opportunity_id === focusedMission) return 1;
        return (
          new Date(b.updated_at || b.created_at).getTime() -
          new Date(a.updated_at || a.created_at).getTime()
        );
      }),
    [filteredMissions, focusedMission],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Void Missions"
          count={missions.length}
          badge={buildingCount > 0 ? `${buildingCount} ACTIVE` : undefined}
        />

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-secondary focus:outline-none focus:border-near-green/50"
          >
            <option value="all">All Missions</option>
            <option value="saved">📑 Saved</option>
            <option value="researching">🔍 Researching</option>
            <option value="building">🔨 Building</option>
            <option value="shipped">🚀 Shipped</option>
            <option value="paused">⏸️ Paused</option>
          </select>
        </div>
      </div>

      {missionsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-surface rounded-xl animate-pulse" />
          ))}
        </div>
      ) : sortedMissions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedMissions.map((mission) => (
            <VoidMissionCard
              key={mission.id}
              mission={mission}
              onUpdate={onUpdate}
              onSetFocus={onSetFocus}
              isFocused={mission.opportunity_id === focusedMission}
            />
          ))}
        </div>
      ) : (
        <Card variant="glass" padding="lg">
          <VoidEmptyState
            icon={filterStatus === 'all' ? Bookmark : SearchIcon}
            title={filterStatus === 'all' ? 'No saved opportunities yet' : `No ${filterStatus} missions`}
            description={
              filterStatus === 'all'
                ? 'Browse voids and save the ones that interest you'
                : 'Change the filter to see other missions, or explore new voids.'
            }
            actionLabel="Explore Voids"
            actionHref="/opportunities"
          />
        </Card>
      )}

      {/* Footer Stats */}
      {missions.length > 0 && (
        <Card variant="glass" padding="md" className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="text-text-muted">
              Total: <span className="text-text-primary font-mono">{missions.length}</span>
            </span>
            <span className="text-text-muted">
              Shipped:{' '}
              <span className="text-near-green font-mono">
                {missions.length > 0
                  ? Math.round(
                      (missions.filter((m) => m.status === 'shipped').length / missions.length) *
                        100,
                    )
                  : 0}
                %
              </span>
            </span>
          </div>
          <Link
            href="/opportunities"
            className="text-near-green/70 hover:text-near-green transition-colors"
          >
            + Add Mission
          </Link>
        </Card>
      )}
    </div>
  );
}
