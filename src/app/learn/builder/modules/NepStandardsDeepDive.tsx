'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, FileText, Scale, Plug, Layers, Link,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface NepStandardsDeepDiveProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: NEP Standards Map ─────────────────────────────────────

const nepStandards = [
  {
    id: 'nep141',
    label: 'NEP-141',
    title: 'Fungible Token Core',
    color: 'from-amber-500 to-yellow-500',
    category: 'Token',
    methods: ['ft_transfer', 'ft_transfer_call', 'ft_total_supply', 'ft_balance_of'],
    desc: 'The core FT standard. Defines how to transfer fungible tokens and query balances. Every FT contract must implement this.',
    depends: [],
  },
  {
    id: 'nep145',
    label: 'NEP-145',
    title: 'Storage Management',
    color: 'from-blue-500 to-cyan-500',
    category: 'Infrastructure',
    methods: ['storage_deposit', 'storage_withdraw', 'storage_unregister', 'storage_balance_of'],
    desc: 'Defines how users register and pay for on-chain storage. Required before receiving FTs -- users must deposit to cover their balance entry.',
    depends: ['nep141'],
  },
  {
    id: 'nep148',
    label: 'NEP-148',
    title: 'FT Metadata',
    color: 'from-teal-500 to-emerald-500',
    category: 'Token',
    methods: ['ft_metadata'],
    desc: 'Describes a fungible token: name, symbol, decimals, and icon. Wallets and explorers use this to display token information.',
    depends: ['nep141'],
  },
  {
    id: 'nep171',
    label: 'NEP-171',
    title: 'NFT Core',
    color: 'from-pink-500 to-rose-500',
    category: 'Token',
    methods: ['nft_transfer', 'nft_transfer_call', 'nft_token'],
    desc: 'The core NFT standard. Defines transfer mechanics and token lookup. Each token has a unique ID with its own metadata.',
    depends: [],
  },
  {
    id: 'nep177',
    label: 'NEP-177',
    title: 'NFT Metadata',
    color: 'from-purple-500 to-violet-500',
    category: 'Token',
    methods: ['nft_metadata'],
    desc: 'Describes NFT collections and individual tokens: title, description, media URL, and copies. Used by marketplaces to display NFTs.',
    depends: ['nep171'],
  },
  {
    id: 'nep178',
    label: 'NEP-178',
    title: 'NFT Approval',
    color: 'from-green-500 to-emerald-500',
    category: 'Token',
    methods: ['nft_approve', 'nft_is_approved', 'nft_revoke', 'nft_revoke_all'],
    desc: 'Allows NFT owners to approve other accounts (like marketplaces) to transfer their tokens. Essential for trading on secondary markets.',
    depends: ['nep171'],
  },
  {
    id: 'nep297',
    label: 'NEP-297',
    title: 'Events',
    color: 'from-cyan-500 to-blue-500',
    category: 'Protocol',
    methods: ['EVENT_JSON log format'],
    desc: 'Standard event logging format for indexers. All state changes should emit EVENT_JSON logs so indexers like NEAR Lake can track activity.',
    depends: [],
  },
  {
    id: 'nep330',
    label: 'NEP-330',
    title: 'Contract Metadata',
    color: 'from-orange-500 to-red-500',
    category: 'Protocol',
    methods: ['contract_source_metadata'],
    desc: 'Links deployed WASM to source code for verification. Lets anyone verify the contract was built from specific source code.',
    depends: [],
  },
];

