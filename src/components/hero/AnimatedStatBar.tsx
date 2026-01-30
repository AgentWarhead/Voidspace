'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { formatNumber, formatCurrency } from '@/lib/utils';
import type { EcosystemStats } from '@/types';

interface AnimatedStatBarProps {
  stats: EcosystemStats;
  totalOpportunities?: number;
}

interface StatItem {
  label: string;
  value: number;
  formatter: (v: number) => string;
  highlight?: boolean;
}

export function AnimatedStatBar({ stats, totalOpportunities }: AnimatedStatBarProps) {
  const items: StatItem[] = [
    { label: 'Projects Scanned', value: stats.totalProjects, formatter: formatNumber },
    { label: 'Ecosystem TVL', value: stats.totalTVL, formatter: formatCurrency },
    { label: 'Voids Detected', value: totalOpportunities || 0, formatter: formatNumber, highlight: true },
  ];

  return (
    <motion.div
      className="flex items-center justify-center gap-6 sm:gap-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.8 }}
    >
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-6 sm:gap-10">
          {i > 0 && (
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-near-green/30 to-transparent" />
          )}
          <div className="text-center">
            <div className={`text-lg sm:text-xl font-bold font-mono ${item.highlight ? 'text-near-green' : 'text-text-primary'}`}>
              <AnimatedCounter
                value={item.value}
                formatter={item.formatter}
                duration={2500}
              />
            </div>
            <p className="text-[10px] sm:text-xs text-text-muted uppercase tracking-widest font-mono mt-0.5">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
