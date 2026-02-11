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
  BookOpen, Clock, CheckCircle2, ChevronDown,
  Eye, Code, Key, FileText, Lock,
  Search, AlertTriangle,
} from 'lucide-react';

// ─── Contract Anatomy ──────────────────────────────────────────────────────────

function ContractAnatomy() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      label: 'Contract Address',
      icon: '📍',
      description: 'Every smart contract lives at a NEAR account address.',
      example: 'ref-finance.near',
      detail: 'This is the account where the code is deployed. On NearBlocks, you can search for this address and see all its activity, code hash, and state.',
    },
    {
      label: 'Methods',
      icon: '⚙️',
      description: 'Functions the contract exposes. Some read data, others change state.',
      example: 'swap(), get_pools(), add_liquidity()',
      detail: 'View methods (read-only) are free to call. Change methods (write) require gas and a signature. On NearBlocks, go to Contract → Methods to see all available functions.',
    },
    {
      label: 'State',
      icon: '💾',
      description: 'Data stored on-chain by the contract.',
      example: 'Pool balances, user positions, configs',
      detail: 'Smart contracts can store data on the blockchain. This state is permanent and publicly readable. On NearBlocks, go to Contract → State to browse key-value pairs.',
    },
    {
      label: 'Access Keys',
      icon: '🔑',
      description: 'Keys that control who can interact with the contract.',
      example: 'Full Access, Function Call keys',
      detail: 'Contracts can have their full access key deleted — making them immutable (no one can change the code). Function call keys allow specific interactions. Check Access Keys tab on NearBlocks.',
    },
    {
      label: 'Transaction History',
      icon: '📜',
      description: 'Every interaction with the contract is recorded forever.',
      example: 'Swaps, deposits, withdrawals — all public',
      detail: 'Go to the Transactions tab on NearBlocks for any contract. You can see who called what method, when, and with what arguments. Total transparency.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {sections.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActiveSection(i)}
            className={cn(
              'p-3 rounded-lg border text-center transition-all',
              activeSection === i
                ? 'bg-near-green/10 border-near-green/30'
                : 'bg-surface border-border hover:border-border-hover'
            )}
          >
            <div className="text-lg mb-1">{s.icon}</div>
            <div className={cn('text-xs font-medium', activeSection === i ? 'text-near-green' : 'text-text-muted')}>
              {s.label}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <Card variant="glass" padding="lg">
            <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
              <span>{sections[activeSection].icon}</span>
              {sections[activeSection].label}
            </h4>
            <p className="text-sm text-text-secondary mb-3">{sections[activeSection].description}</p>
            <div className="p-3 rounded-lg bg-surface border border-border mb-3">
              <code className="text-xs text-near-green font-mono">{sections[activeSection].example}</code>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{sections[activeSection].detail}</p>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── NearBlocks Walkthrough ────────────────────────────────────────────────────

function NearBlocksWalkthrough() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Search for a Contract',
      instruction: 'Go to nearblocks.io and type "ref-finance.near" in the search bar.',
      tip: 'You can search any account or transaction hash.',
    },
    {
      title: 'View the Overview',
      instruction: 'See the account balance, creation date, and transaction count at a glance.',
      tip: 'The "Type" field shows whether it\'s a regular account or a contract.',
    },
    {
      title: 'Check the Contract Tab',
      instruction: 'Click the "Contract" tab to see the deployed code, methods, and state.',
      tip: 'If the code hash changes frequently, the contract is still being updated.',
    },
    {
      title: 'Browse Methods',
      instruction: 'Expand the methods list. View methods are free to call directly from the explorer.',
      tip: 'You can actually call view methods right from NearBlocks to read contract state!',
    },
    {
      title: 'Read Transaction History',
      instruction: 'Click "Transactions" to see all past interactions — who called what, when.',
      tip: 'Each transaction shows: sender, method, args, gas used, and the result.',
    },
  ];

  return (
    <Card variant="default" padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary flex items-center gap-2">
          <Search className="w-5 h-5 text-near-green" />
          NearBlocks Walkthrough
        </h3>
        <span className="text-xs font-mono text-text-muted">{step + 1}/{steps.length}</span>
      </div>

      <div className="flex gap-2 mb-6">
        {steps.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-surface-hover">
            <motion.div
              className="h-full bg-near-green"
              animate={{ width: i <= step ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          className="space-y-3"
        >
          <h4 className="text-lg font-bold text-near-green">{steps[step].title}</h4>
          <p className="text-sm text-text-secondary">{steps[step].instruction}</p>
          <div className="p-3 rounded-lg bg-near-green/5 border border-near-green/15">
            <p className="text-xs text-near-green">💡 {steps[step].tip}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <Button variant="ghost" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          ← Back
        </Button>
        <Button
          variant={step === steps.length - 1 ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setStep(step === steps.length - 1 ? 0 : step + 1)}
        >
          {step === steps.length - 1 ? '↻ Restart' : 'Next →'}
        </Button>
      </div>
    </Card>
  );
}

// ─── Security Red Flags ────────────────────────────────────────────────────────

function SecurityRedFlags() {
  const flags = [
    {
      icon: Lock,
      title: 'No Full Access Key Deleted',
      risk: 'The deployer can change the code at any time.',
      what: 'Trusted contracts delete their full access key, making the code immutable. If the key still exists, the owner can update the contract — and potentially steal funds.',
    },
    {
      icon: Key,
      title: 'Unknown Access Keys',
      risk: 'Extra keys might grant unauthorized access.',
      what: 'Check the Access Keys tab. If there are keys you don\'t recognize, someone else might have control over the contract.',
    },
    {
      icon: Code,
      title: 'Unverified Code',
      risk: 'The deployed code doesn\'t match the open-source repo.',
      what: 'Reputable projects publish their source code. If a contract\'s code hash doesn\'t match the publicly verified version, proceed with caution.',
    },
    {
      icon: AlertTriangle,
      title: 'Recent Code Changes',
      risk: 'Frequent updates might indicate instability — or malicious intent.',
      what: 'Check when the contract was last updated. A DeFi contract that changes code frequently might be rugging users. Stable protocols rarely change core contracts.',
    },
  ];

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {flags.map((flag, i) => {
        const Icon = flag.icon;
        return (
          <GlowCard key={flag.title} padding="md" onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text-primary text-sm">{flag.title}</h4>
                  <motion.div animate={{ rotate: expanded === i ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  </motion.div>
                </div>
                <p className="text-xs text-orange-400">{flag.risk}</p>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-sm text-text-muted mt-2 pt-2 border-t border-border overflow-hidden"
                    >
                      {flag.what}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </GlowCard>
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

export function ReadingSmartContracts() {
  return (
    <Container size="md">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 6 of 11
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            15 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            Reading Smart Contracts
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            You don&apos;t need to <em>write</em> code to understand it.
            Learn to <span className="text-near-green font-medium">read the rules</span> that govern
            the decentralized world.
          </p>
        </div>
      </ScrollReveal>

      {/* What is a Smart Contract */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-near-green/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-near-green" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">What is a Smart Contract?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            A smart contract is a <span className="text-near-green font-medium">program that lives on the blockchain</span>.
            It&apos;s like a vending machine — put in the right input, get the guaranteed output.
            No negotiation, no intermediary, no trust required.
          </p>
          <p className="text-text-muted text-sm">
            On NEAR, smart contracts are written in Rust or JavaScript and compiled to WebAssembly (Wasm).
            They run on every validator node, ensuring the same result everywhere.
          </p>
        </Card>
      </ScrollReveal>

      {/* Contract Anatomy */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">🔬 Anatomy of a Contract</h3>
          <p className="text-sm text-text-muted mb-6">Click each part to learn more. No coding required.</p>
          <ContractAnatomy />
        </div>
      </ScrollReveal>

      {/* NearBlocks Walkthrough */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">🔍 How to Read Contracts on NearBlocks</h3>
          <NearBlocksWalkthrough />
        </div>
      </ScrollReveal>

      {/* Security Red Flags */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">🚩 Red Flags to Watch For</h3>
          <p className="text-sm text-text-muted mb-4">Protect yourself by spotting these warning signs.</p>
          <SecurityRedFlags />
        </div>
      </ScrollReveal>

      {/* View vs Change Methods */}
      <ScrollReveal delay={0.3}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📖 View vs. Change Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="default" padding="lg" className="border-near-green/20">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-near-green" />
                <h4 className="font-bold text-near-green">View Methods</h4>
              </div>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Read-only — don&apos;t change state</li>
                <li>• Free to call (no gas fee)</li>
                <li>• No signature required</li>
                <li>• Examples: get_balance(), get_pool_info()</li>
              </ul>
            </Card>
            <Card variant="default" padding="lg" className="border-accent-cyan/20">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-accent-cyan" />
                <h4 className="font-bold text-accent-cyan">Change Methods</h4>
              </div>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Modify blockchain state</li>
                <li>• Require gas fees</li>
                <li>• Must be signed by an account</li>
                <li>• Examples: swap(), transfer(), stake()</li>
              </ul>
            </Card>
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
              'Smart contracts are programs that live on the blockchain and execute automatically.',
              'You can inspect any contract on NearBlocks — methods, state, transactions, access keys.',
              'View methods are free and read-only. Change methods modify state and cost gas.',
              'Watch for red flags: undeleted full access keys, unverified code, frequent changes.',
              'Reading contracts is a superpower — it lets you verify trust instead of blindly trusting.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-near-green mt-0.5 font-bold">→</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <MarkComplete moduleSlug="reading-smart-contracts" />
      </ScrollReveal>
    </Container>
  );
}
