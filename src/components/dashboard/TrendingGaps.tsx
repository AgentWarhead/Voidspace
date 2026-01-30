'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import { HotTag } from '@/components/effects/HotTag';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import type { Opportunity } from '@/types';

interface TrendingGapsProps {
  opportunities: Opportunity[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20, scale: 0.97 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export function TrendingGaps({ opportunities }: TrendingGapsProps) {
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        No opportunities found. Run a data sync to generate opportunities.
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
    >
      {opportunities.map((opp, index) => (
        <motion.div key={opp.id} variants={item}>
          <Link href={`/opportunities/${opp.id}`}>
            <GlowCard padding="md">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-near-green/10 text-near-green font-bold text-sm font-mono shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-text-primary truncate">{opp.title}</h3>
                    {opp.gap_score >= 85 && <HotTag />}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {opp.category && (
                      <Badge variant="default" className="text-xs" pulse={opp.gap_score >= 80}>
                        {opp.category.name}
                      </Badge>
                    )}
                    <Badge variant="difficulty" difficulty={opp.difficulty}>
                      {opp.difficulty}
                    </Badge>
                    <Badge variant="competition" competition={opp.competition_level}>
                      {opp.competition_level}
                    </Badge>
                  </div>
                </div>

                {opp.demand_score != null && opp.demand_score > 0 && (
                  <span className="text-[11px] text-text-muted font-mono shrink-0 hidden sm:block">
                    Signal: {Math.round(opp.demand_score)}
                  </span>
                )}

                <div className="w-24 shrink-0">
                  <GapScoreIndicator score={opp.gap_score} size="sm" />
                </div>

                <TrendingUp className="w-4 h-4 text-near-green shrink-0" />
              </div>
            </GlowCard>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
