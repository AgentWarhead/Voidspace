import { Metadata } from 'next';
import { Key, Zap, Bug, BookOpen, BarChart3, ArrowRight, Code2, GitCompareArrows, ArrowRightLeft, Rocket, Award } from 'lucide-react';
import { Container, Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import dynamic from 'next/dynamic';
import { HeroSection } from './components/HeroSection';
import { SocialProof } from './components/SocialProof';
import { LearningTracks } from './components/LearningTracks';
import { TableOfContents } from './components/TableOfContents';
import { NonDevCallout } from './components/NonDevCallout';
import Link from 'next/link';

// ─── Lazy-loaded below-fold components ─────────────────────────────────────────


const ProjectTemplates = dynamic(() => import('./components/ProjectTemplates'), {
  loading: () => <div className="h-64 animate-pulse bg-surface rounded-xl" />,
});

const ResourceHub = dynamic(() => import('./components/ResourceHub').then(m => ({ default: m.ResourceHub })), {
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
  title: 'Learn NEAR Protocol — Free Blockchain Developer Course | Voidspace',
  description:
    'Master Rust, build smart contracts, and ship dApps on NEAR Protocol. Free, self-paced, AI-powered learning tracks for beginners to advanced developers.',
  keywords:
    'learn NEAR Protocol, NEAR developer tutorial, Rust smart contract tutorial, blockchain course free, Web3 developer guide, learn Rust blockchain, Solana Rust developer',
  alternates: {
    canonical: 'https://voidspace.io/learn',
  },
  openGraph: {
    title: 'Learn NEAR Protocol — Free Blockchain Developer Course | Voidspace',
    description:
      'Master Rust, build smart contracts, and ship dApps on NEAR Protocol. Free, self-paced, AI-powered learning tracks.',
    url: 'https://voidspace.io/learn',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn NEAR Protocol — Free Blockchain Developer Course | Voidspace',
    description:
      'Master Rust, build smart contracts, and ship dApps. Free, AI-powered tracks from beginner to advanced.',
    creator: '@VoidSpaceNear',
  },
};

const DEEP_DIVE_CARDS = [
  {
    emoji: '🔑',
    title: 'Wallet Setup',
    description: 'Set up your first NEAR wallet in minutes',
    href: '/learn/wallet-setup',
    icon: Key,
  },
  {
    emoji: '⚡',
    title: 'Key Technologies',
    description: 'Chain Abstraction, Intents, and more',
    href: '/learn/key-technologies',
    icon: Zap,
  },
  {
    emoji: '🦀',
    title: 'Why Rust?',
    description: 'Why Rust is the language of secure smart contracts',
    href: '/learn/why-rust',
    icon: Bug,
  },
  {
    emoji: '📚',
    title: 'Rust Curriculum',
    description: 'Free structured course from zero to deployment',
    href: '/learn/rust-curriculum',
    icon: BookOpen,
  },
];

const CROSS_CHAIN_CARDS = [
  {
    emoji: '🦀',
    title: 'Rust for Blockchain',
    description: 'Chain-agnostic Rust skills for any blockchain',
    href: '/learn/rust-for-blockchain',
    icon: Code2,
  },
  {
    emoji: '⚡',
    title: 'Solana vs NEAR',
    description: 'Honest comparison for developers',
    href: '/learn/solana-vs-near',
    icon: GitCompareArrows,
  },
  {
    emoji: '🔄',
    title: 'For Solana Developers',
    description: 'Your Rust skills already work here',
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
                  text: 'Sanctum is Voidspace\'s AI-powered vibe-coding builder. Describe what you want in plain English, and it generates production-ready NEAR smart contracts — tokens, NFTs, DAOs, DeFi vaults, marketplaces, and AI agents.',
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
              {
                '@type': 'Question',
                name: 'What is Void Lens?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Void Lens is a free wallet analyzer that gives you portfolio valuation, on-chain reputation scoring, and DeFi position tracking for any NEAR account.',
                },
              },
              {
                '@type': 'Question',
                name: 'What are Void Bubbles?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Void Bubbles is a free real-time visualization of NEAR token markets. Watch token activity as dynamic bubbles — great for spotting trends at a glance.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the Constellation Map?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Constellation Map is a free transaction graph explorer. Paste any NEAR account and visualize its on-chain relationships and transaction flows as an interactive network graph.',
                },
              },
              {
                '@type': 'Question',
                name: 'What\'s free and what\'s paid?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'All learning tracks, Void Lens, Void Bubbles, and Constellation Map are completely free. Only Sanctum (the AI builder) has paid tiers — and even that starts with a free tier.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is Rust hard to learn for smart contracts?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Rust has a steeper learning curve than JavaScript, but the strict compiler catches bugs before they reach production. Our Builder track starts from zero Rust experience and many developers find it rewarding once it clicks.',
                },
              },
              {
                '@type': 'Question',
                name: 'How does NEAR compare to Solana technically?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Both use Rust for smart contracts. NEAR adds human-readable accounts, built-in chain abstraction, and a sharded architecture optimized for usability. Solana optimizes for raw throughput. If you know Solana Rust, your skills transfer directly.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is Chain Abstraction?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Chain Abstraction is NEAR\'s approach to making blockchain invisible to end users. Technologies like Intents, Chain Signatures, and Shade Agents let users interact across multiple blockchains from a single NEAR account.',
                },
              },
            ],
          }),
        }}
      />

      {/* Sticky Table of Contents (desktop only) */}
      <TableOfContents />

      {/* Hero — "From Zero to NEAR Builder" */}
      <div id="overview">
        <HeroSection />
      </div>

      {/* Social Proof — Why Builders Choose NEAR */}
      <Container className="pb-12">
        <SocialProof />
      </Container>

      {/* What is NEAR? — moved up for beginner context */}
      <Container className="pb-12">
        <ScrollReveal>
          <div id="near-overview">
            <SectionHeader title="What is NEAR Protocol?" badge="OVERVIEW" />
            <Card variant="glass" padding="lg">
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  <strong className="text-text-primary">NEAR Protocol</strong> is a
                  high-performance Layer 1 blockchain designed for usability and
                  scalability. Often called &ldquo;The Blockchain for AI,&rdquo; NEAR
                  combines sub-second transaction finality, human-readable account names
                  (like{' '}
                  <code className="text-near-green bg-near-green/10 px-1.5 py-0.5 rounded text-sm">
                    alice.near
                  </code>
                  ), and innovative sharding technology to deliver an experience that
                  feels more like using a traditional web app than a blockchain.
                </p>
                <p>
                  What sets NEAR apart is its focus on{' '}
                  <strong className="text-text-primary">chain abstraction</strong> — the
                  idea that users shouldn&apos;t need to think about which blockchain
                  they&apos;re on. With technologies like Intents, Chain Signatures, and
                  Shade Agents, NEAR is building toward a future where one account works
                  seamlessly across every chain.
                </p>
              </div>
            </Card>
          </div>
        </ScrollReveal>
      </Container>

      {/* Quick Start CTA */}
      <Container className="pb-12">
        <ScrollReveal>
          <div id="quick-start">
            <Link href="/learn/quick-start" className="block group">
              <GlowCard className="p-6 md:p-8 transition-all duration-300 group-hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-near-green/20 to-accent-cyan/20 border border-near-green/20 flex-shrink-0">
                    <Rocket className="w-8 h-8 text-near-green" />
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

      {/* "Not a developer?" callout */}
      <Container className="pb-8">
        <NonDevCallout />
      </Container>

      {/* Learning Tracks — Explorer / Builder / Hacker */}
      <div id="learning-tracks">
        <LearningTracks />
      </div>

      {/* Sanctum AI Preview */}
      <Container className="py-12">
        <SanctumPreview />
      </Container>

      {/* Track Your Progress — compact CTA */}
      <Container className="py-12">
        <ScrollReveal>
          <Link href="/profile/skills" className="block group">
            <Card variant="glass" padding="lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-near-green/10 group-hover:bg-near-green/20 transition-colors">
                    <BarChart3 className="w-6 h-6 text-near-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-near-green transition-colors">
                      📊 Track Your Progress
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                      View your skill constellation and learning roadmap
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-near-green group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>
        </ScrollReveal>
      </Container>

      {/* Earn Your Certificate */}
      <Container className="pb-20">
        <ScrollReveal>
          <div id="certificates">
            <Link href="/learn/certificate" className="block group">
              <GlowCard className="p-6 md:p-8 transition-all duration-300 group-hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-400/20 flex-shrink-0">
                    <Award className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-near-green transition-colors">
                      🏆 Earn Your Certificate
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                      Complete a learning track to earn a shareable NEAR certificate. Explorer, Builder, Hacker, Founder — or all four for Legend status.
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-text-muted group-hover:text-near-green group-hover:translate-x-2 transition-all flex-shrink-0" />
                </div>
              </GlowCard>
            </Link>
          </div>
        </ScrollReveal>
      </Container>

      {/* Deep Dive Cards — replacing WalletSetup, KeyTechnologies, WhyRust, RustCurriculum */}
      <Container className="pb-20">
        <ScrollReveal>
          <div id="deep-dives">
            <SectionHeader title="Deep Dives" badge="EXPLORE" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEEP_DIVE_CARDS.map((card) => (
                <Link key={card.href} href={card.href} className="block group">
                  <GlowCard className="h-full p-6 flex items-start gap-4 transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="p-3 rounded-xl bg-near-green/10 group-hover:bg-near-green/20 transition-colors shrink-0">
                      <card.icon className="w-5 h-5 text-near-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-text-primary group-hover:text-near-green transition-colors">
                        {card.emoji} {card.title}
                      </h3>
                      <p className="text-sm text-text-muted mt-1">{card.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-near-green group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </GlowCard>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>

      {/* Cross-Chain Guides — Solana Harvest */}
      <Container className="pb-20">
        <ScrollReveal>
          <div id="cross-chain">
            <SectionHeader title="Cross-Chain Guides" badge="MULTI-CHAIN" />
            <p className="text-sm text-text-muted mb-4">
              Coming from another Rust blockchain? Your skills transfer directly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CROSS_CHAIN_CARDS.map((card) => (
                <Link key={card.href} href={card.href} className="block group">
                  <GlowCard className="h-full p-6 flex items-start gap-4 transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="p-3 rounded-xl bg-near-green/10 group-hover:bg-near-green/20 transition-colors shrink-0">
                      <card.icon className="w-5 h-5 text-near-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-text-primary group-hover:text-near-green transition-colors">
                        {card.emoji} {card.title}
                      </h3>
                      <p className="text-sm text-text-muted mt-1">{card.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-near-green group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </GlowCard>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>

      {/* Project Templates */}
      <Container className="pb-20">
        <ScrollReveal delay={0.15}>
          <div id="templates">
            <ProjectTemplates />
          </div>
        </ScrollReveal>
      </Container>

      {/* Resources */}
      <Container className="pb-20">
        <ScrollReveal delay={0.18}>
          <div id="resources">
            <ResourceHub />
          </div>
        </ScrollReveal>
      </Container>

      {/* FAQ */}
      <Container className="pb-20">
        <FAQ />
      </Container>

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}
