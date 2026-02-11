'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Wallet,
  Code2,
  FileCode,
  FlaskConical,
  Rocket,
  Lock,
  CheckCircle,
  ChevronRight,
  X,
  Crown,
  Zap,
  Shield,
  Star,
  Brain,
  Globe,
  Target,
  Coins,
  AppWindow,
  ShieldCheck,
  CircleDollarSign,
  Trophy,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GlowCard } from '@/components/effects/GlowCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ─── Types ────────────────────────────────────────────────── */

interface SkillNode {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  details: string[];
  xp: number;
  tier: 'foundation' | 'core' | 'advanced' | 'mastery';
  /** Position in the constellation grid: 0-based column within its tier */
  position: number;
  unlocks: string[];
  prerequisites: string[];
  estimatedTime: string;
  rewards: string[];
  link?: string;
}

interface Connection {
  from: string;
  to: string;
}

type NodeStatus = 'completed' | 'available' | 'locked';

/* ─── Data ─────────────────────────────────────────────────── */

const TIER_CONFIG = {
  foundation: {
    label: 'Foundation',
    row: 0,
    color: 'text-near-green',
    bg: 'bg-near-green/10',
    border: 'border-near-green/30',
    glow: 'rgba(0, 236, 151, 0.3)',
    icon: Shield,
    description: 'The basics — understand blockchain and get set up',
  },
  core: {
    label: 'Core',
    row: 1,
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/30',
    glow: 'rgba(0, 212, 255, 0.3)',
    icon: Code2,
    description: 'Learn Rust and start building contracts',
  },
  advanced: {
    label: 'Advanced',
    row: 2,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30',
    glow: 'rgba(192, 132, 252, 0.3)',
    icon: Brain,
    description: 'Build real projects and master security',
  },
  mastery: {
    label: 'Mastery',
    row: 3,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30',
    glow: 'rgba(250, 204, 21, 0.3)',
    icon: Crown,
    description: 'Ship to mainnet and get funded',
  },
};

const RANKS = [
  { name: 'Observer', minXP: 0, icon: '👁️' },
  { name: 'Initiate', minXP: 100, icon: '🌱' },
  { name: 'Builder', minXP: 400, icon: '🔨' },
  { name: 'Architect', minXP: 900, icon: '🏗️' },
  { name: 'Void Walker', minXP: 1500, icon: '🌌' },
  { name: 'Master Builder', minXP: 2500, icon: '👑' },
];

