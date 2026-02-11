'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowRightLeft, ChevronDown, CheckCircle2, Code2, Zap,
  Terminal, BookOpen, Users, Shield, Globe, Lightbulb, ExternalLink,
  AlertTriangle, Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import { cn } from '@/lib/utils';

/* ─── Concept Map Data ─────────────────────────────────────── */

interface ConceptMapping {
  solana: string;
  near: string;
  explanation: string;
  important?: boolean;
}

const CONCEPT_MAP: ConceptMapping[] = [
  {
    solana: 'Program',
    near: 'Smart Contract',
    explanation: 'Same idea — deployed code that executes on-chain. NEAR contracts are deployed to named accounts (e.g., contract.alice.near) rather than program IDs.',
  },
  {
    solana: 'Account (data storage)',
    near: 'Contract State (key-value)',
    explanation: 'Solana stores data in separate accounts owned by programs. NEAR stores data in a key-value trie attached to the contract account. NEAR\'s model is simpler — no need to manage separate data accounts.',
  },
  {
    solana: 'PDA (Program Derived Address)',
    near: 'Sub-accounts',
    explanation: 'Solana uses PDAs as deterministic addresses derived from seeds. NEAR uses sub-accounts (app.user.near) which are human-readable and have their own access keys.',
  },
  {
    solana: 'CPI (Cross-Program Invocation)',
    near: 'Cross-contract calls (async!)',
    explanation: 'This is a big difference. Solana CPIs are synchronous within a transaction. NEAR cross-contract calls are asynchronous — they execute in a future block and return results via callbacks.',
    important: true,
  },
  {
    solana: 'Anchor macros',
    near: '#[near] macro',
    explanation: 'Anchor\'s #[program] and #[derive(Accounts)] map to NEAR\'s #[near] macro. Both generate boilerplate for serialization, deserialization, and entry points.',
  },
  {
    solana: 'Rent (account storage)',
    near: 'Storage staking',
    explanation: 'Solana charges rent for account storage (rent-exempt minimum ~0.00089 SOL/byte/epoch). NEAR stakes 0.01 NEAR per KB — and refunds it when data is deleted. No risk of data garbage collection.',
    important: true,
  },
  {
    solana: 'Transaction',
    near: 'Transaction → Receipt(s)',
    explanation: 'Solana transactions are atomic. NEAR transactions generate receipts that may execute across blocks (especially cross-contract calls). Understanding NEAR\'s receipt model is crucial.',
    important: true,
  },
];

/* ─── Quiz Data ────────────────────────────────────────────── */

interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_ITEMS: QuizItem[] = [
  {
    question: 'What type are NEAR account names?',
    options: ['32-byte public keys', 'Human-readable strings (e.g., alice.near)', 'Hex addresses', 'UUIDs'],
    correctIndex: 1,
    explanation: 'NEAR uses human-readable account names like alice.near, with sub-accounts like app.alice.near. This is one of NEAR\'s most distinctive features.',
  },
  {
    question: 'How do cross-contract calls work on NEAR?',
    options: ['Synchronously like Solana CPI', 'Via IBC like Cosmos', 'Asynchronously via Promises', 'Through external relayers'],
    correctIndex: 2,
    explanation: 'NEAR cross-contract calls are asynchronous — they create Promises that execute in future blocks. You use .then() callbacks to handle results, unlike Solana\'s synchronous CPI.',
  },
  {
    question: 'What happens to your NEAR when you store data?',
    options: ['It\'s burned permanently', 'It\'s staked and refunded when data is deleted', 'It\'s sent to validators', 'Nothing — storage is free'],
    correctIndex: 1,
    explanation: 'NEAR uses storage staking: 0.01 NEAR per KB is locked while data exists. Delete the data and you get the NEAR back. No risk of data loss from insufficient balance.',
  },
  {
    question: 'What is unique about NEAR\'s Chain Signatures?',
    options: ['They\'re faster than multisig', 'They let NEAR accounts sign transactions on other blockchains', 'They use quantum-resistant cryptography', 'They replace private keys'],
    correctIndex: 1,
    explanation: 'Chain Signatures use MPC threshold cryptography to let NEAR accounts sign transactions on any blockchain — Bitcoin, Ethereum, Solana, etc. — without bridges.',
  },
  {
    question: 'Can you write NEAR smart contracts in JavaScript?',
    options: ['No, only Rust', 'Yes, via near-sdk-js', 'Only for testing', 'Only on testnet'],
    correctIndex: 1,
    explanation: 'NEAR is unique among major L1s in supporting both Rust (near-sdk-rs) and JavaScript (near-sdk-js) for smart contracts. JS contracts compile to WebAssembly and run on mainnet.',
  },
];

