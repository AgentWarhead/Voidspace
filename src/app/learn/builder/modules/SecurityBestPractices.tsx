'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Shield, Lock, Eye, AlertTriangle,
  Bug, ShieldCheck, XCircle,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SecurityBestPracticesProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: Vulnerability Scanner ─────────────────────────────────

const vulnerabilities = [
  {
    id: 'access',
    label: 'Missing Access Control',
    severity: 'critical',
    icon: Lock,
    code: 'pub fn withdraw_all(&mut self) {\n  // Anyone can call this!\n  Promise::new(env::predecessor_account_id())\n    .transfer(self.balance);\n}',
    fix: '#[private]\npub fn withdraw_all(&mut self) {\n  self.assert_owner();\n  Promise::new(self.owner.clone())\n    .transfer(self.balance);\n}',
    explanation: 'Without access control, any account can call withdraw_all and drain the contract. Always verify the caller with assert_owner() or #[private] for callbacks.',
  },
  {
    id: 'callback',
    label: 'Unsafe Callback',
    severity: 'high',
    icon: AlertTriangle,
    code: 'pub fn withdraw(&mut self, amount: U128) {\n  self.balance -= amount.0;\n  // State changed BEFORE transfer!\n  Promise::new(account).transfer(amount.0);\n}',
    fix: 'pub fn withdraw(&mut self, amount: U128) {\n  self.pending.insert(&account, &amount.0);\n  Promise::new(account)\n    .transfer(amount.0)\n    .then(Self::on_withdraw_callback);\n}',
    explanation: 'State changes before async calls persist even if the call fails. Use the reserve-transfer-confirm pattern: track pending state, transfer, then finalize in a callback.',
  },
  {
    id: 'overflow',
    label: 'Integer Overflow',
    severity: 'high',
    icon: Bug,
    code: 'let total = balance + amount;\n// In release mode, Rust wraps on\n// overflow instead of panicking!',
    fix: 'let total = balance.checked_add(amount)\n  .unwrap_or_else(|| {\n    env::panic_str("Balance overflow")\n  });',
    explanation: 'Rust wraps on overflow in release mode (not debug). Always use checked_add, checked_sub, checked_mul for any arithmetic involving user-controlled values.',
  },
  {
    id: 'deposit',
    label: 'Missing Deposit Check',
    severity: 'medium',
    icon: Eye,
    code: '#[payable]\npub fn ft_transfer(&mut self, ..) {\n  // No deposit validation!\n  self.internal_transfer(..);\n}',
    fix: '#[payable]\npub fn ft_transfer(&mut self, ..) {\n  require!(\n    env::attached_deposit()\n      == NearToken::from_yoctonear(1),\n    "Requires 1 yoctoNEAR"\n  );\n  self.internal_transfer(..);\n}',
    explanation: 'FT transfers require exactly 1 yoctoNEAR attached to confirm user intent and prevent accidental calls. Without this check, scripts could drain tokens without user confirmation.',
  },
  {
    id: 'dos',
    label: 'Denial of Service',
    severity: 'medium',
    icon: XCircle,
    code: 'pub fn get_all_users(&self) -> Vec<User> {\n  // Loads EVERYTHING into memory!\n  self.users.values().collect()\n}',
    fix: 'pub fn get_users(\n  &self,\n  from: u64,\n  limit: u64,\n) -> Vec<&User> {\n  self.users.iter()\n    .skip(from as usize)\n    .take(limit as usize)\n    .collect()\n}',
    explanation: 'Unbounded iteration can exceed the gas limit, making the function uncallable as data grows. Always use pagination with from_index and limit parameters.',
  },
];

