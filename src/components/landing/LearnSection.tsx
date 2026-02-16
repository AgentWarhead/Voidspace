import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { GradientText } from '@/components/effects/GradientText';

const tracks = [
  { emoji: '🧭', title: 'Explorer', modules: 16, desc: 'Wallet setup, key concepts, ecosystem overview', borderClass: 'border-emerald-500/15 hover:border-emerald-500/30', textClass: 'text-emerald-400' },
  { emoji: '🏗️', title: 'Builder', modules: 22, desc: 'Rust fundamentals, smart contracts, testing, deployment', borderClass: 'border-cyan-500/15 hover:border-cyan-500/30', textClass: 'text-cyan-400' },
  { emoji: '⚡', title: 'Hacker', modules: 16, desc: 'Cross-chain patterns, security auditing, DeFi architecture', borderClass: 'border-purple-500/15 hover:border-purple-500/30', textClass: 'text-purple-400' },
  { emoji: '🚀', title: 'Founder', modules: 12, desc: 'Tokenomics, DAO governance, go-to-market strategy', borderClass: 'border-amber-500/15 hover:border-amber-500/30', textClass: 'text-amber-400' },
];

const differentiators = [
  { icon: '🤖', text: 'AI explains every concept' },
  { icon: '🔨', text: 'Build real projects, not toy examples' },
  { icon: '🎯', text: 'Skill constellation tracks progress' },
  { icon: '📜', text: 'Earn completion certificates' },
  { icon: '🌉', text: 'Cross-chain deep dives (Solana, ETH)' },
  { icon: '💰', text: '100% free, forever' },
];

export function LearnSection() {
  return (
    <section>
      <div className="relative overflow-hidden rounded-2xl border border-near-green/20">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 60%, rgba(0,236,151,0.1) 0%, rgba(0,212,255,0.06) 50%, transparent 80%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-near-green/5 to-accent-cyan/3" />

        <div className="relative z-10 p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-near-green text-xs font-mono mb-4">
              <BookOpen className="w-3 h-3" />
              THE MOST COMPREHENSIVE NEAR CURRICULUM — FREE
            </div>
            <GradientText as="h2" className="text-3xl sm:text-4xl font-bold tracking-tight">
              We&apos;ll Teach You Everything
            </GradientText>
            <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              Then help you build it. 66 interactive modules across 4 structured tracks — from your first Rust line to deploying production dApps. Zero to deployed. No permission needed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
            {tracks.map((track) => (
              <div key={track.title} className={`group p-5 bg-surface/50 rounded-xl border ${track.borderClass} transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{track.emoji}</span>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">{track.title} Track</h3>
                    <span className={`text-[10px] font-mono ${track.textClass}`}>{track.modules} modules</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{track.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8 max-w-3xl mx-auto">
            {differentiators.map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-text-secondary">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/learn"
              className="shimmer-btn text-background font-semibold px-8 py-4 rounded-lg text-base inline-flex items-center gap-2 mb-3 hover:scale-[1.02] transition-transform duration-200"
            >
              <BookOpen className="w-4 h-4" />
              Start Your Journey →
            </Link>
            <p className="text-xs text-text-muted font-mono">
              No prerequisites · No paywall · No time limit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
