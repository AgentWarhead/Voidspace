'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Code,
  Zap,
  BookOpen,
  Sparkles,
  Flame,
  Terminal,
  Shield,
  Puzzle,
  Wallet,
  Send,
  Eye,
  Map,
  Compass,
  Wrench,
  FileCode,
  Database,
  Bug,
  Layout,
  Coins,
  AppWindow,
  Upload,
  Gauge,
  ListChecks,
  Network,
  HardDrive,
  KeyRound,
  Bot,
  Boxes,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Module {
  label: string;
  icon: React.ElementType;
}

interface Track {
  id: string;
  icon: React.ElementType;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 1 | 2 | 3;
  duration: string;
  moduleCount: number;
  modules: Module[];
  theme: 'green' | 'cyan' | 'purple';
  popular?: boolean;
}

// ─── Track Data ────────────────────────────────────────────────────────────────

const TRACKS: Track[] = [
  {
    id: 'explorer',
    icon: Globe,
    emoji: '🟢',
    title: 'Explorer',
    subtitle: "I'm new to crypto",
    description:
      'Start from zero. Learn what blockchain is, understand NEAR Protocol, create your first wallet, and make your first on-chain transaction. No coding required.',
    difficulty: 1,
    duration: '~4 hours',
    moduleCount: 8,
    theme: 'green',
    modules: [
      { label: 'What is Blockchain?', icon: BookOpen },
      { label: 'What is NEAR?', icon: Sparkles },
      { label: 'Create a Wallet', icon: Wallet },
      { label: 'Your First Transaction', icon: Send },
      { label: 'Understanding dApps', icon: AppWindow },
      { label: 'Reading Smart Contracts', icon: Eye },
      { label: 'NEAR Ecosystem Tour', icon: Map },
      { label: 'Choose Your Path', icon: Compass },
    ],
  },
  {
    id: 'builder',
    icon: Code,
    emoji: '🟡',
    title: 'Builder',
    subtitle: 'I understand crypto, teach me to build',
    description:
      'The complete developer journey. Set up your environment, learn Rust from scratch, build and deploy smart contracts, integrate frontends, and ship a real dApp to mainnet.',
    difficulty: 2,
    duration: '~20 hours',
    moduleCount: 12,
    theme: 'cyan',
    popular: true,
    modules: [
      { label: 'Dev Environment Setup', icon: Wrench },
      { label: 'Rust Fundamentals', icon: FileCode },
      { label: 'Your First Contract', icon: Terminal },
      { label: 'State Management', icon: Database },
      { label: 'Testing & Debugging', icon: Bug },
      { label: 'Frontend Integration', icon: Layout },
      { label: 'Token Standards', icon: Coins },
      { label: 'Building a dApp', icon: AppWindow },
      { label: 'Security Best Practices', icon: Shield },
      { label: 'Deployment', icon: Upload },
      { label: 'Optimization', icon: Gauge },
      { label: 'Launch Checklist', icon: ListChecks },
    ],
  },
  {
    id: 'hacker',
    icon: Zap,
    emoji: '🔴',
    title: 'Hacker',
    subtitle: 'I know code, show me NEAR-specific stuff',
    description:
      'For experienced developers. Deep-dive into NEAR architecture, cross-contract calls, advanced storage patterns, chain signatures, and production-grade patterns.',
    difficulty: 3,
    duration: '~8 hours',
    moduleCount: 6,
    theme: 'purple',
    modules: [
      { label: 'NEAR Architecture Deep Dive', icon: Network },
      { label: 'Cross-Contract Calls', icon: Puzzle },
      { label: 'Advanced Storage', icon: HardDrive },
      { label: 'Chain Signatures', icon: KeyRound },
      { label: 'AI Agent Integration', icon: Bot },
      { label: 'Production Patterns', icon: Boxes },
    ],
  },
];

// ─── Theme Styles ──────────────────────────────────────────────────────────────