function VulnerabilityScanner() {
  const [activeVuln, setActiveVuln] = useState<string | null>(null);
  const [showFix, setShowFix] = useState(false);
  const [scannedCount, setScannedCount] = useState(0);

  const active = vulnerabilities.find((v) => v.id === activeVuln);

  const handleScan = (id: string) => {
    if (activeVuln !== id) {
      setShowFix(false);
      setActiveVuln(id);
      if (!activeVuln || !vulnerabilities.find((v) => v.id === activeVuln)) {
        setScannedCount((c) => Math.min(c + 1, vulnerabilities.length));
      }
    } else {
      setActiveVuln(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Scanner header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono text-red-400">VULNERABILITY SCANNER</span>
        </div>
        <Badge className="bg-red-500/10 text-red-300 border-red-500/20 text-xs">
          {scannedCount}/{vulnerabilities.length} found
        </Badge>
      </div>

      {/* Vulnerability list */}
      <div className="space-y-2">
        {vulnerabilities.map((vuln) => {
          const Icon = vuln.icon;
          return (
            <motion.button
              key={vuln.id}
              onClick={() => handleScan(vuln.id)}
              className={cn(
                'w-full rounded-lg border p-3 text-left transition-all',
                activeVuln === vuln.id
                  ? 'border-red-500/50 bg-red-500/10'
                  : 'border-border bg-black/20 hover:border-red-500/30'
              )}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    vuln.severity === 'critical' ? 'bg-red-500/20' :
                    vuln.severity === 'high' ? 'bg-orange-500/20' : 'bg-yellow-500/20'
                  )}>
                    <Icon className={cn(
                      'w-4 h-4',
                      vuln.severity === 'critical' ? 'text-red-400' :
                      vuln.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
                    )} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">{vuln.label}</span>
                    <Badge className={cn(
                      'ml-2 text-xs',
                      vuln.severity === 'critical' ? 'bg-red-500/10 text-red-300 border-red-500/20' :
                      vuln.severity === 'high' ? 'bg-orange-500/10 text-orange-300 border-orange-500/20' :
                      'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
                    )}>
                      {vuln.severity}
                    </Badge>
                  </div>
                </div>
                <ChevronDown className={cn(
                  'w-4 h-4 text-text-muted transition-transform',
                  activeVuln === vuln.id && 'rotate-180'
                )} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-red-500/30 bg-black/30 p-4 space-y-3">
              <div>
                <p className="text-xs font-mono text-red-400 mb-2">VULNERABLE CODE:</p>
                <pre className="bg-black/60 rounded p-3 text-xs font-mono text-text-secondary overflow-x-auto border border-red-500/20">
                  {active.code}
                </pre>
              </div>

              <button
                onClick={() => setShowFix(!showFix)}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                {showFix ? 'Hide Fix' : 'Show Fix'}
              </button>

              <AnimatePresence>
                {showFix && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-2"
                  >
                    <p className="text-xs font-mono text-emerald-400">FIXED CODE:</p>
                    <pre className="bg-black/60 rounded p-3 text-xs font-mono text-text-secondary overflow-x-auto border border-emerald-500/20">
                      {active.fix}
                    </pre>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {active.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-text-muted">
        Click each vulnerability to inspect the code and learn the fix
      </p>
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType;
  title: string;
  preview: string;
  details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card variant="glass" padding="md" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-400" />
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
    </Card>
  );
}

// ─── Mini Quiz ─────────────────────────────────────────────────────────────────

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 2;
  const options = [
    'NEAR contracts are immune to reentrancy because all calls are synchronous',
    'The #[payable] macro automatically validates the correct deposit amount',
    'State changes before a cross-contract call persist even if the callback fails',
    'Rust release builds always panic on integer overflow, preventing exploits',
  ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">
        Which statement about NEAR smart contract security is correct?
      </p>
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
            <span className="font-mono text-xs mr-2 opacity-50">
              {String.fromCharCode(65 + i)}.
            </span>
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-4 p-3 rounded-lg text-sm',
              selected === correctAnswer
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            )}
          >
            {selected === correctAnswer
              ? 'Correct! Cross-contract calls on NEAR are async -- they execute in the next block. Any state changes made before the Promise call persist regardless of whether the callback succeeds or fails.'
              : 'Not quite. The key insight is that NEAR cross-contract calls are async. State changes before a Promise persist even if the remote call fails. This is why the reserve-transfer-confirm pattern is critical.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const SecurityBestPractices: React.FC<SecurityBestPracticesProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['security-best-practices']) setCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['security-best-practices'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-red-500/20">
      {/* Accordion Header */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            completed
              ? 'bg-gradient-to-br from-emerald-500 to-green-600'
              : 'bg-gradient-to-br from-red-500 to-orange-500'
          )}>
            {completed ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Security Best Practices</h3>
            <p className="text-text-muted text-sm">Protect your contracts from common vulnerabilities and attacks</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Complete</Badge>
          )}
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">60 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-red-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-xs text-red-400">
                <BookOpen className="w-3 h-3" />
                Module 19 of 22
                <span className="text-text-muted">|</span>
                <Clock className="w-3 h-3" />
                60 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Smart contract security is like{' '}
                  <span className="text-red-400 font-medium">building a bank vault</span>.
                  You are not just protecting against honest mistakes -- you are defending against
                  active attackers who will try every possible exploit. On NEAR, the async execution
                  model creates unique security challenges: cross-contract calls execute in the next
                  block, state changes before callbacks persist even on failure, and Rust release builds
                  silently wrap on integer overflow. Understanding these patterns is the difference
                  between a secure contract and a multimillion-dollar exploit.
                </p>
              </Card>

              {/* Warning Banner */}
              <Card variant="default" padding="md" className="border-red-500/20 bg-red-500/5">
                <p className="text-sm text-text-secondary">
                  <span className="text-red-400 font-semibold">Critical module:</span> Security bugs
                  in smart contracts can lead to permanent, irreversible loss of funds. Every builder
                  MUST understand these patterns before deploying to mainnet.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {'\u{1F6E1}'} Vulnerability Scanner
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Inspect common NEAR contract vulnerabilities. Click each one to see the
                  vulnerable code and learn the fix.
                </p>
                <VulnerabilityScanner />
              </div>

              {/* Security Checklist */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {'\u{1F4CB}'} Pre-Deployment Security Checklist
                </h3>
                <div className="bg-black/30 rounded-lg p-4 border border-border">
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> Every change method has access control checks</li>
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> Callback methods are marked <code className="text-purple-400">#[private]</code></li>
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> All arithmetic uses checked operations</li>
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> Attached deposits are validated</li>
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> Cross-contract callback results are checked</li>
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> Storage costs are covered by the caller</li>
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> No unbounded iterations (gas limit attacks)</li>
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> Error messages do not leak sensitive info</li>
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> Full access key removed for locked contracts</li>
                    <li className="flex items-start gap-2"><span className="text-near-green">{'[ ]'}</span> Contract tested with malicious inputs</li>
                  </ul>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Key Insight
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="text-red-400 font-medium">The 1 yoctoNEAR pattern</span> is a
                  critical security measure. Token transfer methods (ft_transfer, nft_transfer) require
                  exactly 1 yoctoNEAR attached. This is not about the money -- it is a{' '}
                  <span className="text-red-400 font-medium">confirmation of user intent</span>.
                  Since function-call access keys cannot attach deposits, this ensures only the account
                  owner (via full-access key or wallet approval) can authorize transfers. Without it,
                  any dApp with a function-call key could silently drain tokens.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  {'\u{1F9E9}'} Core Security Patterns
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Lock}
                    title="Access Control Patterns"
                    preview="Owner-only, role-based, and self-only checks for every method"
                    details="Use assert_owner() for admin functions, #[private] for callback methods (ensures only the contract itself can call them), and role-based checks with allowlists for multi-party systems. Never leave a change method without access control -- it is the most common vulnerability in audited contracts."
                  />
                  <ConceptCard
                    icon={AlertTriangle}
                    title="Async Safety (Reserve-Transfer-Confirm)"
                    preview="Handle state correctly across async cross-contract calls"
                    details="NEAR cross-contract calls are async -- they execute in the next block. The safe pattern: (1) Reserve/lock the state change in a pending map, (2) Make the cross-contract call, (3) In the callback, confirm or rollback based on the promise result. Never modify final state before the async call completes."
                  />
                  <ConceptCard
                    icon={Bug}
                    title="Integer Safety in Rust"
                    preview="Prevent silent overflow in release builds"
                    details="Rust debug builds panic on overflow, but release builds silently wrap. Since contracts deploy as release WASM, use checked_add(), checked_sub(), checked_mul() for all arithmetic with user-controlled values. Alternatively, add overflow-checks = true to your Cargo.toml release profile."
                  />
                  <ConceptCard
                    icon={Eye}
                    title="Storage and DoS Prevention"
                    preview="Prevent attackers from making your contract unusable"
                    details="Never iterate over unbounded collections in a single call -- an attacker can grow the collection until the function exceeds gas limits. Use pagination with from_index and limit. Also require storage deposits from users (NEP-145) so attackers pay for their own data, preventing storage spam attacks."
                  />
                </div>
              </div>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-red-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'Every change method needs explicit access control -- missing checks are the #1 vulnerability',
                    'Cross-contract calls are async: state changes before callbacks persist even on failure',
                    'Use checked arithmetic (checked_add, checked_sub) since release builds wrap on overflow',
                    'Require 1 yoctoNEAR on token transfers to confirm user intent and prevent unauthorized drains',
                    'Paginate all collection queries and require storage deposits to prevent DoS attacks',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-near-green mt-0.5 font-bold">{'\u2192'}</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete */}
              <div className="flex justify-center pt-2">
                <motion.button
                  onClick={handleComplete}
                  disabled={completed}
                  className={cn(
                    'px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2',
                    completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/20'
                  )}
                  whileHover={completed ? {} : { scale: 1.03, y: -1 }}
                  whileTap={completed ? {} : { scale: 0.97 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {completed ? 'Module Completed' : 'Mark as Complete'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default SecurityBestPractices;
