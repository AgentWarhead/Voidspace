import Link from 'next/link';
import { BookOpen, Rocket, Clock, Zap, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';

const LESSONS = [
  {
    num: 1,
    title: 'Variables & Types',
    subtitle: 'Accounts are strings, balances are u128',
    duration: '20 min',
    difficulty: 'EASY',
    diffColor: 'text-green-400',
    concepts: ['let / let mut', 'String vs &str', 'u128 for balances', 'AccountId type'],
    nearContext: 'Every NEAR account is a String. Every token balance is a u128. Start here.',
  },
  {
    num: 2,
    title: 'Ownership & Borrowing',
    subtitle: 'Why Rust prevents billion-dollar bugs',
    duration: '30 min',
    difficulty: 'MEDIUM',
    diffColor: 'text-amber-400',
    concepts: ['Move semantics', 'References (&)', 'Mutable borrows (&mut)', 'Lifetimes (intro)'],
    nearContext: 'Ownership is why Rust contracts don\'t have reentrancy bugs. The compiler enforces safety.',
  },
  {
    num: 3,
    title: 'Structs & Enums',
    subtitle: 'Building your first contract data model',
    duration: '25 min',
    difficulty: 'MEDIUM',
    diffColor: 'text-amber-400',
    concepts: ['#[near(contract_state)]', 'impl blocks', 'enum for states', 'Pattern matching'],
    nearContext: 'Every NEAR contract starts with a struct. This lesson builds a real one.',
  },
  {
    num: 4,
    title: 'Error Handling',
    subtitle: 'Result and Option — no surprises',
    duration: '20 min',
    difficulty: 'MEDIUM',
    diffColor: 'text-amber-400',
    concepts: ['Option<T>', 'Result<T, E>', 'unwrap vs expect', '? operator'],
    nearContext: 'Smart contracts that panic lose gas. Proper error handling saves money.',
  },
  {
    num: 5,
    title: 'Collections & Storage',
    subtitle: 'LookupMap, Vector, UnorderedSet',
    duration: '30 min',
    difficulty: 'MEDIUM',
    diffColor: 'text-amber-400',
    concepts: ['near_sdk collections', 'Storage staking', 'Lazy vs eager loading', 'Key prefixes'],
    nearContext: 'NEAR storage costs NEAR tokens. Choosing the right collection saves real money.',
  },
  {
    num: 6,
    title: 'Your First Contract',
    subtitle: 'Write → Test → Deploy',
    duration: '45 min',
    difficulty: 'MEDIUM',
    diffColor: 'text-amber-400',
    concepts: ['#[near] macro', 'init function', 'View vs change methods', 'Unit tests'],
    nearContext: 'Build a simple greeting contract, test it locally, deploy to testnet.',
  },
  {
    num: 7,
    title: 'Token Standards (NEP-141)',
    subtitle: 'Build a fungible token from scratch',
    duration: '45 min',
    difficulty: 'HARD',
    diffColor: 'text-orange-400',
    concepts: ['NEP-141 interface', 'ft_transfer', 'Storage registration', 'Events'],
    nearContext: 'The foundation of all DeFi on NEAR. Build the same standard used by every DEX.',
  },
  {
    num: 8,
    title: 'NFTs (NEP-171)',
    subtitle: 'Create an NFT collection',
    duration: '45 min',
    difficulty: 'HARD',
    diffColor: 'text-orange-400',
    concepts: ['NEP-171 + NEP-177', 'nft_mint', 'Royalties (NEP-199)', 'Enumeration'],
    nearContext: 'Build a full NFT contract with metadata, royalties, and enumeration.',
  },
  {
    num: 9,
    title: 'Cross-Contract Calls',
    subtitle: 'Composable contract architecture',
    duration: '40 min',
    difficulty: 'HARD',
    diffColor: 'text-orange-400',
    concepts: ['Promise API', 'Callbacks', 'Gas management', 'Error recovery'],
    nearContext: 'Real dApps are multiple contracts talking to each other. Master the pattern.',
  },
  {
    num: 10,
    title: 'Deploy to Mainnet',
    subtitle: 'Ship it. For real.',
    duration: '30 min',
    difficulty: 'BOSS',
    diffColor: 'text-red-400',
    concepts: ['near-cli deployment', 'Contract upgrades', 'Access keys', 'Security checklist'],
    nearContext: 'Your contract goes live. Real users. Real money. You did it.',
  },
];

export function RustCurriculum() {
  const totalTime = '~6 hours';
  const totalLessons = LESSONS.length;

  return (
    <ScrollReveal>
      <div id="rust-curriculum">
        <SectionHeader title="Rust for NEAR — Full Curriculum" count={totalLessons} badge="STRUCTURED COURSE" />
        <p className="text-text-secondary mb-4 max-w-2xl">
          10 progressive lessons that take you from zero Rust knowledge to deploying a real contract on mainnet.
          Each lesson has interactive exercises in the Sanctum with AI guidance.
        </p>

        {/* Course stats */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
            <Clock className="w-3 h-3 text-near-green" /> {totalTime} total
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
            <BookOpen className="w-3 h-3 text-near-green" /> {totalLessons} lessons
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
            <Zap className="w-3 h-3 text-near-green" /> AI-guided exercises
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
            <Rocket className="w-3 h-3 text-near-green" /> Deploys real contract
          </div>
        </div>

        {/* Lesson List */}
        <div className="space-y-3">
          {LESSONS.map((lesson) => (
            <Link
              key={lesson.num}
              href="/sanctum"
              className="group flex items-start gap-4 p-4 rounded-xl bg-surface/50 border border-border hover:border-near-green/30 transition-all hover:-translate-y-0.5"
            >
              {/* Lesson number */}
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 group-hover:border-near-green/30 transition-colors">
                <span className="text-sm font-bold text-text-primary">{lesson.num}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-text-primary group-hover:text-near-green transition-colors">
                    {lesson.title}
                  </h4>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${lesson.diffColor}`}>
                    {lesson.difficulty}
                  </span>
                </div>
                <p className="text-xs text-text-muted mb-2">{lesson.subtitle}</p>

                {/* Concept tags */}
                <div className="flex flex-wrap gap-1.5">
                  {lesson.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="text-[10px] font-mono text-text-muted bg-surface-hover px-1.5 py-0.5 rounded border border-border/50"
                    >
                      {concept}
                    </span>
                  ))}
                </div>

                {/* NEAR context */}
                <p className="text-[11px] text-near-green/70 mt-2 italic">{lesson.nearContext}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-text-muted font-mono">{lesson.duration}</span>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-near-green transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Sanctum CTA */}
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-purple-500/10 to-near-green/10 border border-purple-500/20 text-center">
          <h4 className="font-semibold text-text-primary mb-1">Ready to start Lesson 1?</h4>
          <p className="text-sm text-text-secondary mb-4">The Sanctum AI will guide you through every concept. Ask questions anytime.</p>
          <Link
            href="/sanctum"
            className="shimmer-btn text-background font-semibold px-8 py-3 rounded-lg text-sm inline-flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Enter the Sanctum
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
