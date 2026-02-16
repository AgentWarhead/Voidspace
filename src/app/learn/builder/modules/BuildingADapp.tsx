'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Layers, Code, Rocket, Database,
  Globe, Server, Shield, GitBranch,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BuildingADappProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: Full-Stack Architecture Layers ────────────────────────

const archLayers = [
  {
    id: 'ui', label: 'Frontend Layer', icon: '🖥️', color: '#8b5cf6',
    tech: 'Next.js / React',
    items: ['Page routes & components', 'Wallet Selector modal', 'Transaction status UI', 'Client-side caching'],
  },
  {
    id: 'sdk', label: 'SDK / Middleware', icon: '🔌', color: '#06b6d4',
    tech: 'near-api-js + Wallet Selector',
    items: ['RPC connection config', 'View & change call wrappers', 'Auth state management', 'Error handling layer'],
  },
  {
    id: 'indexer', label: 'Indexer Layer', icon: '📊', color: '#f59e0b',
    tech: 'NEAR Lake / QueryAPI',
    items: ['Historical data queries', 'Event subscriptions', 'Off-chain aggregation', 'API endpoints for frontend'],
  },
  {
    id: 'contract', label: 'Smart Contract', icon: '📜', color: '#4ade80',
    tech: 'Rust + near-sdk',
    items: ['Core business logic', 'State storage (LookupMap)', 'Cross-contract calls', 'NEP standard interfaces'],
  },
  {
    id: 'chain', label: 'NEAR Protocol', icon: '⛓️', color: '#10b981',
    tech: 'Sharded blockchain',
    items: ['Consensus & finality', 'Gas metering', 'Storage staking', 'Account model & keys'],
  },
];

