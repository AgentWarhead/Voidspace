'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Brain, 
  Star, 
  Users, 
  Shield, 
  Eye, 
  Activity, 
  Globe, 
  Layers, 
  Box
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';

interface Category {
  name: string;
  icon: React.ElementType;
  description: string;
  slug: string;
  badge?: 'near-priority' | 'high-demand';
  voidScore: number; // 0-100
}

const categories: Category[] = [
  {
    name: 'DeFi & Trading',
    icon: TrendingUp,
    description: 'DEXes, lending, yield — $X in TVL opportunities',
    slug: 'defi-trading',
    badge: 'high-demand',
    voidScore: 75,
  },
  {
    name: 'AI & Agents',
    icon: Brain,
    description: 'Shade Agents, autonomous AI, on-chain intelligence',
    slug: 'ai-agents',
    badge: 'near-priority',
    voidScore: 90,
  },
  {
    name: 'NFTs & Gaming',
    icon: Star,
    description: 'Collections, gaming, metaverse experiences',
    slug: 'nfts-gaming',
    voidScore: 60,
  },
  {
    name: 'DAOs & Governance',
    icon: Users,
    description: 'Community tools, treasury management, voting',
    slug: 'daos-governance',
    voidScore: 55,
  },
  {
    name: 'Privacy & Security',
    icon: Shield,
    description: 'Private transactions, secure computation',
    slug: 'privacy-security',
    badge: 'near-priority',
    voidScore: 85,
  },
  {
    name: 'Wallets & Identity',
    icon: Eye,
    description: 'Account abstraction, social login, identity',
    slug: 'wallets-identity',
    voidScore: 70,
  },
  {
    name: 'Data & Analytics',
    icon: Activity,
    description: 'Indexers, dashboards, chain intelligence',
    slug: 'data-analytics',
    badge: 'near-priority',
    voidScore: 80,
  },
  {
    name: 'Social & Content',
    icon: Globe,
    description: 'Decentralized social, content platforms',
    slug: 'social-content',
    voidScore: 65,
  },
  {
    name: 'Intents & Abstraction',
    icon: Layers,
    description: 'Chain abstraction, cross-chain UX',
    slug: 'intents-abstraction',
    badge: 'near-priority',
    voidScore: 88,
  },
  {
    name: 'Real World Assets',
    icon: Box,
    description: 'Tokenized assets, real estate, commodities',
    slug: 'real-world-assets',
    badge: 'near-priority',
    voidScore: 78,
  },
];

export function EcosystemMap() {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/opportunities?category=${slug}`);
  };

  return (
    <section id="ecosystem-map" className="py-12">
      <SectionHeader title="Where Will You Build?" badge="ECOSYSTEM MAP" />
      
      <p className="text-text-secondary text-base leading-relaxed mt-4 mb-8">
        NEAR&apos;s ecosystem has deep voids waiting to be filled. Find the category that matches your skills and interests.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <GlowCard
              key={category.slug}
              padding="lg"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="p-2.5 rounded-lg bg-near-green/10 border border-near-green/20">
                  <Icon className="w-5 h-5 text-near-green" />
                </div>
                
                {category.badge && (
                  <span
                    className={cn(
                      'text-[9px] font-mono font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ml-auto',
                      category.badge === 'near-priority'
                        ? 'text-near-green bg-near-green/10 border-near-green/30'
                        : 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30'
                    )}
                  >
                    {category.badge === 'near-priority' ? 'NEAR PRIORITY' : 'HIGH DEMAND'}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {category.name}
              </h3>
              
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                {category.description}
              </p>

              {/* Void Score Indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted font-mono">Void Score</span>
                  <span className="text-near-green font-mono font-semibold">{category.voidScore}</span>
                </div>
                <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-near-green to-accent-cyan rounded-full transition-all duration-500"
                    style={{ width: `${category.voidScore}%` }}
                  />
                </div>
              </div>
            </GlowCard>
          );
        })}
      </div>
    </section>
  );
}
