'use client';

import Link from 'next/link';
import {
  Target,
  Lightbulb,
  BarChart3,
  Cpu,
  Coins,
  Calendar,
  Shield,
  Rocket,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GridPattern } from '@/components/effects/GridPattern';

// Note: metadata must be in a separate server component or layout for client components.
// We'll rely on the layout or a generateMetadata in a wrapper if needed.

const PLAN_SECTIONS = [
  {
    icon: BarChart3,
    title: 'Market Analysis',
    description: 'Competitive landscape, target users, and market sizing within the NEAR ecosystem',
    color: 'text-near-green',
  },
  {
    icon: Cpu,
    title: 'Technical Architecture',
    description: 'Smart contract design, frontend stack, and infrastructure recommendations',
    color: 'text-cyan-400',
  },
  {
    icon: Shield,
    title: 'NEAR Strategy',
    description: 'Protocol-specific advantages, integration points, and ecosystem positioning',
    color: 'text-near-green',
  },
  {
    icon: Coins,
    title: 'Monetization Model',
    description: 'Revenue streams, token economics, and sustainable business model design',
    color: 'text-cyan-400',
  },
  {
    icon: Calendar,
    title: 'Week 1 Action Plan',
    description: 'Day-by-day breakdown to go from idea to working prototype in 7 days',
    color: 'text-near-green',
  },
  {
    icon: Rocket,
    title: 'Growth Roadmap',
    description: '30/60/90 day milestones, user acquisition strategy, and launch checklist',
    color: 'text-cyan-400',
  },
];

export default function BuildPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <GridPattern className="opacity-30" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/30 bg-near-green/5 text-near-green text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Blueprints
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                Mission Briefs —{' '}
                <GradientText as="span">Build Plans</GradientText>
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Choose a NEAR project and we&apos;ll generate your blueprint. Or bring your own idea.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Two Paths Section */}
      <section className="relative pb-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ScrollReveal delay={0.1}>
              <Link href="/opportunities" className="block h-full">
                <GlowCard padding="lg" className="h-full">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-near-green/10 border border-near-green/20 flex items-center justify-center">
                      <Target className="w-7 h-7 text-near-green" />
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary">
                      Explore Voids
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Browse AI-detected gaps in the NEAR ecosystem and get a build plan for any void.
                    </p>
                    <span className="inline-flex items-center gap-1 text-near-green text-sm font-medium mt-2">
                      Browse Voids <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </GlowCard>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Link href="/sanctum?mode=brief" className="block h-full">
                <GlowCard padding="lg" className="h-full">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                      <Lightbulb className="w-7 h-7 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary">
                      Bring Your Own Idea
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Describe your project idea and get a full blueprint — market analysis, architecture, and roadmap.
                    </p>
                    <span className="inline-flex items-center gap-1 text-cyan-400 text-sm font-medium mt-2">
                      Start in Sanctum <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </GlowCard>
              </Link>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* What's Inside a Build Plan */}
      <section className="relative py-20 border-t border-border">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-12">
              <SectionHeader title="What&apos;s Inside a Build Plan" className="justify-center" />
              <p className="text-text-secondary mt-2 max-w-xl mx-auto">
                Every build plan is a comprehensive blueprint tailored to the NEAR ecosystem.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PLAN_SECTIONS.map((section, i) => (
              <ScrollReveal key={section.title} delay={i * 0.08}>
                <GlowCard padding="md" className="h-full">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${section.color}`}>
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary mb-1">
                        {section.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.5}>
            <div className="flex items-center justify-center gap-2 mt-8 text-text-muted text-sm">
              <Lock className="w-4 h-4" />
              Full build plans require Sanctum credits
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Conversion CTA */}
      <section className="relative py-20 border-t border-border">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                Unlock Full{' '}
                <GradientText as="span">Build Plans</GradientText>
              </h2>
              <p className="text-text-secondary mb-8">
                Get unlimited access to AI-powered project blueprints with Sanctum credits. From market analysis to week-by-week roadmaps.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-near-green text-background font-semibold rounded-lg hover:bg-near-green/90 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                View Pricing
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </main>
  );
}
