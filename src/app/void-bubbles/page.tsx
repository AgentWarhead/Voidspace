import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { VoidBubblesEngine } from '@/components/void-bubbles/VoidBubblesEngine';
import { GradientText } from '@/components/effects/GradientText';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
export const metadata: Metadata = {
  title: 'Void Bubbles — Live NEAR Ecosystem Visualization | Voidspace',
  description: 'Watch the NEAR ecosystem breathe in real-time. Every token as a living bubble — price action, health scores, whale alerts, and rug detection. Powered by Ref Finance + DexScreener.',
  keywords: ['NEAR', 'tokens', 'visualization', 'DeFi', 'bubbles', 'real-time', 'crypto', 'market', 'whale alerts'],
};

export default function VoidBubblesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-8 border-b border-border overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.04) 0%, transparent 70%)',
          }}
        />
        <Container size="xl" className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <span className="text-3xl">🫧</span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-near-green rounded-full animate-pulse" />
                </div>
                <GradientText as="h1" className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Void Bubbles
                </GradientText>
              </div>
              <p className="text-text-secondary text-sm max-w-xl">
                Watch the NEAR ecosystem breathe. Every token is a living bubble — size reflects market cap,
                color shows momentum, and our AI scores the health of every single one.
              </p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 w-fit shrink-0">
              <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
              <span className="text-xs font-mono text-near-green uppercase tracking-wider">Live Data</span>
            </div>
          </div>

          {/* Feature hints */}
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { emoji: '👁️', label: 'X-Ray Mode', desc: 'See concentration risk' },
              { emoji: '🔊', label: 'Sonic', desc: 'Hear the market' },
              { emoji: '💀', label: 'Rug Detection', desc: 'AI risk scoring' },
              { emoji: '⚡', label: 'Whale Alerts', desc: 'Live large transactions' },
              { emoji: '📸', label: 'Snapshot', desc: 'Save & share' },
              { emoji: '🎛️', label: 'Filter', desc: 'By category' },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <span className="text-xs">{emoji}</span>
                <span className="text-text-secondary font-medium">{label}</span>
                <span className="hidden sm:inline">— {desc}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Visualization */}
      <section className="py-4">
        <Container size="xl">
          <VoidBubblesEngine />
        </Container>
      </section>

      {/* Bottom CTA */}
      <ScrollReveal>
        <section className="py-12 border-t border-border">
          <Container size="lg">
            <div className="text-center space-y-4">
              <GradientText as="h2" className="text-xl sm:text-2xl font-bold">
                See the voids. Fill the gaps. Build on NEAR.
              </GradientText>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Void Bubbles shows you the market. Our AI briefs show you where to build.
                Together, they&apos;re your unfair advantage.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <a
                  href="/opportunities"
                  className="shimmer-btn text-background font-semibold px-6 py-3 rounded-lg text-sm inline-flex items-center gap-2"
                >
                  Explore Voids
                  <span>→</span>
                </a>
                <a
                  href="/sanctum"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm"
                >
                  Generate AI Brief
                </a>
              </div>
            </div>
          </Container>
        </section>
      </ScrollReveal>
    </div>
  );
}
