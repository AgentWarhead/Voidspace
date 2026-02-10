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
  if (diffDays < 7) {
    return size === 'sm' ? 'Just detected' : 'Just detected';
  }
  
  if (diffDays < 30) {
    return size === 'sm' ? `Open for ${diffDays} days` : `Open for ${diffDays} days`;
  }
  
  if (diffDays < 90) {
    const contextText = size === 'md' ? ' — still unfilled' : '';
    return `Open for ${diffDays} days${contextText}`;
  }
  
  // 90+ days
  const contextText = size === 'md' ? " — nobody's building this" : '';
  return `OPEN FOR ${diffDays} DAYS${contextText}`;
}

function getColorClasses(diffDays: number) {
  if (diffDays < 7) {
    return 'text-[#00EC97]'; // nearGreen
  }
  
  if (diffDays < 30) {
    return 'text-yellow-500'; // yellow/amber
  }
  
  if (diffDays < 90) {
    return 'text-[#FFA502]'; // Warning orange
  }
  
  // 90+ days
  return 'text-[#FF4757]'; // Error red
}

export function VoidTimer({ createdAt, size }: VoidTimerProps) {
  const { diffDays, diffMonths } = calculateTimeSinceCreated(createdAt);
  const timeText = formatTimeText(diffDays, diffMonths, size);
  const colorClasses = getColorClasses(diffDays);
  
  const isPulsing = diffDays >= 90;
  const isNew = diffDays < 7;

  const sizeClasses = size === 'sm' 
    ? 'text-xs gap-1' 
    : 'text-sm gap-1.5';

  return (
    <div className={cn('inline-flex items-center', sizeClasses)}>
      {isPulsing ? (
        <motion.div
          className={cn('flex items-center gap-1', sizeClasses)}
          animate={{
            opacity: [1, 0.6, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          <Clock className={cn('shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4', colorClasses)} />
          <span className={cn('font-medium', colorClasses)}>
            {timeText}
          </span>
        </motion.div>
      ) : (
        <div className={cn('flex items-center', sizeClasses)}>
          <Clock className={cn('shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4', colorClasses)} />
          <span className={cn('font-medium', colorClasses)}>
            {timeText}
          </span>
          {isNew && (
            <Badge variant="default" className="ml-1 px-1.5 py-0.5 text-xs bg-[#00EC97] text-black">
              NEW
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}