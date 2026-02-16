'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Key, Shield, Users, Lock, Globe,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AccountModelAccessKeysProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: Account & Key Hierarchy ───────────────────────────────

const accountTree = [
  {
    name: 'alice.near',
    type: 'Named Account',
    color: 'from-emerald-500 to-cyan-500',
    keys: [
      {
        label: 'Full Access Key #1',
        type: 'full' as const,
        desc: 'Master key — can deploy contracts, transfer NEAR, add/remove keys, and delete the account entirely.',
      },
      {
        label: 'Function Call Key → game.near',
        type: 'fc' as const,
        desc: 'Scoped to game.near — can only call play() and claim(). Allowance: 0.5 NEAR for gas. Cannot transfer tokens.',
      },
      {
        label: 'Function Call Key → defi.near',
        type: 'fc' as const,
        desc: 'Scoped to defi.near — can only call swap(). Allowance: 1 NEAR for gas. Created when user connected wallet.',
      },
    ],
    children: [
      {
        name: 'nft.alice.near',
        type: 'Sub-account (Contract)',
        keys: [
          {
            label: 'Full Access Key',
            type: 'full' as const,
            desc: 'Controlled by alice.near — allows deploying and upgrading the NFT contract code.',
          },
        ],
      },
      {
        name: 'dao.alice.near',
        type: 'Sub-account (Locked)',
        keys: [
          {
            label: 'No Full Access Key ⚠️',
            type: 'locked' as const,
            desc: 'All Full Access keys removed — contract is permanently immutable. No one can redeploy or change it.',
          },
        ],
      },
    ],
  },
];

