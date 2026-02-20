'use client';

import { motion } from 'framer-motion';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';
import { GradientText } from '@/components/effects/GradientText';
import { GlitchText } from '@/components/effects/GlitchText';
import { TypewriterText } from '@/components/effects/TypewriterText';
import { VoidParticles } from '@/components/effects/VoidParticles';
import { GridPattern } from '@/components/effects/GridPattern';
import { AlienGrid } from '@/components/effects/AlienGrid';
import { ScanLine } from '@/components/effects/ScanLine';
import { SignalCorner } from '@/components/effects/SignalCorner';
import { AnimatedStatBar } from './AnimatedStatBar';
import { HeroCTA } from './HeroCTA';
import type { EcosystemStats } from '@/types';

interface HeroSectionProps {
  stats: EcosystemStats;
  totalOpportunities?: number;
}

// Double-wide sine wave path for seamless looping (translateX -50%)
const WAVE_PATH =
  'M0 30 C50 10, 100 50, 150 30 S250 10, 300 30 S400 50, 450 30 S550 10, 600 30 S700 50, 750 30 S850 10, 900 30 S1000 50, 1050 30 S1150 10, 1200 30 V60 H0 Z M1200 30 C1250 10, 1300 50, 1350 30 S1450 10, 1500 30 S1600 50, 1650 30 S1750 10, 1800 30 S1900 50, 1950 30 S2050 10, 2100 30 S2200 50, 2250 30 S2350 10, 2400 30 V60 H1200 Z';

export function HeroSection({ stats, totalOpportunities }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24">
      {/* ── Layer 0: Deep space background ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(0,10,5,1) 0%, #000 100%)',
        }}
      />

      {/* ── Layer 1: AlienGrid hex coordinate overlay (fixed, full viewport) ── */}
      <AlienGrid />

      {/* ── Layer 2: Sweeping scan line ── */}
      <ScanLine />

      {/* ── Layer 3: Grid pattern (reduced to 10% opacity) ── */}
      <GridPattern className="opacity-10" />

      {/* ── Layer 4: Neural particle network ── */}
      <VoidParticles />

      {/* ── Layer 5: Signal waveform at bottom of hero ── */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none hidden md:block"
        style={{ height: '60px', zIndex: 3 }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 2400 60"
          preserveAspectRatio="none"
          style={{
            width: '200%',
            height: '100%',
            animation: 'signal-wave 12s linear infinite',
            willChange: 'transform',
          }}
        >
          <path d={WAVE_PATH} fill="rgba(0,236,151,0.06)" />
        </svg>
      </div>

      {/* ── Signal corners ── */}
      <SignalCorner position="top-left" />
      <SignalCorner position="bottom-right" />

      {/* ── Layer 6: Content ── */}
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

          {/* Intercepted signal status line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-mono text-xs tracking-[0.3em] uppercase"
            style={{ color: 'rgba(0,236,151,0.6)' }}
            aria-label="Signal status"
          >
            SIGNAL ACQUIRED · NEAR PROTOCOL · SECTOR 7G
          </motion.div>

          {/* Title — wrapped in GlitchText */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GradientText
              as="h1"
              animated
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
            >
              <GlitchText intensity="subtle">VOIDSPACE</GlitchText>
            </GradientText>
          </motion.div>

          {/* Permanent brand tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-text-secondary -mt-2"
          >
            See Everything.{' '}
            <span className="text-near-green">Build Anything.</span>
          </motion.p>

          {/* Typewriter — intercepted transmissions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <TypewriterText
              lines={[
                'ECOSYSTEM INTELLIGENCE ACTIVE. 124 GAPS IDENTIFIED.',
                'SIGNAL STRONG. BUILDER ONBOARDING LAYER: ONLINE.',
                'INITIATING FIRST CONTACT PROTOCOL...',
              ]}
              speed={35}
              className="max-w-lg mx-auto"
            />
          </motion.div>

          {/* Stats bar */}
          <AnimatedStatBar stats={stats} totalOpportunities={totalOpportunities} />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <HeroCTA />
          </motion.div>

          {/* Transmission origin */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="font-mono text-xs"
            style={{ color: 'rgba(0,236,151,0.30)' }}
            aria-hidden="true"
          >
            ▸ TRANSMISSION ORIGIN: voidspace.io · ESTABLISHED 2026
          </motion.div>
        </div>
      </div>

      {/* ── Layer 7: Vignette overlay — darkened void edges ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 80%, #000 120%)',
        }}
      />
    </section>
  );
}
