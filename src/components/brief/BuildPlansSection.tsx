'use client';

import { BarChart3, Cpu, Shield, Coins, Calendar, Rocket, Lock, Lightbulb } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { CustomBriefForm } from './CustomBriefForm';

export function BuildPlansSection() {
  return (
    <div id="custom-brief">
      {/* Gradient divider */}
      <div className="relative py-2 mb-8">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-near-green/30 to-transparent" />
        <div className="absolute inset-x-0 top-1/2 translate-y-px h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-sm" />
      </div>

      {/* Section header */}
      <ScrollReveal>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 mb-4">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Custom Build Plan</span>
          </div>
          <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
            Don&apos;t See What You Need?
          </GradientText>
          <p className="text-sm text-text-secondary mt-2 max-w-lg mx-auto">
            Describe your own idea and get a full AI-powered blueprint — market analysis, architecture, NEAR strategy, and a week-by-week roadmap.
          </p>
        </div>
      </ScrollReveal>

      {/* Custom Brief Form */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-3xl mx-auto">
          <CustomBriefForm />
        </div>
      </ScrollReveal>

      {/* What's in a Build Plan — 6 section preview */}
      <ScrollReveal delay={0.2}>
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
