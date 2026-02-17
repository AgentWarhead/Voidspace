'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  CheckCircle2,
  Lightbulb,
  Zap,
  Terminal,
  ArrowRight,
  Search,
  Send,
  Key,
  Copy,
  Play,
  AlertTriangle,
  Layers,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface NearCliMasteryProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: CLI Command Explorer ──────────────────────────────────

const cliCategories = [
  {
    id: 'account',
    label: 'Account',
    icon: '👤',
    color: 'from-blue-500/20 to-blue-500/10',
    border: 'border-blue-500/30',
    commands: [
      { cmd: 'near account view-account-summary', desc: 'View balance, storage, and keys' },
      { cmd: 'near account create-account fund-myself', desc: 'Create a sub-account and fund it' },
      { cmd: 'near account delete-account', desc: 'Delete account, send NEAR to beneficiary' },
    ],
  },
  {
    id: 'tokens',
    label: 'Tokens',
    icon: '💰',
    color: 'from-yellow-500/20 to-yellow-500/10',
    border: 'border-yellow-500/30',
    commands: [
      { cmd: 'near tokens send-near', desc: 'Transfer NEAR between accounts' },
      { cmd: 'near tokens view-near-balance', desc: 'Check NEAR balance for any account' },
    ],
  },
  {
    id: 'contract',
    label: 'Contract',
    icon: '📜',
    color: 'from-emerald-500/20 to-emerald-500/10',
    border: 'border-emerald-500/30',
    commands: [
      { cmd: 'near contract deploy', desc: 'Upload WASM binary to an account' },
      { cmd: 'near contract call-function as-read-only', desc: 'Free view call — no gas needed' },
      { cmd: 'near contract call-function as-transaction', desc: 'Change call — costs gas' },
      { cmd: 'near contract view-storage', desc: 'Inspect raw key-value pairs on-chain' },
    ],
  },
  {
    id: 'keys',
    label: 'Keys',
    icon: '🔑',
    color: 'from-purple-500/20 to-purple-500/10',
    border: 'border-purple-500/30',
    commands: [
      { cmd: 'near account list-keys', desc: 'Show all access keys and permissions' },
      { cmd: 'near account add-key grant-function-call-access', desc: 'Add a restricted key' },
      { cmd: 'near account delete-key', desc: 'Remove an access key' },
    ],
  },
  {
    id: 'config',
    label: 'Config',
    icon: '⚙️',
    color: 'from-cyan-500/20 to-cyan-500/10',
    border: 'border-cyan-500/30',
    commands: [
      { cmd: 'near config show-connections', desc: 'List configured network connections' },
      { cmd: 'near config add-connection', desc: 'Add a custom RPC endpoint' },
    ],
  },
];