const skillNodes: SkillNode[] = [
  // Foundation (row 0) — 3 nodes
  {
    id: 'near-basics',
    label: 'NEAR Basics',
    icon: BookOpen,
    description: 'Understand blockchain fundamentals and what makes NEAR unique — sharding, named accounts, gas model, and the developer experience that makes NEAR the easiest chain to build on.',
    details: [
      'What is a blockchain & why NEAR?',
      'NEAR\'s sharded architecture (Nightshade)',
      'Named accounts vs hex addresses',
      'Access keys: full-access & function-call',
      'Gas fees & storage staking model',
      'Transaction finality in ~1 second',
    ],
    xp: 100,
    tier: 'foundation',
    position: 0,
    unlocks: ['wallet-setup'],
    prerequisites: [],
    estimatedTime: '2 hours',
    rewards: ['NEAR Basics Badge', 'Ecosystem Overview'],
    link: '#near-basics',
  },
  {
    id: 'wallet-setup',
    label: 'Wallet Setup',
    icon: Wallet,
    description: 'Create, fund, and secure your NEAR wallet. Master named accounts, access keys, and the testnet faucet. This is your gateway to everything on-chain.',
    details: [
      'Choose & install a wallet (Meteor recommended)',
      'Create a testnet .near account',
      'Understand the NEAR account model',
      'Full-access vs function-call keys',
      'Get testnet NEAR from faucet',
      'Security best practices & seed phrase backup',
    ],
    xp: 75,
    tier: 'foundation',
    position: 1,
    unlocks: ['first-transaction'],
    prerequisites: ['near-basics'],
    estimatedTime: '30 min',
    rewards: ['Wallet Pioneer Badge'],
    link: '#wallet-setup',
  },
  {
    id: 'first-transaction',
    label: 'First Transaction',
    icon: Zap,
    description: 'Send your first on-chain transaction. Transfer tokens, interact with contracts, and experience the speed of NEAR firsthand.',
    details: [
      'Send NEAR between accounts',
      'Explore the transaction on NearBlocks',
      'Understand gas and receipts',
      'Call a smart contract method',
      'Check your account state via CLI',
      'View transaction history in wallet',
    ],
    xp: 50,
    tier: 'foundation',
    position: 2,
    unlocks: ['rust-fundamentals', 'smart-contracts'],
    prerequisites: ['wallet-setup'],
    estimatedTime: '20 min',
    rewards: ['First Tx Badge', '+25 Bonus XP'],
    link: '#first-transaction',
  },

  // Core (row 1) — 3 nodes
  {
    id: 'rust-fundamentals',
    label: 'Rust Fundamentals',
    icon: Code2,
    description: 'Master the language that powers NEAR smart contracts. Ownership, borrowing, pattern matching, and error handling — with AI assistance making the learning curve gentle.',
    details: [
      'Variables, types & mutability',
      'Ownership & borrowing model',
      'Structs, enums & pattern matching',
      'Error handling with Result/Option',
      'Traits & generics basics',
      'Collections: Vec, HashMap, iterators',
    ],
    xp: 200,
    tier: 'core',
    position: 0,
    unlocks: ['smart-contracts'],
    prerequisites: ['first-transaction'],
    estimatedTime: '8 hours',
    rewards: ['Rustacean Badge', '+50 Bonus XP'],
    link: '#why-rust',
  },
  {
    id: 'smart-contracts',
    label: 'Smart Contracts 101',
    icon: FileCode,
    description: 'Build and deploy your first NEAR smart contract. State management, view/change methods, cross-contract calls, and the #[near] macro system.',
    details: [
      'Contract structure with #[near] macro',
      'State management & Borsh serialization',
      'View vs change methods',
      'Storage collections (LookupMap, Vector)',
      'Cross-contract calls & promises',
      'Events, logging, and indexers',
    ],
    xp: 300,
    tier: 'core',
    position: 1,
    unlocks: ['testing'],
    prerequisites: ['rust-fundamentals', 'first-transaction'],
    estimatedTime: '10 hours',
    rewards: ['Contract Builder Badge', 'Sanctum Access'],
    link: '/sanctum',
  },
  {
    id: 'testing',
    label: 'Testing',
    icon: FlaskConical,
    description: 'Write bulletproof tests. Unit tests, integration tests with workspaces, sandbox environment, and gas profiling to ship with confidence.',
    details: [
      'Unit tests with #[cfg(test)]',
      'Integration tests with near-workspaces',
      'Sandbox testing environment',
      'Simulating multiple users & accounts',
      'Gas profiling & optimization',
      'Security audit checklist',
    ],
    xp: 250,
    tier: 'core',
    position: 2,
    unlocks: ['build-token', 'build-dapp'],
    prerequisites: ['smart-contracts'],
    estimatedTime: '6 hours',
    rewards: ['Quality Assurance Badge'],
    link: '/sanctum',
  },

  // Advanced (row 2) — 3 nodes
  {
    id: 'build-token',
    label: 'Build a Token',
    icon: Coins,
    description: 'Create your own fungible token following the NEP-141 standard. Minting, transfers, storage management, and integrating with DEXes.',
    details: [
      'NEP-141 fungible token standard',
      'Token metadata (NEP-148)',
      'Minting & burning mechanisms',
      'Storage management pattern',
      'Token transfer & approval flow',
      'Listing on Ref Finance DEX',
    ],
    xp: 350,
    tier: 'advanced',
    position: 0,
    unlocks: ['fill-void'],
    prerequisites: ['testing'],
    estimatedTime: '8 hours',
    rewards: ['Token Minter Badge', 'DeFi Ready'],
    link: '/sanctum',
  },
  {
    id: 'build-dapp',
    label: 'Build a dApp',
    icon: AppWindow,
    description: 'Connect a frontend to your smart contracts. Wallet integration, state queries, transaction signing, and building a full-stack NEAR application.',
    details: [
      'near-api-js / wallet-selector setup',
      'Connect wallet to React/Next.js app',
      'Call view & change methods from frontend',
      'Handle transaction signing & results',
      'Display on-chain state in real-time',
      'Deploy frontend + contract together',
    ],
    xp: 350,
    tier: 'advanced',
    position: 1,
    unlocks: ['fill-void'],
    prerequisites: ['testing'],
    estimatedTime: '10 hours',
    rewards: ['Full-Stack Badge', 'dApp Deployer'],
    link: '/sanctum',
  },
  {
    id: 'security',
    label: 'Security',
    icon: ShieldCheck,
    description: 'Master smart contract security. Common vulnerabilities, audit patterns, access control, upgrade strategies, and incident response.',
    details: [
      'Common attack vectors & mitigations',
      'Reentrancy protection patterns',
      'Access control & owner verification',
      'Contract upgrade strategies',
      'Storage & gas attack prevention',
      'Security audit process & tools',
    ],
    xp: 300,
    tier: 'advanced',
    position: 2,
    unlocks: ['launch'],
    prerequisites: ['testing'],
    estimatedTime: '6 hours',
    rewards: ['Security Expert Badge', 'Audit Ready'],
    link: '/sanctum',
  },

  // Mastery (row 3) — 3 nodes
  {
    id: 'fill-void',
    label: 'Fill a Void',
    icon: Target,
    description: 'Find a real problem to solve. Browse open voids, pick a bounty, and build a solution that earns you NEAR tokens and reputation.',
    details: [
      'Browse available voids on Voidspace',
      'Understand bounty requirements & rewards',
      'Submit a proposal for your solution',
      'Build & iterate with community feedback',
      'Submit for review & completion',
      'Earn NEAR tokens & builder reputation',
    ],
    xp: 400,
    tier: 'mastery',
    position: 0,
    unlocks: ['launch'],
    prerequisites: ['build-token', 'build-dapp'],
    estimatedTime: '20+ hours',
    rewards: ['Void Filler Badge', 'NEAR Bounty Reward'],
    link: '/opportunities',
  },
  {
    id: 'launch',
    label: 'Launch',
    icon: Rocket,
    description: 'Ship to mainnet. Build pipelines, contract upgrades, monitoring, and go live with real users. This is where builders become founders.',
    details: [
      'Production deployment checklist',
      'Mainnet deployment workflow',
      'Contract upgrade & migration patterns',
      'Monitoring & incident response',
      'User onboarding & documentation',
      'Community launch strategy',
    ],
    xp: 350,
    tier: 'mastery',
    position: 1,
    unlocks: ['get-funded'],
    prerequisites: ['fill-void', 'security'],
    estimatedTime: '8 hours',
    rewards: ['Launch Captain Badge', 'Ship It! Achievement'],
    link: '/sanctum',
  },
  {
    id: 'get-funded',
    label: 'Get Funded',
    icon: CircleDollarSign,
    description: 'Apply for NEAR ecosystem grants, join accelerators, and turn your project into a funded venture. The ecosystem is waiting to fund great builders.',
    details: [
      'NEAR Foundation grants program',
      'DevDAO & ecosystem funding',
      'Pitch deck & proposal writing',
      'Accelerator programs (NEAR Horizon)',
      'Token economics design',
      'Investor outreach & fundraising',
    ],
    xp: 500,
    tier: 'mastery',
    position: 2,
    unlocks: [],
    prerequisites: ['launch'],
    estimatedTime: '40+ hours',
    rewards: ['Master Builder Badge', 'NEAR Certified Dev', '🏆 Legend Status'],
    link: '/opportunities',
  },
];

