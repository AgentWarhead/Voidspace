'use client';

import { cn } from '@/lib/utils';

interface ScanLineProps {
  className?: string;
}

export function ScanLine({ className }: ScanLineProps) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none z-10', className)}
      aria-hidden="true"
    >
      <div
        className="absolute left-0 right-0 h-[2px] animate-scan"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(0,236,151,0.6) 30%, rgba(0,236,151,0.8) 50%, rgba(0,236,151,0.6) 70%, transparent 100%)',
          boxShadow: '0 0 12px rgba(0,236,151,0.4), 0 0 24px rgba(0,236,151,0.2)',
        }}
      />
    </div>
  );
}
