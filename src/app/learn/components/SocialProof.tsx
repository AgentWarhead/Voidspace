'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  DollarSign,
  Rocket,
  Clock,
  Quote,
  ArrowRight,
  GraduationCap,
  Code2,
  BookOpen,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { GlowCard } from '@/components/effects/GlowCard';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';

// ─── Builder Spotlight Data ────────────────────────────────────────────────────

interface BuilderStory {
  name: string;
  avatar: string; // emoji avatar
  beforeRole: string;
  afterRole: string;
  project: string;
  timeToShip: string;
  outcome: string;
  quote: string;
  icon: React.ElementType;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

const BUILDER_STORIES: BuilderStory[] = [
  {
    name: 'Sarah Chen',
    avatar: '👩‍🏫',
    beforeRole: 'High School Teacher',
    afterRole: 'DeFi Developer',
    project: 'NearYield Dashboard',
    timeToShip: '6 weeks',
    outcome: 'Now earning 3x her teaching salary building DeFi tools',
    quote:
      'I had zero coding experience. The Explorer track gave me confidence, and the Sanctum AI held my hand through Rust. Six weeks later I had a live DeFi dashboard.',
    icon: GraduationCap,
    accentColor: 'text-near-green',
    accentBg: 'bg-near-green/10',
    accentBorder: 'border-near-green/20',
  },
  {
    name: 'Marcus Johnson',
    avatar: '👨‍💻',
    beforeRole: 'Self-taught Dev',
    afterRole: 'Grant Recipient & Founder',
    project: 'MintForge NFT Marketplace',
    timeToShip: '4 weeks',
    outcome: 'Won $25K NEAR Foundation grant',
    quote:
      'I knew JavaScript but blockchain seemed impossible. The Builder track broke Rust into digestible pieces. My NFT marketplace won a $25K grant on the first application.',
    icon: Code2,
    accentColor: 'text-accent-cyan',
    accentBg: 'bg-accent-cyan/10',
    accentBorder: 'border-accent-cyan/20',
  },
  {
    name: 'Aisha Okafor',
    avatar: '👩‍🎓',
    beforeRole: 'College Student',
    afterRole: 'DAO Tooling Engineer',
    project: 'GovStack DAO Framework',
    timeToShip: '8 weeks',
    outcome: 'Tool used by 500+ organizations worldwide',
    quote:
      'I started as a sophomore with basic Python knowledge. Now my DAO governance tool is used by over 500 organizations. NEAR\'s developer experience is genuinely the best in Web3.',
    icon: BookOpen,
    accentColor: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/20',
  },
];

// ─── Builder Spotlight Card ────────────────────────────────────────────────────

function BuilderCard({ story, index }: { story: BuilderStory; index: number }) {
  const Icon = story.icon;

  return (
    <ScrollReveal delay={index * 0.15}>
      <GlowCard padding="none" className="h-full">
        <div className="p-6 flex flex-col h-full">
          {/* Header: avatar + name + transformation */}
          <div className="flex items-start gap-4 mb-5">
            <div
              className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center text-2xl border',
                story.accentBg,
                story.accentBorder
              )}
            >
              {story.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-text-primary">{story.name}</h4>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-muted">{story.beforeRole}</span>
                <ArrowRight className={cn('w-3 h-3 flex-shrink-0', story.accentColor)} />
                <span className={cn('font-medium', story.accentColor)}>{story.afterRole}</span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="relative mb-5 flex-1">
            <Quote
              className={cn(
                'absolute -top-1 -left-1 w-6 h-6 opacity-20',
                story.accentColor
              )}
            />
            <p className="text-text-secondary text-sm leading-relaxed pl-6 italic">
              &ldquo;{story.quote}&rdquo;
            </p>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
                story.accentBg,
                story.accentBorder,
                story.accentColor
              )}
            >
              <Icon className="w-3 h-3" />
              {story.project}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-hover border border-border text-text-muted">
              <Clock className="w-3 h-3" />
              {story.timeToShip}
            </span>
          </div>

          {/* Outcome highlight */}
          <div
            className={cn(
              'rounded-lg border px-4 py-3',
              story.accentBg,
              story.accentBorder
            )}
          >
            <p className={cn('text-sm font-semibold', story.accentColor)}>
              🎯 {story.outcome}
            </p>
          </div>
        </div>
      </GlowCard>
    </ScrollReveal>
  );
}

