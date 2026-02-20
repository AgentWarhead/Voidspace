'use client';

import { cn } from '@/lib/utils';

interface ScanLineProps {
  className?: string;
}

export function ScanLine({ className }: ScanLineProps) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      <div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(0,236,151,0.15) 20%, rgba(0,236,151,0.25) 50%, rgba(0,236,151,0.15) 80%, transparent 100%)',
          boxShadow: '0 0 8px rgba(0,236,151,0.15), 0 0 16px rgba(0,236,151,0.08)',
          animation: 'scan-sweep 8s linear infinite',
          willChange: 'transform',
          top: '-2px',
        }}
      />
    </div>
  );
}
