import { Metadata } from 'next';
import { Sparkles, Key, Zap, Bug, BookOpen, BarChart3, ArrowRight, Code2, GitCompareArrows, ArrowRightLeft } from 'lucide-react';
import { Container, Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { HeroSection } from './components/HeroSection';
import { SocialProof } from './components/SocialProof';
import { LearningTracks } from './components/LearningTracks';
import { EcosystemMap } from './components/EcosystemMap';
import ProjectTemplates from './components/ProjectTemplates';
import { ResourceHub } from './components/ResourceHub';
import BottomCTA from './components/BottomCTA';
import { TableOfContents } from './components/TableOfContents';
import Link from 'next/link';

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
                name: 'Is this course free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, all learning tracks on Voidspace are completely free. Explore NEAR Protocol, learn Rust, and build smart contracts at no cost.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do I need coding experience?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The Explorer track requires no coding experience — it covers NEAR basics, wallets, and ecosystem navigation. The Builder and Hacker tracks assume basic programming knowledge, and the Rust Curriculum starts from zero Rust experience.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is NEAR Protocol?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'NEAR Protocol is a high-performance Layer 1 blockchain designed for usability and scalability. It features sub-second transaction finality, human-readable account names, and innovative chain abstraction technology that lets users interact across multiple blockchains seamlessly.',
                },
              },
              {
                '@type': 'Question',
                name: 'What will I be able to build after completing these tracks?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You will be able to build and deploy Rust smart contracts on NEAR, create full-stack dApps with frontend integration, work with NEAR\'s chain abstraction features like Intents and Chain Signatures, and contribute to the NEAR ecosystem.',
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

      {/* Learning Tracks — Explorer / Builder / Hacker */}
      <div id="learning-tracks">
        <LearningTracks />
      </div>

      {/* Track Your Progress — compact CTA replacing SkillTree */}
      <Container className="py-12">
        <ScrollReveal>
          <Link href="/profile#skills" className="block group">
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
                      View your skill tree and learning roadmap
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-near-green group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>
        </ScrollReveal>
      </Container>

      {/* What is NEAR? */}
      <Container className="pb-20">
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

      {/* How AI Creates Your Void Brief */}
      <Container className="pb-20">
        <ScrollReveal delay={0.12}>
          <div id="ai-briefs">
            <SectionHeader title="How AI Creates Your Void Brief" badge="POWERED BY CLAUDE" />
            <Card variant="glass" padding="lg">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-near-green/10 shrink-0">
                    <Sparkles className="w-5 h-5 text-near-green" />
                  </div>
                  <div className="space-y-3 text-text-secondary leading-relaxed">
                    <p>
                      Voidspace uses{' '}
                      <strong className="text-text-primary">Claude AI by Anthropic</strong>{' '}
                      to generate personalized build plans called{' '}
                      <strong className="text-text-primary">Void Briefs</strong>. Each brief
                      is tailored to a specific void in the NEAR ecosystem and includes
                      everything you need to start building.
                    </p>
                    <p>
                      When you request a Void Brief, our system feeds Claude real-time
                      ecosystem data from 6 sources — project registry, DeFiLlama TVL data,
                      GitHub activity, NearBlocks chain metrics, FastNEAR on-chain data, and
                      Pikespeak wallet analytics. This means every brief is grounded in
                      actual ecosystem data, not generic templates.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { title: 'Problem & Solution', desc: 'What the void is and how to fill it' },
                    { title: 'Why Now', desc: 'Market timing and ecosystem readiness' },
                    { title: 'Tech Stack', desc: 'Frontend, backend, and NEAR-specific requirements' },
                    { title: 'Key Features', desc: 'Prioritized feature list with must-haves' },
                    { title: 'Next Steps', desc: '5 concrete actions for your first week' },
                    {
                      title: 'Funding & Monetization',
                      desc: 'Grants, revenue models, and build complexity',
                    },
                  ].map((item) => (
                    <div key={item.title} className="p-3 rounded-lg bg-surface-hover">
                      <h4 className="text-sm font-medium text-text-primary">{item.title}</h4>
                      <p className="text-xs text-text-muted mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-muted font-mono">
                  Free tier includes 3 mission briefs per month. Upgrade for more.
                </p>
              </div>
            </Card>
          </div>
        </ScrollReveal>
      </Container>

      {/* Ecosystem Map */}
      <Container className="pb-20">
        <div id="ecosystem">
          <EcosystemMap />
        </div>
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

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}
