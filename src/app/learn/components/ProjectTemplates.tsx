import Link from 'next/link';
import { Star, Copy, Users, Box } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';

const templates = [
  {
    title: 'Fungible Token (NEP-141)',
    icon: Star,
    description: 'Create your own token with minting, burning, and transfer. The hello-world of NEAR smart contracts.',
    difficulty: 'Beginner',
    time: '~30 min',
    tech: ['Rust', 'near-sdk-rs'],
    href: '/sanctum',
  },
  {
    title: 'NFT Collection (NEP-171)',
    icon: Copy,
    description: 'Launch an NFT collection with metadata, royalties, and marketplace integration.',
    difficulty: 'Intermediate',
    time: '~1 hour',
    tech: ['Rust', 'near-sdk-rs', 'IPFS'],
    href: '/sanctum',
  },
  {
    title: 'Simple DAO',
    icon: Users,
    description: 'Community governance with proposals, voting, and treasury management. Perfect for learning cross-contract calls.',
    difficulty: 'Intermediate',
    time: '~2 hours',
    tech: ['Rust', 'near-sdk-rs'],
    href: '/sanctum',
  },
  {
    title: 'DeFi Vault',
    icon: Box,
    description: 'A yield-bearing vault that accepts deposits, manages funds, and distributes rewards. Real DeFi patterns.',
    difficulty: 'Advanced',
    time: '~3 hours',
    tech: ['Rust', 'near-sdk-rs', 'NEP-141'],
    href: '/sanctum',
  },
];

const difficultyColors = {
  Beginner: 'bg-near-green/10 text-near-green border-near-green/20',
  Intermediate: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
  Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function ProjectTemplates() {
  return (
    <section className="py-20">
      <SectionHeader 
        title="Start Building: Project Templates" 
        badge="QUICK START"
      />
      
      <p className="text-text-secondary text-lg max-w-3xl mx-auto text-center mb-12">
        Don&apos;t start from scratch. Clone a template, customize it, and deploy. Each template includes a walkthrough in the Sanctum.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Link key={template.title} href={template.href}>
              <GlowCard className="h-full group">
                {/* Top accent gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-near-green via-near-green/50 to-transparent" />
                
                <div className="flex flex-col gap-4 pt-2">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-near-green/10 rounded-lg border border-near-green/20">
                      <Icon className="w-5 h-5 text-near-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-near-green transition-colors">
                        {template.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full border font-medium',
                          difficultyColors[template.difficulty as keyof typeof difficultyColors]
                        )}>
                          {template.difficulty}
                        </span>
                        <span className="text-xs text-text-muted">{template.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {template.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {template.tech.map((tech) => (
                      <span 
                        key={tech}
                        className="text-xs font-mono px-2 py-1 bg-background rounded border border-border text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-2 text-sm font-medium text-near-green group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Build in Sanctum
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </GlowCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
