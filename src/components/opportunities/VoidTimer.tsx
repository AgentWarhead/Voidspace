'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface VoidTimerProps {
  createdAt: string;
  size: 'sm' | 'md';
}

function calculateTimeSinceCreated(createdAt: string) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  return { diffDays, diffMonths };
}

function formatTimeText(diffDays: number, diffMonths: number, size: 'sm' | 'md') {
  if (diffDays < 7) return 'Just detected';
  if (diffDays < 30) return `Open ${diffDays}d`;
  if (diffDays < 90) {
    const ctx = size === 'md' ? ' — still unfilled' : '';
    return `Open ${diffDays}d${ctx}`;
  }
  const ctx = size === 'md' ? " — nobody's building this" : '';
  return `OPEN ${diffDays}D${ctx}`;
}

function getColorClasses(diffDays: number) {
  if (diffDays < 7) return 'text-[#00EC97]';
  if (diffDays < 30) return 'text-yellow-500';
  if (diffDays < 90) return 'text-[#FFA502]';
  return 'text-[#FF4757]';
}

export function VoidTimer({ createdAt, size }: VoidTimerProps) {
  const { diffDays, diffMonths } = calculateTimeSinceCreated(createdAt);
  const timeText = formatTimeText(diffDays, diffMonths, size);
  const colorClasses = getColorClasses(diffDays);
  
  const isPulsing = diffDays >= 90;
  const isNew = diffDays < 7;

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] sm:text-xs gap-1' 
    : 'text-xs sm:text-sm gap-1.5';

  return (
    <div className={cn('inline-flex items-center', sizeClasses)}>
      {isPulsing ? (
        <motion.div
          className={cn('flex items-center gap-1', sizeClasses)}
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Clock className={cn('shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4', colorClasses)} />
          <span className={cn('font-medium', colorClasses)}>{timeText}</span>
        </motion.div>
      ) : (
        <div className={cn('flex items-center', sizeClasses)}>
          <Clock className={cn('shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4', colorClasses)} />
          <span className={cn('font-medium', colorClasses)}>{timeText}</span>
          {isNew && (
            <Badge variant="default" className="ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs bg-[#00EC97] text-black">
              NEW
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
