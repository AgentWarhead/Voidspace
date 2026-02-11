'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Shield,
  Boxes,
  AlertTriangle,
  Database,
  Puzzle,
  FileCode2,
  TestTube2,
  Cpu,
  Rocket,
  ChevronDown,
  ChevronRight,
  Clock,
  Lock,
  CheckCircle2,
  Sparkles,
  Crown,
  Zap,
  Target,
  Trophy,
  Play,
  CircleDot,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/* ─── Types ────────────────────────────────────────────────── */

type LessonType = 'lesson' | 'challenge' | 'project';
type ModuleStatus = 'completed' | 'in-progress' | 'available' | 'locked';

interface Lesson {
  title: string;
  duration: string;
  type: LessonType;
  completed: boolean;
}

interface CurriculumModule {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  difficulty: number; // 1-5 dots
  estimatedMinutes: number;
  lessons: Lesson[];
  xp: number;
  codePreview?: {
    code: string;
    highlights: { text: string; color: string }[];
  };
}

interface ProgressState {
  completedLessons: Record<string, boolean>; // "moduleId-lessonIndex" -> true
  streak: number;
  lastActiveDate: string; // ISO date
  totalXP: number;
}

/* ─── Badges ───────────────────────────────────────────────── */

const BADGES = [
  { id: 'rust-rookie', name: 'Rust Rookie', icon: '🌱', requirement: 'Complete Module 1', modulesRequired: 1 },
  { id: 'borrow-boss', name: 'Borrow Boss', icon: '🛡️', requirement: 'Complete Module 2', modulesRequired: 2 },
  { id: 'contract-crafter', name: 'Contract Crafter', icon: '⚒️', requirement: 'Complete Module 7', modulesRequired: 7 },
  { id: 'near-native', name: 'NEAR Native', icon: '🌐', requirement: 'Complete 8 Modules', modulesRequired: 8 },
  { id: 'void-master', name: 'Void Master', icon: '🕳️', requirement: 'Complete All Modules', modulesRequired: 10 },
] as const;

/* ─── Module Data ──────────────────────────────────────────── */

