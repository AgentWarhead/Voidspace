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
  BookOpen, Clock, ChevronDown, CheckCircle2, Link as LinkIcon,
  Database, Shield, Users, Boxes, Lightbulb, Zap, Lock, Globe,
} from 'lucide-react';

// ─── Interactive Block Chain Visual ────────────────────────────────────────────

function BlockChainVisual() {
  const [activeBlock, setActiveBlock] = useState<number | null>(null);

  const blocks = [
    { id: 1, hash: '0x7a3f...', data: 'Alice → Bob: 5 NEAR', prevHash: '0x0000...(genesis)', time: '12:00:01' },
    { id: 2, hash: '0x9b2e...', data: 'Bob → Carol: 2 NEAR', prevHash: '0x7a3f...', time: '12:00:02' },
    { id: 3, hash: '0xc4d1...', data: 'Carol → Dave: 1 NEAR', prevHash: '0x9b2e...', time: '12:00:03' },
    { id: 4, hash: '0xf8a6...', data: 'Dave → Alice: 3 NEAR', prevHash: '0xc4d1...', time: '12:00:04' },
  ];

  return (
    <div className="relative py-8">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 overflow-x-auto pb-4">
        {blocks.map((block, i) => (
          <div key={block.id} className="flex items-center flex-shrink-0">
            <motion.div
              className={cn(
                'relative border rounded-xl p-4 w-56 cursor-pointer transition-all duration-300',
                activeBlock === block.id
                  ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 border-emerald-500/50 shadow-[0_0_20px_rgba(0,236,151,0.15)]'
                  : 'bg-surface border-border hover:border-border-hover'
              )}
              whileHover={{ scale: 1.03, y: -2 }}
              onClick={() => setActiveBlock(activeBlock === block.id ? null : block.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-near-green font-bold">Block #{block.id}</span>
                <span className="text-[10px] text-text-muted">{block.time}</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-text-muted">Hash: </span>
                  <span className="text-text-secondary">{block.hash}</span>
                </div>
                <div>
                  <span className="text-text-muted">Prev: </span>
                  <span className="text-accent-cyan/70">{block.prevHash}</span>
                </div>
                <AnimatePresence>
                  {activeBlock === block.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 border-t border-border mt-2">
                        <span className="text-text-muted">Data: </span>
                        <span className="text-near-green">{block.data}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="absolute -top-2 -right-2">
                <motion.div
                  className="w-4 h-4 rounded-full bg-near-green/20 border border-near-green/40 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-near-green" />
                </motion.div>
              </div>
            </motion.div>
            {i < blocks.length - 1 && (
              <motion.div
                className="hidden md:flex items-center mx-1"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: i * 0.2 + 0.5 }}
              >
                <div className="w-8 h-0.5 bg-gradient-to-r from-near-green/60 to-near-green/20" />
                <LinkIcon className="w-3 h-3 text-near-green/40 -mx-0.5" />
                <div className="w-8 h-0.5 bg-gradient-to-r from-near-green/20 to-near-green/60" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-text-muted mt-4">
        Click any block to reveal its transaction data →
      </p>
    </div>
  );
}

// ─── Expandable Concept Card ───────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType;
  title: string;
  preview: string;
  details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GlowCard padding="lg" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </motion.div>
          </div>
          <p className="text-sm text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">
                  {details}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GlowCard>
  );
}

// ─── Analogy Comparison ────────────────────────────────────────────────────────

function AnalogySection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card variant="default" padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/60 to-orange-500/40" />
        <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
          <span className="text-lg">🏦</span> Traditional Database
        </h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> One company controls the data</li>
          <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> Can be edited or deleted silently</li>
          <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> Single point of failure</li>
          <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> You must trust the operator</li>
        </ul>
      </Card>

      <Card variant="default" padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-near-green/60 to-accent-cyan/40" />
        <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
          <span className="text-lg">⛓️</span> Blockchain
        </h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2"><span className="text-near-green mt-0.5">✓</span> Thousands of computers share the data</li>
          <li className="flex items-start gap-2"><span className="text-near-green mt-0.5">✓</span> Records are permanent and tamper-proof</li>
          <li className="flex items-start gap-2"><span className="text-near-green mt-0.5">✓</span> No single point of failure</li>
          <li className="flex items-start gap-2"><span className="text-near-green mt-0.5">✓</span> Trust is built into the math</li>
        </ul>
      </Card>
    </div>
  );
}

// ─── Interactive Quiz ──────────────────────────────────────────────────────────

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 2;

  const options = [
    'A single super-powerful computer that stores everything',
    'A type of cryptocurrency you can buy',
    'A distributed ledger shared across many computers',
    'A new kind of social media platform',
  ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">What is a blockchain, fundamentally?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
              revealed && i === correctAnswer
                ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 border-emerald-500/50 text-emerald-400'
                : revealed && i === selected && i !== correctAnswer
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : selected === i
                    ? 'bg-surface-hover border-border-hover text-text-primary'
                    : 'bg-surface border-border text-text-secondary hover:border-border-hover'
            )}
          >
            <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'mt-4 p-3 rounded-lg text-sm',
            selected === correctAnswer
              ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 text-emerald-400 border border-emerald-500/20'
              : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
          )}
        >
          {selected === correctAnswer
            ? '✓ Correct! A blockchain is a distributed ledger — a shared record that no single entity controls.'
            : '✕ Not quite. A blockchain is a distributed ledger shared across many computers. Try reading the section above again!'}
        </motion.div>
      )}
    </Card>
  );
}

