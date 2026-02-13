import Link from 'next/link';
import { ChevronRight, Search, Target, FileText, BarChart3, Code2, CalendarCheck, Lightbulb } from 'lucide-react';
import { GradientText } from '@/components/effects/GradientText';

const features = [
  { icon: BarChart3, label: 'Market Analysis', desc: 'Competition & opportunity sizing' },
  { icon: Code2, label: 'Tech Architecture', desc: 'Stack, contracts & integrations' },
  { icon: FileText, label: 'NEAR Strategy', desc: 'Protocol fit & grant alignment' },
  { icon: CalendarCheck, label: 'Week 1 Plan', desc: 'Day-by-day action steps' },
];

export function BuildPlansSection() {
  return (
    <section>
      <div className="relative overflow-hidden rounded-2xl border border-near-green/20">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,236,151,0.1) 0%, rgba(0,212,255,0.06) 40%, transparent 80%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-near-green/5 to-accent-cyan/3" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,236,151,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,236,151,0.2) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-near-green text-xs font-mono mb-4">
              <Target className="w-3 h-3" />
              AI-POWERED MISSION BRIEFS
            </div>
            <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
              Found Your Void? Plan Your Attack.
            </GradientText>
            <p className="text-text-secondary text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              Get your AI-powered Build Plan — market analysis, tech specs, NEAR integration strategy, and your first week&apos;s action plan. In 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-3xl mx-auto">
            {features.map((item) => (
              <div key={item.label} className="group p-3 rounded-lg bg-surface/60 border border-border hover:border-near-green/30 transition-all text-center">
                <div className="w-8 h-8 rounded-lg bg-near-green/10 border border-near-green/15 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-4 h-4 text-near-green" />
                </div>
                <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link
              href="/opportunities"
              className="group relative p-5 rounded-xl bg-surface/60 border border-near-green/20 hover:border-near-green/50 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-near-green/10 border border-near-green/15 flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-near-green" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1.5">Explore Voids</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Browse AI-detected gaps in the NEAR ecosystem and generate a build plan for any of them
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-near-green mt-3">
                Browse Opportunities <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/opportunities#custom-brief"
              className="group relative p-5 rounded-xl bg-surface/60 border border-accent-cyan/20 hover:border-accent-cyan/50 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/15 flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-5 h-5 text-accent-cyan" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1.5">Bring Your Own Idea</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Have your own project idea? Describe it and get a full AI-powered build plan
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan mt-3">
                Start Building <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          <p className="text-xs text-text-muted font-mono text-center mt-4">
            Powered by Claude AI · Full strategic brief in 60s
          </p>
        </div>
      </div>
    </section>
  );
}
