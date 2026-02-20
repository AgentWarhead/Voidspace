'use client';

import { useState, useEffect } from 'react';

function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `T+${h}:${m}:${s}`;
}

interface SignalCornerProps {
  position?: 'top-left' | 'bottom-right';
}

export function SignalCorner({ position = 'top-left' }: SignalCornerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isTopLeft = position === 'top-left';

  const cornerStyle: React.CSSProperties = {
    position: 'absolute',
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    fontSize: '10px',
    color: 'rgba(0,236,151,0.4)',
    lineHeight: 1.6,
    letterSpacing: '0.05em',
    zIndex: 10,
    pointerEvents: 'none',
    ...(isTopLeft
      ? { top: '16px', left: '16px' }
      : { bottom: '16px', right: '16px' }),
  };

  if (isTopLeft) {
    return (
      <div className="hidden md:block" style={cornerStyle} aria-hidden="true">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-near-green"
            style={{ animation: 'transmission-blink 1.2s step-start infinite' }}
          />
          <span>SIG:NEAR-0x4f2a</span>
        </div>
        <div>LAT:-33.7° VOID</div>
        <div>{formatTimer(elapsed)}</div>
      </div>
    );
  }

  return (
    <div
      className="hidden md:block"
      style={{ ...cornerStyle, textAlign: 'right' }}
      aria-hidden="true"
    >
      <div>FREQ:7.83Hz</div>
      <div>SECTOR:7G</div>
      <div style={{ color: 'rgba(0,236,151,0.25)' }}>◈ SIGNAL LOCKED</div>
    </div>
  );
}
