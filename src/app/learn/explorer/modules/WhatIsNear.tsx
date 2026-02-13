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
  Zap, Users, Cpu, Layers,
  Sparkles, Brain,
} from 'lucide-react';

// ─── Feature Showcase ──────────────────────────────────────────────────────────

function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Users,
      title: 'Human-Readable Accounts',
      tagline: 'alice.near > 0x7a3f9b2e4c...d1f8',
      description: 'On Ethereum, your address is a 42-character hex string. On NEAR, it\'s your name. Like having an email address instead of an IP address. Send tokens to "alice.near" — not a cryptographic puzzle.',
      visual: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <span className="text-red-400 text-xs font-mono">ETH</span>
            <code className="text-xs text-text-muted font-mono break-all">0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18</code>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-near-green/5 border border-near-green/20">
            <span className="text-near-green text-xs font-mono">NEAR</span>
            <code className="text-sm text-near-green font-mono font-bold">alice.near</code>
          </div>
        </div>
      ),
    },
    {
      icon: Zap,
      title: 'Sub-Second Finality',
      tagline: '~1.3 seconds to confirm. Done.',
      description: 'Bitcoin takes 60 minutes for "safe" confirmation. Ethereum takes ~12 seconds per block. NEAR confirms your transaction in about 1.3 seconds. That\'s faster than your card payment at a coffee shop.',
      visual: (
        <div className="space-y-2">
          {[
            { chain: 'Bitcoin', time: '~60 min', width: '100%', color: 'bg-orange-500/40' },
            { chain: 'Ethereum', time: '~12 sec', width: '15%', color: 'bg-blue-500/40' },
            { chain: 'NEAR', time: '~1.3 sec', width: '2%', color: 'bg-near-green' },
          ].map((item) => (
            <div key={item.chain} className="flex items-center gap-3">
              <span className="text-xs text-text-muted w-16 text-right">{item.chain}</span>
              <div className="flex-1 h-6 bg-surface rounded-full overflow-hidden relative">
                <motion.div
                  className={cn('h-full rounded-full', item.color)}
                  initial={{ width: 0 }}
                  animate={{ width: item.width }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Layers,
      title: 'Nightshade Sharding',
      tagline: 'Scales like the internet. Grows with demand.',
      description: 'Most blockchains are single-lane highways — everyone shares one road. NEAR uses Nightshade sharding to split the network into parallel lanes (shards). More users? Add more shards. The network scales horizontally, just like the internet itself.',
      visual: (
        <div className="space-y-2">
          <div className="text-center mb-3">
            <span className="text-xs text-text-muted">Transactions processed in parallel across shards</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="h-8 rounded bg-near-green/20 border border-near-green/30 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                <span className="text-[10px] text-near-green font-mono">S{i}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Cpu,
      title: 'Dirt-Cheap Gas Fees',
      tagline: 'Fractions of a penny. Not $50.',
      description: 'A simple transfer on NEAR costs about $0.001. That\'s a thousandth of a penny. On Ethereum, the same transaction can cost $5-50+ during peak times. NEAR makes blockchain usable for everyday applications, not just whale traders.',
      visual: (
        <div className="space-y-3">
          {[
            { chain: 'Ethereum', cost: '$5 – $50+', emoji: '🔥', note: 'varies wildly' },
            { chain: 'Solana', cost: '$0.01', emoji: '⚡', note: 'very cheap' },
            { chain: 'NEAR', cost: '$0.001', emoji: '💚', note: 'near-zero' },
          ].map((item) => (
            <div key={item.chain} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
              <div className="flex items-center gap-2">
                <span>{item.emoji}</span>
                <span className="text-sm text-text-secondary">{item.chain}</span>
              </div>
              <div className="text-right">
                <span className={cn('font-mono font-bold text-sm', item.chain === 'NEAR' ? 'text-near-green' : 'text-text-primary')}>
                  {item.cost}
                </span>
                <span className="text-[10px] text-text-muted ml-2">{item.note}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Brain,
      title: 'Built for AI',
      tagline: 'The blockchain for the AI era.',
      description: 'NEAR is positioning itself as the blockchain for AI agents. With human-readable accounts, gasless transactions via relayers, and chain signatures for cross-chain interaction, NEAR is building the infrastructure for autonomous AI agents to operate on-chain.',
      visual: (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'AI Agents', desc: 'Autonomous on-chain actors' },
            { label: 'Chain Signatures', desc: 'Sign on any chain from NEAR' },
            { label: 'Intent Relayers', desc: 'Gasless user experiences' },
            { label: 'Data Availability', desc: 'NEAR DA for rollups' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-near-green/5 border border-near-green/15">
              <div className="text-xs font-bold text-near-green mb-1">{item.label}</div>
              <div className="text-[10px] text-text-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Feature tabs */}
      <div className="flex flex-wrap gap-2">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveFeature(i)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                activeFeature === i
                  ? 'bg-near-green/10 text-near-green border border-near-green/30'
                  : 'bg-surface text-text-muted border border-border hover:border-border-hover'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{f.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active feature detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-2">
              {(() => { const Icon = features[activeFeature].icon; return <Icon className="w-5 h-5 text-near-green" />; })()}
              <h3 className="text-xl font-bold text-text-primary">{features[activeFeature].title}</h3>
            </div>
            <p className="text-near-green font-medium text-sm mb-3">{features[activeFeature].tagline}</p>
            <p className="text-text-secondary leading-relaxed mb-6">{features[activeFeature].description}</p>
            {features[activeFeature].visual}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── NEAR Stats ────────────────────────────────────────────────────────────────

function NearStats() {
  const stats = [
    { label: 'Accounts Created', value: '100M+', icon: '👤' },
    { label: 'Daily Transactions', value: '6M+', icon: '⚡' },
    { label: 'Active Validators', value: '200+', icon: '🛡️' },
    { label: 'Total Projects', value: '800+', icon: '🚀' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="text-center p-4 rounded-xl bg-surface border border-border"
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-xl font-bold text-near-green mb-1">{stat.value}</div>
          <div className="text-xs text-text-muted">{stat.label}</div>
        </motion.div>
      ))}
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

export function WhatIsNear() {
  return (
    <Container size="md">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 2 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            12 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            What is NEAR?
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            NEAR Protocol isn&apos;t just another blockchain. It&apos;s the one that was
            designed for <span className="text-near-green font-medium">humans first</span>.
          </p>
        </div>
      </ScrollReveal>

      {/* The Elevator Pitch */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-near-green/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-near-green" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">The 30-Second Pitch</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg">
            NEAR is a <span className="text-near-green font-medium">Layer 1 blockchain</span> that
            combines the security of Ethereum with the speed of Solana — while being dramatically
            easier to use. Human-readable accounts, sub-second finality, and gas fees measured in
            fractions of a penny. It&apos;s the blockchain that doesn&apos;t feel like a blockchain.
          </p>
        </Card>
      </ScrollReveal>

      {/* Live Stats */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📊 NEAR by the Numbers</h3>
          <NearStats />
        </div>
      </ScrollReveal>

      {/* Feature Deep Dive */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">
            ⚡ What Makes NEAR Special?
          </h3>
          <p className="text-sm text-text-muted mb-6">Click each feature to explore in depth.</p>
          <FeatureShowcase />
        </div>
      </ScrollReveal>

      {/* The Team */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">🧠 Who Built This?</h3>
          <Card variant="default" padding="lg">
            <p className="text-text-secondary leading-relaxed mb-4">
              NEAR was founded by <span className="text-text-primary font-medium">Illia Polosukhin</span> (co-author
              of the famous &ldquo;Attention Is All You Need&rdquo; paper that created the Transformer architecture
              powering ChatGPT) and <span className="text-text-primary font-medium">Alexander Skidanov</span> (former
              engineer at Microsoft and MemSQL).
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              The team includes world-class engineers, ICPC champions, and PhDs. NEAR isn&apos;t a meme
              coin — it&apos;s a deeply technical project built by some of the smartest people in the space.
            </p>
            <div className="p-3 rounded-lg bg-near-green/5 border border-near-green/15">
              <p className="text-sm text-near-green">
                💡 Fun fact: The &ldquo;Attention Is All You Need&rdquo; paper has been cited over 100,000 times
                and is the foundation of modern AI. NEAR&apos;s co-founder literally helped create
                the technology behind ChatGPT.
              </p>
            </div>
          </Card>
        </div>
      </ScrollReveal>

      {/* NEAR Account Model */}
      <ScrollReveal delay={0.3}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">🔑 The Account Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlowCard padding="lg">
              <h4 className="font-bold text-text-primary mb-2">Named Accounts</h4>
              <p className="text-sm text-text-secondary mb-3">
                Register a human-readable name like <code className="text-near-green">yourname.near</code>.
                No more copying hex strings. Send tokens to real names.
              </p>
              <div className="font-mono text-xs space-y-1">
                <div className="text-text-muted">Examples:</div>
                <div className="text-near-green">alice.near</div>
                <div className="text-near-green">defi-wizard.near</div>
                <div className="text-near-green">my-cool-dapp.near</div>
              </div>
            </GlowCard>
            <GlowCard padding="lg">
              <h4 className="font-bold text-text-primary mb-2">Access Keys</h4>
              <p className="text-sm text-text-secondary mb-3">
                Each account can have multiple keys with different permissions. A &ldquo;function call&rdquo;
                key can only call specific contracts — so dApps can&apos;t steal your funds.
              </p>
              <div className="font-mono text-xs space-y-1">
                <div className="text-text-muted">Key types:</div>
                <div className="text-near-green">Full Access — total control</div>
                <div className="text-accent-cyan">Function Call — limited permissions</div>
              </div>
            </GlowCard>
          </div>
        </div>
      </ScrollReveal>

      {/* Key Takeaways */}
      <ScrollReveal delay={0.35}>
        <Card variant="glass" padding="lg" className="mb-12 border-near-green/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-near-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {[
              'NEAR is a Layer 1 blockchain designed for usability, speed, and scalability.',
              'Human-readable accounts (alice.near) replace cryptographic addresses.',
              'Sub-second finality (~1.3s) and near-zero gas fees ($0.001).',
              'Nightshade sharding lets NEAR scale horizontally like the internet.',
              'Founded by the co-creator of the Transformer (the AI architecture behind ChatGPT).',
              'NEAR is building for the AI era — with support for autonomous agents and chain signatures.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-near-green mt-0.5 font-bold">→</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>

      {/* Complete */}
      <ScrollReveal delay={0.4}>
        <MarkComplete moduleSlug="what-is-near" />
      </ScrollReveal>
    </Container>
  );
}
