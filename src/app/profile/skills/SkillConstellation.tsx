'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GlowCard } from '@/components/effects/GlowCard';
import { type TrackId } from './constellation-data';
import { useConstellationState } from './useConstellationState';
import { ConstellationHeader } from './ConstellationHeader';
import { ConstellationMap } from './ConstellationMap';
import { ConstellationSidePanel } from './ConstellationSidePanel';
import { ConstellationMobile } from './ConstellationMobile';
import { ConstellationCelebration } from './ConstellationCelebration';
import { useAchievementContext } from '@/contexts/AchievementContext';

/* ─── Thin Orchestrator ────────────────────────────────────── */

export function SkillConstellation() {
  const state = useConstellationState();
  const { trackStat } = useAchievementContext();

  // Achievement: track page visit
  useEffect(() => {
    trackStat('constellationVisits');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackIds: TrackId[] = ['explorer', 'builder', 'hacker', 'founder'];
  const trackCompletions = Object.fromEntries(
    trackIds.map(id => [id, state.getTrackStats(id).pct === 100])
  ) as Record<TrackId, boolean>;

  return (
    <div className="space-y-8">
      {/* Header: progress, level, filters, track summaries, streak */}
      <ConstellationHeader
        completedCount={state.completedCount}
        earnedXP={state.earnedXP}
        level={state.level}
        nextLevel={state.nextLevel}
        activeTrack={state.activeTrack}
        onSetTrack={state.setActiveTrack}
        onReset={state.handleReset}
        getTrackStats={state.getTrackStats}
        streak={state.streak}
      />

      {/* Desktop: Interactive galaxy map */}
      <ConstellationMap
        filteredNodes={state.filteredNodes}
        positions={state.positions}
        selectedNode={state.selectedNode}
        completedNodes={state.completedNodes}
        zoom={state.zoom}
        panX={state.panX}
        panY={state.panY}
        onSelect={state.handleSelect}
        onSetZoom={state.setZoom}
        onSetPan={state.setPan}
        onZoomToTrack={state.zoomToTrack}
        getStatus={state.getStatus}
        trackCompletions={trackCompletions}
      />

      {/* Side panel (desktop detail drawer) */}
      <ConstellationSidePanel
        nodeId={state.selectedNode}
        getStatus={state.getStatus}
        onClose={() => state.handleSelect(state.selectedNode || '')}
        onToggleComplete={state.handleToggleComplete}
      />

      {/* Celebration overlay */}
      <ConstellationCelebration
        completedNodeId={state.celebration.completedNodeId}
        levelUp={state.celebration.levelUp}
        onDismiss={state.dismissCelebration}
      />

      {/* Mobile: List view */}
      <ConstellationMobile
        activeTrack={state.activeTrack}
        completedNodes={state.completedNodes}
        selectedNode={state.selectedNode}
        onSelect={state.handleSelect}
        onToggleComplete={state.handleToggleComplete}
      />

      {/* Certificates CTA */}
      <ScrollReveal>
        <Link href="/learn/certificate" className="block group">
          <GlowCard className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <Award className="w-8 h-8 text-near-green" />
              <h3 className="text-lg font-bold text-text-primary group-hover:text-near-green transition-colors">
                Earn Your Certificates
              </h3>
              <p className="text-sm text-text-muted max-w-md">
                Complete a track to earn a shareable NEAR certificate. Prove your skills to the ecosystem.
              </p>
              <span className="text-xs text-near-green font-mono">View Certificates →</span>
            </div>
          </GlowCard>
        </Link>
      </ScrollReveal>
    </div>
  );
}
