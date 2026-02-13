'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, BookOpen, Users, Wrench, FileText,
  ArrowRight, Globe, DollarSign, Code2, Shield, Rocket, TrendingUp,
  MessageCircle, Youtube, Terminal, Search, Eye, Bot,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

/* ─── Types & Data ─────────────────────────────────────────── */

type Category =
  | 'All'
  | 'Official Docs'
  | 'Rust & Smart Contracts'
  | 'Tools & Infrastructure'
  | 'Community & Support'
  | 'Grants & Funding'
  | 'Security & Auditing'
  | 'Launch & Deploy'
  | 'Business & Growth';

interface Resource {
  name: string;
  url: string;
  description: string;
  category: Exclude<Category, 'All'>;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ElementType;
}

const CATEGORY_CONFIG: Record<Exclude<Category, 'All'>, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  'Official Docs':          { icon: FileText,   color: 'text-near-green',  bg: 'bg-near-green/10',  border: 'border-near-green/20' },
  'Rust & Smart Contracts': { icon: Code2,      color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', border: 'border-accent-cyan/20' },
  'Tools & Infrastructure': { icon: Wrench,     color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/20' },
  'Community & Support':    { icon: Users,      color: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/20' },
  'Grants & Funding':       { icon: DollarSign, color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/20' },
  'Security & Auditing':    { icon: Shield,     color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/20' },
  'Launch & Deploy':        { icon: Rocket,     color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20' },
  'Business & Growth':      { icon: TrendingUp, color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20' },
};

const RESOURCES: Resource[] = [
  /* ── Official Docs ──────────────────────────────────────── */
  {
    name: 'NEAR Documentation',
    url: 'https://docs.near.org',
    description: 'Complete developer docs — APIs, SDKs, tutorials, and protocol reference',
    category: 'Official Docs',
    difficulty: 'Beginner',
    icon: Globe,
  },
  {
    name: 'Nomicon (Protocol Specs)',
    url: 'https://nomicon.io',
    description: 'Protocol-level specifications, consensus, runtime, and NEP standards',
    category: 'Official Docs',
    difficulty: 'Advanced',
    icon: FileText,
  },
  {
    name: 'near-sdk-rs API Reference',
    url: 'https://docs.rs/near-sdk/latest/near_sdk/',
    description: 'Rust SDK API docs with examples for every macro, type, and trait',
    category: 'Official Docs',
    difficulty: 'Intermediate',
    icon: Code2,
  },
  {
    name: 'NEAR Examples',
    url: 'https://github.com/near-examples',
    description: 'Official example repos for tokens, NFTs, DAOs, and more — clone and build',
    category: 'Official Docs',
    difficulty: 'Beginner',
    icon: Code2,
  },
  {
    name: 'NEAR Enhancement Proposals',
    url: 'https://github.com/near/NEPs',
    description: 'All NEP standards (141, 171, 199, 366) — the rulebook for interoperability',
    category: 'Official Docs',
    difficulty: 'Advanced',
    icon: FileText,
  },

  /* ── Rust & Smart Contracts ─────────────────────────────── */
  {
    name: 'The Rust Book',
    url: 'https://doc.rust-lang.org/book/',
    description: 'The definitive Rust tutorial — read chapters 1-10 before writing contracts',
    category: 'Rust & Smart Contracts',
    difficulty: 'Beginner',
    icon: BookOpen,
  },
  {
    name: 'Rustlings',
    url: 'https://github.com/rust-lang/rustlings',
    description: 'Interactive exercises to master Rust syntax, ownership, and error handling',
    category: 'Rust & Smart Contracts',
    difficulty: 'Beginner',
    icon: Code2,
  },
  {
    name: 'Rust by Example',
    url: 'https://doc.rust-lang.org/rust-by-example/',
    description: 'Learn Rust through annotated, runnable code examples',
    category: 'Rust & Smart Contracts',
    difficulty: 'Beginner',
    icon: BookOpen,
  },
  {
    name: 'Exercism Rust Track',
    url: 'https://exercism.org/tracks/rust',
    description: '100+ mentored exercises from beginner to advanced',
    category: 'Rust & Smart Contracts',
    difficulty: 'Intermediate',
    icon: Code2,
  },
  {
    name: 'NEAR Smart Contract Patterns',
    url: 'https://docs.near.org/build/smart-contracts/what-is',
    description: 'Official patterns for storage, access control, upgrades, and cross-contract calls',
    category: 'Rust & Smart Contracts',
    difficulty: 'Intermediate',
    icon: FileText,
  },

  /* ── Tools & Infrastructure ─────────────────────────────── */
  {
    name: 'NEAR CLI',
    url: 'https://docs.near.org/tools/near-cli',
    description: 'Deploy, test, and interact with contracts from your terminal',
    category: 'Tools & Infrastructure',
    difficulty: 'Beginner',
    icon: Terminal,
  },
  {
    name: 'cargo-near',
    url: 'https://github.com/near/cargo-near',
    description: 'Cargo extension for building, testing, and deploying NEAR contracts',
    category: 'Tools & Infrastructure',
    difficulty: 'Beginner',
    icon: Wrench,
  },
  {
    name: 'near-workspaces',
    url: 'https://github.com/near/near-workspaces-rs',
    description: 'Sandbox testing framework — test contracts with real chain behavior locally',
    category: 'Tools & Infrastructure',
    difficulty: 'Intermediate',
    icon: Wrench,
  },
  {
    name: 'NearBlocks Explorer',
    url: 'https://nearblocks.io',
    description: 'Block explorer for transactions, accounts, contracts, and on-chain analytics',
    category: 'Tools & Infrastructure',
    difficulty: 'Beginner',
    icon: Search,
  },
  {
    name: 'NEAR Wallet Selector',
    url: 'https://github.com/near/wallet-selector',
    description: 'Multi-wallet integration library — support all major NEAR wallets in your dApp',
    category: 'Tools & Infrastructure',
    difficulty: 'Intermediate',
    icon: Wrench,
  },
  {
    name: 'Voidspace Observatory',
    url: '/observatory',
    description: 'Real-time NEAR ecosystem intelligence — track projects, metrics, and trends',
    category: 'Tools & Infrastructure',
    icon: Eye,
  },
  {
    name: 'Voidspace Void Lens',
    url: '/void-lens',
    description: 'Analyze any NEAR wallet — balances, transaction history, DeFi exposure, and reputation',
    category: 'Tools & Infrastructure',
    icon: Search,
  },

  /* ── Community & Support ────────────────────────────────── */
  {
    name: 'NEAR Discord',
    url: 'https://discord.gg/nearprotocol',
    description: 'Main developer community — ask questions, find collaborators, ship together',
    category: 'Community & Support',
    icon: MessageCircle,
  },
  {
    name: 'NEAR Dev Telegram',
    url: 'https://t.me/neardev',
    description: 'Developer-focused Telegram for quick technical help',
    category: 'Community & Support',
    icon: MessageCircle,
  },
  {
    name: 'NEAR Twitter/X',
    url: 'https://x.com/nearprotocol',
    description: 'Official NEAR updates, partnerships, and ecosystem news',
    category: 'Community & Support',
    icon: Globe,
  },
  {
    name: 'NEAR YouTube',
    url: 'https://www.youtube.com/@NEARProtocol',
    description: 'Video tutorials, conference talks, and ecosystem updates',
    category: 'Community & Support',
    icon: Youtube,
  },
  {
    name: 'Voidspace Sanctum',
    url: '/sanctum',
    description: 'AI-powered code assistant — get help building, debugging, and learning in real time',
    category: 'Community & Support',
    icon: Bot,
  },

  /* ── Grants & Funding ───────────────────────────────────── */
  {
    name: 'NEAR Foundation Grants',
    url: 'https://near.org/ecosystem/grants',
    description: 'Builder grants up to $50K for projects from idea to mainnet',
    category: 'Grants & Funding',
    difficulty: 'Beginner',
    icon: DollarSign,
  },
  {
    name: 'DevHub',
    url: 'https://neardevhub.org',
    description: 'Developer bounties, community proposals, and ecosystem funding',
    category: 'Grants & Funding',
    icon: DollarSign,
  },
  {
    name: 'Proximity Labs',
    url: 'https://proximity.dev',
    description: 'DeFi-focused grants and incubation for NEAR protocols',
    category: 'Grants & Funding',
    icon: DollarSign,
  },
  {
    name: 'NEAR Catalyst',
    url: 'https://near.org/ecosystem',
    description: 'Ecosystem support, accelerator programs, and strategic partnerships',
    category: 'Grants & Funding',
    icon: DollarSign,
  },
  {
    name: 'Gitcoin NEAR Rounds',
    url: 'https://gitcoin.co',
    description: 'Quadratic funding rounds for NEAR public goods',
    category: 'Grants & Funding',
    icon: DollarSign,
  },

  /* ── Security & Auditing ────────────────────────────────── */
  {
    name: 'NEAR Security Checklist',
    url: 'https://docs.near.org/build/smart-contracts/security/checklist',
    description: 'Official pre-deployment security checklist — reentrancy, access control, storage, and panics',
    category: 'Security & Auditing',
    difficulty: 'Intermediate',
    icon: Shield,
  },
  {
    name: 'Rust Security Advisory DB',
    url: 'https://rustsec.org',
    description: 'Known vulnerabilities in Rust crates — check your dependencies before deploying',
    category: 'Security & Auditing',
    difficulty: 'Intermediate',
    icon: Shield,
  },
  {
    name: 'Smart Contract Testing Guide',
    url: 'https://docs.near.org/build/smart-contracts/testing/introduction',
    description: 'Unit and integration testing strategies to catch bugs before they hit mainnet',
    category: 'Security & Auditing',
    difficulty: 'Intermediate',
    icon: Shield,
  },

  /* ── Launch & Deploy ────────────────────────────────────── */
  {
    name: 'Build Web3 Apps on NEAR',
    url: 'https://docs.near.org/build/web3-apps/what-is',
    description: 'End-to-end guide to building and deploying dApps on NEAR — frontend to contract',
    category: 'Launch & Deploy',
    difficulty: 'Intermediate',
    icon: Rocket,
  },
  {
    name: 'Pikespeak Analytics',
    url: 'https://pikespeak.ai',
    description: 'On-chain NEAR analytics — track accounts, contracts, DeFi metrics, and trends',
    category: 'Launch & Deploy',
    difficulty: 'Beginner',
    icon: TrendingUp,
  },
  {
    name: 'DappRadar NEAR',
    url: 'https://dappradar.com/rankings/protocol/near',
    description: 'Track your dApp\'s ranking, users, and volume vs competitors',
    category: 'Launch & Deploy',
    difficulty: 'Beginner',
    icon: TrendingUp,
  },
  {
    name: 'Vercel Deployment',
    url: 'https://vercel.com',
    description: 'Deploy your frontend in minutes — zero-config for Next.js dApps',
    category: 'Launch & Deploy',
    difficulty: 'Beginner',
    icon: Rocket,
  },

  /* ── Business & Growth ──────────────────────────────────── */
  {
    name: 'NEAR Ecosystem Map',
    url: 'https://near.org/ecosystem',
    description: 'Explore 800+ projects — find partners, avoid building what exists',
    category: 'Business & Growth',
    icon: Globe,
  },
  {
    name: 'Token Engineering Commons',
    url: 'https://tecommons.org',
    description: 'Design sustainable tokenomics with community-tested frameworks',
    category: 'Business & Growth',
    icon: TrendingUp,
  },
  {
    name: 'NEAR Foundation Blog',
    url: 'https://near.org/blog',
    description: 'Ecosystem updates, case studies, and strategic insights for builders',
    category: 'Business & Growth',
    icon: BookOpen,
  },
  {
    name: 'NEAR Papers & Research',
    url: 'https://near.org/papers',
    description: 'Whitepapers, economic models, and technical research behind the protocol',
    category: 'Business & Growth',
    difficulty: 'Advanced',
    icon: FileText,
  },
];

const CATEGORIES: Category[] = [
  'All',
  'Official Docs',
  'Rust & Smart Contracts',
  'Tools & Infrastructure',
  'Community & Support',
  'Grants & Funding',
  'Security & Auditing',
  'Launch & Deploy',
  'Business & Growth',
];

const difficultyColor: Record<string, string> = {
  Beginner: 'text-near-green bg-near-green/10 border-near-green/20',
  Intermediate: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  Advanced: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

/* ─── Main Component ───────────────────────────────────────── */

export function ResourceHub() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filtered = activeCategory === 'All'
    ? RESOURCES
    : RESOURCES.filter((r) => r.category === activeCategory);

  return (
    <section id="resources" className="py-16 space-y-8">
      <SectionHeader
        title="Resources"
        badge="YOUR TOOLKIT"
        count={RESOURCES.length}
      />

      <ScrollReveal>
        <div className="max-w-3xl space-y-3">
          <GradientText as="p" animated className="text-xl md:text-2xl font-bold mt-2">
            Everything You Need, From Zero to Mainnet and Beyond
          </GradientText>
          <p className="text-text-secondary text-base leading-relaxed">
            {RESOURCES.length} hand-picked resources across {CATEGORIES.length - 1} categories — from learning
            Rust to launching your company on NEAR. Every link earns its place.
          </p>
        </div>
      </ScrollReveal>

      {/* Category Filter Tabs */}
      <ScrollReveal delay={0.05}>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const config = cat !== 'All' ? CATEGORY_CONFIG[cat] : null;
            const CatIcon = config?.icon;
            const count = cat === 'All' ? RESOURCES.length : RESOURCES.filter((r) => r.category === cat).length;
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                  activeCategory === cat
                    ? cat === 'All'
                      ? 'bg-near-green/10 text-near-green border-near-green/30'
                      : cn(config?.bg, config?.color, config?.border)
                    : 'bg-surface text-text-muted border-border hover:text-text-secondary'
                )}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {CatIcon && <CatIcon className="w-3.5 h-3.5" />}
                {cat}
                <span className="text-[10px] font-mono opacity-60">({count})</span>
              </motion.button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((resource, i) => {
            const catConfig = CATEGORY_CONFIG[resource.category];
            const CatIcon = catConfig.icon;
            const ResIcon = resource.icon;
            const isExternal = resource.url.startsWith('http');

            return (
              <motion.div
                key={resource.url}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
              >
                <Link href={resource.url} target={isExternal ? '_blank' : undefined}>
                  <Card variant="default" padding="md" hover className="h-full group relative overflow-hidden">
                    <div className="flex flex-col gap-2.5">
                      {/* Category + Difficulty Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          'flex items-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border',
                          catConfig.color, catConfig.bg, catConfig.border,
                        )}>
                          <CatIcon className="w-3 h-3" />
                          {resource.category}
                        </span>
                        {resource.difficulty && (
                          <span className={cn(
                            'text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border',
                            difficultyColor[resource.difficulty],
                          )}>
                            {resource.difficulty}
                          </span>
                        )}
                      </div>

                      {/* Icon + Title */}
                      <div className="flex items-center gap-2">
                        <ResIcon className={cn('w-4 h-4 shrink-0', catConfig.color)} />
                        <h4 className="font-semibold text-text-primary group-hover:text-near-green transition-colors">
                          {resource.name}
                        </h4>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {resource.description}
                      </p>

                      {/* URL + Link */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-xs text-text-muted font-mono truncate max-w-[200px]">
                          {resource.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </span>
                        {isExternal ? (
                          <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-near-green transition-colors shrink-0" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-near-green transition-colors shrink-0" />
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
