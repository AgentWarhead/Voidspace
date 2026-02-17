'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { cn } from '@/lib/utils';
import {
  BookOpen, Clock, CheckCircle2, Lightbulb,
  Coins, Image, Users, Gamepad2, Brain, Wrench,
  TrendingUp, MapPin,
} from 'lucide-react';

// ─── Ecosystem Category Explorer ───────────────────────────────────────────────

interface Project {
  name: string;
  description: string;
  highlight: string;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  icon: React.ElementType;
  color: string;
  description: string;
  projects: Project[];
  opportunity: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'defi',
    label: 'DeFi',
    emoji: '💰',
    icon: Coins,
    color: 'text-near-green',
    description: 'Decentralized finance — trading, lending, staking without banks.',
    projects: [
      { name: 'Ref Finance', description: 'The main DEX on NEAR. Swap tokens, provide liquidity, farm yields.', highlight: '$100M+ TVL' },
      { name: 'Burrow', description: 'Lend and borrow crypto. Earn interest or leverage your positions.', highlight: 'Cross-collateral' },
      { name: 'Meta Pool', description: 'Liquid staking for NEAR. Stake and stay liquid with stNEAR.', highlight: '8%+ APY' },
      { name: 'Orderly Network', description: 'Orderbook-based trading infrastructure. Powers multiple DEXs.', highlight: 'CEX-like speed' },
    ],
    opportunity: 'DeFi on NEAR is still early. Massive opportunity for new protocols, yield strategies, and cross-chain integrations.',
  },
  {
    id: 'nfts',
    label: 'NFTs',
    emoji: '🎨',
    icon: Image,
    color: 'text-purple-400',
    description: 'Digital art, collectibles, and ownership — cheap to mint, easy to trade.',
    projects: [
      { name: 'Mintbase', description: 'NFT creation platform with AI tools. Mint for fractions of a penny.', highlight: 'AI-powered' },
      { name: 'Paras', description: 'Digital art marketplace focused on curated collections.', highlight: 'Curated art' },
      { name: 'Few and Far', description: 'NFT marketplace with social features and creator tools.', highlight: 'Social NFTs' },
    ],
    opportunity: 'NFTs on NEAR are incredibly cheap to mint (~$0.01). Perfect for gaming items, event tickets, and real-world asset tokenization.',
  },
  {
    id: 'daos',
    label: 'DAOs',
    emoji: '🏛️',
    icon: Users,
    color: 'text-accent-cyan',
    description: 'Decentralized governance — communities making decisions together on-chain.',
    projects: [
      { name: 'AstroDAO', description: 'DAO creation and management platform. Governance, treasury, voting.', highlight: '1000+ DAOs' },
      { name: 'NDC (NEAR Digital Collective)', description: 'NEAR\'s own community governance. Vote on protocol decisions.', highlight: 'Protocol governance' },
      { name: 'SputnikDAO', description: 'Flexible DAO framework. Custom policies and multi-sig support.', highlight: 'Flexible rules' },
    ],
    opportunity: 'DAOs are the future of organizations. Build tools, join a DAO, or create one for your own community.',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    emoji: '🎮',
    icon: Gamepad2,
    color: 'text-orange-400',
    description: 'Blockchain gaming — own your in-game assets, trade them freely.',
    projects: [
      { name: 'PlayEmber', description: 'Gaming infrastructure for NEAR. SDKs and tools for game developers.', highlight: 'Dev tools' },
      { name: 'Armored Kingdom', description: 'Strategy trading card game with NFT cards and competitive play.', highlight: 'TCG gaming' },
      { name: 'Secretum', description: 'Encrypted messaging and gaming platform on NEAR.', highlight: 'Encrypted play' },
    ],
    opportunity: 'Gaming is the killer app for blockchain. NEAR\'s low fees and fast finality make it ideal for real-time games.',
  },
  {
    id: 'ai',
    label: 'AI',
    emoji: '🤖',
    icon: Brain,
    color: 'text-pink-400',
    description: 'AI agents, data ownership, and the intersection of AI and blockchain.',
    projects: [
      { name: 'NEAR AI', description: 'NEAR\'s official AI initiative. Building infrastructure for AI agents on-chain.', highlight: 'Official' },
      { name: 'Bitte', description: 'AI agent marketplace. Create and deploy AI agents that operate on NEAR.', highlight: 'Agent marketplace' },
      { name: 'Ringfence', description: 'Data privacy and ownership. Control how your data is used by AI.', highlight: 'Data sovereignty' },
    ],
    opportunity: 'AI + blockchain is the frontier. NEAR is uniquely positioned with its co-founder\'s AI background (Transformer paper co-author).',
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    emoji: '🔧',
    icon: Wrench,
    color: 'text-yellow-400',
    description: 'The building blocks — tools, SDKs, indexers, and services for developers.',
    projects: [
      { name: 'Pagoda', description: 'Development platform for NEAR. APIs, RPC, and developer tools.', highlight: 'Dev platform' },
      { name: 'NEAR DA', description: 'Data availability layer for Ethereum rollups. Store data cheaply on NEAR.', highlight: 'L2 infra' },
      { name: 'Pikespeak', description: 'Analytics and data APIs for NEAR. Query blockchain data easily.', highlight: 'Analytics' },
      { name: 'Fastnear', description: 'Fast RPC and real-time indexing infrastructure.', highlight: 'Fast RPCs' },
    ],
    opportunity: 'Infrastructure never sleeps. Build tools that other developers need and get rewarded through grants and usage fees.',
  },
];

