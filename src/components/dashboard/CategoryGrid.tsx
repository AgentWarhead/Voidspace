'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge, Progress } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import type { CategoryWithStats } from '@/types';

interface CategoryGridProps {
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {categories.map((cat) => (
        <motion.div key={cat.id} variants={item}>
          <Link href={`/categories/${cat.slug}`}>
            <GlowCard className="h-full" padding="md">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <h3 className="font-semibold text-text-primary">{cat.name}</h3>
                  </div>
                  {cat.is_strategic && (
                    <Badge variant="default" className="bg-near-green/10 text-near-green text-xs">
                      2x
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-text-muted line-clamp-2">
                  {cat.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">{cat.projectCount} projects</span>
                    <span className="font-medium" style={{
                      color: cat.gapScore >= 67 ? '#00EC97' : cat.gapScore >= 34 ? '#FFA502' : '#FF4757',
                    }}>
                      Gap: {cat.gapScore}
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
  );
}
