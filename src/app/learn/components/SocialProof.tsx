'use client';

import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  Zap,
  Clock,
  Sparkles,
  BookOpen,
  Bot,
  Code2,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';

// ─── Real NEAR Ecosystem Stats ─────────────────────────────────────────────────

const ECOSYSTEM_STATS = [
  {
    icon: DollarSign,
    value: '$330M+',
    label: 'Grants Distributed',
    source: 'NEAR Foundation',
    color: 'text-near-green',
    bgColor: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-lg shadow-green-500/10 backdrop-blur-sm',
    borderColor: 'border-green-500/20',
  },
  {
    icon: Users,
    value: '3,000+',
    label: 'Monthly Active Developers',
    source: 'Electric Capital 2025',
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/10',
    borderColor: 'border-accent-cyan/20',
  },
  {
    icon: Zap,
    value: '< $0.01',
    label: 'Avg Transaction Cost',
    source: 'On-chain data',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: Clock,
    value: '1–2s',
    label: 'Transaction Finality',
    source: 'NEAR Protocol specs',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
  },
];

// ─── Differentiators ───────────────────────────────────────────────────────────

const DIFFERENTIATORS = [
  {
    icon: Bot,
    title: 'AI-Powered',
    description: 'Sanctum AI tutor answers your questions in real-time',
    color: 'text-near-green',
    bgColor: 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 shadow-lg shadow-emerald-500/10 backdrop-blur-sm',
    borderColor: 'border-emerald-500/20',
  },
  {
    icon: DollarSign,
    title: 'Free Forever',
    description: 'All tracks, all modules, no paywall',
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/10',
    borderColor: 'border-accent-cyan/20',
  },
  {
    icon: Code2,
    title: 'Learn by Building',
    description: 'Ship real smart contracts, not just read about them',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: BookOpen,
    title: 'Rust + NEAR',
    description: 'The most in-demand blockchain skill set',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
  },
];

// ─── Ecosystem Stats Section ───────────────────────────────────────────────────

function EcosystemStats() {
  return (
    <ScrollReveal>
      <div className="relative mb-16">
        {/* Pulsing border */}
        <motion.div
          className="absolute -inset-[1px] bg-gradient-to-r from-near-green/30 via-accent-cyan/20 to-purple-500/30 rounded-2xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/[0.04] p-4 sm:p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {ECOSYSTEM_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl border mx-auto mb-3 flex items-center justify-center',
                      stat.bgColor,
                      stat.borderColor
                    )}
                  >
                    <Icon className={cn('w-6 h-6', stat.color)} />
                  </div>
                  <div className={cn('text-xl sm:text-3xl md:text-4xl font-bold mb-1', stat.color)}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-text-secondary font-medium">{stat.label}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{stat.source}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

// ─── Early Access Section ──────────────────────────────────────────────────────

function EarlyAccessSection() {
  return (
    <ScrollReveal delay={0.1}>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-near-green/20 bg-near-green/5 backdrop-blur-sm mb-6">
          <Sparkles className="w-4 h-4 text-near-green" />
          <span className="text-xs font-semibold text-near-green uppercase tracking-wider">
            Nearcon Innovation Sandbox
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
          Built for Nearcon Innovation Sandbox
        </h3>
        <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Voidspace is the first AI-powered NEAR education platform. Be among the first
          builders to learn, build, and ship on NEAR Protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIFFERENTIATORS.map((item, i) => {
          const Icon = item.icon;
          return (
            <ScrollReveal key={item.title} delay={i * 0.08}>
              <GlowCard padding="lg" className="h-full text-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl border mx-auto mb-4 flex items-center justify-center',
                    item.bgColor,
                    item.borderColor
                  )}
                >
                  <Icon className={cn('w-6 h-6', item.color)} />
                </div>
                <h4 className="text-base font-bold text-text-primary mb-1">{item.title}</h4>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </GlowCard>
            </ScrollReveal>
          );
        })}
      </div>
    </ScrollReveal>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────

export function SocialProof() {
  return (
    <section className="py-20 md:py-28">
      <Container size="lg">
        <SectionHeader title="Why Builders Choose NEAR" badge="THE ECOSYSTEM" />

        {/* Real ecosystem stats */}
        <EcosystemStats />

        {/* Early access / differentiators */}
        <EarlyAccessSection />
      </Container>
    </section>
  );
}
