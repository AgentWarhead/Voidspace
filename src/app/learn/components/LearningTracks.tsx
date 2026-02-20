'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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
  ArrowRight,
  ChevronDown,
  Clock,
  MapPin,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Module {
  label: string;
  icon: React.ElementType;
  slug?: string;
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
    duration: '~9 hours',
    moduleCount: 16,
    theme: 'green',
    modules: [
      { label: 'What is Blockchain?', icon: BookOpen, slug: 'what-is-blockchain' },
      { label: 'What is NEAR?', icon: Sparkles, slug: 'what-is-near' },
      { label: 'Create a Wallet', icon: Wallet, slug: 'create-a-wallet' },
      { label: 'Your First Transaction', icon: Send, slug: 'your-first-transaction' },
      { label: 'Understanding dApps', icon: AppWindow, slug: 'understanding-dapps' },
      { label: 'Reading Smart Contracts', icon: Eye, slug: 'reading-smart-contracts' },
      { label: 'NEAR Ecosystem Tour', icon: MapPin, slug: 'near-ecosystem-tour' },
      { label: 'NEAR vs Other Chains', icon: Globe, slug: 'near-vs-other-chains' },
      { label: 'Reading the Explorer', icon: Eye, slug: 'reading-the-explorer' },
      { label: 'DeFi Basics', icon: Sparkles, slug: 'defi-basics' },
      { label: 'Choose Your Path', icon: Compass, slug: 'choose-your-path' },
      { label: 'NFT Basics on NEAR', icon: Sparkles, slug: 'nft-basics-on-near' },
      { label: 'Staking & Validators', icon: Shield, slug: 'staking-and-validators' },
      { label: 'DAOs on NEAR', icon: Boxes, slug: 'daos-on-near' },
      { label: 'Staying Safe in Web3', icon: Shield, slug: 'staying-safe-in-web3' },
      { label: 'NEAR Data Tools', icon: Database, slug: 'near-data-tools' },
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
    duration: '~28 hours',
    moduleCount: 22,
    theme: 'cyan',
    popular: true,
    modules: [
      { label: 'Dev Environment Setup', icon: Wrench, slug: 'dev-environment-setup' },
      { label: 'Rust Fundamentals', icon: FileCode, slug: 'rust-fundamentals' },
      { label: 'Your First Contract', icon: Terminal, slug: 'your-first-contract' },
      { label: 'Account Model & Access Keys', icon: KeyRound, slug: 'account-model-access-keys' },
      { label: 'State Management', icon: Database, slug: 'state-management' },
      { label: 'NEAR CLI Mastery', icon: Terminal, slug: 'near-cli-mastery' },
      { label: 'Testing & Debugging', icon: Bug, slug: 'testing-debugging' },
      { label: 'Frontend Integration', icon: Layout, slug: 'frontend-integration' },
      { label: 'Token Standards', icon: Coins, slug: 'token-standards' },
      { label: 'NEP Standards Deep Dive', icon: FileCode, slug: 'nep-standards-deep-dive' },
      { label: 'Building a dApp', icon: AppWindow, slug: 'building-a-dapp' },
      { label: 'Security Best Practices', icon: Shield, slug: 'security-best-practices' },
      { label: 'Upgrading Contracts', icon: Upload, slug: 'upgrading-contracts' },
      { label: 'Deployment', icon: Upload, slug: 'deployment' },
      { label: 'Optimization', icon: Gauge, slug: 'optimization' },
      { label: 'Launch Checklist', icon: ListChecks, slug: 'launch-checklist' },
      { label: 'Building an NFT Contract', icon: FileCode, slug: 'building-an-nft-contract' },
      { label: 'Building a DAO Contract', icon: Boxes, slug: 'building-a-dao-contract' },
      { label: 'DeFi Contract Patterns', icon: Coins, slug: 'defi-contract-patterns' },
      { label: 'Aurora EVM Compatibility', icon: Globe, slug: 'aurora-evm-compatibility' },
      { label: 'Wallet Selector Integration', icon: Wallet, slug: 'wallet-selector-integration' },
      { label: 'NEAR Social & BOS', icon: Network, slug: 'near-social-bos' },
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
    duration: '~12 hours',
    moduleCount: 16,
    theme: 'purple',
    modules: [
      { label: 'NEAR Architecture Deep Dive', icon: Network, slug: 'near-architecture-deep-dive' },
      { label: 'Cross-Contract Calls', icon: Puzzle, slug: 'cross-contract-calls' },
      { label: 'Advanced Storage', icon: HardDrive, slug: 'advanced-storage' },
      { label: 'Chain Signatures', icon: KeyRound, slug: 'chain-signatures' },
      { label: 'Intents & Chain Abstraction', icon: Boxes, slug: 'intents-chain-abstraction' },
      { label: 'Shade Agents', icon: Bot, slug: 'shade-agents' },
      { label: 'AI Agent Integration', icon: Bot, slug: 'ai-agent-integration' },
      { label: 'MEV & Transaction Ordering', icon: Zap, slug: 'mev-transaction-ordering' },
      { label: 'Building an Indexer', icon: Database, slug: 'building-an-indexer' },
      { label: 'Multi-Chain with NEAR', icon: Network, slug: 'multi-chain-with-near' },
      { label: 'Production Patterns', icon: Boxes, slug: 'production-patterns' },
      { label: 'Zero Knowledge on NEAR', icon: Shield, slug: 'zero-knowledge-on-near' },
      { label: 'Oracle Integration', icon: Network, slug: 'oracle-integration' },
      { label: 'Gas Optimization Deep Dive', icon: Gauge, slug: 'gas-optimization-deep-dive' },
      { label: 'Bridge Architecture', icon: Network, slug: 'bridge-architecture' },
      { label: 'Formal Verification', icon: Shield, slug: 'formal-verification' },
    ],
  },
  {
    id: 'founder',
    icon: Send,
    emoji: '🟣',
    title: 'Founder',
    subtitle: 'I want to build a business on NEAR',
    description:
      'Turn your dApp into a real business. Learn tokenomics design, revenue models, grant applications, pitching, and building in public.',
    difficulty: 3,
    duration: '~14 hours',
    moduleCount: 12,
    theme: 'purple',
    modules: [
      { label: 'NEAR Grants & Funding', icon: Wallet, slug: 'near-grants-funding' },
      { label: 'Tokenomics Design', icon: Compass, slug: 'tokenomics-design' },
      { label: 'Building in Public', icon: Globe, slug: 'building-in-public' },
      { label: 'Pitching Your Project', icon: Sparkles, slug: 'pitching-your-project' },
      { label: 'Revenue Models for dApps', icon: Coins, slug: 'revenue-models-for-dapps' },
      { label: 'Community Building', icon: Globe, slug: 'community-building' },
      { label: 'Go-to-Market Strategy', icon: Send, slug: 'go-to-market' },
      { label: 'Legal & Regulatory Basics', icon: Shield, slug: 'legal-regulatory-basics' },
      { label: 'Treasury Management', icon: Wallet, slug: 'treasury-management' },
      { label: 'Metrics That Matter', icon: Gauge, slug: 'metrics-that-matter' },
      { label: 'Marketing for Web3', icon: Sparkles, slug: 'marketing-for-web3' },
      { label: 'Investor Relations', icon: Coins, slug: 'investor-relations' },
    ],
  },
];

// ─── Theme Styles ──────────────────────────────────────────────────────────────

const themeStyles = {
  green: {
    border: 'border-near-green/20',
    borderActive: 'border-near-green/50',
    accent: 'text-near-green',
    accentBg: 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 shadow-lg shadow-emerald-500/10',
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
  trackId,
}: {
  modules: Module[];
  theme: 'green' | 'cyan' | 'purple';
  trackId: string;
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
          const content = (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={cn(
                'flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-2.5 rounded-lg border transition-colors min-h-[44px]',
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
          if (mod.slug) {
            return <Link key={i} href={`/learn/${trackId}/${mod.slug}`}>{content}</Link>;
          }
          return content;
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
  const firstModuleSlug = track.modules[0]?.slug ?? '';

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
          'absolute -inset-1 bg-gradient-to-b rounded-2xl blur-lg opacity-0 pointer-events-none',
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
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary">{track.title} Track</h3>
            </div>
            <p className={cn('text-sm font-medium', styles.accent)}>{track.subtitle}</p>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-1">
            {track.description}
          </p>

          {/* Meta row: difficulty, time, modules */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap mb-5 text-xs sm:text-sm">
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

          {/* Module checklist accordion */}
          <AnimatePresence>
            {isExpanded && (
              <ModuleChecklist modules={track.modules} theme={track.theme} trackId={track.id} />
            )}
          </AnimatePresence>

          {/* Button row: expand toggle + start link */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-3 rounded-xl border font-semibold text-sm transition-all min-h-[44px]',
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
              {isExpanded ? 'Hide Modules' : `View ${track.moduleCount} Modules`}
            </button>
            <Link
              href={`/learn/${track.id}/${firstModuleSlug}`}
              className={cn(
                'flex items-center justify-center gap-1.5 px-5 py-3.5 sm:py-3 rounded-xl border font-semibold text-sm transition-all min-h-[44px] whitespace-nowrap',
                'bg-surface-hover',
                styles.border,
                styles.accent,
                'hover:bg-surface'
              )}
            >
              Start
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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

        {/* Track cards — 2x2 grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
