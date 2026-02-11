import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { Card } from '@/components/ui/Card';

interface Resource {
  name: string;
  url: string;
  description: string;
}

const officialResources: Resource[] = [
  {
    name: 'NEAR Documentation',
    url: 'https://docs.near.org',
    description: 'Complete developer documentation',
  },
  {
    name: 'NEAR Dev Portal',
    url: 'https://dev.near.org',
    description: 'Tutorials and getting started guides',
  },
  {
    name: 'NEAR Examples',
    url: 'https://examples.near.org',
    description: 'Code examples and starter templates',
  },
  {
    name: 'NEAR GitHub',
    url: 'https://github.com/near',
    description: 'Open source repositories',
  },
];

const rustResources: Resource[] = [
  {
    name: 'The Rust Book',
    url: 'https://doc.rust-lang.org/book',
    description: 'The official Rust tutorial, free online',
  },
  {
    name: 'Rust by Example',
    url: 'https://doc.rust-lang.org/rust-by-example',
    description: 'Learn Rust through annotated examples',
  },
  {
    name: 'Rustlings',
    url: 'https://github.com/rust-lang/rustlings',
    description: 'Small exercises to learn Rust',
  },
  {
    name: 'NEAR SDK Docs',
    url: 'https://docs.near.org/sdk/rust',
    description: 'NEAR-specific Rust SDK documentation',
  },
];

const communityResources: Resource[] = [
  {
    name: 'NEAR Grants',
    url: 'https://near.org/ecosystem/grants',
    description: 'Apply for builder grants',
  },
  {
    name: 'NEAR Ecosystem',
    url: 'https://near.org/ecosystem',
    description: 'Explore live projects',
  },
  {
    name: 'NEAR Forum',
    url: 'https://gov.near.org',
    description: 'Governance discussions and proposals',
  },
  {
    name: 'NearBlocks',
    url: 'https://nearblocks.io',
    description: 'Block explorer and chain metrics',
  },
];

const dataSources = [
  'NearBlocks',
  'DeFiLlama',
  'GitHub',
  'FastNEAR',
  'Pikespeak',
  'Ecosystem',
];

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link href={resource.url} target="_blank">
      <Card 
        variant="default" 
        padding="md" 
        hover 
        className="h-full group"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-text-primary mb-1 group-hover:text-near-green transition-colors">
              {resource.name}
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              {resource.description}
            </p>
            <p className="text-xs text-text-muted font-mono mt-2 truncate">
              {resource.url.replace(/^https?:\/\//, '')}
            </p>
          </div>
          <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-near-green transition-colors flex-shrink-0 mt-1" />
        </div>
      </Card>
    </Link>
  );
}

export function ResourceHub() {
  const totalCount = officialResources.length + rustResources.length + communityResources.length;

  return (
    <section id="resources" className="py-12">
      <SectionHeader 
        title="Resources & Links" 
        badge="CURATED" 
        count={totalCount}
      />

      <div className="space-y-10 mt-8">
        {/* Official NEAR */}
        <div>
          <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-text-muted mb-4">
            Official NEAR
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officialResources.map((resource) => (
              <ResourceCard key={resource.url} resource={resource} />
            ))}
          </div>
        </div>

        {/* Learning Rust */}
        <div>
          <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-text-muted mb-4">
            Learning Rust
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rustResources.map((resource) => (
              <ResourceCard key={resource.url} resource={resource} />
            ))}
          </div>
        </div>

        {/* Funding & Community */}
        <div>
          <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-text-muted mb-4">
            Funding & Community
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityResources.map((resource) => (
              <ResourceCard key={resource.url} resource={resource} />
            ))}
          </div>
        </div>
      </div>

      {/* Data Sources Footer */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs text-text-muted font-mono">
            Powered by Real Ecosystem Data:
          </span>
          {dataSources.map((source, index) => (
            <span key={source} className="flex items-center gap-3">
              <span className="text-xs font-mono text-text-secondary">
                {source}
              </span>
              {index < dataSources.length - 1 && (
                <span className="text-text-muted">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
