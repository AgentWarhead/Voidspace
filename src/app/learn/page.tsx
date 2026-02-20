import { Metadata } from 'next';
import { Key, Zap, Bug, BookOpen, ArrowRight, Code2, GitCompareArrows, ArrowRightLeft, Rocket } from 'lucide-react';
import { Container } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import dynamic from 'next/dynamic';
import { HeroSection } from './components/HeroSection';
import { LearningTracks } from './components/LearningTracks';
import { DeepDiveSection } from './components/DeepDiveSection';
import Link from 'next/link';

// ─── Lazy-loaded below-fold components ─────────────────────────────────────────

const ProjectTemplates = dynamic(() => import('./components/ProjectTemplates'), {
  loading: () => <div className="h-64 animate-pulse bg-surface rounded-xl" />,
});

const BottomCTA = dynamic(() => import('./components/BottomCTA'), {
  loading: () => <div className="h-48 animate-pulse bg-surface rounded-xl" />,
});

const SanctumPreview = dynamic(() => import('./components/SanctumPreview').then(m => ({ default: m.SanctumPreview })), {
  loading: () => <div className="h-64 animate-pulse bg-surface rounded-xl" />,
});

const FAQ = dynamic(() => import('./components/FAQ').then(m => ({ default: m.FAQ })), {
  loading: () => <div className="h-48 animate-pulse bg-surface rounded-xl" />,
});

export const metadata: Metadata = {
  title: 'Learn NEAR Protocol — Free Rust & Smart Contract Course | Voidspace',
  description:
    'Master Rust and ship smart contracts on NEAR. 66 free modules across 4 tracks — from wallet setup to production dApps. AI-powered, self-paced.',
  keywords:
    'learn NEAR Protocol, NEAR developer tutorial, Rust smart contract tutorial, blockchain course free, Web3 developer guide, learn Rust blockchain, Solana Rust developer',
  alternates: {
    canonical: 'https://voidspace.io/learn',
  },
  openGraph: {
    title: 'Learn NEAR Protocol — Free Rust & Smart Contract Course | Voidspace',
    description:
      'Master Rust and ship smart contracts on NEAR. 66 free modules across 4 tracks — AI-powered, self-paced.',
    url: 'https://voidspace.io/learn',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn NEAR Protocol — Free Rust & Smart Contract Course | Voidspace',
    description:
      'Master Rust and ship smart contracts on NEAR. 66 free modules — AI-powered, self-paced.',
    creator: '@VoidSpaceIO',
  },
};

