'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Search,
  Rocket,
  GraduationCap,
  Sparkles,
  Eye,
  CreditCard,
  Code,
  X,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

// ─── Category Icons Map ────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Getting Started': <Rocket className="w-4 h-4" />,
  'Learning & Tracks': <GraduationCap className="w-4 h-4" />,
  'Sanctum (AI Builder)': <Sparkles className="w-4 h-4" />,
  'Intelligence Tools': <Eye className="w-4 h-4" />,
  'Pricing & Access': <CreditCard className="w-4 h-4" />,
  Technical: <Code className="w-4 h-4" />,
};

// ─── FAQ Data ──────────────────────────────────────────────────────────────────

export const FAQ_DATA: FAQCategory[] = [
  {
    category: 'Getting Started',
    items: [
      {
        question: 'What is NEAR Protocol?',
        answer: (
          <>
            NEAR is a Layer 1 blockchain built for usability — sub-second finality, human-readable accounts (like{' '}
            <code className="text-near-green bg-near-green/10 px-1 py-0.5 rounded text-xs">alice.near</code>
            ), and built-in chain abstraction that lets one account work across every blockchain. It&apos;s designed to feel like a normal web app, not a crypto experiment.
          </>
        ),
      },
      {
        question: 'What is Voidspace?',
        answer: (
          <>
            Voidspace is your all-in-one platform for learning, building, and analyzing on NEAR Protocol. It includes{' '}
            <Link href="/learn" className="text-near-green hover:underline">free learning tracks</Link>,{' '}
            an <Link href="/sanctum" className="text-near-green hover:underline">AI-powered smart contract builder</Link>,{' '}
            and a suite of <Link href="/void-lens" className="text-near-green hover:underline">free intelligence tools</Link>.
          </>
        ),
      },
      {
        question: 'Do I need coding experience to get started?',
        answer:
          'Not at all. The Explorer track gets you on-chain with zero code — wallets, ecosystem navigation, DeFi basics. The Builder and Hacker tracks assume some programming background, but the Rust Curriculum takes you from your first variable to deployed contracts. Start where you are.',
      },
    ],
  },
  {
    category: 'Learning & Tracks',
    items: [
      {
        question: 'Are the learning tracks really free?',
        answer:
          'Yes — all 4 tracks, all 66 modules, completely free. No credit card, no paywall, no "free trial" that expires. The learning is free forever. We make money from Sanctum (the AI builder), not from education.',
      },
      {
        question: 'How long does each track take?',
        answer:
          'Explorer ~6 hours, Builder ~20 hours, Hacker ~8 hours, Founder ~6 hours. All self-paced — binge it in a weekend or spread it across weeks. No deadlines, no pressure.',
      },
      {
        question: 'Do I earn certificates?',
        answer: (
          <>
            Yes. Complete any track to earn a shareable certificate. Finish all four tracks and earn <strong className="text-text-primary">Legend</strong> status.{' '}
            <Link href="/learn/certificate" className="text-near-green hover:underline">Learn about certificates →</Link>
          </>
        ),
      },
      {
        question: 'I\'m a Solana/Ethereum developer — is this relevant to me?',
        answer: (
          <>
            Absolutely. If you know Rust (Solana) or Solidity (Ethereum), your skills transfer directly. The Hacker track covers NEAR-specific patterns, and we have dedicated{' '}
            <Link href="/learn/for-solana-developers" className="text-near-green hover:underline">cross-chain guides</Link>{' '}
            comparing architectures and tooling side by side.
          </>
        ),
      },
    ],
  },
  {
    category: 'Sanctum (AI Builder)',
    items: [
      {
        question: 'What is Sanctum?',
        answer: (
          <>
            <Link href="/sanctum" className="text-near-green hover:underline">Sanctum</Link> is Voidspace&apos;s general-purpose AI vibe-coding builder, powered by <strong className="text-text-primary">Claude (Anthropic)</strong>. Describe what you want in plain English, and it generates production-ready NEAR smart contracts, web apps, code audits, visual assets, and more.
          </>
        ),
      },
      {
        question: 'What can I build with Sanctum?',
        answer: (
          <>
            Anything. Sanctum is a general-purpose AI builder powered by Claude — not limited to templates. Build smart contracts (tokens, NFTs, DAOs, DeFi protocols, any Rust/NEAR contract), web apps, full-stack dApps, code audits, visual assets, and more. Six starter templates (Token, NFT, DAO, DeFi Vault, Marketplace, AI Agent) help you get going fast, but Sanctum handles any NEAR development task you throw at it.
          </>
        ),
      },
      {
        question: 'How much does Sanctum cost?',
        answer: (
          <>
            Sanctum uses a credit-based system. The Shade tier is free with $2.50 in credits. Paid tiers: Specter ($25/mo), Legion ($60/mo), and Leviathan ($200/mo). Top-up packs are also available.{' '}
            <Link href="/pricing" className="text-near-green hover:underline">See all pricing →</Link>
          </>
        ),
      },
    ],
  },
  {
    category: 'Intelligence Tools',
    items: [
      {
        question: 'What data sources does Voidspace use?',
        answer: (
          <>
            Voidspace aggregates <strong className="text-text-primary">10+ real-time data sources</strong> to power all analysis, briefs, and intelligence tools:
            <ul className="mt-2 space-y-1 list-none">
              <li><strong className="text-cyan-400">NearBlocks</strong> — Blockchain transactions, accounts, validators &amp; block data</li>
              <li><strong className="text-cyan-400">Pikespeak</strong> — Wallet analytics, account activity &amp; NEAR network metrics</li>
              <li><strong className="text-cyan-400">FastNEAR</strong> — High-speed indexer for real-time on-chain state queries</li>
              <li><strong className="text-emerald-400">DexScreener</strong> — Live DEX prices, volume, liquidity &amp; trading pair data</li>
              <li><strong className="text-emerald-400">DefiLlama</strong> — Total Value Locked (TVL) &amp; cross-chain DeFi analytics</li>
              <li><strong className="text-emerald-400">Mintbase</strong> — NFT marketplace data, collections &amp; trading activity on NEAR</li>
              <li><strong className="text-purple-400">GitHub</strong> — Repository activity, commits &amp; contributor metrics</li>
              <li><strong className="text-purple-400">AstroDAO</strong> — DAO governance proposals, voting records &amp; treasury data</li>
              <li><strong className="text-cyan-400">NEAR RPC</strong> — Direct mainnet blockchain queries &amp; contract state reads</li>
              <li><strong className="text-teal-400">Ecosystem Registry</strong> — Curated database of 180+ NEAR projects with metadata</li>
            </ul>
            <p className="mt-2">
              All data is fetched from live APIs in real-time and cached for performance. Plus, <strong className="text-amber-400">Anthropic Claude</strong> powers our AI features including Sanctum, Void Briefs, and reputation analysis. No synthetic data — every number is verifiable on-chain.
            </p>
          </>
        ),
      },
      {
        question: 'What is Void Lens?',
        answer: (
          <>
            <Link href="/void-lens" className="text-near-green hover:underline">Void Lens</Link> is a free wallet analyzer that gives you portfolio valuation, on-chain reputation scoring, and DeFi position tracking for any NEAR account.
          </>
        ),
      },
      {
        question: 'What are Void Bubbles?',
        answer: (
          <>
            <Link href="/void-bubbles" className="text-near-green hover:underline">Void Bubbles</Link> is a free real-time visualization of NEAR token markets. Watch token activity as dynamic bubbles — great for spotting trends at a glance.
          </>
        ),
      },
      {
        question: 'What is the Constellation Map?',
        answer: (
          <>
            <Link href="/constellation" className="text-near-green hover:underline">Constellation Map</Link> is a free transaction graph explorer. Paste any NEAR account and visualize its on-chain relationships and transaction flows as an interactive network graph.
          </>
        ),
      },
    ],
  },
  {
    category: 'Pricing & Access',
    items: [
      {
        question: 'What\'s free and what\'s paid?',
        answer: (
          <>
            <strong className="text-text-primary">Free:</strong> All learning tracks, Void Lens, Void Bubbles, and Constellation Map.{' '}
            <strong className="text-text-primary">Paid:</strong>{' '}
            <Link href="/sanctum" className="text-near-green hover:underline">Sanctum</Link> (the AI builder) and{' '}
            <Link href="/opportunities" className="text-near-green hover:underline">Void Brief generation</Link> (AI-generated build plans) — both powered by Claude. Sanctum starts with a free tier so you can try before you commit.
          </>
        ),
      },
      {
        question: 'Can I try Sanctum before paying?',
        answer: (
          <>
            Yes. The Shade tier gives you $2.50 in free credits to test Sanctum with no commitment. Upgrade anytime from the{' '}
            <Link href="/pricing" className="text-near-green hover:underline">pricing page</Link>.
          </>
        ),
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        question: 'Is Rust hard to learn for smart contracts?',
        answer:
          'Rust has a steeper learning curve than JavaScript — but that strictness is exactly why it\'s the #1 language for smart contracts. The compiler catches bugs before they cost you money. Our Builder track starts from zero Rust and most developers say it "clicks" within the first few modules.',
      },
      {
        question: 'How does NEAR compare to Solana technically?',
        answer: (
          <>
            Both use Rust for smart contracts. NEAR adds human-readable accounts, built-in chain abstraction, and a sharded architecture optimized for usability. Solana optimizes for raw throughput. If you know Solana Rust, your skills transfer directly.{' '}
            <Link href="/learn/solana-vs-near" className="text-near-green hover:underline">Full comparison →</Link>
          </>
        ),
      },
      {
        question: 'What is Chain Abstraction?',
        answer:
          'Chain Abstraction is NEAR\'s biggest bet — making blockchain invisible to users. One NEAR account can sign transactions on Bitcoin, Ethereum, Solana, and any other chain. No network switching, no multi-wallet juggling, no bridges. Users just do things; the chain figures out the rest.',
      },
      {
        question: 'What are Shade Agents?',
        answer:
          'Shade Agents are autonomous AI agents that live on NEAR — they own wallets, sign transactions, and operate across chains without human intervention. Think AI that can manage funds, execute trades, and interact with any blockchain autonomously. It\'s where chain abstraction meets AI, and it\'s only possible on NEAR.',
      },
      {
        question: 'What is Nightshade Sharding?',
        answer:
          'Nightshade splits NEAR into parallel processing lanes that scale with demand — more users means more shards, not slower transactions. While other chains hit throughput ceilings, NEAR scales horizontally, like the internet itself.',
      },
      {
        question: 'What are Chain Signatures?',
        answer:
          'Chain Signatures let you sign transactions on any blockchain — Bitcoin, Ethereum, Arbitrum, and more — directly from your NEAR account. No bridges, no wrapped tokens, no separate wallets. One account, every chain.',
      },
      {
        question: 'What are Intents on NEAR?',
        answer:
          'Intents let you say what you want — "swap token A for token B" — without caring how it happens. Solvers compete to fulfill your intent across chains, finding the best route automatically. No manual bridging, no gas management, no thinking about which chain you\'re on.',
      },
      {
        question: 'What is NEAR Data Availability (DA)?',
        answer:
          'NEAR DA provides cheap, reliable data availability for rollups and Layer 2s. Ethereum L2s can use NEAR DA to dramatically reduce data costs while inheriting NEAR\'s security and performance — making rollups more economical to operate.',
      },
    ],
  },
];

