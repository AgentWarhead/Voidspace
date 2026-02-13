'use client';

import { motion } from 'framer-motion';
import { Scan, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';
import { GradientText } from '@/components/effects/GradientText';

const steps = [
  {
    icon: Scan,
    title: 'SCAN',
    description: '10+ data sources. Hundreds of projects. Real-time analysis.',
    detail: 'NearBlocks, Pikespeak, FastNEAR, DexScreener, DefiLlama, Mintbase, GitHub, AstroDAO, NEAR RPC, Ecosystem Registry',
  },
  {
    icon: Target,
    title: 'DETECT',
    description: 'Our algorithm surfaces underserved voids across the NEAR ecosystem.',
    detail: 'Void Score algorithm weighs capital demand, competition, and NEAR priorities',
  },
  {
    icon: Sparkles,
    title: 'BUILD',
    description: 'AI generates your complete Void Brief — problem, tech stack, features, timeline.',
    detail: 'Powered by Claude AI with full ecosystem context',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function VoidDetectionShowcase() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
          From Void to Vision in 60 Seconds
        </GradientText>
        <p className="text-text-secondary mt-2 max-w-md mx-auto text-sm">
          Voidspace scans the entire NEAR ecosystem, detects underserved areas, and uses AI to generate your build plan.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div key={step.title} variants={item}>
              <Card variant="glass" padding="lg" className="relative overflow-hidden h-full">
                <ScanLine />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-near-green/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-near-green" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-near-green/60 uppercase tracking-wider">
                        Step {i + 1}
                      </span>
                      <span className="text-sm font-bold text-text-primary tracking-wide">
                        {step.title}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                  <p className="text-[10px] text-text-muted font-mono">
                    {step.detail}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="text-center">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-near-green/10 border border-near-green/20 text-near-green hover:bg-near-green/20 rounded-lg transition-colors text-sm font-medium"
        >
          <Target className="w-4 h-4" />
          See Detected Voids
        </Link>
      </div>
    </div>
  );
}
