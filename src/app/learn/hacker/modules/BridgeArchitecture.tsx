'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, Link as LinkIcon, Lock,
  Globe, Network, Eye, Users, Layers, Server,
} from 'lucide-react';

// ─── Interactive Visual: Bridge Comparison Matrix ───────────────────────────

function BridgeComparisonVisual() {
  const [activeBridge, setActiveBridge] = useState<number | null>(null);

  const bridges = [
    {
      type: 'Centralized',
      icon: '🏦',
      trust: 'Single custodian',
      speed: '~minutes',
      cost: 'Low',
      security: 'Low',
      color: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500/30',
      details: 'A single entity holds custody of assets. Fast and cheap, but you must fully trust the operator. If the custodian is compromised, all bridged assets are at risk. Examples: most CEX bridges.',
    },
    {
      type: 'Multisig',
      icon: '👥',
      trust: 'Committee (M of N)',
      speed: '~minutes',
      cost: 'Low-Medium',
      security: 'Medium',
      color: 'from-orange-500/20 to-amber-500/20',
      borderColor: 'border-orange-500/30',
      details: 'A committee of signers must agree on transfers. Better than centralized — requires colluding majority. But if enough signers are compromised (or collude), assets are at risk. Examples: Wormhole, Multichain.',
    },
    {
      type: 'Optimistic',
      icon: '⏳',
      trust: 'Fraud proofs',
      speed: '~hours-days',
      cost: 'Medium',
      security: 'High',
      color: 'from-amber-500/20 to-yellow-500/20',
      borderColor: 'border-amber-500/30',
      details: 'Assumes transfers are valid unless challenged. A challenge period (hours to days) allows watchers to submit fraud proofs. Secure if at least one honest watcher exists. Slower due to the challenge window.',
    },
    {
      type: 'Light Client',
      icon: '🔐',
      trust: 'Cryptographic proofs',
      speed: '~10-30 min',
      cost: 'Higher',
      security: 'Highest',
      color: 'from-emerald-500/20 to-green-500/20',
      borderColor: 'border-emerald-500/30',
      highlight: true,
      details: 'Full cryptographic verification — the destination chain verifies block headers from the source chain. No trusted intermediaries. The Rainbow Bridge uses this model: NEAR light client on Ethereum, Ethereum light client on NEAR. Most secure but most expensive in gas.',
    },
  ];

  return (
    <div className="relative py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {bridges.map((bridge, i) => (
          <motion.div
            key={i}
            className={cn(
              'rounded-xl border p-4 cursor-pointer transition-all relative',
              activeBridge === i
                ? `bg-gradient-to-br ${bridge.color} ${bridge.borderColor} shadow-lg`
                : `bg-surface border-border hover:border-border-hover`,
              bridge.highlight && activeBridge !== i && 'ring-1 ring-emerald-500/20'
            )}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => setActiveBridge(activeBridge === i ? null : i)}
          >
            {bridge.highlight && (
              <div className="absolute -top-2 right-2 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] text-emerald-400 font-medium">
                Rainbow Bridge
              </div>
            )}
            <div className="text-2xl mb-2">{bridge.icon}</div>
            <h5 className="font-semibold text-text-primary text-sm mb-2">{bridge.type}</h5>
            <div className="space-y-1 text-[11px]">
              <div><span className="text-text-muted">Trust:</span> <span className="text-text-secondary">{bridge.trust}</span></div>
              <div><span className="text-text-muted">Speed:</span> <span className="text-text-secondary">{bridge.speed}</span></div>
              <div><span className="text-text-muted">Cost:</span> <span className="text-text-secondary">{bridge.cost}</span></div>
              <div>
                <span className="text-text-muted">Security: </span>
                <span className={cn(
                  'font-medium',
                  bridge.security === 'Highest' ? 'text-emerald-400' :
                  bridge.security === 'High' ? 'text-amber-400' :
                  bridge.security === 'Medium' ? 'text-orange-400' : 'text-red-400'
                )}>{bridge.security}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {activeBridge !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'mt-3 p-4 rounded-lg text-sm border',
              bridges[activeBridge].highlight
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-surface border-border text-text-secondary'
            )}>
              {bridges[activeBridge].details}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        Click bridge types to compare trust models →
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-pink-400" />
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

  const question = 'What makes the Rainbow Bridge \'trustless\'?';
  const options = [
    'It\'s operated and maintained by the NEAR Foundation',
    'It uses a multisig of well-known validators',
    'It uses light client verification — cryptographically proving block headers without trusting relayers',
    'It has comprehensive insurance coverage for bridged assets',
  ];
  const explanation = 'Correct! The Rainbow Bridge deploys light clients on both chains — a NEAR light client on Ethereum and an Ethereum light client on NEAR. Block headers are cryptographically verified, so relayers can\'t forge transfers. Anyone can be a relayer, but the math keeps them honest.';
  const wrongExplanation = 'Not quite. The Rainbow Bridge is trustless because it uses light client verification — each chain cryptographically verifies the other\'s block headers. No trusted intermediaries needed.';

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

