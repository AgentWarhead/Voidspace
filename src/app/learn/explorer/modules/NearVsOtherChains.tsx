'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';
import {
  BookOpen, Clock, CheckCircle2,
  Zap, Shield, DollarSign, Users, Code, Timer,
  Layers, Brain, Scale, Sparkles,
} from 'lucide-react';

// ─── Chain Data ────────────────────────────────────────────────────────────────

interface ChainInfo {
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  stats: {
    tps: string;
    finality: string;
    gasCost: string;
    consensus: string;
    language: string;
    accountModel: string;
    launched: string;
    tvl: string;
  };
  strengths: string[];
  weaknesses: string[];
  tagline: string;
}

const CHAINS: ChainInfo[] = [
  {
    name: 'NEAR',
    emoji: '💚',
    color: 'text-near-green',
    bgColor: 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 shadow-lg shadow-emerald-500/10 backdrop-blur-sm',
    borderColor: 'border-near-green/30',
    stats: {
      tps: '100K+ (sharded)',
      finality: '~1.3 sec',
      gasCost: '~$0.001',
      consensus: 'Proof of Stake (Nightshade)',
      language: 'Rust, JavaScript',
      accountModel: 'Human-readable (alice.near)',
      launched: '2020',
      tvl: '~$200M',
    },
    strengths: ['Human-readable accounts', 'Sub-second finality', 'Sharded scalability', 'AI-native design', 'Near-zero fees'],
    weaknesses: ['Smaller ecosystem (growing)', 'Less Lindy than Ethereum'],
    tagline: 'The usability-first blockchain. Built for humans and AI agents.',
  },
  {
    name: 'Ethereum',
    emoji: '🔷',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    stats: {
      tps: '~15-30',
      finality: '~12 min (2 epochs)',
      gasCost: '$1 - $50+',
      consensus: 'Proof of Stake',
      language: 'Solidity, Vyper',
      accountModel: 'Hex addresses (0x...)',
      launched: '2015',
      tvl: '~$50B+',
    },
    strengths: ['Largest ecosystem', 'Most battle-tested', 'Maximum decentralization', 'Strongest network effects'],
    weaknesses: ['Expensive gas fees', 'Slow finality', 'Complex UX', 'Hex addresses'],
    tagline: 'The OG smart contract platform. Maximum security, maximum fees.',
  },
  {
    name: 'Solana',
    emoji: '🟣',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    stats: {
      tps: '~4,000',
      finality: '~0.4 sec',
      gasCost: '~$0.01',
      consensus: 'Proof of History + PoS',
      language: 'Rust, C, C++',
      accountModel: 'Base58 addresses',
      launched: '2020',
      tvl: '~$5B',
    },
    strengths: ['Ultra-fast transactions', 'Strong DeFi ecosystem', 'Active community', 'Good mobile wallet (Phantom)'],
    weaknesses: ['Network outages history', 'Higher hardware requirements', 'Less decentralized'],
    tagline: 'Speed demon. Fast and cheap, but with growing pains.',
  },
  {
    name: 'Sui',
    emoji: '🔵',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    stats: {
      tps: '~120,000 (theoretical)',
      finality: '~0.5 sec',
      gasCost: '~$0.001',
      consensus: 'Delegated PoS (Narwhal/Bullshark)',
      language: 'Move',
      accountModel: 'Hex addresses',
      launched: '2023',
      tvl: '~$1B',
    },
    strengths: ['Object-centric model', 'Parallel execution', 'Move language safety', 'Strong backing (Mysten Labs)'],
    weaknesses: ['Very new ecosystem', 'Move is niche', 'Less battle-tested'],
    tagline: 'The new kid with big ambitions. Object-centric and blazing fast.',
  },
];

// ─── Comparison Table ──────────────────────────────────────────────────────────

