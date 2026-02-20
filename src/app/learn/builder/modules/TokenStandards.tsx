'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Coins, Image, Repeat, Layers, ArrowRight,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TokenStandardsProps {
  isActive: boolean;
  onToggle?: () => void;
}

// ─── Interactive Visual: Token Transfer Flow ───────────────────────────────────

const flowSteps = [
  {
    id: 0,
    actor: 'User',
    action: 'Calls ft_transfer_call',
    target: 'Token Contract',
    color: 'from-amber-500 to-yellow-500',
    desc: 'User initiates a transfer-and-call, sending tokens to the DEX along with a msg parameter describing the desired swap.',
  },
  {
    id: 1,
    actor: 'Token Contract',
    action: 'Transfers tokens',
    target: 'DEX Contract',
    color: 'from-yellow-500 to-orange-500',
    desc: 'The token contract moves the tokens to the DEX receiver. Then it calls ft_on_transfer on the DEX with the msg data.',
  },
  {
    id: 2,
    actor: 'DEX Contract',
    action: 'Processes ft_on_transfer',
    target: '(internal)',
    color: 'from-orange-500 to-red-500',
    desc: 'The DEX reads the msg, executes the swap logic, and returns the number of unused tokens (0 if all were used for the swap).',
  },
  {
    id: 3,
    actor: 'Token Contract',
    action: 'Calls ft_resolve_transfer',
    target: '(callback)',
    color: 'from-red-500 to-pink-500',
    desc: 'The token contract checks how many tokens the DEX did not use. Any unused tokens are refunded back to the original sender.',
  },
];

