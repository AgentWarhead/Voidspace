'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  AlertTriangle, ArrowRight, Shield, Globe, Network,
  Key, Layers, Lock, LinkIcon, Fingerprint,
} from 'lucide-react';

// ─── Interactive Visual: Multi-Chain Hub ────────────────────────────────────

function MultiChainHub() {
  const [activeChain, setActiveChain] = useState<number | null>(null);

  const chains = [
    {
      name: 'Ethereum',
      position: 'top',
      color: 'from-blue-500/30 to-indigo-500/30',
      border: 'border-blue-500/40',
      textColor: 'text-blue-400',
      bridge: 'Rainbow Bridge (Light Client)',
      format: 'EVM transactions, ABI-encoded',
      finality: '~12 minutes (64 blocks)',
      trust: 'Trustless — full header chain verification via light client on NEAR',
    },
    {
      name: 'Bitcoin',
      position: 'right',
      color: 'from-orange-500/30 to-yellow-500/30',
      border: 'border-orange-500/40',
      textColor: 'text-orange-400',
      bridge: 'Chain Signatures (MPC)',
      format: 'UTXO transactions, Script',
      finality: '~60 minutes (6 blocks)',
      trust: 'MPC-based — NEAR validators collectively sign BTC transactions',
    },
    {
      name: 'Aurora',
      position: 'bottom',
      color: 'from-green-500/30 to-emerald-500/30',
      border: 'border-green-500/40',
      textColor: 'text-green-400',
      bridge: 'Native (runs on NEAR)',
      format: 'EVM-compatible, deployed as NEAR contract',
      finality: '~1-2 seconds (inherits NEAR)',
      trust: 'Native — Aurora is a smart contract on NEAR, no bridge needed',
    },
    {
      name: 'Solana',
      position: 'left',
      color: 'from-purple-500/30 to-violet-500/30',
      border: 'border-purple-500/40',
      textColor: 'text-purple-400',
      bridge: 'Chain Signatures + Wormhole',
      format: 'Solana transactions, Borsh-encoded',
      finality: '~13 seconds (32 slots)',
      trust: 'MPC + Guardian network — multiple verification layers',
    },
  ];

  return (
    <div className="relative py-6">
      {/* Hub-and-spoke layout */}
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {/* NEAR Hub - center spanning both columns */}
        <div className="col-span-2 flex justify-center mb-2">
          <motion.div
            className="w-28 h-28 rounded-full bg-gradient-to-br from-near-green/20 to-cyan-500/20 border-2 border-near-green/40 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 20px rgba(0,236,151,0.1)', '0 0 40px rgba(0,236,151,0.2)', '0 0 20px rgba(0,236,151,0.1)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="text-center">
              <span className="text-2xl">⬡</span>
              <p className="text-xs font-bold text-near-green mt-1">NEAR</p>
              <p className="text-[9px] text-text-muted">Hub</p>
            </div>
          </motion.div>
        </div>

        {/* Chain nodes */}
        {chains.map((chain, i) => (
          <motion.div
            key={chain.name}
            className={cn(
              'rounded-xl border p-3 cursor-pointer transition-all text-center',
              activeChain === i
                ? `bg-gradient-to-br ${chain.color} ${chain.border} shadow-lg`
                : 'bg-surface border-border hover:border-border-hover'
            )}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveChain(activeChain === i ? null : i)}
          >
            <p className={cn('text-sm font-bold', activeChain === i ? chain.textColor : 'text-text-primary')}>{chain.name}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Click to explore →</p>
          </motion.div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {activeChain !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <Card variant="default" padding="md" className="border-purple-500/20 bg-purple-500/5">
              <p className={cn('text-sm font-bold mb-3', chains[activeChain].textColor)}>
                NEAR ↔ {chains[activeChain].name} Connection
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-text-muted mb-1">Bridge Type</p>
                  <p className="text-text-secondary font-medium">{chains[activeChain].bridge}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Finality Time</p>
                  <p className="text-text-secondary font-medium">{chains[activeChain].finality}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Message Format</p>
                  <p className="text-text-secondary font-medium">{chains[activeChain].format}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Trust Assumptions</p>
                  <p className="text-text-secondary font-medium">{chains[activeChain].trust}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        Click each chain to see bridge details and trust assumptions →
      </p>
    </div>
  );
}

// ─── Concept Card ───────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType;
  title: string;
  preview: string;
  details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card variant="default" padding="md" className="cursor-pointer hover:border-border-hover transition-all" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary text-sm">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </motion.div>
          </div>
          <p className="text-sm text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="text-sm text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">{details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

// ─── Mini Quiz ──────────────────────────────────────────────────────────────

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 0;

  const question = 'What is the biggest security risk in multi-chain architecture?';
  const options = [
    'Bridge vulnerabilities — they\'re the most attacked component with billions in losses',
    'Smart contract bugs on individual chains',
    'Consensus mechanism failures',
    'Private key management across chains',
  ];
  const explanation = 'Correct! Cross-chain bridges are the #1 target for hackers, with over $2B stolen in 2022 alone. Bridge code is complex, handles massive value, and often relies on trusted intermediaries — making it the weakest link in multi-chain systems.';
  const wrongExplanation = 'Not quite. While all are risks, bridge vulnerabilities are the biggest threat in multi-chain architecture — over $2B was stolen from bridges in 2022 alone. They\'re complex, high-value targets that often rely on trusted intermediaries.';

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
              revealed && i === correctAnswer
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
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
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('mt-4 p-3 rounded-lg text-sm', selected === correctAnswer ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20')}>
            {selected === correctAnswer ? `✓ ${explanation}` : `✕ ${wrongExplanation}`}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ────────────────────────────────────────────────────────────

interface MultiChainWithNearProps {
  isActive: boolean;
  onToggle: () => void;
}

const MultiChainWithNear: React.FC<MultiChainWithNearProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['multi-chain-with-near']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['multi-chain-with-near'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Multi-Chain with NEAR</h3>
            <p className="text-text-muted text-sm">Cross-chain messaging, bridge protocols, multi-chain dApp architecture, and state verification</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 10 of 16</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">55 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-purple-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Building a multi-chain app is like opening restaurant franchises in different countries. Each location (chain) has
                  different regulations (consensus), currencies (tokens), and customs (transaction formats).
                  <span className="text-purple-400 font-medium"> NEAR acts as your headquarters</span> — coordinating operations
                  across all locations through <span className="text-near-green font-medium">chain signatures</span> and message
                  passing. Instead of building separate apps on each chain, you build one coordinating app on NEAR that can talk to all of them.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🌐 Multi-Chain Hub</h4>
                <p className="text-sm text-text-muted mb-4">NEAR at the center, connected to major chains. Each connection has different bridge types, finality times, and trust models.</p>
                <MultiChainHub />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      Cross-chain bridges are the <span className="text-orange-400 font-medium">#1 target for hackers</span> — over
                      $2B stolen from bridges in 2022 alone. Never assume a bridge message is valid without independent verification.
                      Use multiple verification sources. The Ronin Bridge hack ($625M) and Wormhole exploit ($320M) both exploited
                      single points of trust failure.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Network}
                    title="Hub-and-Spoke Architecture"
                    preview="NEAR as the coordination layer connecting multiple chains."
                    details="Instead of building N×(N-1) bridges between every pair of chains, use NEAR as a central hub. Each chain only needs one connection to NEAR. Chain signatures allow a NEAR account to sign transactions on any supported chain, making NEAR a universal coordinator. This reduces bridge complexity from O(n²) to O(n)."
                  />
                  <ConceptCard
                    icon={LinkIcon}
                    title="Cross-Chain Messaging"
                    preview="How messages are verified and delivered between chains."
                    details="Cross-chain messages follow a pattern: Event on Chain A → Proof generated → Relayer submits proof to Chain B → Chain B verifies proof → Action executed. The critical question is always: who verifies the proof? Light client bridges verify cryptographically. Optimistic bridges assume validity unless challenged. MPC bridges rely on a threshold of honest signers."
                  />
                  <ConceptCard
                    icon={Fingerprint}
                    title="State Proofs"
                    preview="Cryptographic proofs that something happened on another chain."
                    details="A state proof is a Merkle proof showing that a specific piece of data exists in a blockchain's state tree. For Ethereum→NEAR, you can prove an event was emitted by providing the receipt trie proof, block header, and enough headers to verify finality. This is trustless — no intermediary can fake it without breaking the chain's cryptography."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Bridge Protocols"
                    preview="Different bridge designs: light client, optimistic, MPC-based."
                    details="Light client bridges (like Rainbow Bridge) verify full header chains — most secure but expensive. Optimistic bridges assume messages are valid with a challenge period — cheaper but slower. MPC bridges (like chain signatures) use distributed key generation among validators — fast but rely on honest majority. Each makes different tradeoffs between security, cost, and speed."
                  />
                  <ConceptCard
                    icon={Lock}
                    title="Multi-Chain State Management"
                    preview="Keeping state consistent across chains."
                    details="The hardest problem in multi-chain: if you lock tokens on NEAR and mint on Ethereum, what happens if the Ethereum transaction fails? You need careful state machines with timeout-based recovery, two-phase commits, or optimistic execution with dispute resolution. Never leave assets in a half-bridged limbo state."
                  />
                  <ConceptCard
                    icon={Key}
                    title="Atomic Cross-Chain Operations"
                    preview="Ensuring operations either complete on all chains or none."
                    details="True atomicity across chains is impossible due to different finality times. Instead, protocols use 'eventual atomicity' — hash time-locked contracts (HTLCs) or intent-based systems where solvers guarantee execution. The key insight: you can't have simultaneous finality, but you can have guaranteed eventual settlement or guaranteed refund."
                  />
                </div>
              </div>

              {/* Attack / Defense Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Bridge oracle manipulation:</strong> Compromising bridge validators or relayers</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">State proof forgery:</strong> Crafting invalid state proofs to fake cross-chain events</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Cross-chain replay:</strong> Replaying a valid message on a different chain</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Finality exploits:</strong> Acting on not-yet-final cross-chain state</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Multi-proof verification requiring multiple independent sources</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Light client verification with full header chain validation</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Chain-specific nonces and domain separators to prevent replay</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Waiting for sufficient confirmations per chain before acting</li>
                  </ul>
                </Card>
              </div>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h4>
                <ul className="space-y-2">
                  {[
                    'NEAR can serve as a multi-chain coordination hub via chain signatures.',
                    'Every cross-chain message needs independent verification — never trust bridges blindly.',
                    'State proofs provide cryptographic verification that events happened on other chains.',
                    'Different chains have different finality times — always account for this in your design.',
                    'Atomic cross-chain operations require careful design to prevent partial execution.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <ArrowRight className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete */}
              <div className="flex justify-center pt-4 mt-4 border-t border-white/5">
                <motion.button
                  onClick={handleComplete}
                  disabled={completed}
                  className={cn(
                    'px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2',
                    completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-near-green to-emerald-500 text-white hover:shadow-lg hover:shadow-near-green/20'
                  )}
                  whileHover={completed ? {} : { scale: 1.03, y: -1 }}
                  whileTap={completed ? {} : { scale: 0.97 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {completed ? 'Module Completed ✓' : 'Mark as Complete'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default MultiChainWithNear;
