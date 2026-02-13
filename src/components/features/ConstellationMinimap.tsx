'use client';

import { useEffect, useRef } from 'react';

interface MinimapNode {
  x?: number;
  y?: number;
  id: string;
}

interface MinimapEdge {
  source: MinimapNode | string;
  target: MinimapNode | string;
}

interface MinimapProps {
  nodes: MinimapNode[];
  edges: MinimapEdge[];
  centerNodeId: string;
  viewTransform: { x: number; y: number; k: number };
  containerWidth: number;
  containerHeight: number;
}

const MINIMAP_W = 160;
const MINIMAP_H = 120;

export function ConstellationMinimap({ nodes, edges, centerNodeId, viewTransform, containerWidth, containerHeight }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = MINIMAP_W * dpr;
    canvas.height = MINIMAP_H * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, MINIMAP_W, MINIMAP_H);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, MINIMAP_W, MINIMAP_H);

    // Compute bounds of all nodes
    const validNodes = nodes.filter(n => n.x != null && n.y != null);
    if (validNodes.length === 0) return;

    const xs = validNodes.map(n => n.x!);
    const ys = validNodes.map(n => n.y!);
    const pad = 50;
    const minX = Math.min(...xs) - pad;
    const maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad;
    const maxY = Math.max(...ys) + pad;
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const scaleX = MINIMAP_W / rangeX;
    const scaleY = MINIMAP_H / rangeY;
    const s = Math.min(scaleX, scaleY);
    const offX = (MINIMAP_W - rangeX * s) / 2;
    const offY = (MINIMAP_H - rangeY * s) / 2;

    const toMini = (x: number, y: number) => ({
      mx: (x - minX) * s + offX,
      my: (y - minY) * s + offY,
    });

    // Draw edges
    ctx.strokeStyle = 'rgba(100, 100, 120, 0.3)';
    ctx.lineWidth = 0.5;
    for (const edge of edges) {
      const src = typeof edge.source === 'string' ? nodes.find(n => n.id === edge.source) : edge.source;
      const tgt = typeof edge.target === 'string' ? nodes.find(n => n.id === edge.target) : edge.target;
      if (!src?.x || !src?.y || !tgt?.x || !tgt?.y) continue;
      const a = toMini(src.x, src.y);
      const b = toMini(tgt.x, tgt.y);
      ctx.beginPath();
      ctx.moveTo(a.mx, a.my);
      ctx.lineTo(b.mx, b.my);
      ctx.stroke();
    }

    // Draw nodes
    for (const node of validNodes) {
      const { mx, my } = toMini(node.x!, node.y!);
      ctx.beginPath();
      ctx.arc(mx, my, node.id === centerNodeId ? 3 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = node.id === centerNodeId ? '#ffffff' : '#8B5CF6';
      ctx.fill();
    }

    // Draw viewport rectangle
    const { x: tx, y: ty, k } = viewTransform;
    // Invert transform to find visible area in graph space
    const vLeft = -tx / k;
    const vTop = -ty / k;
    const vRight = (containerWidth - tx) / k;
    const vBottom = (containerHeight - ty) / k;

    const tl = toMini(vLeft, vTop);
    const br = toMini(vRight, vBottom);
    const vw = br.mx - tl.mx;
    const vh = br.my - tl.my;

    ctx.strokeStyle = '#00EC97';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tl.mx, tl.my, vw, vh);

  }, [nodes, edges, centerNodeId, viewTransform, containerWidth, containerHeight]);

  return (
    <div className="absolute bottom-4 right-4 z-10 border border-gray-600 rounded-lg overflow-hidden shadow-lg">
      <canvas
        ref={canvasRef}
        style={{ width: MINIMAP_W, height: MINIMAP_H }}
        className="block"
      />
    </div>
  );
}
