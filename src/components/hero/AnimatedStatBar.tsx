'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { InfoTooltip } from '@/components/ui';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { HELP_CONTENT } from '@/lib/help-content';
import type { EcosystemStats } from '@/types';

interface AnimatedStatBarProps {
  stats: EcosystemStats;
  totalStars?: number;
}

interface StatItem {
  label: string;
  value: number;
  formatter: (v: number) => string;
  helpKey?: keyof typeof HELP_CONTENT;
}

export function AnimatedStatBar({ stats, totalStars }: AnimatedStatBarProps) {
  const items: StatItem[] = [
    { label: 'Projects', value: stats.totalProjects, formatter: formatNumber },
    { label: 'Total TVL', value: stats.totalTVL, formatter: formatCurrency, helpKey: 'tvl' },
    { label: 'Categories', value: stats.categoryCount, formatter: formatNumber },
    ...(totalStars ? [{ label: 'GitHub Stars', value: totalStars, formatter: formatNumber, helpKey: 'githubStars' as const }] : []),
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
            <div className="text-lg sm:text-xl font-bold text-text-primary">
              <AnimatedCounter
                value={item.value}
                formatter={item.formatter}
                duration={2500}
              />
            </div>
            <p className="text-[10px] sm:text-xs text-text-muted uppercase tracking-widest font-mono mt-0.5 flex items-center justify-center">
              {item.label}
              {item.helpKey && (
                <InfoTooltip term={HELP_CONTENT[item.helpKey].term}>
                  <p>{HELP_CONTENT[item.helpKey].description}</p>
                </InfoTooltip>
              )}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
