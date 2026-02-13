'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronDown, ArrowRight, CheckCircle2, Zap, Layers,
  Users, Code2, DollarSign, Clock, Shield, Network, Globe,
  HelpCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import { cn } from '@/lib/utils';

/* ─── Comparison Categories ────────────────────────────────── */

interface ComparisonCategory {
  id: string;
  title: string;
  icon: typeof Layers;
  solana: { label: string; detail: string };
  near: { label: string; detail: string };
  verdict: string;
}

const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    id: 'architecture',
    title: 'Architecture',
    icon: Layers,
    solana: {
      label: 'Monolithic, Proof of History + Proof of Stake',
      detail: 'Solana uses a single-chain architecture with Proof of History (PoH) as a clock mechanism combined with Tower BFT consensus. All validators process all transactions, achieving high throughput through parallel transaction execution via Sealevel.',
    },
    near: {
      label: 'Sharded (Nightshade), Proof of Stake',
      detail: 'NEAR uses Nightshade sharding where the network is split into multiple shards that process transactions in parallel. Each shard produces a fraction of the next block (a "chunk"). This allows NEAR to scale horizontally — more shards = more capacity.',
    },
    verdict: 'Different approaches to scalability: Solana optimizes a single powerful chain; NEAR scales horizontally through sharding.',
  },
  {
    id: 'accounts',
    title: 'Account Model',
    icon: Users,
    solana: {
      label: 'Public key addresses (base58)',
      detail: 'Solana accounts are identified by 32-byte public keys encoded in base58 (e.g., 7Fy8dQZ1RPfcLCEj...). Programs (smart contracts) are also accounts. Data is stored in separate accounts that programs own.',
    },
    near: {
      label: 'Human-readable named accounts',
      detail: 'NEAR accounts use human-readable names like alice.near or app.alice.near (sub-accounts). Each account can hold multiple access keys with different permissions — full access or function-call-only keys for specific contracts.',
    },
    verdict: 'NEAR\'s named accounts are more user-friendly. Solana\'s model is simpler but less intuitive for end users.',
  },
  {
    id: 'language',
    title: 'Smart Contract Language',
    icon: Code2,
    solana: {
      label: 'Rust with Anchor framework',
      detail: 'Solana programs are written in Rust using the Anchor framework (most common) or native solana-program crate. Anchor provides macros for account validation, serialization, and error handling, similar to NEAR\'s #[near] macro.',
    },
    near: {
      label: 'Rust (near-sdk-rs) + JavaScript SDK',
      detail: 'NEAR smart contracts can be written in Rust using near-sdk-rs, or in JavaScript/TypeScript using near-sdk-js. The Rust SDK uses #[near] macros for state management. The JS SDK option lowers the barrier to entry significantly.',
    },
    verdict: 'Both use Rust. NEAR also offers a JavaScript SDK for prototyping and simpler contracts — unique among major L1s.',
  },
  {
    id: 'costs',
    title: 'Transaction Costs',
    icon: DollarSign,
    solana: {
      label: '~$0.00025 per transaction',
      detail: 'Solana transactions cost approximately 5,000 lamports (0.000005 SOL) as a base fee, plus priority fees during congestion. At current prices (~$50 SOL), that\'s roughly $0.00025. During high congestion, priority fees can increase costs.',
    },
    near: {
      label: '~$0.001 per transaction',
      detail: 'NEAR transaction costs are approximately 0.0001 NEAR (~$0.001 at ~$5 NEAR). A unique feature: 30% of transaction fees go to the contract being called, incentivizing developers to build popular contracts. Gas is burned, keeping NEAR deflationary under high usage.',
    },
    verdict: 'Solana is cheaper per transaction. NEAR\'s developer royalty (30% to contracts) is a unique incentive model.',
  },
  {
    id: 'finality',
    title: 'Finality',
    icon: Clock,
    solana: {
      label: '~400ms slot time, ~13s finality',
      detail: 'Solana produces blocks every ~400ms. However, true finality (optimistic confirmation) takes about 6-13 seconds as validators must vote and reach supermajority consensus. The 400ms number is block production, not finality.',
    },
    near: {
      label: '~1.4 second finality',
      detail: 'NEAR achieves final, irreversible finality in approximately 1.4 seconds (as measured by near-one/finality-bench). Once a block is final on NEAR, it cannot be reversed — no probabilistic confirmation needed.',
    },
    verdict: 'Solana has faster block production (~400ms). NEAR has faster guaranteed finality (~1.4s vs ~13s for Solana\'s true finality).',
  },
  {
    id: 'state',
    title: 'State Management',
    icon: Shield,
    solana: {
      label: 'Accounts model with rent',
      detail: 'Solana stores data in accounts that programs own. Accounts must maintain a minimum balance (rent exemption) — currently ~0.00089 SOL per byte per epoch, or ~6.96 SOL for 1MB. Accounts below rent-exempt balance are garbage collected.',
    },
    near: {
      label: 'Key-value storage with storage staking',
      detail: 'NEAR contracts store data in a key-value trie. Storage costs 0.01 NEAR per KB, but this is staked — when data is deleted, the NEAR is refunded. Your data is never at risk of being garbage collected. Storage is prepaid and permanent.',
    },
    verdict: 'NEAR\'s storage staking model is safer — no risk of data loss from insufficient rent. Solana\'s rent can be recovered but requires careful management.',
  },
  {
    id: 'crosschain',
    title: 'Cross-Chain Capabilities',
    icon: Globe,
    solana: {
      label: 'Wormhole, bridge-dependent',
      detail: 'Solana relies primarily on third-party bridges like Wormhole for cross-chain communication. These bridges use their own validator sets and trust assumptions. Solana doesn\'t have native cross-chain capabilities at the protocol level.',
    },
    near: {
      label: 'Chain Signatures + Intents (native)',
      detail: 'NEAR has protocol-level cross-chain capabilities: Chain Signatures allow NEAR accounts to sign transactions on any chain (Bitcoin, Ethereum, Solana, etc.) using MPC threshold signatures. Intents enable cross-chain operations without traditional bridges.',
    },
    verdict: 'NEAR has a significant advantage with native cross-chain capabilities. Chain Signatures are a protocol-level innovation, not a third-party bridge.',
  },
  {
    id: 'tooling',
    title: 'Developer Tooling',
    icon: Network,
    solana: {
      label: 'Anchor CLI, Solana CLI, Playground',
      detail: 'Solana offers the Anchor framework (most popular), Solana CLI for deployment and management, Solana Playground (browser IDE), and extensive RPC infrastructure. The ecosystem has mature tooling backed by significant VC funding.',
    },
    near: {
      label: 'NEAR CLI, cargo-near, DevHub',
      detail: 'NEAR provides near-cli-rs (Rust CLI), cargo-near for contract building, NEAR DevHub for community resources, and near-workspaces for testing. The NEAR JavaScript API (near-api-js) is well-documented and widely used for frontend integration.',
    },
    verdict: 'Both have solid tooling. Solana\'s ecosystem is larger due to more VC-backed projects. NEAR\'s tooling is developer-friendly with better documentation.',
  },
];

