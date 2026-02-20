'use client';

import { BarChart3, Cpu, Shield, Coins, Calendar, Rocket, Lock, Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { CustomBriefForm } from './CustomBriefForm';
import Link from 'next/link';

const BUILD_PLAN_SECTIONS = [
  {
    icon: BarChart3,
    title: 'Market Analysis',
    desc: 'Competitive landscape, market size, and timing signals for your niche',
    color: 'text-near-green',
    border: 'border-near-green/20',
    bg: 'bg-near-green/[0.04]',
  },
  {
    icon: Cpu,
    title: 'Tech Architecture',
    desc: 'Smart contract design, stack recommendations, and NEAR-native integrations',
    color: 'text-cyan-400',
    border: 'border-cyan-400/20',
    bg: 'bg-cyan-400/[0.04]',
  },
  {
    icon: Shield,
    title: 'NEAR Strategy',
    desc: 'Ecosystem positioning, protocol alignment, and grant/funding pathways',
    color: 'text-near-green',
    border: 'border-near-green/20',
    bg: 'bg-near-green/[0.04]',
  },
  {
    icon: Coins,
    title: 'Monetization',
    desc: 'Token model, revenue streams, and pricing strategy for your target users',
    color: 'text-amber-400',
    border: 'border-amber-400/20',
    bg: 'bg-amber-400/[0.04]',
  },
  {
    icon: Calendar,
    title: 'Week 1 Plan',
    desc: 'Concrete first-week milestones — what to build, ship, and validate immediately',
    color: 'text-violet-400',
    border: 'border-violet-400/20',
    bg: 'bg-violet-400/[0.04]',
  },
  {
    icon: Rocket,
    title: 'Growth Roadmap',
    desc: 'Launch sequence, community strategy, and 90-day growth playbook',
    color: 'text-cyan-400',
    border: 'border-cyan-400/20',
    bg: 'bg-cyan-400/[0.04]',
  },
];

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
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 mb-4">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Custom Build Plan</span>
          </div>
          <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Your Idea. Fully Planned.
          </GradientText>
          <p className="text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Submit any project concept and receive a complete AI-generated blueprint across{' '}
            <span className="text-text-primary font-semibold">6 critical areas</span> — from market fit to
            your first week of code. Built specifically for the NEAR ecosystem.
          </p>

          {/* Paywall callout — prominent, not a footnote */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-near-green/25 bg-near-green/[0.06]">
            <Lock className="w-3.5 h-3.5 text-near-green/70" />
            <span className="text-xs text-text-secondary">
              Preview free with wallet connect ·{' '}
              <Link href="/pricing" className="text-near-green font-semibold hover:underline">
                Sanctum credits
              </Link>{' '}
              unlock the full 12-section plan
            </span>
            <ArrowRight className="w-3 h-3 text-near-green/50" />
          </div>
        </div>
      </ScrollReveal>

      {/* What's included — 6 section cards with descriptions */}
      <ScrollReveal delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto mb-8">
          {BUILD_PLAN_SECTIONS.map((section) => (
            <div
              key={section.title}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${section.border} ${section.bg} transition-colors`}
            >
              <section.icon className={`w-4 h-4 ${section.color} shrink-0 mt-0.5`} />
              <div className="min-w-0">
                <div className={`text-xs font-semibold ${section.color} mb-0.5`}>{section.title}</div>
                <div className="text-[11px] text-text-muted leading-snug">{section.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Custom Brief Form */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-3xl mx-auto">
          <CustomBriefForm />
        </div>
      </ScrollReveal>
    </div>
  );
}
