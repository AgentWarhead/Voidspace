'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge, Progress } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import { HotTag } from '@/components/effects/HotTag';
import { GradientText } from '@/components/effects/GradientText';
import type { CategoryWithStats } from '@/types';

interface PriorityVoidsProps {
  categories: CategoryWithStats[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export function PriorityVoids({ categories }: PriorityVoidsProps) {
  // Filter to strategic (NEAR Priority) categories and sort by gap score desc
  const priorityCategories = categories
    .filter((c) => c.is_strategic)
    .sort((a, b) => b.gapScore - a.gapScore)
    .slice(0, 5);

  if (priorityCategories.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
          Where NEAR Needs Builders Most
        </GradientText>
        <p className="text-text-secondary mt-2 max-w-md mx-auto text-sm">
          Strategic priority areas aligned with NEAR Protocol&apos;s 2026 roadmap. These voids have boosted scores.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {priorityCategories.map((cat) => (
          <motion.div key={cat.id} variants={item}>
            <Link href={`/categories/${cat.slug}`}>
              <GlowCard className="h-full" padding="md">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <h3 className="font-semibold text-text-primary">{cat.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HotTag />
                      <Badge variant="default" className="bg-near-green/10 text-near-green text-xs">
                        NEAR Priority
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-text-muted line-clamp-2">{cat.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-mono">
                        {cat.activeProjectCount} active projects
                      </span>
                      <span
                        className="font-mono font-bold"
                        style={{
                          color: cat.gapScore >= 67 ? '#00EC97' : cat.gapScore >= 34 ? '#FFA502' : '#FF4757',
                        }}
                      >
                        Void: {cat.gapScore}
                      </span>
                    </div>
                    <Progress value={cat.gapScore} size="sm" />
                  </div>
                </div>
              </GlowCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