const MODULES: CurriculumModule[] = [
  {
    id: 1,
    title: 'Variables & Types',
    subtitle: 'Accounts are strings, balances are u128',
    description: 'Your Rust journey starts with NEAR context from day one. Learn variables, types, and mutability using real blockchain data types — AccountId, Balance, Gas.',
    icon: BookOpen,
    difficulty: 1,
    estimatedMinutes: 90,
    xp: 150,
    codePreview: {
      code: 'let account_id: AccountId = "alice.near".parse().unwrap();',
      highlights: [
        { text: 'let', color: 'text-purple-400' },
        { text: 'AccountId', color: 'text-accent-cyan' },
        { text: '"alice.near"', color: 'text-near-green' },
        { text: '.parse().unwrap()', color: 'text-yellow-400' },
      ],
    },
    lessons: [
      { title: 'Hello Rust, Hello NEAR', duration: '15 min', type: 'lesson', completed: false },
      { title: 'Variables, Mutability & Constants', duration: '20 min', type: 'lesson', completed: false },
      { title: 'NEAR Types: AccountId, Balance, Gas', duration: '25 min', type: 'lesson', completed: false },
      { title: '⚡ Build a NEAR Account Validator', duration: '30 min', type: 'challenge', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Ownership & Borrowing',
    subtitle: 'Why it matters for smart contracts',
    description: "Rust's killer feature. Understand the borrow checker, ownership rules, and why they make smart contracts memory-safe by default.",
    icon: Shield,
    difficulty: 2,
    estimatedMinutes: 120,
    xp: 200,
    codePreview: {
      code: 'fn transfer(&mut self, to: AccountId, amount: Balance) { ... }',
      highlights: [
        { text: 'fn', color: 'text-purple-400' },
        { text: '&mut self', color: 'text-red-400' },
        { text: 'AccountId', color: 'text-accent-cyan' },
        { text: 'Balance', color: 'text-near-green' },
      ],
    },
    lessons: [
      { title: 'What Ownership Actually Means', duration: '25 min', type: 'lesson', completed: false },
      { title: 'Move Semantics & the Stack vs Heap', duration: '25 min', type: 'lesson', completed: false },
      { title: 'References, Borrowing & Lifetimes', duration: '30 min', type: 'lesson', completed: false },
      { title: '⚡ Fix the Borrow Checker Errors', duration: '40 min', type: 'challenge', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Structs & Enums',
    subtitle: 'Building your first contract data model',
    description: 'Every smart contract starts with a struct. Learn to model on-chain state, design enums for contract actions, and master pattern matching.',
    icon: Boxes,
    difficulty: 2,
    estimatedMinutes: 100,
    xp: 175,
    lessons: [
      { title: 'Structs: Your Contract State', duration: '20 min', type: 'lesson', completed: false },
      { title: 'Methods & impl Blocks', duration: '25 min', type: 'lesson', completed: false },
      { title: 'Enums & Pattern Matching', duration: '25 min', type: 'lesson', completed: false },
      { title: '🚀 Model a Token Contract', duration: '30 min', type: 'project', completed: false },
    ],
  },
  {
    id: 4,
    title: 'Error Handling',
    subtitle: 'Result, Option, and graceful failure',
    description: "Rust forces you to handle every edge case. Learn Result<T,E>, Option<T>, the ? operator, and why panicking in a contract costs real money.",
    icon: AlertTriangle,
    difficulty: 2,
    estimatedMinutes: 75,
    xp: 125,
    lessons: [
      { title: 'Option<T> — Goodbye Null', duration: '20 min', type: 'lesson', completed: false },
      { title: 'Result<T,E> & the ? Operator', duration: '25 min', type: 'lesson', completed: false },
      { title: '⚡ Error Handling in a Lending Contract', duration: '30 min', type: 'challenge', completed: false },
    ],
  },
  {
    id: 5,
    title: 'Collections & Iterators',
    subtitle: 'Managing on-chain data efficiently',
    description: 'Vec, HashMap, and NEAR-specific collections like LookupMap and UnorderedMap. Learn to store and query on-chain data without blowing your gas budget.',
    icon: Database,
    difficulty: 3,
    estimatedMinutes: 110,
    xp: 200,
    lessons: [
      { title: 'Vec, HashMap & Standard Collections', duration: '25 min', type: 'lesson', completed: false },
      { title: 'Iterators & Functional Patterns', duration: '25 min', type: 'lesson', completed: false },
      { title: 'NEAR Collections: LookupMap, Vector', duration: '30 min', type: 'lesson', completed: false },
      { title: '⚡ Optimize a Storage-Heavy Contract', duration: '30 min', type: 'challenge', completed: false },
    ],
  },
  {
    id: 6,
    title: 'Traits & Generics',
    subtitle: 'Reusable contract interfaces',
    description: 'Write generic, reusable code. Understand trait objects, derive macros, and how NEAR uses traits for serialization (BorshSerialize, BorshDeserialize).',
    icon: Puzzle,
    difficulty: 3,
    estimatedMinutes: 110,
    xp: 200,
    lessons: [
      { title: 'Defining & Implementing Traits', duration: '25 min', type: 'lesson', completed: false },
      { title: 'Generics & Trait Bounds', duration: '25 min', type: 'lesson', completed: false },
      { title: 'Derive Macros & Borsh Serialization', duration: '25 min', type: 'lesson', completed: false },
      { title: '🚀 Build a Generic Token Interface', duration: '35 min', type: 'project', completed: false },
    ],
  },
  {
    id: 7,
    title: 'Smart Contract Basics',
    subtitle: 'Your first NEAR contract end-to-end',
    description: 'The main event. #[near_bindgen], state management, view vs change methods, storage deposits, and your first complete deployed contract.',
    icon: FileCode2,
    difficulty: 3,
    estimatedMinutes: 150,
    xp: 300,
    codePreview: {
      code: '#[near_bindgen]\nimpl Contract {\n    pub fn new() -> Self { ... }\n}',
      highlights: [
        { text: '#[near_bindgen]', color: 'text-yellow-400' },
        { text: 'impl', color: 'text-purple-400' },
        { text: 'Contract', color: 'text-accent-cyan' },
        { text: 'pub fn new', color: 'text-near-green' },
        { text: 'Self', color: 'text-accent-cyan' },
      ],
    },
    lessons: [
      { title: '#[near_bindgen] & Contract Structure', duration: '25 min', type: 'lesson', completed: false },
      { title: 'View Methods vs Change Methods', duration: '25 min', type: 'lesson', completed: false },
      { title: 'Storage, env::, and Deposits', duration: '30 min', type: 'lesson', completed: false },
      { title: 'Events & Logging for Indexers', duration: '20 min', type: 'lesson', completed: false },
      { title: '🚀 Build a Complete Guestbook Contract', duration: '50 min', type: 'project', completed: false },
    ],
  },
  {
    id: 8,
    title: 'Testing & Debugging',
    subtitle: 'Ship with confidence',
    description: 'Unit tests, integration tests with near-workspaces, simulating multiple accounts, gas profiling, and the security audit checklist.',
    icon: TestTube2,
    difficulty: 4,
    estimatedMinutes: 120,
    xp: 250,
    lessons: [
      { title: 'Unit Testing with #[cfg(test)]', duration: '25 min', type: 'lesson', completed: false },
      { title: 'near-workspaces: Sandbox Testing', duration: '30 min', type: 'lesson', completed: false },
      { title: 'Gas Profiling & Optimization', duration: '25 min', type: 'lesson', completed: false },
      { title: '⚡ Achieve 100% Test Coverage', duration: '40 min', type: 'challenge', completed: false },
    ],
  },
  {
    id: 9,
    title: 'Advanced Patterns',
    subtitle: 'Cross-contract calls, upgradability, storage optimization',
    description: 'Production-grade patterns: cross-contract calls with promises, upgradeable proxy contracts, factory patterns, and storage staking optimization.',
    icon: Cpu,
    difficulty: 4,
    estimatedMinutes: 130,
    xp: 300,
    lessons: [
      { title: 'Cross-Contract Calls & Promises', duration: '30 min', type: 'lesson', completed: false },
      { title: 'Contract Upgrades & State Migration', duration: '30 min', type: 'lesson', completed: false },
      { title: 'Factory Pattern & Storage Optimization', duration: '30 min', type: 'lesson', completed: false },
      { title: '🚀 Build a Token with Staking Rewards', duration: '40 min', type: 'project', completed: false },
    ],
  },
  {
    id: 10,
    title: 'Deploy & Launch',
    subtitle: 'From testnet to mainnet to users',
    description: "The finish line. Build optimized WASM binaries, deploy to testnet, run through the mainnet checklist, set up CI/CD, and ship your contract to the world.",
    icon: Rocket,
    difficulty: 5,
    estimatedMinutes: 120,
    xp: 350,
    lessons: [
      { title: 'Building Optimized WASM Binaries', duration: '20 min', type: 'lesson', completed: false },
      { title: 'Testnet Deployment & Verification', duration: '25 min', type: 'lesson', completed: false },
      { title: 'Mainnet Deployment Checklist', duration: '25 min', type: 'lesson', completed: false },
      { title: '🚀 Ship Your Contract to Mainnet', duration: '50 min', type: 'project', completed: false },
    ],
  },
];

/* ─── Config ───────────────────────────────────────────────── */

const STORAGE_KEY = 'voidspace-curriculum-progress';

const lessonTypeConfig: Record<LessonType, { icon: React.ElementType; color: string; label: string; badge: string }> = {
  lesson: { icon: BookOpen, color: 'text-text-muted', label: 'Lesson', badge: '📖' },
  challenge: { icon: Zap, color: 'text-yellow-400', label: 'Challenge', badge: '⚡' },
  project: { icon: Rocket, color: 'text-near-green', label: 'Project', badge: '🚀' },
};

/* ─── Helpers ──────────────────────────────────────────────── */

function getDefaultProgress(): ProgressState {
  return {
    completedLessons: {},
    streak: 0,
    lastActiveDate: '',
    totalXP: 0,
  };
}

function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw);
  } catch {
    return getDefaultProgress();
  }
}

function saveProgress(state: ProgressState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded — silently fail */ }
}