/* ─── Quiz Data ────────────────────────────────────────────── */

interface QuizQuestion {
  question: string;
  options: { label: string; near: number; solana: number }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'What matters most to you?',
    options: [
      { label: 'Best developer experience & ease of use', near: 3, solana: 1 },
      { label: 'Maximum throughput & DeFi ecosystem', near: 1, solana: 3 },
      { label: 'Cross-chain capabilities & future-proofing', near: 3, solana: 1 },
      { label: 'Largest existing user base', near: 1, solana: 2 },
    ],
  },
  {
    question: 'What\'s your background?',
    options: [
      { label: 'New to blockchain, know some JavaScript', near: 3, solana: 1 },
      { label: 'Experienced Rust developer', near: 2, solana: 2 },
      { label: 'Solidity/EVM developer switching to Rust', near: 2, solana: 2 },
      { label: 'Building AI agents or automation', near: 3, solana: 1 },
    ],
  },
  {
    question: 'What are you building?',
    options: [
      { label: 'Consumer-facing dApp with great UX', near: 3, solana: 1 },
      { label: 'High-frequency DeFi protocol', near: 1, solana: 3 },
      { label: 'Multi-chain application', near: 3, solana: 1 },
      { label: 'NFT marketplace or gaming', near: 2, solana: 2 },
    ],
  },
];