const DEEP_DIVE_CARDS = [
  {
    emoji: '🔑',
    title: 'Wallet Setup',
    description: 'Your .near identity — set up in 10 minutes flat',
    href: '/learn/wallet-setup',
    icon: Key,
  },
  {
    emoji: '⚡',
    title: 'Key Technologies',
    description: 'The tech that makes NEAR different from everything else',
    href: '/learn/key-technologies',
    icon: Zap,
  },
  {
    emoji: '🦀',
    title: 'Why Rust?',
    description: 'The #1 most loved language, and your unfair advantage',
    href: '/learn/why-rust',
    icon: Bug,
  },
  {
    emoji: '📚',
    title: 'Rust Curriculum',
    description: 'Zero to mainnet. Free. Self-paced. AI-assisted.',
    href: '/learn/rust-curriculum',
    icon: BookOpen,
  },
  {
    emoji: '🦀',
    title: 'Rust for Blockchain',
    description: 'One language. Every major chain. Learn it once.',
    href: '/learn/rust-for-blockchain',
    icon: Code2,
  },
  {
    emoji: '⚡',
    title: 'Solana vs NEAR',
    description: 'No shilling — just the facts developers actually need',
    href: '/learn/solana-vs-near',
    icon: GitCompareArrows,
  },
  {
    emoji: '🔄',
    title: 'For Solana Developers',
    description: 'Your Rust transfers directly. Here\'s the fast track.',
    href: '/learn/for-solana-developers',
    icon: ArrowRightLeft,
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      {/* Structured Data: Course */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'Learn NEAR Protocol — Free Blockchain Developer Course',
            description:
              'Master Rust, build smart contracts, and ship dApps on NEAR Protocol.',
            provider: {
              '@type': 'Organization',
              name: 'Voidspace',
              url: 'https://voidspace.io',
            },
            isAccessibleForFree: true,
            coursePrerequisites: 'Basic programming knowledge',
            educationalLevel: 'Beginner to Advanced',
            inLanguage: 'en',
            url: 'https://voidspace.io/learn',
          }),
        }}
      />

      {/* Structured Data: FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is NEAR Protocol?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'NEAR is a high-performance Layer 1 blockchain with sub-second finality, human-readable accounts (like alice.near), and built-in chain abstraction. It\'s designed to feel like using a normal web app.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is Voidspace?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Voidspace is your all-in-one platform for learning, building, and analyzing on NEAR Protocol. It includes free learning tracks, an AI-powered smart contract builder called Sanctum, and a suite of free intelligence tools.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do I need coding experience to get started?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Not at all. The Explorer track covers NEAR basics, wallets, and ecosystem navigation with zero coding required. The Builder and Hacker tracks assume basic programming knowledge, but the Rust Curriculum starts from scratch.',
                },
              },
              {
                '@type': 'Question',
                name: 'Are the learning tracks really free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes — all 4 tracks (Explorer, Builder, Hacker, Founder) with 66 modules are completely free. No credit card, no paywall, no catch.',
                },
              },
              {
                '@type': 'Question',
                name: 'How long does each track take?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Explorer ~6 hours, Builder ~20 hours, Hacker ~8 hours, Founder ~6 hours. All tracks are self-paced.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do I earn certificates?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Complete any track to earn a shareable certificate. Finish all four tracks and earn Legend status.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is Sanctum?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sanctum is Voidspace\'s general-purpose AI vibe-coding builder, powered by Claude (Anthropic). Describe what you want in plain English, and it generates production-ready NEAR smart contracts, web apps, code audits, visual assets, and more.',
                },
              },
              {
                '@type': 'Question',
                name: 'How much does Sanctum cost?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sanctum uses a credit-based system. The Shade tier is free with $2.50 in credits. Paid tiers: Specter ($25/mo), Legion ($60/mo), and Leviathan ($200/mo). Top-up packs are also available.',
                },
              },
            ],
          }),
        }}
      />

      {/* 1. Hero — "From Zero to NEAR Builder" */}
      <div id="overview">
        <HeroSection />
      </div>

      {/* 2. Learning Tracks — moved up to #2 */}
      <div id="learning-tracks">
        <LearningTracks />
      </div>

      {/* 3. Quick Start CTA */}
      <Container className="pb-12">
        <ScrollReveal>
          <div id="quick-start">
            <Link href="/learn/quick-start" className="block group">
              <GlowCard className="p-6 md:p-8 transition-all duration-300 group-hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex-shrink-0 shadow-lg shadow-emerald-500/10">
                    <Rocket className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-near-green transition-colors">
                      ⚡ Your First Transaction in 3 Minutes
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                      Create a wallet, get testnet tokens, make a transfer, and see it on-chain. Hands-on, no code required.
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-text-muted group-hover:text-near-green group-hover:translate-x-2 transition-all flex-shrink-0" />
                </div>
              </GlowCard>
            </Link>
          </div>
        </ScrollReveal>
      </Container>

      {/* 4. Sanctum AI Preview */}
      <Container className="py-8 sm:py-12">
        <SanctumPreview />
      </Container>

      {/* 5. Combined Guides — Deep Dives + Cross-Chain merged */}
      <Container className="pb-12 sm:pb-20">
        <ScrollReveal>
          <div id="guides">
            <SectionHeader title="Guides & Deep Dives" badge="EXPLORE" />
            <DeepDiveSection cards={DEEP_DIVE_CARDS.map(({ icon, ...rest }) => rest)} />
          </div>
        </ScrollReveal>
      </Container>

      {/* 6. Project Templates */}
      <Container className="pb-12 sm:pb-20">
        <ScrollReveal delay={0.15}>
          <div id="templates">
            <ProjectTemplates />
          </div>
        </ScrollReveal>
      </Container>

      {/* 7. FAQ */}
      <Container className="pb-12 sm:pb-20">
        <FAQ />
      </Container>

      {/* 8. Bottom CTA */}
      <BottomCTA />
    </div>
  );
}