const connections: Connection[] = [
  // Foundation chain
  { from: 'near-basics', to: 'wallet-setup' },
  { from: 'wallet-setup', to: 'first-transaction' },
  // Foundation → Core
  { from: 'first-transaction', to: 'rust-fundamentals' },
  { from: 'first-transaction', to: 'smart-contracts' },
  // Core chain
  { from: 'rust-fundamentals', to: 'smart-contracts' },
  { from: 'smart-contracts', to: 'testing' },
  // Core → Advanced
  { from: 'testing', to: 'build-token' },
  { from: 'testing', to: 'build-dapp' },
  { from: 'testing', to: 'security' },
  // Advanced → Mastery
  { from: 'build-token', to: 'fill-void' },
  { from: 'build-dapp', to: 'fill-void' },
  { from: 'fill-void', to: 'launch' },
  { from: 'security', to: 'launch' },
  { from: 'launch', to: 'get-funded' },
];

const STORAGE_KEY = 'voidspace-skill-progress';

/* ─── Helpers ──────────────────────────────────────────────── */

function loadProgress(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return new Set(JSON.parse(data));
  } catch {}
  return new Set();
}

function saveProgress(completed: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  } catch {}
}

function getNodeStatus(nodeId: string, completed: Set<string>, allNodes: SkillNode[]): NodeStatus {
  if (completed.has(nodeId)) return 'completed';
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) return 'locked';
  // Available if all prerequisites are completed
  if (node.prerequisites.length === 0) return 'available';
  const allPrereqsMet = node.prerequisites.every(p => completed.has(p));
  return allPrereqsMet ? 'available' : 'locked';
}

function getRank(xp: number) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXP) rank = r;
  }
  return rank;
}

function getNodeColors(status: NodeStatus, tier: SkillNode['tier']) {
  const tierConfig = TIER_CONFIG[tier];
  if (status === 'completed') return {
    ring: 'border-near-green',
    bg: 'bg-near-green/15',
    text: 'text-near-green',
    glow: true,
    glowColor: 'rgba(0, 236, 151, 0.3)',
  };
  if (status === 'available') return {
    ring: tierConfig.border,
    bg: tierConfig.bg,
    text: tierConfig.color,
    glow: false,
    glowColor: tierConfig.glow,
  };
  return {
    ring: 'border-border/40',
    bg: 'bg-surface/40',
    text: 'text-text-muted/50',
    glow: false,
    glowColor: 'transparent',
  };
}