// ─── Accordion Item ────────────────────────────────────────────────────────────

function FAQAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className={cn(
          'rounded-2xl overflow-hidden transition-all duration-300',
          'backdrop-blur-sm bg-surface/30 border',
          isOpen
            ? 'border-near-green/30 shadow-[0_0_20px_rgba(0,236,151,0.05)]'
            : 'border-white/5 hover:border-near-green/20'
        )}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left hover:bg-white/[0.02] transition-colors min-h-[44px]"
        >
          <span className="text-sm font-medium text-text-primary pr-4">{question}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-colors duration-300',
                isOpen ? 'text-near-green' : 'text-text-muted'
              )}
            />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-text-secondary leading-relaxed">
                {answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Category Block ────────────────────────────────────────────────────────────

function CategoryBlock({
  category,
  items,
  categoryIndex,
  openItems,
  toggleItem,
}: {
  category: string;
  items: FAQItem[];
  categoryIndex: number;
  openItems: Set<string>;
  toggleItem: (key: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="text-near-green/70">{CATEGORY_ICONS[category]}</span>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {category}
        </h3>
      </div>
      <div className="space-y-3">
        {items.map((item, ii) => {
          const key = `${categoryIndex}-${ii}`;
          return (
            <FAQAccordionItem
              key={key}
              question={item.question}
              answer={item.answer}
              isOpen={openItems.has(key)}
              onToggle={() => toggleItem(key)}
              index={ii}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── FAQ Section ───────────────────────────────────────────────────────────────

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = useCallback((key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // Build category counts
  const categoryNames = useMemo(() => FAQ_DATA.map((c) => c.category), []);
  const categoryCounts = useMemo(
    () => FAQ_DATA.reduce<Record<string, number>>((acc, c) => {
      acc[c.category] = c.items.length;
      return acc;
    }, {}),
    []
  );
  const totalCount = useMemo(() => FAQ_DATA.reduce((s, c) => s + c.items.length, 0), []);

  // Filter data
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return FAQ_DATA.map((cat, ci) => {
      if (activeCategory !== 'All' && cat.category !== activeCategory) {
        return { ...cat, items: [], originalIndex: ci };
      }
      const filtered = query
        ? cat.items.filter((item) => item.question.toLowerCase().includes(query))
        : cat.items;
      return { ...cat, items: filtered, originalIndex: ci };
    }).filter((cat) => cat.items.length > 0);
  }, [activeCategory, searchQuery]);

  const allItemKeys = useMemo(() => {
    const keys: string[] = [];
    FAQ_DATA.forEach((cat, ci) => {
      cat.items.forEach((_, ii) => {
        keys.push(`${ci}-${ii}`);
      });
    });
    return keys;
  }, []);

  const isAllExpanded = allItemKeys.length > 0 && allItemKeys.every((k) => openItems.has(k));

  const toggleAll = useCallback(() => {
    setOpenItems((prev) => {
      if (allItemKeys.every((k) => prev.has(k))) {
        return new Set();
      }
      return new Set(allItemKeys);
    });
  }, [allItemKeys]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('All');
  }, []);

  const showTwoCol = activeCategory === 'All' && !searchQuery;

  return (
    <ScrollReveal>
      <div id="faq">
        <SectionHeader title="Frequently Asked Questions" badge="FAQ" />

        {/* Controls */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Search + Expand All row */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search input */}
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className={cn(
                  'w-full pl-9 pr-9 py-2.5 text-sm rounded-xl',
                  'backdrop-blur-sm bg-surface/30 border border-white/5',
                  'text-text-primary placeholder:text-text-muted/50',
                  'focus:outline-none focus:border-near-green/30 focus:ring-1 focus:ring-near-green/20',
                  'transition-all duration-300'
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Expand All / Collapse All */}
            <button
              onClick={toggleAll}
              className={cn(
                'text-xs font-medium px-3 py-2.5 rounded-xl whitespace-nowrap',
                'backdrop-blur-sm bg-surface/30 border border-white/5',
                'text-text-muted hover:text-near-green hover:border-near-green/20',
                'transition-all duration-300'
              )}
            >
              {isAllExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-x-visible sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* All pill */}
            <button
              onClick={() => setActiveCategory('All')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium flex-shrink-0',
                'backdrop-blur-sm border transition-all duration-300',
                activeCategory === 'All'
                  ? 'bg-near-green/15 border-near-green/30 text-near-green shadow-[0_0_12px_rgba(0,236,151,0.1)]'
                  : 'bg-surface/30 border-white/5 text-text-muted hover:border-near-green/20 hover:text-text-secondary'
              )}
            >
              All
              <span
                className={cn(
                  'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-[10px] font-semibold',
                  activeCategory === 'All'
                    ? 'bg-near-green/20 text-near-green'
                    : 'bg-white/5 text-text-muted'
                )}
              >
                {totalCount}
              </span>
            </button>

            {categoryNames.map((name) => (
              <button
                key={name}
                onClick={() => setActiveCategory(name)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium flex-shrink-0 whitespace-nowrap',
                  'backdrop-blur-sm border transition-all duration-300',
                  activeCategory === name
                    ? 'bg-near-green/15 border-near-green/30 text-near-green shadow-[0_0_12px_rgba(0,236,151,0.1)]'
                    : 'bg-surface/30 border-white/5 text-text-muted hover:border-near-green/20 hover:text-text-secondary'
                )}
              >
                <span className="opacity-70">{CATEGORY_ICONS[name]}</span>
                <span className="hidden sm:inline">{name}</span>
                <span
                  className={cn(
                    'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-[10px] font-semibold',
                    activeCategory === name
                      ? 'bg-near-green/20 text-near-green'
                      : 'bg-white/5 text-text-muted'
                  )}
                >
                  {categoryCounts[name]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        {filteredData.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-surface/30 border border-white/5 mb-4">
              <Search className="w-5 h-5 text-text-muted" />
            </div>
            <p className="text-text-secondary text-sm mb-1">
              No matching questions for &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              onClick={clearSearch}
              className="text-near-green text-sm hover:underline mt-2"
            >
              Browse all questions →
            </button>
          </motion.div>
        ) : (
          <div
            className={cn(
              'max-w-4xl mx-auto',
              showTwoCol
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-8'
                : 'max-w-3xl space-y-8'
            )}
          >
            {filteredData.map((category) => (
              <CategoryBlock
                key={category.category}
                category={category.category}
                items={category.items}
                categoryIndex={category.originalIndex}
                openItems={openItems}
                toggleItem={toggleItem}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}