function computeStreak(lastActiveDate: string, currentStreak: number): number {
  const today = new Date().toISOString().slice(0, 10);
  if (lastActiveDate === today) return currentStreak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (lastActiveDate === yesterday) return currentStreak + 1;
  return 1; // streak broken
}

function getModuleStatus(
  moduleId: number,
  modules: CurriculumModule[],
  completedLessons: Record<string, boolean>
): ModuleStatus {
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return 'locked';

  const totalLessons = mod.lessons.length;
  const completed = mod.lessons.filter((_, i) => completedLessons[`${moduleId}-${i}`]).length;

  if (completed === totalLessons) return 'completed';
  if (completed > 0) return 'in-progress';

  // Check prerequisites — previous module must be completed
  if (moduleId === 1) return 'available';
  const prevMod = modules.find(m => m.id === moduleId - 1);
  if (!prevMod) return 'available';
  const prevCompleted = prevMod.lessons.every((_, i) => completedLessons[`${moduleId - 1}-${i}`]);
  return prevCompleted ? 'available' : 'locked';
}

/* ─── Progress Ring SVG ────────────────────────────────────── */

function ProgressRing({ percent, size = 96, strokeWidth = 5 }: { percent: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#1a1a1a" strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - percent / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00EC97" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-near-green">{percent}%</span>
        <span className="text-[9px] text-text-muted uppercase tracking-wider">Complete</span>
      </div>
    </div>
  );
}

