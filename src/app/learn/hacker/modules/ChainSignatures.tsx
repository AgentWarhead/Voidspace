'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, Key, Globe, Network,
  Fingerprint, Lock,
} from 'lucide-react';

// ─── Interactive MPC Signing Visual ─────────────────────────────────────────

function MPCSigningVisual() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [activeChain, setActiveChain] = useState<number | null>(null);

  const mpcNodes = [
    { id: 0, label: 'Node A', role: 'Key share holder — stores a fragment of the master key. Participates in threshold signing by computing a partial signature from its key share.', angle: 0 },
    { id: 1, label: 'Node B', role: 'Key share holder — independent operator on different infrastructure. If compromised alone, cannot produce a valid signature.', angle: 72 },
    { id: 2, label: 'Node C', role: 'Key share holder — participates in key resharing protocol to rotate shares without changing the derived public keys.', angle: 144 },
    { id: 3, label: 'Node D', role: 'Key share holder — monitors for suspicious signing requests. Part of the 3-of-5 threshold required to produce signatures.', angle: 216 },
    { id: 4, label: 'Node E', role: 'Key share holder — can go offline without affecting the network. Only 3 of 5 nodes needed to sign (fault tolerant).', angle: 288 },
  ];

  const derivedChains = [
    { id: 0, chain: 'Ethereum', address: '0x71C7...3a4F', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30' },
    { id: 1, chain: 'Bitcoin', address: 'bc1q...7m2k', color: 'text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/30' },
    { id: 2, chain: 'Cosmos', address: 'cosmos1...x9p4', color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/30' },
  ];

  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  return (
    <div className="relative py-6">
      {/* MPC Network Circle */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Circle Visualization */}
        <div className="relative w-[220px] h-[220px] mx-auto flex-shrink-0">
          {/* Center - NEAR Contract */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-near-green/20 to-emerald-500/10 border border-near-green/40 flex items-center justify-center cursor-pointer z-10"
            animate={{
              boxShadow: ['0 0 15px rgba(0,236,151,0.1)', '0 0 25px rgba(0,236,151,0.25)', '0 0 15px rgba(0,236,151,0.1)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="text-center">
              <Key className="w-4 h-4 text-near-green mx-auto" />
              <span className="text-[8px] text-near-green font-mono block mt-0.5">sign()</span>
            </div>
          </motion.div>

          {/* MPC Nodes in Circle */}
          {mpcNodes.map((node) => {
            const rads = (node.angle - 90) * (Math.PI / 180);
            const x = centerX + radius * Math.cos(rads) - 18;
            const y = centerY + radius * Math.sin(rads) - 18;
            const isActive = activeNode === node.id;

            return (
              <motion.div
                key={node.id}
                className={cn(
                  'absolute w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer transition-all text-[9px] font-mono',
                  isActive
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 ring-1 ring-yellow-500/30'
                    : 'bg-surface border-border text-text-muted hover:border-yellow-500/30'
                )}
                style={{ left: x, top: y }}
                onClick={() => setActiveNode(isActive ? null : node.id)}
                whileHover={{ scale: 1.15 }}
              >
                {String.fromCharCode(65 + node.id)}
              </motion.div>
            );
          })}

          {/* Animated key share lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
            {mpcNodes.map((node) => {
              const rads = (node.angle - 90) * (Math.PI / 180);
              const x = centerX + radius * Math.cos(rads);
              const y = centerY + radius * Math.sin(rads);
              return (
                <motion.line
                  key={node.id}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke={activeNode === node.id ? 'rgba(234,179,8,0.4)' : 'rgba(255,255,255,0.06)'}
                  strokeWidth={activeNode === node.id ? 1.5 : 0.5}
                  strokeDasharray="4 4"
                  animate={{ strokeDashoffset: [0, -8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              );
            })}
          </svg>
        </div>

        {/* Right side - details and chains */}
        <div className="flex-1 space-y-4 w-full">
          {/* Node Detail */}
          <AnimatePresence mode="wait">
            {activeNode !== null && (
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20"
              >
                <span className="text-xs font-bold text-yellow-400 font-mono">{mpcNodes[activeNode].label}</span>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">{mpcNodes[activeNode].role}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Derived Chain Addresses */}
          <div>
            <span className="text-xs text-text-muted block mb-2">Derived addresses (click to explore):</span>
            <div className="space-y-2">
              {derivedChains.map((chain) => (
                <motion.div
                  key={chain.id}
                  className={cn(
                    'px-3 py-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between',
                    chain.bgColor,
                    activeChain === chain.id && 'ring-1 ring-white/10'
                  )}
                  onClick={() => setActiveChain(activeChain === chain.id ? null : chain.id)}
                  whileHover={{ x: 3 }}
                >
                  <span className={cn('text-xs font-bold', chain.color)}>{chain.chain}</span>
                  <span className="text-[10px] text-text-muted font-mono">{chain.address}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {activeChain !== null && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-lg bg-surface border border-border text-[10px] text-text-muted leading-relaxed">
                  Derived via: <span className="text-near-green font-mono">account.near + &quot;{derivedChains[activeChain].chain.toLowerCase()},1&quot;</span>
                  <br />Same account + path always produces the same key. Different paths = different addresses.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Gas Note */}
      <div className="mt-4 p-3 rounded-lg bg-surface border border-border">
        <p className="text-[10px] text-text-muted font-mono leading-relaxed">
          ⛽ Chain signature request: ~250-300 TGas (expensive!) • Batch operations where possible •
          1 yoctoNEAR deposit required to prevent free signing spam
        </p>
      </div>

      <p className="text-center text-xs text-text-muted mt-4">
        Click MPC nodes and chain addresses to explore →
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-red-500/20 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-yellow-400" />
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

  const question = 'What prevents a single MPC node from signing transactions independently?';
  const options = [
    'Encryption on the blockchain prevents unauthorized signing',
    'The blockchain consensus mechanism blocks rogue signatures',
    'Threshold cryptography — no single node holds the complete private key',
    'Smart contract access control lists restrict signing permissions',
  ];
  const explanation = 'Correct! Threshold cryptography splits the master key into shares distributed across MPC nodes. Each node only holds a fragment — signing requires a threshold (e.g., 3 of 5) of nodes to cooperate. No single node ever sees or reconstructs the full private key.';
  const wrongExplanation = 'Not quite. The key protection comes from threshold cryptography: the private key is split into shares, and no single node holds the complete key. A minimum threshold of nodes must cooperate to produce a valid signature.';

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

interface ChainSignaturesProps {
  isActive: boolean;
  onToggle?: () => void;
}

const ChainSignatures: React.FC<ChainSignaturesProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['chain-signatures']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['chain-signatures'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-yellow-500/20">
      {/* Accordion Header */}
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Chain Signatures</h3>
            <p className="text-text-muted text-sm">MPC-based cross-chain signing, key derivation paths, and multi-chain account control</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 4 of 16</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">65 min</Badge>
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
            <div className="border-t border-yellow-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-red-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Imagine a vault that requires <span className="text-yellow-400 font-medium">3 out of 5 keyholders to open</span> —
                  but the vault can forge a perfect copy of <span className="text-red-400 font-medium">ANY key in the world</span>.
                  That&apos;s NEAR&apos;s MPC network: distributed keyholders that can collectively sign transactions
                  for Bitcoin, Ethereum, or any blockchain. One NEAR account becomes a universal controller —
                  the foundation of <span className="text-near-green font-medium">chain abstraction</span>.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 MPC Threshold Signing Network</h4>
                <p className="text-sm text-text-muted mb-4">Five MPC nodes hold key shares. A NEAR contract requests signatures that are valid on any ECDSA chain.</p>
                <MPCSigningVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      The MPC network is a <span className="text-orange-300 font-medium">trust assumption</span>! If more
                      than 1/3 of MPC nodes collude, they can sign unauthorized transactions on any chain.
                      Key resharing (rotating key shares without changing public keys) mitigates long-term collusion
                      but doesn&apos;t eliminate the fundamental trust requirement. This is the tradeoff for cross-chain
                      capabilities without bridges.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Network}
                    title="MPC Network"
                    preview="Multi-Party Computation — threshold signing without reconstructing the key."
                    details="The MPC network consists of independent node operators who each hold a share of a master key. Through a cryptographic protocol (threshold ECDSA), any t-of-n nodes can cooperate to produce a valid signature WITHOUT ever reconstructing the full private key. The key never exists in one place — it's always distributed. This is fundamentally different from multisig, where each signer has their own complete key."
                  />
                  <ConceptCard
                    icon={Fingerprint}
                    title="Key Derivation"
                    preview="Deterministic path-based key generation: account + path → unique key."
                    details="From the master MPC key, unique child keys are derived using a deterministic path: your NEAR account ID + a derivation path string (e.g., 'ethereum,1'). The same inputs always produce the same derived key. This means your NEAR account deterministically controls specific addresses on every chain. Different paths = different addresses. You can create unlimited derived keys without any MPC network interaction."
                  />
                  <ConceptCard
                    icon={Globe}
                    title="Cross-Chain Signing"
                    preview="Sign transactions for any ECDSA chain — Ethereum, Bitcoin, Cosmos, and more."
                    details="Chain signatures work with any blockchain that uses ECDSA (secp256k1) for transaction signing — which includes Ethereum, Bitcoin, Cosmos, and most major chains. Your NEAR contract calls the MPC signing contract with a payload (the transaction hash to sign), and the MPC nodes produce a valid signature. You then broadcast this signed transaction to the target chain. NEAR becomes a universal transaction signer."
                  />
                  <ConceptCard
                    icon={Lock}
                    title="Threshold Cryptography"
                    preview="t-of-n scheme — security holds even if some nodes are compromised."
                    details="In a 3-of-5 threshold scheme, any 3 nodes can produce a valid signature, but 2 or fewer cannot. This provides both security (an attacker must compromise 3+ nodes) and availability (the network works even if 2 nodes go offline). The math ensures that partial signatures from fewer than t nodes reveal zero information about the private key — they're computationally useless to an attacker."
                  />
                  <ConceptCard
                    icon={Key}
                    title="Chain Abstraction"
                    preview="One NEAR account controlling assets on every blockchain."
                    details="Chain abstraction is the vision: users shouldn't need to know which blockchain their assets are on. With chain signatures, a single NEAR account can hold ETH, BTC, ATOM, and any other ECDSA-based asset. Combined with meta-transactions (gasless) and account aggregation, users get a single identity across all of crypto. Chain signatures are the cryptographic foundation making this possible."
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
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> MPC node collusion — if more than t nodes cooperate maliciously, they can sign unauthorized transactions on any chain</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Front-running derived addresses — attacker monitors funded addresses and front-runs transactions on the target chain</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Replay attacks — reusing a valid signature from one chain or context on another where the nonce/chain ID isn&apos;t checked</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Key resharing rotates shares periodically — even if an attacker slowly compromises nodes, resharing invalidates old shares</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Atomic fund-and-sign patterns — fund the derived address and sign the outgoing transaction in the same flow to prevent front-running</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Chain-specific derivation paths and proper nonce management ensure signatures can&apos;t be replayed across chains or transactions</li>
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
                    'Chain signatures enable one NEAR account to control assets on any ECDSA chain',
                    'MPC nodes each hold key shares — threshold signing without ever reconstructing the full key',
                    'Key derivation is deterministic: same account + path always produces the same derived key',
                    'This is the cryptographic foundation of NEAR\'s chain abstraction vision',
                    'Trust assumption: >1/3 malicious MPC nodes can compromise the system — key resharing mitigates but doesn\'t eliminate this',
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

export default ChainSignatures;
