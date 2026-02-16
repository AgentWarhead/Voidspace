'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, Code, Users,
  Vote, Gavel, Settings, UserPlus, UserMinus,
  FileText, Rocket, Lock, Scale,
} from 'lucide-react';

// ─── Interactive Governance Flow ────────────────────────────────────────────

function GovernanceFlowVisual() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      id: 0,
      label: 'Propose',
      icon: FileText,
      detail: 'A council member submits a proposal with a description, target action, and optional deposit bond. The proposal enters "InProgress" status and a voting period timer begins (configurable, typically 24-72 hours).',
      color: 'from-cyan-500/30 to-cyan-600/20',
      borderColor: 'border-cyan-500/40',
      textColor: 'text-cyan-400',
      status: 'Created',
    },
    {
      id: 1,
      label: 'Vote',
      icon: Vote,
      detail: 'Council members cast Approve, Reject, or Remove votes. Each member gets exactly one vote per proposal. Votes are recorded on-chain and cannot be changed. A quorum threshold must be met for the proposal to pass.',
      color: 'from-blue-500/30 to-blue-600/20',
      borderColor: 'border-blue-500/40',
      textColor: 'text-blue-400',
      status: 'Voting',
    },
    {
      id: 2,
      label: 'Execute',
      icon: Rocket,
      detail: 'Once the approval threshold is met (e.g., 2 of 3 council members), the proposal auto-executes. The DAO contract makes a cross-contract call to perform the action — transfer funds, add member, call function, etc.',
      color: 'from-indigo-500/30 to-indigo-600/20',
      borderColor: 'border-indigo-500/40',
      textColor: 'text-indigo-400',
      status: 'Approved',
    },
    {
      id: 3,
      label: 'Finalize',
      icon: CheckCircle2,
      detail: 'The proposal is marked as Approved or Rejected. If executed, the bond is returned. If rejected, the bond may be burned or redistributed depending on DAO policy. All results are recorded permanently on-chain.',
      color: 'from-emerald-500/30 to-emerald-600/20',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
      status: 'Finalized',
    },
  ];

  return (
    <div className="relative py-6">
      {/* Progress Bar */}
      <div className="mb-6 px-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-muted font-mono">Governance Pipeline</span>
          <span className="text-xs text-text-muted font-mono">Click each stage</span>
        </div>
        <div className="h-2 bg-surface border border-border rounded-full overflow-hidden flex">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className={cn(
                'h-full cursor-pointer flex-1',
                step.id === 0 ? 'bg-cyan-500/60' :
                step.id === 1 ? 'bg-blue-500/60' :
                step.id === 2 ? 'bg-indigo-500/60' : 'bg-emerald-500/60',
                activeStep === step.id && 'brightness-150'
              )}
              onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              whileHover={{ scaleY: 1.5 }}
            />
          ))}
        </div>
      </div>

      {/* Flow Steps */}
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
        {steps.map((step, i) => {
          const StepIcon = step.icon;
          return (
            <div key={step.id} className="flex items-center flex-shrink-0 w-full md:w-auto">
              <motion.div
                className={cn(
                  'relative rounded-xl p-3 border cursor-pointer transition-all w-full md:w-44',
                  `bg-gradient-to-br ${step.color} ${step.borderColor}`,
                  activeStep === step.id && 'ring-1 ring-white/20 shadow-lg'
                )}
                whileHover={{ scale: 1.03, y: -2 }}
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <StepIcon className={cn('w-4 h-4', step.textColor)} />
                  <span className={cn('text-xs font-bold font-mono', step.textColor)}>{step.label}</span>
                </div>
                <div className="text-[10px] text-text-muted">
                  <span>Status: {step.status}</span>
                </div>
                <AnimatePresence>
                  {activeStep === step.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 pt-2 border-t border-white/10 text-[10px] text-text-secondary leading-relaxed">
                        {step.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  className="hidden md:flex items-center mx-1"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                >
                  <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/30" />
                  <ArrowRight className="w-3 h-3 text-cyan-400/50" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-text-muted mt-4">
        Click each stage to explore the governance pipeline →
      </p>
    </div>
  );
}

// ─── Proposal Types Grid ────────────────────────────────────────────────────

function ProposalTypesGrid() {
  const types = [
    { icon: ArrowRight, label: 'Transfer', desc: 'Send NEAR or tokens to an account', color: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-600/10' },
    { icon: UserPlus, label: 'AddMember', desc: 'Add a new council member', color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/10' },
    { icon: UserMinus, label: 'RemoveMember', desc: 'Remove an existing council member', color: 'text-red-400', bg: 'from-red-500/20 to-red-600/10' },
    { icon: Settings, label: 'ChangePolicy', desc: 'Modify DAO voting thresholds or rules', color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/10' },
    { icon: Code, label: 'FunctionCall', desc: 'Call a method on any contract', color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-600/10' },
    { icon: Rocket, label: 'UpgradeCode', desc: 'Deploy new WASM to the DAO itself', color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {types.map((t) => (
        <Card key={t.label} variant="default" padding="sm" className="hover:border-border-hover transition-all">
          <div className="flex items-center gap-2 mb-1">
            <div className={cn('w-7 h-7 rounded-md bg-gradient-to-br flex items-center justify-center', t.bg)}>
              <t.icon className={cn('w-3.5 h-3.5', t.color)} />
            </div>
            <span className="text-xs font-bold text-text-primary font-mono">{t.label}</span>
          </div>
          <p className="text-[10px] text-text-muted leading-relaxed">{t.desc}</p>
        </Card>
      ))}
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

  const question = 'When does a DAO proposal auto-execute on NEAR?';
  const options = [
    'Immediately when any council member votes Approve',
    'After the voting period expires, regardless of votes',
    'As soon as the approval threshold is met (e.g., majority of council)',
    'Only when the proposer manually triggers execution',
  ];
  const explanation = 'Correct! On SputnikDAO (NEAR\'s standard DAO framework), proposals auto-execute the moment the required approval threshold is reached. If your policy says 2-of-3 council must approve, the action fires immediately when the second approval vote lands — no waiting for the period to end.';
  const wrongExplanation = 'Not quite. SputnikDAO proposals auto-execute as soon as the approval threshold is met (e.g., 2 of 3 council members approve). The action fires immediately when the deciding vote lands — there\'s no manual execution step and no need to wait for the period to expire.';

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

interface BuildingADaoContractProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function BuildingADaoContract({ isActive, onToggle }: BuildingADaoContractProps) {
  const [completed, setCompleted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('voidspace-module-dao-contract') === 'true';
    }
    return false;
  });

  const handleComplete = () => {
    setCompleted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('voidspace-module-dao-contract', 'true');
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-cyan-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building a DAO Contract</h3>
            <p className="text-text-muted text-sm">Proposals, voting, council management, multi-sig governance on NEAR</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20">45 min</Badge>
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
                  A DAO contract is a <span className="text-cyan-400 font-medium">programmable organization</span> living on-chain.
                  Think of it like a corporate board that runs on code: members submit proposals, vote on them, and the
                  contract <span className="text-blue-400 font-medium">automatically executes</span> approved actions — no
                  trusted intermediary needed. On NEAR, the SputnikDAO framework makes this pattern first-class, but
                  understanding the primitives lets you build <span className="text-indigo-400 font-medium">custom governance</span> for any use case.
                </p>
              </Card>

              {/* Interactive Governance Flow */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🏛️ Governance Pipeline</h4>
                <p className="text-sm text-text-muted mb-4">Follow a proposal from creation through voting to execution. Click each stage to learn the mechanics.</p>
                <GovernanceFlowVisual />
              </div>

              {/* Proposal Types */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">📋 Proposal Types</h4>
                <p className="text-sm text-text-muted mb-4">Every DAO action is initiated through a typed proposal. Here are the standard types in SputnikDAO v2:</p>
                <ProposalTypesGrid />
              </div>

              {/* Code Example */}
              <Card variant="default" padding="md" className="border-cyan-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-semibold text-text-primary text-sm">Simplified DAO — Proposals &amp; Voting</h4>
                </div>
                <pre className="text-xs text-text-secondary font-mono bg-surface rounded-lg p-4 overflow-x-auto leading-relaxed">
{`#[near(contract_state)]
pub struct DaoContract {
    council: Vec<AccountId>,
    proposals: Vec<Proposal>,
    approval_threshold: u32, // e.g., 2 for 2-of-3
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Proposal {
    proposer: AccountId,
    description: String,
    kind: ProposalKind,
    votes_approve: Vec<AccountId>,
    votes_reject: Vec<AccountId>,
    status: ProposalStatus,
}

#[near]
impl DaoContract {
    pub fn add_proposal(&mut self, description: String,
                        kind: ProposalKind) -> u64 {
        let proposer = env::predecessor_account_id();
        assert!(self.council.contains(&proposer),
                "Only council can propose");
        let id = self.proposals.len() as u64;
        self.proposals.push(Proposal {
            proposer, description, kind,
            votes_approve: vec![], votes_reject: vec![],
            status: ProposalStatus::InProgress,
        });
        id
    }

    pub fn vote(&mut self, id: u64, approve: bool) {
        let voter = env::predecessor_account_id();
        assert!(self.council.contains(&voter));
        let p = &mut self.proposals[id as usize];
        assert!(!p.votes_approve.contains(&voter)
             && !p.votes_reject.contains(&voter),
                "Already voted");
        if approve { p.votes_approve.push(voter); }
        else { p.votes_reject.push(voter); }
        // Auto-execute when threshold met
        if p.votes_approve.len() as u32
            >= self.approval_threshold {
            self.execute_proposal(id);
        }
    }
}`}
                </pre>
              </Card>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha: Compromised Council Members</h4>
                    <p className="text-sm text-text-secondary">
                      If a council member&apos;s private key is compromised, the attacker can vote on and potentially
                      pass <span className="text-orange-300 font-medium">any proposal</span> — especially dangerous
                      with low thresholds (2-of-3). Mitigation: use higher thresholds, implement time-locks on
                      high-value proposals, and add a &ldquo;veto&rdquo; mechanism where any council member can
                      emergency-pause execution. Consider requiring multi-sig wallets for council accounts themselves.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Users}
                    title="Council Management"
                    preview="Managing the set of privileged accounts that can propose and vote."
                    details="The council is the DAO's decision-making body. Members are stored as a Vec<AccountId> on-chain. Adding or removing members requires a proposal — the DAO governs itself. Best practice: start with 3-5 council members and a majority threshold. Consider role-based councils (e.g., separate 'treasury' and 'technical' councils) for larger organizations."
                  />
                  <ConceptCard
                    icon={FileText}
                    title="Proposal System"
                    preview="Typed proposals that describe actions the DAO should take."
                    details="Each proposal has a kind (Transfer, FunctionCall, AddMember, etc.), a description, and a bond deposit. The bond incentivizes quality proposals — spam proposals lose their deposit. Proposals have an expiry period; if not enough votes are cast before expiry, the proposal fails and the bond is returned. The proposal ID is sequential and immutable."
                  />
                  <ConceptCard
                    icon={Vote}
                    title="Voting Mechanism"
                    preview="On-chain voting with configurable thresholds and quorum requirements."
                    details="Voting is simple: each council member casts Approve, Reject, or Remove (spam flag). Votes are recorded on-chain and are immutable — no changing your vote. The threshold is configurable per proposal type: you might require 2-of-3 for transfers but 3-of-3 for code upgrades. Quorum can also be set to require minimum participation."
                  />
                  <ConceptCard
                    icon={Lock}
                    title="Multi-Sig Pattern"
                    preview="Using DAO mechanics to implement multi-signature authorization."
                    details="A multi-sig is really just a DAO with a high approval threshold. For a 3-of-5 multi-sig, create a DAO with 5 council members and threshold=3. Every transaction requires 3 signatures (votes) before execution. This is more flexible than traditional multi-sig — you get proposal descriptions, voting history, and configurable thresholds per action type."
                  />
                  <ConceptCard
                    icon={Rocket}
                    title="Action Execution"
                    preview="How approved proposals translate into on-chain actions via cross-contract calls."
                    details="When a proposal passes, the DAO contract executes the action via Promise API. For Transfer: Promise::new(recipient).transfer(amount). For FunctionCall: Promise::new(contract).function_call(method, args, deposit, gas). The DAO acts as the caller — the target contract sees the DAO's account_id as the predecessor. This means the DAO must have permission on target contracts."
                  />
                  <ConceptCard
                    icon={Scale}
                    title="Policy Configuration"
                    preview="Defining rules for who can propose, vote, and what thresholds apply."
                    details="DAO policy defines: who can propose (council only, or anyone with a bond), voting thresholds per proposal type, voting period duration, and bond amounts. Advanced policies include: weighted voting (token-based), delegation, rage-quit mechanics, and time-locked execution for high-value proposals. Policy changes themselves require proposals — the DAO's rules are self-governing."
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
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Key compromise — attacker gains council votes to pass malicious proposals draining treasury</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Governance griefing — spam proposals to exhaust council attention and sneak through a malicious one</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Flash proposal — low threshold + auto-execute means a compromised member can instantly drain funds</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Time-locks on high-value proposals — 24h delay between approval and execution for treasury operations</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Bond requirements — proposers stake NEAR that&apos;s slashed if proposal is spam-flagged by council</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Escalating thresholds — require unanimous vote for code upgrades and policy changes</li>
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
                    'DAOs on NEAR use typed proposals (Transfer, FunctionCall, AddMember, etc.) with on-chain voting',
                    'Proposals auto-execute when the approval threshold is met — no manual trigger needed',
                    'Multi-sig is just a DAO with high threshold — same pattern, more flexibility',
                    'Council key compromise is the #1 risk — use time-locks, bonds, and escalating thresholds',
                    'Policy changes require proposals too — the DAO governs its own rules recursively',
                    'Cross-contract calls from DAOs use the Promise API — the DAO account is the caller/signer',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <ArrowRight className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete */}
              {!completed && (
                <motion.button
                  onClick={handleComplete}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm hover:brightness-110 transition-all"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  ✓ Mark as Complete
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
