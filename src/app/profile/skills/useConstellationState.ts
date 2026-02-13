'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  skillNodes, TRACK_CONFIG, LEVELS, TOTAL_MODULES,
  loadProgress, saveProgress, getNodeStatus, getLevel, computeNodePositions,
  TRACK_QUADRANTS, MAP_WIDTH, MAP_HEIGHT,
  recordCompletion, getCurrentStreak,
  type TrackId, type NodeStatus, type Level,
} from './constellation-data';

/* ─── Types ────────────────────────────────────────────────── */

export interface CelebrationState {
  completedNodeId: string | null;
  levelUp: { level: Level; xpGained: number } | null;
}

export interface ConstellationState {
  completedNodes: Set<string>;
  selectedNode: string | null;
  activeTrack: TrackId | 'all';
  zoom: number;
  panX: number;
  panY: number;
  completedCount: number;
  totalXP: number;
  earnedXP: number;
  level: Level;
  nextLevel: Level | undefined;
  filteredNodes: typeof skillNodes;
  positions: Map<string, { x: number; y: number }>;
  streak: number;
  celebration: CelebrationState;

  handleSelect: (id: string) => void;
  handleToggleComplete: (id: string) => void;
  handleReset: () => void;
  dismissCelebration: () => void;
  setActiveTrack: (track: TrackId | 'all') => void;
  setZoom: (z: number) => void;
  setPan: (x: number, y: number) => void;
  zoomToTrack: (track: TrackId) => void;
  zoomToFit: () => void;
  getStatus: (nodeId: string) => NodeStatus;
  getTrackStats: (trackId: TrackId) => {
    completed: number; total: number; earnedXP: number; totalXP: number; pct: number;
  };
}

/* ─── Hook ─────────────────────────────────────────────────── */

export function useConstellationState(): ConstellationState {
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(() => loadProgress());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<TrackId | 'all'>('all');
  const [zoom, setZoom] = useState(0.55);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebration, setCelebration] = useState<CelebrationState>({
    completedNodeId: null,
    levelUp: null,
  });

  // Load streak on mount
  useEffect(() => { setStreak(getCurrentStreak()); }, []);

  // Persist progress
  useEffect(() => { saveProgress(completedNodes); }, [completedNodes]);

  const positions = useMemo(() => computeNodePositions(), []);

  const handleSelect = useCallback((id: string) => {
    setSelectedNode(prev => (prev === id ? null : id));
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    setCompletedNodes(prev => {
      const next = new Set(prev);
      const isCompleting = !next.has(id);

      if (isCompleting) {
        next.add(id);

        // Calculate XP before and after
        const node = skillNodes.find(n => n.id === id);
        const prevXP = skillNodes.filter(n => prev.has(n.id)).reduce((s, n) => s + n.xp, 0);
        const newXP = prevXP + (node?.xp || 0);
        const prevLevel = getLevel(prevXP);
        const newLevel = getLevel(newXP);

        // Record streak
        const newStreak = recordCompletion();
        setStreak(newStreak.count);

        // Trigger celebration
        if (newLevel.minXP > prevLevel.minXP) {
          // Level up!
          setCelebration({
            completedNodeId: id,
            levelUp: { level: newLevel, xpGained: node?.xp || 0 },
          });
        } else {
          // Just a sparkle burst
          setCelebration({ completedNodeId: id, levelUp: null });
        }
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebration({ completedNodeId: null, levelUp: null });
  }, []);

  const handleReset = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('Reset all progress? This cannot be undone.')) return;
    setCompletedNodes(new Set());
    setSelectedNode(null);
  }, []);

  const setPan = useCallback((x: number, y: number) => {
    setPanX(x);
    setPanY(y);
  }, []);

  const zoomToTrack = useCallback((track: TrackId) => {
    const q = TRACK_QUADRANTS[track];
    setZoom(1.0);
    setPanX(-(q.cx - MAP_WIDTH / 2) * 1.0);
    setPanY(-(q.cy - MAP_HEIGHT / 2) * 1.0);
    setActiveTrack(track);
  }, []);

  const zoomToFit = useCallback(() => {
    setZoom(0.55);
    setPanX(0);
    setPanY(0);
    setActiveTrack('all');
  }, []);

  const getStatus = useCallback((nodeId: string) => getNodeStatus(nodeId, completedNodes), [completedNodes]);

  const completedCount = skillNodes.filter(n => completedNodes.has(n.id)).length;
  const totalXP = skillNodes.reduce((s, n) => s + n.xp, 0);
  const earnedXP = skillNodes.filter(n => completedNodes.has(n.id)).reduce((s, n) => s + n.xp, 0);
  const level = getLevel(earnedXP);
  const nextLevel = LEVELS.find(l => l.minXP > earnedXP);
  const filteredNodes = activeTrack === 'all' ? skillNodes : skillNodes.filter(n => n.track === activeTrack);

  const getTrackStats = useCallback((trackId: TrackId) => {
    const trackNodes = skillNodes.filter(n => n.track === trackId);
    const completed = trackNodes.filter(n => completedNodes.has(n.id)).length;
    const total = trackNodes.length;
    const tXP = trackNodes.reduce((s, n) => s + n.xp, 0);
    const eXP = trackNodes.filter(n => completedNodes.has(n.id)).reduce((s, n) => s + n.xp, 0);
    return { completed, total, earnedXP: eXP, totalXP: tXP, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [completedNodes]);

  return {
    completedNodes, selectedNode, activeTrack,
    zoom, panX, panY, streak, celebration,
    completedCount, totalXP, earnedXP, level, nextLevel,
    filteredNodes, positions,
    handleSelect, handleToggleComplete, handleReset, dismissCelebration,
    setActiveTrack, setZoom, setPan, zoomToTrack, zoomToFit,
    getStatus, getTrackStats,
  };
}
