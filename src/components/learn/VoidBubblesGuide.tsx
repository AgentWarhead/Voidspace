import Link from 'next/link';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { Card } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';

const FEATURES = [
  {
    emoji: '🔍',
    title: 'X-Ray Mode',
    description: 'Reveals concentration risk and rug detection scores. Red rings indicate high-risk tokens with concerning whale behavior or liquidity issues.',
  },
  {
    emoji: '🔊',
    title: 'Sonic Mode',
    description: 'Hear the market through ascending tones for pumps, low rumbles for dumps, and dramatic chimes for whale alerts. Turn sound on for true immersion.',
  },
  {
    emoji: '🧠',
    title: 'AI Health Scores',
    description: 'Every token gets an AI-powered health assessment based on liquidity, trading patterns, contract analysis, and community metrics. Click any bubble for details.',
  },
  {
    emoji: '⚡',
    title: 'Real-Time Updates',
    description: 'Data refreshes every 60 seconds. Watch tokens pump and dump in real-time, with whale alerts and price movements reflected instantly in the bubble physics.',
  },
];

export function VoidBubblesGuide() {
  return (
    <ScrollReveal>
      <SectionHeader title="Mastering Void Bubbles" badge="LIVE VISUALIZATION" />
      <Card variant="glass" padding="lg" className="mb-6">
        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">Void Bubbles</strong> is Voidspace&apos;s real-time token visualization engine. Every NEAR token becomes a living bubble that breathes with market activity, complete with AI health scoring and risk detection.
          </p>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {FEATURES.map((feature) => (
          <GlowCard key={feature.title} padding="md" className="h-full">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{feature.emoji}</div>
                <h3 className="text-sm font-medium text-text-primary">{feature.title}</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{feature.description}</p>
            </div>
          </GlowCard>
        ))}
      </div>
      <div className="text-center">
        <Link href="/void-bubbles" className="shimmer-btn text-background font-semibold px-6 py-3 rounded-lg text-sm inline-flex items-center gap-2">
          Launch Void Bubbles →
        </Link>
      </div>
    </ScrollReveal>
  );
}