function CliCommandExplorer() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd).catch(() => {});
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  return (
    <div className="relative py-4">
      <div className="flex items-center justify-between gap-1">
        {cliCategories.map((cat, i) => (
          <React.Fragment key={cat.id}>
            <motion.div
              className={cn(
                'flex-1 cursor-pointer rounded-lg border p-3 transition-all text-center',
                cat.border,
                activeCategory === i
                  ? `bg-gradient-to-b ${cat.color}`
                  : 'bg-black/20'
              )}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() =>
                setActiveCategory(activeCategory === i ? null : i)
              }
            >
              <div className="text-xl mb-1">{cat.icon}</div>
              <div className="text-xs font-bold text-text-primary">
                {cat.label}
              </div>
            </motion.div>
            {i < cliCategories.length - 1 && (
              <ArrowRight className="w-4 h-4 text-text-muted/40 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
      <AnimatePresence>
        {activeCategory !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2">
              {cliCategories[activeCategory].commands.map((c, j) => (
                <motion.div
                  key={c.cmd}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: j * 0.06 }}
                  className="bg-black/30 rounded-lg p-3 border border-border flex items-start gap-3 group"
                >
                  <code className="text-xs text-near-green font-mono flex-1">
                    {c.cmd}
                  </code>
                  <button
                    onClick={(e) => handleCopy(c.cmd, e)}
                    className="text-text-muted hover:text-near-green transition-colors flex-shrink-0"
                  >
                    {copiedCmd === c.cmd ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <p className="text-xs text-text-muted hidden sm:block w-48 flex-shrink-0">
                    {c.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        👆 Click each category to explore commands — click the copy icon to grab
        them
      </p>
    </div>
  );
}

// ─── Interactive: Key Types Visualizer ──────────────────────────────────────────

function KeyTypesVisualizer() {
  const [activeKey, setActiveKey] = useState<'full' | 'function' | null>(null);

  const keyTypes = {
    full: {
      title: 'Full-Access Key',
      permissions: [
        'Deploy contracts',
        'Transfer NEAR',
        'Delete account',
        'Add/remove keys',
        'Call any method',
      ],
      warning:
        'Like a master key — never share, remove from contract accounts after deployment',
    },
    function: {
      title: 'Function-Call Key',
      permissions: [
        'Call specific methods only',
        'On one contract only',
        'With gas allowance limit',
        'Cannot transfer NEAR',
        'Cannot modify keys',
      ],
      warning:
        'Like a valet key — limited access, safe to give to dApps and frontends',
    },
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {(['full', 'function'] as const).map((type) => {
        const key = keyTypes[type];
        const isActive = activeKey === type;
        return (
          <motion.div
            key={type}
            onClick={() => setActiveKey(isActive ? null : type)}
            className={cn(
              'cursor-pointer rounded-xl border p-4 transition-all',
              isActive
                ? type === 'full'
                  ? 'border-red-500/40 bg-red-500/5'
                  : 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-border bg-black/20'
            )}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Key
                className={cn(
                  'w-5 h-5',
                  type === 'full' ? 'text-red-400' : 'text-emerald-400'
                )}
              />
              <span className="text-sm font-bold text-text-primary">
                {key.title}
              </span>
            </div>
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1.5 mb-3">
                    {key.permissions.map((p, i) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="text-xs text-text-secondary flex items-center gap-1.5"
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            type === 'full' ? 'bg-red-400' : 'bg-emerald-400'
                          )}
                        />
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                  <p
                    className={cn(
                      'text-[10px] p-2 rounded-lg border',
                      type === 'full'
                        ? 'text-red-300 bg-red-500/5 border-red-500/20'
                        : 'text-emerald-300 bg-emerald-500/5 border-emerald-500/20'
                    )}
                  >
                    💡 {key.warning}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({
  icon: Icon,
  title,
  preview,
  details,
}: {
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
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
  const correctAnswer = 3;
  const options = [
    'View calls (as-read-only) require a wallet signature and cost gas',
    'Sub-accounts can only be created through the web wallet, not the CLI',
    'The near tokens send-near command is free — no gas is charged for transfers',
    'Function-call access keys limit which methods an account can call on a specific contract',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">
        Which statement about NEAR CLI operations is correct?
      </p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              setSelected(i);
              setRevealed(true);
            }}
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
              ? '✓ Correct! Function-call access keys are restricted keys that can only call specific methods on a specific contract, with an optional gas allowance. This is how dApps get limited permission without full account control.'
              : '✗ Not quite. Function-call access keys grant limited permissions — they can only call specified methods on one contract. View calls are free (no signature needed), sub-accounts are created via CLI, and token transfers do cost gas.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const NearCliMastery: React.FC<NearCliMasteryProps> = ({
  isActive,
  onToggle,
}) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(
        localStorage.getItem('voidspace-builder-progress') || '{}'
      );
      progress['near-cli-mastery'] = true;
      localStorage.setItem(
        'voidspace-builder-progress',
        JSON.stringify(progress)
      );
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">
              NEAR CLI Mastery
            </h3>
            <p className="text-text-muted text-sm">
              Master the command line for accounts, contracts, and transactions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Intermediate
          </Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">
            35 min
          </Badge>
          {isActive ? (
            <ChevronUp className="w-5 h-5 text-text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-muted" />
          )}
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
            <div className="border-t border-near-green/20 p-6 space-y-8">
              {/* Module Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green"
              >
                <BookOpen className="w-3 h-3" />
                Module 11 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                35 min read
              </motion.div>

              {/* The Big Idea */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card
                  variant="glass"
                  padding="lg"
                  className="border-near-green/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary">
                      The Big Idea
                    </h2>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    The NEAR CLI is like a{' '}
                    <span className="text-near-green font-medium">
                      universal remote for the entire blockchain
                    </span>
                    . With the right commands, you can create{' '}
                    <span className="text-near-green font-medium">accounts</span>{' '}
                    (set up new users), manage{' '}
                    <span className="text-near-green font-medium">keys</span>{' '}
                    (change locks on doors), call{' '}
                    <span className="text-near-green font-medium">contracts</span>{' '}
                    (press buttons on machines), and send{' '}
                    <span className="text-near-green font-medium">tokens</span>{' '}
                    (transfer money between vaults). Master the CLI and you&apos;ll
                    never need a GUI to interact with NEAR again.
                  </p>
                </Card>
              </motion.div>

              {/* Interactive Command Explorer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  ⚡ CLI Command Explorer
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  The CLI is organized into five major categories — click to
                  explore real commands.
                </p>
                <CliCommandExplorer />
              </motion.div>

              {/* Key Types Visualizer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  🔐 Access Key Types
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  NEAR has two types of keys with very different power levels.
                  Click to compare.
                </p>
                <KeyTypesVisualizer />
              </motion.div>

              {/* Code Example */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  💻 Real CLI Session
                </h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">
                    {'# Create a sub-account for your contract'}
                  </div>
                  <div>
                    <span className="text-near-green">$</span> near account
                    create-account fund-myself app.alice.testnet \
                  </div>
                  <div>
                    {'    '}
                    <span className="text-text-muted">--initial-balance</span>{' '}
                    <span className="text-cyan-400">5</span> NEAR \
                  </div>
                  <div>
                    {'    '}
                    <span className="text-text-muted">--sign-with-keychain</span>
                  </div>
                  <div className="mt-3 text-text-muted">
                    {'# Deploy your contract WASM'}
                  </div>
                  <div>
                    <span className="text-near-green">$</span> near contract
                    deploy app.alice.testnet \
                  </div>
                  <div>
                    {'    '}
                    <span className="text-text-muted">use-file</span>{' '}
                    target/near/my_contract.wasm \
                  </div>
                  <div>
                    {'    '}
                    <span className="text-text-muted">with-init-call</span> new{' '}
                    <span className="text-text-muted">json-args</span>{' '}
                    {'{"owner":"alice.testnet"}'} \
                  </div>
                  <div>
                    {'    '}
                    <span className="text-text-muted">--prepaid-gas</span>{' '}
                    <span className="text-cyan-400">30</span> Tgas
                  </div>
                  <div className="mt-3 text-text-muted">
                    {'# Call a view method (free, no signer needed)'}
                  </div>
                  <div>
                    <span className="text-near-green">$</span> near contract
                    call-function as-read-only \
                  </div>
                  <div>
                    {'    '}app.alice.testnet get_greeting{' '}
                    <span className="text-text-muted">json-args</span> {'{}'}
                  </div>
                  <div className="mt-3 text-text-muted">
                    {'# Add a function-call key for your frontend'}
                  </div>
                  <div>
                    <span className="text-near-green">$</span> near account
                    add-key app.alice.testnet \
                  </div>
                  <div>
                    {'    '}grant-function-call-access \
                  </div>
                  <div>
                    {'    '}
                    <span className="text-text-muted">--allowance</span>{' '}
                    <span className="text-cyan-400">1</span> NEAR \
                  </div>
                  <div>
                    {'    '}
                    <span className="text-text-muted">
                      --receiver-account-id
                    </span>{' '}
                    app.alice.testnet \
                  </div>
                  <div>
                    {'    '}
                    <span className="text-text-muted">--method-names</span>{' '}
                    get_greeting,set_greeting
                  </div>
                </div>
              </motion.div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  🧩 Core Concepts
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Search}
                    title="Account Operations"
                    preview="Create, view, and delete accounts and sub-accounts"
                    details="Use near account view-account-summary to check balances and storage. Create sub-accounts (app.alice.testnet) with fund-myself for deploying contracts. Sub-accounts inherit the parent's namespace and can be deleted to reclaim funds. Always check account state before deploying — verify it has enough balance for storage. The .testnet suffix is free to create, but .near accounts require a registrar."
                  />
                  <ConceptCard
                    icon={Send}
                    title="Contract Calls"
                    preview="View calls are free reads, change calls cost gas"
                    details="Use call-function as-read-only for view calls — they're free and instant, no wallet needed. Use call-function as-transaction for change calls — they need a signer, cost gas, and may require attached NEAR. Always specify json-args with your parameters and prepaid-gas for change calls. Use 30 Tgas as a safe default for simple methods; bump to 100+ Tgas for cross-contract calls."
                  />
                  <ConceptCard
                    icon={Key}
                    title="Key Management"
                    preview="Full-access keys control everything, function-call keys are limited"
                    details="Full-access keys can do anything — deploy, transfer, delete. Function-call keys can only call specific methods on one contract with a gas allowance. After deploying a contract, remove full-access keys and add function-call keys for your frontend. This limits damage if a key is compromised. Use near account list-keys to audit all keys on an account regularly."
                  />
                  <ConceptCard
                    icon={Terminal}
                    title="Deploy & Storage Inspection"
                    preview="Upload WASM, initialize state, and inspect raw storage"
                    details="Deploy with near contract deploy, optionally with with-init-call to set initial state. After deployment, use view-storage all as-text to inspect raw key-value pairs. This reveals how your contract serializes data with Borsh encoding. Watching storage changes after method calls helps debug state issues that aren't visible through method returns."
                  />
                  <ConceptCard
                    icon={Play}
                    title="Interactive Mode"
                    preview="near-cli-rs guides you with prompts — no memorization needed"
                    details="Run near without arguments and the CLI enters interactive mode with step-by-step prompts. It asks what you want to do, which network to use, how to sign, and confirms before sending. This is perfect for learning — you'll discover commands organically. Once comfortable, use the full one-liner syntax for scripting and automation in CI/CD pipelines."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Network Configuration"
                    preview="Switch between testnet, mainnet, and custom RPCs"
                    details="The CLI stores network configs including RPC URLs and chain IDs. Testnet (rpc.testnet.near.org) is for development with free tokens from the faucet. Mainnet (rpc.mainnet.near.org) uses real NEAR. You can add custom connections for localnet (sandbox) or archival nodes. Always double-check your active network before sending transactions — a wrong --networkId flag is irreversible."
                  />
                </div>
              </div>

              {/* Security Gotcha */}
              <Card
                variant="default"
                padding="md"
                className="border-red-500/20 bg-red-500/5"
              >
                <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Security Gotchas
                </h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>
                    • Always double-check the network flag — sending mainnet NEAR
                    on accident is irreversible
                  </li>
                  <li>
                    • Remove full-access keys from contract accounts after
                    deployment — use function-call keys instead
                  </li>
                  <li>
                    • Back up ~/.near-credentials before deleting accounts — lost
                    keys mean lost funds forever
                  </li>
                  <li>
                    • Don&apos;t share CLI output in screenshots — it may contain
                    account IDs and key information
                  </li>
                  <li>
                    • Beware of{' '}
                    <code className="text-red-300">--force</code> flags — they
                    skip confirmation prompts and can cause irreversible actions
                  </li>
                </ul>
              </Card>

              {/* Pro Tips */}
              <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-text-primary mb-3">
                  🎯 Pro Tips
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      tip: 'Pipe JSON output to jq for readable formatting',
                      cmd: 'near ... | jq .',
                    },
                    {
                      tip: 'Use --networkId to override the default network',
                      cmd: '--networkId mainnet',
                    },
                    {
                      tip: 'Check gas burnt in tx receipts for profiling',
                      cmd: 'near tx status <hash>',
                    },
                    {
                      tip: 'Export credentials for CI/CD automation',
                      cmd: 'NEAR_ENV=testnet',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-black/20 rounded-lg p-3 border border-border"
                    >
                      <p className="text-xs text-text-secondary mb-1">
                        {item.tip}
                      </p>
                      <code className="text-xs text-near-green font-mono">
                        {item.cmd}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card
                variant="glass"
                padding="lg"
                className="border-emerald-500/20"
              >
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Key
                  Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'The CLI has five pillars: accounts, tokens, contracts, keys, and config — master each one.',
                    'View calls are free reads (as-read-only), change calls cost gas (as-transaction with signer).',
                    'Function-call keys limit what a key can do — use them instead of full-access keys for security.',
                    'Interactive mode teaches you the CLI — run near with no args to explore commands step by step.',
                    'Always verify your network before transacting — testnet mistakes are free, mainnet mistakes cost real NEAR.',
                  ].map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-text-secondary"
                    >
                      <span className="text-near-green mt-0.5 font-bold">→</span>{' '}
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete */}
              <motion.button
                onClick={handleComplete}
                whileHover={{ scale: completed ? 1 : 1.02 }}
                whileTap={{ scale: completed ? 1 : 0.98 }}
                className={cn(
                  'w-full py-3 rounded-xl font-semibold text-sm transition-all',
                  completed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-near-green/10 text-near-green border border-near-green/30 hover:bg-near-green/20'
                )}
              >
                {completed ? '✓ Module Complete' : 'Mark as Complete'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default NearCliMastery;
