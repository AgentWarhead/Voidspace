import Link from 'next/link';
import { ChevronRight, Telescope, Zap, Network } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';

const tools = [
  {
    href: '/observatory',
    title: 'Observatory',
    desc: 'Deep-dive any NEAR project. Health scores, team analysis, contract audits.',
    icon: Telescope,
    tags: ['Health Score', 'Team Intel', 'Contract Audit', 'Risk Analysis'],
    badge: null,
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
    desc: 'Map wallet relationships and transaction patterns across the NEAR ecosystem.',
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
    desc: 'AI-powered project analysis in 60 seconds. Instant insights, zero cost.',
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
      <SectionHeader title="Intelligence Tools" badge="DEEP ANALYSIS" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <div className={`relative p-6 rounded-xl border ${tool.borderClass} bg-surface/30 transition-all duration-300 h-full`}>
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-transparent ${tool.hoverBgClass} transition-all duration-300`} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${tool.iconBgClass} border`}>
                    {tool.icon && <tool.icon className={`w-5 h-5 ${tool.iconTextClass}`} />}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">{tool.title}</h3>
                  {tool.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-near-green/10 text-near-green border border-near-green/20">
                      {tool.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 text-text-muted ml-auto ${tool.chevronHoverClass} group-hover:translate-x-1 transition-all`} />
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
