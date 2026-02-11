import { Metadata } from 'next';
import Link from 'next/link';
import { Brain, Link2, Shield, Target, Sparkles } from 'lucide-react';
import { Container, Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { HeroSection } from './components/HeroSection';
import { LearningTracks } from './components/LearningTracks';
import { SocialProof } from './components/SocialProof';
import { SkillTree } from './components/SkillTree';
import { WalletSetup } from './components/WalletSetup';
import { WhyRust } from './components/WhyRust';
import { RustCurriculum } from './components/RustCurriculum';
import { EcosystemMap } from './components/EcosystemMap';
import ProjectTemplates from './components/ProjectTemplates';
import { ResourceHub } from './components/ResourceHub';
import BottomCTA from './components/BottomCTA';

export const metadata: Metadata = {
  title: 'Learn — From Zero to NEAR Builder | Voidspace',
  description: 'Learn NEAR Protocol, master Rust, and build your first smart contract. Choose your path: Explorer, Builder, or Hacker. Free interactive lessons with AI assistance.',
};

const KEY_TECHNOLOGIES = [
  {
    icon: Brain,
    title: 'Shade Agents',
    badge: 'AI',
    description: 'Autonomous AI agents that run in Trusted Execution Environments (TEEs). Shade Agents can hold private keys, manage funds, and execute complex strategies — all verifiably and trustlessly on-chain.',
    useCases: ['Autonomous trading bots', 'AI-powered portfolio management', 'Automated DAO operations', 'Intelligent DeFi yield optimization'],
    voidLink: '/opportunities?category=ai-agents',
    voidLabel: 'See AI & Agents voids',
  },
  {
    icon: Link2,
    title: 'Intents & Chain Abstraction',
    badge: 'UX',
    description: 'Users declare what they want to achieve ("swap 10 NEAR for USDC at the best rate") and a network of solvers competes to fulfill the intent optimally. No manual bridging, no chain switching — one account works everywhere.',
    useCases: ['Cross-chain swaps without bridges', 'Unified portfolio across chains', 'Gas-free user experiences', 'Seamless multi-chain dApp interactions'],
    voidLink: '/opportunities?category=intents',
    voidLabel: 'See Intents voids',
  },
  {
    icon: Shield,
    title: 'Chain Signatures',
    badge: 'CRYPTO',
    description: 'A multi-party computation (MPC) scheme that enables a single NEAR account to sign transactions on any blockchain — Ethereum, Bitcoin, Cosmos, and more. The cryptographic foundation for true chain abstraction.',
    useCases: ['Control Bitcoin from a NEAR account', 'Sign Ethereum transactions from NEAR', 'Build cross-chain dApps natively', 'Unified identity across all chains'],
    voidLink: '/opportunities?category=wallets',
    voidLabel: 'See Wallets & Identity voids',
  },
];

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

      <Container className="pb-20 space-y-20">
        {/* What is NEAR? */}
        <ScrollReveal>
          <div id="near-overview">
            <SectionHeader title="What is NEAR Protocol?" badge="OVERVIEW" />
            <Card variant="glass" padding="lg">
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  <strong className="text-text-primary">NEAR Protocol</strong> is a high-performance Layer 1 blockchain designed for usability and scalability. Often called &ldquo;The Blockchain for AI,&rdquo; NEAR combines sub-second transaction finality, human-readable account names (like <code className="text-near-green bg-near-green/10 px-1.5 py-0.5 rounded text-sm">alice.near</code>), and innovative sharding technology to deliver an experience that feels more like using a traditional web app than a blockchain.
                </p>
                <p>
                  What sets NEAR apart is its focus on <strong className="text-text-primary">chain abstraction</strong> — the idea that users shouldn&apos;t need to think about which blockchain they&apos;re on. With technologies like Intents, Chain Signatures, and Shade Agents, NEAR is building toward a future where one account works seamlessly across every chain.
                </p>
              </div>
            </Card>
          </div>
        </ScrollReveal>

        {/* Wallet Setup Guide */}
        <ScrollReveal delay={0.05}>
          <WalletSetup />
        </ScrollReveal>

        {/* Why Rust? */}
        <ScrollReveal delay={0.08}>
          <WhyRust />
        </ScrollReveal>

        {/* Rust Curriculum */}
        <RustCurriculum />

        {/* Key Technologies */}
        <ScrollReveal delay={0.1}>
          <SectionHeader title="Key NEAR Technologies" count={3} badge="STRATEGIC" />
          <div className="space-y-4">
            {KEY_TECHNOLOGIES.map((tech) => {
              const Icon = tech.icon;
              return (
                <Card key={tech.title} variant="glass" padding="lg">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-near-green/10">
                          <Icon className="w-5 h-5 text-near-green" />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary">{tech.title}</h3>
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-near-green/80 bg-near-green/10 px-2 py-0.5 rounded-full border border-near-green/20">
                          {tech.badge}
                        </span>
                      </div>
                      <p className="text-text-secondary leading-relaxed">{tech.description}</p>
                    </div>
                    <div className="lg:w-64 shrink-0">
                      <p className="text-xs text-text-muted uppercase tracking-wide font-mono mb-2">Use Cases</p>
                      <ul className="space-y-1.5">
                        {tech.useCases.map((uc) => (
                          <li key={uc} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span className="text-near-green mt-1">&#x2022;</span>
                            {uc}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={tech.voidLink}
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-near-green hover:text-near-green/80 transition-colors"
                      >
                        <Target className="w-3 h-3" />
                        {tech.voidLabel} &rarr;
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollReveal>

        {/* How AI Creates Your Void Brief */}
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
                    Voidspace uses <strong className="text-text-primary">Claude AI by Anthropic</strong> to generate personalized build plans called <strong className="text-text-primary">Void Briefs</strong>. Each brief is tailored to a specific void in the NEAR ecosystem and includes everything you need to start building.
                  </p>
                  <p>
                    When you request a Void Brief, our system feeds Claude real-time ecosystem data from 6 sources — project registry, DeFiLlama TVL data, GitHub activity, NearBlocks chain metrics, FastNEAR on-chain data, and Pikespeak wallet analytics. This means every brief is grounded in actual ecosystem data, not generic templates.
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
                  { title: 'Funding & Monetization', desc: 'Grants, revenue models, and build complexity' },
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

        {/* Ecosystem Map — Where Will You Build? */}
        <EcosystemMap />

        {/* Project Templates */}
        <ScrollReveal delay={0.15}>
          <ProjectTemplates />
        </ScrollReveal>

        {/* Resources */}
        <ScrollReveal delay={0.18}>
          <ResourceHub />
        </ScrollReveal>
      </Container>

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}
