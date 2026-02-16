'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, GitBranch, Code,
  Workflow, Terminal, Activity,
} from 'lucide-react';

// ─── Interactive Promise Chain Visual ───────────────────────────────────────

function PromiseChainVisual() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const nodes = [
    {
      id: 0,
      label: 'Caller',
      type: 'user',
      gasStart: 100,
      gasUsed: 10,
      detail: 'User initiates a transaction with 100 TGas attached. The transaction calls Contract A with the remaining gas budget.',
      color: 'from-indigo-500/30 to-indigo-600/20',
      borderColor: 'border-indigo-500/40',
      textColor: 'text-indigo-400',
    },
    {
      id: 1,
      label: 'Contract A',
      type: 'promise',
      gasStart: 90,
      gasUsed: 25,
      detail: 'Contract A executes its logic (10 TGas), creates a promise to Contract B attaching 50 TGas, and reserves 5 TGas for its callback.',
      color: 'from-blue-500/30 to-blue-600/20',
      borderColor: 'border-blue-500/40',
      textColor: 'text-blue-400',
    },
    {
      id: 2,
      label: 'Contract B',
      type: 'execution',
      gasStart: 50,
      gasUsed: 30,
      detail: 'Contract B receives the promise, executes the requested function using 30 TGas. Returns a result (success or failure) that triggers the callback.',
      color: 'from-cyan-500/30 to-cyan-600/20',
      borderColor: 'border-cyan-500/40',
      textColor: 'text-cyan-400',
    },
    {
      id: 3,
      label: 'Callback → A',
      type: 'callback',
      gasStart: 5,
      gasUsed: 3,
      detail: 'Contract A\'s callback fires with the reserved 5 TGas. It checks if Contract B succeeded or failed, and handles rollback logic if needed. Critical: Contract A\'s earlier state changes already persisted!',
      color: 'from-emerald-500/30 to-emerald-600/20',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="relative py-6">
      {/* Gas Budget Bar */}
      <div className="mb-6 px-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-muted font-mono">Gas Budget</span>
          <span className="text-xs text-text-muted font-mono">100 TGas total</span>
        </div>
        <div className="h-3 bg-surface border border-border rounded-full overflow-hidden flex">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className={cn(
                'h-full transition-all cursor-pointer',
                node.id === 0 ? 'bg-indigo-500/60' :
                node.id === 1 ? 'bg-blue-500/60' :
                node.id === 2 ? 'bg-cyan-500/60' : 'bg-emerald-500/60',
                activeNode === node.id && 'brightness-150'
              )}
              style={{ width: `${node.gasUsed}%` }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              whileHover={{ scaleY: 1.3 }}
            />
          ))}
          <div className="h-full bg-gray-700/30 flex-1" title="Unused gas (refunded)" />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-text-muted">Used: 68 TGas</span>
          <span className="text-[10px] text-emerald-400">Refunded: 32 TGas</span>
        </div>
      </div>

      {/* Flow Nodes */}
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center flex-shrink-0 w-full md:w-auto">
            <motion.div
              className={cn(
                'relative rounded-xl p-3 border cursor-pointer transition-all w-full md:w-44',
                `bg-gradient-to-br ${node.color} ${node.borderColor}`,
                activeNode === node.id && 'ring-1 ring-white/20 shadow-lg'
              )}
              whileHover={{ scale: 1.03, y: -2 }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('text-xs font-bold font-mono', node.textColor)}>{node.label}</span>
              </div>
              <div className="text-[10px] text-text-muted">
                <span>Gas: {node.gasStart} → {node.gasStart - node.gasUsed} TGas</span>
              </div>
              <AnimatePresence>
                {activeNode === node.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-2 pt-2 border-t border-white/10 text-[10px] text-text-secondary leading-relaxed">
                      {node.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {i < nodes.length - 1 && (
              <motion.div
                className="hidden md:flex items-center mx-1"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              >
                <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500/50 to-cyan-500/30" />
                <ArrowRight className="w-3 h-3 text-blue-400/50" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Gas Cost Summary */}
      <div className="mt-4 p-3 rounded-lg bg-surface border border-border">
        <p className="text-[10px] text-text-muted font-mono leading-relaxed">
          💡 Promise creation: ~5 TGas base • Cross-contract call: 5-10 TGas overhead •
          Deep chains (A→B→C→D) easily consume 100+ TGas — keep chains shallow
        </p>
      </div>

      <p className="text-center text-xs text-text-muted mt-4">
        Click nodes to see gas flow details →
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-indigo-400" />
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

  const question = 'What happens if a cross-contract callback fails on NEAR?';
  const options = [
    'The entire transaction reverts including all state changes',
    'The calling contract\'s state changes persist — only the callback\'s changes revert',
    'The transaction is automatically retried up to 3 times',
    'Both contracts\' state changes are rolled back',
  ];
  const explanation = 'Correct! This is one of the most dangerous gotchas on NEAR. When Contract A calls Contract B and B\'s callback fails, Contract A\'s state changes from the original call are already committed. Only the callback function\'s own state changes revert. You must handle rollback logic explicitly.';
  const wrongExplanation = 'Not quite. On NEAR, cross-contract calls are async. Contract A\'s state changes persist regardless of the callback outcome. Only the callback\'s own changes revert on failure — you must handle rollback explicitly!';

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

interface CrossContractCallsProps {
  isActive: boolean;
  onToggle: () => void;
}

const CrossContractCalls: React.FC<CrossContractCallsProps> = ({ isActive, onToggle }) => {
  return (
    <Card variant="glass" padding="none" className="border-indigo-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Cross-Contract Calls</h3>
            <p className="text-text-muted text-sm">Promise-based async execution, callbacks, gas attachment, and error handling patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            <div className="border-t border-indigo-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Think of cross-contract calls like <span className="text-indigo-400 font-medium">sending a letter with a stamped return envelope</span>.
                  You send your request (with gas money for postage), and include instructions for what to do when the reply
                  comes back. But unlike real mail — if the reply fails, you need a <span className="text-blue-400 font-medium">plan B</span>.
                  On NEAR, cross-contract calls are <span className="text-cyan-400 font-medium">fundamentally asynchronous</span> —
                  each call executes in a separate block, and failure in one step doesn&apos;t automatically undo the others.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Promise Chain &amp; Gas Flow</h4>
                <p className="text-sm text-text-muted mb-4">Follow a cross-contract call from caller through promises to callback. Watch gas being consumed at each step.</p>
                <PromiseChainVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      Cross-contract callbacks don&apos;t automatically revert the parent call! If Contract B fails,
                      Contract A&apos;s state changes <span className="text-orange-300 font-medium">PERSIST</span>. You
                      must handle rollback logic explicitly in your callback. This is the #1 source of bugs in NEAR
                      smart contracts — developers assume Ethereum-style atomic transactions, but NEAR&apos;s async model
                      means each step commits independently.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Code}
                    title="Promise API"
                    preview="Creating cross-contract calls in Rust using near_sdk's Promise type."
                    details="The Promise API lets you create cross-contract calls: Promise::new(account_id).function_call(method, args, deposit, gas). Each promise is a deferred execution — it doesn't run immediately but is scheduled for the next block. You can chain promises with .then() to create callbacks. The key insight: promises are not Rust futures — they're blockchain-level execution units."
                  />
                  <ConceptCard
                    icon={Activity}
                    title="Gas Attachment"
                    preview="Allocating gas for each cross-contract call — 5 TGas minimum per promise."
                    details="Every promise needs gas to execute. You must explicitly allocate gas from your total budget: too little and the call fails, too much and you waste resources. Rule of thumb: 5 TGas minimum per promise, 5 TGas reserved for your callback. For complex operations, budget 10-30 TGas per call. The remaining unused gas is refunded to the original caller."
                  />
                  <ConceptCard
                    icon={Workflow}
                    title="Callbacks"
                    preview="Handling success and failure of cross-contract promises."
                    details="Callbacks fire after a promise resolves — regardless of whether it succeeded or failed. Use env::promise_results_count() and env::promise_result(0) to check the outcome. Critical pattern: in your callback, check the result FIRST, then update state. If the promise failed, implement rollback logic (refund tokens, revert state changes). Never assume success!"
                  />
                  <ConceptCard
                    icon={GitBranch}
                    title="Promise Batching"
                    preview="Combining multiple actions into a single atomic promise."
                    details="Promise batching lets you combine actions that execute atomically on a single account: create_account + transfer + deploy_contract + function_call. Batched actions either all succeed or all fail — unlike chained promises. Use batching for account setup, contract deployment, or any sequence that must be atomic. Syntax: Promise::new(id).create_account().transfer(amount).deploy_contract(code)."
                  />
                  <ConceptCard
                    icon={Terminal}
                    title="Error Propagation"
                    preview="Understanding what happens when a promise fails — state rollback is NOT automatic."
                    details="When a promise fails, ONLY the failing function's state changes revert. The caller's state changes persist! This means: if Contract A updates its balance, then calls Contract B which fails — Contract A's balance change is permanent. You MUST check promise results in callbacks and handle failures. Pattern: 1) Save rollback data before the call, 2) In callback, check result, 3) If failed, use saved data to undo changes."
                  />
                </div>
              </div>

              {/* Attack Vector / Defense */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Reentrancy via callbacks — attacker contract calls back into the original contract before state is updated, exploiting stale state</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Gas exhaustion — attacker provides just enough gas for the main call but not the callback, causing silent failure in rollback logic</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Callback manipulation — malicious contract returns crafted data to mislead the callback&apos;s decision logic</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Checks-effects-interactions pattern — update state BEFORE making external calls, then verify in callback</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Explicit gas budgeting — always reserve at least 5 TGas for callbacks; use assert! to verify sufficient gas before external calls</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Validate callback caller — use env::current_account_id() to ensure only your own contract can invoke the callback</li>
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
                    'Cross-contract calls are async via the Promise API — each executes in a separate block',
                    'Callbacks must explicitly handle failure — there is no automatic rollback of the parent call',
                    'Always budget gas carefully — 5 TGas minimum per promise, 5 TGas reserved for callbacks',
                    'Use checks-effects-interactions pattern to prevent reentrancy attacks via callbacks',
                    'Promise batching combines multiple actions atomically on a single account — use it for setup flows',
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

export default CrossContractCalls;
