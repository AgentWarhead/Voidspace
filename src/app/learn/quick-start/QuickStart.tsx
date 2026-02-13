'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Droplets,
  Send,
  Search,
  PartyPopper,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Lightbulb,
  ExternalLink,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ─── Types & Data ─────────────────────────────────────────── */

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  instructions: string[];
  proTip: string;
  link?: { url: string; label: string };
  illustration: { emoji: string; bg: string };
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Create a Testnet Wallet',
    subtitle: 'Your NEAR identity starts here',
    icon: Wallet,
    instructions: [
      'Go to the NEAR testnet wallet and click "Create Account"',
      'Choose a human-readable name like yourname.testnet',
      'Save your seed phrase securely — this is your recovery key',
      'Your wallet is ready! You now have a NEAR testnet account',
    ],
    proTip: 'NEAR uses human-readable account names instead of hex addresses. Your account is like your-name.testnet — easy to remember and share.',
    link: { url: 'https://wallet.testnet.near.org', label: 'Open Testnet Wallet' },
    illustration: { emoji: '👛', bg: 'from-near-green/20 to-accent-cyan/20' },
  },
  {
    id: 2,
    title: 'Get Testnet NEAR',
    subtitle: 'Free tokens for experimenting',
    icon: Droplets,
    instructions: [
      'Visit the NEAR testnet faucet',
      'Enter your testnet account name (e.g. yourname.testnet)',
      'Click "Request Tokens" to receive free testnet NEAR',
      'Check your wallet — you should see testnet NEAR arrive within seconds',
    ],
    proTip: 'Testnet NEAR has no real value — it\'s for learning and testing. You can request more anytime you need it.',
    link: { url: 'https://near-faucet.io', label: 'Open NEAR Faucet' },
    illustration: { emoji: '💧', bg: 'from-accent-cyan/20 to-purple-400/20' },
  },
  {
    id: 3,
    title: 'Make Your First Transfer',
    subtitle: 'Send tokens on-chain',
    icon: Send,
    instructions: [
      'In your wallet, click "Send" or "Transfer"',
      'Enter a recipient address (try: voidspace.testnet)',
      'Enter a small amount (e.g. 1 NEAR)',
      'Confirm the transaction — it finalizes in about 1 second',
    ],
    proTip: 'NEAR transactions cost a fraction of a cent in gas fees and finalize in ~1.2 seconds. Try it — you\'ll feel the speed difference from other chains.',
    illustration: { emoji: '⚡', bg: 'from-purple-400/20 to-accent-orange/20' },
  },
  {
    id: 4,
    title: 'See It On-Chain',
    subtitle: 'Explore your transaction on NearBlocks',
    icon: Search,
    instructions: [
      'Go to NearBlocks testnet explorer',
      'Search for your account name in the search bar',
      'Find your recent transfer transaction',
      'Click into it — explore the gas used, receipts, and status',
    ],
    proTip: 'NearBlocks is the primary block explorer for NEAR. Every transaction, account, and contract is publicly viewable. Bookmark it — you\'ll use it constantly.',
    link: { url: 'https://testnet.nearblocks.io', label: 'Open NearBlocks Testnet' },
    illustration: { emoji: '🔍', bg: 'from-accent-orange/20 to-near-green/20' },
  },
  {
    id: 5,
    title: 'You\'re On-Chain! 🎉',
    subtitle: 'Welcome to the NEAR ecosystem',
    icon: PartyPopper,
    instructions: [
      'You\'ve created a wallet, funded it, made a transfer, and verified it on-chain',
      'You now understand the basics of NEAR: named accounts, fast finality, and low fees',
      'This foundation applies to everything else — dApps, smart contracts, DeFi, NFTs',
      'Ready for more? Dive into the learning tracks below',
    ],
    proTip: 'Share your achievement! You completed your first NEAR transaction. Most developers never get past "reading about it." You actually did it.',
    illustration: { emoji: '🚀', bg: 'from-near-green/20 to-accent-cyan/20' },
  },
];

const STORAGE_KEY = 'voidspace-quickstart-progress';

function loadStepProgress(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return new Set(JSON.parse(data));
  } catch { /* ignore */ }
  return new Set();
}

function saveStepProgress(completed: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
  } catch { /* ignore */ }
}

/* ─── Progress Bar ─────────────────────────────────────────── */

