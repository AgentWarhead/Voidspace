import { Target, Swords, BarChart3, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';

const VOIDSPACE_METRICS = [
  {
    icon: Target,
    title: 'Void Score (0–100)',
    description: 'Measures how deep the void is in a category. Calculated from: capital demand (TVL flow), active project count (how many builders are present), and NEAR priorities. Higher score = deeper void = bigger opportunity.',
  },
  {
    icon: Swords,
    title: 'Void Status',
    description: '"Open Void" means 0–2 existing projects (massive opportunity). "Closing" means 3–10 builders are moving in. "Filled" means 10+ established players. Open voids with strong signals = best opportunities.',
  },
  {
    icon: BarChart3,
    title: 'NEAR Priority Categories',
    description: 'NEAR Foundation has designated certain categories (AI & Agents, Privacy, Intents, RWA, Data & Analytics) as strategic priorities. These get boosted Void Scores, reflecting extra grants, support, and ecosystem attention.',
  },
];

const BRIEF_SECTIONS = [
  { title: 'Problem & Solution', desc: 'What the void is and how to fill it' },
  { title: 'Why Now', desc: 'Market timing and ecosystem readiness' },
  { title: 'Tech Stack', desc: 'Frontend, backend, and NEAR-specific requirements' },
  { title: 'Key Features', desc: 'Prioritized feature list with must-haves' },
  { title: 'Next Steps', desc: '5 concrete actions for your first week' },
  { title: 'Funding & Monetization', desc: 'Grants, revenue models, and build complexity' },
];

export function VoidspaceMetrics() {
  return (
    <>
      {/* Understanding Voidspace */}
      <ScrollReveal>
        <SectionHeader title="Understanding Voidspace" badge="METRICS" />
        <p className="text-text-secondary mb-4">
          Voidspace analyzes the NEAR ecosystem to find underserved voids where new projects can make the biggest impact. Here&apos;s how to read the data:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VOIDSPACE_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <GlowCard key={metric.title} padding="md" className="h-full">
                <div className="space-y-3">
                  <div className="p-2 rounded-lg bg-near-green/10 w-fit">
                    <Icon className="w-5 h-5 text-near-green" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm">{metric.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{metric.description}</p>
                </div>
              </GlowCard>
            );
          })}
        </div>
      </ScrollReveal>

      {/* AI Void Briefs */}
      <ScrollReveal>
        <SectionHeader title="How AI Creates Your Void Brief" badge="POWERED BY CLAUDE" />
        <Card variant="glass" padding="lg">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-near-green/10 shrink-0">
                <Sparkles className="w-5 h-5 text-near-green" />
              </div>
              <div className="space-y-3 text-text-secondary leading-relaxed">
                <p>
                  Voidspace uses <strong className="text-text-primary">Claude AI by Anthropic</strong> to generate personalized build plans called <strong className="text-text-primary">Void Briefs</strong>. Each brief is tailored to a specific void in the NEAR ecosystem and includes everything you need to start building.
                </p>
                <p>
                  When you request a Void Brief, our system feeds Claude real-time ecosystem data from 6 sources — project registry, DeFiLlama TVL data, GitHub activity, NearBlocks chain metrics, FastNEAR on-chain data, and Pikespeak wallet analytics. This means every brief is grounded in actual ecosystem data, not generic templates.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BRIEF_SECTIONS.map((item) => (
                <div key={item.title} className="p-3 rounded-lg bg-surface-hover">
                  <h4 className="text-sm font-medium text-text-primary">{item.title}</h4>
                  <p className="text-xs text-text-muted mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted font-mono">
              Free tier includes 3 mission briefs per month. Upgrade for more.
            </p>
          </div>
        </Card>
      </ScrollReveal>
    </>
  );
}
