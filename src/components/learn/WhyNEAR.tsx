import { Zap, Code2, Users } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';

const NEAR_FEATURES = [
  {
    icon: Zap,
    title: 'Performance',
    description: 'Sub-second finality with Nightshade sharding. NEAR processes thousands of transactions per second with negligible fees, making it practical for consumer-scale applications.',
  },
  {
    icon: Code2,
    title: 'Developer Experience',
    description: 'Build with JavaScript or Rust. Human-readable account names (alice.near), familiar development patterns, and comprehensive SDKs make NEAR one of the most accessible L1s for developers.',
  },
  {
    icon: Users,
    title: 'Ecosystem Support',
    description: 'Active grants program, regular hackathons, and a growing community of builders. The NEAR Foundation actively supports projects aligned with its strategic roadmap.',
  },
];

export function WhyNEAR() {
  return (
    <ScrollReveal>
      <SectionHeader title="What is NEAR Protocol?" badge="OVERVIEW" />
      <Card variant="glass" padding="lg" className="mb-6">
        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">NEAR Protocol</strong> is a high-performance Layer 1 blockchain designed for usability and scalability. Often called &ldquo;The Blockchain for AI,&rdquo; NEAR combines sub-second transaction finality, human-readable account names (like <code className="text-near-green bg-near-green/10 px-1.5 py-0.5 rounded text-sm">alice.near</code>), and innovative sharding technology to deliver an experience that feels more like using a traditional web app than a blockchain.
          </p>
          <p>
            What sets NEAR apart is its focus on <strong className="text-text-primary">chain abstraction</strong> — the idea that users shouldn&apos;t need to think about which blockchain they&apos;re on. With technologies like Intents, Chain Signatures, and Shade Agents, NEAR is building toward a future where one account works seamlessly across every chain.
          </p>
        </div>
      </Card>

      <SectionHeader title="Why Build on NEAR?" count={3} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NEAR_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <GlowCard key={feature.title} padding="md" className="h-full">
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-near-green/10 w-fit">
                  <Icon className="w-5 h-5 text-near-green" />
                </div>
                <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            </GlowCard>
          );
        })}
      </div>
    </ScrollReveal>
  );
}