/* ─── Comparison Card Component ────────────────────────────── */

function ComparisonCard({ category }: { category: ComparisonCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <GlowCard
      className="cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-near-green/10 shrink-0">
              <category.icon className="w-5 h-5 text-near-green" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">{category.title}</h3>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-text-muted" />
          </motion.div>
        </div>

        {/* Compact view */}
        {!isExpanded && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="text-xs">
              <span className="text-purple-400 font-mono font-semibold">Solana: </span>
              <span className="text-text-muted">{category.solana.label}</span>
            </div>
            <div className="text-xs">
              <span className="text-near-green font-mono font-semibold">NEAR: </span>
              <span className="text-text-muted">{category.near.label}</span>
            </div>
          </div>
        )}

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">Solana</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{category.solana.detail}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-near-green/5 border border-near-green/20">
                    <h4 className="text-sm font-semibold text-near-green mb-2">NEAR Protocol</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{category.near.detail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-surface-hover">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary">
                    <strong className="text-text-primary">Verdict:</strong> {category.verdict}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlowCard>
  );
}

/* ─── Architecture Diagram ─────────────────────────────────── */

function ArchitectureDiagram() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Solana - Monolithic */}
      <Card variant="glass" padding="lg" className="border border-purple-500/20">
        <h4 className="text-sm font-semibold text-purple-400 mb-4 text-center">Solana — Monolithic</h4>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="text-xs font-mono text-purple-400">All Validators</span>
          </div>
          <div className="text-text-muted text-xs">↓ process ↓</div>
          <div className="w-full p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="text-xs font-mono text-purple-400">ALL Transactions (parallel via Sealevel)</span>
          </div>
          <div className="text-text-muted text-xs">↓ into ↓</div>
          <div className="w-full p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="text-xs font-mono text-purple-400">Single Chain (PoH + Tower BFT)</span>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-3 text-center">High throughput from optimized single chain</p>
      </Card>

      {/* NEAR - Sharded */}
      <Card variant="glass" padding="lg" className="border border-near-green/20">
        <h4 className="text-sm font-semibold text-near-green mb-4 text-center">NEAR — Sharded (Nightshade)</h4>
        <div className="flex flex-col items-center gap-2">
          <div className="grid grid-cols-3 gap-2 w-full">
            {['Shard 0', 'Shard 1', 'Shard 2'].map((shard) => (
              <div key={shard} className="p-2 rounded-lg bg-near-green/10 border border-near-green/20 text-center">
                <span className="text-[10px] font-mono text-near-green">{shard}</span>
              </div>
            ))}
          </div>
          <div className="text-text-muted text-xs">↓ produce chunks ↓</div>
          <div className="w-full p-3 rounded-lg bg-near-green/10 border border-near-green/20 text-center">
            <span className="text-xs font-mono text-near-green">Combined Block (Nightshade)</span>
          </div>
          <div className="text-text-muted text-xs">↓ finalized by ↓</div>
          <div className="w-full p-3 rounded-lg bg-near-green/10 border border-near-green/20 text-center">
            <span className="text-xs font-mono text-near-green">Validator Set (Doomslug + BFT)</span>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-3 text-center">Scales horizontally — add shards for more capacity</p>
      </Card>
    </div>
  );
}

/* ─── Quiz Component ───────────────────────────────────────── */

