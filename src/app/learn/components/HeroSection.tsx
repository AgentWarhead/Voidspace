'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GradientText } from '@/components/effects/GradientText';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { GridPattern } from '@/components/effects/GridPattern';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui';
import { Rocket, ChevronRight, Sparkles } from 'lucide-react';

// ─── Constellation Background ─────────────────────────────────────────────────
// Animated skill-tree nodes connected by glowing lines, gently pulsing

interface ConstellationNode {
  id: number;
  x: number;
  y: number;
  size: number;
  label: string;
  delay: number;
}

interface ConstellationEdge {
  from: number;
  to: number;
}

const CONSTELLATION_NODES: ConstellationNode[] = [
  { id: 0, x: 12, y: 18, size: 6, label: 'Blockchain', delay: 0 },
  { id: 1, x: 28, y: 32, size: 8, label: 'NEAR', delay: 0.3 },
  { id: 2, x: 45, y: 14, size: 5, label: 'Rust', delay: 0.6 },
  { id: 3, x: 62, y: 28, size: 7, label: 'Contracts', delay: 0.9 },
  { id: 4, x: 78, y: 12, size: 5, label: 'dApps', delay: 1.2 },
  { id: 5, x: 88, y: 35, size: 6, label: 'Deploy', delay: 1.5 },
  { id: 6, x: 35, y: 55, size: 4, label: 'Wallet', delay: 0.4 },
  { id: 7, x: 55, y: 50, size: 5, label: 'Testing', delay: 0.8 },
  { id: 8, x: 72, y: 55, size: 4, label: 'Security', delay: 1.1 },
  { id: 9, x: 20, y: 65, size: 3, label: 'Tokens', delay: 0.5 },
  { id: 10, x: 50, y: 72, size: 3, label: 'AI Agent', delay: 1.0 },
  { id: 11, x: 85, y: 68, size: 4, label: 'Grants', delay: 1.4 },
];

const CONSTELLATION_EDGES: ConstellationEdge[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 1, to: 6 },
  { from: 3, to: 7 },
  { from: 7, to: 8 },
  { from: 8, to: 5 },
  { from: 6, to: 9 },
  { from: 7, to: 10 },
  { from: 5, to: 11 },
  { from: 9, to: 10 },
  { from: 10, to: 11 },
];

function ConstellationBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 80"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00EC97" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00EC97" stopOpacity="0" />
          </radialGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges — glowing lines between nodes */}
        {CONSTELLATION_EDGES.map((edge, i) => {
          const from = CONSTELLATION_NODES[edge.from];
          const to = CONSTELLATION_NODES[edge.to];
          return (
            <motion.line
              key={`edge-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#00EC97"
              strokeWidth="0.15"
              strokeOpacity="0.25"
              filter="url(#glowFilter)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.5, delay: Math.min(from.delay, to.delay) + 0.5 },
                opacity: { duration: 0.5, delay: Math.min(from.delay, to.delay) + 0.3 },
              }}
            />
          );
        })}

        {/* Nodes — pulsing circles */}
        {CONSTELLATION_NODES.map((node) => (
          <g key={`node-${node.id}`}>
            {/* Outer pulse ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size * 0.6}
              fill="none"
              stroke="#00EC97"
              strokeWidth="0.08"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.5, 1.5, 2],
              }}
              transition={{
                duration: 4,
                delay: node.delay + 1,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
            {/* Core node */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size * 0.2}
              fill="#00EC97"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1, 0.8] }}
              transition={{
                duration: 3 + seeded(node.id * 3) * 2,
                delay: node.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              filter="url(#glowFilter)"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Deterministic seed for SSR-safe random ───────────────────────────────────
function seeded(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Floating Space Dust Particles ─────────────────────────────────────────────

function SpaceDust() {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: seeded(i * 7 + 1) * 100,
        y: seeded(i * 7 + 2) * 100,
        size: seeded(i * 7 + 3) * 2 + 0.5,
        duration: seeded(i * 7 + 4) * 20 + 15,
        delay: seeded(i * 7 + 5) * 8,
        drift: (seeded(i * 7 + 6) - 0.5) * 40,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              p.id % 3 === 0
                ? 'rgba(0, 236, 151, 0.5)'
                : p.id % 3 === 1
                  ? 'rgba(0, 212, 255, 0.4)'
                  : 'rgba(255, 255, 255, 0.3)',
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, p.drift, 0],
            opacity: [0.1, 0.7, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Builder Counter ──────────────────────────────────────────────────

// BuilderCounter removed — was displaying fabricated user count (2,847)

// ─── Stats Bar ─────────────────────────────────────────────────────────────────

interface StatItemProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  delay: number;
}

function StatItem({ value, prefix, suffix, label, delay }: StatItemProps) {
  return (
    <motion.div
      className="text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="text-3xl md:text-4xl font-bold text-near-green mb-1">
        {prefix}
        <AnimatedCounter value={value} duration={2500} />
        {suffix}
      </div>
      <div className="text-sm text-text-muted">{label}</div>
    </motion.div>
  );
}

// ─── Main Hero Section ─────────────────────────────────────────────────────────

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], ['0%', '15%']);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, type: 'spring' as const, bounce: 0.3 },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center py-24 md:py-32 overflow-hidden"
    >
      {/* ── Parallax Background Layer ── */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {/* Radial gradient wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0, 236, 151, 0.15), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(0, 212, 255, 0.08), transparent 60%)',
          }}
        />
        <ConstellationBackground />
        <SpaceDust />
        <GridPattern className="absolute inset-0 opacity-[0.08]" />
      </motion.div>

      {/* ── Content ── */}
      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="relative z-10 w-full">
        <Container size="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-near-green/30 bg-near-green/5 backdrop-blur-sm">
                <motion.div
                  className="w-2 h-2 rounded-full bg-near-green"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-near-green font-medium">
                  Free &middot; Self-paced &middot; AI-powered
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants}>
              <GradientText
                as="h1"
                animated
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]"
              >
                From Zero to
                <br />
                NEAR Builder
              </GradientText>
            </motion.div>

            {/* Subtext with live counter */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-3xl mb-10 leading-relaxed"
            >
              Join builders learning to ship real dApps on NEAR Protocol.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Rocket className="w-5 h-5" />}
                className="text-base px-8 py-4 shadow-[0_0_30px_rgba(0,236,151,0.3)]"
                onClick={() =>
                  document
                    .getElementById('tracks')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Start Learning
              </Button>
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ChevronRight className="w-5 h-5" />}
                className="text-base px-8 py-4"
                onClick={() =>
                  document
                    .getElementById('tracks')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Jump to Builder Track
              </Button>
            </motion.div>

            {/* ── Stats Bar ── */}
            <motion.div variants={itemVariants} className="w-full max-w-4xl">
              <div className="relative">
                {/* Animated outer glow */}
                <motion.div
                  className="absolute -inset-[1px] bg-gradient-to-r from-near-green/50 via-accent-cyan/40 to-purple-500/50 rounded-2xl blur-sm"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Glass card */}
                <div className="relative bg-surface/70 backdrop-blur-xl border border-white/[0.06] rounded-2xl px-6 py-8 shadow-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:divide-x sm:divide-border">
                    <StatItem
                      value={78}
                      suffix="+"
                      label="Voids Detected"
                      delay={0.8}
                    />
                    <StatItem
                      value={71}
                      label="Learning Modules"
                      delay={1.0}
                    />
                    <StatItem
                      value={20}
                      suffix="+"
                      label="Categories Analyzed"
                      delay={1.2}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.div
                className="flex flex-col items-center gap-2 text-text-muted"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-4 h-4 text-near-green/60" />
                <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
                <div className="w-px h-8 bg-gradient-to-b from-near-green/40 to-transparent" />
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}
