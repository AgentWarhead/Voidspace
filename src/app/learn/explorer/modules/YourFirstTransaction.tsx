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
  BookOpen, Clock, CheckCircle2, ArrowRight,
  Fuel, ArrowDown, Shield,
} from 'lucide-react';

// ─── Transaction Flow Simulator ────────────────────────────────────────────────

function TransactionSimulator() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Initiate Transfer',
      description: 'Alice wants to send 5 NEAR to Bob',
      visual: (
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 flex items-center justify-center mb-2 mx-auto shadow-lg shadow-green-500/10 backdrop-blur-sm">
              <span className="text-lg">👩</span>
            </div>
            <span className="text-xs text-text-secondary">alice.near</span>
            <div className="text-xs text-near-green font-mono mt-1">50 NEAR</div>
          </div>
          <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowRight className="w-6 h-6 text-near-green" />
          </motion.div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-surface border-2 border-border flex items-center justify-center mb-2 mx-auto">
              <span className="text-lg">👨</span>
            </div>
            <span className="text-xs text-text-secondary">bob.near</span>
            <div className="text-xs text-text-muted font-mono mt-1">10 NEAR</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Sign & Broadcast',
      description: 'Alice signs with her private key. The transaction enters the mempool.',
      visual: (
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-lg bg-surface border border-border font-mono text-xs text-text-muted w-full">
            <div>from: <span className="text-near-green">alice.near</span></div>
            <div>to: <span className="text-accent-cyan">bob.near</span></div>
            <div>amount: <span className="text-text-primary">5 NEAR</span></div>
            <div>gas: <span className="text-text-muted">~0.0001 NEAR</span></div>
            <div className="mt-2 pt-2 border-t border-border">
              signature: <span className="text-near-green">✓ valid</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Validator Processing',
      description: 'Validators verify the transaction and include it in the next block.',
      visual: (
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 flex items-center justify-center shadow-lg shadow-green-500/10 backdrop-blur-sm"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
            >
              <Shield className="w-4 h-4 text-near-green" />
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: 'Confirmed!',
      description: '~1.3 seconds later, the transaction is confirmed and irreversible.',
      visual: (
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 flex items-center justify-center mb-2 mx-auto shadow-lg shadow-green-500/10 backdrop-blur-sm">
              <span className="text-lg">👩</span>
            </div>
            <span className="text-xs text-text-secondary">alice.near</span>
            <div className="text-xs text-orange-400 font-mono mt-1">45 NEAR</div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <CheckCircle2 className="w-8 h-8 text-near-green" />
          </motion.div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 flex items-center justify-center mb-2 mx-auto shadow-lg shadow-green-500/10 backdrop-blur-sm">
              <span className="text-lg">👨</span>
            </div>
            <span className="text-xs text-text-secondary">bob.near</span>
            <div className="text-xs text-near-green font-mono mt-1">15 NEAR</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-text-primary">🔄 Transaction Flow</h3>
        <span className="text-xs font-mono text-text-muted">Step {step + 1}/{steps.length}</span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 mb-6">
        {steps.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-surface">
            <motion.div
              className="h-full bg-near-green"
              initial={{ width: '0%' }}
              animate={{ width: i <= step ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div>
            <h4 className="text-lg font-bold text-near-green mb-1">{steps[step].title}</h4>
            <p className="text-sm text-text-secondary">{steps[step].description}</p>
          </div>
          <div className="py-6">{steps[step].visual}</div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          ← Previous
        </Button>
        <Button
          variant={step === steps.length - 1 ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setStep(step === steps.length - 1 ? 0 : step + 1)}
        >
          {step === steps.length - 1 ? '↻ Replay' : 'Next →'}
        </Button>
      </div>
    </Card>
  );
}

// ─── Gas Fee Explainer ─────────────────────────────────────────────────────────

function GasFeeExplainer() {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <GlowCard padding="lg" onClick={() => setShowDetail(!showDetail)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
          <Fuel className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-text-primary mb-1">Gas Fees on NEAR</h4>
          <p className="text-sm text-text-secondary">
            Every transaction costs a tiny amount of gas. On NEAR, this is measured in
            <span className="text-near-green font-medium"> TGas</span> (TeraGas).
          </p>

          <AnimatePresence>
            {showDetail && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-surface border border-border text-center">
                      <div className="text-lg font-bold text-near-green">~0.0001 Ⓝ</div>
                      <div className="text-[10px] text-text-muted">Simple transfer</div>
                    </div>
                    <div className="p-3 rounded-lg bg-surface border border-border text-center">
                      <div className="text-lg font-bold text-near-green">~0.001 Ⓝ</div>
                      <div className="text-[10px] text-text-muted">Contract call</div>
                    </div>
                    <div className="p-3 rounded-lg bg-surface border border-border text-center">
                      <div className="text-lg font-bold text-near-green">~0.01 Ⓝ</div>
                      <div className="text-[10px] text-text-muted">Complex operation</div>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted">
                    💡 30% of gas fees are burned (reducing supply), and 70% go to the contract being called.
                    On NEAR, gas fees don&apos;t fluctuate wildly — they&apos;re predictable and tiny.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GlowCard>
  );
}

// ─── Step by Step Guide ────────────────────────────────────────────────────────

function StepByStepGuide() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: 'Open Your Wallet',
      desc: 'Open Meteor Wallet, MyNearWallet, or HERE Wallet',
      detail: 'Make sure you\'re connected to testnet if you\'re practicing. You should see your account name and balance at the top.',
    },
    {
      number: '02',
      title: 'Click "Send"',
      desc: 'Find the send/transfer button in your wallet',
      detail: 'Most wallets have a prominent "Send" button on the main dashboard. It might also be called "Transfer" or show an arrow icon.',
    },
    {
      number: '03',
      title: 'Enter Recipient',
      desc: 'Type the NEAR account name (e.g., friend.testnet)',
      detail: 'On NEAR, you send to human-readable names like "bob.near" on mainnet or "bob.testnet" on testnet. No hex addresses needed!',
    },
    {
      number: '04',
      title: 'Enter Amount',
      desc: 'Enter the amount of NEAR to send',
      detail: 'Start small — try sending 0.1 NEAR. You\'ll see the gas fee estimated below (usually < 0.001 NEAR). The total will be amount + gas.',
    },
    {
      number: '05',
      title: 'Review & Confirm',
      desc: 'Double-check everything before signing',
      detail: 'Verify: correct recipient, correct amount, acceptable gas fee. Once confirmed, your wallet will sign the transaction with your key and broadcast it.',
    },
    {
      number: '06',
      title: 'Check on Explorer',
      desc: 'View your transaction on NearBlocks',
      detail: 'Go to nearblocks.io and search for your account name. You\'ll see the transaction with its hash, timestamp, block number, and status. Bookmark this — you\'ll use it a lot!',
    },
  ];

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <button
            onClick={() => setExpandedStep(expandedStep === i ? null : i)}
            className={cn(
              'w-full text-left p-4 rounded-xl border transition-all',
              expandedStep === i
                ? 'bg-near-green/5 border-near-green/30'
                : 'bg-surface border-border hover:border-border-hover'
            )}
          >
            <div className="flex items-center gap-4">
              <span className="text-near-green font-mono text-sm font-bold w-6">{step.number}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary text-sm">{step.title}</h4>
                <p className="text-xs text-text-muted">{step.desc}</p>
              </div>
              <motion.div animate={{ rotate: expandedStep === i ? 180 : 0 }}>
                <ArrowDown className="w-4 h-4 text-text-muted" />
              </motion.div>
            </div>
            <AnimatePresence>
              {expandedStep === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 pt-3 border-t border-border text-sm text-text-secondary">
                    {step.detail}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
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

export function YourFirstTransaction() {
  return (
    <Container size="md">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 4 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            10 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            Your First Transaction
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Time to make it real. Send your first on-chain transaction
            and <span className="text-near-green font-medium">feel the power of trustless transfers</span>.
          </p>
        </div>
      </ScrollReveal>

      {/* What happens when you send */}
      <ScrollReveal delay={0.1}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">🔄 What Actually Happens?</h3>
          <p className="text-sm text-text-muted mb-6">
            Step through the lifecycle of a NEAR transaction — from initiation to confirmation.
          </p>
          <TransactionSimulator />
        </div>
      </ScrollReveal>

      {/* Gas Fees */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">⛽ Understanding Gas</h3>
          <GasFeeExplainer />
        </div>
      </ScrollReveal>

      {/* Step by Step */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">📋 Send Your First Transfer</h3>
          <p className="text-sm text-text-muted mb-6">Click each step to expand the details.</p>
          <StepByStepGuide />
        </div>
      </ScrollReveal>

      {/* Pro Tips */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">💡 Pro Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { emoji: '🧪', title: 'Practice on Testnet', desc: 'Use testnet first. Free tokens, zero risk. Get comfortable before touching real money.' },
              { emoji: '🔍', title: 'Bookmark NearBlocks', desc: 'nearblocks.io is your blockchain detective tool. Check any transaction, account, or contract.' },
              { emoji: '📋', title: 'Double-Check Names', desc: 'Always verify the recipient name. NEAR transactions are irreversible once confirmed.' },
              { emoji: '⚡', title: 'Speed Is Normal', desc: 'Confirmation in ~1.3 seconds isn\'t a bug — it\'s a feature. NEAR is just that fast.' },
            ].map((tip) => (
              <Card key={tip.title} variant="default" padding="md" hover>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{tip.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-text-primary text-sm mb-1">{tip.title}</h4>
                    <p className="text-xs text-text-secondary">{tip.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
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
              'A transaction is signed by your private key and verified by validators.',
              'NEAR transactions confirm in ~1 second — near-instant finality.',
              'Gas fees on NEAR are tiny (~0.0001 NEAR for a simple transfer).',
              '30% of gas is burned, 70% goes to the contract developer.',
              'Always verify the recipient name before confirming — transactions are irreversible.',
              'Use NearBlocks to view and verify any transaction on the network.',
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
        <MarkComplete moduleSlug="your-first-transaction" />
      </ScrollReveal>
    </Container>
  );
}
