'use client';

import { Sparkles, Target, Lightbulb, ArrowRight, BarChart3, Cpu, Shield, Coins, Calendar, Rocket, Lock } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { CustomBriefForm } from './CustomBriefForm';

export function BuildPlansSection() {
  return (
    <div>
      <ScrollReveal>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-text-primary">
            Get Your <span className="text-near-green">Build Plan</span>
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Every build plan includes market analysis, tech architecture, NEAR strategy, monetization, and a week-by-week roadmap.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <ScrollReveal delay={0.1}>
          <a href="#voids-list" className="block h-full group">
            <div className="h-full p-6 rounded-xl border border-near-green/20 bg-near-green/5 hover:border-near-green/40 hover:bg-near-green/10 transition-all">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-near-green/10 border border-near-green/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-near-green" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Explore Voids</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Browse AI-detected gaps in the NEAR ecosystem and generate a build plan for any void.
                </p>
                <span className="inline-flex items-center gap-1 text-near-green text-sm font-medium mt-1 group-hover:gap-2 transition-all">
                  Browse Below <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <a href="#custom-brief" className="block h-full group">
            <div className="h-full p-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Bring Your Own Idea</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Describe your project idea and get a full blueprint — market analysis, architecture, and roadmap.
                </p>
                <span className="inline-flex items-center gap-1 text-cyan-400 text-sm font-medium mt-1 group-hover:gap-2 transition-all">
                  Describe Below <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </a>
        </ScrollReveal>
      </div>

      {/* Custom Brief Form */}
      <ScrollReveal delay={0.25}>
        <div className="max-w-3xl mx-auto mt-6">
          <CustomBriefForm />
        </div>
      </ScrollReveal>

      {/* What's in a Build Plan — 6 section preview */}
      <ScrollReveal delay={0.3}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6">
          {[
            { icon: BarChart3, title: 'Market Analysis', color: 'text-near-green' },
            { icon: Cpu, title: 'Tech Architecture', color: 'text-cyan-400' },
            { icon: Shield, title: 'NEAR Strategy', color: 'text-near-green' },
            { icon: Coins, title: 'Monetization', color: 'text-cyan-400' },
            { icon: Calendar, title: 'Week 1 Plan', color: 'text-near-green' },
            { icon: Rocket, title: 'Growth Roadmap', color: 'text-cyan-400' },
          ].map((section) => (
            <div key={section.title} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface/50">
              <section.icon className={`w-4 h-4 ${section.color} shrink-0`} />
              <span className="text-xs text-text-secondary">{section.title}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-text-muted text-xs">
          <Lock className="w-3 h-3" />
          Full build plans require Sanctum credits
        </div>
      </ScrollReveal>
    </div>
  );
}
