'use client';

import { motion } from 'framer-motion';
// @ts-ignore
import { Compass, Hammer, Shield, Crown, Star, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ─── Track Data ───────────────────────────────────────────── */

const TRACKS = [
  { name: 'Explorer', icon: Compass, modules: 16, color: 'emerald', label: 'Discover NEAR' },
  { name: 'Builder', icon: Hammer, modules: 20, color: 'cyan', label: 'Write Rust' },
  { name: 'Hacker', icon: Shield, modules: 14, color: 'violet', label: 'Break & Secure' },
  { name: 'Founder', icon: Crown, modules: 16, color: 'amber', label: 'Ship & Scale' },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; bar: string }> = {
  emerald: {
    bg: 'from-emerald-500/15 to-emerald-600/10',
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
  },
  cyan: {
    bg: 'from-cyan-500/15 to-cyan-600/10',
    border: 'border-cyan-500/25',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/20',
    bar: 'bg-gradient-to-r from-cyan-500 to-cyan-400',
  },
  violet: {
    bg: 'from-violet-500/15 to-violet-600/10',
    border: 'border-violet-500/25',
    text: 'text-violet-400',
    glow: 'shadow-violet-500/20',
    bar: 'bg-gradient-to-r from-violet-500 to-violet-400',
  },
  amber: {
    bg: 'from-amber-500/15 to-amber-600/10',
    border: 'border-amber-500/25',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
  },
};

/* ─── Constellation SVG ────────────────────────────────────── */

function ConstellationPreview() {
  // Node positions for the constellation
  const nodes = [
    { x: 60, y: 40, size: 4, color: '#34d399', delay: 0 },
    { x: 140, y: 30, size: 3, color: '#22d3ee', delay: 0.3 },
    { x: 100, y: 80, size: 5, color: '#34d399', delay: 0.6 },
    { x: 200, y: 60, size: 3, color: '#8b5cf6', delay: 0.9 },
    { x: 180, y: 110, size: 4, color: '#22d3ee', delay: 1.2 },
    { x: 260, y: 40, size: 3, color: '#f59e0b', delay: 0.4 },
    { x: 240, y: 90, size: 4, color: '#8b5cf6', delay: 0.7 },
    { x: 320, y: 70, size: 5, color: '#f59e0b', delay: 1.0 },
    { x: 300, y: 120, size: 3, color: '#34d399', delay: 0.2 },
    { x: 160, y: 140, size: 3, color: '#22d3ee', delay: 0.8 },
    { x: 80, y: 120, size: 3, color: '#34d399', delay: 1.1 },
    { x: 350, y: 110, size: 3, color: '#f59e0b', delay: 0.5 },
  ];

  // Connections between nodes (indices)
  const edges = [
    [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4],
    [3, 5], [4, 6], [5, 6], [5, 7], [6, 7], [6, 8],
    [7, 8], [4, 9], [2, 10], [7, 11], [8, 11],
  ];

  return (
    <div className="relative w-full h-[160px] overflow-hidden rounded-xl">
      <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Edges */}
        {edges.map(([a, b], i) => (
          <motion.line
            key={`edge-${i}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="rgba(34,211,238,0.15)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: i * 0.05 }}
          />
        ))}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill={node.color}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: node.delay }}
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </motion.circle>
        ))}
      </svg>
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function ProgressTracker() {
  return (
    <ScrollReveal>
      <div id="progress-tracker">
        <SectionHeader title="Track Your Progress" badge="SKILL MAP" />

        <div className="text-center mb-8">
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Your skills <GradientText className="font-bold">light up the void</GradientText>.
            Watch your constellation grow as you master each module.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8">
          {[
            { value: '66', label: 'Modules' },
            { value: '4', label: 'Tracks' },
            { value: '1', label: 'Constellation' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold">
                <GradientText>{stat.value}</GradientText>
              </div>
              <div className="text-xs text-text-muted uppercase tracking-wider mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <GlowCard padding="none" className="overflow-hidden">
          {/* Constellation Preview */}
          <div className="p-6 pb-2">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Skill Constellation Preview</span>
            </div>
            <ConstellationPreview />
          </div>

          {/* Track Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-4 sm:p-6 pt-4">
            {TRACKS.map((track, i) => {
              const colors = colorMap[track.color];
              return (
                <motion.div
                  key={track.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'rounded-xl p-3 sm:p-4 bg-gradient-to-br border backdrop-blur-sm',
                    colors.bg,
                    colors.border
                  )}
                >
                  <track.icon className={cn('w-5 h-5 mb-2', colors.text)} />
                  <h4 className="font-semibold text-text-primary text-sm">{track.name}</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">{track.label}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-text-muted mb-1">
                      <span>{track.modules} modules</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={cn('h-full rounded-full', colors.bar)}
                        initial={{ width: '0%' }}
                        whileInView={{ width: '0%' }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-text-muted">Complete modules to light up your constellation</span>
            </div>
            <Link href="/profile/skills">
              <Button variant="primary" size="sm" className="group">
                View Skill Map
                <Star className="w-3 h-3 ml-1.5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </GlowCard>
      </div>
    </ScrollReveal>
  );
}
