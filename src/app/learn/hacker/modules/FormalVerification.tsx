'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, FileCode, Search,
  Brain, Crosshair, GitBranch, Eye, Lock,
} from 'lucide-react';

// ─── Interactive Visual: Verification Spectrum ──────────────────────────────

function VerificationSpectrumVisual() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  const levels = [
    {
      label: 'Manual Review',
      rigor: 1,
      color: 'bg-red-500',
      timeCost: 'Low',
      bugsCaught: 'Surface-level',
      confidence: '~40%',
      tools: 'Human eyeballs, code review checklists',
      description: 'A developer or auditor reads the code and looks for issues. Catches obvious bugs but misses edge cases. Highly dependent on reviewer expertise. Essential as a first pass but insufficient alone.',
    },
    {
      label: 'Unit Tests',
      rigor: 2,
      color: 'bg-orange-500',
      timeCost: 'Low-Medium',
      bugsCaught: 'Known scenarios',
      confidence: '~55%',
      tools: 'cargo test, NEAR workspaces',
      description: 'Testing specific inputs and expected outputs. Great for regression testing and documenting behavior. But only tests the cases you think of — can\'t catch unknown unknowns.',
    },
    {
      label: 'Fuzzing',
      rigor: 3,
      color: 'bg-amber-500',
      timeCost: 'Medium',
      bugsCaught: 'Crashes, panics',
      confidence: '~65%',
      tools: 'cargo-fuzz, AFL, honggfuzz',
      description: 'Automatically generates random inputs and feeds them to your code, looking for crashes, panics, and assertion failures. Finds bugs humans would never think to test. Run for hours or days for best results.',
    },
    {
      label: 'Property Testing',
      rigor: 4,
      color: 'bg-yellow-500',
      timeCost: 'Medium-High',
      bugsCaught: 'Invariant violations',
      confidence: '~75%',
      tools: 'proptest, QuickCheck-style',
      description: 'Define properties that must ALWAYS hold (e.g., "total supply never changes"), then generate thousands of random test cases. If any input violates the property, you\'ve found a bug. Much more powerful than example-based testing.',
    },
    {
      label: 'Symbolic Execution',
      rigor: 5,
      color: 'bg-emerald-500',
      timeCost: 'High',
      bugsCaught: 'All reachable paths',
      confidence: '~88%',
      tools: 'KANI, CBMC, Mythril',
      description: 'Treats all inputs as symbolic variables and explores every possible execution path. Mathematically determines which paths can reach which states. Finds edge cases that no amount of random testing would discover.',
    },
    {
      label: 'Full Formal Verification',
      rigor: 6,
      color: 'bg-green-500',
      timeCost: 'Very High',
      bugsCaught: 'Mathematical proof',
      confidence: '~99%',
      tools: 'Coq, Isabelle, KANI proofs',
      description: 'Mathematically PROVES that your code satisfies its specification for ALL possible inputs. The gold standard — but requires a formal specification and significant expertise. The confidence gap from 99% to 100% is the spec itself: if the spec is wrong, the proof is meaningless.',
    },
  ];

  return (
    <div className="relative py-6">
      {/* Spectrum bar */}
      <div className="flex items-center gap-1 mb-4">
        <span className="text-[10px] text-text-muted mr-2 flex-shrink-0">Less rigorous</span>
        {levels.map((level, i) => (
          <motion.div
            key={i}
            className={cn(
              'flex-1 h-10 rounded-md cursor-pointer flex items-center justify-center relative transition-all',
              activeLevel === i
                ? `${level.color} shadow-lg`
                : `${level.color}/30 hover:${level.color}/50`
            )}
            whileHover={{ y: -2 }}
            onClick={() => setActiveLevel(activeLevel === i ? null : i)}
          >
            <span className={cn(
              'text-[10px] font-medium text-center leading-tight px-1',
              activeLevel === i ? 'text-white' : 'text-text-muted'
            )}>
              {level.label}
            </span>
          </motion.div>
        ))}
        <span className="text-[10px] text-text-muted ml-2 flex-shrink-0">Most rigorous</span>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {activeLevel !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg bg-surface border border-border">
              <h5 className="font-semibold text-text-primary text-sm mb-3">{levels[activeLevel].label}</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="text-xs">
                  <span className="text-text-muted block">Time Cost</span>
                  <span className="text-text-secondary font-medium">{levels[activeLevel].timeCost}</span>
                </div>
                <div className="text-xs">
                  <span className="text-text-muted block">Bugs Found</span>
                  <span className="text-text-secondary font-medium">{levels[activeLevel].bugsCaught}</span>
                </div>
                <div className="text-xs">
                  <span className="text-text-muted block">Confidence</span>
                  <span className="text-emerald-400 font-medium">{levels[activeLevel].confidence}</span>
                </div>
                <div className="text-xs">
                  <span className="text-text-muted block">Tools</span>
                  <span className="text-text-secondary font-medium">{levels[activeLevel].tools}</span>
                </div>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{levels[activeLevel].description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        Click levels to explore the verification spectrum →
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-emerald-400" />
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
  const correctAnswer = 1;

  const question = 'What does formal verification guarantee that testing cannot?';
  const options = [
    'That the code has no bugs whatsoever',
    'That properties hold for ALL possible inputs, not just tested ones',
    'That the contract is gas-efficient and optimized',
    'That the user experience is intuitive and well-designed',
  ];
  const explanation = 'Correct! Testing checks specific examples. Formal verification proves properties hold for every possible input — mathematically. This is why it\'s the gold standard for security-critical code. But remember: it proves your code matches your spec, not that your spec is correct.';
  const wrongExplanation = 'Not quite. Formal verification guarantees that specified properties hold for ALL possible inputs — not just the ones you test. It\'s mathematical proof vs. empirical evidence.';

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

interface FormalVerificationProps {
  isActive: boolean;
  onToggle?: () => void;
}

const FormalVerification: React.FC<FormalVerificationProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['formal-verification']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['formal-verification'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
            <FileCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Formal Verification</h3>
            <p className="text-text-muted text-sm">Mathematical proofs for smart contracts, model checking, property testing, and verification tools</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 16 of 16</Badge>
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Testing tells you &quot;it worked for these inputs.&quot; Formal verification tells you{' '}
                  <span className="text-emerald-400 font-medium">&quot;it works for ALL possible inputs — mathematically guaranteed.&quot;</span>{' '}
                  It&apos;s the difference between test-driving a car on a few roads vs. mathematically proving the brakes
                  will work under every possible condition. For smart contracts holding millions,{' '}
                  <span className="text-near-green font-medium">&quot;probably works&quot; isn&apos;t good enough</span>.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Verification Spectrum</h4>
                <p className="text-sm text-text-muted mb-4">From manual review to full formal proofs — each level offers more rigor at higher cost.</p>
                <VerificationSpectrumVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">Formal verification proves your CODE matches your SPEC — but if your spec is wrong, your verified code is perfectly implementing the wrong behavior! Always have the spec reviewed independently from the code.</p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard icon={Brain} title="Formal Methods Overview" preview="Using mathematical logic to PROVE properties about programs." details="Formal methods apply mathematical logic and proof techniques to software. Instead of testing examples, you write a formal specification of what the code should do, then use automated tools to prove the code satisfies that specification for every possible input. This is the highest level of assurance possible in software engineering." />
                  <ConceptCard icon={Search} title="Property-Based Testing" preview="Define invariants, then generate random inputs to find violations." details="Property-based testing (QuickCheck-style) lets you define properties like 'total_supply never changes after a transfer' and automatically generates thousands of random inputs to try to violate them. If the tool finds a counterexample, you've found a bug. Libraries like proptest for Rust make this accessible without formal methods expertise." />
                  <ConceptCard icon={GitBranch} title="Symbolic Execution" preview="Exploring ALL execution paths by treating inputs as symbols." details="Instead of running code with concrete values, symbolic execution treats inputs as mathematical symbols and explores every possible path through the code. It builds a logical formula for each path and uses SAT/SMT solvers to find inputs that reach specific states. This catches edge cases that random testing would take years to find." />
                  <ConceptCard icon={Eye} title="Model Checking" preview="Exhaustively checking all reachable states against a specification." details="Model checking systematically explores every reachable state of your contract and verifies that a property holds in all of them. For example: 'In no reachable state can a non-owner call the admin function.' The challenge is state space explosion — complex contracts have billions of reachable states, requiring abstraction techniques." />
                  <ConceptCard icon={Lock} title="Invariant Verification" preview="Proving conditions that must ALWAYS hold: balance ≥ 0, access control." details="Invariants are the most valuable properties to verify: total supply is conserved, balances never go negative, only the owner can call admin functions, reentrancy is impossible. These are the properties that, if violated, lead to catastrophic exploits. Start with these before attempting full behavioral verification." />
                  <ConceptCard icon={Crosshair} title="Tools for NEAR" preview="KANI, cargo-fuzz, proptest, and NEAR workspaces for Rust contracts." details="KANI is a model checker for Rust that can prove properties about NEAR contracts. cargo-fuzz provides fuzzing infrastructure. proptest enables property-based testing in Rust. NEAR workspaces provides integration testing with a real NEAR sandbox. The recommended progression: unit tests → proptest → cargo-fuzz → KANI for maximum coverage." />
                </div>
              </div>

              {/* Practical Example */}
              <Card variant="default" padding="md" className="border-emerald-500/20">
                <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                  <FileCode className="w-4 h-4" /> Practical Verification Progression
                </h4>
                <p className="text-xs text-text-muted mb-3">Recommended approach for a NEAR token contract:</p>
                <div className="space-y-2">
                  {[
                    { step: '1', label: 'Unit Tests', desc: 'Test transfer, mint, burn with known inputs', effort: 'Hours' },
                    { step: '2', label: 'Property Tests', desc: 'Prove: total_supply == sum(all_balances) for random inputs', effort: 'Days' },
                    { step: '3', label: 'Fuzzing', desc: 'Random call sequences to find panics and edge cases', effort: 'Days' },
                    { step: '4', label: 'Symbolic Execution', desc: 'Prove no path allows balance underflow', effort: 'Weeks' },
                    { step: '5', label: 'KANI Proofs', desc: 'Mathematical proof that access control is never bypassed', effort: 'Weeks' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">{item.step}</span>
                      <div className="flex-1">
                        <span className="text-text-primary font-medium">{item.label}</span>
                        <span className="text-text-muted"> — {item.desc}</span>
                      </div>
                      <span className="text-text-muted flex-shrink-0">~{item.effort}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Attack / Defense Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Spec errors — formal spec doesn&apos;t capture the actual security requirement</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> State space explosion — model checker runs out of memory on complex contracts</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Verification gaps — only part of the contract is verified, unverified parts have bugs</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Tool bugs — the verification tool itself has bugs giving false confidence</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Independent spec review and dual-specification by different teams</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Abstraction and compositional verification to manage complexity</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Full-contract verification with clear boundary documentation</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Cross-verification with multiple tools and manual review</li>
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
                    'Formal verification provides mathematical guarantees that testing cannot match.',
                    'Start with property-based testing (lowest effort, high value), then add fuzzing and symbolic execution.',
                    'Invariants are the most valuable properties to verify: balance conservation, access control, no reentrancy.',
                    'The verification spectrum: testing → fuzzing → property testing → symbolic execution → full formal verification.',
                    'A verified spec that\'s wrong gives false confidence — always review specs independently.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <ArrowRight className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default FormalVerification;
