'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Code2, Shield, Zap, ArrowRight, ChevronDown, CheckCircle2,
  AlertTriangle, Lock, Layers, TestTube, Gauge, Network,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import { cn } from '@/lib/utils';

/* ─── Chain Data ───────────────────────────────────────────── */

type ChainName = 'NEAR' | 'Solana' | 'Cosmos' | 'Polkadot';

const CHAIN_COLORS: Record<ChainName, string> = {
  NEAR: 'bg-near-green/20 text-near-green border-near-green/30',
  Solana: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Cosmos: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Polkadot: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

/* ─── Module Data ──────────────────────────────────────────── */

interface RustModule {
  id: number;
  title: string;
  icon: typeof Code2;
  chains: ChainName[];
  summary: string;
  content: string;
  codeExample: string;
  nearTip?: string;
}

const MODULES: RustModule[] = [
  {
    id: 1,
    title: 'Ownership & Borrowing for Smart Contracts',
    icon: Lock,
    chains: ['NEAR', 'Solana', 'Cosmos', 'Polkadot'],
    summary: 'Rust\'s ownership model prevents entire classes of bugs that plague smart contracts in other languages.',
    content: 'Rust\'s ownership and borrowing system ensures memory safety at compile time without a garbage collector. In smart contracts, this prevents use-after-free bugs, double-spending vulnerabilities, and dangling references that have caused millions in losses on EVM chains. Every major Rust blockchain — NEAR, Solana, Cosmos SDK, and Substrate (Polkadot) — benefits from these compile-time guarantees.',
    codeExample: `// Ownership prevents double-spend at compile time
fn transfer(mut balance: TokenBalance, amount: u128) -> TokenBalance {
    balance.debit(amount);  // balance is moved here
    // balance.debit(amount); // ❌ Won't compile — already moved!
    balance
}`,
    nearTip: 'NEAR\'s near-sdk-rs leverages ownership to manage contract state safely — the #[near] macro generates code that handles serialization/deserialization of owned state automatically.',
  },
  {
    id: 2,
    title: 'Error Handling in Blockchain Contexts',
    icon: AlertTriangle,
    chains: ['NEAR', 'Solana', 'Cosmos', 'Polkadot'],
    summary: 'Result types and pattern matching make contract failures explicit and recoverable.',
    content: 'Rust\'s Result<T, E> type forces developers to handle every possible error path. In smart contracts, unhandled errors can lock funds permanently. Rust makes it impossible to ignore errors — the compiler requires you to explicitly handle success and failure cases. This is critical for financial applications where silent failures are unacceptable.',
    codeExample: `// Explicit error handling — no silent failures
pub fn withdraw(&mut self, amount: u128) -> Result<(), ContractError> {
    let balance = self.balances.get(&sender)
        .ok_or(ContractError::AccountNotFound)?;
    if balance < amount {
        return Err(ContractError::InsufficientFunds);
    }
    // Safe to proceed
    Ok(())
}`,
    nearTip: 'NEAR contracts can use #[handle_result] attribute to return Result types directly from public methods, giving callers structured error information instead of generic panics.',
  },
  {
    id: 3,
    title: 'Serialization: Borsh vs JSON vs MessagePack',
    icon: Layers,
    chains: ['NEAR', 'Solana', 'Cosmos'],
    summary: 'Choosing the right serialization format impacts gas costs, interoperability, and developer experience.',
    content: 'Different blockchains favor different serialization formats. Borsh (Binary Object Representation Serializer for Hashing) was created by the NEAR team and is now used across multiple chains including Solana. It\'s deterministic, fast, and compact. JSON is human-readable but larger. Borsh typically produces payloads 2-4x smaller than JSON, directly reducing transaction costs.',
    codeExample: `// Borsh — compact binary, used by NEAR and Solana
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
}
// JSON equivalent would be ~2-4x larger on-chain`,
    nearTip: 'Fun fact: Borsh was originally created by NEAR Protocol engineers. NEAR contracts use Borsh for state storage and support JSON for client-facing function arguments — best of both worlds.',
  },
  {
    id: 4,
    title: 'Testing Smart Contracts',
    icon: TestTube,
    chains: ['NEAR', 'Solana', 'Cosmos', 'Polkadot'],
    summary: 'Rust\'s built-in test framework plus chain-specific testing tools catch bugs before deployment.',
    content: 'Rust\'s cargo test infrastructure works for smart contracts too. Unit tests run instantly without a blockchain. Integration tests simulate on-chain behavior. Each chain provides its own testing SDK: NEAR has near-workspaces (sandbox testing), Solana has bankrun and solana-program-test, Cosmos has cw-multi-test, and Substrate has sp-io test externalities.',
    codeExample: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_transfer_insufficient_funds() {
        let mut contract = Contract::new();
        contract.deposit("alice.near", 100);
        let result = contract.transfer("alice.near", "bob.near", 200);
        assert!(result.is_err()); // Must fail gracefully
    }
}`,
    nearTip: 'NEAR\'s near-workspaces crate lets you spin up a local sandbox blockchain in tests — deploy contracts, create accounts, and simulate real transactions all from cargo test.',
  },
  {
    id: 5,
    title: 'Gas & Compute Optimization',
    icon: Gauge,
    chains: ['NEAR', 'Solana', 'Cosmos', 'Polkadot'],
    summary: 'Every instruction costs gas. Rust gives you the control to minimize waste.',
    content: 'Smart contract execution costs gas on every chain. Rust gives developers fine-grained control over memory allocation, data structures, and computation patterns. Using iterators instead of collecting into vectors, choosing appropriate data structures (LookupMap vs UnorderedMap), and minimizing storage reads/writes all reduce costs. These optimization patterns transfer across every Rust blockchain.',
    codeExample: `// ❌ Expensive: reads all entries into memory
let total: u128 = self.balances.iter()
    .collect::<Vec<_>>()  // Unnecessary allocation!
    .iter()
    .map(|(_, v)| v)
    .sum();

// ✅ Optimized: streams without allocation
let total: u128 = self.balances.iter()
    .map(|(_, v)| v)
    .sum();`,
    nearTip: 'NEAR charges separately for compute (TGas) and storage (0.01 NEAR per KB). Use LookupMap instead of UnorderedMap when you don\'t need iteration — it skips index maintenance and saves gas.',
  },
  {
    id: 6,
    title: 'Security Patterns',
    icon: Shield,
    chains: ['NEAR', 'Solana', 'Cosmos', 'Polkadot'],
    summary: 'Prevent reentrancy, overflow, and access control bugs with Rust-native patterns.',
    content: 'Common smart contract vulnerabilities include reentrancy attacks, integer overflow/underflow, and missing access control checks. Rust eliminates overflow by default (panics in debug, wraps in release — use checked_add for safety). Reentrancy protection uses Rust\'s ownership to prevent state from being accessed during external calls. Access control patterns use enums and match statements for exhaustive permission checking.',
    codeExample: `// Checked arithmetic — no silent overflow
let new_balance = balance
    .checked_add(deposit)
    .expect("Balance overflow");

// Access control with exhaustive matching
match caller_role {
    Role::Admin => { /* full access */ },
    Role::Operator => { /* limited ops */ },
    Role::User => { /* read + own writes */ },
    // No default case — compiler ensures all variants handled
}`,
    nearTip: 'NEAR\'s predecessor account pattern (env::predecessor_account_id()) provides reliable caller authentication. Combine with access key permissions for fine-grained control.',
  },
  {
    id: 7,
    title: 'Cross-Contract Communication',
    icon: Network,
    chains: ['NEAR', 'Solana', 'Cosmos'],
    summary: 'Composability between contracts is how DeFi and complex dApps are built.',
    content: 'Blockchain applications compose by having contracts call other contracts. The patterns differ significantly: Solana uses Cross-Program Invocations (CPI) which are synchronous within a transaction. NEAR uses asynchronous cross-contract calls via Promises. Cosmos uses IBC for cross-chain messages. Understanding these patterns is essential for building composable DeFi protocols and multi-contract systems.',
    codeExample: `// NEAR: Async cross-contract call with callback
#[near]
impl Contract {
    pub fn swap_tokens(&mut self, amount: U128) -> Promise {
        // Call the DEX contract
        ext_dex::ext(self.dex_account.clone())
            .with_attached_deposit(NearToken::from_yoctonear(amount.0))
            .swap(self.token_in.clone(), self.token_out.clone())
            .then(
                Self::ext(env::current_account_id())
                    .on_swap_complete() // Handle result async
            )
    }
}`,
    nearTip: 'NEAR\'s async cross-contract calls are unique — they execute across blocks, enabling patterns impossible on synchronous chains. Use .then() callbacks to handle results safely.',
  },
];

/* ─── Chain Comparison Data ────────────────────────────────── */

interface ChainComparison {
  chain: string;
  accounts: string;
  contracts: string;
  finality: string;
  txCost: string;
  unique: string;
  color: string;
}

const CHAIN_COMPARISONS: ChainComparison[] = [
  {
    chain: 'NEAR Protocol',
    accounts: 'Human-readable (alice.near)',
    contracts: 'Rust (near-sdk) + JavaScript SDK',
    finality: '~1.4 seconds',
    txCost: '~$0.001',
    unique: 'Chain Abstraction, named accounts, JS SDK option, sub-accounts',
    color: 'border-near-green/50 bg-near-green/5',
  },
  {
    chain: 'Solana',
    accounts: 'Public key addresses (base58)',
    contracts: 'Rust (Anchor framework)',
    finality: '~400ms',
    txCost: '~$0.00025',
    unique: 'Raw throughput (~65k TPS theoretical), large DeFi/NFT ecosystem',
    color: 'border-purple-500/50 bg-purple-500/5',
  },
  {
    chain: 'Cosmos (CosmWasm)',
    accounts: 'Bech32 addresses',
    contracts: 'Rust (cosmwasm-std)',
    finality: '~6 seconds',
    txCost: 'Varies by chain',
    unique: 'Sovereign app-chains, IBC cross-chain protocol',
    color: 'border-blue-500/50 bg-blue-500/5',
  },
  {
    chain: 'Polkadot (Substrate)',
    accounts: 'SS58 addresses',
    contracts: 'Rust (ink!) + runtime pallets',
    finality: '~12-60 seconds',
    txCost: 'Varies by parachain',
    unique: 'Shared security via relay chain, custom blockchain logic',
    color: 'border-pink-500/50 bg-pink-500/5',
  },
];

/* ─── Chain Badge Component ────────────────────────────────── */

function ChainBadge({ chain }: { chain: ChainName }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border',
      CHAIN_COLORS[chain],
    )}>
      ✓ {chain}
    </span>
  );
}

/* ─── Module Card Component ────────────────────────────────── */

function ModuleCard({ module }: { module: RustModule }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <GlowCard
      className="cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-near-green/10 shrink-0">
              <module.icon className="w-5 h-5 text-near-green" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-text-muted">Module {module.id}</span>
              </div>
              <h3 className="text-base font-semibold text-text-primary">{module.title}</h3>
              <p className="text-sm text-text-muted mt-1">{module.summary}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {module.chains.map((chain) => (
                  <ChainBadge key={chain} chain={chain} />
                ))}
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 mt-1"
          >
            <ChevronDown className="w-5 h-5 text-text-muted" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <p className="text-sm text-text-secondary leading-relaxed">{module.content}</p>
                <div className="rounded-lg bg-[#0d1117] border border-border p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-text-secondary leading-relaxed">
                    <code>{module.codeExample}</code>
                  </pre>
                </div>
                {module.nearTip && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-near-green/5 border border-near-green/20">
                    <CheckCircle2 className="w-4 h-4 text-near-green shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary">
                      <strong className="text-near-green">NEAR Tip:</strong> {module.nearTip}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlowCard>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function RustForBlockchain() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-xs font-mono text-near-green">
            <Code2 className="w-3 h-3" /> CHAIN-AGNOSTIC RUST CURRICULUM
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
            Rust: The Language of{' '}
            <GradientText>Secure Blockchains</GradientText>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            NEAR, Solana, Cosmos, and Polkadot all chose Rust for its memory safety, performance,
            and zero-cost abstractions. Learn the patterns that work across every chain.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {(['NEAR', 'Solana', 'Cosmos', 'Polkadot'] as ChainName[]).map((chain) => (
              <ChainBadge key={chain} chain={chain} />
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Rust Blockchains', value: '4 Major', sublabel: 'NEAR, Solana, Cosmos, Polkadot' },
            { label: 'Combined TVL', value: '$12B+', sublabel: 'Total value locked across Rust chains' },
            { label: 'Developer Demand', value: '#1 Loved', sublabel: 'Stack Overflow Survey 8 years running' },
            { label: 'Modules', value: '7', sublabel: 'Chain-agnostic learning modules' },
          ].map((stat) => (
            <Card key={stat.label} variant="glass" padding="lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-near-green">{stat.value}</div>
                <div className="text-sm font-medium text-text-primary mt-1">{stat.label}</div>
                <div className="text-xs text-text-muted mt-0.5">{stat.sublabel}</div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      {/* Modules */}
      <div>
        <SectionHeader title="Chain-Agnostic Rust Modules" badge="7 MODULES" />
        <p className="text-sm text-text-muted mb-6">
          Click any module to expand and see code examples. Each skill transfers across every Rust blockchain.
        </p>
        <div className="space-y-3">
          {MODULES.map((module) => (
            <ScrollReveal key={module.id} delay={module.id * 0.05}>
              <ModuleCard module={module} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Chain Comparison */}
      <ScrollReveal>
        <div>
          <SectionHeader title="Which Chain Should You Build On?" badge="COMPARISON" />
          <p className="text-sm text-text-muted mb-6">
            An honest look at four major Rust blockchains. Each has unique strengths — choose based on what you&apos;re building.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHAIN_COMPARISONS.map((chain) => (
              <Card key={chain.chain} variant="glass" padding="lg" className={cn('border', chain.color)}>
                <h3 className="text-lg font-semibold text-text-primary mb-3">{chain.chain}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-text-muted">Accounts: </span>
                    <span className="text-text-secondary">{chain.accounts}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Smart Contracts: </span>
                    <span className="text-text-secondary">{chain.contracts}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Finality: </span>
                    <span className="text-text-secondary">{chain.finality}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Tx Cost: </span>
                    <span className="text-text-secondary">{chain.txCost}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <span className="text-text-muted">What makes it unique: </span>
                    <span className="text-text-primary font-medium">{chain.unique}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <Card variant="glass" padding="lg">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">Ready to Start Building?</h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Whether you&apos;re new to blockchain or coming from another ecosystem, our learning tracks
              take you from Rust fundamentals to deployed smart contracts.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/learn#tracks">
                <Button variant="primary" size="lg">
                  <Zap className="w-4 h-4 mr-2" />
                  Start from Zero (Explorer)
                </Button>
              </Link>
              <Link href="/learn#tracks">
                <Button variant="outline" size="lg">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  I Know Rust (Builder Track)
                </Button>
              </Link>
              <Link href="/learn/for-solana-developers">
                <Button variant="outline" size="lg">
                  <Code2 className="w-4 h-4 mr-2" />
                  Coming from Solana?
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
