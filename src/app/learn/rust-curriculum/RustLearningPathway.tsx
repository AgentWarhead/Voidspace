'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Terminal,
  Code,
  Shield,
  Boxes,
  AlertTriangle,
  Puzzle,
  Database,
  FileCode2,
  KeyRound,
  HardDrive,
  MonitorSmartphone,
  TestTube2,
  Rocket,
  ChevronRight,
  Clock,
  Sparkles,
  BookOpen,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/* ─── Pathway Steps ────────────────────────────────────────── */

interface PathwayStep {
  order: number;
  slug: string;
  title: string;
  description: string;
  readTime: string;
  icon: React.ElementType;
  phase: 'foundation' | 'core' | 'advanced' | 'mastery';
}

const PATHWAY_STEPS: PathwayStep[] = [
  // Phase 1: Foundation — Learn Rust
  {
    order: 1,
    slug: 'dev-environment-setup',
    title: 'Dev Environment Setup',
    description: 'Install Rust, near-cli, and configure your workspace for NEAR development.',
    readTime: '15 min',
    icon: Terminal,
    phase: 'foundation',
  },
  {
    order: 2,
    slug: 'rust-fundamentals',
    title: 'Rust Fundamentals',
    description: 'Variables, types, mutability — the Rust basics with NEAR-flavored examples.',
    readTime: '25 min',
    icon: Code,
    phase: 'foundation',
  },
  {
    order: 3,
    slug: 'ownership-borrowing',
    title: 'Ownership & Borrowing',
    description: 'Rust\'s killer feature. Understand the borrow checker and why it keeps contracts safe.',
    readTime: '35 min',
    icon: Shield,
    phase: 'foundation',
  },
  {
    order: 4,
    slug: 'structs-enums',
    title: 'Structs & Enums',
    description: 'Model on-chain state with structs, design actions with enums, master pattern matching.',
    readTime: '30 min',
    icon: Boxes,
    phase: 'foundation',
  },
  {
    order: 5,
    slug: 'error-handling',
    title: 'Error Handling',
    description: 'Result, Option, the ? operator — handle every edge case without costly panics.',
    readTime: '25 min',
    icon: AlertTriangle,
    phase: 'foundation',
  },
  {
    order: 6,
    slug: 'traits-generics',
    title: 'Traits & Generics',
    description: 'Reusable interfaces, derive macros, and Borsh serialization for NEAR.',
    readTime: '30 min',
    icon: Puzzle,
    phase: 'foundation',
  },
  {
    order: 7,
    slug: 'collections-iterators',
    title: 'Collections & Iterators',
    description: 'Vec, HashMap, NEAR collections, and functional data processing patterns.',
    readTime: '30 min',
    icon: Database,
    phase: 'foundation',
  },
  // Phase 2: Core — Build Contracts
  {
    order: 8,
    slug: 'your-first-contract',
    title: 'Your First Contract',
    description: 'Write, compile, and deploy your first smart contract to NEAR testnet.',
    readTime: '20 min',
    icon: FileCode2,
    phase: 'core',
  },
  {
    order: 9,
    slug: 'account-model-access-keys',
    title: 'Account Model & Access Keys',
    description: 'NEAR\'s unique account system, named accounts, and permission management.',
    readTime: '15 min',
    icon: KeyRound,
    phase: 'core',
  },
  {
    order: 10,
    slug: 'state-management',
    title: 'State Management',
    description: 'On-chain storage patterns, serialization, and gas-efficient data structures.',
    readTime: '18 min',
    icon: HardDrive,
    phase: 'core',
  },
  {
    order: 11,
    slug: 'near-cli-mastery',
    title: 'NEAR CLI Mastery',
    description: 'Deploy, call, and manage contracts from the terminal like a pro.',
    readTime: '15 min',
    icon: MonitorSmartphone,
    phase: 'core',
  },
  {
    order: 12,
    slug: 'testing-debugging',
    title: 'Testing & Debugging',
    description: 'Unit tests, integration tests with near-workspaces, and gas profiling.',
    readTime: '18 min',
    icon: TestTube2,
    phase: 'core',
  },
  // Phase 3: Advanced — Ship dApps
  {
    order: 13,
    slug: 'token-standards',
    title: 'Token Standards',
    description: 'Implement NEP-141 fungible tokens and NEP-171 NFTs on NEAR.',
    readTime: '18 min',
    icon: Zap,
    phase: 'advanced',
  },
  {
    order: 14,
    slug: 'security-best-practices',
    title: 'Security Best Practices',
    description: 'Common vulnerabilities, secure coding patterns, and audit checklists.',
    readTime: '18 min',
    icon: Shield,
    phase: 'advanced',
  },
  {
    order: 15,
    slug: 'deployment',
    title: 'Deployment',
    description: 'From testnet to mainnet — deployment strategies and verification.',
    readTime: '15 min',
    icon: Rocket,
    phase: 'advanced',
  },
  {
    order: 16,
    slug: 'launch-checklist',
    title: 'Launch Checklist',
    description: 'Everything to verify before shipping your dApp to production.',
    readTime: '12 min',
    icon: Target,
    phase: 'advanced',
  },
];