// ─── Success Metrics Bar ───────────────────────────────────────────────────────

function SuccessMetricsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const metrics = [
    {
      icon: Rocket,
      value: 389,
      label: 'Projects Shipped',
      color: 'text-near-green',
      bgColor: 'bg-near-green/10',
      borderColor: 'border-near-green/20',
    },
    {
      icon: DollarSign,
      value: 127,
      label: 'Grants Awarded',
      color: 'text-accent-cyan',
      bgColor: 'bg-accent-cyan/10',
      borderColor: 'border-accent-cyan/20',
    },
    {
      icon: Clock,
      value: 18,
      suffix: 'hrs',
      label: 'Avg Time to First Deploy',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <div className="relative">
        {/* Pulsing border */}
        <motion.div
          className="absolute -inset-[1px] bg-gradient-to-r from-near-green/30 via-accent-cyan/20 to-purple-500/30 rounded-2xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/[0.04] p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {metrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl border mx-auto mb-3 flex items-center justify-center',
                      metric.bgColor,
                      metric.borderColor
                    )}
                  >
                    <Icon className={cn('w-6 h-6', metric.color)} />
                  </div>
                  <div className={cn('text-4xl md:text-5xl font-bold mb-1', metric.color)}>
                    <AnimatedCounter value={metric.value} duration={2000} />
                    {metric.suffix && (
                      <span className="text-2xl ml-1">{metric.suffix}</span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted">{metric.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Headline Stat ─────────────────────────────────────────────────────────────

function HeadlineStat() {
  return (
    <ScrollReveal>
      <div className="text-center mb-6">
        <motion.div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-near-green/20 bg-near-green/5 backdrop-blur-sm mb-8"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <DollarSign className="w-5 h-5 text-near-green" />
          <span className="text-lg sm:text-xl font-semibold text-text-primary">
            Builders on NEAR have earned{' '}
            <span className="text-near-green font-bold">
              $<AnimatedCounter value={4} duration={1500} />M+
            </span>{' '}
            in grants
          </span>
        </motion.div>
      </div>
    </ScrollReveal>
  );
}

// ─── Bottom CTA Callout ────────────────────────────────────────────────────────

function BottomCallout() {
  return (
    <ScrollReveal delay={0.2}>
      <motion.div className="relative mt-16">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/40 via-near-green/40 to-accent-cyan/40 rounded-2xl blur-lg opacity-50" />
        <div className="relative bg-gradient-to-br from-surface to-surface-hover rounded-2xl p-8 md:p-10 text-center border border-near-green/20">
          <p className="text-xl md:text-2xl text-text-primary font-semibold mb-3 leading-relaxed">
            The average builder using Voidspace goes from{' '}
            <span className="text-near-green">zero knowledge</span> to{' '}
            <span className="text-accent-cyan">deployed contract</span> in under{' '}
            <span className="text-purple-400 font-bold">18 hours</span>.
          </p>
          <p className="text-text-muted max-w-2xl mx-auto">
            Traditional Web3 bootcamps take 3–6 months and cost $5,000+.
            <br className="hidden sm:block" />
            AI-powered learning changes everything.
          </p>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────

export function SocialProof() {
  return (
    <section className="py-20 md:py-28">
      <Container size="lg">
        <SectionHeader title="Why Builders Choose NEAR" badge="PROOF" />

        {/* Headline stat */}
        <HeadlineStat />

        {/* Pulsing success metrics */}
        <SuccessMetricsBar />

        {/* Builder Spotlight Cards */}
        <div className="mb-6">
          <h3 className="text-center text-sm uppercase tracking-widest text-text-muted mb-8 font-medium">
            Builder Spotlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUILDER_STORIES.map((story, i) => (
              <BuilderCard key={story.name} story={story} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom callout */}
        <BottomCallout />
      </Container>
    </section>
  );
}