/* ─── Star Field Background ────────────────────────────────── */

function StarField() {
  const stars = useMemo(() => Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: ((i * 17 + 31) % 100),
    y: ((i * 23 + 7) % 100),
    size: (i % 5) === 0 ? 2.5 : (i % 3) === 0 ? 1.5 : 1,
    delay: (i % 8) * 0.5,
    duration: 2 + (i % 5),
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className={cn(
            'absolute rounded-full',
            star.size > 2 ? 'bg-near-green/50' : star.size > 1 ? 'bg-accent-cyan/30' : 'bg-white/60'
          )}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.05, star.size > 1.5 ? 0.8 : 0.4, 0.05],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Nebula Background ────────────────────────────────────── */

function NebulaBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_15%_20%,rgba(0,236,151,0.05),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_85%_40%,rgba(0,212,255,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_50%_70%,rgba(192,132,252,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_25%_at_70%_90%,rgba(250,204,21,0.03),transparent)]" />
    </div>
  );
}

/* ─── SVG Constellation Lines (Desktop) ────────────────────── */

function ConstellationLines({
  inView,
  completed,
}: {
  inView: boolean;
  completed: Set<string>;
}) {
  const nodeMap = new Map(skillNodes.map(n => [n.id, n]));

  // Position nodes on the constellation map
  // 4 rows (tiers), 3 columns each
  const getPos = (node: SkillNode) => {
    const tierRow = TIER_CONFIG[node.tier].row;
    const col = node.position;
    // Spread across horizontal space
    const x = 15 + col * 35; // 15%, 50%, 85%
    const y = 12 + tierRow * 26; // 12%, 38%, 64%, 90%
    return { x, y };
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <defs>
        <linearGradient id="line-completed" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00EC97" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="line-available" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00EC97" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="line-locked" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#333333" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#333333" stopOpacity="0.12" />
        </linearGradient>
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((conn, ci) => {
        const fromNode = nodeMap.get(conn.from);
        const toNode = nodeMap.get(conn.to);
        if (!fromNode || !toNode) return null;

        const from = getPos(fromNode);
        const to = getPos(toNode);
        const fromStatus = getNodeStatus(fromNode.id, completed, skillNodes);
        const toStatus = getNodeStatus(toNode.id, completed, skillNodes);
        const isCompleted = fromStatus === 'completed' && toStatus === 'completed';
        const isAvailable = fromStatus === 'completed' && toStatus === 'available';
        const isActive = isCompleted || isAvailable;

        const gradient = isCompleted
          ? 'url(#line-completed)'
          : isAvailable
          ? 'url(#line-available)'
          : 'url(#line-locked)';

        return (
          <g key={`${conn.from}-${conn.to}`}>
            <motion.line
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke={gradient}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={isActive ? '0' : '6 4'}
              filter={isCompleted ? 'url(#line-glow)' : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.3 + ci * 0.08,
                ease: 'easeOut',
              }}
            />
            {/* Energy pulse along available connections */}
            {isAvailable && inView && (
              <motion.circle
                r="3"
                fill="#00EC97"
                filter="url(#line-glow)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  cx: [`${from.x}%`, `${from.x + (to.x - from.x) * 0.3}%`, `${from.x + (to.x - from.x) * 0.7}%`, `${to.x}%`],
                  cy: [`${from.y}%`, `${from.y + (to.y - from.y) * 0.3}%`, `${from.y + (to.y - from.y) * 0.7}%`, `${to.y}%`],
                }}
                transition={{
                  duration: 2.5,
                  delay: 1 + ci * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Desktop Node ─────────────────────────────────────────── */

function DesktopNode({
  node,
  status,
  isSelected,
  onSelect,
  index,
}: {
  node: SkillNode;
  status: NodeStatus;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
}) {
  const colors = getNodeColors(status, node.tier);
  const tierConfig = TIER_CONFIG[node.tier];
  const Icon = node.icon;

  const tierRow = TIER_CONFIG[node.tier].row;
  const left = `${15 + node.position * 35}%`;
  const top = `${12 + tierRow * 26}%`;

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-10"
      style={{ left, top }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.07, type: 'spring', stiffness: 200, damping: 18 }}
      onClick={() => onSelect(node.id)}
    >
      {/* Outer glow for completed */}
      {colors.glow && (
        <motion.div
          className="absolute w-24 h-24 rounded-full"
          animate={{
            boxShadow: [
              `0 0 20px ${colors.glowColor}, 0 0 40px rgba(0,236,151,0.08)`,
              `0 0 35px ${colors.glowColor}, 0 0 60px rgba(0,236,151,0.12)`,
              `0 0 20px ${colors.glowColor}, 0 0 40px rgba(0,236,151,0.08)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Available pulse ring */}
      {status === 'available' && (
        <motion.div
          className="absolute w-20 h-20 rounded-full border-2"
          style={{ borderColor: tierConfig.glow }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Node circle */}
      <motion.div
        className={cn(
          'w-[68px] h-[68px] rounded-full flex items-center justify-center border-2 relative',
          'backdrop-blur-sm transition-shadow',
          colors.ring,
          colors.bg,
          isSelected && 'ring-2 ring-near-green/60 ring-offset-2 ring-offset-background'
        )}
        whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.95 }}
      >
        {status === 'locked' ? (
          <Lock className="w-6 h-6 text-text-muted/30" />
        ) : (
          <Icon className={cn('w-6 h-6', colors.text)} />
        )}

        {/* Completion check */}
        {status === 'completed' && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-near-green flex items-center justify-center shadow-lg shadow-near-green/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.05, type: 'spring' }}
          >
            <CheckCircle className="w-3.5 h-3.5 text-background" />
          </motion.div>
        )}

        {/* Available indicator */}
        {status === 'available' && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-cyan flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-2.5 h-2.5 text-background" />
          </motion.div>
        )}
      </motion.div>

      {/* Label */}
      <span className={cn(
        'text-[11px] font-semibold text-center max-w-[100px] leading-tight',
        status === 'completed' ? 'text-near-green'
          : status === 'available' ? tierConfig.color
          : 'text-text-muted/40'
      )}>
        {node.label}
      </span>

      {/* XP badge */}
      {status !== 'locked' && (
        <span className="text-[9px] font-mono text-near-green/60">{node.xp} XP</span>
      )}
    </motion.div>
  );
}

/* ─── Detail Panel (shared desktop/mobile) ─────────────────── */

function DetailPanel({
  node,
  status,
  onClose,
  onToggleComplete,
}: {
  node: SkillNode;
  status: NodeStatus;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
}) {
  const colors = getNodeColors(status, node.tier);
  const tierConfig = TIER_CONFIG[node.tier];
  const Icon = node.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <Card variant="glass" padding="lg" className="relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-near-green/60 to-transparent" />

        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${colors.glowColor}, transparent 70%)`,
            opacity: 0.3,
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center border-2',
                colors.bg, colors.ring
              )}>
                <Icon className={cn('w-7 h-7', colors.text)} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-xl font-bold text-text-primary">{node.label}</h3>
                  <span className={cn(
                    'text-[9px] font-mono font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border',
                    tierConfig.bg, tierConfig.color, tierConfig.border,
                  )}>
                    {tierConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                  <span className="font-mono text-near-green">{node.xp} XP</span>
                  <span>•</span>
                  <span>{node.details.length} topics</span>
                  <span>•</span>
                  <span>{node.estimatedTime}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          <p className="text-sm text-text-secondary mb-5 leading-relaxed">{node.description}</p>

          {/* Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
            {node.details.map((detail, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-surface/50"
              >
                <div className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold flex-shrink-0',
                  status === 'completed' ? 'bg-near-green/20 text-near-green' : 'bg-surface-hover text-text-muted'
                )}>
                  {status === 'completed' ? <CheckCircle className="w-3 h-3" /> : i + 1}
                </div>
                <span className="text-sm text-text-secondary">{detail}</span>
              </motion.div>
            ))}
          </div>

          {/* Rewards */}
          {node.rewards.length > 0 && (
            <div className="mb-5 p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/15">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400">Rewards</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {node.rewards.map((reward, i) => (
                  <span key={i} className="text-xs text-yellow-400/80 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                    {reward}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Unlocks */}
          {node.unlocks.length > 0 && (
            <div className="mb-5 p-3 rounded-lg bg-accent-cyan/5 border border-accent-cyan/15">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-accent-cyan" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cyan">Unlocks</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {node.unlocks.map(unlockId => {
                  const unlockNode = skillNodes.find(n => n.id === unlockId);
                  return unlockNode ? (
                    <span key={unlockId} className="text-xs text-accent-cyan/80 bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20 flex items-center gap-1">
                      <ChevronRight className="w-2.5 h-2.5" />
                      {unlockNode.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {status === 'available' && (
              <Link href={node.link || '/sanctum'} className="flex-1">
                <Button variant="primary" size="md" className="w-full group">
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            {status === 'completed' && (
              <Link href={node.link || '/sanctum'} className="flex-1">
                <Button variant="secondary" size="md" className="w-full group">
                  Review & Practice
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            {status !== 'locked' && (
              <button
                onClick={() => onToggleComplete(node.id)}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                  status === 'completed'
                    ? 'border-near-green/30 bg-near-green/10 text-near-green hover:bg-near-green/20'
                    : 'border-border bg-surface hover:bg-surface-hover text-text-muted hover:text-text-primary'
                )}
              >
                {status === 'completed' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Completed ✓
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Mark Complete
                  </>
                )}
              </button>
            )}
            {status === 'locked' && (
              <div className="flex-1 text-center py-3 rounded-lg bg-surface/50 border border-border/50">
                <p className="text-xs text-text-muted flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Complete prerequisites to unlock
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── Mobile Node ──────────────────────────────────────────── */

function MobileNode({
  node,
  status,
  index,
  isSelected,
  onSelect,
  isLast,
  nextStatus,
}: {
  node: SkillNode;
  status: NodeStatus;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isLast: boolean;
  nextStatus?: NodeStatus;
}) {
  const colors = getNodeColors(status, node.tier);
  const tierConfig = TIER_CONFIG[node.tier];
  const Icon = node.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div
        className={cn(
          'flex items-start gap-4 relative cursor-pointer',
          status === 'locked' && 'opacity-40'
        )}
        onClick={() => onSelect(node.id)}
      >
        {/* Vertical connecting line */}
        {!isLast && (
          <div className={cn(
            'absolute left-[27px] top-14 w-[2px] h-[calc(100%+4px)]',
            nextStatus !== 'locked'
              ? 'bg-gradient-to-b from-near-green/40 to-near-green/10'
              : 'border-l border-dashed border-border/30'
          )} />
        )}

        {/* Node circle */}
        <motion.div
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center border-2 flex-shrink-0 relative z-10',
            colors.ring, colors.bg,
          )}
          animate={colors.glow ? {
            boxShadow: [
              '0 0 15px rgba(0,236,151,0.3)',
              '0 0 25px rgba(0,236,151,0.5)',
              '0 0 15px rgba(0,236,151,0.3)',
            ],
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          whileTap={{ scale: 0.9 }}
        >
          {status === 'locked' ? (
            <Lock className="w-5 h-5 text-text-muted/40" />
          ) : (
            <Icon className={cn('w-6 h-6', colors.text)} />
          )}

          {status === 'completed' && (
            <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-near-green flex items-center justify-center shadow-lg shadow-near-green/30">
              <CheckCircle className="w-3 h-3 text-background" />
            </div>
          )}
          {status === 'available' && (
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-cyan flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-2 h-2 text-background" />
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1 pt-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={cn(
              'text-sm font-bold',
              status === 'completed' ? 'text-near-green'
                : status === 'available' ? 'text-text-primary'
                : 'text-text-muted/50'
            )}>
              {node.label}
            </h3>
            <span className={cn(
              'text-[8px] font-mono font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-full border',
              tierConfig.bg, tierConfig.color, tierConfig.border,
            )}>
              {tierConfig.label}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{node.description}</p>
          <div className="flex items-center gap-2 mt-1.5">
            {status !== 'locked' && (
              <span className="text-[10px] font-mono text-near-green/60">{node.xp} XP</span>
            )}
            <span className="text-[10px] text-text-muted/40">•</span>
            <span className="text-[10px] text-text-muted/60">{node.estimatedTime}</span>
          </div>
        </div>

        <ChevronRight className={cn(
          'w-4 h-4 mt-4 flex-shrink-0 transition-transform',
          isSelected ? 'rotate-90 text-near-green' : 'text-text-muted/30'
        )} />
      </div>
    </motion.div>
  );
}

/* ─── Tier Divider (Mobile) ────────────────────────────────── */

function TierDivider({ tier }: { tier: keyof typeof TIER_CONFIG }) {
  const config = TIER_CONFIG[tier];
  const TierIcon = config.icon;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={cn('p-1.5 rounded-lg border', config.bg, config.border)}>
        <TierIcon className={cn('w-3.5 h-3.5', config.color)} />
      </div>
      <div>
        <span className={cn('text-xs font-mono font-bold uppercase tracking-widest', config.color)}>
          {config.label}
        </span>
        <p className="text-[10px] text-text-muted">{config.description}</p>
      </div>
      <div className="flex-1 h-px bg-border/30" />
    </div>
  );
}

/* ─── Progress Header ──────────────────────────────────────── */

function ProgressHeader({
  completed,
  totalNodes,
  earnedXP,
  totalXP,
}: {
  completed: number;
  totalNodes: number;
  earnedXP: number;
  totalXP: number;
}) {
  const progressPercent = Math.round((completed / totalNodes) * 100);
  const rank = getRank(earnedXP);
  const nextRank = RANKS.find(r => r.minXP > earnedXP);

  return (
    <div className="space-y-4">
      {/* Rank + XP bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{rank.icon}</span>
          <div>
            <span className="text-sm font-bold text-text-primary">{rank.name}</span>
            {nextRank && (
              <p className="text-[10px] text-text-muted">
                {nextRank.minXP - earnedXP} XP to {nextRank.name} {nextRank.icon}
              </p>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-text-muted">
              Your Builder Journey: <span className="text-near-green">{progressPercent}%</span>
            </span>
            <span className="text-xs font-mono text-near-green">
              {earnedXP} / {totalXP} XP
            </span>
          </div>
          <div className="h-3 bg-surface rounded-full overflow-hidden border border-border/50">
            <motion.div
              className="h-full bg-gradient-to-r from-near-green via-accent-cyan to-purple-400 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'XP Earned', value: earnedXP, suffix: ` / ${totalXP}`, color: 'text-near-green', icon: Star },
          { label: 'Skills Mastered', value: completed, suffix: ` / ${totalNodes}`, color: 'text-accent-cyan', icon: CheckCircle },
          { label: 'Current Rank', value: rank.name, emoji: rank.icon, color: 'text-purple-400', icon: Trophy },
          { label: 'Next Goal', value: nextRank ? nextRank.name : 'MAX!', emoji: nextRank?.icon || '🏆', color: 'text-yellow-400', icon: Target },
        ].map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div key={stat.label} className="p-3 rounded-lg bg-surface/60 border border-border/50 text-center">
              <StatIcon className={cn('w-4 h-4 mx-auto mb-1.5', stat.color)} />
              <div className={cn('text-base font-bold font-mono', stat.color)}>
                {stat.emoji && <span className="mr-1">{stat.emoji}</span>}
                {typeof stat.value === 'number' ? (
                  <>{stat.value}<span className="text-text-muted/40 text-xs">{stat.suffix}</span></>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Tier Legend ───────────────────────────────────────────── */

function TierLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
      {Object.entries(TIER_CONFIG).map(([key, config]) => (
        <div key={key} className="flex items-center gap-1.5">
          <div className={cn('w-3 h-3 rounded-full', config.bg, 'border', config.border)} />
          <span className={cn('text-[10px] font-mono uppercase tracking-wider', config.color)}>
            {config.label}
          </span>
        </div>
      ))}
      <div className="h-3 w-px bg-border mx-1" />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-near-green" />
          <span className="text-[10px] text-text-muted">Complete</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-accent-cyan" />
          <span className="text-[10px] text-text-muted">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-text-muted/40" />
          <span className="text-[10px] text-text-muted">Locked</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function SkillTree() {
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(() => loadProgress());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  // Persist progress
  useEffect(() => {
    saveProgress(completedNodes);
  }, [completedNodes]);

  const handleSelect = useCallback((id: string) => {
    setSelectedNode(prev => (prev === id ? null : id));
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    setCompletedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setCompletedNodes(new Set());
    setSelectedNode(null);
  }, []);

  const selectedData = skillNodes.find(n => n.id === selectedNode);
  const selectedStatus = selectedData ? getNodeStatus(selectedData.id, completedNodes, skillNodes) : 'locked';

  const completedCount = skillNodes.filter(n => completedNodes.has(n.id)).length;
  const totalXP = skillNodes.reduce((sum, n) => sum + n.xp, 0);
  const earnedXP = skillNodes.filter(n => completedNodes.has(n.id)).reduce((sum, n) => sum + n.xp, 0);

  // Group nodes by tier for mobile
  const tiers = ['foundation', 'core', 'advanced', 'mastery'] as const;

  return (
    <div className="w-full space-y-6">
      <SectionHeader title="Constellation of Skills" badge="SKILL TREE" />

      <ScrollReveal>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <p className="text-text-secondary leading-relaxed max-w-3xl text-sm md:text-base">
            Your journey from blockchain beginner to NEAR master builder, visualized as an interactive constellation map.
            Each node unlocks new abilities and earns{' '}
            <span className="text-near-green font-semibold">XP rewards</span>.
            Click any node to explore — mark skills complete to track your progress.
          </p>
          {completedCount > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Progress Header */}
      <ScrollReveal delay={0.05}>
        <ProgressHeader
          completed={completedCount}
          totalNodes={skillNodes.length}
          earnedXP={earnedXP}
          totalXP={totalXP}
        />
      </ScrollReveal>

      {/* Tier Legend */}
      <ScrollReveal delay={0.1}>
        <TierLegend />
      </ScrollReveal>

      {/* ── Desktop Constellation Map ── */}
      <div ref={containerRef} className="hidden lg:block relative h-[560px] rounded-xl border border-border/30 bg-background/80 overflow-hidden">
        <NebulaBackground />
        <StarField />
        <ConstellationLines inView={isInView} completed={completedNodes} />

        {/* Tier row labels */}
        {tiers.map((tier) => {
          const config = TIER_CONFIG[tier];
          return (
            <div
              key={tier}
              className="absolute left-3 z-20 flex items-center gap-1.5"
              style={{ top: `${12 + config.row * 26 - 4}%` }}
            >
              <span className={cn('text-[9px] font-mono uppercase tracking-widest', config.color)}>
                {config.label}
              </span>
            </div>
          );
        })}

        {skillNodes.map((node, i) => (
          <DesktopNode
            key={node.id}
            node={node}
            status={getNodeStatus(node.id, completedNodes, skillNodes)}
            isSelected={selectedNode === node.id}
            onSelect={handleSelect}
            index={i}
          />
        ))}

        <div className="absolute bottom-3 left-4 flex items-center gap-2 z-20">
          <span className="text-[9px] font-mono text-text-muted/40 uppercase tracking-widest">
            Click a node to explore →
          </span>
        </div>
      </div>

      {/* Desktop detail panel */}
      <div className="hidden lg:block">
        <AnimatePresence mode="wait">
          {selectedData && (
            <DetailPanel
              key={selectedData.id}
              node={selectedData}
              status={selectedStatus}
              onClose={() => setSelectedNode(null)}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile Vertical Tree ── */}
      <div className="lg:hidden relative space-y-4">
        {tiers.map((tier) => {
          const tierNodes = skillNodes.filter(n => n.tier === tier);
          return (
            <div key={tier} className="space-y-4">
              <TierDivider tier={tier} />
              {tierNodes.map((node, idx) => {
                const status = getNodeStatus(node.id, completedNodes, skillNodes);
                const isLast = idx === tierNodes.length - 1;
                const nextNode = tierNodes[idx + 1];
                const nextStatus = nextNode ? getNodeStatus(nextNode.id, completedNodes, skillNodes) : undefined;

                return (
                  <div key={node.id} className="space-y-3">
                    <MobileNode
                      node={node}
                      status={status}
                      index={idx}
                      isSelected={selectedNode === node.id}
                      onSelect={handleSelect}
                      isLast={isLast}
                      nextStatus={nextStatus}
                    />
                    {/* Inline detail on mobile */}
                    <AnimatePresence>
                      {selectedNode === node.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden ml-[72px]"
                        >
                          <div className="space-y-2 pb-4">
                            {node.details.map((detail, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className={cn(
                                  'w-1.5 h-1.5 rounded-full flex-shrink-0',
                                  status === 'completed' ? 'bg-near-green' : 'bg-border'
                                )} />
                                <span className="text-xs text-text-secondary">{detail}</span>
                              </div>
                            ))}

                            {node.rewards.length > 0 && (
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <Crown className="w-3 h-3 text-yellow-400" />
                                {node.rewards.map((r, i) => (
                                  <span key={i} className="text-[10px] text-yellow-400/80 bg-yellow-400/10 px-1.5 py-0.5 rounded-full border border-yellow-400/20">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-2 mt-3">
                              {status !== 'locked' && (
                                <>
                                  <Link href={node.link || '/sanctum'}>
                                    <Button variant="primary" size="sm">
                                      {status === 'completed' ? 'Review' : 'Start'}
                                      <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  </Link>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleComplete(node.id); }}
                                    className={cn(
                                      'text-[10px] font-mono px-2 py-1 rounded border transition-all',
                                      status === 'completed'
                                        ? 'border-near-green/30 text-near-green bg-near-green/10'
                                        : 'border-border text-text-muted hover:text-text-primary'
                                    )}
                                  >
                                    {status === 'completed' ? '✓ Done' : 'Mark Done'}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <ScrollReveal delay={0.2}>
        <GlowCard padding="lg" className="text-center">
          <div className="flex flex-col items-center gap-3">
            <motion.div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-near-green/20 to-accent-cyan/20 border border-near-green/30 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 15px rgba(0,236,151,0.15)',
                  '0 0 35px rgba(0,236,151,0.3)',
                  '0 0 15px rgba(0,236,151,0.15)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Globe className="w-7 h-7 text-near-green" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                {completedCount === 0
                  ? 'Begin Your Journey'
                  : completedCount === skillNodes.length
                  ? '🏆 Legendary Builder — You\'ve Mastered Everything!'
                  : `${skillNodes.length - completedCount} Skills Remaining`}
              </h3>
              <p className="text-sm text-text-muted mt-1 max-w-lg mx-auto">
                {completedCount === 0
                  ? 'Start with NEAR Basics above and work your way through the constellation. Each completed node unlocks new paths.'
                  : completedCount === skillNodes.length
                  ? 'You\'ve completed every skill in the tree. You are a true NEAR Master Builder. Go fill some voids and get funded.'
                  : 'Your progress is saved locally. Keep going — each skill unlocks new paths and earns XP toward your next rank.'}
              </p>
            </div>
            {completedCount === 0 && (
              <Button
                variant="primary"
                size="lg"
                className="group mt-2"
                onClick={() => handleSelect('near-basics')}
              >
                Start with NEAR Basics
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </GlowCard>
      </ScrollReveal>
    </div>
  );
}
