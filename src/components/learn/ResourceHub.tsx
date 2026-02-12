import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';

const RESOURCES = [
  { title: 'NEAR Documentation', url: 'https://docs.near.org', description: 'Official developer docs' },
  { title: 'NEAR Dev Portal', url: 'https://dev.near.org', description: 'Tutorials and guides' },
  { title: 'NEAR Examples', url: 'https://examples.near.org', description: 'Code examples and templates' },
  { title: 'NEAR GitHub', url: 'https://github.com/near', description: 'Open source repositories' },
  { title: 'NEAR Grants', url: 'https://near.org/ecosystem/grants', description: 'Funding for builders' },
  { title: 'NEAR Ecosystem', url: 'https://near.org/ecosystem', description: 'Explore the ecosystem' },
];

const DATA_SOURCES = [
  { name: 'NearBlocks', desc: 'Chain metrics' },
  { name: 'DeFiLlama', desc: 'TVL & DeFi' },
  { name: 'GitHub', desc: 'Developer activity' },
  { name: 'FastNEAR', desc: 'On-chain data' },
  { name: 'Pikespeak', desc: 'Wallet analytics' },
  { name: 'Ecosystem', desc: 'Project registry' },
];

export function ResourceHub() {
  return (
    <>
      {/* Resources */}
      <ScrollReveal>
        <SectionHeader title="Resources" count={RESOURCES.length} badge="LINKS" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RESOURCES.map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card hover padding="md" className="h-full">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-text-primary group-hover:text-near-green transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">{resource.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-near-green transition-colors shrink-0 mt-0.5" />
                </div>
              </Card>
            </a>
          ))}
        </div>
      </ScrollReveal>

      {/* Data Sources */}
      <ScrollReveal>
        <div className="mt-8 p-4 rounded-xl bg-near-green/5 border border-near-green/10">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3 font-mono text-center">Powered by Real Ecosystem Data</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {DATA_SOURCES.map((source) => (
              <div key={source.name} className="text-center p-2 rounded-lg bg-near-green/5 border border-near-green/10">
                <p className="text-xs font-mono text-near-green/70">{source.name}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Bottom CTA */}
      <ScrollReveal>
        <Card variant="glass" padding="lg" className="text-center">
          <GradientText as="h3" className="text-xl font-bold mb-2">
            Ready to Build?
          </GradientText>
          <p className="text-text-secondary mb-4 max-w-md mx-auto">
            Find your void, build with AI in the Sanctum, and analyze the ecosystem in the Observatory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-near-green text-background font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Explore Voids
            </Link>
            <Link
              href="/sanctum"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm"
            >
              Enter Sanctum
            </Link>
            <Link
              href="/observatory"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-border-hover text-text-secondary rounded-lg transition-colors text-sm"
            >
              Observatory
            </Link>
          </div>
        </Card>
      </ScrollReveal>
    </>
  );
}
