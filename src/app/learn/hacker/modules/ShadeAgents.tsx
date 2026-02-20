'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap, Shield,
  AlertTriangle, ArrowRight, Bot, Key, Users, Database,
  Lock, Network, Settings, Eye,
} from 'lucide-react';

// ─── Interactive Visual: Agent Trust Boundary Diagram ────────────────────────

function AgentTrustBoundaryVisual() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const nodes = [
    {
      id: 0,
      label: 'Shade Agent',
      icon: '🤖',
      x: 'col-start-2',
      y: 'row-start-2',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/40',
      detail: 'The autonomous AI program. Has its own NEAR account, decision-making logic, and memory. Operates 24/7 executing tasks within its permission boundaries. Cannot exceed its access key allowances.',
    },
    {
      id: 1,
      label: 'NEAR Wallet',
      icon: '💰',
      x: 'col-start-1',
      y: 'row-start-1',
      color: 'from-emerald-500/20 to-cyan-500/20',
      border: 'border-emerald-500/40',
      detail: 'Function-call access key with 5 NEAR allowance. Limited to swap() and transfer() on specific contracts. Daily spending cap: 2 NEAR. Full-access key stays with the human owner — never the agent.',
    },
    {
      id: 2,
      label: 'Other Agents',
      icon: '🔗',
      x: 'col-start-3',
      y: 'row-start-1',
      color: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/40',
      detail: 'Agent-to-agent protocol: standardized JSON messages for task delegation. Agent A can request Agent B to execute a trade, but Agent B independently verifies the request against its own permission set before acting.',
    },
    {
      id: 3,
      label: 'Oracle Feeds',
      icon: '📡',
      x: 'col-start-1',
      y: 'row-start-3',
      color: 'from-orange-500/20 to-amber-500/20',
      border: 'border-orange-500/40',
      detail: 'External data sources the agent reads for decision-making: price feeds, weather data, on-chain events. Oracle data is read-only — the agent cannot write to oracle contracts. Multi-source validation prevents single-oracle manipulation.',
    },
    {
      id: 4,
      label: 'User Approval Gate',
      icon: '👤',
      x: 'col-start-3',
      y: 'row-start-3',
      color: 'from-yellow-500/20 to-amber-500/20',
      border: 'border-yellow-500/40',
      detail: 'Human-in-the-loop checkpoint. Transactions above 1 NEAR require user signature. New contract interactions require one-time approval. The agent queues pending actions and waits — it cannot bypass this gate.',
    },
  ];

  return (
    <div className="relative py-6">
      <div className="grid grid-cols-3 grid-rows-3 gap-3 max-w-lg mx-auto">
        {nodes.map((node) => (
          <div key={node.id} className={cn('flex flex-col items-center', node.x, node.y)}>
            <motion.div
              className={cn(
                'relative w-full p-3 rounded-xl border cursor-pointer transition-all text-center',
                activeNode === node.id
                  ? `bg-gradient-to-br ${node.color} ${node.border} shadow-lg`
                  : 'bg-surface border-border hover:border-border-hover'
              )}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            >
              <div className="text-2xl mb-1">{node.icon}</div>
              <p className="text-xs font-semibold text-text-primary">{node.label}</p>
              {node.id === 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>
        ))}
      </div>
      {/* Connection lines described textually */}
      <div className="mt-4 p-3 rounded-lg bg-surface border border-border">
        <p className="text-xs font-semibold text-text-muted mb-2">Trust Boundary Connections</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <span>💰</span><span className="text-text-muted">←→</span><span>🤖</span>
            <span className="text-emerald-400 ml-1">Wallet Access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🔗</span><span className="text-text-muted">←→</span><span>🤖</span>
            <span className="text-blue-400 ml-1">Delegation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📡</span><span className="text-text-muted">→</span><span>🤖</span>
            <span className="text-orange-400 ml-1">Read-only</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>👤</span><span className="text-text-muted">←→</span><span>🤖</span>
            <span className="text-yellow-400 ml-1">Approval Gate</span>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {activeNode !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-lg bg-surface border border-border text-sm text-text-secondary leading-relaxed">
              <span className="text-text-primary font-semibold">{nodes[activeNode].label}:</span>{' '}
              {nodes[activeNode].detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">Click each element to explore trust boundaries →</p>
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
  const correctAnswer = 1;

  const question = 'What is the safest way to give a NEAR AI agent transaction permissions?';
  const options = [
    'Full-access keys with monitoring and alerts',
    'Function-call access keys limited to specific contracts and methods',
    'Shared private keys with the agent operator',
    'No keys — use a relayer for all transactions',
  ];
  const explanation = 'Correct! Function-call access keys let you restrict exactly which contracts and methods an agent can call, plus set an allowance cap. This is NEAR\'s built-in permission model — granular and enforceable at the protocol level.';
  const wrongExplanation = 'Not quite. Function-call access keys limited to specific contracts and methods provide the strongest security — they enforce restrictions at the protocol level, not just in application code.';

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

interface ShadeAgentsProps {
  isActive: boolean;
  onToggle?: () => void;
}

const ShadeAgents: React.FC<ShadeAgentsProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['shade-agents']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['shade-agents'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Accordion Header */}
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Shade Agents</h3>
            <p className="text-text-muted text-sm">Autonomous AI agents on NEAR, trust boundaries, and agent-to-agent coordination</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 6 of 16</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">45 min</Badge>
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
                  Imagine hiring a personal assistant who has their own bank account, can make purchases on your behalf,
                  and coordinates with other assistants — but you set{' '}
                  <span className="text-purple-400 font-medium">strict spending limits and approval rules</span>.
                  That&apos;s a Shade Agent: an{' '}
                  <span className="text-near-green font-medium">AI with a NEAR wallet</span>, operating within boundaries
                  you define. The agent can act autonomously for small tasks but needs your signature for anything significant.
                  Trust is enforced at the <span className="text-near-green font-medium">key level</span>, not just in code.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Agent Trust Boundary Map</h4>
                <p className="text-sm text-text-muted mb-4">Explore the boundaries that constrain what a Shade Agent can and cannot do.</p>
                <AgentTrustBoundaryVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      An agent with a full-access key can drain your entire account! Always use{' '}
                      <span className="text-orange-400 font-medium">function-call access keys</span> with specific
                      contract/method restrictions and allowances.{' '}
                      <span className="text-orange-400 font-medium">Never give agents full-access keys in production.</span>{' '}
                      The full-access key should only ever be held by the human owner.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Bot}
                    title="Agent Architecture"
                    preview="Autonomous programs with NEAR wallets and decision-making capabilities."
                    details="A Shade Agent is a long-running program with its own NEAR account, a set of function-call access keys, and AI-driven decision logic. It monitors on-chain events, processes data feeds, and executes transactions autonomously. The agent maintains state (memory) both on-chain (contract storage) and off-chain (databases, vector stores) for persistent behavior across sessions."
                  />
                  <ConceptCard
                    icon={Lock}
                    title="Trust Boundaries"
                    preview="Spending limits, action allowlists, and human-in-the-loop gates."
                    details="Trust boundaries are the enforceable constraints on agent behavior. On NEAR, these are implemented through function-call access keys (which contracts/methods can be called), allowances (max gas/tokens per key), rate limits (max transactions per time period), and approval gates (human signature required above thresholds). Crucially, these are enforced at the protocol level — a compromised agent cannot bypass them."
                  />
                  <ConceptCard
                    icon={Network}
                    title="Agent-to-Agent Protocol"
                    preview="Standardized messaging and task delegation between agents."
                    details="Agents communicate through on-chain messages or signed off-chain payloads. Agent A can delegate a subtask to Agent B by posting a request with payment escrow. Agent B independently validates the request against its own rules before executing. Multi-agent workflows enable complex operations: one agent monitors prices, another executes trades, a third manages risk — each with its own isolated permissions."
                  />
                  <ConceptCard
                    icon={Key}
                    title="Function Call Permissions"
                    preview="NEAR's access key system for granular agent permissions."
                    details="NEAR accounts can have multiple access keys, each with different permission levels. A function-call access key specifies: which contract it can call, which methods are allowed, and a token allowance (max spend). When the allowance runs out, the key is useless. This is the foundation of agent security — permissions are enforced by validators, not by the agent's own code."
                  />
                  <ConceptCard
                    icon={Database}
                    title="Agent Memory"
                    preview="On-chain and off-chain state for persistent agent behavior."
                    details="Agents need memory to make informed decisions over time. On-chain memory (contract storage) provides tamper-proof state but is expensive. Off-chain memory (databases, IPFS) is cheap but requires trust. Hybrid approaches store critical state (balances, commitments) on-chain and operational state (conversation history, learned preferences) off-chain with periodic on-chain checkpoints."
                  />
                  <ConceptCard
                    icon={Settings}
                    title="Economic Incentives"
                    preview="Staking and reputation systems for agent accountability."
                    details="Agents can be required to stake tokens as a guarantee of good behavior. Misbehaving agents lose their stake (slashing). Reputation scores track agent performance over time — agents with better track records get priority for tasks and higher trust limits. This economic skin-in-the-game ensures that autonomous agents have something to lose."
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
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Key theft:</strong> Compromised agent leaks its access keys to an attacker</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Prompt injection:</strong> Crafted inputs manipulate agent decision-making logic</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Runaway spending:</strong> Bug in agent logic causes rapid, excessive transactions</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Agent impersonation:</strong> Fake agent claims to be a trusted participant</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Function-call-only keys:</strong> Stolen key can only call specific methods with limited allowance</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Input sanitization:</strong> Action allowlists prevent executing unrecognized commands</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Spending caps:</strong> Per-transaction and daily limits enforced at the key level</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">On-chain registry:</strong> Agent identity verified via staked registration contract</li>
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
                    'Shade Agents are autonomous AI programs with their own NEAR wallets and decision logic',
                    'Function-call access keys provide granular, protocol-enforced permission control',
                    'Trust boundaries must be enforced at the key level, not just in agent code — code can be bypassed, keys cannot',
                    'Agent-to-agent coordination enables complex multi-step workflows with isolated permissions',
                    'Always set spending limits and action allowlists — never give agents full-access keys in production',
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

export default ShadeAgents;