function ComparisonTable() {
  const [highlightedChain, setHighlightedChain] = useState<number | null>(null);

  const metrics = [
    { key: 'tps', label: 'Throughput (TPS)', icon: Zap },
    { key: 'finality', label: 'Finality', icon: Timer },
    { key: 'gasCost', label: 'Gas Cost', icon: DollarSign },
    { key: 'consensus', label: 'Consensus', icon: Shield },
    { key: 'language', label: 'Languages', icon: Code },
    { key: 'accountModel', label: 'Account Model', icon: Users },
    { key: 'launched', label: 'Launched', icon: Sparkles },
    { key: 'tvl', label: 'TVL', icon: Scale },
  ] as const;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Header row */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          <div className="p-3" /> {/* Empty cell */}
          {CHAINS.map((chain, i) => (
            <button
              key={chain.name}
              onClick={() => setHighlightedChain(highlightedChain === i ? null : i)}
              className={cn(
                'p-3 rounded-lg border text-center transition-all',
                highlightedChain === i ? chain.bgColor + ' ' + chain.borderColor : 'bg-surface border-border'
              )}
            >
              <div className="text-lg mb-1">{chain.emoji}</div>
              <div className={cn('text-sm font-bold', highlightedChain === i ? chain.color : 'text-text-primary')}>
                {chain.name}
              </div>
            </button>
          ))}
        </div>

        {/* Data rows */}
        {metrics.map((metric, mi) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: mi * 0.05 }}
              className="grid grid-cols-5 gap-2 mb-2"
            >
              <div className="flex items-center gap-2 p-3 rounded-lg bg-surface border border-border">
                <Icon className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                <span className="text-xs text-text-secondary font-medium">{metric.label}</span>
              </div>
              {CHAINS.map((chain, ci) => (
                <div
                  key={chain.name}
                  className={cn(
                    'p-3 rounded-lg border text-center transition-all',
                    highlightedChain === ci
                      ? chain.bgColor + ' ' + chain.borderColor
                      : 'bg-surface/50 border-border',
                    ci === 0 && highlightedChain === null && 'bg-near-green/5 border-near-green/15'
                  )}
                >
                  <span className={cn(
                    'text-xs font-mono',
                    ci === 0 ? 'text-near-green' : 'text-text-secondary'
                  )}>
                    {chain.stats[metric.key]}
                  </span>
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chain Deep Dive Cards ─────────────────────────────────────────────────────

function ChainDeepDive() {
  const [activeChain, setActiveChain] = useState(0);
  const chain = CHAINS[activeChain];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CHAINS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setActiveChain(i)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all',
              activeChain === i
                ? c.bgColor + ' ' + c.borderColor + ' ' + c.color + ' border'
                : 'bg-surface border border-border text-text-muted hover:border-border-hover'
            )}
          >
            <span>{c.emoji}</span>
            {c.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeChain}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{chain.emoji}</span>
              <h3 className={cn('text-xl font-bold', chain.color)}>{chain.name}</h3>
            </div>
            <p className="text-sm text-text-muted italic mb-4">{chain.tagline}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-near-green" /> Strengths
                </h4>
                <ul className="space-y-1">
                  {chain.strengths.map((s) => (
                    <li key={s} className="text-sm text-text-secondary flex items-center gap-2">
                      <span className="text-near-green">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-orange-400" /> Trade-offs
                </h4>
                <ul className="space-y-1">
                  {chain.weaknesses.map((w) => (
                    <li key={w} className="text-sm text-text-secondary flex items-center gap-2">
                      <span className="text-orange-400">~</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Mark Complete ─────────────────────────────────────────────────────────────

function MarkComplete({ moduleSlug }: { moduleSlug: string }) {
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      return !!progress[moduleSlug];
    } catch { return false; }
  });

  const handleComplete = () => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      progress[moduleSlug] = true;
      localStorage.setItem('voidspace-explorer-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch { /* noop */ }
  };

  return (
    <div className="flex justify-center">
      <Button
        variant={completed ? 'secondary' : 'primary'}
        size="lg"
        onClick={handleComplete}
        leftIcon={completed ? <CheckCircle2 className="w-5 h-5" /> : undefined}
        className={completed ? 'border-near-green/30 text-near-green' : ''}
      >
        {completed ? 'Module Completed ✓' : 'Mark as Complete'}
      </Button>
    </div>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

export function NearVsOtherChains() {
  return (
    <Container size="md">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 8 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            10 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            NEAR vs Other Chains
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            How does NEAR stack up against Ethereum, Solana, and Sui?
            <span className="text-near-green font-medium"> No tribalism — just facts.</span>
          </p>
        </div>
      </ScrollReveal>

      {/* Intro */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <p className="text-text-secondary leading-relaxed text-lg">
            Every blockchain makes trade-offs. Ethereum chose maximum decentralization. Solana chose raw speed.
            Sui chose a novel object model. NEAR chose <span className="text-near-green font-medium">usability</span> —
            the idea that the best blockchain is the one people can actually use without a PhD in cryptography.
          </p>
        </Card>
      </ScrollReveal>

      {/* Comparison Table */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">📊 Side-by-Side Comparison</h3>
          <p className="text-sm text-text-muted mb-6">Click a chain header to highlight its column.</p>
          <ComparisonTable />
        </div>
      </ScrollReveal>

      {/* Deep Dive */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">🔬 Deep Dive: Strengths & Trade-offs</h3>
          <p className="text-sm text-text-muted mb-6">Click each chain to explore.</p>
          <ChainDeepDive />
        </div>
      </ScrollReveal>

      {/* NEAR's Unique Advantages */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">✨ What Only NEAR Has</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Users, title: 'Named Accounts', desc: 'alice.near instead of 0x742d35Cc... No other major L1 has this natively.' },
              { icon: Brain, title: 'AI-First Strategy', desc: 'Co-founded by Transformer paper co-author. NEAR AI, agent infrastructure, chain signatures.' },
              { icon: Layers, title: 'Dynamic Sharding', desc: 'Nightshade sharding scales horizontally. More users = more shards = more throughput.' },
              { icon: Shield, title: 'Chain Signatures', desc: 'Sign transactions on ANY blockchain from your NEAR account. True chain abstraction.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <GlowCard key={item.title} padding="lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm flex-shrink-0">
                      <Icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Key Takeaways */}
      <ScrollReveal delay={0.3}>
        <Card variant="glass" padding="lg" className="mb-12 border-near-green/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-near-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {[
              'Every blockchain makes trade-offs — there is no "best" chain, only best for your use case.',
              'NEAR excels in usability: human-readable accounts, near-zero fees, and fast finality.',
              'Ethereum has the largest ecosystem but high fees. Solana is fastest but had reliability issues.',
              'NEAR\'s unique advantages: named accounts, AI-first strategy, chain signatures, dynamic sharding.',
              'The future is multi-chain — but NEAR\'s chain abstraction lets you operate across all of them.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-near-green mt-0.5 font-bold">→</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.35}>
        <MarkComplete moduleSlug="near-vs-other-chains" />
      </ScrollReveal>
    </Container>
  );
}
