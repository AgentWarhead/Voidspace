'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, ClipboardCheck, Shield, Rocket,
  Users, Megaphone, FileCheck, AlertCircle, Trophy,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LaunchChecklistProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: Launch Readiness Tracker ──────────────────────────────

const checklistCategories = [
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    items: [
      'All methods have proper access control',
      'Callbacks are marked #[private]',
      'Arithmetic uses checked operations',
      'Attached deposits are validated',
      'Cross-contract callback results checked',
      'No unbounded iterations',
      'Tested with malicious inputs',
    ],
  },
  {
    id: 'quality',
    label: 'Code Quality',
    icon: FileCheck,
    color: 'from-blue-500 to-cyan-500',
    items: [
      'Unit tests cover all methods',
      'Integration tests pass',
      'Zero compiler warnings',
      'WASM binary is optimized',
      'NEP standards correctly implemented',
      'NEP-297 events emitted',
      'Clear error messages',
    ],
  },
  {
    id: 'deployment',
    label: 'Deployment',
    icon: Rocket,
    color: 'from-green-500 to-emerald-500',
    items: [
      'Deployed and tested on testnet',
      'Mainnet account created with proper naming',
      'Contract initialized correctly',
      'Unnecessary full-access keys removed',
      'Sufficient NEAR balance for storage',
      'Frontend variables set for mainnet',
      'WASM hash verified on NearBlocks',
    ],
  },
  {
    id: 'docs',
    label: 'Documentation',
    icon: Users,
    color: 'from-purple-500 to-violet-500',
    items: [
      'README with setup and usage',
      'Contract API documented',
      'Architecture diagram',
      'Deployment instructions',
      'NEP-330 source metadata configured',
      'License file included',
    ],
  },
];