// ─── Mark as Complete ──────────────────────────────────────────────────────────

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
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        variant={completed ? 'secondary' : 'primary'}
        size="lg"
        onClick={handleComplete}
        leftIcon={completed ? <CheckCircle2 className="w-5 h-5" /> : undefined}
        className={completed ? 'border-near-green/30 text-near-green' : ''}
      >
        {completed ? 'Module Completed ✓' : 'Mark as Complete'}
      </Button>
    </motion.div>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

export function WhatIsBlockchain() {
  return (
    <Container size="md">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 1 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            15 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            What is Blockchain?
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Before you build on NEAR, you need to understand the foundation.
            Think of this as understanding electricity before building a circuit.
          </p>
        </div>
      </ScrollReveal>

      {/* The Big Idea */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg">
            Imagine a <span className="text-near-green font-medium">Google Doc that the entire world can see</span>,
            but <span className="text-text-primary font-medium">nobody can delete or edit past entries</span>.
            Every change is recorded forever, verified by thousands of computers,
            and nobody — not even the creator — can tamper with the history.
          </p>
          <p className="text-text-secondary leading-relaxed mt-3 text-lg">
            That&apos;s a blockchain. A <span className="text-near-green font-medium">shared, permanent, trustless record</span> of
            everything that has ever happened on the network.
          </p>
        </Card>
      </ScrollReveal>

      {/* Visual: Blockchain */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">
            🔗 See How Blocks Connect
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Each block contains transactions and a reference to the previous block — forming an unbreakable chain.
          </p>
          <BlockChainVisual />
        </div>
      </ScrollReveal>

      {/* Analogy Section */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            🏦 Old World vs. New World
          </h3>
          <AnalogySection />
        </div>
      </ScrollReveal>

      {/* Core Concepts */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            🧩 Core Concepts — Click to Expand
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <ConceptCard
              icon={Database}
              title="Distributed Ledger"
              preview="A shared record spread across thousands of computers worldwide."
              details="Instead of one bank holding your records, thousands of computers (called nodes) each hold an identical copy. If one goes down, the others keep running. If one tries to cheat, the others reject the change. This is what makes blockchain unstoppable."
            />
            <ConceptCard
              icon={Users}
              title="Consensus"
              preview="How the network agrees on what's true without a central authority."
              details="Every blockchain has a 'consensus mechanism' — a set of rules for how nodes agree. Bitcoin uses Proof of Work (mining). NEAR uses Proof of Stake — validators lock up tokens as a guarantee of honesty. If they cheat, they lose their stake. It's trust through economic incentives."
            />
            <ConceptCard
              icon={Lock}
              title="Immutability"
              preview="Once recorded, data cannot be changed or deleted. Ever."
              details="Each block contains a cryptographic hash of the previous block. Changing any data would change the hash, breaking the chain. To alter one block, you'd need to re-compute every block after it AND convince over half the network to accept your version. Practically impossible."
            />
            <ConceptCard
              icon={Boxes}
              title="Blocks & Transactions"
              preview="Transactions are grouped into blocks, blocks form the chain."
              details="When you send tokens, your transaction joins a pool of pending transactions. Validators select transactions, bundle them into a block, verify them, and add the block to the chain. On NEAR, this happens every ~1 second. Each block is timestamped and linked to the one before it."
            />
            <ConceptCard
              icon={Globe}
              title="Decentralization"
              preview="No single entity controls the network. Power is distributed."
              details="Traditional systems have a single point of control — and failure. A bank can freeze your account. A server can go down. With blockchain, there's no CEO, no headquarters, no kill switch. The network is run by its participants, governed by code, and open for anyone to join."
            />
            <ConceptCard
              icon={Shield}
              title="Cryptography"
              preview="Math-based security that protects your identity and transactions."
              details="Every user has a pair of cryptographic keys: a public key (like your email address — share it freely) and a private key (like your password — never share it). When you sign a transaction with your private key, the network can verify it was really you, without you ever revealing the key."
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Real World Uses */}
      <ScrollReveal delay={0.3}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">🌍 Why Does This Matter?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { emoji: '💸', title: 'Money Without Banks', desc: 'Send value anywhere in the world, 24/7, without intermediaries. Settle in seconds, not days.' },
              { emoji: '📜', title: 'Ownership Without Lawyers', desc: 'Prove you own a digital asset, a domain, or a piece of art — with cryptographic certainty.' },
              { emoji: '🤖', title: 'Automation Without Trust', desc: 'Smart contracts execute automatically when conditions are met. No need to trust a middleman.' },
            ].map((item) => (
              <Card key={item.title} variant="default" padding="lg" hover>
                <div className="text-2xl mb-3">{item.emoji}</div>
                <h4 className="font-semibold text-text-primary mb-2">{item.title}</h4>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Quiz */}
      <ScrollReveal delay={0.35}>
        <div className="mb-12">
          <MiniQuiz />
        </div>
      </ScrollReveal>

      {/* Key Takeaways */}
      <ScrollReveal delay={0.4}>
        <Card variant="glass" padding="lg" className="mb-12 border-near-green/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-near-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {[
              'A blockchain is a shared, permanent record spread across thousands of computers.',
              'No single entity controls it — trust is built into the math.',
              'Transactions are grouped into blocks, linked by cryptographic hashes.',
              'Data on a blockchain is immutable — once recorded, it can\'t be changed.',
              'This technology enables trustless money, ownership, and automation.',
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
      <ScrollReveal delay={0.45}>
        <MarkComplete moduleSlug="what-is-blockchain" />
      </ScrollReveal>
    </Container>
  );
}
