'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap, Shield,
  AlertTriangle, ArrowRight, Brain, Cpu, Database, Eye,
  Server, Layers, Lock,
} from 'lucide-react';

// ─── Interactive Visual: AI-Blockchain Integration Architecture ──────────────

function AiBlockchainArchitectureVisual() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = [
    {
      id: 0,
      label: 'Off-chain AI Layer',
      icon: '🧠',
      color: 'from-violet-500/20 to-indigo-500/20',
      border: 'border-violet-500/40',
      items: ['GPT / LLM Inference', 'Image Classification', 'Prediction Models', 'Sentiment Analysis'],
      detail: 'AI models run off-chain where computation is cheap and flexible. Models can be updated, retrained, and scaled without blockchain constraints. Outputs are non-deterministic — the same input may produce different results across runs.',
    },
    {
      id: 1,
      label: 'Oracle Bridge (Verification)',
      icon: '🔗',
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/40',
      items: ['Multi-Oracle Consensus', 'Outlier Detection', 'Commit-Reveal', 'ZK-ML Proofs'],
      detail: 'The critical trust bridge. Oracles submit AI results on-chain, but raw output is never trusted directly. Verification methods include: multi-oracle consensus (3-of-5 agree), range validation (reject outliers), ZK proofs of inference (prove the model ran correctly), and optimistic verification (assume correct, challenge if wrong).',
    },
    {
      id: 2,
      label: 'On-chain Contract (Execution)',
      icon: '📜',
      color: 'from-emerald-500/20 to-cyan-500/20',
      border: 'border-emerald-500/40',
      items: ['Result Validation', 'State Updates', 'Token Transfers', 'Event Emission'],
      detail: 'Smart contracts consume verified AI outputs deterministically. The contract validates the oracle submission (correct format, within bounds, sufficient attestations), then executes logic based on the result. All execution is deterministic — given the same verified input, every node produces the same output.',
    },
  ];

  return (
    <div className="relative py-6">
      <div className="space-y-3">
        {layers.map((layer, i) => (
          <div key={layer.id}>
            <motion.div
              className={cn(
                'relative p-4 rounded-xl border cursor-pointer transition-all',
                activeLayer === layer.id
                  ? `bg-gradient-to-br ${layer.color} ${layer.border} shadow-lg`
                  : 'bg-surface border-border hover:border-border-hover'
              )}
              whileHover={{ x: 4 }}
              onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{layer.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{layer.label}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {layer.items.map((item) => (
                        <span key={item} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-text-muted border border-border">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.div animate={{ rotate: activeLayer === layer.id ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </motion.div>
              </div>
              <AnimatePresence>
                {activeLayer === layer.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-text-secondary mt-3 pt-3 border-t border-border leading-relaxed">
                      {layer.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {i < layers.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-text-muted/40 to-text-muted/20" />
                  <ArrowRight className="w-3 h-3 text-text-muted rotate-90" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Verification checkpoint indicators */}
      <div className="mt-4 p-3 rounded-lg bg-surface border border-border">
        <p className="text-xs font-semibold text-text-muted mb-2">Verification Checkpoints</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Model Output', status: '⚠️ Unverified', color: 'text-orange-400' },
            { label: 'Oracle Submission', status: '🔍 Validating', color: 'text-amber-400' },
            { label: 'On-chain Result', status: '✅ Verified', color: 'text-emerald-400' },
          ].map((cp) => (
            <div key={cp.label} className="text-center">
              <p className="text-[10px] text-text-muted">{cp.label}</p>
              <p className={cn('text-xs font-mono', cp.color)}>{cp.status}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-text-muted mt-4">Click each layer to explore the architecture →</p>
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-violet-400" />
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

  const question = 'Why can\'t AI models run directly on-chain?';
  const options = [
    'Blockchain execution must be deterministic — AI inference is non-deterministic and too computationally expensive',
    'Blockchains don\'t support Python or the languages AI models are built with',
    'AI models are too large to store on any blockchain',
    'It\'s a regulatory issue — laws prohibit on-chain AI',
  ];
  const explanation = 'Correct! Blockchains require every node to produce the same output for the same input (determinism). AI inference is inherently non-deterministic (floating point, random sampling) and requires GPU-scale compute that would make gas costs astronomical.';
  const wrongExplanation = 'Not quite. The core issue is determinism and compute cost — blockchains need every node to produce identical results, but AI inference is non-deterministic and computationally expensive.';

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

interface AiAgentIntegrationProps {
  isActive: boolean;
  onToggle: () => void;
}

const AiAgentIntegration: React.FC<AiAgentIntegrationProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['ai-agent-integration']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['ai-agent-integration'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">AI Agent Integration</h3>
            <p className="text-text-muted text-sm">Connecting AI models to smart contracts, oracle-fed inference, and on-chain AI patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 7 of 16</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">50 min</Badge>
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-violet-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Traditional smart contracts are like vending machines — press a button, get a predictable result.
                  AI-integrated contracts are like a{' '}
                  <span className="text-violet-400 font-medium">smart vending machine that reads the weather, checks your preferences,
                  and recommends a drink</span>. The challenge:{' '}
                  <span className="text-near-green font-medium">keeping the AI&apos;s unpredictability within the blockchain&apos;s
                  deterministic rules</span>. Every node must agree on the result, but AI outputs are inherently variable.
                  The solution: oracles, verification layers, and hybrid architectures.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 AI-Blockchain Integration Architecture</h4>
                <p className="text-sm text-text-muted mb-4">Three layers bridging non-deterministic AI with deterministic smart contracts.</p>
                <AiBlockchainArchitectureVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      Never trust raw AI output in a smart contract without verification! An AI model can be manipulated
                      (adversarial attacks) or simply hallucinate.{' '}
                      <span className="text-orange-400 font-medium">Always validate AI outputs against expected ranges</span>{' '}
                      and use multi-source consensus. A single oracle reporting an AI result is a single point of failure.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Eye}
                    title="Oracle-Fed AI"
                    preview="Using oracles to bring AI inference results on-chain with verification."
                    details="Oracles are the bridge between off-chain AI and on-chain contracts. An AI model runs inference off-chain, the result is submitted by an oracle node, and the contract validates it. Multiple oracle providers can submit results independently — the contract uses median/consensus to reject outliers. This pattern is how DeFi price feeds work, extended to AI outputs."
                  />
                  <ConceptCard
                    icon={Lock}
                    title="Determinism Challenge"
                    preview="Blockchains need deterministic execution — AI is inherently non-deterministic."
                    details="Every node in a blockchain must produce the exact same output for the same input — that's how consensus works. But AI models use floating-point arithmetic, random sampling (temperature), and GPU-specific optimizations that produce slightly different results each time. This fundamental mismatch means AI can't run on-chain directly. Instead, AI runs off-chain and its outputs are brought on-chain as verified data."
                  />
                  <ConceptCard
                    icon={Shield}
                    title="Inference Verification"
                    preview="How to verify AI outputs without re-running the model."
                    details="Three main approaches: (1) Optimistic verification — assume the result is correct, allow a challenge period where anyone can dispute by re-running the model. (2) ZK-ML — generate a zero-knowledge proof that the model was executed correctly on the given input (cutting-edge, high overhead). (3) Committee consensus — multiple independent parties run the model and the contract accepts the majority result."
                  />
                  <ConceptCard
                    icon={Cpu}
                    title="Agent Transaction Patterns"
                    preview="How AI agents submit transactions: direct signing, meta-tx, intent-based."
                    details="AI agents can interact with smart contracts through three patterns: Direct signing (agent holds keys and signs transactions), Meta-transactions (agent signs, relayer submits and pays gas — NEP-366), and Intent-based (agent declares desired outcome, solver network handles execution). Each pattern has different trust, cost, and complexity tradeoffs. Production agents typically use meta-transactions for gasless UX."
                  />
                  <ConceptCard
                    icon={Database}
                    title="Cost Management"
                    preview="Balancing off-chain compute costs with on-chain gas costs."
                    details="Running GPT-4 inference costs ~$0.03 per call. Storing 1KB on NEAR costs ~0.01 NEAR. The key optimization: maximize off-chain computation, minimize on-chain data. Store only the final verified result on-chain, not intermediate steps. Batch multiple AI results into single transactions. Use events for cheap logging instead of storage writes."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Hybrid Architecture"
                    preview="Splitting logic between off-chain AI and on-chain verification."
                    details="The winning pattern: AI handles complex decision-making off-chain (cheap, flexible, updatable), smart contracts handle verification and execution on-chain (trustless, permanent, auditable). The contract defines rules: 'accept AI price prediction only if 3-of-5 oracles agree and the value is within 10% of the last accepted value.' The AI provides intelligence; the contract provides trust."
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
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Oracle manipulation:</strong> Feeding false AI results on-chain through compromised oracle nodes</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Model poisoning:</strong> Corrupted training data leads to biased or exploitable AI outputs</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Adversarial inputs:</strong> Crafted inputs that cause AI misclassification or incorrect predictions</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Inference front-running:</strong> Seeing AI results before on-chain settlement to trade ahead</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Multi-oracle consensus:</strong> Require 3-of-5 agreement with outlier detection</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Model attestation:</strong> Reproducible training with signed model hashes and audit trails</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Input validation:</strong> Anomaly detection and range checking on all AI inputs</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Commit-reveal:</strong> Encrypted inference results with delayed reveal prevent front-running</li>
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
                    'AI integration requires bridging non-deterministic inference with deterministic blockchain execution',
                    'Oracles serve as the trust bridge — bringing verified AI results on-chain with multi-source consensus',
                    'Always verify AI outputs before acting on them in smart contracts — never trust raw model output',
                    'Hybrid architectures split compute: off-chain AI for intelligence, on-chain contracts for trust',
                    'Cost optimization means minimizing what goes on-chain while maximizing verifiability',
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

export default AiAgentIntegration;