function LaunchReadinessTracker() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>('security');

  const toggleItem = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = checklistCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const percentage = Math.round((checkedCount / totalItems) * 100);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-near-green">LAUNCH READINESS</span>
          <span className={cn(
            'font-bold',
            percentage === 100 ? 'text-near-green' : percentage > 50 ? 'text-yellow-400' : 'text-red-400'
          )}>
            {percentage}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-black/40 border border-border overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              percentage === 100 ? 'bg-gradient-to-r from-near-green to-emerald-500' :
              percentage > 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
              'bg-gradient-to-r from-red-500 to-orange-500'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-text-muted">
          {checkedCount} of {totalItems} items checked
          {percentage === 100 && ' -- Ready to launch!'}
        </p>
      </div>

      {/* Category tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {checklistCategories.map((cat) => {
          const Icon = cat.icon;
          const catChecked = cat.items.filter((_, i) => checked[`${cat.id}-${i}`]).length;
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={cn(
                'rounded-lg border p-3 text-left transition-all',
                activeCategory === cat.id
                  ? 'border-near-green/50 bg-near-green/10'
                  : 'border-border bg-black/20 hover:border-near-green/30'
              )}
              whileHover={{ scale: 1.02 }}
            >
              <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2', cat.color)}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-semibold text-text-primary">{cat.label}</div>
              <div className="text-xs text-text-muted">{catChecked}/{cat.items.length}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Active category items */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-near-green/20 bg-black/20 p-4 space-y-2">
              {checklistCategories.find((c) => c.id === activeCategory)?.items.map((item, i) => {
                const key = `${activeCategory}-${i}`;
                const isChecked = checked[key];
                return (
                  <motion.button
                    key={key}
                    onClick={() => toggleItem(key)}
                    className={cn(
                      'w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm transition-all',
                      isChecked
                        ? 'bg-near-green/10 text-near-green'
                        : 'text-text-secondary hover:bg-white/[0.02]'
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                      isChecked
                        ? 'bg-near-green border-near-green'
                        : 'border-border'
                    )}>
                      {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={isChecked ? 'line-through opacity-70' : ''}>{item}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-text-muted">
        Check off items as you complete them -- track your launch readiness
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-near-green/20 to-emerald-500/20 border border-near-green/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-near-green" />
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
  const correctAnswer = 0;
  const options = [
    'Deploy and test on testnet first, then deploy to mainnet after verifying all checks pass',
    'Deploy directly to mainnet to save time -- testnet behavior may differ anyway',
    'Skip the security audit since Rust prevents most vulnerabilities automatically',
    'Remove all access keys from the contract immediately after deployment',
  ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">
        What is the correct deployment strategy for a production NEAR contract?
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
              ? 'Correct! Always deploy to testnet first. Run your full test suite, verify all checklist items, and only then deploy to mainnet. Testnet is free and catches most issues before real money is at risk.'
              : 'Not quite. The golden rule is: testnet first, always. Never skip to mainnet. Security audits are valuable for high-value contracts. And removing all access keys should only be done intentionally to lock a contract -- not immediately after deployment.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const LaunchChecklist: React.FC<LaunchChecklistProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['launch-checklist']) setCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['launch-checklist'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
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
              : 'bg-gradient-to-br from-near-green to-emerald-500'
          )}>
            {completed ? <CheckCircle2 className="w-6 h-6 text-white" /> : <ClipboardCheck className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Launch Checklist</h3>
            <p className="text-text-muted text-sm">Everything you need before going live on mainnet</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Complete</Badge>
          )}
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">30 min</Badge>
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
            <div className="border-t border-near-green/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green">
                <BookOpen className="w-3 h-3" />
                Module 22 of 22
                <span className="text-text-muted">|</span>
                <Clock className="w-3 h-3" />
                30 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-near-green/20 to-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-near-green" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Launching a smart contract is like{' '}
                  <span className="text-near-green font-medium">launching a satellite</span> --
                  once it is in orbit, you cannot easily bring it back for repairs. Unlike traditional
                  software where you can hotfix bugs, smart contract deployments on mainnet handle real
                  money from day one. This checklist ensures you have covered every angle: security,
                  code quality, deployment, documentation, and community. Miss one critical item and
                  it could cost your users everything.
                </p>
              </Card>

              {/* Final Module Banner */}
              <Card variant="default" padding="md" className="border-near-green/20 bg-near-green/5">
                <p className="text-sm text-text-secondary">
                  <span className="text-near-green font-semibold">Final module!</span> If you have
                  completed every module in the Builder track, you are ready to ship. This checklist
                  ensures you have not missed anything critical.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {'\u{1F680}'} Launch Readiness Tracker
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Track your pre-launch progress. Check off items as you complete them.
                </p>
                <LaunchReadinessTracker />
              </div>

              {/* Post-Launch Monitoring */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {'\u{1F50D}'} Post-Launch Monitoring
                </h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'# Monitor your contract on NearBlocks'}</div>
                  <div><span className="text-near-green">near</span> view your-contract.near get_status</div>
                  <div className="mt-2 text-text-muted">{'# Check recent transactions for errors'}</div>
                  <div><span className="text-near-green">near</span> txs your-contract.near --limit 20</div>
                  <div className="mt-2 text-text-muted">{'# Monitor storage usage and balance'}</div>
                  <div><span className="text-near-green">near</span> state your-contract.near</div>
                  <div className="mt-2 text-text-muted">{'# Set up alerts for unusual activity'}</div>
                  <div><span className="text-text-muted">{'// Use NearBlocks API or NEAR Lake indexer'}</span></div>
                  <div><span className="text-text-muted">{'// for automated monitoring and alerting'}</span></div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-near-green/10 to-emerald-500/5 border border-near-green/20 rounded-xl p-5">
                <h4 className="font-semibold text-near-green text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Key Insight
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="text-near-green font-medium">Plan your upgrade path before launch</span>.
                  Use versioned state (e.g., an enum with V1, V2 variants) so you can migrate data when
                  upgrading the contract. If you need immutability for trust, remove all full-access keys
                  after deployment -- but only after thorough testing. A locked contract cannot be fixed.
                  For most projects, keep a multisig-controlled upgrade key during the early phase.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  {'\u{1F9E9}'} Launch Essentials
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Shield}
                    title="Security Audits"
                    preview="When and how to get your contract professionally audited"
                    details="For DeFi and high-value contracts, a professional audit is essential. Firms like Blocksec, Halborn, and OtterSec specialize in NEAR audits. Budget 2-4 weeks and $10K-$50K depending on complexity. Start the audit process early -- auditors are often booked months in advance. Even without a formal audit, have at least two experienced developers review your code."
                  />
                  <ConceptCard
                    icon={AlertCircle}
                    title="Incident Response Plan"
                    preview="What to do when something goes wrong on mainnet"
                    details="Have a plan before you need one. Include: (1) A pause mechanism in your contract (owner_pause toggle), (2) Emergency contacts for your team, (3) A communication template for your community, (4) Steps to investigate and diagnose, (5) A known path to deploy a fix (if contract is upgradable). Practice your response with your team before launch."
                  />
                  <ConceptCard
                    icon={Megaphone}
                    title="Community and Ecosystem"
                    preview="Get your dApp discovered and used by the NEAR ecosystem"
                    details="Submit to NEAR Discovery (near.org). Post on the NEAR Forum (gov.near.org). Share on X/Twitter with #NEARProtocol. Apply for NEAR Foundation grants for funding. Create a Discord or Telegram for your community. Write a launch blog post. Engage with NEAR DevHub for developer support and visibility."
                  />
                  <ConceptCard
                    icon={Rocket}
                    title="Upgrade Strategy"
                    preview="Plan for contract evolution from day one"
                    details="Use versioned state with enums (StateV1, StateV2) for clean migrations. Store a contract version number for compatibility checks. For the upgrade mechanism, choose between: (1) Full-access key upgrades (simplest but requires trust), (2) DAO-governed upgrades (decentralized but slower), (3) Proxy pattern (complex but flexible). Most teams start with a multisig key and transition to DAO governance as the project matures."
                  />
                </div>
              </div>

              {/* Congratulations */}
              <Card variant="default" padding="lg" className="border-near-green/30 bg-near-green/5">
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-near-green mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-near-green mb-2">Congratulations, Builder!</h4>
                  <p className="text-text-secondary max-w-lg mx-auto">
                    You have completed the entire Builder track. You now have the knowledge to design,
                    build, test, secure, and deploy production-quality smart contracts on NEAR Protocol.
                    Go build something amazing!
                  </p>
                </div>
              </Card>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'Always deploy to testnet first and run your full test suite before touching mainnet',
                    'Get a security audit for DeFi/high-value contracts -- budget 2-4 weeks and plan early',
                    'Have an incident response plan with pause mechanism, contacts, and communication templates',
                    'Plan your upgrade path from day one: versioned state, migration functions, and governance',
                    'Community building is part of the launch -- documentation, socials, and ecosystem integration matter',
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
                      : 'bg-gradient-to-r from-near-green to-emerald-500 text-white hover:shadow-lg hover:shadow-near-green/20'
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

export default LaunchChecklist;