function StepProgressBar({ currentStep, completedSteps }: { currentStep: number; completedSteps: Set<number> }) {
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const isActive = step.id === currentStep;
        const isCompleted = completedSteps.has(step.id);
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-all flex-shrink-0',
              isCompleted ? 'border-near-green bg-near-green/20 text-near-green' :
              isActive ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan ring-2 ring-accent-cyan/30' :
              'border-border bg-surface text-text-muted'
            )}>
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.id}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-1',
                isCompleted ? 'bg-near-green/50' : 'bg-border/50'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function QuickStart() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => loadStepProgress());
  const [direction, setDirection] = useState(1);

  useEffect(() => { saveStepProgress(completedSteps); }, [completedSteps]);

  const step = STEPS.find(s => s.id === currentStep)!;
  const isLastStep = currentStep === STEPS.length;
  const allDone = completedSteps.size === STEPS.length;
  const StepIcon = step.icon;

  const goNext = () => {
    if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const markComplete = () => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(currentStep);
      return next;
    });
    if (!isLastStep) goNext();
  };

  const resetProgress = () => {
    setCompletedSteps(new Set());
    setCurrentStep(1);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -100 : 100, opacity: 0 }),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          <GradientText>Your First Transaction in 3 Minutes</GradientText>
        </h1>
        <p className="text-text-secondary text-sm">
          A hands-on walkthrough to get you on-chain. No code required.
        </p>
      </div>

      {/* Progress Bar */}
      <StepProgressBar currentStep={currentStep} completedSteps={completedSteps} />

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Card variant="glass" padding="lg" className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-near-green/60 to-transparent" />

            <div className="space-y-6">
              {/* Step header */}
              <div className="flex items-start gap-4">
                <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br border border-border/30 flex-shrink-0', step.illustration.bg)}>
                  <span className="text-2xl">{step.illustration.emoji}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-near-green uppercase tracking-widest">Step {step.id} of {STEPS.length}</span>
                    {completedSteps.has(step.id) && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 px-2 py-0.5 rounded-full shadow-sm shadow-emerald-500/10">✓ Done</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">{step.title}</h2>
                  <p className="text-sm text-text-muted">{step.subtitle}</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                {step.instructions.map((instruction, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-surface/60"
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5',
                      completedSteps.has(step.id) ? 'bg-near-green/20 text-near-green' : 'bg-surface-hover text-text-muted'
                    )}>
                      {completedSteps.has(step.id) ? <CheckCircle className="w-3 h-3" /> : i + 1}
                    </div>
                    <span className="text-sm text-text-secondary leading-relaxed">{instruction}</span>
                  </motion.div>
                ))}
              </div>

              {/* External Link */}
              {step.link && (
                <a
                  href={step.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 hover:from-emerald-500/10 hover:to-cyan-500/10 transition-colors group backdrop-blur-sm"
                >
                  <ExternalLink className="w-4 h-4 text-near-green" />
                  <span className="text-sm font-medium text-near-green group-hover:underline">{step.link.label}</span>
                  <ArrowRight className="w-3 h-3 text-near-green ml-auto group-hover:translate-x-1 transition-transform" />
                </a>
              )}

              {/* Pro Tip */}
              <div className="p-4 rounded-lg bg-accent-cyan/5 border border-accent-cyan/15">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-accent-cyan" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cyan">Pro Tip</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{step.proTip}</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={goPrev}
                  disabled={currentStep === 1}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium transition-colors',
                    currentStep === 1 ? 'text-text-muted/30 cursor-not-allowed' : 'text-text-muted hover:text-text-primary'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex items-center gap-3">
                  {!completedSteps.has(step.id) && (
                    <button
                      onClick={markComplete}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:from-emerald-500/30 hover:to-cyan-500/30 transition-colors shadow-lg shadow-emerald-500/10"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </button>
                  )}
                  {!isLastStep && (
                    <Button variant="primary" size="md" onClick={goNext} className="group">
                      Next Step <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Completion Celebration */}
      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlowCard className="p-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🎉
            </motion.div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              You&apos;re On-Chain!
            </h3>
            <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
              You&apos;ve completed the Quick Start. You understand wallets, tokens, transfers, and block explorers. Ready to go deeper?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/learn#learning-tracks">
                <Button variant="primary" size="md" className="group">
                  Explore Learning Tracks <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/sanctum">
                <Button variant="secondary" size="md" className="group">
                  <Sparkles className="w-4 h-4 mr-1" /> Try Sanctum AI
                </Button>
              </Link>
              <button
                onClick={resetProgress}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-red-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </GlowCard>
        </motion.div>
      )}

      {/* What's Next */}
      {!allDone && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: 'Learning Tracks', desc: '4 structured paths from explorer to founder', href: '/learn#learning-tracks', emoji: '📚' },
            { title: 'Sanctum AI', desc: 'Build smart contracts with AI assistance', href: '/sanctum', emoji: '🤖' },
            { title: 'Skill Tree', desc: 'Track your progress across all modules', href: '/profile/skills', emoji: '🌟' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="block group">
              <div className="p-4 rounded-lg bg-surface/60 border border-border/50 hover:border-near-green/30 hover:bg-surface-hover transition-all">
                <span className="text-lg">{item.emoji}</span>
                <h4 className="text-sm font-bold text-text-primary group-hover:text-near-green transition-colors mt-1">{item.title}</h4>
                <p className="text-[10px] text-text-muted mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
