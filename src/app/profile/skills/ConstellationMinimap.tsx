'use client';

import { useCallback, memo } from 'react';
import { skillNodes, TRACK_CONFIG, MAP_WIDTH, MAP_HEIGHT, type TrackId } from './constellation-data';

/* ─── Corner Minimap ───────────────────────────────────────── */

interface MinimapProps {
  positions: Map<string, { x: number; y: number }>;
  zoom: number;
  panX: number;
  panY: number;
  containerWidth: number;
  containerHeight: number;
  onJump: (x: number, y: number) => void;
  getStatus: (id: string) => 'completed' | 'available' | 'locked';
}

const MINIMAP_W = 160;
const MINIMAP_H = 120;

const TRACK_HEX: Record<TrackId, string> = {
  explorer: '#00D4FF',
  builder: '#00EC97',
  hacker: '#C084FC',
  founder: '#FB923C',
};

function ConstellationMinimapInner({
  positions, zoom, panX, panY, containerWidth, containerHeight, onJump, getStatus,
}: MinimapProps) {
  const scaleX = MINIMAP_W / MAP_WIDTH;
  const scaleY = MINIMAP_H / MAP_HEIGHT;

  // Viewport rectangle on minimap
  const vpW = containerWidth > 0 ? (containerWidth / zoom) * scaleX : MINIMAP_W;
  const vpH = containerHeight > 0 ? (containerHeight / zoom) * scaleY : MINIMAP_H;
  // Center of viewport in map coords
  const vpCenterX = MAP_WIDTH / 2 - panX / zoom;
  const vpCenterY = MAP_HEIGHT / 2 - panY / zoom;
  const vpX = vpCenterX * scaleX - vpW / 2;
  const vpY = vpCenterY * scaleY - vpH / 2;

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Convert minimap coords to map coords
    const mapX = mx / scaleX;
    const mapY = my / scaleY;
    // Set pan so this point is centered
    const newPanX = -(mapX - MAP_WIDTH / 2) * zoom;
    const newPanY = -(mapY - MAP_HEIGHT / 2) * zoom;
    onJump(newPanX, newPanY);
  }, [scaleX, scaleY, zoom, onJump]);

  return (
    <div className="absolute bottom-4 right-4 z-30 rounded-lg overflow-hidden border border-border/40 bg-background/70 backdrop-blur-sm shadow-lg">
      <svg
        width={MINIMAP_W}
        height={MINIMAP_H}
        className="cursor-pointer"
        onClick={handleClick}
      >
        {/* Nodes as dots */}
        {skillNodes.map(node => {
          const p = positions.get(node.id);
          if (!p) return null;
          const status = getStatus(node.id);
          const color = status === 'completed'
            ? TRACK_HEX[node.track]
            : status === 'available'
            ? TRACK_HEX[node.track]
            : 'rgba(60,60,60,0.3)';
          const r = status === 'completed' ? 2.5 : status === 'available' ? 2 : 1.2;
          return (
            <circle
              key={node.id}
              cx={p.x * scaleX}
              cy={p.y * scaleY}
              r={r}
              fill={color}
              opacity={status === 'locked' ? 0.3 : 0.9}
            />
          );
        })}
        {/* Viewport rectangle */}
        <rect
          x={Math.max(0, vpX)}
          y={Math.max(0, vpY)}
          width={Math.min(vpW, MINIMAP_W)}
          height={Math.min(vpH, MINIMAP_H)}
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(0,236,151,0.5)"
          strokeWidth={1.5}
          rx={2}
        />
      </svg>
    </div>
  );
}

export const ConstellationMinimap = memo(ConstellationMinimapInner);