function EcosystemExplorer() {
  const [activeCategory, setActiveCategory] = useState(0);
  const cat = CATEGORIES[activeCategory];
  const Icon = cat.icon;

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(i)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              activeCategory === i
                ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-surface text-text-muted border border-border hover:border-border-hover'
            )}
          >
            <span>{c.emoji}</span>
            <span className="hidden sm:inline">{c.label}</span>
          </button>
        ))}
      </div>

      {/* Category detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 shadow-lg shadow-emerald-500/10 backdrop-blur-sm')}>
                <Icon className={cn('w-5 h-5', cat.color)} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">{cat.emoji} {cat.label}</h3>
                <p className="text-sm text-text-muted">{cat.description}</p>
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-3 mb-6">
              {cat.projects.map((project, i) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border"
                >
                  <span className={cn('text-xs font-mono font-bold mt-0.5', cat.color)}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-text-primary text-sm">{project.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-hover text-text-muted border border-border">
                        {project.highlight}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Opportunity callout */}
            <div className="p-3 rounded-lg bg-near-green/5 border border-near-green/15">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-near-green" />
                <span className="text-xs font-bold text-near-green uppercase tracking-wider">Opportunity</span>
              </div>
              <p className="text-sm text-text-secondary">{cat.opportunity}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Ecosystem Stats ───────────────────────────────────────────────────────────

