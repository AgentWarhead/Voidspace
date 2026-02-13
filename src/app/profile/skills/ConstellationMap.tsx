'use client';

import { useRef, useCallback, useState, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import {
  TRACK_CONFIG, TRACK_QUADRANTS, MAP_WIDTH, MAP_HEIGHT,
  type SkillNode, type TrackId, type NodeStatus,
} from './constellation-data';
import { ConstellationNebula, ConstellationStarField } from './ConstellationNebula';
import { ConstellationLines } from './ConstellationLines';
import { ConstellationNode } from './ConstellationNode';
import { ConstellationMinimap } from './ConstellationMinimap';

/* ─── Interactive Zoomable / Pannable Map ──────────────────── */

interface MapProps {
  filteredNodes: SkillNode[];
  positions: Map<string, { x: number; y: number }>;
  selectedNode: string | null;
  completedNodes: Set<string>;
  zoom: number;
  panX: number;
  panY: number;
  onSelect: (id: string) => void;
  onSetZoom: (z: number) => void;
  onSetPan: (x: number, y: number) => void;
  onZoomToTrack: (track: TrackId) => void;
  getStatus: (id: string) => NodeStatus;
  trackCompletions: Record<TrackId, boolean>;
}

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 3;

export function ConstellationMap({
  filteredNodes, positions, selectedNode, completedNodes,
  zoom, panX, panY,
  onSelect, onSetZoom, onSetPan, onZoomToTrack, getStatus,
  trackCompletions,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  const hasInitialFit = useRef(false);

  // Track container size + auto-fit on first mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });

      // Auto-fit: center the constellation in viewport on initial load
      if (!hasInitialFit.current && width > 0 && height > 0) {
        hasInitialFit.current = true;
        // Calculate zoom to fit content with slight padding
        const padding = 0.92; // 8% breathing room
        const zoomX = (width / MAP_WIDTH) * padding;
        const zoomY = (height / MAP_HEIGHT) * padding;
        const fitZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(zoomX, zoomY)));
        // Center the map in the container
        const fitPanX = (width - MAP_WIDTH * fitZoom) / 2;
        const fitPanY = (height - MAP_HEIGHT * fitZoom) / 2;
        onSetZoom(fitZoom);
        onSetPan(fitPanX, fitPanY);
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onSetZoom, onSetPan]);

  // Mouse wheel zoom (centered on cursor)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * delta));
    const scale = newZoom / zoom;

    // Adjust pan to zoom toward cursor
    const newPanX = mouseX - scale * (mouseX - panX);
    const newPanY = mouseY - scale * (mouseY - panY);

    onSetZoom(newZoom);
    onSetPan(newPanX, newPanY);
  }, [zoom, panX, panY, onSetZoom, onSetPan]);

  // Drag to pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX, panY };
  }, [panX, panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    onSetPan(dragStart.current.panX + dx, dragStart.current.panY + dy);
  }, [isDragging, onSetPan]);

  const handleMouseUp = useCallback(() => { setIsDragging(false); }, []);

  // Track label positions (as percentages)
  const trackLabels = [
    { id: 'explorer' as TrackId, label: 'Explorer · 16', color: 'text-accent-cyan' },
    { id: 'builder' as TrackId, label: 'Builder · 22', color: 'text-near-green' },
    { id: 'hacker' as TrackId, label: 'Hacker · 16', color: 'text-purple-400' },
    { id: 'founder' as TrackId, label: 'Founder · 12', color: 'text-accent-orange' },
  ];

  const handleMinimapJump = useCallback((x: number, y: number) => {
    onSetPan(x, y);
  }, [onSetPan]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'hidden lg:block relative h-[calc(100vh-220px)] min-h-[600px] rounded-xl border border-border/30 bg-background/80 overflow-hidden select-none',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
      )}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Star field (parallax-aware) */}
      <ConstellationStarField panX={panX} panY={panY} />

      {/* Transformed content */}
      <div
        className="absolute inset-0 origin-center"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
        }}
      >
        {/* Nebula backgrounds */}
        <ConstellationNebula trackCompletions={trackCompletions} />

        {/* Track labels */}
        {trackLabels.map(t => {
          const q = TRACK_QUADRANTS[t.id];
          const pctX = (q.cx / MAP_WIDTH) * 100;
          const pctY = ((q.cy - 180) / MAP_HEIGHT) * 100;
          return (
            <div
              key={t.id}
              className="absolute z-20 cursor-pointer"
              style={{ left: `${pctX}%`, top: `${Math.max(2, pctY)}%`, transform: 'translate(-50%, -50%)' }}
              onDoubleClick={() => onZoomToTrack(t.id)}
            >
              <span className={cn('text-[10px] font-mono uppercase tracking-widest hover:brightness-150 transition-all', t.color)}>
                {t.label}
              </span>
            </div>
          );
        })}

        {/* Connection lines */}
        <ConstellationLines positions={positions} getStatus={getStatus} />

        {/* Nodes */}
        {filteredNodes.map((node, i) => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          return (
            <ConstellationNode
              key={node.id}
              node={node}
              status={getStatus(node.id)}
              isSelected={selectedNode === node.id}
              onSelect={onSelect}
              x={pos.x}
              y={pos.y}
              index={i}
            />
          );
        })}
      </div>

      {/* Minimap */}
      <ConstellationMinimap
        positions={positions}
        zoom={zoom}
        panX={panX}
        panY={panY}
        containerWidth={containerSize.w}
        containerHeight={containerSize.h}
        onJump={handleMinimapJump}
        getStatus={getStatus}
      />

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 z-30 flex gap-1">
        <button
          onClick={() => onSetZoom(Math.min(MAX_ZOOM, zoom * 1.3))}
          className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors text-sm font-mono"
        >
          +
        </button>
        <button
          onClick={() => onSetZoom(Math.max(MIN_ZOOM, zoom / 1.3))}
          className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors text-sm font-mono"
        >
          −
        </button>
      </div>
    </div>
  );
}
