'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Brain, Gamepad2, Users, Wrench, Globe,
  ArrowRight, Sparkles, Zap, Target,
  ChevronRight, AlertCircle,
} from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ─── Types ────────────────────────────────────────────────── */

type Saturation = 'wide-open' | 'growing' | 'competitive';

interface Void {
  name: string;
  description: string;
}

interface Subcategory {
  name: string;
  projects: number;
  saturation: Saturation;
}

interface EcoCategory {
  name: string;
  icon: React.ElementType;
  description: string;
  slug: string;
  subcategories: Subcategory[];
  projects: number;
  opportunities: number;
  saturation: Saturation;
  voids: Void[];
  growth: string;
  color: 'green' | 'cyan' | 'purple';
}

/* ─── Data ─────────────────────────────────────────────────── */

const SATURATION_CONFIG: Record<Saturation, { emoji: string; label: string; color: string; bg: string; border: string; glow: string }> = {
  'wide-open': {
    emoji: '🟢',
    label: 'Wide Open',
    color: 'text-near-green',
    bg: 'bg-near-green/10',
    border: 'border-near-green/30',
    glow: 'rgba(0, 236, 151, 0.15)',
  },
  growing: {
    emoji: '🟡',
    label: 'Growing',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30',
    glow: 'rgba(250, 204, 21, 0.12)',
  },
  competitive: {
    emoji: '🔴',
    label: 'Competitive',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/30',
    glow: 'rgba(248, 113, 113, 0.1)',
  },
};

const CATEGORIES: EcoCategory[] = [
  {
    name: 'DeFi',
    icon: TrendingUp,
    description: 'DEXes, lending protocols, yield strategies, and derivatives powering NEAR\'s financial layer.',
    slug: 'defi',
    projects: 34,
    opportunities: 18,
    saturation: 'growing',
    growth: 'Steady growth',
    color: 'cyan',
    subcategories: [
      { name: 'DEX & Aggregators', projects: 8, saturation: 'competitive' },
      { name: 'Lending & Borrowing', projects: 4, saturation: 'growing' },
      { name: 'Yield Strategies', projects: 3, saturation: 'wide-open' },
      { name: 'Derivatives & Options', projects: 2, saturation: 'wide-open' },
    ],
    voids: [
      { name: 'Options Protocol', description: 'No native options/derivatives market on NEAR — massive DeFi primitive gap' },
      { name: 'Yield Aggregator', description: 'Auto-compound across Ref, Burrow, Linear — no Yearn equivalent exists' },
      { name: 'Real-World Asset Bridge', description: 'Tokenize real-world assets on NEAR — zero RWA protocols currently' },
    ],
  },
  {
    name: 'NFT & Gaming',
    icon: Gamepad2,
    description: 'Marketplaces, on-chain games, metaverse projects, and creator economy infrastructure.',
    slug: 'nft-gaming',
    projects: 43,
    opportunities: 16,
    saturation: 'growing',
    growth: 'Growing fast',
    color: 'purple',
    subcategories: [
      { name: 'Marketplaces', projects: 5, saturation: 'competitive' },
      { name: 'Games', projects: 12, saturation: 'growing' },
      { name: 'Metaverse', projects: 3, saturation: 'wide-open' },
    ],
    voids: [
      { name: 'On-Chain Game Engine', description: 'Unity/Unreal SDK for NEAR — no native game development framework' },
      { name: 'Dynamic NFT Standard', description: 'NFTs that evolve based on on-chain events — unexplored on NEAR' },
      { name: 'Creator Royalty Aggregator', description: 'Cross-marketplace royalty enforcement and analytics tool' },
    ],
  },
  {
    name: 'Infrastructure',
    icon: Wrench,
    description: 'Oracles, bridges, indexers, RPCs, and the critical plumbing that powers everything.',
    slug: 'infrastructure',
    projects: 28,
    opportunities: 22,
    saturation: 'wide-open',
    growth: 'High demand',
    color: 'green',
    subcategories: [
      { name: 'Oracles', projects: 2, saturation: 'wide-open' },
      { name: 'Bridges & Interop', projects: 5, saturation: 'growing' },
      { name: 'Indexers & Data', projects: 6, saturation: 'growing' },
    ],
    voids: [
      { name: 'Native Oracle Network', description: 'NEAR lacks a Chainlink-equivalent — huge infrastructure void' },
      { name: 'Cross-Chain Intent Solver', description: 'Build solvers for NEAR\'s new intent-based architecture' },
      { name: 'Real-Time Event Streaming', description: 'WebSocket-based chain event service — no hosted solution exists' },
    ],
  },
  {
    name: 'Social & Identity',
    icon: Users,
    description: 'Decentralized social platforms, DAO tooling, identity verification, and community infrastructure.',
    slug: 'social-identity',
    projects: 27,
    opportunities: 19,
    saturation: 'wide-open',
    growth: 'Emerging',
    color: 'green',
    subcategories: [
      { name: 'Social Platforms', projects: 4, saturation: 'wide-open' },
      { name: 'DAOs & Governance', projects: 8, saturation: 'growing' },
      { name: 'Identity & Reputation', projects: 3, saturation: 'wide-open' },
    ],
    voids: [
      { name: 'Reputation Protocol', description: 'On-chain reputation system for builders — no standard exists on NEAR' },
      { name: 'DAO Treasury Analytics', description: 'Dashboard for DAO treasuries, spending, and governance metrics' },
      { name: 'Decentralized LinkedIn', description: 'Professional social network with verifiable on-chain credentials' },
    ],
  },
  {
    name: 'AI & Automation',
    icon: Brain,
    description: 'Shade Agents, inference markets, AI-powered dApps, autonomous on-chain agents. The hottest sector.',
    slug: 'ai-automation',
    projects: 21,
    opportunities: 27,
    saturation: 'wide-open',
    growth: 'Hottest sector',
    color: 'green',
    subcategories: [
      { name: 'Agents & Autonomy', projects: 8, saturation: 'wide-open' },
      { name: 'Analytics & Insights', projects: 5, saturation: 'wide-open' },
      { name: 'Bots & Automation', projects: 4, saturation: 'wide-open' },
    ],
    voids: [
      { name: 'Agent-to-Agent Marketplace', description: 'Agents hiring other agents for tasks — no coordination layer exists' },
      { name: 'AI Audit Tool', description: 'Automated smart contract auditing using AI — zero NEAR-native solutions' },
      { name: 'Inference Marketplace', description: 'Decentralized AI inference with TEE verification — wide open' },
    ],
  },
  {
    name: 'Developer Tools',
    icon: Globe,
    description: 'SDKs, testing frameworks, monitoring dashboards, and developer experience tooling.',
    slug: 'dev-tools',
    projects: 15,
    opportunities: 12,
    saturation: 'growing',
    growth: 'Key need',
    color: 'cyan',
    subcategories: [
      { name: 'SDKs & Libraries', projects: 4, saturation: 'growing' },
      { name: 'Testing & CI/CD', projects: 3, saturation: 'wide-open' },
      { name: 'Monitoring & Analytics', projects: 2, saturation: 'wide-open' },
    ],
    voids: [
      { name: 'Contract Monitoring SaaS', description: 'Datadog for smart contracts — alerts, logs, and performance metrics' },
      { name: 'Visual Contract Builder', description: 'No-code/low-code smart contract creation tool for NEAR' },
      { name: 'Gas Profiler', description: 'Detailed gas usage analysis and optimization suggestions for contracts' },
    ],
  },
];

