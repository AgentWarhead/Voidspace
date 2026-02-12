import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ChevronRight, Telescope, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';

const tools = [
  {
    href: '/observatory',
    title: 'Observatory',
    desc: 'Deep-dive any NEAR project. Health scores, team analysis, contract audits.',
    icon: Telescope,
    color: 'cyan',
    tags: ['Health Score', 'Team Intel', 'Contract Audit', 'Risk Analysis'],
    badge: null,
  },
  {
    href: '/pulse-streams',
    title: 'Pulse Streams',
    desc: 'Real-time NEAR ecosystem activity. Track transactions, contracts, and network health live.',
    icon: null,
    color: 'emerald',
    tags: ['Live Feed', 'Transactions', 'Network Health', 'Real-Time'],
    badge: null,
  },
  {
    href: '/void-lens',
    title: 'Void Lens',
    desc: 'AI-powered project analysis in 60 seconds. Instant insights, zero cost.',
    icon: Zap,
    color: 'blue',
    tags: ['60s Analysis', 'AI Summary', 'Opportunity Score', 'Free Forever'],
    badge: 'FREE',
  },
];

export function IntelligenceToolsSection() {
  return (
    <section>
      <SectionHeader title="Intelligence Tools" badge="DEEP ANALYSIS" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <div className={`relative p-6 rounded-xl border border-${tool.color}-500/15 bg-surface/30 hover:border-${tool.color}-500/40 transition-all duration-300 h-full`}>
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-${tool.color}-500/0 to-${tool.color}-500/0 group-hover:from-${tool.color}-500/5 group-hover:to-${tool.color}-500/5 transition-all duration-300`} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-${tool.color}-500/10 border border-${tool.color}-500/20`}>
                    {tool.title === 'Pulse Streams' ? (
                      <svg className={`w-5 h-5 text-${tool.color}-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                    ) : tool.icon ? (
                      <tool.icon className={`w-5 h-5 text-${tool.color}-400`} />
                    ) : null}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">{tool.title}</h3>
                  {tool.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-near-green/10 text-near-green border border-near-green/20">
                      {tool.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 text-text-muted ml-auto group-hover:text-${tool.color}-400 group-hover:translate-x-1 transition-all`} />
                </div>
                <p className="text-sm text-text-secondary">{tool.desc}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tool.tags.map((tag) => (
                    <span key={tag} className={`text-[10px] font-mono px-2 py-0.5 rounded-full bg-${tool.color}-500/10 text-${tool.color}-400/70 border border-${tool.color}-500/10`}>
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
