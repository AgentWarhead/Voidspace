'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  AlertTriangle, ArrowRight, Shield, Eye, Lock,
  Layers, Cpu, Fingerprint, Brain,
} from 'lucide-react';

// ─── Interactive Visual: ZK Proof Concept ───────────────────────────────────

function ZKProofVisual() {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const elements = {
    prover: {
      label: 'Prover',
      icon: '🔐',
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/40',
      detail: {
        title: 'What the Prover Knows',
        items: [
          'Full private data (e.g., date of birth: March 15, 1995)',
          'Secret witness values used in the proof',
          'The complete computation that proves the statement',
          'All intermediate values in the circuit',
        ],
        note: 'The prover has ALL the information but reveals NONE of it.',
      },
    },
    proof: {
      label: 'ZK Proof',
      icon: '📜',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/40',
      detail: {
        title: 'What the Proof Contains',
        items: [
          'Mathematical commitment (elliptic curve points)',
          'Challenge-response values',
          'No private data — just cryptographic evidence',
          'SNARK: ~200 bytes | STARK: ~50 KB',
        ],
        note: 'The proof is tiny and reveals nothing about the underlying data.',
      },
    },
    verifier: {
      label: 'Verifier',
      icon: '✅',
      color: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/40',
      detail: {
        title: 'What the Verifier Learns',
        items: [
          'TRUE or FALSE — nothing else',
          'e.g., "This person is over 21" (not their age, name, or ID)',
          'Verification is fast: ~10ms on-chain',
          'Cannot extract any private data from the proof',
        ],
        note: 'The verifier gains absolute certainty with zero knowledge.',
      },
    },
  };

  const proofSizes = [
    { system: 'Groth16 (SNARK)', size: '~200 bytes', verify: '~10ms', setup: 'Trusted ⚠️', color: 'text-cyan-400' },
    { system: 'PLONK (SNARK)', size: '~400 bytes', verify: '~15ms', setup: 'Universal', color: 'text-blue-400' },
    { system: 'STARK', size: '~50 KB', verify: '~50ms', setup: 'Transparent ✓', color: 'text-purple-400' },
    { system: 'Bulletproofs', size: '~700 bytes', verify: '~100ms', setup: 'None ✓', color: 'text-pink-400' },
  ];

  return (
    <div className="relative py-6">
      {/* Prover → Proof → Verifier flow */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 mb-4">
        {(['prover', 'proof', 'verifier'] as const).map((key, i) => {
          const el = elements[key];
          return (
            <React.Fragment key={key}>
              <motion.div
                className={cn(
                  'flex-1 rounded-xl border p-4 cursor-pointer transition-all text-center',
                  activeElement === key
                    ? `bg-gradient-to-br ${el.color} ${el.border} shadow-lg`
                    : 'bg-surface border-border hover:border-border-hover'
                )}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveElement(activeElement === key ? null : key)}
              >
                <span className="text-2xl">{el.icon}</span>
                <p className="text-sm font-bold text-text-primary mt-2">{el.label}</p>
                <p className="text-[10px] text-text-muted mt-1">Click to explore</p>
              </motion.div>
              {i < 2 && (
                <div className="hidden sm:flex items-center justify-center">
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 text-cyan-400/60" />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {activeElement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card variant="default" padding="md" className="border-cyan-500/20 bg-cyan-500/5 mb-4">
              <p className="text-sm font-bold text-cyan-400 mb-2">
                {elements[activeElement as keyof typeof elements].detail.title}
              </p>
              <ul className="space-y-1.5 mb-3">
                {elements[activeElement as keyof typeof elements].detail.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                    <span className="text-cyan-400">→</span> {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-cyan-400/80 italic">
                {elements[activeElement as keyof typeof elements].detail.note}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proof size comparison */}
      <Card variant="default" padding="md" className="border-border">
        <p className="text-xs font-semibold text-text-primary mb-2">📊 ZK System Comparison</p>
        <div className="grid grid-cols-4 gap-1 text-[10px] text-text-muted mb-1">
          <span className="font-semibold text-text-secondary">System</span>
          <span className="font-semibold text-text-secondary">Proof Size</span>
          <span className="font-semibold text-text-secondary">Verify Time</span>
          <span className="font-semibold text-text-secondary">Setup</span>
        </div>
        {proofSizes.map((ps) => (
          <div key={ps.system} className="grid grid-cols-4 gap-1 text-[10px] text-text-muted py-1 border-t border-border/50">
            <span className={cn('font-medium', ps.color)}>{ps.system}</span>
            <span>{ps.size}</span>
            <span>{ps.verify}</span>
            <span>{ps.setup}</span>
          </div>
        ))}
      </Card>

      <p className="text-center text-xs text-text-muted mt-4">
        Click Prover, Proof, or Verifier to see what each knows →
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-cyan-400" />
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
  const correctAnswer = 2;

  const question = 'What is the main difference between SNARKs and STARKs?';
  const options = [
    'SNARKs are faster to generate proofs than STARKs',
    'STARKs provide more privacy than SNARKs',
    'SNARKs need a trusted setup but produce smaller proofs; STARKs are transparent but produce larger proofs',
    'They use different blockchains and are not compatible',
  ];
  const explanation = 'Correct! This is the fundamental tradeoff. SNARKs (like Groth16) produce tiny ~200 byte proofs but require a trusted setup ceremony. STARKs need no trusted setup (transparent) but produce larger ~50KB proofs. Both achieve zero-knowledge — the difference is in setup trust and proof size.';
  const wrongExplanation = 'Not quite. The key difference is: SNARKs require a trusted setup ceremony but produce smaller proofs (~200 bytes), while STARKs are transparent (no trusted setup) but produce larger proofs (~50KB). Both are valid ZK systems with different tradeoffs.';

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

interface ZeroKnowledgeOnNearProps {
  isActive: boolean;
  onToggle?: () => void;
}

const ZeroKnowledgeOnNear: React.FC<ZeroKnowledgeOnNearProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['zero-knowledge-on-near']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['zero-knowledge-on-near'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-cyan-500/20">
      {/* Accordion Header */}
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Zero Knowledge on NEAR</h3>
            <p className="text-text-muted text-sm">ZK proofs, ZK rollups, privacy-preserving computation, and NEAR&apos;s ZK roadmap</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 12 of 16</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">60 min</Badge>
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
            <div className="border-t border-cyan-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Imagine proving you&apos;re over 21 to enter a bar — without showing your ID, your name, or your actual age.
                  You just prove the single fact that matters. That&apos;s <span className="text-cyan-400 font-medium">zero-knowledge
                  proofs</span>: proving something is true without revealing anything else. On NEAR, this enables
                  <span className="text-near-green font-medium"> privacy</span> (hide transaction details),
                  <span className="text-near-green font-medium"> scalability</span> (batch thousands of transactions into one proof),
                  and <span className="text-near-green font-medium">trustless verification</span> (verify computation without re-executing it).
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔮 ZK Proof Anatomy</h4>
                <p className="text-sm text-text-muted mb-4">A proof flows from Prover to Verifier. Click each element to see what information exists at each stage.</p>
                <ZKProofVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      SNARKs require a <span className="text-orange-400 font-medium">trusted setup ceremony</span> — if the setup
                      is compromised, fake proofs can be generated! The &quot;toxic waste&quot; (secret randomness) from the ceremony
                      must be destroyed. If anyone keeps it, they can forge valid-looking proofs for false statements. STARKs avoid
                      this entirely but have larger proof sizes. Choose your ZK system based on your trust model.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Brain}
                    title="ZK Proofs Explained"
                    preview="Mathematical proofs that reveal nothing beyond the statement's truth."
                    details="A ZK proof has three properties: Completeness (if the statement is true, an honest prover can convince the verifier), Soundness (if the statement is false, no cheating prover can convince the verifier), and Zero-Knowledge (the verifier learns nothing beyond the statement's truth). Think of it as a magic trick where the audience is convinced of an impossible feat but can't figure out how it was done — except here, the 'trick' is provably real mathematics."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="SNARKs vs STARKs"
                    preview="Trusted setup vs. transparent, proof size vs. prover time tradeoffs."
                    details="SNARKs (Succinct Non-interactive Arguments of Knowledge) produce tiny proofs (~200 bytes) but require a one-time trusted setup ceremony. If the ceremony's 'toxic waste' is leaked, the entire system is broken. STARKs (Scalable Transparent Arguments of Knowledge) need no trusted setup and are quantum-resistant, but produce larger proofs (~50KB) and have higher verification costs. Newer systems like PLONK offer a middle ground with universal trusted setups that work for any circuit."
                  />
                  <ConceptCard
                    icon={Cpu}
                    title="ZK Rollups"
                    preview="Batching hundreds of transactions into a single proof for scalability."
                    details="A ZK rollup executes transactions off-chain, generates a proof that all transactions were valid, and posts just the proof on-chain. The main chain verifies one small proof instead of re-executing hundreds of transactions. This can achieve 100-1000x throughput improvement. On NEAR, ZK rollups could process thousands of transactions per second while inheriting NEAR's security guarantees."
                  />
                  <ConceptCard
                    icon={Lock}
                    title="Privacy Applications"
                    preview="Private transfers, anonymous voting, credential verification without identity reveal."
                    details="ZK proofs enable: Private transfers (prove you have sufficient balance without revealing your total balance), Anonymous voting (prove you're eligible to vote without revealing your identity or choice), Credential verification (prove you have a valid degree without revealing which university or your GPA), and Compliance proofs (prove your transaction is legal without revealing transaction details to regulators)."
                  />
                  <ConceptCard
                    icon={Eye}
                    title="NEAR's ZK Roadmap"
                    preview="zkWASM, proof verification precompiles, and the path to ZK-powered sharding."
                    details="NEAR is building native ZK support: zkWASM enables proving WASM execution (any NEAR contract can generate ZK proofs of its execution), Proof verification precompiles make on-chain verification gas-efficient, and ZK-powered sharding uses ZK proofs to verify cross-shard transactions without re-execution. This roadmap positions NEAR as a ZK-native L1 where privacy and scalability are built into the protocol layer."
                  />
                  <ConceptCard
                    icon={Fingerprint}
                    title="Verification Costs"
                    preview="On-chain proof verification gas costs and optimization techniques."
                    details="Verifying a ZK proof on-chain costs gas — the key question is how much. SNARK verification (pairing-based) costs ~300K gas on Ethereum; STARK verification costs more due to larger proofs. Batch verification (checking multiple proofs together) reduces per-proof cost. NEAR's planned precompiles will make verification significantly cheaper, potentially 10-100x less gas than doing it in WASM. Recursive proofs (proof of proofs) can further compress costs."
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
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Trusted setup compromise:</strong> Leaked toxic waste enables proof forgery</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Proof malleability:</strong> Modifying valid proofs to create new valid proofs</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Side-channel attacks:</strong> Leaking private inputs through timing or gas</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Soundness bugs:</strong> Implementation errors that break proof validity</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Large-scale MPC ceremonies and STARKs as transparent alternative</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Non-malleable proof systems and binding commitments</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Constant-time verification and gas padding to prevent leaks</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Formal verification of ZK circuits and multiple independent audits</li>
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
                    'ZK proofs enable proving statements without revealing underlying data.',
                    'SNARKs = small proofs + trusted setup; STARKs = larger proofs + no trusted setup.',
                    'ZK rollups batch transactions into a single proof for massive scalability.',
                    'NEAR is building native ZK verification support for cheaper on-chain proof checking.',
                    'Privacy and scalability are the two main use cases for ZK on NEAR.',
                    'Choose your ZK system based on your trust model and performance requirements.',
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

export default ZeroKnowledgeOnNear;
