'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';
import {
  BookOpen, Clock, CheckCircle2, ChevronDown,
  BarChart3, Activity, Search, Database,
  Eye, Telescope, Globe, TrendingUp,
  AlertTriangle, Wallet, ArrowUpDown,
} from 'lucide-react';

// ─── Data Tool Explorer ────────────────────────────────────────────────────────

function DataToolExplorer() {
  const [activeTool, setActiveTool] = useState(0);

  const tools = [
    {
      icon: Telescope,
      title: 'Voidspace Observatory',
      emoji: '🔭',
      tagline: 'Ecosystem intelligence, beautifully visualized.',
      description: 'Voidspace Observatory is your command center for NEAR ecosystem intelligence. Track project metrics, monitor protocol health, analyze trends, and discover emerging opportunities — all in one unified interface. Built for explorers who want signal, not noise.',
      nearProject: 'voidspace.io/observatory',
      howItWorks: [
        'Browse ecosystem categories: DeFi, NFTs, DAOs, Infrastructure',
        'View project health scores, TVL trends, and user growth metrics',
        'Track token price movements and trading volume',
        'Monitor protocol upgrades and ecosystem announcements',
        'Set alerts for significant changes in projects you follow',
      ],
      tip: 'Use Observatory\'s comparison view to evaluate similar protocols side by side before making decisions.',
    },
    {
      icon: Search,
      title: 'NearBlocks',
      emoji: '🔍',
      tagline: 'The block explorer for NEAR Protocol.',
      description: 'NearBlocks is the primary block explorer for NEAR — the equivalent of Etherscan for Ethereum. It provides real-time access to blocks, transactions, accounts, tokens, and smart contracts. Every on-chain action is searchable and verifiable. Essential for due diligence and transaction tracking.',
      nearProject: 'nearblocks.io',
      howItWorks: [
        'Search any account, transaction hash, or block number',
        'View account balances, transaction history, and token holdings',
        'Inspect smart contract code and method calls',
        'Browse token transfers, NFT activity, and FT analytics',
        'Check validator status, staking info, and network statistics',
      ],
      tip: 'Bookmark NearBlocks and use it to verify every contract before interacting. Check the "Contract" tab for verified source code.',
    },
    {
      icon: BarChart3,
      title: 'Pikespeak',
      emoji: '📊',
      tagline: 'Advanced analytics and API for NEAR data.',
      description: 'Pikespeak provides deep analytics for the NEAR ecosystem — account analytics, DeFi metrics, NFT market data, and developer APIs. It\'s the go-to tool for researchers, analysts, and builders who need structured, queryable data about NEAR Protocol activity.',
      nearProject: 'pikespeak.ai',
      howItWorks: [
        'Analyze account activity: transaction frequency, gas usage, interactions',
        'Track DeFi metrics: TVL by protocol, swap volumes, lending rates',
        'Monitor NFT market trends: floor prices, sales volume, top collections',
        'Use the API to build custom dashboards and alerts',
        'Compare protocol performance over custom time ranges',
      ],
      tip: 'Pikespeak\'s API is invaluable for building custom analytics tools. Check their developer docs for available endpoints.',
    },
    {
      icon: Globe,
      title: 'NEAR Explorer Tools',
      emoji: '🌐',
      tagline: 'The broader toolkit for on-chain intelligence.',
      description: 'Beyond the main tools, the NEAR ecosystem offers specialized data resources: NEAR Atlas for geographic validator distribution, Flipside for SQL-queryable on-chain data, and DappRadar for dApp rankings. Each tool serves a different analytical need — combine them for a complete picture.',
      nearProject: 'Multiple Platforms',
      howItWorks: [
        'Flipside Crypto: Write SQL queries against NEAR on-chain data for free',
        'DappRadar: Compare NEAR dApps by users, transactions, and volume',
        'NEAR Atlas: Visualize validator distribution and network decentralization',
        'DefiLlama: Track NEAR DeFi TVL across all protocols',
        'Stats Gallery: Historical account and transaction analytics',
      ],
      tip: 'DefiLlama (defillama.com/chain/Near) is the gold standard for comparing DeFi TVL across chains and protocols.',
    },
  ];

  const tool = tools[activeTool];
  const Icon = tool.icon;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tools.map((t, i) => (
          <button
            key={t.title}
            onClick={() => setActiveTool(i)}
            className={cn(
              'p-3 rounded-lg border text-center transition-all',
              activeTool === i
                ? 'bg-near-green/10 border-near-green/30'
                : 'bg-surface border-border hover:border-border-hover'
            )}
          >
            <div className="text-xl mb-1">{t.emoji}</div>
            <div className={cn('text-xs font-medium', activeTool === i ? 'text-near-green' : 'text-text-muted')}>
              {t.title}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 text-near-green" />
              <h3 className="text-xl font-bold text-text-primary">{tool.title}</h3>
            </div>
            <p className="text-near-green text-sm font-medium mb-3">{tool.tagline}</p>
            <p className="text-text-secondary leading-relaxed mb-4">{tool.description}</p>

            <div className="p-3 rounded-lg bg-surface border border-border mb-4">
              <div className="text-xs text-text-muted mb-1">Find it at →</div>
              <div className="text-sm text-near-green font-bold">{tool.nearProject}</div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">What You Can Do</h4>
              <div className="space-y-2">
                {tool.howItWorks.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <span className="text-near-green font-mono text-xs font-bold mt-0.5">{i + 1}</span>
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-near-green/5 border border-near-green/15">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-3.5 h-3.5 text-near-green" />
                <span className="text-xs font-bold text-near-green">Pro Tip</span>
              </div>
              <p className="text-xs text-text-secondary">{tool.tip}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Interactive: Track a Whale Wallet ─────────────────────────────────────────

function WhaleTracker() {
  const [activeWhale, setActiveWhale] = useState(0);

  const whales = [
    {
      address: 'aurora.pool.near',
      label: 'Aurora Staking Pool',
      balance: '~55M NEAR',
      activity: 'Validator pool — processes thousands of staking/unstaking transactions daily. One of the largest pools on NEAR.',
      signals: [
        'Large unstaking events may signal validator concerns',
        'Growing stake indicates network confidence',
        'Commission changes affect delegator rewards',
      ],
    },
    {
      address: 'ref-finance.near',
      label: 'Ref Finance DEX',
      balance: 'Multi-token',
      activity: 'The main DEX on NEAR. Holds liquidity pools for hundreds of trading pairs. TVL fluctuations reflect DeFi sentiment.',
      signals: [
        'TVL drops may indicate capital flight or market fear',
        'New pool creation signals emerging projects',
        'Large swap events can indicate whale trading activity',
      ],
    },
    {
      address: 'v2.ref-finance.near',
      label: 'Ref Finance v2',
      balance: 'Multi-token',
      activity: 'The upgraded Ref Finance contract with concentrated liquidity. Major protocol upgrade from v1.',
      signals: [
        'Migration volume shows ecosystem upgrade adoption',
        'New concentrated liquidity positions signal sophisticated LPs',
        'Cross-contract calls reveal DeFi composability patterns',
      ],
    },
  ];

  const whale = whales[activeWhale];

  return (
    <Card variant="default" padding="lg" className="border-near-green/20">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-near-green" />
        <h3 className="font-bold text-text-primary">🐋 Track a Whale Wallet</h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        Whale watching — monitor large accounts to understand ecosystem flows and sentiment.
      </p>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {whales.map((w, i) => (
          <button
            key={w.address}
            onClick={() => setActiveWhale(i)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
              activeWhale === i
                ? 'bg-near-green/10 text-near-green border border-near-green/30'
                : 'bg-surface text-text-muted border border-border hover:border-border-hover'
            )}
          >
            {w.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeWhale}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <div className="p-4 rounded-lg bg-surface border border-border mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted">Account</span>
              <span className="font-mono text-sm text-near-green">{whale.address}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-text-muted">Balance</span>
              <span className="text-sm text-text-primary font-bold">{whale.balance}</span>
            </div>
            <p className="text-xs text-text-secondary mb-3">{whale.activity}</p>

            <h4 className="text-xs font-semibold text-text-primary mb-2">📡 What to Watch For</h4>
            <div className="space-y-1">
              {whale.signals.map((signal, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="text-near-green mt-0.5">→</span>
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="p-3 rounded-lg bg-near-green/5 border border-near-green/15">
        <p className="text-xs text-near-green">
          💡 Try it yourself: Visit <span className="font-mono">nearblocks.io/address/{whale.address}</span> to
          see live transaction activity. Look at the "Transactions" tab to see what&apos;s happening in real time.
        </p>
      </div>
    </Card>
  );
}

// ─── Data Analysis Tips ────────────────────────────────────────────────────────

function DataAnalysisTips() {
  const tips = [
    {
      icon: TrendingUp,
      title: 'Track TVL Trends',
      desc: 'Total Value Locked is the best single metric for DeFi health. Rising TVL = growing confidence. Falling TVL = capital leaving. Compare across protocols and chains.',
      category: 'DeFi',
    },
    {
      icon: ArrowUpDown,
      title: 'Monitor Active Addresses',
      desc: 'Daily active accounts show real usage, not speculation. Growing active addresses signal organic adoption. Check NearBlocks network stats.',
      category: 'Network',
    },
    {
      icon: Wallet,
      title: 'Follow Smart Money',
      desc: 'Track what large wallets are doing — if whales are accumulating a token, it may signal confidence. If they\'re selling, consider why.',
      category: 'Strategy',
    },
    {
      icon: Database,
      title: 'Cross-Reference Sources',
      desc: 'Never rely on a single data source. Cross-reference NearBlocks with Pikespeak and DefiLlama. Discrepancies can reveal important nuances.',
      category: 'Method',
    },
  ];

  return (
    <Card variant="default" padding="lg" className="border-near-green/20">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-near-green" />
        <h3 className="font-bold text-text-primary">📈 Data Analysis Tips</h3>
      </div>
      <div className="space-y-3">
        {tips.map((tip) => {
          const TipIcon = tip.icon;
          return (
            <div key={tip.title} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border">
              <TipIcon className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-text-primary text-sm">{tip.title}</h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-near-green/10 text-near-green font-bold">
                    {tip.category}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">{tip.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Data Tools Glossary ───────────────────────────────────────────────────────

function DataToolsGlossary() {
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);

  const terms = [
    { term: 'TVL', full: 'Total Value Locked', definition: 'The total amount of assets deposited in a DeFi protocol or chain. The primary metric for measuring DeFi adoption and trust.' },
    { term: 'TPS', full: 'Transactions Per Second', definition: 'The number of transactions the network processes per second. NEAR can handle 100,000+ TPS across shards.' },
    { term: 'DAU', full: 'Daily Active Users', definition: 'The number of unique accounts that made at least one transaction in a 24-hour period. Key metric for real usage.' },
    { term: 'Gas', full: 'Gas Usage', definition: 'Computational cost of transactions. On NEAR, gas is measured in TGas (teragas). Tracking gas usage reveals network demand.' },
    { term: 'Whale', full: 'Whale Account', definition: 'An account holding a very large amount of tokens. Whale movements can significantly impact markets and protocol TVL.' },
    { term: 'On-chain', full: 'On-chain Data', definition: 'Data recorded directly on the blockchain — verifiable, immutable, and publicly accessible. The foundation of blockchain analytics.' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {terms.map((t, i) => (
        <GlowCard key={t.term} padding="md" onClick={() => setExpandedTerm(expandedTerm === i ? null : i)}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-near-green font-mono font-bold text-sm">{t.term}</span>
              <span className="text-xs text-text-muted">— {t.full}</span>
            </div>
            <motion.div animate={{ rotate: expandedTerm === i ? 180 : 0 }}>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </motion.div>
          </div>
          <AnimatePresence>
            {expandedTerm === i && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-xs text-text-secondary mt-2 pt-2 border-t border-border overflow-hidden"
              >
                {t.definition}
              </motion.p>
            )}
          </AnimatePresence>
        </GlowCard>
      ))}
    </div>
  );
}

// ─── Mark Complete ─────────────────────────────────────────────────────────────

function MarkComplete({ moduleSlug }: { moduleSlug: string }) {
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      return !!progress[moduleSlug];
    } catch { return false; }
  });

  const handleComplete = () => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      progress[moduleSlug] = true;
      localStorage.setItem('voidspace-explorer-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch { /* noop */ }
  };

  return (
    <div className="flex justify-center">
      <Button
        variant={completed ? 'secondary' : 'primary'}
        size="lg"
        onClick={handleComplete}
        leftIcon={completed ? <CheckCircle2 className="w-5 h-5" /> : undefined}
        className={completed ? 'border-near-green/30 text-near-green' : ''}
      >
        {completed ? 'Module Completed ✓' : 'Mark as Complete'}
      </Button>
    </div>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

export function NearDataTools() {
  return (
    <Container size="md">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 16 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            13 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            NEAR Data Tools
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            <span className="text-near-green font-medium">On-chain intelligence</span> — explore, analyze,
            and understand the NEAR ecosystem with powerful data tools.
          </p>
        </div>
      </ScrollReveal>

      {/* Why Data Matters */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-near-green/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-near-green" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Why On-Chain Data Matters</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            Blockchain data is <span className="text-near-green font-medium">open, transparent, and immutable</span>.
            Unlike traditional finance where data is locked behind institutions, every transaction on NEAR
            is publicly verifiable. Learning to read this data gives you an edge — you can verify claims,
            spot trends early, and make informed decisions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { emoji: '🔍', title: 'Verify', desc: 'Check any claim against real on-chain data' },
              { emoji: '📈', title: 'Analyze', desc: 'Spot trends before they become mainstream' },
              { emoji: '🎯', title: 'Decide', desc: 'Make informed decisions based on evidence' },
            ].map((item) => (
              <div key={item.title} className="p-3 rounded-lg bg-surface border border-border text-center">
                <div className="text-xl mb-1">{item.emoji}</div>
                <h4 className="font-bold text-text-primary text-sm">{item.title}</h4>
                <p className="text-[10px] text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Data Tool Explorer */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">🛠️ Essential Data Tools</h3>
          <p className="text-sm text-text-muted mb-6">Click each tool to learn what it offers and how to use it.</p>
          <DataToolExplorer />
        </div>
      </ScrollReveal>

      {/* Whale Tracker */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <WhaleTracker />
        </div>
      </ScrollReveal>

      {/* Analysis Tips */}
      <ScrollReveal delay={0.23}>
        <div className="mb-12">
          <DataAnalysisTips />
        </div>
      </ScrollReveal>

      {/* Glossary */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📖 Data Tools Glossary</h3>
          <DataToolsGlossary />
        </div>
      </ScrollReveal>

      {/* Key Takeaways */}
      <ScrollReveal delay={0.3}>
        <Card variant="glass" padding="lg" className="mb-12 border-near-green/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-near-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {[
              'Blockchain data is open and verifiable — use it to make informed decisions.',
              'Voidspace Observatory provides curated ecosystem intelligence in one interface.',
              'NearBlocks is essential for verifying transactions, accounts, and contracts.',
              'Pikespeak offers advanced analytics and APIs for deep research.',
              'DefiLlama is the gold standard for cross-chain DeFi TVL comparison.',
              'Track whale wallets and TVL trends to understand ecosystem sentiment and capital flows.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-near-green mt-0.5 font-bold">→</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.35}>
        <MarkComplete moduleSlug="near-data-tools" />
      </ScrollReveal>
    </Container>
  );
}
