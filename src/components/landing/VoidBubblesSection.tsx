import Link from 'next/link';
import { GradientText } from '@/components/effects/GradientText';

export function VoidBubblesSection() {
  return (
    <section>
      <div className="relative overflow-hidden rounded-2xl border border-accent-cyan/20">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 40% 50%, rgba(0,212,255,0.12) 0%, rgba(0,236,151,0.08) 40%, transparent 80%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-near-green/5" />

        <div className="relative z-10 p-5 sm:p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="text-5xl sm:text-6xl md:text-7xl mb-4">🫧</div>
            <GradientText as="h2" className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Void Bubbles — Live Ecosystem Visualization
            </GradientText>
            <p className="text-text-secondary text-sm sm:text-base mt-3 max-w-2xl mx-auto">
              See everything. Watch every NEAR token breathe in real-time — AI health scores, whale alerts, rug detection, and sonic feedback in one mesmerizing bubble map.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            {[
              { emoji: '🟢🔴', label: 'Real-Time Performance' },
              { emoji: '🧠', label: 'AI Health Scores' },
              { emoji: '🐋', label: 'Whale Alert Feed' },
              { emoji: '🔊', label: 'Sonic Market Feedback' },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 sm:p-4 bg-surface/50 rounded-lg border border-border">
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{item.emoji}</div>
                <p className="text-xs font-mono text-text-secondary">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/void-bubbles"
              className="shimmer-btn text-background font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg text-sm sm:text-base inline-flex items-center gap-2 mb-3 active:scale-[0.98] hover:scale-[1.02] transition-transform duration-200 min-h-[44px]"
            >
              Launch Void Bubbles →
            </Link>
            <p className="text-xs text-text-muted font-mono">
              Updated every 60 seconds · 150+ NEAR tokens · Free forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