/* ─── Concept Translator Component ─────────────────────────── */

function ConceptTranslator() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {CONCEPT_MAP.map((mapping, i) => (
        <GlowCard
          key={i}
          className="cursor-pointer"
          onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-400">
                    {mapping.solana}
                  </span>
                  <ArrowRightLeft className="w-4 h-4 text-text-muted shrink-0" />
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-near-green/10 border border-near-green/20 text-xs font-mono text-near-green">
                    {mapping.near}
                  </span>
                  {mapping.important && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-accent-orange/10 border border-accent-orange/20 text-accent-orange">
                      KEY DIFFERENCE
                    </span>
                  )}
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-text-muted" />
              </motion.div>
            </div>

            <AnimatePresence>
              {expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 pt-3 border-t border-border text-sm text-text-secondary leading-relaxed">
                    {mapping.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlowCard>
      ))}
    </div>
  );
}

/* ─── Code Comparison Component ────────────────────────────── */

function CodeComparison({
  title,
  solanaCode,
  nearCode,
  solanaLabel,
  nearLabel,
}: {
  title: string;
  solanaCode: string;
  nearCode: string;
  solanaLabel?: string;
  nearLabel?: string;
}) {
  const [activeTab, setActiveTab] = useState<'solana' | 'near'>('near');

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-hover border-b border-border">
        <span className="text-xs font-medium text-text-primary">{title}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('solana')}
            className={cn(
              'px-3 py-1 rounded text-xs font-mono transition-colors',
              activeTab === 'solana'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {solanaLabel || 'Solana (Anchor)'}
          </button>
          <button
            onClick={() => setActiveTab('near')}
            className={cn(
              'px-3 py-1 rounded text-xs font-mono transition-colors',
              activeTab === 'near'
                ? 'bg-near-green/20 text-near-green border border-near-green/30'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {nearLabel || 'NEAR (near-sdk)'}
          </button>
        </div>
      </div>
      <div className="bg-[#0d1117] p-4 overflow-x-auto">
        <pre className="text-xs font-mono text-text-secondary leading-relaxed">
          <code>{activeTab === 'solana' ? solanaCode : nearCode}</code>
        </pre>
      </div>
    </div>
  );
}

/* ─── Quiz Component ───────────────────────────────────────── */

function KnowledgeQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === QUIZ_ITEMS[currentQ].correctIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < QUIZ_ITEMS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <Card variant="glass" padding="lg">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-near-green">{score}/{QUIZ_ITEMS.length}</div>
          <h3 className="text-lg font-semibold text-text-primary">
            {score === QUIZ_ITEMS.length
              ? 'Perfect Score! You\'re ready to build on NEAR.'
              : score >= 3
                ? 'Great job! You\'ve got a solid foundation.'
                : 'Good start — review the concepts above and try again!'}
          </h3>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentQ(0);
                setSelected(null);
                setScore(0);
                setShowResult(false);
                setAnswered(false);
              }}
            >
              Try Again
            </Button>
            <Link href="/learn/builder">
              <Button variant="primary" size="sm">
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  const q = QUIZ_ITEMS[currentQ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-text-muted">Question {currentQ + 1} of {QUIZ_ITEMS.length}</span>
        <span className="text-xs font-mono text-near-green">Score: {score}</span>
      </div>
      <h4 className="text-base font-semibold text-text-primary mb-4">{q.question}</h4>
      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={cn(
              'w-full p-3 rounded-lg border text-left text-sm transition-all duration-200',
              !answered && 'hover:border-border-hover',
              selected === i && i === q.correctIndex && 'bg-near-green/10 border-near-green/50 text-near-green',
              selected === i && i !== q.correctIndex && 'bg-red-500/10 border-red-500/50 text-red-400',
              answered && i === q.correctIndex && selected !== i && 'bg-near-green/5 border-near-green/30',
              !answered && 'bg-surface border-border text-text-secondary',
              answered && selected !== i && i !== q.correctIndex && 'bg-surface border-border text-text-muted opacity-50',
            )}
            disabled={answered}
          >
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-lg bg-surface-hover mb-4">
              <p className="text-xs text-text-secondary">{q.explanation}</p>
            </div>
            <Button variant="primary" size="sm" onClick={nextQuestion}>
              {currentQ < QUIZ_ITEMS.length - 1 ? 'Next Question' : 'See Results'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function ForSolanaDevelopers() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-xs font-mono text-near-green">
            <ArrowRightLeft className="w-3 h-3" /> EXPAND YOUR TOOLKIT
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
            NEAR for Solana Developers —{' '}
            <GradientText>Your Rust Skills Already Work Here</GradientText>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Not &ldquo;switch from Solana.&rdquo; More like &ldquo;add NEAR to your toolkit.&rdquo;
            Your Rust knowledge transfers directly — here&apos;s the fast track.
          </p>
        </div>
      </ScrollReveal>

      {/* Skill Transfer Map */}
      <div>
        <SectionHeader title="Concept Translator" badge="SKILL TRANSFER" />
        <p className="text-sm text-text-muted mb-6">
          Click any concept to see how it maps between Solana and NEAR. Items marked <span className="text-accent-orange font-mono text-xs">KEY DIFFERENCE</span> require the most attention.
        </p>
        <ConceptTranslator />
      </div>

      {/* Your First NEAR Contract */}
      <ScrollReveal>
        <div>
          <SectionHeader title="Your First NEAR Contract in 10 Minutes" badge="QUICKSTART" />
          <div className="space-y-6">
            {/* Step 1: Install */}
            <Card variant="glass" padding="lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-near-green/10 border border-near-green/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-near-green">1</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-text-primary">Install NEAR CLI</h4>
                  <p className="text-sm text-text-muted mt-1">One command — works on macOS, Linux, and WSL.</p>
                  <div className="mt-3 rounded-lg bg-[#0d1117] border border-border p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-text-secondary">
                      <code>{`# Install NEAR CLI (Rust-based)
cargo install near-cli-rs

# Or install via npm (JavaScript-based)
npm install -g near-cli

# Create a testnet account
near account create-account fund-myself my-app.testnet '1 NEAR' autogenerate-new-keypair save-to-keychain sign-as my-app.testnet network-config testnet`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 2: Write Contract */}
            <Card variant="glass" padding="lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-near-green/10 border border-near-green/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-near-green">2</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-text-primary">Write a Storage Contract</h4>
                  <p className="text-sm text-text-muted mt-1">
                    Side-by-side: what you know (Anchor) → what you&apos;ll write (near-sdk).
                  </p>
                  <div className="mt-3">
                    <CodeComparison
                      title="Simple Storage Contract"
                      solanaCode={`use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod storage {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        storage.value = String::new();
        storage.owner = ctx.accounts.user.key();
        Ok(())
    }

    pub fn set_value(ctx: Context<SetValue>, value: String) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        require!(storage.owner == ctx.accounts.user.key(), ErrorCode::Unauthorized);
        storage.value = value;
        Ok(())
    }
}

#[account]
pub struct StorageAccount {
    pub value: String,
    pub owner: Pubkey,
}`}
                      nearCode={`use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::{env, near, AccountId};

#[near(contract_state)]
#[derive(Default)]
pub struct Contract {
    value: String,
    owner: Option<AccountId>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            value: String::new(),
            owner: Some(env::predecessor_account_id()),
        }
    }

    pub fn set_value(&mut self, value: String) {
        assert_eq!(
            self.owner.as_ref(),
            Some(&env::predecessor_account_id()),
            "Only the owner can set values"
        );
        self.value = value;
    }

    pub fn get_value(&self) -> &str {
        &self.value
    }
}`}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 3: Build & Deploy */}
            <Card variant="glass" padding="lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-near-green/10 border border-near-green/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-near-green">3</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-text-primary">Build & Deploy to Testnet</h4>
                  <p className="text-sm text-text-muted mt-1">Build with cargo-near, deploy with NEAR CLI.</p>
                  <div className="mt-3 rounded-lg bg-[#0d1117] border border-border p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-text-secondary">
                      <code>{`# Build the contract (compiles to WebAssembly)
cargo near build

# Deploy to testnet
near contract deploy my-app.testnet use-file ./target/near/contract.wasm without-init-call network-config testnet

# Initialize the contract
near contract call-function as-transaction my-app.testnet new json-args {} prepaid-gas '30 Tgas' attached-deposit '0 NEAR' sign-as my-app.testnet network-config testnet

# Call set_value
near contract call-function as-transaction my-app.testnet set_value json-args '{"value": "Hello from a Solana dev!"}' prepaid-gas '30 Tgas' attached-deposit '0 NEAR' sign-as my-app.testnet network-config testnet

# Read the value (view call — free, no gas)
near contract call-function as-read-only my-app.testnet get_value json-args {} network-config testnet`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </ScrollReveal>

      {/* Key Differences */}
      <ScrollReveal>
        <div>
          <SectionHeader title="Key Differences That Will Trip You Up" badge="WATCH OUT" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Clock,
                title: 'Async Cross-Contract Calls',
                detail: 'NEAR cross-contract calls execute asynchronously across blocks. You can\'t read the return value in the same function — use .then() callbacks. This is the biggest mental shift from Solana\'s synchronous CPI.',
                severity: 'high' as const,
              },
              {
                icon: Shield,
                title: 'Storage Staking Model',
                detail: 'When your contract stores data, it must have enough NEAR staked to cover storage costs (0.01 NEAR/KB). Users often attach NEAR to function calls to cover their own storage. When data is deleted, the stake is refunded.',
                severity: 'medium' as const,
              },
              {
                icon: Users,
                title: 'Account Model & Access Keys',
                detail: 'NEAR accounts have named access keys with permissions. A full-access key can do anything. Function-call keys are limited to specific contracts/methods — perfect for dApp sessions without wallet popups.',
                severity: 'medium' as const,
              },
              {
                icon: Zap,
                title: 'Gas Model: Prepaid & Refunded',
                detail: 'You attach gas upfront (max 300 TGas per transaction). Unused gas is refunded as NEAR. Cross-contract calls must allocate gas for callbacks too. Start with 30 TGas for simple calls, 100+ for cross-contract.',
                severity: 'medium' as const,
              },
              {
                icon: AlertTriangle,
                title: 'Receipts, Not Atomic Transactions',
                detail: 'A NEAR transaction creates receipts. Cross-contract calls generate new receipts that execute in future blocks. This means a "transaction" may span multiple blocks — check all receipts for full status.',
                severity: 'high' as const,
              },
              {
                icon: Lightbulb,
                title: 'No Rent Anxiety',
                detail: 'Good news: your data never gets garbage collected. As long as the storage stake exists, data persists forever. No need to top up rent like on Solana. Delete data → get your NEAR back.',
                severity: 'low' as const,
              },
            ].map((item) => (
              <GlowCard key={item.title} padding="lg">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg shrink-0',
                    item.severity === 'high' ? 'bg-accent-orange/10' : item.severity === 'low' ? 'bg-near-green/10' : 'bg-accent-cyan/10',
                  )}>
                    <item.icon className={cn(
                      'w-4 h-4',
                      item.severity === 'high' ? 'text-accent-orange' : item.severity === 'low' ? 'text-near-green' : 'text-accent-cyan',
                    )} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{item.title}</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* What You Gain */}
      <ScrollReveal>
        <div>
          <SectionHeader title="What You Gain — NEAR-Specific Superpowers" badge="ADVANTAGES" />
          <div className="space-y-4">
            {[
              {
                icon: Globe,
                title: 'Chain Signatures: Sign Transactions on ANY Chain',
                description: 'A NEAR contract can sign and submit transactions on Bitcoin, Ethereum, Solana, and any other blockchain using MPC threshold signatures. Build multi-chain apps from a single NEAR contract — no bridges, no wrapped tokens.',
                link: 'https://docs.near.org/abstraction/chain-signatures',
              },
              {
                icon: Zap,
                title: 'Intents: Cross-Chain Without Bridges',
                description: 'NEAR Intents let users express what they want (swap token A for token B) without specifying how. Solvers compete to fulfill intents across chains. No bridge risk, no wrapped assets.',
                link: 'https://docs.near.org/abstraction/intents',
              },
              {
                icon: Code2,
                title: 'JavaScript SDK: Prototype Fast, Optimize Later',
                description: 'Write smart contracts in JavaScript/TypeScript using near-sdk-js. Perfect for rapid prototyping, hackathons, or when your team knows JS better than Rust. Contracts compile to WebAssembly and run on mainnet.',
                link: 'https://docs.near.org/sdk/js/introduction',
              },
              {
                icon: Users,
                title: 'Human-Readable Accounts for Better UX',
                description: 'alice.near is easier to remember than 7Fy8dQZ1RPfcLCEjEYSAmNhAn4FmZMPuKNMPuKNMG... Sub-accounts (dao.myapp.near, token.myapp.near) create intuitive organizational structures.',
                link: 'https://docs.near.org/concepts/protocol/account-model',
              },
            ].map((item) => (
              <Card key={item.title} variant="glass" padding="lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-near-green/10 shrink-0">
                    <item.icon className="w-5 h-5 text-near-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-text-primary">{item.title}</h4>
                    <p className="text-sm text-text-muted mt-1 leading-relaxed">{item.description}</p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-near-green hover:underline mt-2"
                    >
                      Read the docs <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Quiz */}
      <ScrollReveal>
        <SectionHeader title="Test Your NEAR Knowledge" badge="5 QUESTIONS" />
        <KnowledgeQuiz />
      </ScrollReveal>

      {/* Resources & Next Steps */}
      <ScrollReveal>
        <div>
          <SectionHeader title="Resources & Next Steps" badge="KEEP GOING" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: BookOpen,
                title: 'Builder Track',
                description: 'Full Rust smart contract curriculum on NEAR',
                href: '/learn/builder',
                internal: true,
              },
              {
                icon: Code2,
                title: 'Rust Curriculum',
                description: 'From zero Rust to deployed contracts',
                href: '/learn/rust-curriculum',
                internal: true,
              },
              {
                icon: Terminal,
                title: 'NEAR Documentation',
                description: 'Official docs, tutorials, and API references',
                href: 'https://docs.near.org',
                internal: false,
              },
              {
                icon: Globe,
                title: 'NEAR Examples',
                description: 'GitHub repository of example contracts',
                href: 'https://github.com/near-examples',
                internal: false,
              },
              {
                icon: Users,
                title: 'NEAR Discord',
                description: 'Join the developer community',
                href: 'https://near.chat',
                internal: false,
              },
              {
                icon: Zap,
                title: 'Sanctum (AI Build Assistant)',
                description: 'Get personalized build plans for the NEAR ecosystem',
                href: '/voids',
                internal: true,
              },
            ].map((item) => (
              item.internal ? (
                <Link key={item.title} href={item.href} className="block group">
                  <GlowCard className="h-full p-4 flex items-start gap-3 transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="p-2 rounded-lg bg-near-green/10 shrink-0">
                      <item.icon className="w-4 h-4 text-near-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary group-hover:text-near-green transition-colors">{item.title}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-near-green group-hover:translate-x-1 transition-all shrink-0" />
                  </GlowCard>
                </Link>
              ) : (
                <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="block group">
                  <GlowCard className="h-full p-4 flex items-start gap-3 transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="p-2 rounded-lg bg-near-green/10 shrink-0">
                      <item.icon className="w-4 h-4 text-near-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary group-hover:text-near-green transition-colors">{item.title}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-near-green transition-all shrink-0" />
                  </GlowCard>
                </a>
              )
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Bottom CTA */}
      <ScrollReveal>
        <Card variant="glass" padding="lg">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">Welcome to the NEAR Ecosystem</h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Your Rust skills are your superpower. NEAR just gives them new capabilities —
              chain abstraction, named accounts, and cross-chain everything.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/learn/builder">
                <Button variant="primary" size="lg">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Start the Builder Track
                </Button>
              </Link>
              <Link href="/learn/solana-vs-near">
                <Button variant="outline" size="lg">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Read Full Comparison
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