const themeStyles = {
  green: {
    border: 'border-near-green/20',
    borderActive: 'border-near-green/50',
    accent: 'text-near-green',
    accentBg: 'bg-near-green/10',
    accentBorder: 'border-near-green/20',
    glow: 'shadow-near-green/20',
    glowBg: 'from-near-green/20 to-near-green/0',
    ring: 'stroke-near-green',
    ringTrack: 'stroke-near-green/10',
    dot: 'bg-near-green',
    dotMuted: 'bg-near-green/30',
    moduleBg: 'bg-near-green/5',
    moduleBorder: 'border-near-green/15',
    moduleHover: 'hover:border-near-green/30',
  },
  cyan: {
    border: 'border-accent-cyan/20',
    borderActive: 'border-accent-cyan/50',
    accent: 'text-accent-cyan',
    accentBg: 'bg-accent-cyan/10',
    accentBorder: 'border-accent-cyan/20',
    glow: 'shadow-accent-cyan/20',
    glowBg: 'from-accent-cyan/20 to-accent-cyan/0',
    ring: 'stroke-accent-cyan',
    ringTrack: 'stroke-accent-cyan/10',
    dot: 'bg-accent-cyan',
    dotMuted: 'bg-accent-cyan/30',
    moduleBg: 'bg-accent-cyan/5',
    moduleBorder: 'border-accent-cyan/15',
    moduleHover: 'hover:border-accent-cyan/30',
  },
  purple: {
    border: 'border-purple-500/20',
    borderActive: 'border-purple-500/50',
    accent: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/20',
    glow: 'shadow-purple-500/20',
    glowBg: 'from-purple-500/20 to-purple-500/0',
    ring: 'stroke-purple-400',
    ringTrack: 'stroke-purple-500/10',
    dot: 'bg-purple-400',
    dotMuted: 'bg-purple-400/30',
    moduleBg: 'bg-purple-500/5',
    moduleBorder: 'border-purple-500/15',
    moduleHover: 'hover:border-purple-500/30',
  },
};

// ─── Difficulty Dots ───────────────────────────────────────────────────────────

function DifficultyDots({
  level,
  theme,
}: {
  level: 1 | 2 | 3;
  theme: 'green' | 'cyan' | 'purple';
}) {
  const styles = themeStyles[theme];
  return (
    <div className="flex gap-1.5 items-center">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'w-2 h-2 rounded-full transition-colors',
            i <= level ? styles.dot : 'bg-border'
          )}
        />
      ))}
    </div>
  );
}

// ─── Progress Ring (SVG) ───────────────────────────────────────────────────────

function ProgressRing({
  progress = 0,
  theme,
  size = 48,
}: {
  progress?: number;
  theme: 'green' | 'cyan' | 'purple';
  size?: number;
}) {
  const styles = themeStyles[theme];
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={styles.ringTrack}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={styles.ring}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-xs font-bold', styles.accent)}>
          {progress}%
        </span>
      </div>
    </div>
  );
}

// ─── Module Checklist (expanded) ───────────────────────────────────────────────

function ModuleChecklist({
  modules,
  theme,
}: {
  modules: Module[];
  theme: 'green' | 'cyan' | 'purple';
}) {
  const styles = themeStyles[theme];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <div className="pt-4 pb-2 space-y-2">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors',
                styles.moduleBg,
                styles.moduleBorder,
                styles.moduleHover
              )}
            >
              {/* Module number */}
              <span className={cn('text-xs font-mono w-5 text-right', styles.accent)}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {/* Vertical connector line */}
              <div className="flex flex-col items-center w-4">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    styles.accentBorder
                  )}
                >
                  <div className={cn('w-1.5 h-1.5 rounded-full', styles.dotMuted)} />
                </div>
              </div>
              {/* Icon + label */}
              <Icon className={cn('w-4 h-4 flex-shrink-0', styles.accent)} />
              <span className="text-sm text-text-secondary flex-1">{mod.label}</span>
              {/* Unchecked circle */}
              <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Track Card ────────────────────────────────────────────────────────────────

