'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, BookOpen, Users, Wrench, FileText,
  ArrowRight, Globe, DollarSign, Code2,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

/* ─── Types & Data ─────────────────────────────────────────── */

type Category = 'All' | 'Official Docs' | 'Rust Learning' | 'Community' | 'Grants' | 'Tools';

interface Resource {
  name: string;
  url: string;
  description: string;
  category: Exclude<Category, 'All'>;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ElementType;
}

const CATEGORY_CONFIG: Record<Exclude<Category, 'All'>, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  'Official Docs': { icon: FileText, color: 'text-near-green', bg: 'bg-near-green/10', border: 'border-near-green/20' },
  'Rust Learning': { icon: Code2, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', border: 'border-accent-cyan/20' },
  Community: { icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  Grants: { icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  Tools: { icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
};

const RESOURCES: Resource[] = [
  // Official Docs
  {
    name: 'NEAR Documentation',
    url: 'https://docs.near.org',
    description: 'Complete developer docs — your primary reference for building on NEAR',
    category: 'Official Docs',
    difficulty: 'Beginner',
    icon: Globe,
  },
  {
    name: 'Nomicon (Protocol Specs)',
    url: 'https://nomicon.io',
    description: 'Protocol-level specifications, NEP standards, and deep technical reference',
    category: 'Official Docs',
    difficulty: 'Advanced',
    icon: FileText,
  },
  {
    name: 'near-sdk-rs Docs',
    url: 'https://docs.rs/near-sdk/latest/near_sdk/',
    description: 'Rust SDK API reference with examples for every macro and type',
    category: 'Official Docs',
    difficulty: 'Intermediate',
    icon: Code2,
  },

  // Rust Learning
  {
    name: 'The Rust Book',
    url: 'https://doc.rust-lang.org/book/',
    description: 'The official Rust tutorial — essential reading before writing NEAR contracts',
    category: 'Rust Learning',
    difficulty: 'Beginner',
    icon: BookOpen,
  },
  {
    name: 'Rustlings',
    url: 'https://github.com/rust-lang/rustlings',
    description: 'Small interactive exercises to get comfortable with Rust syntax and semantics',
    category: 'Rust Learning',
    difficulty: 'Beginner',
    icon: Code2,
  },
  {
    name: 'Rust by Example',
    url: 'https://doc.rust-lang.org/rust-by-example/',
    description: 'Learn Rust through annotated, runnable code examples — great for visual learners',
    category: 'Rust Learning',
    difficulty: 'Beginner',
    icon: BookOpen,
  },
  {
    name: 'Exercism Rust Track',
    url: 'https://exercism.org/tracks/rust',
    description: 'Mentored exercises from beginner to advanced with community feedback',
    category: 'Rust Learning',
    difficulty: 'Intermediate',
    icon: Code2,
  },

  // Community
  {
    name: 'NEAR Discord',
    url: 'https://near.chat',
    description: 'Main developer community — ask questions, find collaborators, get help fast',
    category: 'Community',
    icon: Users,
  },
  {
    name: 'NEAR Forum',
    url: 'https://gov.near.org',
    description: 'Governance discussions, proposals, and ecosystem decision-making',
    category: 'Community',
    icon: Users,
  },
  {
    name: 'NEAR Dev Telegram',
    url: 'https://t.me/neardev',
    description: 'Developer-focused Telegram group for quick technical help and chat',
    category: 'Community',
    icon: Users,
  },
  {
    name: 'NEAR Reddit',
    url: 'https://reddit.com/r/nearprotocol',
    description: 'Community discussions, ecosystem news, and builder updates',
    category: 'Community',
    icon: Users,
  },

  // Grants & Funding
  {
    name: 'NEAR Foundation Grants',
    url: 'https://near.org/ecosystem/grants',
    description: 'Builder grants up to $50K — fund your project from idea to mainnet',
    category: 'Grants',
    difficulty: 'Beginner',
    icon: DollarSign,
  },
  {
    name: 'DevHub',
    url: 'https://neardevhub.org',
    description: 'Developer community with bounties, proposals, and community funding',
    category: 'Grants',
    icon: DollarSign,
  },
  {
    name: 'Proximity Labs',
    url: 'https://proximity.dev',
    description: 'DeFi-focused grants and incubation for NEAR ecosystem protocols',
    category: 'Grants',
    icon: DollarSign,
  },

  // Tools
  {
    name: 'NEAR CLI',
    url: 'https://docs.near.org/tools/near-cli',
    description: 'Command-line interface for deploying, testing, and interacting with contracts',
    category: 'Tools',
    difficulty: 'Beginner',
    icon: Wrench,
  },
  {
    name: 'cargo-near',
    url: 'https://github.com/near/cargo-near',
    description: 'Cargo extension for building, testing, and deploying NEAR contracts',
    category: 'Tools',
    difficulty: 'Beginner',
    icon: Wrench,
  },
  {
    name: 'near-workspaces',
    url: 'https://github.com/near/near-workspaces-rs',
    description: 'Sandbox testing framework for integration tests with real contract behavior',
    category: 'Tools',
    difficulty: 'Intermediate',
    icon: Wrench,
  },
  {
    name: 'NearBlocks Explorer',
    url: 'https://nearblocks.io',
    description: 'Block explorer for transactions, accounts, contracts, and chain analytics',
    category: 'Tools',
    difficulty: 'Beginner',
    icon: Globe,
  },
];

const CATEGORIES: Category[] = ['All', 'Official Docs', 'Rust Learning', 'Community', 'Grants', 'Tools'];

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
            Everything You Need, Organized and Curated
          </GradientText>
          <p className="text-text-secondary text-base leading-relaxed">
            {RESOURCES.length} hand-picked resources across documentation, Rust learning, tools,
            community, and funding. Filter by category to find exactly what you need.
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
