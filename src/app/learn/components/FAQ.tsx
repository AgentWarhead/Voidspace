'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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

// ─── FAQ Data ──────────────────────────────────────────────────────────────────

export const FAQ_DATA: FAQCategory[] = [
  {
    category: 'Getting Started',
    items: [
      {
        question: 'What is NEAR Protocol?',
        answer: (
          <>
            NEAR is a high-performance Layer 1 blockchain with sub-second finality, human-readable accounts (like{' '}
            <code className="text-near-green bg-near-green/10 px-1 py-0.5 rounded text-xs">alice.near</code>
            ), and built-in chain abstraction. It&apos;s designed to feel like using a normal web app.
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
          'Not at all. The Explorer track covers NEAR basics, wallets, and ecosystem navigation with zero coding required. The Builder and Hacker tracks assume basic programming knowledge, but the Rust Curriculum starts from scratch.',
      },
    ],
  },
  {
    category: 'Learning & Tracks',
    items: [
      {
        question: 'Are the learning tracks really free?',
        answer:
          'Yes — all 4 tracks (Explorer, Builder, Hacker, Founder) with 66 modules are completely free. No credit card, no paywall, no catch.',
      },
      {
        question: 'How long does each track take?',
        answer:
          'Explorer ~6 hours, Builder ~20 hours, Hacker ~8 hours, Founder ~6 hours. All tracks are self-paced — go as fast or slow as you want.',
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
            <Link href="/sanctum" className="text-near-green hover:underline">Sanctum</Link> is Voidspace&apos;s AI-powered vibe-coding builder. Describe what you want in plain English, and it generates production-ready NEAR smart contracts — tokens, NFTs, DAOs, DeFi vaults, marketplaces, and AI agents.
          </>
        ),
      },
      {
        question: 'What can I build with Sanctum?',
        answer:
          'Sanctum supports 6 project templates: Token, NFT Collection, DAO, DeFi Vault, Marketplace, and AI Agent. Each generates a complete, deployable smart contract with tests and frontend integration.',
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
            All learning tracks, Void Lens, Void Bubbles, and Constellation Map are <strong className="text-text-primary">completely free</strong>. Only{' '}
            <Link href="/sanctum" className="text-near-green hover:underline">Sanctum</Link> (the AI builder) has paid tiers — and even that starts with a free tier.
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
          'Rust has a steeper learning curve than JavaScript, but the strict compiler catches bugs before they reach production. Our Builder track starts from zero Rust experience and many developers find it rewarding once it clicks.',
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
          'Chain Abstraction is NEAR\'s approach to making blockchain invisible to end users. Technologies like Intents, Chain Signatures, and Shade Agents let users interact across multiple blockchains from a single NEAR account — no network switching or multi-wallet juggling.',
      },
    ],
  },
];

// ─── Accordion Item ────────────────────────────────────────────────────────────

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-surface/50">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-hover transition-colors"
      >
        <span className="text-sm font-medium text-text-primary pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={cn('w-4 h-4', isOpen ? 'text-near-green' : 'text-text-muted')} />
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
            <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FAQ Section ───────────────────────────────────────────────────────────────

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

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

  return (
    <ScrollReveal>
      <div id="faq">
        <SectionHeader title="Frequently Asked Questions" badge="FAQ" />
        <div className="max-w-3xl mx-auto space-y-8">
          {FAQ_DATA.map((category, ci) => (
            <div key={category.category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3 px-1">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((item, ii) => {
                  const key = `${ci}-${ii}`;
                  return (
                    <FAQItem
                      key={key}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openItems.has(key)}
                      onToggle={() => toggleItem(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
