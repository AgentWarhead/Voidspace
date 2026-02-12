import { TrendingUp, Brain, Briefcase, Heart, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';

const RUST_VS_SOLIDITY = [
  { feature: 'Memory Safety', rust: 'Compile-time guarantees', solidity: 'Runtime errors', winner: 'rust' },
  { feature: 'Performance', rust: 'WASM — near-native speed', solidity: 'EVM interpreted', winner: 'rust' },
  { feature: 'Error Handling', rust: 'Result/Option — explicit', solidity: 'require() — implicit', winner: 'rust' },
  { feature: 'Job Market', rust: '#1 most loved, growing fast', solidity: 'Crypto-only demand', winner: 'rust' },
  { feature: 'Learning Curve', rust: 'Steeper initially', solidity: 'Easier to start', winner: 'solidity' },
  { feature: 'AI Assistance', rust: 'Excellent — Sanctum guides you', solidity: 'Good', winner: 'rust' },
];

const SELLING_POINTS = [
  {
    icon: Heart,
    title: 'Most Loved Language — 8 Years Running',
    description: 'Stack Overflow\'s annual survey ranks Rust #1 most loved language since 2016. Developers who learn it don\'t go back.',
    stat: '87%',
    statLabel: 'developer satisfaction',
    color: 'text-rose-400 bg-rose-500/10',
  },
  {
    icon: Briefcase,
    title: 'Employable Everywhere',
    description: 'Rust isn\'t just crypto. It\'s used by AWS, Google, Microsoft, Discord, Cloudflare, Figma. Learning Rust opens doors far beyond blockchain.',
    stat: '$120K+',
    statLabel: 'median Rust salary',
    color: 'text-green-400 bg-green-500/10',
  },
  {
    icon: Brain,
    title: 'AI Makes Rust 10x Easier',
    description: 'The hardest part of Rust (the borrow checker) is exactly what AI is best at explaining. The Sanctum AI debugs ownership errors in plain English.',
    stat: '10x',
    statLabel: 'faster with AI guidance',
    color: 'text-purple-400 bg-purple-500/10',
  },
  {
    icon: TrendingUp,
    title: 'The Future is WASM',
    description: 'WebAssembly is the next runtime standard — and Rust is the #1 WASM language. Every Rust contract you write is a WASM skill you\'re building.',
    stat: '#1',
    statLabel: 'WASM language',
    color: 'text-cyan-400 bg-cyan-500/10',
  },
];

export function WhyRust() {
  return (
    <ScrollReveal>
      <div id="why-rust">
        <SectionHeader title="Why Rust?" badge="THE LANGUAGE OF NEAR" />
        <p className="text-text-secondary mb-8 max-w-2xl">
          Most people haven&apos;t chosen Rust yet. Here&apos;s why you should — and why it&apos;s not
          as scary as you think.
        </p>

        {/* Selling Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {SELLING_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <GlowCard key={point.title} padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${point.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary text-sm mb-1">{point.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed mb-3">{point.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-near-green">{point.stat}</span>
                      <span className="text-[11px] text-text-muted">{point.statLabel}</span>
                    </div>
                  </div>
                </div>
              </GlowCard>
            );
          })}
        </div>

        {/* Rust vs Solidity Comparison */}
        <h3 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4">Rust vs Solidity — Side by Side</h3>
        <Card variant="glass" padding="md" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-xs font-mono text-text-muted uppercase tracking-wider">Feature</th>
                  <th className="text-left py-3 px-4 text-xs font-mono text-near-green uppercase tracking-wider">🦀 Rust</th>
                  <th className="text-left py-3 px-4 text-xs font-mono text-text-muted uppercase tracking-wider">Solidity</th>
                </tr>
              </thead>
              <tbody>
                {RUST_VS_SOLIDITY.map((row) => (
                  <tr key={row.feature} className="border-b border-border/20 last:border-0">
                    <td className="py-3 px-4 font-medium text-text-primary text-xs">{row.feature}</td>
                    <td className={`py-3 px-4 text-xs ${row.winner === 'rust' ? 'text-near-green font-medium' : 'text-text-secondary'}`}>
                      {row.winner === 'rust' && '✓ '}{row.rust}
                    </td>
                    <td className={`py-3 px-4 text-xs ${row.winner === 'solidity' ? 'text-amber-400 font-medium' : 'text-text-muted'}`}>
                      {row.winner === 'solidity' && '✓ '}{row.solidity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-near-green/5 border border-near-green/10">
            <p className="text-xs text-text-secondary">
              <Sparkles className="w-3 h-3 inline text-near-green mr-1" />
              <strong className="text-text-primary">Bottom line:</strong> Rust is harder to start but impossible to outgrow.
              The Sanctum AI eliminates the learning curve. You get Rust&apos;s power without the pain.
            </p>
          </div>
        </Card>
      </div>
    </ScrollReveal>
  );
}
