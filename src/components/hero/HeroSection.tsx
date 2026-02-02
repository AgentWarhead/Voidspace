'use client';

import { motion } from 'framer-motion';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';
import { GradientText } from '@/components/effects/GradientText';
import { TypewriterText } from '@/components/effects/TypewriterText';
import { VoidParticles } from '@/components/effects/VoidParticles';
import { GridPattern } from '@/components/effects/GridPattern';
import { AnimatedStatBar } from './AnimatedStatBar';
import { HeroCTA } from './HeroCTA';
import type { EcosystemStats } from '@/types';

interface HeroSectionProps {
  stats: EcosystemStats;
  totalOpportunities?: number;
}

export function HeroSection({ stats, totalOpportunities }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Layer 1: Void depth — radial gradient creating infinite depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,236,151,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Layer 2: Grid pattern fading into the void */}
      <GridPattern className="opacity-20" />

      {/* Layer 3: Neural particle network */}
      <VoidParticles />

      {/* Layer 4: Content with perspective depth */}
      <div className="relative z-10" style={{ perspective: '1200px' }}>
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Animated logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
            className="flex justify-center"
          >
            <VoidspaceLogo size="xl" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GradientText
              as="h1"
              animated
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              VOIDSPACE
            </GradientText>
          </motion.div>

          {/* Typewriter tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <TypewriterText
              lines={[
                'The NEAR ecosystem has gaps. Your next project fills one.',
                'Real data. AI analysis. Your mission brief in 60 seconds.',
                'Find where NEAR needs you most.',
              ]}
              speed={35}
              className="max-w-lg mx-auto"
            />
          </motion.div>

          {/* Stats bar — 3 credibility stats */}
          <AnimatedStatBar stats={stats} totalOpportunities={totalOpportunities} />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            <HeroCTA />
          </motion.div>
        </div>
      </div>

      {/* Layer 5: Vignette overlay — void edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)',
        }}
      />
    </section>
  );
}
