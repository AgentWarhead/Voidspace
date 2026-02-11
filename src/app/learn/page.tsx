import { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { Container, Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { HeroSection } from './components/HeroSection';
import { SocialProof } from './components/SocialProof';
import { LearningTracks } from './components/LearningTracks';
import { SkillTree } from './components/SkillTree';
import { WalletSetup } from './components/WalletSetup';
import { KeyTechnologies } from './components/KeyTechnologies';
import { WhyRust } from './components/WhyRust';
import { RustCurriculum } from './components/RustCurriculum';
import { EcosystemMap } from './components/EcosystemMap';
import ProjectTemplates from './components/ProjectTemplates';
import { ResourceHub } from './components/ResourceHub';
import BottomCTA from './components/BottomCTA';

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

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      {/* Hero — "From Zero to NEAR Builder" */}
      <HeroSection />

      {/* Social Proof — Why Builders Choose NEAR */}
      <Container className="pb-12">
        <SocialProof />
      </Container>

      {/* Learning Tracks — Explorer / Builder / Hacker */}
      <LearningTracks />

      {/* Visual Skill Tree / Learning Roadmap */}
      <Container className="py-16">
        <SkillTree />
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

      {/* Wallet Setup Guide */}
      <Container className="pb-20">
        <ScrollReveal delay={0.05}>
          <WalletSetup />
        </ScrollReveal>
      </Container>

      {/* Key NEAR Technologies */}
      <Container className="pb-20">
        <ScrollReveal delay={0.08}>
          <KeyTechnologies />
        </ScrollReveal>
      </Container>

      {/* Why Rust? */}
      <Container className="pb-20">
        <ScrollReveal delay={0.1}>
          <WhyRust />
        </ScrollReveal>
      </Container>

      {/* Rust Curriculum */}
      <Container className="pb-20">
        <RustCurriculum />
      </Container>

      {/* How AI Creates Your Void Brief */}
      <Container className="pb-20">
        <ScrollReveal delay={0.12}>
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
        </ScrollReveal>
      </Container>

      {/* Ecosystem Map */}
      <Container className="pb-20">
        <EcosystemMap />
      </Container>

      {/* Project Templates */}
      <Container className="pb-20">
        <ScrollReveal delay={0.15}>
          <ProjectTemplates />
        </ScrollReveal>
      </Container>

      {/* Resources */}
      <Container className="pb-20">
        <ScrollReveal delay={0.18}>
          <ResourceHub />
        </ScrollReveal>
      </Container>

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}
