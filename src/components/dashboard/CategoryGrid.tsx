'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge, Progress, InfoTooltip } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import { TiltCard } from '@/components/effects/TiltCard';
import { HotTag } from '@/components/effects/HotTag';
import { HELP_CONTENT } from '@/lib/help-content';
import { formatCurrency } from '@/lib/utils';
import type { CategoryWithStats } from '@/types';

interface CategoryGridProps {
  categories: CategoryWithStats[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
    >
      {categories.map((cat) => (
        <motion.div key={cat.id} variants={item}>
          <Link href={`/categories/${cat.slug}`}>
            <TiltCard>
              <GlowCard className="h-full" padding="md">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <h3 className="font-semibold text-text-primary">{cat.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {cat.is_strategic && <HotTag />}
                      {cat.is_strategic && (
                        <Badge variant="default" className="bg-near-green/10 text-near-green text-xs">
                          2x
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-text-muted line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-mono">
                        {cat.activeProjectCount}/{cat.projectCount} active
                      </span>
                      <span className="font-mono font-medium flex items-center" style={{
                        color: cat.gapScore >= 67 ? '#00EC97' : cat.gapScore >= 34 ? '#FFA502' : '#FF4757',
                      }}>
                        Gap: {cat.gapScore}
                        <InfoTooltip term={HELP_CONTENT.gapScore.term}>
                          <p>{HELP_CONTENT.gapScore.description}</p>
                        </InfoTooltip>
                      </span>
                    </div>
                    {cat.totalTVL > 0 && (
                      <p className="text-[10px] text-text-muted font-mono">
                        TVL: {formatCurrency(cat.totalTVL)}
                      </p>
                    )}
                    <Progress value={cat.gapScore} size="sm" />
                  </div>
                </div>
              </GlowCard>
            </TiltCard>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