function TokenFlowVisualizer() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    let step = 0;
    setActiveStep(0);
    const interval = setInterval(() => {
      step += 1;
      if (step >= flowSteps.length) {
        setIsPlaying(false);
        setActiveStep(null);
        clearInterval(interval);
      } else {
        setActiveStep(step);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-4">
      {/* Play button */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-amber-400">ft_transfer_call FLOW</span>
        <button
          onClick={() => { setIsPlaying(true); setActiveStep(0); }}
          className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
        >
          {isPlaying ? 'Playing...' : 'Play Animation'}
        </button>
      </div>

      {/* Flow steps */}
      <div className="space-y-2">
        {flowSteps.map((step) => (
          <motion.div
            key={step.id}
            onClick={() => { setIsPlaying(false); setActiveStep(activeStep === step.id ? null : step.id); }}
            className={cn(
              'rounded-lg border p-3 cursor-pointer transition-all',
              activeStep === step.id
                ? 'border-amber-500/50 bg-amber-500/10'
                : 'border-border bg-black/20 hover:border-amber-500/30'
            )}
            animate={activeStep === step.id ? { scale: 1.02 } : { scale: 1 }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold',
                step.color
              )}>
                {step.id + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">{step.actor}</span>
                  <ArrowRight className="w-3 h-3 text-text-muted" />
                  <span className="text-sm text-amber-400">{step.action}</span>
                </div>
                <span className="text-xs text-text-muted">{step.target}</span>
              </div>
              {activeStep === step.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-amber-400"
                />
              )}
            </div>
            <AnimatePresence>
              {activeStep === step.id && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-xs text-text-muted mt-2 leading-relaxed overflow-hidden"
                >
                  {step.desc}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-text-muted">
        Click steps or press Play to animate the transfer-and-call flow
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-amber-400" />
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
  const correctAnswer = 3;
  const options = [
    'ft_transfer_call requires the receiver to first call ft_approve on the token contract',
    'NFTs on NEAR use the same standard as Ethereum ERC-721 with no differences',
    'Fungible tokens on NEAR use 18 decimals by default, just like on Ethereum',
    'ft_transfer_call sends tokens AND calls ft_on_transfer on the receiver in a single transaction',
  ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">
        Which statement about NEAR token standards is correct?
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
              ? 'Correct! ft_transfer_call is a single-transaction pattern: it transfers tokens to the receiver and then calls ft_on_transfer on that contract. This is more efficient than Ethereum\'s approve + transferFrom two-step pattern.'
              : 'Not quite. NEAR uses ft_transfer_call which combines transfer + receiver notification in one transaction. No approval step needed. Also, NEAR uses 24 decimals (not 18), and NEP-171 has significant differences from ERC-721.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const TokenStandards: React.FC<TokenStandardsProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['token-standards']) setCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['token-standards'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-amber-500/20">
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
              : 'bg-gradient-to-br from-amber-500 to-yellow-500'
          )}>
            {completed ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Coins className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Token Standards</h3>
            <p className="text-text-muted text-sm">Build fungible tokens (NEP-141) and NFTs (NEP-171) on NEAR</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Complete</Badge>
          )}
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
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
            <div className="border-t border-amber-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs text-amber-400">
                <BookOpen className="w-3 h-3" />
                Module 14 of 27
                <span className="text-text-muted">|</span>
                <Clock className="w-3 h-3" />
                60 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-amber-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Tokens are the{' '}
                  <span className="text-amber-400 font-medium">atoms of blockchain applications</span>.
                  Fungible tokens (NEP-141) represent interchangeable value like currencies and rewards.
                  Non-fungible tokens (NEP-171) represent unique assets like art, game items, or identity.
                  NEAR improves on Ethereum with a{' '}
                  <span className="text-amber-400 font-medium">single-transaction transfer-and-call pattern</span>{' '}
                  that replaces the clunky approve + transferFrom two-step flow. This makes DeFi
                  composability simpler, cheaper, and more user-friendly.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {'\u{1F504}'} Token Transfer Flow
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Visualize how ft_transfer_call works step by step -- the backbone of all DeFi on NEAR.
                </p>
                <TokenFlowVisualizer />
              </div>

              {/* FT Code Example */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {'\u{1F4BB}'} Building a Fungible Token
                </h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div><span className="text-purple-400">use</span> near_sdk::{'{'}near, env, PanicOnDefault, AccountId{'}'};</div>
                  <div><span className="text-purple-400">use</span> near_sdk::json_types::U128;</div>
                  <div><span className="text-purple-400">use</span> near_sdk::store::LookupMap;</div>
                  <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                  <div><span className="text-purple-400">#[derive(PanicOnDefault)]</span></div>
                  <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">FungibleToken</span> {'{'}</div>
                  <div>{'    '}owner_id: <span className="text-cyan-400">AccountId</span>,</div>
                  <div>{'    '}total_supply: <span className="text-cyan-400">u128</span>,</div>
                  <div>{'    '}balances: LookupMap&lt;AccountId, <span className="text-cyan-400">u128</span>&gt;,</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">#[near]</span></div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">FungibleToken</span> {'{'}</div>
                  <div>{'    '}<span className="text-purple-400">#[init]</span></div>
                  <div>{'    '}<span className="text-purple-400">pub fn</span> <span className="text-near-green">new</span>(</div>
                  <div>{'        '}owner_id: AccountId,</div>
                  <div>{'        '}total_supply: U128,</div>
                  <div>{'    '}) -&gt; Self {'{'}</div>
                  <div>{'        '}<span className="text-purple-400">let mut</span> ft = Self {'{'}</div>
                  <div>{'            '}owner_id: owner_id.clone(),</div>
                  <div>{'            '}total_supply: total_supply.0,</div>
                  <div>{'            '}balances: LookupMap::new(<span className="text-yellow-300">b&quot;b&quot;</span>),</div>
                  <div>{'        '}{'}'};  </div>
                  <div>{'        '}ft.balances.insert(owner_id, total_supply.0);</div>
                  <div>{'        '}ft</div>
                  <div>{'    '}{'}'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* FT vs NFT Comparison */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {'\u{2696}'} FT vs NFT at a Glance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card variant="default" padding="md" className="border-amber-500/20">
                    <h5 className="font-semibold text-amber-400 text-sm mb-2">Fungible Tokens (NEP-141)</h5>
                    <ul className="text-xs text-text-muted space-y-1">
                      <li>{'- '}All tokens are identical and interchangeable</li>
                      <li>{'- '}Divisible (24 decimals on NEAR)</li>
                      <li>{'- '}Balance is a number (u128)</li>
                      <li>{'- '}Use case: currencies, rewards, governance</li>
                      <li>{'- '}Like ERC-20 on Ethereum</li>
                    </ul>
                  </Card>
                  <Card variant="default" padding="md" className="border-pink-500/20">
                    <h5 className="font-semibold text-pink-400 text-sm mb-2">Non-Fungible Tokens (NEP-171)</h5>
                    <ul className="text-xs text-text-muted space-y-1">
                      <li>{'- '}Each token is unique with its own ID</li>
                      <li>{'- '}Not divisible (whole units only)</li>
                      <li>{'- '}Identified by token_id string</li>
                      <li>{'- '}Use case: art, gaming items, identity</li>
                      <li>{'- '}Like ERC-721 on Ethereum</li>
                    </ul>
                  </Card>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-amber-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="text-amber-400 font-medium">NEAR uses 24 decimals</span> for
                  NEAR tokens (1 NEAR = 10^24 yoctoNEAR), not 18 like Ethereum. When building
                  your own FT, you choose the decimals. Most NEAR ecosystem tokens use 24 decimals
                  for consistency, but stablecoins often use 6 (like USDC). Always check{' '}
                  <code className="text-amber-400 bg-amber-500/10 px-1 rounded">ft_metadata().decimals</code>{' '}
                  before doing any arithmetic with token amounts.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  {'\u{1F9E9}'} Core Concepts
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Repeat}
                    title="Transfer-and-Call Pattern"
                    preview="Single-transaction token transfers with receiver notification"
                    details="ft_transfer_call sends tokens to a receiver and calls ft_on_transfer on it in one transaction. The receiver processes the tokens and returns any unused amount for refund. This replaces Ethereum's two-step approve + transferFrom pattern. It is how DEX swaps, lending deposits, and all DeFi composability works on NEAR."
                  />
                  <ConceptCard
                    icon={Image}
                    title="NFT Metadata (NEP-177)"
                    preview="How NFTs describe themselves with title, media, and attributes"
                    details="NEP-177 defines TokenMetadata with fields like title, description, media (image URL), copies, and extra (JSON attributes). The media field typically points to IPFS or Arweave for decentralized storage. Collection-level metadata (NFTContractMetadata) includes the collection name, symbol, icon, and base_uri for resolving relative media paths."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Storage Registration (NEP-145)"
                    preview="Users must register before receiving tokens"
                    details="Before a user can receive FTs, they must call storage_deposit on the token contract. This locks a small amount of NEAR to cover storing their balance entry. If you try to ft_transfer to an unregistered account, the transaction will panic. Always check storage_balance_of before sending tokens programmatically, or handle the error gracefully."
                  />
                  <ConceptCard
                    icon={Coins}
                    title="NEP-245: Multi Token"
                    preview="One contract for both fungible and non-fungible tokens"
                    details="NEP-245 combines FT and NFT functionality in a single contract. A game could have gold coins (fungible) and unique swords (non-fungible) in one contract. This reduces deployment costs and simplifies cross-token interactions. Think of it like Ethereum's ERC-1155 but designed for NEAR's async model."
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>{'- '}Forgetting storage_deposit before ft_transfer to a new account</li>
                  <li>{'- '}Using 18 decimals from Ethereum habit instead of 24</li>
                  <li>{'- '}Not implementing ft_resolve_transfer callback for refund handling</li>
                  <li>{'- '}Storing large NFT media on-chain instead of IPFS/Arweave</li>
                  <li>{'- '}Not requiring 1 yoctoNEAR on transfer methods for security</li>
                </ul>
              </Card>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-amber-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'NEP-141 defines fungible tokens and NEP-171 defines NFTs -- the core token building blocks on NEAR',
                    'ft_transfer_call is a single-transaction pattern that replaces Ethereum\'s approve + transferFrom flow',
                    'NEAR uses 24 decimals by default (not 18) -- always check ft_metadata before arithmetic',
                    'Users must call storage_deposit before receiving FTs -- this is a common integration gotcha',
                    'Store NFT media on IPFS or Arweave, not on-chain -- only keep the URL in contract state',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-near-green mt-0.5 font-bold">{'\u2192'}</span>
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

export default TokenStandards;
