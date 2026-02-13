'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  BookOpen, Clock, CheckCircle2, Trophy,
  Code, Zap, ArrowRight, Sparkles, Rocket,
  Globe, Brain, Target,
} from 'lucide-react';

// ─── Progress Summary ──────────────────────────────────────────────────────────

function ProgressSummary() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      setCompletedModules(Object.keys(progress).filter(k => progress[k]));
    } catch { /* noop */ }
  }, []);

  const modules = [
    'what-is-blockchain', 'what-is-near', 'create-a-wallet', 'your-first-transaction',
    'understanding-dapps', 'reading-smart-contracts', 'near-ecosystem-tour',
    'near-vs-other-chains', 'reading-the-explorer', 'defi-basics', 'choose-your-path',
  ];

  const moduleLabels: Record<string, string> = {
    'what-is-blockchain': 'What is Blockchain?',
    'what-is-near': 'What is NEAR?',
    'create-a-wallet': 'Create a Wallet',
    'your-first-transaction': 'Your First Transaction',
    'understanding-dapps': 'Understanding dApps',
    'reading-smart-contracts': 'Reading Smart Contracts',
    'near-ecosystem-tour': 'NEAR Ecosystem Tour',
    'near-vs-other-chains': 'NEAR vs Other Chains',
    'reading-the-explorer': 'Reading the Explorer',
    'defi-basics': 'DeFi Basics',
    'choose-your-path': 'Choose Your Path',
  };

  const completedCount = completedModules.length;
  const totalModules = modules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  return (
    <Card variant="glass" padding="lg" className="border-near-green/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary flex items-center gap-2">
          <Trophy className="w-5 h-5 text-near-green" />
          Your Progress
        </h3>
        <span className="text-sm font-mono text-near-green font-bold">{progressPercent}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-surface rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-near-green to-accent-cyan rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="text-sm text-text-muted mb-4">
        {completedCount}/{totalModules} modules completed
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {modules.map((mod) => {
          const isComplete = completedModules.includes(mod);
          return (
            <div
              key={mod}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm',
                isComplete
                  ? 'bg-near-green/5 border-near-green/20 text-near-green'
                  : 'bg-surface border-border text-text-muted'
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
              )}
              <span className="truncate">{moduleLabels[mod]}</span>
            </div>
          );
        })}
      </div>

      {completedCount === totalModules && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 rounded-lg bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 border border-emerald-500/30 text-center shadow-lg shadow-emerald-500/10"
        >
          <div className="text-2xl mb-2">🏆</div>
          <p className="text-near-green font-bold">Explorer Track Complete!</p>
          <p className="text-xs text-text-muted mt-1">You&apos;ve mastered the fundamentals. Time to build.</p>
        </motion.div>
      )}
    </Card>
  );
}

// ─── Self Assessment Quiz ──────────────────────────────────────────────────────

function SelfAssessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      q: 'How comfortable are you with blockchain concepts?',
      options: ['Still confused', 'Getting there', 'Pretty solid', 'I could teach it'],
      scores: [1, 2, 3, 4],
    },
    {
      q: 'Have you used a NEAR wallet?',
      options: ['Not yet', 'Created one', 'Made transactions', 'Use it regularly'],
      scores: [1, 2, 3, 4],
    },
    {
      q: 'Can you read a smart contract on NearBlocks?',
      options: ['What\'s NearBlocks?', 'I can find accounts', 'I can read methods', 'I can analyze contracts'],
      scores: [1, 2, 3, 4],
    },
    {
      q: 'What interests you most?',
      options: ['Just learning', 'Using DeFi', 'Building dApps', 'Deep protocol hacking'],
      scores: [1, 2, 3, 4],
    },
  ];

  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const allAnswered = Object.keys(answers).length === questions.length;

  const getRecommendation = () => {
    if (totalScore <= 6) return { track: 'Explorer', desc: 'Review the Explorer modules you haven\'t completed.', icon: Globe, color: 'text-near-green' };
    if (totalScore <= 10) return { track: 'Builder', desc: 'You\'re ready to start coding! The Builder Track teaches you Rust and smart contract development.', icon: Code, color: 'text-accent-cyan' };
    return { track: 'Hacker', desc: 'You\'re advanced! Jump straight to the Hacker Track for deep NEAR architecture and production patterns.', icon: Zap, color: 'text-purple-400' };
  };

  return (
    <Card variant="default" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-near-green" />
        <h3 className="font-bold text-text-primary">Self-Assessment</h3>
      </div>
      <p className="text-sm text-text-muted mb-6">
        Answer honestly — this helps us recommend your next track.
      </p>

      <div className="space-y-6">
        {questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm text-text-secondary mb-2 font-medium">{qi + 1}. {q.q}</p>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => setAnswers({ ...answers, [qi]: q.scores[oi] })}
                  className={cn(
                    'px-3 py-2 rounded-lg border text-xs text-left transition-all',
                    answers[qi] === q.scores[oi]
                      ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-surface border-border text-text-muted hover:border-border-hover'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allAnswered && (
        <div className="mt-6">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowResult(true)}
            className="w-full"
          >
            See My Recommendation
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showResult && allAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {(() => {
              const rec = getRecommendation();
              const Icon = rec.icon;
              return (
                <div className="mt-6 p-4 rounded-lg bg-near-green/5 border border-near-green/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={cn('w-6 h-6', rec.color)} />
                    <h4 className="font-bold text-text-primary">
                      Recommended: <span className={rec.color}>{rec.track} Track</span>
                    </h4>
                  </div>
                  <p className="text-sm text-text-secondary">{rec.desc}</p>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Next Steps ────────────────────────────────────────────────────────────────

function NextSteps() {
  const tracks = [
    {
      title: 'Builder Track',
      subtitle: 'Learn to code smart contracts',
      icon: Code,
      color: 'text-accent-cyan',
      borderColor: 'border-accent-cyan/30',
      bgColor: 'bg-accent-cyan/10',
      description: 'Set up your dev environment, learn Rust, build and deploy smart contracts, and ship a real dApp to mainnet.',
      duration: '~20 hours',
      modules: 12,
      href: '/learn#tracks',
    },
    {
      title: 'Hacker Track',
      subtitle: 'Deep protocol knowledge',
      icon: Zap,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-500/10',
      description: 'Cross-contract calls, advanced storage, chain signatures, AI agent integration, and production patterns.',
      duration: '~8 hours',
      modules: 6,
      href: '/learn#tracks',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tracks.map((track) => {
        const Icon = track.icon;
        return (
          <Link key={track.title} href={track.href}>
            <GlowCard padding="lg" className="h-full">
              <div className="flex items-start gap-3 mb-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center border', track.bgColor, track.borderColor)}>
                  <Icon className={cn('w-5 h-5', track.color)} />
                </div>
                <div>
                  <h4 className={cn('font-bold', track.color)}>{track.title}</h4>
                  <p className="text-xs text-text-muted">{track.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-3">{track.description}</p>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {track.duration}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {track.modules} modules</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm text-near-green font-medium">
                Start Track <ArrowRight className="w-4 h-4" />
              </div>
            </GlowCard>
          </Link>
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
        {completed ? 'Explorer Track Completed! 🏆' : 'Complete Explorer Track'}
      </Button>
    </div>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

export function ChooseYourPath() {
  return (
    <Container size="md">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 11 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            8 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Path
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            You&apos;ve explored the void. You understand blockchain, NEAR, wallets, dApps, and DeFi.
            Now it&apos;s time to <span className="text-near-green font-medium">choose your destiny</span>.
          </p>
        </div>
      </ScrollReveal>

      {/* Celebration */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            You&apos;ve Come So Far
          </h2>
          <p className="text-text-secondary leading-relaxed max-w-lg mx-auto">
            From &ldquo;what is a blockchain?&rdquo; to reading smart contracts, understanding DeFi,
            and navigating the NEAR ecosystem. You&apos;re no longer a beginner —
            you&apos;re an <span className="text-near-green font-medium">Explorer</span>.
          </p>
        </Card>
      </ScrollReveal>

      {/* What You Learned */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📚 What You Learned</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { emoji: '⛓️', skill: 'Blockchain fundamentals' },
              { emoji: '💚', skill: 'NEAR Protocol architecture' },
              { emoji: '👛', skill: 'Wallet creation & security' },
              { emoji: '💸', skill: 'Sending transactions' },
              { emoji: '📱', skill: 'Understanding dApps' },
              { emoji: '📋', skill: 'Reading smart contracts' },
              { emoji: '🗺️', skill: 'NEAR ecosystem navigation' },
              { emoji: '⚖️', skill: 'Cross-chain comparison' },
              { emoji: '🔍', skill: 'Block explorer proficiency' },
              { emoji: '💰', skill: 'DeFi basics' },
            ].map((item) => (
              <div key={item.skill} className="flex items-center gap-3 p-3 rounded-lg bg-near-green/5 border border-near-green/15">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm text-text-secondary">{item.skill}</span>
                <CheckCircle2 className="w-4 h-4 text-near-green ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Progress Summary */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <ProgressSummary />
        </div>
      </ScrollReveal>

      {/* Self Assessment */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <SelfAssessment />
        </div>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal delay={0.3}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">🚀 Your Next Adventure</h3>
          <NextSteps />
        </div>
      </ScrollReveal>

      {/* Call to Action */}
      <ScrollReveal delay={0.35}>
        <Card variant="glass" padding="lg" className="mb-12 text-center border-near-green/20">
          <Rocket className="w-8 h-8 text-near-green mx-auto mb-3" />
          <h3 className="text-xl font-bold text-text-primary mb-2">Ready to Build?</h3>
          <p className="text-text-secondary mb-4">
            The NEAR ecosystem needs builders. Grants are available. The community is waiting.
            Your journey starts now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sanctum">
              <Button variant="primary" size="lg" leftIcon={<Brain className="w-5 h-5" />}>
                Enter the Sanctum
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button variant="secondary" size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
                Explore Opportunities
              </Button>
            </Link>
          </div>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <MarkComplete moduleSlug="choose-your-path" />
      </ScrollReveal>
    </Container>
  );
}