function NepStandardsMap() {
  const [activeNep, setActiveNep] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? nepStandards
    : nepStandards.filter((n) => n.category === filter);

  const active = nepStandards.find((n) => n.id === activeNep);

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'Token', 'Infrastructure', 'Protocol'].map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setActiveNep(null); }}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all border',
              filter === f
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                : 'bg-black/20 border-border text-text-muted hover:border-teal-500/30'
            )}
          >
            {f === 'all' ? 'All Standards' : f}
          </button>
        ))}
      </div>

      {/* Standards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {filtered.map((nep) => (
          <motion.button
            key={nep.id}
            onClick={() => setActiveNep(activeNep === nep.id ? null : nep.id)}
            className={cn(
              'rounded-lg border p-3 text-left transition-all',
              activeNep === nep.id
                ? 'border-teal-500/50 bg-teal-500/10'
                : 'border-border bg-black/20 hover:border-teal-500/30'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={cn(
              'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2',
              nep.color
            )}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-bold text-teal-400">{nep.label}</div>
            <div className="text-xs text-text-muted truncate">{nep.title}</div>
          </motion.button>
        ))}
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
            <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
                  active.color
                )}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">
                    {active.label}: {active.title}
                  </h4>
                  <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20 text-xs">
                    {active.category}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{active.desc}</p>
              <div>
                <p className="text-xs font-semibold text-text-muted mb-1">Required Methods:</p>
                <div className="flex flex-wrap gap-1">
                  {active.methods.map((m) => (
                    <code key={m} className="text-xs bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded">
                      {m}
                    </code>
                  ))}
                </div>
              </div>
              {active.depends.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Link className="w-3 h-3" />
                  <span>Depends on: {active.depends.map((d) => nepStandards.find((n) => n.id === d)?.label).join(', ')}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-text-muted">
        Click any standard to explore its methods and purpose
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-teal-400" />
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
  const correctAnswer = 1;
  const options = [
    'NEP-141 defines how NFTs store their metadata on IPFS',
    'A user must call storage_deposit on a token contract before they can receive fungible tokens',
    'NEP-297 events are automatically emitted by the NEAR runtime for all transactions',
    'NEP-178 approval management is required for all fungible token transfers',
  ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">
        Which statement about NEP standards is correct?
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
              ? 'Correct! NEP-145 Storage Management requires users to call storage_deposit before receiving tokens. This covers the cost of storing their balance entry on-chain.'
              : 'Not quite. NEP-145 requires a storage_deposit call before a user can receive FTs. This is a common gotcha -- without it, token transfers to unregistered accounts will fail.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const NepStandardsDeepDive: React.FC<NepStandardsDeepDiveProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['nep-standards-deep-dive']) setCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['nep-standards-deep-dive'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-teal-500/20">
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
              : 'bg-gradient-to-br from-teal-500 to-cyan-500'
          )}>
            {completed ? <CheckCircle2 className="w-6 h-6 text-white" /> : <BookOpen className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEP Standards Deep Dive</h3>
            <p className="text-text-muted text-sm">Master the NEAR Enhancement Proposals that power the ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Complete</Badge>
          )}
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">45 min</Badge>
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
            <div className="border-t border-teal-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5 text-xs text-teal-400">
                <BookOpen className="w-3 h-3" />
                Module 18 of 22
                <span className="text-text-muted">|</span>
                <Clock className="w-3 h-3" />
                45 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-teal-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-teal-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Think of NEPs like{' '}
                  <span className="text-teal-400 font-medium">USB standards for smart contracts</span>.
                  Just as USB-C means any charger works with any device, NEP-141 means any wallet can
                  transfer any fungible token, and any marketplace can list any NEP-171 NFT. Without
                  standards, every contract would speak a different language and nothing would be
                  interoperable. NEPs are the shared vocabulary that makes the NEAR ecosystem work.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {'\u{1F4DA}'} NEP Standards Explorer
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Filter by category and click any standard to explore its methods and dependencies.
                </p>
                <NepStandardsMap />
              </div>

              {/* Code Example: Storage Management */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {'\u{1F4BB}'} NEP-145 Storage Management in Action
                </h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Required NEP-145 methods for any token contract'}</div>
                  <div className="mt-1">
                    <span className="text-purple-400">fn</span>{' '}
                    <span className="text-near-green">storage_deposit</span>(
                  </div>
                  <div>{'    '}&amp;<span className="text-purple-400">mut</span> self,</div>
                  <div>{'    '}account_id: Option&lt;AccountId&gt;,</div>
                  <div>{'    '}registration_only: Option&lt;bool&gt;,</div>
                  <div>) -&gt; StorageBalance;</div>
                  <div className="mt-2">
                    <span className="text-purple-400">fn</span>{' '}
                    <span className="text-near-green">storage_withdraw</span>(
                  </div>
                  <div>{'    '}&amp;<span className="text-purple-400">mut</span> self,</div>
                  <div>{'    '}amount: Option&lt;U128&gt;,</div>
                  <div>) -&gt; StorageBalance;</div>
                  <div className="mt-2">
                    <span className="text-purple-400">fn</span>{' '}
                    <span className="text-near-green">storage_balance_of</span>(
                  </div>
                  <div>{'    '}&amp;self,</div>
                  <div>{'    '}account_id: AccountId,</div>
                  <div>) -&gt; Option&lt;StorageBalance&gt;;</div>
                  <div className="mt-3 text-text-muted">{'// StorageBalance tells you how much a user has deposited'}</div>
                  <div><span className="text-purple-400">struct</span> <span className="text-cyan-400">StorageBalance</span> {'{'}</div>
                  <div>{'    '}total: U128,     <span className="text-text-muted">{'// Total amount deposited'}</span></div>
                  <div>{'    '}available: U128, <span className="text-text-muted">{'// Amount available to withdraw'}</span></div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Code Example: NEP-297 Events */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {'\u{1F4E1}'} NEP-297 Event Logging
                </h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Emit a standard event for indexers'}</div>
                  <div>env::log_str(&amp;format!(</div>
                  <div>{'    '}<span className="text-yellow-300">{'"EVENT_JSON:{}{}"'}</span>,</div>
                  <div>{'    '}json!({'{'}</div>
                  <div>{'        '}<span className="text-yellow-300">{'"standard"'}</span>: <span className="text-yellow-300">{'"nep171"'}</span>,</div>
                  <div>{'        '}<span className="text-yellow-300">{'"version"'}</span>: <span className="text-yellow-300">{'"1.0.0"'}</span>,</div>
                  <div>{'        '}<span className="text-yellow-300">{'"event"'}</span>: <span className="text-yellow-300">{'"nft_mint"'}</span>,</div>
                  <div>{'        '}<span className="text-yellow-300">{'"data"'}</span>: [{'{'}</div>
                  <div>{'            '}<span className="text-yellow-300">{'"owner_id"'}</span>: <span className="text-yellow-300">{'"alice.near"'}</span>,</div>
                  <div>{'            '}<span className="text-yellow-300">{'"token_ids"'}</span>: [<span className="text-yellow-300">{'"1"'}</span>],</div>
                  <div>{'        '}{'}'}]</div>
                  <div>{'    '}{'}'})</div>
                  <div>));</div>
                </div>
                <p className="text-text-muted text-sm mt-2">
                  Indexers like NEAR Lake watch for EVENT_JSON logs to build queryable databases of all on-chain activity.
                </p>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/5 border border-teal-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-teal-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="text-teal-400 font-medium">NEP-330 Contract Metadata</span> is
                  often overlooked but incredibly valuable. It links your deployed WASM binary to
                  its source code repository, letting anyone verify your contract was built from
                  the code you claim. Add{' '}
                  <code className="text-teal-400 bg-teal-500/10 px-1 rounded">contract_source_metadata</code>{' '}
                  to every production contract -- it builds trust with users and is required by
                  some ecosystem tools.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  {'\u{1F9E9}'} Core Concepts
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Scale}
                    title="The NEP Process"
                    preview="How standards are proposed, reviewed, and adopted"
                    details="Anyone can propose a NEP by opening a pull request on the NEPs GitHub repo. Proposals go through Draft, Review, and Final stages. A NEP needs community consensus and reference implementations before becoming Final. This ensures standards are battle-tested before ecosystem-wide adoption."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="NEP-145 Storage Management"
                    preview="How users pay for their on-chain data in token contracts"
                    details="Before a user can receive fungible tokens, they must call storage_deposit on the token contract. This locks a small amount of NEAR to cover storing their balance entry. The minimum deposit varies by contract but is typically around 0.00125 NEAR. Without this, ft_transfer to an unregistered account will panic. Always check storage_balance_of before transferring tokens programmatically."
                  />
                  <ConceptCard
                    icon={Plug}
                    title="NEP-178 NFT Approvals"
                    preview="How marketplaces get permission to transfer your NFTs"
                    details="When you list an NFT on a marketplace, you call nft_approve with the marketplace contract as the approved account. The marketplace can then call nft_transfer on your behalf when someone buys it. Each approval gets an incrementing approval_id to prevent replay attacks. You can revoke individual approvals or all at once with nft_revoke_all."
                  />
                  <ConceptCard
                    icon={Link}
                    title="NEP-366 Meta Transactions"
                    preview="Let users interact with dApps without owning NEAR for gas"
                    details="Meta transactions allow a relayer to pay gas on behalf of a user. The user signs a special message, the relayer wraps it in a transaction and pays the gas fee. This enables gasless onboarding -- new users can interact with your dApp immediately without buying NEAR first. Combined with Function Call keys, this creates a Web2-like UX."
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>{'- '}Forgetting NEP-145 storage_deposit before sending FTs to a new account</li>
                  <li>{'- '}Not emitting NEP-297 events, making your contract invisible to indexers</li>
                  <li>{'- '}Using wrong decimals (NEAR uses 24 decimals, not 18 like Ethereum)</li>
                  <li>{'- '}Skipping NEP-330 contract metadata, preventing source code verification</li>
                  <li>{'- '}Not implementing ft_resolve_transfer callback in ft_transfer_call flow</li>
                </ul>
              </Card>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-teal-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'NEPs are shared standards that make NEAR contracts interoperable -- like USB for smart contracts',
                    'NEP-141 (FT) and NEP-171 (NFT) are the core token standards that wallets and marketplaces depend on',
                    'NEP-145 storage management is required before users can receive fungible tokens',
                    'NEP-297 events let indexers track all on-chain activity -- always emit them for state changes',
                    'NEP-330 contract metadata links deployed code to source for trustless verification',
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
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/20'
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

export default NepStandardsDeepDive;