interface BridgeArchitectureProps {
  isActive: boolean;
  onToggle?: () => void;
}

const BridgeArchitecture: React.FC<BridgeArchitectureProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['bridge-architecture']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['bridge-architecture'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <LinkIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Bridge Architecture</h3>
            <p className="text-text-muted text-sm">Bridge designs, security models, Rainbow Bridge deep dive, and cross-chain asset transfers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 15 of 16</Badge>
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-pink-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Bridges between blockchains are like{' '}
                  <span className="text-pink-400 font-medium">embassies between countries</span>.
                  Each embassy has different security protocols: some require a single ambassador&apos;s word (centralized),
                  some need a committee vote (multisig), and some verify passports cryptographically (trustless light clients).
                  The Rainbow Bridge is like having{' '}
                  <span className="text-near-green font-medium">the actual passport office from the other country set up locally — full cryptographic verification</span>.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Bridge Comparison Matrix</h4>
                <p className="text-sm text-text-muted mb-4">Four bridge architectures compared: trust assumptions, speed, cost, and security levels.</p>
                <BridgeComparisonVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">The Rainbow Bridge has been attacked multiple times — and defended successfully! Watchdog services monitor for invalid headers and submit challenges. But smaller bridges without active watchers are sitting ducks. Always verify a bridge&apos;s security model before trusting it with your assets.</p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard icon={Layers} title="Bridge Taxonomy" preview="From centralized custodians to trustless light clients." details="Bridge security exists on a spectrum. Centralized bridges (single custodian) are fastest but least secure. Multisig bridges (committee votes) add resilience but still require trust. Optimistic bridges (fraud proofs) are secure if one watcher is honest. Light client bridges (cryptographic proofs) are trustless — the math itself guarantees correctness." />
                  <ConceptCard icon={Network} title="Rainbow Bridge" preview="NEAR↔Ethereum trustless bridge using light client verification." details="The Rainbow Bridge deploys a NEAR light client contract on Ethereum and an Ethereum light client contract on NEAR. Relayers submit block headers, and the light clients verify them cryptographically. This means transfers are proven mathematically — no trusted intermediary can forge a transfer or block a legitimate one." />
                  <ConceptCard icon={Lock} title="Lock-and-Mint" preview="The standard bridge mechanism: lock on source, mint on destination." details="When you bridge tokens, the original tokens are locked in a contract on the source chain, and equivalent wrapped tokens are minted on the destination chain. When you bridge back, the wrapped tokens are burned and the originals are unlocked. The total supply across both chains always equals the original supply — if this invariant breaks, the bridge has been compromised." />
                  <ConceptCard icon={Server} title="Bridge Relayers" preview="Off-chain actors that submit headers and proofs to the bridge." details="Relayers are the workers that keep bridges operational. They submit block headers and Merkle proofs to the bridge contracts. In permissionless designs like the Rainbow Bridge, anyone can run a relayer — the bridge contracts verify correctness regardless of who submits. Relayers are economically incentivized through gas refunds." />
                  <ConceptCard icon={Eye} title="Finality and Confirmations" preview="How many confirmations before a bridge transfer is safe?" details="Each chain has different finality guarantees. Ethereum needs ~15 minutes for strong finality. NEAR achieves finality in ~2 seconds. Bridge designers must decide how many confirmations to require — too few risks reorganization attacks, too many creates excessive wait times. The Rainbow Bridge waits for finality on both chains." />
                  <ConceptCard icon={Users} title="Exit Game" preview="How users withdraw from bridges — challenge periods and fast exits." details="Withdrawing from an optimistic bridge requires waiting through a challenge period (hours to days). Fast exit services let you withdraw immediately by paying a liquidity provider who accepts the delay risk. Light client bridges like Rainbow Bridge don't need challenge periods — proofs are verified immediately, though header submission adds latency." />
                </div>
              </div>

              {/* Gas Costs */}
              <Card variant="default" padding="md" className="border-pink-500/20">
                <h4 className="font-semibold text-pink-400 text-sm mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Gas Costs
                </h4>
                <p className="text-xs text-text-muted mb-2">Rainbow Bridge header submission: ~50-100 TGas. Proof verification: ~30-50 TGas. Total bridging cost: 0.1-0.5 NEAR + destination chain gas.</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="px-2 py-1.5 rounded bg-surface border border-border">
                    <span className="text-text-muted block">Light Client (Rainbow)</span>
                    <span className="text-pink-400 font-mono">~80-150 TGas</span>
                  </div>
                  <div className="px-2 py-1.5 rounded bg-surface border border-border">
                    <span className="text-text-muted block">Optimistic Bridge</span>
                    <span className="text-pink-400 font-mono">~20 TGas</span>
                  </div>
                  <div className="px-2 py-1.5 rounded bg-surface border border-border">
                    <span className="text-text-muted block">Multisig Verification</span>
                    <span className="text-pink-400 font-mono">~15 TGas</span>
                  </div>
                  <div className="px-2 py-1.5 rounded bg-surface border border-border">
                    <span className="text-text-muted block">Lock-and-Mint</span>
                    <span className="text-pink-400 font-mono">~10 TGas</span>
                  </div>
                </div>
                <p className="text-[10px] text-text-muted mt-2">Higher gas cost = higher security. Light client verification is expensive but trustless.</p>
              </Card>

              {/* Attack / Defense Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Invalid header submission — attacker submits fake block header to claim tokens</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Relayer censorship — relayers refuse to forward legitimate transfers</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Wrapped token depegging — bridge loses collateral, wrapped tokens become worthless</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Bridge contract exploit — vulnerability in bridge smart contract code</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Challenge period + watchdog network that submits fraud proofs</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Permissionless relayer design — anyone can relay, preventing censorship</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Full collateralization with transparent on-chain reserve proofs</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Multiple audits, bug bounties, and upgradeable contracts with governance</li>
                  </ul>
                </Card>
              </div>

              {/* Bridge History */}
              <Card variant="default" padding="md" className="border-pink-500/20 bg-pink-500/5">
                <h4 className="font-semibold text-pink-400 text-sm mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Notable Bridge Incidents
                </h4>
                <div className="space-y-2 text-xs text-text-muted">
                  {[
                    { name: 'Ronin Bridge', loss: '$625M', type: 'Multisig compromise — 5 of 9 validators compromised' },
                    { name: 'Wormhole', loss: '$320M', type: 'Smart contract exploit — signature verification bypass' },
                    { name: 'Nomad', loss: '$190M', type: 'Initialization bug — anyone could forge proofs' },
                    { name: 'Rainbow Bridge', loss: '$0', type: 'Attack defeated — watchdog caught invalid headers' },
                  ].map((incident, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={incident.loss === '$0' ? 'text-emerald-400' : 'text-red-400'}>
                        {incident.loss === '$0' ? '✓' : '✕'}
                      </span>
                      <div>
                        <span className="text-text-secondary font-medium">{incident.name}</span>
                        <span className={cn('ml-1 font-mono', incident.loss === '$0' ? 'text-emerald-400' : 'text-red-400')}>{incident.loss}</span>
                        <span className="text-text-muted block">{incident.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

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
                    'Bridge security ranges from centralized (low) to light-client (high) — know your trust model.',
                    'Rainbow Bridge is trustless via light client header verification on both chains.',
                    'Lock-and-mint is the standard pattern: lock on source, mint on destination.',
                    'Permissionless relayers prevent censorship — anyone can submit proofs.',
                    'Bridge attacks are the most costly in crypto — always verify the bridge\'s security model before use.',
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

export default BridgeArchitecture;