function EcosystemStats() {
  const stats = [
    { label: 'Total Value Locked', value: '$200M+', emoji: '💰' },
    { label: 'Active Projects', value: '800+', emoji: '🚀' },
    { label: 'Monthly Transactions', value: '180M+', emoji: '⚡' },
    { label: 'Grants Distributed', value: '$50M+', emoji: '🎁' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="text-center p-4 rounded-xl bg-surface border border-border"
        >
          <div className="text-2xl mb-2">{stat.emoji}</div>
          <div className="text-xl font-bold text-near-green mb-1">{stat.value}</div>
          <div className="text-xs text-text-muted">{stat.label}</div>
        </motion.div>
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

export function NearEcosystemTour() {
  return (
    <Container size="md">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 7 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            12 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            NEAR Ecosystem Tour
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            From DeFi to AI agents — discover the thriving universe of projects built on NEAR
            and find <span className="text-near-green font-medium">where the opportunities are</span>.
          </p>
        </div>
      </ScrollReveal>

      {/* Ecosystem Stats */}
      <ScrollReveal delay={0.1}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📊 The NEAR Ecosystem at a Glance</h3>
          <EcosystemStats />
        </div>
      </ScrollReveal>

      {/* Why NEAR Ecosystem Matters */}
      <ScrollReveal delay={0.15}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Why Explore the Ecosystem?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            Understanding the ecosystem isn&apos;t just academic — it&apos;s how you find
            <span className="text-near-green font-medium"> opportunities</span>. Every project
            you discover is a potential place to earn, contribute, build, or invest.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { emoji: '💼', title: 'Career', desc: 'Projects are hiring developers, designers, marketers' },
              { emoji: '💰', title: 'Earning', desc: 'DeFi yields, grants, bounties, and staking rewards' },
              { emoji: '🏗️', title: 'Building', desc: 'Gaps in the ecosystem = opportunities to build' },
            ].map((item) => (
              <div key={item.title} className="p-3 rounded-lg bg-surface border border-border text-center">
                <div className="text-xl mb-1">{item.emoji}</div>
                <h4 className="font-bold text-text-primary text-sm mb-1">{item.title}</h4>
                <p className="text-[10px] text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Category Explorer */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">🗺️ Explore by Category</h3>
          <p className="text-sm text-text-muted mb-6">Click each category to see the top projects and opportunities.</p>
          <EcosystemExplorer />
        </div>
      </ScrollReveal>

      {/* Key Takeaways */}
      <ScrollReveal delay={0.25}>
        <Card variant="glass" padding="lg" className="mb-12 border-near-green/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-near-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {[
              'NEAR\'s ecosystem spans DeFi, NFTs, DAOs, gaming, AI, and infrastructure.',
              'DeFi: Ref Finance, Burrow, Meta Pool — trade, lend, and stake.',
              'NFTs: Mintbase, Paras — create and trade digital assets for fractions of a penny.',
              'AI: NEAR is positioning as the blockchain for AI agents (Bitte, NEAR AI).',
              'The ecosystem is still early — massive opportunity for builders and users.',
              'Over $50M in grants have been distributed to support new projects.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-near-green mt-0.5 font-bold">→</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>

      {/* Pro Tips */}
      <ScrollReveal delay={0.3}>
        <Card variant="glass" padding="lg" className="mb-12 border-purple-500/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Pro Tips for Exploring the Ecosystem
          </h3>
          <div className="space-y-4">
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-semibold text-text-primary text-sm mb-2">🔍 How to Evaluate a Project</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Before aping into any protocol, check these fundamentals: Is the contract code open-source and audited?
                How much TVL (Total Value Locked) does it hold? Is the team doxxed or anonymous? What does the token
                distribution look like? Check NEAR Explorer for on-chain activity — real usage beats marketing hype every time.
              </p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-semibold text-text-primary text-sm mb-2">🌐 Stay Connected</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Join the NEAR Discord and Telegram groups for real-time ecosystem updates. Follow @NEARProtocol on X
                for announcements. The NEAR Forum (gov.near.org) is where governance proposals and grant applications
                are discussed. AwesomeNEAR.com maintains a curated directory of every project in the ecosystem —
                bookmark it as your go-to reference for discovering new protocols and tools.
              </p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-semibold text-text-primary text-sm mb-2">💡 Start Small, Build Up</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Don&apos;t try to learn the entire ecosystem at once. Pick one category that excites you — DeFi, NFTs,
                or DAOs — and go deep. Use testnet faucets to experiment without risking real funds. Most NEAR dApps
                have testnet versions specifically for learning. Once you&apos;re comfortable with one vertical,
                branch out. The cross-protocol composability on NEAR means skills transfer naturally between categories.
              </p>
            </div>
          </div>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.35}>
        <MarkComplete moduleSlug="near-ecosystem-tour" />
      </ScrollReveal>
    </Container>
  );
}