const PHASES = [
  { id: 'foundation' as const, label: 'Rust Foundations', color: 'from-near-green to-emerald-500', description: 'Learn the Rust language with NEAR context', modules: '7 modules • ~3 hours' },
  { id: 'core' as const, label: 'Smart Contract Core', color: 'from-accent-cyan to-blue-500', description: 'Build and test real contracts', modules: '5 modules • ~1.5 hours' },
  { id: 'advanced' as const, label: 'Ship to Production', color: 'from-purple-500 to-pink-500', description: 'Standards, security, and deployment', modules: '4 modules • ~1 hour' },
];

/* ─── Phase Header ─────────────────────────────────────────── */

function PhaseHeader({ phase, index }: { phase: typeof PHASES[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <div className="flex items-center gap-4 mb-4 mt-8 first:mt-0">
        <div className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br text-white font-bold text-sm',
          phase.color
        )}>
          {index + 1}
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">{phase.label}</h3>
          <p className="text-xs text-text-muted">{phase.description} • {phase.modules}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step Card ────────────────────────────────────────────── */

function StepCard({ step, stepIndex }: { step: PathwayStep; stepIndex: number }) {
  const Icon = step.icon;
  const phaseColors = {
    foundation: { border: 'hover:border-near-green/40', number: 'text-near-green', dot: 'bg-near-green' },
    core: { border: 'hover:border-accent-cyan/40', number: 'text-accent-cyan', dot: 'bg-accent-cyan' },
    advanced: { border: 'hover:border-purple-400/40', number: 'text-purple-400', dot: 'bg-purple-400' },
    mastery: { border: 'hover:border-pink-400/40', number: 'text-pink-400', dot: 'bg-pink-400' },
  };
  const pc = phaseColors[step.phase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: stepIndex * 0.03, duration: 0.3 }}
    >
      <Link href={`/learn/builder/${step.slug}`}>
        <GlowCard
          padding="none"
          className={cn(
            'group transition-all duration-300 cursor-pointer',
            pc.border
          )}
        >
          <div className="p-4 md:p-5 flex items-center gap-4">
            {/* Step number */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border/50 flex items-center justify-center group-hover:border-near-green/30 transition-colors">
                <Icon className="w-5 h-5 text-text-muted group-hover:text-near-green transition-colors" />
              </div>
              <span className={cn(
                'absolute -top-1.5 -left-1.5 text-[9px] font-mono font-bold bg-surface border border-border rounded-full w-5 h-5 flex items-center justify-center',
                pc.number
              )}>
                {step.order}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-text-primary group-hover:text-near-green transition-colors">
                {step.title}
              </h4>
              <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                {step.description}
              </p>
            </div>

            {/* Time + arrow */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="flex items-center gap-1 text-[11px] text-text-muted font-mono">
                <Clock className="w-3 h-3" />
                {step.readTime}
              </span>
              <ChevronRight className="w-4 h-4 text-text-muted/30 group-hover:text-near-green group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </GlowCard>
      </Link>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function RustLearningPathway() {
  const totalMinutes = PATHWAY_STEPS.reduce((sum, s) => {
    const mins = parseInt(s.readTime) || 0;
    return sum + mins;
  }, 0);
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

  return (
    <div className="w-full space-y-6" id="rust-curriculum">
      <SectionHeader
        title="Rust for NEAR — Learning Path"
        badge={`${PATHWAY_STEPS.length} MODULES • ~${totalHours}H`}
        count={PATHWAY_STEPS.length}
      />

      {/* Intro */}
      <ScrollReveal>
        <div className="max-w-3xl space-y-3">
          <GradientText as="p" animated className="text-xl md:text-2xl font-bold mt-2">
            From Zero Rust to Mainnet Deployment
          </GradientText>
          <p className="text-text-secondary leading-relaxed text-sm md:text-base">
            A structured learning path that takes you from your first Rust variable to shipping production
            smart contracts on NEAR Protocol. Follow these modules in order — each builds on the last.
            Completely free, at your own pace.
          </p>
        </div>
      </ScrollReveal>

      {/* Who is this for */}
      <ScrollReveal delay={0.05}>
        <Card variant="glass" padding="md">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-near-green" />
                <h3 className="text-sm font-bold text-text-primary">Who is this for?</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-near-green flex-shrink-0" />
                  Developers new to Rust who want to build on NEAR
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-near-green flex-shrink-0" />
                  Web3 builders coming from JavaScript or Solidity
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-near-green flex-shrink-0" />
                  Anyone who wants a structured path (not random tutorials)
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-sm font-bold text-text-primary">What you&apos;ll build</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-cyan flex-shrink-0" />
                  Smart contracts with Rust and the NEAR SDK
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-cyan flex-shrink-0" />
                  Token contracts (fungible + NFTs) following NEP standards
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-cyan flex-shrink-0" />
                  Production-deployed dApps with testing and security
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal delay={0.08}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Modules', value: PATHWAY_STEPS.length, icon: BookOpen, color: 'text-near-green' },
            { label: 'Hours', value: `~${totalHours}`, icon: Clock, color: 'text-accent-cyan' },
            { label: 'Phases', value: PHASES.length, icon: Target, color: 'text-purple-400' },
            { label: 'Cost', value: 'Free', icon: Sparkles, color: 'text-yellow-400' },
          ].map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-3 rounded-lg bg-surface/60 border border-border/50">
                <StatIcon className={cn('w-4 h-4 mx-auto mb-1', stat.color)} />
                <div className={cn('text-xl font-bold font-mono', stat.color)}>{stat.value}</div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Pathway */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="hidden md:block absolute left-[23px] top-16 bottom-8 w-px bg-gradient-to-b from-near-green/30 via-accent-cyan/20 to-purple-400/10" />

        {PHASES.map((phase, phaseIdx) => {
          const phaseSteps = PATHWAY_STEPS.filter(s => s.phase === phase.id);
          return (
            <div key={phase.id}>
              <ScrollReveal delay={phaseIdx * 0.05}>
                <PhaseHeader phase={phase} index={phaseIdx} />
              </ScrollReveal>
              <div className="space-y-2 ml-0 md:ml-2">
                {phaseSteps.map((step, i) => (
                  <StepCard key={step.slug} step={step} stepIndex={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Learning CTA */}
      <ScrollReveal delay={0.15}>
        <Card variant="glass" padding="lg" className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-near-green/5 via-transparent to-accent-cyan/5 pointer-events-none" />
          <div className="relative space-y-4">
            <motion.div
              className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-near-green/20 to-accent-cyan/20 border border-near-green/30 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0,236,151,0.1)',
                  '0 0 40px rgba(0,236,151,0.2)',
                  '0 0 20px rgba(0,236,151,0.1)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-8 h-8 text-near-green" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">Ready to Start?</h3>
              <p className="text-sm text-text-muted mt-1 max-w-md mx-auto">
                Begin with Module 1 and work your way through. Each module takes 15–35 minutes.
                You can finish the entire path in a week of focused study.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/learn/builder/dev-environment-setup">
                <Button variant="primary" size="lg" className="group">
                  <Sparkles className="w-4 h-4" />
                  Start Module 1
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/learn#tracks">
                <Button variant="ghost" size="lg">
                  View All Tracks
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
