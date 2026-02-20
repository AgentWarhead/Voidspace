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
  Image, Palette, Store, Tag,
  Shield, Sparkles, ExternalLink,
  Layers, DollarSign, FileCode,
} from 'lucide-react';

// ─── NFT Concept Explorer ─────────────────────────────────────────────────────

function NFTConceptExplorer() {
  const [activeConcept, setActiveConcept] = useState(0);

  const concepts = [
    {
      icon: Image,
      title: 'What are NFTs?',
      emoji: '🎨',
      tagline: 'Unique digital assets on the blockchain.',
      description: 'NFTs (Non-Fungible Tokens) are unique digital assets stored on a blockchain. Unlike NEAR tokens where each one is identical, every NFT is one-of-a-kind. They can represent art, music, game items, domain names, event tickets, and more. Ownership is provable, transferable, and permanent.',
      nearProject: 'NEP-171 Standard',
      howItWorks: [
        'An artist or creator mints (creates) an NFT on a smart contract',
        'The NFT gets a unique token ID and metadata (name, description, image URL)',
        'Ownership is recorded on the NEAR blockchain — publicly verifiable',
        'The NFT can be transferred, sold, or listed on marketplaces',
        'Royalties can be enforced so creators earn on every resale',
      ],
      risk: 'NFT value is subjective. Art NFTs can lose value quickly. Only buy what you genuinely appreciate.',
    },
    {
      icon: Store,
      title: 'Mintbase',
      emoji: '🏪',
      tagline: 'The leading NFT infrastructure on NEAR.',
      description: 'Mintbase is a powerful NFT platform on NEAR that lets anyone create, sell, and manage NFTs. It provides smart contract deployment with zero coding, supports music, art, tickets, and memberships. Mintbase uses NEAR\'s low gas fees to make minting accessible — often costing less than $0.01 per mint.',
      nearProject: 'mintbase.xyz',
      howItWorks: [
        'Connect your NEAR wallet to Mintbase',
        'Deploy your own NFT smart contract (store) — no coding needed',
        'Upload your artwork/media and fill in metadata',
        'Set the price, supply, and royalty percentage',
        'List on the Mintbase marketplace for anyone to buy',
      ],
      risk: 'Deploying a store costs a small NEAR deposit for storage. Research marketplace fees before listing.',
    },
    {
      icon: Palette,
      title: 'Paras',
      emoji: '🖼️',
      tagline: 'Digital art cards and collectibles on NEAR.',
      description: 'Paras is a digital art marketplace on NEAR focused on collectible cards and series. Artists can create card collections with multiple editions, and collectors can trade them. Paras emphasizes community curation and has been home to many iconic NEAR NFT collections since 2021.',
      nearProject: 'paras.id',
      howItWorks: [
        'Browse collections or search for specific artists on Paras',
        'Connect your NEAR wallet to buy, bid, or make offers',
        'Creators apply to get verified and mint card series',
        'Each card can have multiple editions (e.g., 1/50)',
        'Trade cards on the secondary market — royalties go to creators',
      ],
      risk: 'Edition sizes affect rarity and value. Lower editions are generally more valuable but less liquid.',
    },
    {
      icon: FileCode,
      title: 'Minting & Royalties',
      emoji: '⚙️',
      tagline: 'How NFTs are created and how creators earn.',
      description: 'Minting is the process of creating an NFT on the blockchain. On NEAR, minting costs are extremely low thanks to the protocol\'s efficient storage model. The NEP-199 standard enables perpetual royalties — creators automatically receive a percentage (typically 5-10%) every time their NFT is resold on any compatible marketplace.',
      nearProject: 'NEP-199 Payouts',
      howItWorks: [
        'Creator prepares artwork and metadata (name, description, attributes)',
        'Metadata and media are stored on Arweave or IPFS for permanence',
        'The mint function is called on the NFT smart contract',
        'A unique token ID is assigned and ownership recorded on-chain',
        'Royalty splits are embedded in the token — enforced on every sale',
      ],
      risk: 'Metadata stored off-chain (IPFS/Arweave) can become unavailable if not pinned properly. Look for permanent storage.',
    },
  ];

  const concept = concepts[activeConcept];
  const Icon = concept.icon;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {concepts.map((c, i) => (
          <button
            key={c.title}
            onClick={() => setActiveConcept(i)}
            className={cn(
              'p-3 rounded-lg border text-center transition-all',
              activeConcept === i
                ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 border-emerald-500/30'
                : 'bg-surface border-border hover:border-border-hover'
            )}
          >
            <div className="text-xl mb-1">{c.emoji}</div>
            <div className={cn('text-xs font-medium', activeConcept === i ? 'text-near-green' : 'text-text-muted')}>
              {c.title}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeConcept}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 text-near-green" />
              <h3 className="text-xl font-bold text-text-primary">{concept.title}</h3>
            </div>
            <p className="text-near-green text-sm font-medium mb-3">{concept.tagline}</p>
            <p className="text-text-secondary leading-relaxed mb-4">{concept.description}</p>

            <div className="p-3 rounded-lg bg-surface border border-border mb-4">
              <div className="text-xs text-text-muted mb-1">On NEAR →</div>
              <div className="text-sm text-near-green font-bold">{concept.nearProject}</div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">How It Works</h4>
              <div className="space-y-2">
                {concept.howItWorks.map((step, i) => (
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

            <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/15">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">Note</span>
              </div>
              <p className="text-xs text-text-secondary">{concept.risk}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Notable NEAR NFT Collections ──────────────────────────────────────────────

function NotableCollections() {
  const collections = [
    { name: 'Antisocial Ape Club', desc: '3,333 unique apes — one of the first major PFP collections on NEAR. Active community and DAO governance.', marketplace: 'Paras' },
    { name: 'NEARNauts', desc: 'Space-themed generative art collection. Early NEAR ecosystem staple with on-chain metadata.', marketplace: 'Paras' },
    { name: 'Mr. Brown', desc: 'Iconic pixel art character. One of the most recognizable brands in the NEAR NFT ecosystem.', marketplace: 'Mintbase' },
    { name: 'Secret Skellies Society', desc: '3,333 skeleton PFPs with utility, staking rewards, and an engaged community.', marketplace: 'Paras' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {collections.map((c) => (
        <GlowCard key={c.name} padding="md">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-near-green" />
            <h4 className="font-bold text-text-primary text-sm">{c.name}</h4>
          </div>
          <p className="text-xs text-text-secondary mb-2">{c.desc}</p>
          <div className="flex items-center gap-1 text-[10px] text-text-muted">
            <Store className="w-3 h-3" />
            <span>Available on {c.marketplace}</span>
          </div>
        </GlowCard>
      ))}
    </div>
  );
}

// ─── Interactive: Browse NFT Contract ──────────────────────────────────────────

function BrowseNFTContract() {
  const [expanded, setExpanded] = useState(false);

  const contractData = {
    contractId: 'x.paras.near',
    standard: 'NEP-171',
    totalSupply: '500,000+',
    methods: [
      { name: 'nft_token', desc: 'Get metadata for a specific token by ID' },
      { name: 'nft_tokens_for_owner', desc: 'List all NFTs owned by an account' },
      { name: 'nft_transfer', desc: 'Transfer an NFT to another account' },
      { name: 'nft_metadata', desc: 'Get the collection name, symbol, and base URI' },
    ],
  };

  return (
    <Card variant="default" padding="lg" className="border-near-green/20">
      <div className="flex items-center gap-2 mb-4">
        <ExternalLink className="w-5 h-5 text-near-green" />
        <h3 className="font-bold text-text-primary">🔍 Explore an NFT Contract</h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        Every NFT collection on NEAR is a smart contract. Let&apos;s look at what a real NFT contract exposes:
      </p>

      <div className="p-3 rounded-lg bg-surface border border-border mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">Contract</span>
          <span className="font-mono text-sm text-near-green">{contractData.contractId}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">Standard</span>
          <span className="text-sm text-text-primary">{contractData.standard}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Total Minted</span>
          <span className="text-sm text-text-primary">{contractData.totalSupply}</span>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-near-green hover:text-near-green/80 transition-colors mb-3"
      >
        <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        {expanded ? 'Hide' : 'Show'} Contract Methods
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {contractData.methods.map((m) => (
              <div key={m.name} className="p-3 rounded-lg bg-surface border border-border">
                <div className="font-mono text-sm text-near-green">{m.name}</div>
                <p className="text-xs text-text-muted mt-1">{m.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 p-3 rounded-lg bg-near-green/5 border border-near-green/15">
        <p className="text-xs text-near-green">
          💡 Try it yourself: Visit <span className="font-mono">nearblocks.io/address/x.paras.near</span> to see this contract live. Look at recent transactions to see mints, transfers, and sales happening in real time.
        </p>
      </div>
    </Card>
  );
}

// ─── NFT Glossary ──────────────────────────────────────────────────────────────

function NFTGlossary() {
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);

  const terms = [
    { term: 'NEP-171', full: 'NFT Core Standard', definition: 'The NEAR standard for NFTs. Defines how tokens are minted, transferred, and queried. Equivalent to ERC-721 on Ethereum.' },
    { term: 'NEP-199', full: 'Royalty Payouts', definition: 'Standard for perpetual creator royalties on NEAR. Ensures creators earn a percentage on every resale.' },
    { term: 'Mint', full: 'Minting', definition: 'The process of creating a new NFT on the blockchain. The creator pays a small gas + storage fee.' },
    { term: 'Metadata', full: 'Token Metadata', definition: 'The descriptive data attached to an NFT — name, description, image URL, attributes, and traits.' },
    { term: 'PFP', full: 'Profile Picture', definition: 'A category of NFTs designed to be used as social media avatars. Usually generative art with random traits.' },
    { term: 'Floor Price', full: 'Floor Price', definition: 'The lowest listed price for any NFT in a collection. A key metric for collection valuation.' },
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

export function NFTBasicsOnNear() {
  return (
    <Container size="md">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 12 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            14 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            NFT Basics on NEAR
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            <span className="text-near-green font-medium">Non-Fungible Tokens</span> — unique digital assets
            that prove ownership, enable creators, and power a new economy.
          </p>
        </div>
      </ScrollReveal>

      {/* What are NFTs */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
              <Image className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">What are NFTs?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            An NFT is a <span className="text-near-green font-medium">Non-Fungible Token</span> —
            a unique digital certificate of ownership stored on the blockchain. While one NEAR token
            is identical to another (fungible), each NFT is distinct. Think of it like the difference
            between a dollar bill and the Mona Lisa.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { emoji: '🎨', title: 'Unique', desc: 'Every NFT has a unique ID and metadata' },
              { emoji: '✅', title: 'Provable', desc: 'Ownership is verified on the blockchain' },
              { emoji: '💰', title: 'Tradeable', desc: 'Buy, sell, and transfer freely on marketplaces' },
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

      {/* Why NEAR for NFTs */}
      <ScrollReveal delay={0.12}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Why NEAR for NFTs?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            Minting an NFT on Ethereum can cost $20-100+ in gas fees. On NEAR, it costs less than a penny.
            NEAR&apos;s human-readable accounts (<span className="font-mono text-near-green">alice.near</span>)
            make the experience friendlier, and the NEP-171 standard ensures interoperability across the ecosystem.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Mint Cost', value: '<$0.01' },
              { label: 'Transfer Fee', value: '~$0.001' },
              { label: 'Finality', value: '~1s' },
              { label: 'Storage', value: 'On-chain' },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-lg bg-surface border border-border text-center">
                <div className="text-near-green font-bold text-lg">{stat.value}</div>
                <div className="text-[10px] text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Core Concepts */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">💡 NFT Ecosystem on NEAR</h3>
          <p className="text-sm text-text-muted mb-6">Click each topic to explore how NFTs work on NEAR.</p>
          <NFTConceptExplorer />
        </div>
      </ScrollReveal>

      {/* Notable Collections */}
      <ScrollReveal delay={0.18}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">🏆 Notable NEAR NFT Collections</h3>
          <NotableCollections />
        </div>
      </ScrollReveal>

      {/* Glossary */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📖 NFT Glossary</h3>
          <NFTGlossary />
        </div>
      </ScrollReveal>

      {/* Interactive: Browse Contract */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <BrowseNFTContract />
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
              'NFTs are unique digital assets with provable ownership on the blockchain.',
              'NEAR uses the NEP-171 standard for NFTs — interoperable and gas-efficient.',
              'Mintbase and Paras are the two major NFT marketplaces on NEAR.',
              'Minting on NEAR costs less than $0.01 — massively cheaper than Ethereum.',
              'NEP-199 enables perpetual royalties so creators earn on every resale.',
              'Always check metadata storage (IPFS/Arweave) and verify contracts on NearBlocks.',
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
        <MarkComplete moduleSlug="nft-basics-on-near" />
      </ScrollReveal>
    </Container>
  );
}