function TrackCard({ track }: { track: Track }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = themeStyles[track.theme];
  const Icon = track.icon;

  return (
    <motion.div
      className="relative h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
    >
      {/* Popular badge */}
      {track.popular && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="bg-gradient-to-r from-near-green to-accent-cyan text-background text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-near-green/20">
            <Flame className="w-3 h-3" />
            MOST POPULAR
          </div>
        </motion.div>
      )}

      {/* Hover glow */}
      <motion.div
        className={cn(
          'absolute -inset-1 bg-gradient-to-b rounded-2xl blur-lg opacity-0',
          styles.glowBg
        )}
        whileHover={{ opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Card */}
      <div
        className={cn(
          'relative bg-surface border rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col',
          isExpanded ? styles.borderActive : styles.border,
          isExpanded && `shadow-lg ${styles.glow}`
        )}
      >
        {/* Top accent bar */}
        <div
          className={cn(
            'h-1 w-full',
            track.theme === 'green' && 'bg-gradient-to-r from-near-green/60 to-near-green/20',
            track.theme === 'cyan' && 'bg-gradient-to-r from-accent-cyan/60 to-accent-cyan/20',
            track.theme === 'purple' && 'bg-gradient-to-r from-purple-500/60 to-purple-400/20'
          )}
        />

        <div className="p-6 flex flex-col flex-1">
          {/* Header row: icon + progress ring */}
          <div className="flex items-start justify-between mb-5">
            <motion.div
              className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center border',
                styles.accentBg,
                styles.accentBorder
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon className={cn('w-7 h-7', styles.accent)} />
            </motion.div>
            <ProgressRing progress={0} theme={track.theme} />
          </div>

          {/* Title */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{track.emoji}</span>
              <h3 className="text-2xl font-bold text-text-primary">{track.title} Track</h3>
            </div>
            <p className={cn('text-sm font-medium', styles.accent)}>{track.subtitle}</p>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-1">
            {track.description}
          </p>

          {/* Meta row: difficulty, time, modules */}
          <div className="flex items-center gap-4 flex-wrap mb-5 text-sm">
            <div className="flex items-center gap-2">
              <DifficultyDots level={track.difficulty} theme={track.theme} />
              <span className="text-text-muted">
                {track.difficulty === 1
                  ? 'Beginner'
                  : track.difficulty === 2
                    ? 'Intermediate'
                    : 'Advanced'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              {track.duration}
            </div>
            <div className="flex items-center gap-1.5 text-text-muted">
              <BookOpen className="w-3.5 h-3.5" />
              {track.moduleCount} modules
            </div>
          </div>

          {/* Expand / Collapse modules */}
          <AnimatePresence>
            {isExpanded && (
              <ModuleChecklist modules={track.modules} theme={track.theme} />
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-all mt-4',
              'bg-surface-hover',
              styles.border,
              styles.accent,
              'hover:bg-surface'
            )}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
            {isExpanded ? 'Hide Modules' : `View All ${track.moduleCount} Modules`}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────

export function LearningTracks() {
  return (
    <section id="tracks" className="py-20 md:py-28">
      <Container size="lg">
        <SectionHeader title="Choose Your Path" badge="TRACKS" />

        <ScrollReveal>
          <p className="text-center text-text-secondary text-lg mb-4 max-w-3xl mx-auto">
            Every legendary builder started somewhere. Pick the track that matches
            where you are — you can always switch or level up later.
          </p>
          <p className="text-center text-text-muted text-sm mb-12">
            All tracks are <span className="text-near-green font-medium">free</span>,{' '}
            <span className="text-near-green font-medium">self-paced</span>, and{' '}
            <span className="text-near-green font-medium">AI-assisted</span>.
          </p>
        </ScrollReveal>

        {/* Track cards — horizontal on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRACKS.map((track, i) => (
            <ScrollReveal key={track.id} delay={i * 0.12}>
              <TrackCard track={track} />
            </ScrollReveal>
          ))}
        </div>

        {/* "Not sure?" helper */}
        <ScrollReveal delay={0.4}>
          <motion.div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-surface/60 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-near-green" />
              <span className="text-sm text-text-secondary">
                Not sure where to start?{' '}
                <button
                  onClick={() =>
                    document
                      .getElementById('tracks')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="text-near-green font-medium hover:underline underline-offset-2"
                >
                  Take the Explorer track
                </button>{' '}
                — it&apos;s designed for complete beginners.
              </span>
            </div>
          </motion.div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