const colorMap = {
  green: {
    text: 'text-near-green',
    bg: 'bg-near-green/10',
    border: 'border-near-green/30',
    borderHover: 'rgba(0, 236, 151, 0.5)',
    glow: 'rgba(0, 236, 151, 0.12)',
    dot: 'bg-near-green',
    bar: 'from-near-green to-near-green/60',
    ring: 'ring-near-green/40',
  },
  cyan: {
    text: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/30',
    borderHover: 'rgba(0, 212, 255, 0.5)',
    glow: 'rgba(0, 212, 255, 0.12)',
    dot: 'bg-accent-cyan',
    bar: 'from-accent-cyan to-accent-cyan/60',
    ring: 'ring-accent-cyan/40',
  },
  purple: {
    text: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30',
    borderHover: 'rgba(192, 132, 252, 0.5)',
    glow: 'rgba(192, 132, 252, 0.12)',
    dot: 'bg-purple-400',
    bar: 'from-purple-400 to-purple-400/60',
    ring: 'ring-purple-400/40',
  },
};

/* ─── Constellation Background ─────────────────────────────── */

interface ConstellationNode {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  pulse: boolean;
}

function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<ConstellationNode[]>([]);
  const animRef = useRef<number>(0);

  const initNodes = useCallback(() => {
    const nodes: ConstellationNode[] = [];
    const colors = ['rgba(0,236,151,', 'rgba(0,212,255,', 'rgba(192,132,252,'];
    for (let i = 0; i < 60; i++) {
      nodes.push({
        id: i,
        x: Math.random(),
        y: Math.random(),
        size: 1 + Math.random() * 2.5,
        color: colors[i % 3],
        pulse: i % 5 === 0,
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    initNodes();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    const draw = () => {
      frame++;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * w;
          const dy = (nodes[i].y - nodes[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(0, 236, 151, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulseScale = node.pulse ? 1 + Math.sin(frame * 0.03) * 0.3 : 1;
        const alpha = node.pulse ? 0.5 + Math.sin(frame * 0.03) * 0.3 : 0.4;
        const size = node.size * pulseScale;

        ctx.beginPath();
        ctx.arc(node.x * w, node.y * h, size, 0, Math.PI * 2);
        ctx.fillStyle = node.color + `${alpha})`;
        ctx.fill();

        // Glow
        if (node.pulse) {
          ctx.beginPath();
          ctx.arc(node.x * w, node.y * h, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = node.color + '0.06)';
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
}

/* ─── Category Card ────────────────────────────────────────── */

function CategoryCard({
  category,
  index,
  isActive,
  onSelect,
}: {
  category: EcoCategory;
  index: number;
  isActive: boolean;
  onSelect: (slug: string) => void;
}) {
  const Icon = category.icon;
  const colors = colorMap[category.color];
  const sat = SATURATION_CONFIG[category.saturation];
  const maxOpportunities = 27;

  return (
    <ScrollReveal delay={index * 0.05}>
      <motion.div
        className={cn(
          'relative rounded-xl overflow-hidden cursor-pointer group',
          'bg-surface/60 backdrop-blur-xl border shadow-[0_4px_20px_rgba(0,0,0,0.2)]',
          colors.border,
          isActive && 'ring-2 ring-offset-0',
          isActive && colors.ring,
        )}
        whileHover={{
          borderColor: colors.borderHover,
          y: -4,
          scale: 1.02,
        }}
        transition={{ duration: 0.25 }}
        onClick={() => onSelect(isActive ? '' : category.slug)}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(300px at 50% 50%, ${colors.glow}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 p-5">
          {/* Top row: Icon + Saturation */}
          <div className="flex items-center justify-between mb-3">
            <div className={cn('p-2.5 rounded-lg border', colors.bg, colors.border)}>
              <Icon className={cn('w-5 h-5', colors.text)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-text-muted">{category.growth}</span>
              <span className={cn(
                'text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border',
                sat.color, sat.bg, sat.border,
              )}>
                {sat.emoji} {sat.label}
              </span>
            </div>
          </div>

          {/* Name + Description */}
          <h3 className="text-base font-bold text-text-primary mb-1">{category.name}</h3>
          <p className="text-xs text-text-muted leading-relaxed mb-3 line-clamp-2">{category.description}</p>

          {/* Stats: Projects vs Opportunities */}
          <div className="flex items-center gap-4 text-xs mb-3">
            <div>
              <span className="text-text-muted font-mono">Projects</span>
              <span className={cn('ml-1.5 font-bold font-mono', colors.text)}>{category.projects}</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div>
              <span className="text-text-muted font-mono">Voids</span>
              <span className="ml-1.5 font-bold font-mono text-near-green">{category.opportunities}</span>
            </div>
          </div>

          {/* Opportunity bar */}
          <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden mb-3">
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r', colors.bar)}
              initial={{ width: 0 }}
              whileInView={{ width: `${(category.opportunities / maxOpportunities) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
            />
          </div>

          {/* Top Voids Preview */}
          <div className="space-y-1.5">
            {category.voids.slice(0, 2).map((v) => (
              <div key={v.name} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <Target className="w-3 h-3 text-near-green/60 shrink-0" />
                <span className="truncate">{v.name}</span>
              </div>
            ))}
          </div>

          {/* Expand indicator */}
          <div className="flex items-center justify-center mt-3 pt-3 border-t border-border/30">
            <motion.span
              className="text-[10px] font-mono text-text-muted flex items-center gap-1"
              animate={{ opacity: isActive ? 0.5 : 1 }}
            >
              {isActive ? 'Click to collapse' : 'Click to explore voids'}
              <motion.span animate={{ rotate: isActive ? 90 : 0 }}>
                <ChevronRight className="w-3 h-3" />
              </motion.span>
            </motion.span>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

/* ─── Expanded Detail Panel ────────────────────────────────── */

function CategoryDetail({ category }: { category: EcoCategory }) {
  const Icon = category.icon;
  const colors = colorMap[category.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 15, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <Card variant="glass" padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-near-green/40 to-transparent" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Subcategories */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('p-3 rounded-xl border', colors.bg, colors.border)}>
                <Icon className={cn('w-6 h-6', colors.text)} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">{category.name}</h3>
                <p className="text-xs text-text-muted">{category.projects} projects · {category.opportunities} open voids</p>
              </div>
            </div>

            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted mb-3">
              Subcategories
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {category.subcategories.map((sub, i) => {
                const subSat = SATURATION_CONFIG[sub.saturation];
                return (
                  <motion.div
                    key={sub.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/30"
                  >
                    <div>
                      <span className="text-sm font-medium text-text-primary">{sub.name}</span>
                      <span className="text-xs text-text-muted ml-2">{sub.projects} projects</span>
                    </div>
                    <span className={cn(
                      'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                      subSat.color, subSat.bg, subSat.border,
                    )}>
                      {subSat.emoji} {subSat.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Specific Voids */}
          <div className="lg:w-96 flex-shrink-0">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-near-green mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              Open Voids — Ready to Build
            </h4>
            <div className="space-y-3">
              {category.voids.map((v, i) => (
                <motion.div
                  key={v.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-3 rounded-lg bg-near-green/5 border border-near-green/10 hover:border-near-green/30 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <Target className="w-4 h-4 text-near-green mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-text-primary block">{v.name}</span>
                      <p className="text-[11px] text-text-muted leading-relaxed mt-0.5">{v.description}</p>
                      <Link
                        href={`/opportunities?search=${encodeURIComponent(v.name)}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-near-green hover:text-near-green/80 transition-colors mt-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Get Void Brief
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href={`/opportunities?category=${category.slug}`}>
              <Button variant="primary" size="sm" className="w-full mt-4 group">
                View All {category.opportunities} Voids
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function EcosystemMap() {
  const [activeSlug, setActiveSlug] = useState<string>('');
  const activeCategory = CATEGORIES.find(c => c.slug === activeSlug);

  const totalProjects = useMemo(() => CATEGORIES.reduce((s, c) => s + c.projects, 0), []);
  const totalOpportunities = useMemo(() => CATEGORIES.reduce((s, c) => s + c.opportunities, 0), []);

  return (
    <section id="ecosystem-map" className="py-16 space-y-8 relative">
      {/* Constellation background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <ConstellationBg />
      </div>

      <SectionHeader title="NEAR Ecosystem Map" badge="FIND YOUR VOID" count={CATEGORIES.length} />

      <ScrollReveal>
        <div className="max-w-3xl space-y-3">
          <GradientText as="p" animated className="text-xl md:text-2xl font-bold mt-2">
            {CATEGORIES.length} Sectors. {totalOpportunities}+ Open Voids. Your Opportunity Is NOW.
          </GradientText>
          <p className="text-text-secondary text-base leading-relaxed">
            The NEAR ecosystem is growing fast but there are{' '}
            <span className="text-near-green font-semibold">more voids than builders</span>.
            Every category below has real, unfilled gaps waiting for someone to step in.
            Click any sector to explore subcategories and specific voids.
          </p>
        </div>
      </ScrollReveal>

      {/* Summary Stats */}
      <ScrollReveal delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Projects', value: totalProjects, color: 'text-accent-cyan', icon: Globe },
            { label: 'Open Voids', value: totalOpportunities, color: 'text-near-green', icon: Target },
            { label: 'Wide Open Sectors', value: CATEGORIES.filter(c => c.saturation === 'wide-open').length, color: 'text-near-green', icon: Sparkles },
            { label: 'Categories', value: CATEGORIES.length, color: 'text-purple-400', icon: Users },
          ].map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div key={stat.label} className="text-center py-3 rounded-lg bg-surface/60 border border-border/50 backdrop-blur-sm">
                <StatIcon className={cn('w-4 h-4 mx-auto mb-1', stat.color)} />
                <div className={cn('text-xl font-bold font-mono', stat.color)}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Saturation Legend */}
      <ScrollReveal delay={0.08}>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {(Object.entries(SATURATION_CONFIG) as [Saturation, typeof SATURATION_CONFIG[Saturation]][]).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs">
              <span>{config.emoji}</span>
              <span className={cn('font-mono', config.color)}>{config.label}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category, i) => {
          const isConnected = activeSlug === '' || activeSlug === category.slug;
          const dimmed = activeSlug !== '' && !isConnected;

          return (
            <motion.div
              key={category.slug}
              animate={{ opacity: dimmed ? 0.35 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <CategoryCard
                category={category}
                index={i}
                isActive={activeSlug === category.slug}
                onSelect={setActiveSlug}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Detail Panel */}
      <AnimatePresence mode="wait">
        {activeCategory && (
          <CategoryDetail key={activeCategory.slug} category={activeCategory} />
        )}
      </AnimatePresence>

      {/* Bottom Message */}
      <ScrollReveal delay={0.3}>
        <GlowCard padding="lg" className="text-center">
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="w-6 h-6 text-near-green" />
            </motion.div>
            <GradientText as="p" animated className="text-lg font-bold">
              There Are More Voids Than Builders
            </GradientText>
            <p className="text-sm text-text-secondary max-w-lg">
              {totalOpportunities}+ unfilled gaps across {CATEGORIES.length} sectors.
              The opportunity is <span className="text-near-green font-semibold">NOW</span>.
              Not sure where to start? Let the{' '}
              <Link href="/sanctum" className="text-near-green font-semibold hover:underline">Sanctum AI</Link>{' '}
              match you to your perfect void.
            </p>
          </div>
        </GlowCard>
      </ScrollReveal>
    </section>
  );
}
