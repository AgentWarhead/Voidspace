'use client';

import { motion } from 'framer-motion';
import {
  Compass,
  Code2,
  Terminal,
  Flame,
  Star,
  Clock,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ─── Types & Data ─────────────────────────────────────────── */

interface Capstone {
  id: string;
  track: string;
  trackColor: string;
  trackIcon: React.ElementType;
  name: string;
  description: string;
  difficulty: number; // 1-5
  estimatedTime: string;
  skills: string[];
  startLink: string;
}

const CAPSTONES: Capstone[] = [
  {
    id: 'ecosystem-navigator',
    track: 'Explorer',
    trackColor: 'text-accent-cyan',
    trackIcon: Compass,
    name: 'Ecosystem Navigator',
    description: 'Build a personal dashboard that tracks 5 NEAR dApps you use. Aggregate on-chain data from NearBlocks, DeFiLlama, and Pikespeak to display TVL, transaction counts, and user metrics in real-time.',
    difficulty: 2,
    estimatedTime: '3-5 hours',
    skills: ['On-chain data', 'API integration', 'Dashboard design', 'NEAR ecosystem knowledge'],
    startLink: '/learn/explorer/near-data-tools',
  },
  {
    id: 'token-launcher',
    track: 'Builder',
    trackColor: 'text-near-green',
    trackIcon: Code2,
    name: 'Token Launcher',
    description: 'Deploy a fully compliant NEP-141 fungible token with a web frontend for minting, transferring, and checking balances. Includes storage management and metadata following NEP-148.',
    difficulty: 3,
    estimatedTime: '8-12 hours',
    skills: ['Rust', 'NEP-141', 'near-api-js', 'React/Next.js', 'Testnet deployment'],
    startLink: '/sanctum',
  },
  {
    id: 'mini-dao',
    track: 'Builder',
    trackColor: 'text-near-green',
    trackIcon: Code2,
    name: 'Mini DAO',
    description: 'Build a basic voting contract with proposal creation, vote casting, and execution logic. Members can create proposals, vote yes/no, and auto-execute approved proposals after quorum.',
    difficulty: 4,
    estimatedTime: '10-15 hours',
    skills: ['Rust', 'State management', 'Access control', 'Governance patterns', 'Testing'],
    startLink: '/sanctum',
  },
  {
    id: 'cross-chain-oracle',
    track: 'Hacker',
    trackColor: 'text-purple-400',
    trackIcon: Terminal,
    name: 'Cross-Chain Oracle',
    description: 'Build a contract that uses NEAR Chain Signatures to verify and relay data from another blockchain. Implement MPC key derivation, cross-chain message verification, and a simple price feed.',
    difficulty: 5,
    estimatedTime: '15-20 hours',
    skills: ['Chain Signatures', 'MPC', 'Cross-chain', 'Cryptography', 'Advanced Rust'],
    startLink: '/sanctum',
  },
  {
    id: 'indexer-dashboard',
    track: 'Hacker',
    trackColor: 'text-purple-400',
    trackIcon: Terminal,
    name: 'Indexer Dashboard',
    description: 'Create a custom indexer for a specific NEAR contract using NEAR Lake. Process blocks and receipts, store data in a queryable format, and build a frontend that displays real-time contract activity.',
    difficulty: 4,
    estimatedTime: '12-18 hours',
    skills: ['NEAR Lake', 'Indexing', 'Database', 'Real-time data', 'Backend development'],
    startLink: '/sanctum',
  },
  {
    id: 'pitch-deck-demo',
    track: 'Founder',
    trackColor: 'text-accent-orange',
    trackIcon: Flame,
    name: 'Pitch Deck + Demo',
    description: 'Create a complete project pitch with a deployed testnet demo. Includes market research, competitive analysis, business model, technical architecture, and a working prototype deployed on NEAR testnet.',
    difficulty: 3,
    estimatedTime: '20+ hours',
    skills: ['Market research', 'Pitch design', 'Testnet deployment', 'Business planning', 'Demo building'],
    startLink: '/opportunities',
  },
];

/* ─── Difficulty Stars ─────────────────────────────────────── */

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'w-3 h-3',
            i < level ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted/20'
          )}
        />
      ))}
    </div>
  );
}

/* ─── Capstone Card ────────────────────────────────────────── */

function CapstoneCard({ capstone, index }: { capstone: Capstone; index: number }) {
  const Icon = capstone.trackIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link href={capstone.startLink} className="block group">
        <GlowCard className="h-full p-5 transition-all duration-300 group-hover:scale-[1.01]">
          {/* Track badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon className={cn('w-4 h-4', capstone.trackColor)} />
              <span className={cn('text-[10px] font-mono font-bold uppercase tracking-widest', capstone.trackColor)}>
                {capstone.track}
              </span>
            </div>
            <DifficultyStars level={capstone.difficulty} />
          </div>

          {/* Name & description */}
          <h3 className="text-base font-bold text-text-primary group-hover:text-near-green transition-colors mb-2">
            {capstone.name}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
            {capstone.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-3 text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {capstone.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-near-green" /> {capstone.skills.length} skills
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5">
            {capstone.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border/50 text-text-muted"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1 mt-4 text-xs text-near-green font-medium">
            Start Project <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </GlowCard>
      </Link>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function CapstoneProjects() {
  return (
    <ScrollReveal>
      <div id="capstones">
        <SectionHeader title="Capstone Projects" badge="BUILD" />
        <p className="text-sm text-text-muted mb-6 max-w-2xl">
          Put your skills to the test with real projects. Each capstone demonstrates mastery of a learning track and produces something you can show to employers, grant committees, or the community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAPSTONES.map((capstone, i) => (
            <CapstoneCard key={capstone.id} capstone={capstone} index={i} />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