function ArchitectureVisual() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const active = archLayers.find(l => l.id === activeLayer);

  return (
    <div className="relative py-4">
      <div className="space-y-2">
        {archLayers.map((layer, i) => (
          <motion.div key={layer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
              activeLayer === layer.id ? 'border-near-green/50 bg-near-green/5' : 'border-border bg-surface hover:border-border-hover'
            )}
            style={{ marginLeft: `${i * 8}px`, marginRight: `${(archLayers.length - 1 - i) * 8}px` }}
          >
            <span className="text-lg">{layer.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">{layer.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30" style={{ color: layer.color }}>{layer.tech}</span>
              </div>
            </div>
            <motion.div animate={{ rotate: activeLayer === layer.id ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </motion.div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-3">
            <div className="p-3 rounded-lg border border-border bg-surface">
              <p className="text-xs font-semibold mb-2" style={{ color: active.color }}>{active.label} — {active.tech}</p>
              <div className="grid grid-cols-2 gap-1">
                {active.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-text-muted">
                    <div className="w-1 h-1 rounded-full bg-near-green" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-3">👆 Click each layer to explore its responsibilities</p>
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType; title: string; preview: string; details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card variant="glass" padding="md" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-emerald-400" />
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

// ─── Mini Quiz ─────────────────────────────────────────────────────────────────

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 0;
  const options = [
    'An indexer that caches blockchain events for fast historical queries',
    'A second smart contract that mirrors the first one for redundancy',
    'A centralized database that replaces blockchain storage entirely',
    'A CDN that serves the smart contract bytecode to users',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-emerald-400" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">What is the recommended solution when your dApp needs fast queries over historical blockchain data?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button key={i} onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
              revealed && i === correctAnswer ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : revealed && i === selected && i !== correctAnswer ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : selected === i ? 'bg-surface-hover border-border-hover text-text-primary'
                : 'bg-surface border-border text-text-secondary hover:border-border-hover'
            )}>
            <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>{opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={cn('mt-4 p-3 rounded-lg text-sm', selected === correctAnswer
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-orange-500/10 text-orange-400 border border-orange-500/20')}>
            {selected === correctAnswer
              ? '✓ Correct! Indexers (like NEAR Lake or QueryAPI) listen to blockchain events and store them in queryable databases. This gives your frontend fast access to historical data without expensive on-chain queries.'
              : '✗ Not quite. The right approach is an indexer — a service that streams blockchain events into an off-chain database optimized for queries. Smart contracts are for logic, not for serving historical data to frontends.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const BuildingADapp: React.FC<BuildingADappProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building a dApp</h3>
            <p className="text-text-muted text-sm">Full-stack architecture — contract + frontend + wallet</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Complete</Badge>
          )}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">45 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="border-t border-near-green/20 p-6 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green">
                <BookOpen className="w-3 h-3" /> Module 17 of 22 <span className="text-text-muted">•</span> <Clock className="w-3 h-3" /> 45 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-emerald-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Building a dApp is like constructing a <span className="text-emerald-400 font-medium">building with no landlord</span>.
                  The smart contract is the foundation — immutable rules baked into code. The frontend is the lobby — how users interact
                  with those rules. The wallet is the key card — proving identity without a central authority. The indexer is the elevator
                  display — showing what happened on all floors without checking each one. Together, these layers create an application
                  that <span className="text-emerald-400 font-medium">no single entity can shut down, censor, or modify</span>.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🏗️ Full-Stack dApp Architecture</h3>
                <p className="text-sm text-text-muted mb-4">Each layer has distinct responsibilities — click to explore.</p>
                <ArchitectureVisual />
              </div>

              {/* Code Example — expanded with more comments */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Code In Action</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Full-stack pattern: React component calling a NEAR contract'}</div>
                  <div className="text-text-muted">{'// This demonstrates the Wallet Selector integration pattern'}</div>
                  <div className="text-text-muted">{'// Wallet Selector abstracts multiple wallet providers into one API'}</div>
                  <div className="text-text-muted">{'// Supports: MyNearWallet, Meteor, HERE, Sender, Ledger, etc.'}</div>
                  <div><span className="text-purple-400">import</span> {'{'} useWalletSelector {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">&quot;./WalletContext&quot;</span>;</div>
                  <div><span className="text-purple-400">import</span> {'{'} useState {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">&quot;react&quot;</span>;</div>
                  <div className="mt-2"><span className="text-blue-400">export function</span> <span className="text-yellow-300">MintButton</span>() {'{'}</div>
                  <div>  <span className="text-text-muted">{'// Get wallet connection from context provider'}</span></div>
                  <div>  <span className="text-blue-400">const</span> {'{'} selector, accountId {'}'} = useWalletSelector();</div>
                  <div>  <span className="text-blue-400">const</span> [status, setStatus] = useState(<span className="text-green-400">&quot;idle&quot;</span>);</div>
                  <div className="mt-1">  <span className="text-text-muted">{'// Handler: sign and send an NFT mint transaction'}</span></div>
                  <div>  <span className="text-text-muted">{'// The wallet handles signing — user approves in their wallet UI'}</span></div>
                  <div>  <span className="text-blue-400">const</span> handleMint = <span className="text-blue-400">async</span> () =&gt; {'{'}</div>
                  <div>    <span className="text-text-muted">{'// Guard: user must be connected'}</span></div>
                  <div>    <span className="text-purple-400">if</span> (!accountId) <span className="text-purple-400">return</span>;</div>
                  <div>    setStatus(<span className="text-green-400">&quot;signing&quot;</span>);</div>
                  <div>    <span className="text-purple-400">try</span> {'{'}</div>
                  <div>      <span className="text-text-muted">{'// Resolve the active wallet (MyNearWallet, Meteor, etc.)'}</span></div>
                  <div>      <span className="text-blue-400">const</span> wallet = <span className="text-purple-400">await</span> selector.wallet();</div>
                  <div>      <span className="text-text-muted">{'// Build and send the transaction'}</span></div>
                  <div>      <span className="text-purple-400">await</span> wallet.signAndSendTransaction({'{'}</div>
                  <div>        receiverId: <span className="text-green-400">&quot;nft.your-app.near&quot;</span>,</div>
                  <div>        actions: [{'{'}</div>
                  <div>          type: <span className="text-green-400">&quot;FunctionCall&quot;</span>,</div>
                  <div>          params: {'{'}</div>
                  <div>            methodName: <span className="text-green-400">&quot;nft_mint&quot;</span>,</div>
                  <div>            args: {'{'} token_id: <span className="text-green-400">&quot;1&quot;</span>, receiver_id: accountId {'}'},</div>
                  <div>            gas: <span className="text-green-400">&quot;100000000000000&quot;</span>, <span className="text-text-muted">{'// 100 Tgas'}</span></div>
                  <div>            deposit: <span className="text-green-400">&quot;10000000000000000000000&quot;</span>, <span className="text-text-muted">{'// 0.01 NEAR'}</span></div>
                  <div>          {'}'},</div>
                  <div>        {'}'}],</div>
                  <div>      {'}'});</div>
                  <div>      <span className="text-text-muted">{'// Optimistic UI: show success immediately'}</span></div>
                  <div>      setStatus(<span className="text-green-400">&quot;success&quot;</span>);</div>
                  <div>    {'}'} <span className="text-purple-400">catch</span> (e) {'{'}</div>
                  <div>      <span className="text-text-muted">{'// Revert on failure — user denied or gas error'}</span></div>
                  <div>      setStatus(<span className="text-green-400">&quot;error&quot;</span>);</div>
                  <div>    {'}'}</div>
                  <div>  {'}'};</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Pro Tip - Monorepo Tooling */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Use <code className="text-emerald-300 bg-black/30 px-1 rounded">Turborepo</code> or{' '}
                  <code className="text-emerald-300 bg-black/30 px-1 rounded">Nx</code> for your monorepo — they cache build outputs so
                  only changed packages rebuild. Combine with{' '}
                  <code className="text-emerald-300 bg-black/30 px-1 rounded">Cargo workspaces</code> for the Rust contract side.
                  A single <code className="text-emerald-300 bg-black/30 px-1 rounded">turbo run build</code> compiles your contract,
                  generates TypeScript types from the ABI, and builds the frontend — all in the right order with dependency awareness.
                  This eliminates the &quot;works on my machine&quot; problem and keeps CI pipelines fast.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard icon={GitBranch} title="Monorepo Project Structure" preview="Keep contract, frontend, and indexer in one repository for atomic changes"
                    details="A typical NEAR dApp monorepo: /contracts (Rust smart contracts), /frontend (Next.js app), /indexer (NEAR Lake consumer), and /shared (types, ABIs). Use a workspace tool (Cargo workspaces for Rust, npm workspaces or Turborepo for JS). When you change a contract method signature, update the frontend call and indexer parser in the same PR. This prevents the #1 dApp bug: contract and frontend out of sync." />
                  <ConceptCard icon={Server} title="Indexer Architecture" preview="Stream blockchain events into a queryable database for fast frontend access"
                    details="Smart contracts can only serve current state — not historical data. An indexer (using NEAR Lake Framework or QueryAPI) streams every block, filters for your contract&apos;s events, and stores them in PostgreSQL or a similar database. Your frontend queries the indexer API for transaction history, leaderboards, analytics — anything that would be too expensive to compute on-chain. Think of it as a read-optimized mirror of your contract&apos;s activity." />
                  <ConceptCard icon={Shield} title="Security Architecture" preview="Defense in depth — validate at every layer, trust nothing from the frontend"
                    details="Security in a dApp is layered: the contract validates all inputs (never trust frontend data), the frontend validates user input before sending transactions (better UX), and the indexer validates events before storing (prevent poisoned data). Use predecessor_id checks in contracts for access control. Never store secrets in frontend code. Use environment variables for RPC URLs and contract addresses. Deploy contract upgrades through a DAO or multisig." />
                  <ConceptCard icon={Database} title="State Management Strategy" preview="Split state between on-chain (authoritative) and off-chain (fast) storage"
                    details="Not everything belongs on-chain. On-chain: ownership records, balances, governance votes — anything that needs trustless verification. Off-chain (indexer/database): user profiles, display preferences, search indexes, analytics. IPFS/Arweave: large media files, metadata JSON. The pattern: store the hash on-chain, store the data off-chain. Your frontend reads from the indexer for speed and falls back to on-chain for verification." />
                  <ConceptCard icon={Rocket} title="Deployment Pipeline" preview="Contract deploys are permanent — use testnet, staging, then mainnet"
                    details="Unlike web apps, you can&apos;t just redeploy a smart contract and fix bugs instantly. Pipeline: develop locally → deploy to testnet → run integration tests → deploy to a staging subaccount on mainnet → final mainnet deploy. Use near-cli: near deploy contract.testnet ./target/res/contract.wasm. For upgrades, implement a migration pattern — new code must handle old state. Consider a DAO-controlled upgrade mechanism for production contracts." />
                  <ConceptCard icon={Globe} title="User Experience Patterns" preview="Abstract blockchain complexity — users shouldn&apos;t need to understand gas or finality"
                    details="The best dApps hide blockchain mechanics. Show loading states during transaction confirmation (1-2 seconds on NEAR). Use optimistic UI updates — show the result immediately, revert if the transaction fails. Abstract gas by using relayers or meta-transactions (NEP-366) so users don&apos;t need NEAR for gas. Display human-readable account names (alice.near) not hex addresses. Progressive onboarding: let users explore before requiring a wallet connection." />
                  <ConceptCard icon={Code} title="Testing Full-Stack dApps" preview="Unit tests for contracts, integration tests for the full pipeline, E2E for user flows"
                    details="Testing a dApp spans three layers. Unit tests (cargo test) validate individual contract methods in isolation — fast and deterministic. Integration tests use near-workspaces to spin up a local sandbox, deploy your contract, and test cross-contract calls with real gas metering. E2E tests (Playwright or Cypress) drive the actual frontend: connect wallet, click mint, verify the NFT appears. Run integration tests on every PR, E2E nightly. The sandbox catches 90% of bugs before they hit testnet." />
                </div>
              </div>

              {/* Real World Example - Project Directory Structure */}
              <Card variant="glass" padding="lg" className="border-emerald-500/20">
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-emerald-400" /> Real World Example
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  A production NEAR dApp monorepo structure. Each directory has a clear responsibility,
                  and a top-level workspace config ties everything together. This layout scales from
                  a weekend hackathon project to a full production application with multiple contracts.
                </p>
                <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div className="text-emerald-400">my-near-dapp/</div>
                  <div>├── <span className="text-cyan-400">contracts/</span>                <span className="text-text-muted">{'# Rust smart contracts'}</span></div>
                  <div>│   ├── <span className="text-cyan-400">core/</span>                  <span className="text-text-muted">{'# Main contract (Cargo.toml + src/)'}</span></div>
                  <div>│   ├── <span className="text-cyan-400">registry/</span>              <span className="text-text-muted">{'# Sub-contract for user registry'}</span></div>
                  <div>│   └── Cargo.toml             <span className="text-text-muted">{'# Cargo workspace config'}</span></div>
                  <div>├── <span className="text-cyan-400">frontend/</span>                  <span className="text-text-muted">{'# Next.js application'}</span></div>
                  <div>│   ├── <span className="text-cyan-400">src/</span></div>
                  <div>│   │   ├── <span className="text-cyan-400">components/</span>        <span className="text-text-muted">{'# React UI components'}</span></div>
                  <div>│   │   ├── <span className="text-cyan-400">hooks/</span>             <span className="text-text-muted">{'# useContract(), useWallet()'}</span></div>
                  <div>│   │   ├── <span className="text-cyan-400">contexts/</span>          <span className="text-text-muted">{'# WalletSelectorContext'}</span></div>
                  <div>│   │   └── <span className="text-cyan-400">app/</span>               <span className="text-text-muted">{'# Next.js app router pages'}</span></div>
                  <div>│   └── package.json</div>
                  <div>├── <span className="text-cyan-400">indexer/</span>                   <span className="text-text-muted">{'# NEAR Lake consumer'}</span></div>
                  <div>│   ├── src/index.ts            <span className="text-text-muted">{'# Block stream handler'}</span></div>
                  <div>│   └── schema.sql              <span className="text-text-muted">{'# PostgreSQL schema'}</span></div>
                  <div>├── <span className="text-cyan-400">shared/</span>                    <span className="text-text-muted">{'# Shared types &amp; ABIs'}</span></div>
                  <div>│   └── types.ts                <span className="text-text-muted">{'# Contract interface types'}</span></div>
                  <div>├── <span className="text-cyan-400">tests/</span>                     <span className="text-text-muted">{'# Integration &amp; E2E tests'}</span></div>
                  <div>│   ├── integration.test.ts     <span className="text-text-muted">{'# near-workspaces sandbox'}</span></div>
                  <div>│   └── e2e.spec.ts             <span className="text-text-muted">{'# Playwright browser tests'}</span></div>
                  <div>├── <span className="text-cyan-400">.github/</span>                   <span className="text-text-muted">{'# CI/CD workflows'}</span></div>
                  <div>│   └── workflows/ci.yml       <span className="text-text-muted">{'# Build + test + deploy'}</span></div>
                  <div>├── turbo.json                  <span className="text-text-muted">{'# Turborepo pipeline config'}</span></div>
                  <div>├── .env.example                <span className="text-text-muted">{'# Required env vars template'}</span></div>
                  <div>├── package.json                <span className="text-text-muted">{'# npm workspace root'}</span></div>
                  <div>├── README.md</div>
                  <div>└── Makefile                   <span className="text-text-muted">{'# Common commands: make build, make test'}</span></div>
                </div>
              </Card>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Putting everything on-chain — storage costs add up fast; use IPFS for media and indexers for history</li>
                  <li>• Not building an indexer — forces users to wait for slow on-chain queries for basic list/search features</li>
                  <li>• Skipping testnet integration tests — contract bugs on mainnet are expensive or impossible to fix</li>
                  <li>• Tight coupling between frontend and contract — use an abstraction layer so contract upgrades don&apos;t break the UI</li>
                </ul>
              </Card>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" /> Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'A full-stack dApp has 5 layers: frontend, SDK/middleware, indexer, smart contract, and the NEAR protocol itself',
                    'Use a monorepo to keep contract, frontend, and indexer in sync — the #1 bug source is version mismatches',
                    'Store authoritative data on-chain, fast-query data in an indexer, and large files on IPFS/Arweave',
                    'Deploy through a pipeline: local → testnet → staging → mainnet, with integration tests at each stage',
                    'Abstract blockchain complexity from users — hide gas, show loading states, and use optimistic UI updates',
                    'Test at every layer: unit tests for contracts, sandbox integration tests, and E2E browser tests for the frontend',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-near-green mt-0.5 font-bold">→</span> {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete Button */}
              <div className="flex justify-center pt-2">
                <motion.button
                  onClick={handleComplete}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2',
                    completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/20 cursor-pointer'
                  )}
                  disabled={completed}
                >
                  {completed ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                      Module Complete!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Complete
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default BuildingADapp;
