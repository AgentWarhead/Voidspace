import Link from 'next/link';
// @ts-ignore
import { ChevronRight, Zap, Network, Circle } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';

const tools = [
  {
    href: '/void-bubbles',
    title: 'Void Bubbles',
    desc: 'Live visualization of 150+ NEAR tokens. Real-time prices, volume, and market movements.',
    icon: Circle,
    tags: ['Live Data', 'Token Prices', 'Volume', 'Market Overview'],
    badge: 'FREE',
    borderClass: 'border-cyan-500/15 hover:border-cyan-500/40',
    hoverBgClass: 'group-hover:from-cyan-500/5 group-hover:to-cyan-500/5',
    iconBgClass: 'bg-cyan-500/10 border-cyan-500/20',
    iconTextClass: 'text-cyan-400',
    chevronHoverClass: 'group-hover:text-cyan-400',
    tagClass: 'bg-cyan-500/10 text-cyan-400/70 border-cyan-500/10',
  },
  {
    href: '/observatory?tool=constellation',
    title: 'Constellation Map',
    desc: 'See the patterns others miss. Map wallet relationships and transaction flows across NEAR.',
    icon: Network,
    tags: ['Wallet Graph', 'Relationships', 'Patterns', 'Network'],
    badge: null,
    borderClass: 'border-purple-500/15 hover:border-purple-500/40',
    hoverBgClass: 'group-hover:from-purple-500/5 group-hover:to-purple-500/5',
    iconBgClass: 'bg-purple-500/10 border-purple-500/20',
    iconTextClass: 'text-purple-400',
    chevronHoverClass: 'group-hover:text-purple-400',
    tagClass: 'bg-purple-500/10 text-purple-400/70 border-purple-500/10',
  },
  {
    href: '/observatory?tool=void-lens',
    title: 'Void Lens',
    desc: 'Every wallet tells a story. AI-powered analysis in 60 seconds — reputation, holdings, security.',
    icon: Zap,
    tags: ['60s Analysis', 'AI Summary', 'Opportunity Score', 'Free Forever'],
    badge: 'FREE',
    borderClass: 'border-blue-500/15 hover:border-blue-500/40',
    hoverBgClass: 'group-hover:from-blue-500/5 group-hover:to-blue-500/5',
    iconBgClass: 'bg-blue-500/10 border-blue-500/20',
    iconTextClass: 'text-blue-400',
    chevronHoverClass: 'group-hover:text-blue-400',
    tagClass: 'bg-blue-500/10 text-blue-400/70 border-blue-500/10',
  },
];

export function IntelligenceToolsSection() {
  return (
    <section>
      <SectionHeader title="Intelligence Tools" badge="YOUR EDGE IN THE ECOSYSTEM" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group active:scale-[0.98] transition-transform">
            <div className={`relative p-4 sm:p-6 rounded-xl border ${tool.borderClass} bg-surface/30 transition-all duration-300 h-full min-h-[44px]`}>
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-transparent ${tool.hoverBgClass} transition-all duration-300`} />
              <div className="relative z-10">
                <div className="flex items-start sm:items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${tool.iconBgClass} border shrink-0`}>
                    {tool.icon && <tool.icon className={`w-5 h-5 ${tool.iconTextClass}`} />}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">{tool.title}</h3>
                    {tool.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-near-green/10 text-near-green border border-near-green/20">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <ChevronRight className={`w-4 h-4 text-text-muted shrink-0 ${tool.chevronHoverClass} group-hover:translate-x-1 transition-all`} />
                </div>
                <p className="text-sm text-text-secondary">{tool.desc}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tool.tags.map((tag) => (
                    <span key={tag} className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${tool.tagClass} border`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
