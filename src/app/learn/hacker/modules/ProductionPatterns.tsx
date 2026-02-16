'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  AlertTriangle, ArrowRight, Shield, Settings, Activity,
  GitBranch, Server, Lock, RefreshCw, Eye, Layers,
} from 'lucide-react';

// ─── Interactive Visual: Deployment Lifecycle ───────────────────────────────

function DeploymentLifecycle() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      label: 'Development',
      icon: '💻',
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
      checklist: [
        'Unit tests with near-workspaces-rs or sandbox',
        'Property-based testing for edge cases',
        'Gas profiling on all public methods',
        'Storage layout documentation',
        'Threat model document',
      ],
    },
    {
      label: 'Audit',
      icon: '🔍',
      color: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/30',
      checklist: [
        'Internal security review (checklist-based)',
        'External audit by reputable firm',
        'Fix all critical/high findings',
        'Re-audit after significant changes',
        'Publish audit report publicly',
      ],
    },
    {
      label: 'Testnet',
      icon: '🧪',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      checklist: [
        'Deploy to testnet with production config',
        'Integration testing with real RPC calls',
        'Load testing for gas and throughput limits',
        'Verify upgrade path from scratch',
        'Soak test for 48+ hours',
      ],
    },
    {
      label: 'Canary',
      icon: '🐤',
      color: 'from-amber-500/20 to-yellow-500/20',
      border: 'border-amber-500/30',
      checklist: [
        'Deploy to mainnet sub-account first',
        'Limit initial TVL with deposit caps',
        'Monitor for 7+ days before full launch',
        'Compare on-chain behavior with testnet',
        'Verify all monitoring alerts are firing',
      ],
    },
    {
      label: 'Mainnet',
      icon: '🚀',
      color: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      checklist: [
        'Deploy via multisig with timelock',
        'Verify deployed code matches audited code',
        'Announce deployment publicly',
        'Gradually raise deposit/withdrawal limits',
        'Bug bounty program live',
      ],
    },
    {
      label: 'Monitor',
      icon: '📊',
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30',
      checklist: [
        'Real-time transaction monitoring',
        'Balance change alerts for contract accounts',
        'Failed transaction rate tracking',
        'Gas usage anomaly detection',
        'Uptime monitoring for all dependencies',
      ],
    },
    {
      label: 'Incident',
      icon: '🚨',
      color: 'from-red-500/20 to-orange-500/20',
      border: 'border-red-500/30',
      checklist: [
        'PAUSE the contract immediately',
        'Assess scope and impact',
        'Communicate with users (status page)',
        'Develop and test the fix',
        'Post-mortem within 48 hours',
      ],
    },
    {
      label: 'Hotfix',
      icon: '🔧',
      color: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/30',
      checklist: [
        'Emergency audit of the fix',
        'Test on testnet fork of mainnet state',
        'Deploy via multisig (expedited timelock)',
        'Unpause with rate limits active',
        'Monitor intensely for 72 hours',
      ],
    },
  ];

  return (
    <div className="relative py-6">
      {/* Circular flow represented as grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.label}
            className={cn(
              'rounded-xl border p-3 cursor-pointer transition-all text-center',
              activeStage === i
                ? `bg-gradient-to-br ${stage.color} ${stage.border} shadow-lg`
                : 'bg-surface border-border hover:border-border-hover'
            )}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveStage(activeStage === i ? null : i)}
          >
            <span className="text-xl">{stage.icon}</span>
            <p className="text-xs font-semibold text-text-primary mt-1">{stage.label}</p>
            <p className="text-[10px] text-text-muted">Step {i + 1}</p>
          </motion.div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {activeStage !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <Card variant="default" padding="md" className="border-green-500/20 bg-green-500/5">
              <p className="text-sm font-bold text-green-400 mb-3">
                {stages[activeStage].icon} {stages[activeStage].label} — Checklist
              </p>
              <ul className="space-y-1.5">
                {stages[activeStage].checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                    <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        Click each stage to see the checklist — the cycle never ends →
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-green-400" />
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

  const question = 'What is the FIRST action you should take when a mainnet vulnerability is discovered?';
  const options = [
    'Pause the contract to prevent further exploitation',
    'Deploy a fix immediately to patch the vulnerability',
    'Announce the vulnerability publicly so users can withdraw',
    'Contact the attacker to negotiate a white-hat bounty',
  ];
  const explanation = 'Correct! Pause first, then assess. Deploying a fix before understanding the full scope can introduce new bugs. Public announcement before pausing gives attackers a window. Always pause → assess → fix → deploy → post-mortem.';
  const wrongExplanation = 'Not quite. The first action is always to PAUSE the contract. Deploying untested fixes, public announcements, or attacker negotiations all take time during which funds remain at risk. Pause stops the bleeding immediately.';

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

interface ProductionPatternsProps {
  isActive: boolean;
  onToggle: () => void;
}

const ProductionPatterns: React.FC<ProductionPatternsProps> = ({ isActive, onToggle }) => {
  return (
    <Card variant="glass" padding="none" className="border-green-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Production Patterns</h3>
            <p className="text-text-muted text-sm">Upgrade strategies, monitoring, incident response, and battle-tested deployment patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            <div className="border-t border-green-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Shipping a smart contract to mainnet is like launching a satellite — once it&apos;s up there, you can&apos;t easily
                  bring it back for repairs. You need redundancy, remote update capabilities, monitoring systems, and a
                  <span className="text-green-400 font-medium"> mission control team</span> ready for anomalies. Production
                  patterns are your <span className="text-near-green font-medium">mission control playbook</span> — the
                  difference between a controlled response and a panicked scramble when things go wrong.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔄 Deployment Lifecycle</h4>
                <p className="text-sm text-text-muted mb-4">From code to mainnet and back again. Each stage has a checklist — skip one at your peril.</p>
                <DeploymentLifecycle />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      A contract without a <span className="text-orange-400 font-medium">pause mechanism</span> is a ticking time
                      bomb! When (not if) a vulnerability is discovered, you need to be able to halt the contract immediately while
                      you prepare a fix. Without it, you&apos;re watching funds drain while frantically deploying an untested patch.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Layers}
                    title="Upgrade Patterns"
                    preview="Proxy contracts, migration functions, versioned storage for safe upgrades."
                    details="NEAR supports code deployment to existing accounts, but storage layout changes can corrupt state. Versioned storage (enum-based state with migration functions) is the safest approach. Each version knows how to migrate from the previous one. Proxy patterns delegate calls to a logic contract that can be swapped. Always test the full upgrade path: deploy v1 → populate state → upgrade to v2 → verify all state migrated correctly."
                  />
                  <ConceptCard
                    icon={Shield}
                    title="Contract Guards"
                    preview="Pausability, rate limiting, withdrawal limits — circuit breakers for smart contracts."
                    details="Guards are defensive mechanisms built into your contract. Pausability lets an admin halt all operations. Rate limiting caps how much value can flow through in a time window (e.g., max 10,000 NEAR/hour in withdrawals). Withdrawal limits create a delay for large operations, giving you time to detect and respond. Think of these as circuit breakers — they trip before the system catches fire."
                  />
                  <ConceptCard
                    icon={Activity}
                    title="Monitoring & Alerting"
                    preview="Watching for anomalous transactions, balance changes, and failed calls."
                    details="Monitor everything: contract balance changes, function call patterns, gas usage anomalies, failed transaction rates, and unusual account interactions. Set up alerts for: balance drops > X%, spike in failed calls, calls from unknown accounts to admin functions, and any call to upgrade/migrate functions. Use indexers to build dashboards showing contract health in real-time."
                  />
                  <ConceptCard
                    icon={AlertTriangle}
                    title="Incident Response"
                    preview="Steps when something goes wrong: pause, assess, fix, deploy, post-mortem."
                    details="The incident response playbook: 1) PAUSE — stop all contract interactions immediately. 2) ASSESS — understand the vulnerability scope and funds at risk. 3) COMMUNICATE — notify users via status page without revealing exploit details. 4) FIX — develop and thoroughly test the fix on testnet. 5) DEPLOY — upgrade via multisig with expedited review. 6) UNPAUSE — gradually with rate limits. 7) POST-MORTEM — within 48 hours, publish what happened and how you're preventing it."
                  />
                  <ConceptCard
                    icon={RefreshCw}
                    title="Storage Migration"
                    preview="Safely transforming on-chain state when upgrading contract logic."
                    details="When your new contract version changes the storage layout, you need a migration function that transforms old state to new state. Critical rules: migrations must be idempotent (running twice is safe), reversible (you can roll back), and bounded (lazy migration for large collections, eager for small ones). Always snapshot state before migrating. Test with a mainnet state dump on testnet."
                  />
                  <ConceptCard
                    icon={GitBranch}
                    title="Deployment Strategy"
                    preview="Testnet → canary → staged mainnet rollout with verification at each step."
                    details="Never deploy directly to mainnet. The pipeline: testnet with full integration tests → mainnet canary (sub-account with limited TVL) → mainnet with deposit caps → full mainnet. At each stage, verify: code hash matches audited code, all functions behave as expected, monitoring alerts fire correctly. Use multisig with timelock for all mainnet deployments — no single person should be able to deploy alone."
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
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Upgrade hijacking:</strong> Attacker gains deploy access and pushes malicious code</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Storage corruption:</strong> Buggy migration function destroys on-chain state</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Monitoring blind spots:</strong> Attacker exploits an unmonitored function path</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Social engineering:</strong> Phishing deployer keys from team members</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Multisig upgrade governance with mandatory timelock delays</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Reversible migrations with pre-migration state backup snapshots</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Comprehensive event logging and anomaly detection on all paths</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Hardware wallets and ceremony-based deployments for key security</li>
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
                    'Every production contract needs a pause mechanism — it\'s your emergency brake.',
                    'Use proxy patterns or versioned storage for safe, reversible upgrades.',
                    'Monitor all contract interactions — anomaly detection catches exploits early.',
                    'Incident response: Pause → Assess → Fix → Deploy → Post-mortem.',
                    'Storage migrations must be reversible — test extensively on testnet first.',
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

export default ProductionPatterns;
