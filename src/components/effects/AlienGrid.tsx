'use client';

import { useEffect, useRef } from 'react';

const HEX_SIZE = 28;
const HEX_W = HEX_SIZE * 2;
const HEX_H = Math.sqrt(3) * HEX_SIZE;
const COLS = 30;
const ROWS = 18;

function hexPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return `M ${points.join(' L ')} Z`;
}

export function AlienGrid() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const hexes = svg.querySelectorAll<SVGPathElement>('.hex-cell');
    const timers: ReturnType<typeof setTimeout>[] = [];

    const flickerHex = (hex: SVGPathElement) => {
      const randomDelay = Math.random() * 15000;
      const t = setTimeout(() => {
        hex.style.animation = 'hex-flicker 2s ease-in-out forwards';
        const reset = setTimeout(() => {
          hex.style.animation = '';
          flickerHex(hex);
        }, 2000);
        timers.push(reset);
      }, randomDelay);
      timers.push(t);
    };

    hexes.forEach((hex) => flickerHex(hex));
    return () => timers.forEach(clearTimeout);
  }, []);

  const hexes: { d: string; key: string }[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const offsetX = row % 2 === 1 ? HEX_W * 0.75 : 0;
      const cx = col * HEX_W * 0.75 + offsetX + HEX_SIZE;
      const cy = row * HEX_H * 0.5 + HEX_SIZE;
      hexes.push({ d: hexPath(cx, cy, HEX_SIZE - 1), key: `${row}-${col}` });
    }
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${COLS * HEX_W * 0.75 + HEX_SIZE} ${ROWS * HEX_H * 0.5 + HEX_SIZE}`}
        preserveAspectRatio="xMidYMid slice"
        className="opacity-[0.04]"
      >
        {hexes.map(({ d, key }) => (
          <path
            key={key}
            d={d}
            className="hex-cell"
            fill="none"
            stroke="rgba(0,236,151,0.8)"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  );
}
