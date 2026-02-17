'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, Layers, Code,
  DollarSign, Terminal, Globe, Lock, Cpu, BookOpen, Clock,
} from 'lucide-react';

// ─── Bridge Architecture Visual ─────────────────────────────────────────────

function BridgeArchitectureVisual() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = [
    {
      id: 0, label: 'NEAR Protocol', icon: '🌐',
      color: 'from-emerald-500/30 to-green-600/20', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-400',
      detail: 'The base layer. Aurora runs as a smart contract on NEAR, inheriting its consensus, finality (~2s), and sharding. All Aurora state lives inside the aurora.near account.',
      stats: 'Block time: ~1.2s • Finality: ~2s • Sharding: enabled',
    },
    {
      id: 1, label: 'Rainbow Bridge', icon: '🌈',
      color: 'from-violet-500/30 to-purple-600/20', borderColor: 'border-violet-500/40', textColor: 'text-violet-400',
      detail: 'A trustless, permissionless bridge connecting NEAR and Ethereum. Uses light client proofs — no multisig, no relayers with custody. Transfers take ~16 min (ETH→NEAR) or ~4 hours (NEAR→ETH) due to finality requirements.',
      stats: 'ETH→NEAR: ~16 min • NEAR→ETH: ~4 hours • Trust: fully trustless',
    },
    {
      id: 2, label: 'Aurora EVM', icon: '⚡',
      color: 'from-green-500/30 to-teal-600/20', borderColor: 'border-green-500/40', textColor: 'text-green-400',
      detail: 'A full Ethereum Virtual Machine running as a NEAR smart contract. Deploy Solidity contracts with zero changes. Supports all EVM opcodes, precompiles, and the full Ethereum JSON-RPC. Gas is paid in ETH (bridged) but settlement happens on NEAR.',
      stats: 'EVM compatibility: 100% • Gas token: ETH • TPS: ~3000+',
    },
    {
      id: 3, label: 'Ethereum', icon: '🔷',
      color: 'from-blue-500/30 to-indigo-600/20', borderColor: 'border-blue-500/40', textColor: 'text-blue-400',
      detail: 'The source chain. Assets and data bridge from Ethereum through Rainbow Bridge to Aurora. Ethereum smart contracts can interact with NEAR/Aurora contracts via bridge relayers that submit light client proofs.',
      stats: 'Block time: ~12s • Finality: ~13 min • Gas: $1-50+',
    },
  ];

  return (
    <div className="relative py-4">
      <div className="flex flex-col gap-3">
        {layers.map((layer, i) => (
          <React.Fragment key={layer.id}>
            <motion.div
              className={cn(
                'relative rounded-xl p-4 border cursor-pointer transition-all',
                `bg-gradient-to-br ${layer.color} ${layer.borderColor}`,
                activeLayer === layer.id && 'ring-1 ring-white/20 shadow-lg'
              )}
              whileHover={{ scale: 1.01, x: 4 }}
              onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{layer.icon}</span>
                  <div>
                    <h4 className={cn('font-bold text-sm font-mono', layer.textColor)}>{layer.label}</h4>
                    <span className="text-[10px] text-text-muted font-mono">{layer.stats}</span>
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
                    <p className="mt-3 pt-3 border-t border-white/10 text-xs text-text-secondary leading-relaxed">
                      {layer.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {i < layers.length - 1 && (
              <div className="flex justify-center">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <div className="w-0.5 h-3 bg-gradient-to-b from-emerald-500/50 to-green-500/30" />
                  <ArrowRight className="w-3 h-3 text-emerald-400/50 rotate-90" />
                </motion.div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-center text-xs text-text-muted mt-4">Click each layer to explore architecture details →</p>
    </div>
  );
}

// ─── Cost Comparison Visual ─────────────────────────────────────────────────

function CostComparisonVisual() {
  const comparisons = [
    { label: 'ETH Transfer', eth: 100, aurora: 2, near: 0.5, ethCost: '$2.50', auroraCost: '$0.02', nearCost: '$0.001' },
    { label: 'Token Swap', eth: 100, aurora: 3, near: 1, ethCost: '$15-50', auroraCost: '$0.10', nearCost: '$0.01' },
    { label: 'NFT Mint', eth: 100, aurora: 4, near: 1.5, ethCost: '$10-80', auroraCost: '$0.08', nearCost: '$0.01' },
    { label: 'Deploy Contract', eth: 100, aurora: 5, near: 2, ethCost: '$50-500', auroraCost: '$0.50', nearCost: '$0.05' },
  ];

  return (
    <div className="space-y-4">
      {comparisons.map((comp) => (
        <div key={comp.label} className="space-y-1.5">
          <span className="text-xs font-mono text-text-secondary">{comp.label}</span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] w-14 text-right text-text-muted font-mono">ETH</span>
              <div className="flex-1 h-5 bg-surface rounded-full overflow-hidden border border-border">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${comp.eth}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <span className="text-[9px] font-mono text-white/80">{comp.ethCost}</span>
                </motion.div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] w-14 text-right text-text-muted font-mono">Aurora</span>
              <div className="flex-1 h-5 bg-surface rounded-full overflow-hidden border border-border">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 to-green-400 rounded-full flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${comp.aurora}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                >
                  <span className="text-[9px] font-mono text-white/80">{comp.auroraCost}</span>
                </motion.div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] w-14 text-right text-emerald-400 font-mono">NEAR</span>
              <div className="flex-1 h-5 bg-surface rounded-full overflow-hidden border border-border">
                <motion.div
                  className="h-full bg-gradient-to-r from-near-green/80 to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${comp.near}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                />
              </div>
              <span className="text-[9px] font-mono text-emerald-400 w-12">{comp.nearCost}</span>
            </div>
          </div>
        </div>
      ))}
      <p className="text-[10px] text-text-muted text-center mt-2">Bar width = relative cost — Aurora is ~50x cheaper than Ethereum L1</p>
    </div>
  );
}

// ─── Concept Card ───────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType; title: string; preview: string; details: string;
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
  const correctAnswer = 2;
  const question = 'How does Aurora EVM relate to NEAR Protocol?';
  const options = [
    'Aurora is a separate L1 blockchain that bridges to NEAR',
    'Aurora is a sidechain with its own validator set secured by NEAR',
    'Aurora runs as a smart contract deployed on NEAR, inheriting its security',
    'Aurora is a NEAR shard with a dedicated set of chunk producers',
  ];
  const explanation = 'Correct! Aurora is literally a smart contract (aurora.near) on NEAR Protocol. The entire EVM — state, execution, gas metering — runs inside this contract. This means Aurora inherits NEAR\'s consensus security, finality, and validator set without maintaining its own.';
  const wrongExplanation = 'Not quite. Aurora is not a separate chain or sidechain — it runs as a smart contract (aurora.near) deployed on NEAR Protocol. The entire EVM executes inside this contract, inheriting NEAR\'s security and finality directly.';

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

interface AuroraEvmCompatibilityProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function AuroraEvmCompatibility({ isActive, onToggle }: AuroraEvmCompatibilityProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['aurora-evm-compatibility']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['aurora-evm-compatibility'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  return (
    <Card variant="glass" padding="none" className="border-emerald-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Aurora EVM Compatibility</h3>
            <p className="text-text-muted text-sm">Running Solidity on NEAR via Aurora EVM and Rainbow Bridge</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-orange-500/10 text-orange-300 border-orange-500/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">40 min</Badge>
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
            <div className="border-t border-emerald-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400">
                <BookOpen className="w-3 h-3" />
                Module 25 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                40 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Imagine running <span className="text-emerald-400 font-medium">an entire Ethereum computer inside a NEAR smart contract</span>.
                  That&apos;s Aurora — a full EVM that lives at <code className="text-green-400 text-xs bg-green-500/10 px-1 rounded">aurora.near</code>.
                  Deploy your Solidity contracts unchanged, use MetaMask, Hardhat, and every Ethereum tool — but pay
                  <span className="text-green-400 font-medium"> 50-100x less</span> in gas fees with
                  <span className="text-emerald-400 font-medium"> 2-second finality</span>. Rainbow Bridge connects the
                  ecosystems trustlessly, so assets flow freely between Ethereum, Aurora, and NEAR.
                </p>
              </Card>

              {/* Bridge Architecture */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🏗️ Bridge Architecture</h4>
                <p className="text-sm text-text-muted mb-4">Four layers that make cross-ecosystem composability possible.</p>
                <BridgeArchitectureVisual />
              </div>

              {/* Cost Comparison */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">💰 Cost Comparison</h4>
                <p className="text-sm text-text-muted mb-4">Real-world transaction costs across Ethereum L1, Aurora EVM, and NEAR native.</p>
                <Card variant="default" padding="md">
                  <CostComparisonVisual />
                </Card>
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Bridge Finality Race Condition</h4>
                    <p className="text-sm text-text-secondary">
                      Rainbow Bridge transfers from NEAR→ETH take ~4 hours because they wait for Ethereum finality proofs.
                      A common exploit pattern: an attacker initiates a bridge transfer, then attempts to <span className="text-orange-300 font-medium">double-spend on Aurora
                      before the bridge proof is submitted</span>. Aurora&apos;s watchdog system mitigates this by allowing anyone to
                      challenge invalid proofs within a window — but your dApp must account for the delay and never treat
                      unfinalized bridge transfers as confirmed.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Cpu}
                    title="Aurora EVM Engine"
                    preview="A full Ethereum Virtual Machine running inside a NEAR smart contract."
                    details="Aurora implements every EVM opcode, all 9 precompiled contracts, and the full Ethereum JSON-RPC API. It processes transactions by encoding EVM calls as NEAR function calls to the aurora.near contract. State is stored in NEAR's trie, and gas metering maps EVM gas to NEAR gas internally. The result: 100% Solidity compatibility with NEAR's performance characteristics."
                  />
                  <ConceptCard
                    icon={Globe}
                    title="Rainbow Bridge"
                    preview="Trustless, permissionless asset and data bridge between NEAR and Ethereum."
                    details="Rainbow Bridge uses light client proofs instead of multisigs or trusted relayers. NEAR light client runs on Ethereum (verifies NEAR blocks), and Ethereum light client runs on NEAR (verifies ETH blocks). Anyone can relay proofs. ETH→NEAR takes ~16 minutes. NEAR→ETH takes ~4 hours. The bridge supports ERC-20, NFTs, and arbitrary message passing."
                  />
                  <ConceptCard
                    icon={Code}
                    title="Solidity Compatibility"
                    preview="Deploy any Solidity contract to Aurora without modification."
                    details="Aurora supports Solidity versions up to 0.8.x, all OpenZeppelin contracts, and standard tooling (Hardhat, Foundry, Remix, Truffle). Your existing tests, deployment scripts, and CI/CD pipelines work unchanged. Just point your RPC URL to Aurora (https://mainnet.aurora.dev) and deploy. Transactions settle on NEAR, giving you faster finality and lower costs."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Cross-Ecosystem Calls"
                    preview="Solidity contracts on Aurora can call NEAR native contracts and vice versa."
                    details="Aurora provides precompiled contracts that allow Solidity code to make cross-contract calls to NEAR native contracts. The exit-to-near precompile lets Aurora contracts send tokens to NEAR accounts. The exit-to-ethereum precompile initiates bridge transfers. You can build dApps that compose across both ecosystems — e.g., a Solidity frontend calling a Rust backend on NEAR."
                  />
                  <ConceptCard
                    icon={Lock}
                    title="Security Model"
                    preview="Aurora inherits NEAR's validator security with additional bridge watchers."
                    details="Since Aurora is a NEAR contract, it's secured by NEAR's full validator set (~100+ validators, ~$1B staked). Bridge security uses optimistic verification: transfers are assumed valid unless challenged within a 4-hour window. Watchdog nodes monitor for invalid proofs and submit challenges. Attacking Aurora means attacking NEAR itself."
                  />
                  <ConceptCard
                    icon={DollarSign}
                    title="Gas Economics"
                    preview="ETH for gas on Aurora, but settled on NEAR — dramatically lower costs."
                    details="Users pay gas in ETH (bridged to Aurora) just like on Ethereum L1. Under the hood, Aurora batches EVM transactions into NEAR transactions, amortizing costs. A typical EVM transaction costs 0.00001-0.001 ETH on Aurora vs 0.001-0.1 ETH on Ethereum L1. Aurora Labs also offers gasless transactions via meta-transactions, where a relayer pays gas on behalf of users."
                  />
                </div>
              </div>

              {/* Code Example */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">📝 Hardhat Config for Aurora</h4>
                <p className="text-sm text-text-muted mb-3">Deploy Solidity to Aurora and call NEAR contracts via precompiles.</p>
                <Card variant="default" padding="md" className="font-mono text-xs overflow-x-auto">
                  <pre className="text-text-secondary leading-relaxed whitespace-pre-wrap">{`// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    aurora_mainnet: {
      url: "https://mainnet.aurora.dev",
      chainId: 1313161554,
      accounts: [process.env.PRIVATE_KEY!],
    },
    aurora_testnet: {
      url: "https://testnet.aurora.dev",
      chainId: 1313161555,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

// ─── Solidity → NEAR cross-contract call ───
// interface INearPrecompile {
//   function callNear(
//     string nearAccountId,
//     string methodName,
//     bytes args,
//     uint128 deposit,
//     uint64 gas
//   ) external returns (bytes);
// }
//
// contract AuroraBridge {
//   address constant NEAR =
//     0x516Cded1D16af10CAd47D6D49128E2eB7d27b372;
//
//   function callNearContract() external {
//     INearPrecompile(NEAR).callNear(
//       "ref-finance.near",  // NEAR contract
//       "get_pools",         // method
//       '{"from_index":0}',  // args (JSON)
//       0,                   // deposit
//       50_000_000_000_000   // 50 TGas
//     );
//   }
// }`}</pre>
                </Card>
              </div>

              {/* Decision Grid */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-3">🤔 Aurora vs NEAR Native</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card variant="default" padding="md" className="border-green-500/20">
                    <h4 className="font-semibold text-green-400 text-sm mb-2 flex items-center gap-2">
                      <Cpu className="w-4 h-4" /> Choose Aurora When
                    </h4>
                    <ul className="text-xs text-text-muted space-y-1.5">
                      <li className="flex items-start gap-2"><span className="text-green-400">•</span> You have existing Solidity contracts to migrate</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">•</span> Your team knows Solidity/EVM but not Rust</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">•</span> You need ERC-20/721 compatibility out of the box</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">•</span> You want MetaMask and Ethereum wallet support</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">•</span> You bridge assets from Ethereum frequently</li>
                    </ul>
                  </Card>
                  <Card variant="default" padding="md" className="border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Choose NEAR Native When
                    </h4>
                    <ul className="text-xs text-text-muted space-y-1.5">
                      <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> You need maximum performance and lowest gas</li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> You want human-readable account names (alice.near)</li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> You need full NEAR cross-contract call features</li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> You&apos;re building from scratch and can learn Rust</li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> You want native NEAR Social, BOS, and sharding</li>
                    </ul>
                  </Card>
                </div>
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
                    'Aurora is a full EVM running as a smart contract on NEAR — 100% Solidity compatible',
                    'Rainbow Bridge is trustless (light client proofs) — ETH→NEAR ~16 min, NEAR→ETH ~4 hours',
                    'Gas costs on Aurora are 50-100x cheaper than Ethereum L1 with 2-second finality',
                    'Solidity contracts on Aurora can call NEAR native contracts via precompiles',
                    'Choose Aurora for EVM migration; choose NEAR native for max performance',
                    'Never treat unfinalized bridge transfers as confirmed — account for finality delays',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <ArrowRight className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark as Complete */}
              <div className="flex justify-center pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleComplete}
                  disabled={completed}
                  className={cn(
                    'px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2',
                    completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/20'
                  )}
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
}