/* ─── Streak Banner ────────────────────────────────────────── */

function StreakBanner({ streak }: { streak: number }) {
  if (streak <= 0) return null;

  const messages = [
    "Keep going!",
    "You're on fire!",
    "Unstoppable!",
    "Legendary streak!",
    "VOID MASTER MODE!",
  ];
  const msgIndex = Math.min(Math.floor(streak / 3), messages.length - 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10 border border-orange-500/20"
    >
      <motion.span
        className="text-2xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
      >
        🔥
      </motion.span>
      <div className="flex-1">
        <span className="text-sm font-bold text-orange-400">
          {streak}-day streak! {messages[msgIndex]}
        </span>
        <p className="text-[11px] text-text-muted mt-0.5">
          Come back tomorrow to keep it alive
        </p>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        {streak > 7 && (
          <span className="text-[10px] text-orange-400/70 ml-1">+{streak - 7}</span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Badge Shelf ──────────────────────────────────────────── */

function BadgeShelf({ completedModuleCount }: { completedModuleCount: number }) {
  return (
    <div className="flex flex-wrap gap-3">
      {BADGES.map((badge) => {
        const earned = completedModuleCount >= badge.modulesRequired;
        return (
          <motion.div
            key={badge.id}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300',
              earned
                ? 'bg-near-green/10 border-near-green/30'
                : 'bg-surface/30 border-border/30 opacity-40 grayscale'
            )}
            whileHover={earned ? { scale: 1.05, y: -2 } : undefined}
          >
            <span className="text-lg">{badge.icon}</span>
            <div>
              <div className={cn('text-xs font-bold', earned ? 'text-near-green' : 'text-text-muted')}>
                {badge.name}
              </div>
              <div className="text-[9px] text-text-muted">{badge.requirement}</div>
            </div>
            {earned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-near-green" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Code Preview ─────────────────────────────────────────── */

function CodePreview({ code, highlights }: { code: string; highlights: { text: string; color: string }[] }) {
  // Simple syntax highlight by replacing known tokens with colored spans
  let remaining = code;
  const parts: { text: string; color?: string }[] = [];

  while (remaining.length > 0) {
    let earliestIndex = remaining.length;
    let matchedHighlight: { text: string; color: string } | null = null;

    for (const h of highlights) {
      const idx = remaining.indexOf(h.text);
      if (idx >= 0 && idx < earliestIndex) {
        earliestIndex = idx;
        matchedHighlight = h;
      }
    }

    if (matchedHighlight && earliestIndex < remaining.length) {
      if (earliestIndex > 0) {
        parts.push({ text: remaining.slice(0, earliestIndex) });
      }
      parts.push({ text: matchedHighlight.text, color: matchedHighlight.color });
      remaining = remaining.slice(earliestIndex + matchedHighlight.text.length);
    } else {
      parts.push({ text: remaining });
      remaining = '';
    }
  }

  return (
    <div className="mt-3 px-3 py-2 rounded-lg bg-background/80 border border-border/50 overflow-x-auto">
      <pre className="text-[11px] font-mono leading-relaxed whitespace-pre">
        {parts.map((p, i) => (
          <span key={i} className={p.color || 'text-text-secondary'}>{p.text}</span>
        ))}
      </pre>
    </div>
  );
}

/* ─── Difficulty Dots ──────────────────────────────────────── */

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1" title={`Difficulty: ${level}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1.5 h-1.5 rounded-full transition-colors',
            i < level
              ? level <= 2 ? 'bg-near-green' : level <= 3 ? 'bg-accent-cyan' : 'bg-purple-400'
              : 'bg-border'
          )}
        />
      ))}
    </div>
  );
}

/* ─── Module Card ──────────────────────────────────────────── */

function ModuleCard({
  mod,
  index,
  status,
  completedLessons,
  onToggleLesson,
}: {
  mod: CurriculumModule;
  index: number;
  status: ModuleStatus;
  completedLessons: Record<string, boolean>;
  onToggleLesson: (moduleId: number, lessonIndex: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = mod.icon;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in-progress';
  const completedCount = mod.lessons.filter((_, i) => completedLessons[`${mod.id}-${i}`]).length;
  const progressPercent = Math.round((completedCount / mod.lessons.length) * 100);

  const statusColors = {
    completed: { border: 'border-near-green/30', icon: 'text-near-green', bg: 'bg-near-green/10' },
    'in-progress': { border: 'border-accent-cyan/30', icon: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    available: { border: 'border-border-hover', icon: 'text-text-secondary', bg: 'bg-surface' },
    locked: { border: 'border-border/30', icon: 'text-text-muted/40', bg: 'bg-surface/50' },
  };
  const sc = statusColors[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <GlowCard
        padding="none"
        className={cn(
          'overflow-hidden transition-all duration-300',
          isLocked && 'opacity-35 pointer-events-none'
        )}
      >
        {/* Top progress bar */}
        {isCompleted && (
          <div className="h-1 bg-gradient-to-r from-near-green via-accent-cyan to-near-green/50" />
        )}
        {isInProgress && (
          <div className="h-1 bg-surface-hover relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-near-green to-accent-cyan"
              initial={{ width: '0%' }}
              whileInView={{ width: `${progressPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.div
              className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ left: ['-20%', '120%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </div>
        )}

        {/* Card content */}
        <div
          className="p-5 md:p-6 cursor-pointer"
          onClick={() => !isLocked && setExpanded(!expanded)}
        >
          <div className="flex items-start gap-4">
            {/* Module number + icon */}
            <div className="relative flex-shrink-0">
              <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center border', sc.bg, sc.border)}>
                {isLocked ? (
                  <Lock className="w-6 h-6 text-text-muted/40" />
                ) : (
                  <Icon className={cn('w-6 h-6', sc.icon)} />
                )}
              </div>
              <span className="absolute -top-2 -left-2 text-[10px] font-mono font-bold text-text-muted bg-surface border border-border rounded-full w-6 h-6 flex items-center justify-center">
                {mod.id}
              </span>
              {isCompleted && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-near-green/20 border border-near-green/30 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <CheckCircle2 className="w-3 h-3 text-near-green" />
                </motion.div>
              )}
            </div>

            {/* Title & meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={cn(
                  'text-base font-bold',
                  isCompleted ? 'text-near-green' : isLocked ? 'text-text-muted/50' : 'text-text-primary'
                )}>
                  {mod.title}
                </h3>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-near-green bg-near-green/10 border border-near-green/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-2.5 h-2.5" /> COMPLETE
                  </span>
                )}
                {isInProgress && (
                  <motion.span
                    className="flex items-center gap-1 text-[10px] font-mono text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded-full"
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="w-2.5 h-2.5" /> {completedCount}/{mod.lessons.length}
                  </motion.span>
                )}
              </div>

              <p className={cn(
                'text-xs font-medium mt-0.5 italic',
                isLocked ? 'text-text-muted/30' : 'text-text-muted'
              )}>
                &ldquo;{mod.subtitle}&rdquo;
              </p>

              <p className={cn(
                'text-sm mt-1.5 leading-relaxed',
                isLocked ? 'text-text-muted/30' : 'text-text-secondary'
              )}>
                {mod.description}
              </p>

              {/* Tags row */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <DifficultyDots level={mod.difficulty} />
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="w-3 h-3" />
                  ~{Math.round(mod.estimatedMinutes / 60 * 10) / 10}h
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <BookOpen className="w-3 h-3" />
                  {mod.lessons.length} lessons
                </span>
                <span className="flex items-center gap-1 text-xs text-purple-400/70">
                  <Crown className="w-3 h-3" />
                  {mod.xp} XP
                </span>
              </div>

              {/* Code preview */}
              {mod.codePreview && !expanded && (
                <CodePreview code={mod.codePreview.code} highlights={mod.codePreview.highlights} />
              )}
            </div>

            {/* Expand arrow */}
            {!isLocked && (
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 mt-1"
              >
                <ChevronDown className={cn('w-5 h-5', expanded ? 'text-near-green' : 'text-text-muted/40')} />
              </motion.div>
            )}
          </div>

          {/* Expanded lessons */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-5 pt-4 border-t border-border/30">
                  {/* Lesson list */}
                  <div className="space-y-1.5 mb-4">
                    {mod.lessons.map((lesson, i) => {
                      const lessonKey = `${mod.id}-${i}`;
                      const done = !!completedLessons[lessonKey];
                      const tc = lessonTypeConfig[lesson.type];

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className={cn(
                            'flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors',
                            'hover:bg-surface-hover',
                            lesson.type === 'challenge' && 'bg-yellow-400/5 border border-yellow-400/10',
                            lesson.type === 'project' && 'bg-near-green/5 border border-near-green/10',
                          )}
                        >
                          {/* Completion checkbox */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLesson(mod.id, i);
                            }}
                            className={cn(
                              'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-200',
                              done
                                ? 'bg-near-green/20 border-near-green/40 text-near-green'
                                : 'bg-surface border-border/50 text-text-muted/40 hover:border-near-green/30 hover:text-near-green/50'
                            )}
                          >
                            {done ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <CircleDot className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Lesson info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                'text-sm transition-all',
                                done ? 'text-text-muted line-through' : 'text-text-secondary'
                              )}>
                                {lesson.title}
                              </span>
                              {lesson.type !== 'lesson' && (
                                <span className={cn(
                                  'text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
                                  lesson.type === 'challenge' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-near-green/10 text-near-green'
                                )}>
                                  {tc.label}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Duration */}
                          <span className="text-[11px] font-mono text-text-muted/50 flex-shrink-0">
                            {lesson.duration}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Code preview in expanded state */}
                  {mod.codePreview && (
                    <CodePreview code={mod.codePreview.code} highlights={mod.codePreview.highlights} />
                  )}

                  {/* Continue button */}
                  <div className="mt-4">
                    <Link href="/sanctum">
                      <Button variant={isCompleted ? 'secondary' : 'primary'} size="md" className="w-full group">
                        {isCompleted ? 'Review in Sanctum' : isInProgress ? 'Continue in Sanctum' : 'Start in Sanctum'}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlowCard>
    </motion.div>
  );
}

/* ─── Curriculum Progress Overview ─────────────────────────── */

function CurriculumProgressOverview({
  progress,
  modules,
}: {
  progress: ProgressState;
  modules: CurriculumModule[];
}) {
  const completedModules = modules.filter(
    m => m.lessons.every((_, i) => progress.completedLessons[`${m.id}-${i}`])
  ).length;
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = Object.values(progress.completedLessons).filter(Boolean).length;
  const totalMinutes = modules.reduce((s, m) => s + m.estimatedMinutes, 0);
  const completedMinutes = modules.reduce((s, m) => {
    const modCompleted = m.lessons.filter((_, i) => progress.completedLessons[`${m.id}-${i}`]).length;
    return s + Math.round((modCompleted / m.lessons.length) * m.estimatedMinutes);
  }, 0);
  const totalXP = modules.reduce((s, m) => s + m.xp, 0);
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find current module
  const currentModule = modules.find(m => {
    const status = getModuleStatus(m.id, modules, progress.completedLessons);
    return status === 'in-progress' || status === 'available';
  });

  return (
    <Card variant="glass" padding="lg" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-near-green/40 to-transparent" />

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Progress ring */}
        <div className="flex-shrink-0">
          <ProgressRing percent={percent} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <GradientText as="h3" className="text-lg font-bold">
              {currentModule
                ? `Module ${currentModule.id} of 10 — ${percent}% Complete`
                : percent === 100
                  ? '🎉 Curriculum Complete!'
                  : 'Begin Your Journey'}
            </GradientText>
          </div>

          {currentModule && (
            <p className="text-sm text-text-muted mb-3">
              Currently: <span className="text-text-secondary font-medium">{currentModule.title}</span>
              {' — '}{currentModule.subtitle}
            </p>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Target, label: 'Modules', value: `${completedModules}/10`, color: 'text-near-green' },
              { icon: BookOpen, label: 'Lessons', value: `${completedLessons}/${totalLessons}`, color: 'text-accent-cyan' },
              { icon: Clock, label: 'Time', value: `${Math.round(completedMinutes / 60)}h/${Math.round(totalMinutes / 60)}h`, color: 'text-purple-400' },
              { icon: Crown, label: 'XP', value: `${progress.totalXP}/${totalXP}`, color: 'text-yellow-400' },
            ].map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-2 p-2 rounded-lg bg-surface/50">
                  <StatIcon className={cn('w-4 h-4 flex-shrink-0', stat.color)} />
                  <div>
                    <div className={cn('text-sm font-bold font-mono', stat.color)}>{stat.value}</div>
                    <div className="text-[10px] text-text-muted">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─── Stats Banner ─────────────────────────────────────────── */

function StatsBanner() {
  const totalHours = Math.round(MODULES.reduce((s, m) => s + m.estimatedMinutes, 0) / 60);
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const totalChallenges = MODULES.reduce((s, m) => s + m.lessons.filter(l => l.type === 'challenge').length, 0);
  const totalProjects = MODULES.reduce((s, m) => s + m.lessons.filter(l => l.type === 'project').length, 0);
  const totalXP = MODULES.reduce((s, m) => s + m.xp, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { label: 'Total Hours', value: totalHours, suffix: 'h', color: 'text-near-green', icon: Clock },
        { label: 'Lessons', value: totalLessons, suffix: '', color: 'text-accent-cyan', icon: BookOpen },
        { label: 'Challenges', value: totalChallenges, suffix: '', color: 'text-yellow-400', icon: Zap },
        { label: 'Projects', value: totalProjects, suffix: '', color: 'text-purple-400', icon: Rocket },
        { label: 'Total XP', value: totalXP, suffix: '', color: 'text-near-green', icon: Crown },
      ].map((item) => {
        const StatIcon = item.icon;
        return (
          <div key={item.label} className="text-center p-3 rounded-lg bg-surface/60 border border-border/50">
            <StatIcon className={cn('w-4 h-4 mx-auto mb-1', item.color)} />
            <div className={cn('text-xl font-bold font-mono', item.color)}>
              <AnimatedCounter value={item.value} duration={1500} />{item.suffix}
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── XP Tracker Footer ────────────────────────────────────── */

function XPTracker({ totalXP, earnedXP }: { totalXP: number; earnedXP: number }) {
  const percent = totalXP > 0 ? Math.round((earnedXP / totalXP) * 100) : 0;

  return (
    <Card variant="glass" padding="md" className="relative overflow-hidden">
      <div className="flex items-center gap-4">
        <motion.div
          className="p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20"
          animate={{
            boxShadow: [
              '0 0 10px rgba(250,204,21,0.1)',
              '0 0 25px rgba(250,204,21,0.2)',
              '0 0 10px rgba(250,204,21,0.1)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Trophy className="w-6 h-6 text-yellow-400" />
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-text-primary">Total XP Progress</span>
            <span className="text-sm font-mono font-bold text-yellow-400">
              {earnedXP} / {totalXP} XP
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-near-green to-accent-cyan"
              initial={{ width: '0%' }}
              whileInView={{ width: `${percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function RustCurriculum() {
  const [progress, setProgress] = useState<ProgressState>(getDefaultProgress);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadProgress();
    // Update streak
    const today = new Date().toISOString().slice(0, 10);
    if (loaded.lastActiveDate && loaded.lastActiveDate !== today) {
      loaded.streak = computeStreak(loaded.lastActiveDate, loaded.streak);
    }
    setProgress(loaded);
    setMounted(true);
  }, []);

  const handleToggleLesson = useCallback((moduleId: number, lessonIndex: number) => {
    setProgress(prev => {
      const key = `${moduleId}-${lessonIndex}`;
      const wasCompleted = !!prev.completedLessons[key];
      const newCompleted = { ...prev.completedLessons };

      if (wasCompleted) {
        delete newCompleted[key];
      } else {
        newCompleted[key] = true;
      }

      // Recalculate XP
      let totalXP = 0;
      for (const m of MODULES) {
        const allDone = m.lessons.every((_, i) => newCompleted[`${m.id}-${i}`]);
        if (allDone) totalXP += m.xp;
      }

      const today = new Date().toISOString().slice(0, 10);
      const newStreak = prev.lastActiveDate === today
        ? prev.streak
        : computeStreak(prev.lastActiveDate, prev.streak);

      const newState: ProgressState = {
        completedLessons: newCompleted,
        streak: Math.max(newStreak, 1),
        lastActiveDate: today,
        totalXP,
      };

      saveProgress(newState);
      return newState;
    });
  }, []);

  const completedModuleCount = useMemo(() =>
    MODULES.filter(m => m.lessons.every((_, i) => progress.completedLessons[`${m.id}-${i}`])).length,
    [progress.completedLessons]
  );

  const totalXP = MODULES.reduce((s, m) => s + m.xp, 0);

  return (
    <div className="w-full space-y-6" id="rust-curriculum">
      <SectionHeader
        title="Rust for NEAR — Complete Curriculum"
        badge="10 MODULES • 40+ LESSONS"
        count={MODULES.reduce((s, m) => s + m.lessons.length, 0)}
      />

      {/* Intro */}
      <ScrollReveal>
        <div className="max-w-3xl space-y-3">
          <GradientText as="p" animated className="text-xl md:text-2xl font-bold mt-2">
            From Zero Rust to Mainnet Deployment
          </GradientText>
          <p className="text-text-secondary leading-relaxed text-sm md:text-base">
            A structured 10-module journey from your first Rust variable to shipping production smart
            contracts on NEAR. Each module builds on the last, with hands-on challenges, real projects,
            and AI-guided practice in the{' '}
            <Link href="/sanctum" className="text-near-green hover:underline font-medium">
              Sanctum
            </Link>
            . At your own pace. Completely free.
          </p>
        </div>
      </ScrollReveal>

      {/* Stats banner */}
      <ScrollReveal delay={0.05}>
        <StatsBanner />
      </ScrollReveal>

      {/* Progress overview */}
      {mounted && (
        <ScrollReveal delay={0.1}>
          <CurriculumProgressOverview progress={progress} modules={MODULES} />
        </ScrollReveal>
      )}

      {/* Streak */}
      {mounted && progress.streak > 0 && (
        <ScrollReveal delay={0.12}>
          <StreakBanner streak={progress.streak} />
        </ScrollReveal>
      )}

      {/* Badges */}
      {mounted && (
        <ScrollReveal delay={0.14}>
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-text-primary">Achievement Badges</span>
              <span className="text-[10px] font-mono text-text-muted ml-auto">
                {completedModuleCount > 0 ? `${BADGES.filter(b => completedModuleCount >= b.modulesRequired).length}/${BADGES.length} earned` : 'Complete modules to unlock'}
              </span>
            </div>
            <BadgeShelf completedModuleCount={completedModuleCount} />
          </Card>
        </ScrollReveal>
      )}

      {/* Module timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="hidden md:block absolute left-[43px] top-8 bottom-8 w-px bg-gradient-to-b from-near-green/30 via-accent-cyan/20 to-purple-400/10" />

        <div className="space-y-4">
          {MODULES.map((mod, i) => {
            const status = mounted
              ? getModuleStatus(mod.id, MODULES, progress.completedLessons)
              : mod.id === 1 ? 'available' : 'locked';

            return (
              <ModuleCard
                key={mod.id}
                mod={mod}
                index={i}
                status={status}
                completedLessons={progress.completedLessons}
                onToggleLesson={handleToggleLesson}
              />
            );
          })}
        </div>
      </div>

      {/* XP Tracker */}
      {mounted && (
        <ScrollReveal delay={0.15}>
          <XPTracker totalXP={totalXP} earnedXP={progress.totalXP} />
        </ScrollReveal>
      )}

      {/* Bottom CTA */}
      <ScrollReveal delay={0.2}>
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
                Jump into the Sanctum for AI-guided, hands-on practice. Spend 30 minutes a day
                or binge the whole thing in a week — the curriculum adapts to your pace.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/sanctum">
                <Button variant="primary" size="lg" className="group">
                  <Sparkles className="w-4 h-4" />
                  Begin Your Journey
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <span className="text-xs text-text-muted">Free • No signup required</span>
            </div>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
