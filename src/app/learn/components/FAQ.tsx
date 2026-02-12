'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { cn } from '@/lib/utils';

// ─── FAQ Data ──────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: 'Is this course free?',
    answer: 'Yes, all learning tracks on Voidspace are completely free. Explore NEAR Protocol, learn Rust, and build smart contracts at no cost. No credit card, no paywall, no catch.',
  },
  {
    question: 'Do I need coding experience?',
    answer: 'The Explorer track requires no coding experience — it covers NEAR basics, wallets, and ecosystem navigation. The Builder and Hacker tracks assume basic programming knowledge, and the Rust Curriculum starts from zero Rust experience.',
  },
  {
    question: 'What is NEAR Protocol?',
    answer: 'NEAR Protocol is a high-performance Layer 1 blockchain designed for usability and scalability. It features sub-second transaction finality, human-readable account names (like alice.near), and innovative chain abstraction technology that lets users interact across multiple blockchains seamlessly.',
  },
  {
    question: 'What will I be able to build?',
    answer: 'You\'ll be able to build and deploy Rust smart contracts on NEAR, create full-stack dApps with frontend integration, work with chain abstraction features like Intents and Chain Signatures, and ship production-ready applications to mainnet.',
  },
  {
    question: 'How long does it take to complete?',
    answer: 'The Explorer track takes about 6 hours. The Builder track is the most comprehensive at around 20 hours. The Hacker track takes about 8 hours, and the Founder track around 6 hours. All tracks are self-paced — go at your own speed.',
  },
  {
    question: 'Is Rust hard to learn?',
    answer: 'Rust has a steeper learning curve than JavaScript or Python, but our Builder track starts from zero Rust experience. The strict compiler actually helps you write safer code — it catches bugs before they reach production. Many developers find it rewarding once it "clicks."',
  },
  {
    question: 'How does NEAR compare to Solana?',
    answer: 'Both use Rust for smart contracts, but NEAR offers human-readable account names, built-in chain abstraction, and a sharded architecture. NEAR focuses on usability and cross-chain interoperability, while Solana optimizes for raw throughput. If you know Solana Rust, your skills transfer directly.',
  },
  {
    question: 'What is Chain Abstraction?',
    answer: 'Chain Abstraction is NEAR\'s approach to making blockchain invisible to users. With technologies like Intents, Chain Signatures, and Shade Agents, users can interact across multiple blockchains from a single NEAR account without switching networks or managing multiple wallets.',
  },
];

// ─── Accordion Item ────────────────────────────────────────────────────────────

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ScrollReveal>
      <div id="faq">
        <SectionHeader title="Frequently Asked Questions" badge="FAQ" />
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