function PriorityQuiz() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
    if (newAnswers.filter((a) => a !== undefined).length === QUIZ_QUESTIONS.length) {
      setShowResult(true);
    }
  };

  const getResult = () => {
    let nearScore = 0;
    let solanaScore = 0;
    answers.forEach((optionIndex, questionIndex) => {
      if (optionIndex !== undefined) {
        const option = QUIZ_QUESTIONS[questionIndex].options[optionIndex];
        nearScore += option.near;
        solanaScore += option.solana;
      }
    });
    return { nearScore, solanaScore };
  };

  const { nearScore, solanaScore } = getResult();

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-accent-cyan" />
        <h3 className="text-lg font-semibold text-text-primary">Find Your Best Fit</h3>
      </div>
      <p className="text-sm text-text-muted mb-6">Answer 3 quick questions to get a personalized recommendation.</p>

      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, qi) => (
          <div key={qi}>
            <h4 className="text-sm font-medium text-text-primary mb-3">
              {qi + 1}. {q.question}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => handleAnswer(qi, oi)}
                  className={cn(
                    'p-3 rounded-lg border text-left text-sm transition-all duration-200',
                    answers[qi] === oi
                      ? 'bg-near-green/10 border-near-green/50 text-text-primary'
                      : 'bg-surface border-border hover:border-border-hover text-text-secondary hover:text-text-primary'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={cn(
                  'p-4 rounded-lg text-center border',
                  nearScore > solanaScore
                    ? 'bg-near-green/10 border-near-green/30'
                    : 'bg-surface border-border'
                )}>
                  <div className="text-2xl font-bold text-near-green">{nearScore}</div>
                  <div className="text-sm text-text-muted">NEAR Score</div>
                </div>
                <div className={cn(
                  'p-4 rounded-lg text-center border',
                  solanaScore > nearScore
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-surface border-border'
                )}>
                  <div className="text-2xl font-bold text-purple-400">{solanaScore}</div>
                  <div className="text-sm text-text-muted">Solana Score</div>
                </div>
              </div>
              <p className="text-sm text-text-secondary text-center">
                {nearScore > solanaScore
                  ? 'Based on your priorities, NEAR Protocol seems like a great fit! Its developer experience, cross-chain capabilities, and flexible SDK options align well with what you\'re looking for.'
                  : nearScore === solanaScore
                    ? 'It\'s a tie! Both chains have strengths for your use case. Consider trying both — your Rust skills transfer directly. Start with NEAR\'s easier onboarding, then explore Solana\'s DeFi ecosystem.'
                    : 'Based on your priorities, Solana\'s high throughput and DeFi ecosystem might be a good starting point. That said, your Rust skills transfer directly to NEAR — and NEAR\'s cross-chain features mean you can reach Solana users too.'}
              </p>
              <div className="flex justify-center mt-4">
                <Link href={nearScore >= solanaScore ? '/learn/builder' : '/learn/for-solana-developers'}>
                  <Button variant="primary" size="sm">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Start Building
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function SolanaVsNear() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-xs font-mono text-near-green">
            <Zap className="w-3 h-3" /> HONEST COMPARISON
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
            Solana vs NEAR:{' '}
            <GradientText>An Honest Developer&apos;s Guide</GradientText>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            A fair, technical comparison by builders who respect both ecosystems.
            No shilling — just facts to help you make the right choice for your project.
          </p>
          <div className="flex justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-400">
              Solana
            </span>
            <span className="text-text-muted text-sm">vs</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-xs font-mono text-near-green">
              NEAR Protocol
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Architecture Diagrams */}
      <ScrollReveal>
        <SectionHeader title="Architecture at a Glance" badge="VISUAL" />
        <ArchitectureDiagram />
      </ScrollReveal>

      {/* Side-by-Side Comparisons */}
      <div>
        <SectionHeader title="Side-by-Side Comparison" badge="8 CATEGORIES" />
        <p className="text-sm text-text-muted mb-6">
          Click any category to expand full details. All numbers are from public documentation and verifiable sources.
        </p>
        <div className="space-y-3">
          {COMPARISON_CATEGORIES.map((category, i) => (
            <ScrollReveal key={category.id} delay={i * 0.05}>
              <ComparisonCard category={category} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* For Solana Developers */}
      <ScrollReveal>
        <div>
          <SectionHeader title="I'm a Solana Developer — Why Look at NEAR?" badge="FOR SOLANA DEVS" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Globe,
                title: 'Chain Abstraction',
                description: 'Build once on NEAR, reach users on every chain — including Solana. Chain Signatures let a NEAR contract sign transactions on Bitcoin, Ethereum, Solana, and more.',
              },
              {
                icon: Users,
                title: 'Named Accounts',
                description: 'alice.near is easier to share than 7Fy8dQZ1RPfcLCEj... Your users will thank you. Sub-accounts (app.alice.near) enable powerful organizational patterns.',
              },
              {
                icon: Shield,
                title: 'Storage Staking (No Rent Anxiety)',
                description: 'NEAR\'s storage is staked, not rented. Your data stays forever as long as the stake exists — and you get the NEAR back when you delete data. No garbage collection risk.',
              },
              {
                icon: Code2,
                title: 'JavaScript SDK Option',
                description: 'Prototype in JavaScript, optimize in Rust later. NEAR is the only major L1 that lets you write smart contracts in JS — great for rapid iteration and hiring.',
              },
              {
                icon: Zap,
                title: 'NEAR AI Focus',
                description: 'NEAR is positioning as "the blockchain for AI" with Shade Agents and native AI integration. If you\'re building AI agents or AI-powered dApps, NEAR has first-mover tooling.',
              },
              {
                icon: DollarSign,
                title: 'Developer Royalties',
                description: '30% of transaction fees go to the contract being called. Popular contracts earn revenue just by being used — a unique incentive model in the blockchain space.',
              },
            ].map((item) => (
              <GlowCard key={item.title} padding="lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-near-green/10 shrink-0">
                    <item.icon className="w-4 h-4 text-near-green" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{item.title}</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* For NEAR Developers */}
      <ScrollReveal>
        <div>
          <SectionHeader title="I'm a NEAR Developer — What Can I Learn from Solana?" badge="FAIR PLAY" />
          <Card variant="glass" padding="lg">
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">
                Being honest about competitors builds trust. Here&apos;s what Solana does well:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'DeFi Ecosystem Maturity',
                    detail: 'Solana has one of the largest DeFi ecosystems by active users and TVL. Projects like Jupiter, Raydium, and Marinade have battle-tested DeFi primitives that the broader ecosystem can learn from.',
                  },
                  {
                    title: 'Performance Culture',
                    detail: 'Solana\'s focus on raw performance has pushed the entire industry forward. Their work on parallel transaction execution (Sealevel) and network optimization offers patterns worth studying.',
                  },
                  {
                    title: 'Community Energy',
                    detail: 'Solana\'s developer community is large, active, and builds in public. Hackathons like Colosseum have produced successful projects. This community-driven momentum benefits everyone in Web3.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-3 rounded-lg bg-surface-hover">
                    <h4 className="text-sm font-medium text-purple-400">{item.title}</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </ScrollReveal>

      {/* Priority Quiz */}
      <ScrollReveal>
        <SectionHeader title="Find Your Best Fit" badge="INTERACTIVE" />
        <PriorityQuiz />
      </ScrollReveal>

      {/* Migration CTA */}
      <ScrollReveal>
        <Card variant="glass" padding="lg">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">Ready to Try NEAR?</h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Your Rust skills transfer directly. Our migration guide shows Solana developers
              how every concept maps to NEAR — and you can deploy your first contract in 10 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/learn/for-solana-developers">
                <Button variant="primary" size="lg">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Solana → NEAR Migration Guide
                </Button>
              </Link>
              <Link href="/learn/rust-for-blockchain">
                <Button variant="secondary" size="lg">
                  <Code2 className="w-4 h-4 mr-2" />
                  Chain-Agnostic Rust Modules
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
