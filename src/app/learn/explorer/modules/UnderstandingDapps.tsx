'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { cn } from '@/lib/utils';
import {
  BookOpen, Clock, CheckCircle2,
  Globe, Code, Users, Layers, Shield,
  AppWindow, ArrowRight,
} from 'lucide-react';

// ─── App vs dApp Comparison ────────────────────────────────────────────────────

function AppVsDapp() {
  const [activeView, setActiveView] = useState<'app' | 'dapp'>('app');

  return (
    <div className="space-y-4">
      <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden w-fit mx-auto">
        <button
          onClick={() => setActiveView('app')}
          className={cn(
            'px-6 py-2.5 text-sm font-medium transition-all',
            activeView === 'app' ? 'bg-red-500/20 text-red-400' : 'text-text-muted hover:text-text-secondary'
          )}
        >
          Traditional App
        </button>
        <button
          onClick={() => setActiveView('dapp')}
          className={cn(
            'px-6 py-2.5 text-sm font-medium transition-all',
            activeView === 'dapp' ? 'bg-near-green/20 text-near-green' : 'text-text-muted hover:text-text-secondary'
          )}
        >
          dApp
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeView === 'app' ? (
            <Card variant="default" padding="lg" className="border-red-500/20">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🏢</div>
                <h4 className="font-bold text-text-primary text-lg">Traditional App Architecture</h4>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 w-full max-w-xs text-center">
                  <span className="text-sm text-blue-400">📱 Frontend (UI)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted rotate-90" />
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 w-full max-w-xs text-center">
                  <span className="text-sm text-orange-400">🖥️ Company Server</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted rotate-90" />
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 w-full max-w-xs text-center">
                  <span className="text-sm text-red-400">🗄️ Company Database</span>
                </div>
              </div>
              <p className="text-sm text-text-muted text-center mt-4">
                One company controls everything. They can change the rules, censor users, or shut down.
              </p>
            </Card>
          ) : (
            <Card variant="default" padding="lg" className="border-near-green/20">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🌐</div>
                <h4 className="font-bold text-text-primary text-lg">dApp Architecture</h4>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 w-full max-w-xs text-center">
                  <span className="text-sm text-blue-400">📱 Frontend (UI)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted rotate-90" />
                <div className="p-3 rounded-lg bg-near-green/10 border border-near-green/20 w-full max-w-xs text-center">
                  <span className="text-sm text-near-green">⛓️ Smart Contract (on NEAR)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted rotate-90" />
                <div className="p-3 rounded-lg bg-near-green/10 border border-near-green/20 w-full max-w-xs text-center">
                  <span className="text-sm text-near-green">🌍 Blockchain (Decentralized)</span>
                </div>
              </div>
              <p className="text-sm text-text-muted text-center mt-4">
                No single entity controls it. The code runs on the blockchain, transparent and unstoppable.
              </p>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── dApp Examples on NEAR ─────────────────────────────────────────────────────

function DappShowcase() {
  const [activeDapp, setActiveDapp] = useState(0);

  const dapps = [
    {
      name: 'Ref Finance',
      category: 'DeFi',
      emoji: '🔄',
      description: 'The main decentralized exchange (DEX) on NEAR. Swap tokens, provide liquidity, and earn yield — all without a middleman.',
      features: ['Token swaps', 'Liquidity pools', 'Yield farming', 'Multi-path routing'],
      users: '500K+',
      color: 'text-near-green',
    },
    {
      name: 'Burrow',
      category: 'Lending',
      emoji: '🏦',
      description: 'Decentralized lending and borrowing. Deposit crypto to earn interest, or borrow against your holdings. Like a bank, but transparent.',
      features: ['Lending', 'Borrowing', 'Interest earning', 'Liquidation protection'],
      users: '100K+',
      color: 'text-accent-cyan',
    },
    {
      name: 'Mintbase',
      category: 'NFTs',
      emoji: '🎨',
      description: 'Create, sell, and manage NFTs on NEAR. Low minting costs and a marketplace built for creators. AI-powered tools included.',
      features: ['NFT minting', 'Marketplace', 'AI generation', 'Royalties'],
      users: '200K+',
      color: 'text-purple-400',
    },
    {
      name: 'AstroDAO',
      category: 'DAOs',
      emoji: '🏛️',
      description: 'Create and manage decentralized organizations. Vote on proposals, manage treasuries, and coordinate communities on-chain.',
      features: ['Governance', 'Treasury management', 'Voting', 'Custom policies'],
      users: '50K+',
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {dapps.map((d, i) => (
          <button
            key={d.name}
            onClick={() => setActiveDapp(i)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all',
              activeDapp === i
                ? 'bg-near-green/10 border border-near-green/30 text-near-green'
                : 'bg-surface border border-border text-text-muted hover:border-border-hover'
            )}
          >
            <span>{d.emoji}</span>
            {d.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeDapp}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{dapps[activeDapp].emoji}</span>
              <div>
                <h4 className="font-bold text-text-primary">{dapps[activeDapp].name}</h4>
                <span className={cn('text-xs font-medium', dapps[activeDapp].color)}>
                  {dapps[activeDapp].category}
                </span>
              </div>
              <span className="ml-auto text-xs text-text-muted">{dapps[activeDapp].users} users</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {dapps[activeDapp].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {dapps[activeDapp].features.map((f) => (
                <span key={f} className="text-xs px-2 py-1 rounded-full bg-surface border border-border text-text-muted">
                  {f}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── What Makes It "Decentralized" ─────────────────────────────────────────────

function DecentralizationChecklist() {
  const traits = [
    { icon: Code, label: 'Open Source Code', desc: 'Anyone can inspect the smart contract. No hidden rules.', checked: true },
    { icon: Users, label: 'No Central Authority', desc: 'No company can shut it down or change the rules unilaterally.', checked: true },
    { icon: Shield, label: 'Permissionless Access', desc: 'Anyone can use it. No signup, no KYC, no gatekeeping.', checked: true },
    { icon: Layers, label: 'On-Chain Logic', desc: 'Core business logic lives on the blockchain, not a server.', checked: true },
    { icon: Globe, label: 'Censorship Resistant', desc: 'No entity can block specific users or transactions.', checked: true },
  ];

  return (
    <div className="space-y-3">
      {traits.map((trait, i) => {
        const Icon = trait.icon;
        return (
          <motion.div
            key={trait.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border"
          >
            <div className="w-8 h-8 rounded-lg bg-near-green/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-near-green" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary text-sm">{trait.label}</h4>
              <p className="text-xs text-text-muted">{trait.desc}</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-near-green flex-shrink-0" />
          </motion.div>
        );
      })}
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

export function UnderstandingDapps() {
  return (
    <Container size="md">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 5 of 11
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            12 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            Understanding dApps
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            dApps are apps that <span className="text-near-green font-medium">nobody controls</span> and
            <span className="text-near-green font-medium"> everybody can verify</span>.
            Welcome to the apps of the future.
          </p>
        </div>
      </ScrollReveal>

      {/* What makes it "decentralized" */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-near-green/10 flex items-center justify-center">
              <AppWindow className="w-4 h-4 text-near-green" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">What is a dApp?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            A <span className="text-near-green font-medium">decentralized application</span> (dApp)
            is an app where the core logic runs on a blockchain instead of a company&apos;s server.
            The frontend looks like any normal website — but under the hood, it&apos;s powered by
            smart contracts that are transparent, permissionless, and unstoppable.
          </p>
          <p className="text-text-muted text-sm">
            Think of it this way: a regular app is like renting an apartment — the landlord
            makes the rules. A dApp is like owning your home — the rules are set in code,
            and nobody can change them without consensus.
          </p>
        </Card>
      </ScrollReveal>

      {/* App vs dApp */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">⚖️ App vs. dApp Architecture</h3>
          <AppVsDapp />
        </div>
      </ScrollReveal>

      {/* Decentralization Checklist */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">✅ The Decentralization Checklist</h3>
          <p className="text-sm text-text-muted mb-4">What makes a dApp truly &ldquo;decentralized&rdquo;?</p>
          <DecentralizationChecklist />
        </div>
      </ScrollReveal>

      {/* Real dApps on NEAR */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">🚀 Real dApps on NEAR</h3>
          <p className="text-sm text-text-muted mb-6">Click to explore each project.</p>
          <DappShowcase />
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
              'A dApp runs its core logic on a blockchain via smart contracts — not company servers.',
              'The frontend looks like a normal website — the magic is in the backend.',
              'True decentralization means: open source, permissionless, censorship-resistant.',
              'NEAR hosts thriving dApps across DeFi, NFTs, DAOs, and more.',
              'dApps are transparent — anyone can verify the code and the state.',
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
        <MarkComplete moduleSlug="understanding-dapps" />
      </ScrollReveal>
    </Container>
  );
}