function AccountKeyHierarchy() {
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<number | null>(null);

  return (
    <div className="relative py-4 space-y-3">
      {accountTree.map((account) => (
        <div key={account.name} className="space-y-2">
          {/* Main account */}
          <motion.div
            className={cn(
              'rounded-lg border p-3 cursor-pointer transition-all',
              activeAccount === account.name
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-border bg-black/20 hover:border-emerald-500/30'
            )}
            onClick={() => {
              setActiveAccount(activeAccount === account.name ? null : account.name);
              setActiveKey(null);
            }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center',
                  account.color
                )}>
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <code className="text-sm font-semibold text-emerald-400">
                    {account.name}
                  </code>
                  <p className="text-xs text-text-muted">{account.type}</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs">
                {account.keys.length} keys
              </Badge>
            </div>
          </motion.div>

          {/* Expanded keys */}
          <AnimatePresence>
            {activeAccount === account.name && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pl-6 space-y-2"
              >
                {account.keys.map((key, ki) => (
                  <motion.div
                    key={ki}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: ki * 0.1 }}
                    className={cn(
                      'rounded-lg border p-3 cursor-pointer text-xs transition-all',
                      key.type === 'full'
                        ? 'border-red-500/30 hover:bg-red-500/10'
                        : 'border-green-500/30 hover:bg-green-500/10',
                      activeKey === ki && 'bg-surface-hover'
                    )}
                    onClick={() => setActiveKey(activeKey === ki ? null : ki)}
                  >
                    <div className="flex items-center gap-2">
                      {key.type === 'full' ? (
                        <Lock className="w-3 h-3 text-red-400" />
                      ) : (
                        <Key className="w-3 h-3 text-green-400" />
                      )}
                      <span className={
                        key.type === 'full' ? 'text-red-300' : 'text-green-300'
                      }>
                        {key.label}
                      </span>
                    </div>
                    <AnimatePresence>
                      {activeKey === ki && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-text-muted mt-2 overflow-hidden leading-relaxed"
                        >
                          {key.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                {/* Sub-accounts */}
                {account.children?.map((child) => (
                  <motion.div
                    key={child.name}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="rounded-lg border border-cyan-500/30 p-3 bg-cyan-500/5"
                  >
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-cyan-400 font-semibold">
                        {child.name}
                      </code>
                      <span className="text-xs text-text-muted">
                        ({child.type})
                      </span>
                    </div>
                    {child.keys.map((k, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 mt-2 text-xs text-text-muted"
                      >
                        {k.type === 'locked' ? (
                          <Shield className="w-3 h-3 text-orange-400" />
                        ) : (
                          <Lock className="w-3 h-3 text-red-400" />
                        )}
                        <span>{k.label}</span>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <p className="text-center text-xs text-text-muted mt-3">
        👆 Click accounts and keys to explore the hierarchy
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
    <Card
      variant="glass"
      padding="md"
      className="cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary">{title}</h4>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
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
    'It can transfer NEAR tokens from the account to any recipient',
    'It can deploy new smart contract code to the account',
    'It can only call specific methods on a specific contract with a gas allowance',
    'It has the same permissions as a Full Access key but with a time limit',
  ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">
        What is true about a Function Call Access Key on NEAR?
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
              ? '✓ Correct! Function Call keys are scoped to a specific receiver contract and method names, with a limited gas allowance. They cannot transfer tokens, deploy code, or perform any other account-level actions.'
              : '✗ Not quite. Function Call keys are restricted — they can only call specified methods on a specific contract and have a gas allowance limit. They cannot transfer NEAR or deploy code.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const AccountModelAccessKeys: React.FC<AccountModelAccessKeysProps> = ({
  isActive,
  onToggle,
}) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['account-model-access-keys']) setCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['account-model-access-keys'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            completed
              ? 'bg-gradient-to-br from-emerald-500 to-green-600'
              : 'bg-gradient-to-br from-emerald-500 to-cyan-500'
          )}>
            {completed ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Key className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">
              Account Model &amp; Access Keys
            </h3>
            <p className="text-text-muted text-sm">
              NEAR&apos;s human-readable accounts and key-based permissions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">✓ Complete</Badge>
          )}
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">
            Intermediate
          </Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">
            30 min
          </Badge>
          {isActive ? (
            <ChevronUp className="w-5 h-5 text-text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-muted" />
          )}
        </div>
      </div>

      {/* ── Expanded Content ── */}
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
                Module 7 of 22
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                30 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">
                    The Big Idea
                  </h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Think of a NEAR account like a{' '}
                  <span className="text-near-green font-medium">
                    hotel room keycard system
                  </span>
                  . Your account name (
                  <code className="text-emerald-400">alice.near</code>) is
                  your room number — human-readable and easy to remember. A{' '}
                  <span className="text-near-green font-medium">
                    Full Access key
                  </span>{' '}
                  is the master key that opens every door, controls the safe,
                  and can check you out. A{' '}
                  <span className="text-near-green font-medium">
                    Function Call key
                  </span>{' '}
                  is like a pool-only keycard — it lets you swim but can&apos;t
                  open your room or safe. This multi-key model is unique to
                  NEAR and enables seamless dApp experiences without constant
                  wallet pop-ups.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  🔑 Account &amp; Key Hierarchy
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Explore how NEAR accounts, sub-accounts, and access keys
                  relate to each other.
                </p>
                <AccountKeyHierarchy />
              </div>

              {/* Code Example */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  💻 Code In Action
                </h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">
                    {'// Grant a Function Call key from within a contract'}
                  </div>
                  <div>
                    <span className="text-purple-400">use</span> near_sdk::
                    {'{'}env, near, Promise, NearToken, PublicKey{'}'};
                  </div>
                  <div>
                    <span className="text-purple-400">use</span>{' '}
                    near_sdk::Allowance;
                  </div>
                  <div className="mt-2">
                    #[<span className="text-yellow-300">near</span>
                    (contract_state)]
                  </div>
                  <div>
                    <span className="text-purple-400">pub struct</span>{' '}
                    <span className="text-cyan-400">GameContract</span> {'{'}
                  </div>
                  <div>    owner_id: near_sdk::AccountId,</div>
                  <div>{'}'}</div>
                  <div className="mt-2">
                    #[<span className="text-yellow-300">near</span>]
                  </div>
                  <div>
                    <span className="text-purple-400">impl</span>{' '}
                    <span className="text-cyan-400">GameContract</span> {'{'}
                  </div>
                  <div>
                    {'    '}
                    <span className="text-purple-400">pub fn</span>{' '}
                    <span className="text-near-green">grant_play_access</span>
                    (
                  </div>
                  <div>
                    {'        '}&amp;
                    <span className="text-purple-400">mut</span> self,
                  </div>
                  <div>{'        '}public_key: PublicKey,</div>
                  <div>    ) -&gt; Promise {'{'}</div>
                  <div>
                    {'        '}
                    <span className="text-text-muted">
                      // Create a key limited to play_turn and claim_reward
                    </span>
                  </div>
                  <div>
                    {'        '}Promise::new(env::current_account_id())
                  </div>
                  <div>{'            '}.add_access_key_allowance(</div>
                  <div>{'                '}public_key,</div>
                  <div>{'                '}Allowance::limited(</div>
                  <div>
                    {'                    '}NearToken::from_millinear(250)
                  </div>
                  <div>{'                '}).unwrap(),</div>
                  <div>{'                '}env::current_account_id(),</div>
                  <div>
                    {'                '}
                    <span className="text-yellow-300">
                      &quot;play_turn,claim_reward&quot;
                    </span>
                  </div>
                  <div>{'                    '}.to_string(),</div>
                  <div>{'            '})</div>
                  <div>    {'}'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="text-emerald-400 font-medium">Implicit accounts</span> (64-character hex strings like{' '}
                  <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">98793cd91a3f870fb126f66285808c7e094afcfc4eda8a970f6648cdf0dbd6de</code>)
                  are derived directly from an ed25519 public key and exist as soon as someone sends NEAR to that address — no
                  registration needed. <span className="text-emerald-400 font-medium">Named accounts</span> (like{' '}
                  <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">alice.near</code>) require an on-chain
                  registration transaction and cost ~0.1 NEAR in storage. Use implicit accounts for programmatic key
                  management and named accounts for user-facing identities.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  🧩 Core Concepts
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Globe}
                    title="Named Accounts"
                    preview="Human-readable identifiers like alice.near instead of hex addresses"
                    details="NEAR accounts are 2-64 characters, registered on-chain. Top-level accounts (alice.near) are created through registrars. Sub-accounts (nft.alice.near) can only be created by the parent account. This creates a natural namespace for organizing contracts — deploy your NFT contract to nft.yourapp.near and your token to ft.yourapp.near. Implicit accounts (64-char hex) also exist and are derived from public keys."
                  />
                  <ConceptCard
                    icon={Lock}
                    title="Full Access Keys"
                    preview="Master keys that can perform any action on the account"
                    details="A Full Access key can transfer tokens, deploy contracts, delete the account, and add or remove other keys. Each account starts with one Full Access key. You can add more for multi-device access, or delete the last one to 'lock' a contract — making it permanently immutable. This locking pattern is a common trust mechanism for production contracts where users need to verify the code cannot change."
                  />
                  <ConceptCard
                    icon={Key}
                    title="Function Call Keys"
                    preview="Scoped keys limited to specific contracts and methods"
                    details="Function Call keys specify a receiver_id (which contract), method_names (which functions), and an allowance (gas budget in NEAR). When a user connects a wallet to a dApp, the wallet creates a Function Call key scoped to that dApp's contract. This enables seamless transactions without wallet pop-ups for each action — the key signs transactions automatically until the allowance runs out."
                  />
                  <ConceptCard
                    icon={Users}
                    title="Sub-accounts"
                    preview="Hierarchical accounts created by parent accounts"
                    details="Any account can create sub-accounts under its namespace. alice.near can create nft.alice.near, dao.alice.near, etc. Sub-accounts are fully independent once created — the parent cannot control them unless it retains a Full Access key. This pattern is ideal for deploying multiple contracts under a unified brand. Each sub-account needs its own NEAR balance for storage."
                  />
                  <ConceptCard
                    icon={Shield}
                    title="Storage Staking"
                    preview="Accounts pay for their own on-chain storage by locking NEAR"
                    details="Every byte stored on-chain costs approximately 0.00001 NEAR, which is locked (not burned). Account names lock ~0.1 NEAR, each access key ~0.0004 NEAR, and contract state varies by data size. When storage is freed, the locked NEAR is returned. This model prevents state bloat and ensures sustainable chain growth. Always account for storage costs when designing contracts."
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card
                variant="default"
                padding="md"
                className="border-orange-500/20 bg-orange-500/5"
              >
                <h4 className="font-semibold text-orange-400 mb-2">
                  ⚠️ Common Mistakes
                </h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>
                    • Deleting your only Full Access key and losing control
                    of the account forever
                  </li>
                  <li>
                    • Setting Function Call key allowances too low, causing
                    user transactions to fail mid-session
                  </li>
                  <li>
                    • Not using sub-accounts for contract deployment — makes
                    upgrades and organization harder
                  </li>
                  <li>
                    • Forgetting that implicit accounts (64-char hex) cannot
                    create sub-accounts
                  </li>
                  <li>
                    • Not accounting for storage costs when creating new
                    accounts or adding keys programmatically
                  </li>
                </ul>
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
                    'NEAR accounts are human-readable (alice.near) and support hierarchical sub-accounts for contract organization',
                    'Full Access keys are master keys — Function Call keys are scoped to specific contracts and methods with a gas allowance',
                    'Function Call keys enable seamless dApp UX without constant wallet confirmation pop-ups',
                    'Deleting all Full Access keys permanently locks a contract — a trust mechanism for immutable production code',
                    'Every account pays for its own storage by locking NEAR tokens proportional to bytes used on-chain',
                  ].map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-text-secondary"
                    >
                      <span className="text-near-green mt-0.5 font-bold">
                        →
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete Button */}
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

export default AccountModelAccessKeys;
