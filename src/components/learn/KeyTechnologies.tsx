import Link from 'next/link';
import { Brain, Link2, Shield, Target } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';

const KEY_TECHNOLOGIES = [
  {
    icon: Brain,
    title: 'Shade Agents',
    badge: 'AI',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Autonomous AI agents that run in Trusted Execution Environments (TEEs). Shade Agents can hold private keys, manage funds, and execute complex strategies — all verifiably and trustlessly on-chain.',
    useCases: ['Autonomous trading bots', 'AI-powered portfolio management', 'Automated DAO operations', 'Intelligent DeFi yield optimization'],
    voidLink: '/opportunities?category=ai-agents',
    voidLabel: 'See AI & Agents voids',
  },
  {
    icon: Link2,
    title: 'Intents & Chain Abstraction',
    badge: 'UX',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    description: 'Users declare what they want to achieve ("swap 10 NEAR for USDC at the best rate") and a network of solvers competes to fulfill the intent optimally. No manual bridging, no chain switching — one account works everywhere.',
    useCases: ['Cross-chain swaps without bridges', 'Unified portfolio across chains', 'Gas-free user experiences', 'Seamless multi-chain dApp interactions'],
    voidLink: '/opportunities?category=intents',
    voidLabel: 'See Intents voids',
  },
  {
    icon: Shield,
    title: 'Chain Signatures',
    badge: 'CRYPTO',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'A multi-party computation (MPC) scheme that enables a single NEAR account to sign transactions on any blockchain — Ethereum, Bitcoin, Cosmos, and more. The cryptographic foundation for true chain abstraction.',
    useCases: ['Control Bitcoin from a NEAR account', 'Sign Ethereum transactions from NEAR', 'Build cross-chain dApps natively', 'Unified identity across all chains'],
    voidLink: '/opportunities?category=wallets',
    voidLabel: 'See Wallets & Identity voids',
  },
];

export function KeyTechnologies() {
  return (
    <ScrollReveal>
      <div id="key-tech">
        <SectionHeader title="Key NEAR Technologies" count={3} badge="STRATEGIC" />
        <p className="text-text-secondary mb-6 max-w-2xl">
          These three technologies define NEAR&apos;s competitive edge and represent the biggest opportunity areas for builders.
        </p>
        <div className="space-y-4">
          {KEY_TECHNOLOGIES.map((tech) => {
            const Icon = tech.icon;
            return (
              <Card key={tech.title} variant="glass" padding="lg">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-near-green/10">
                        <Icon className="w-5 h-5 text-near-green" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary">{tech.title}</h3>
                      <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tech.badgeColor}`}>
                        {tech.badge}
                      </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{tech.description}</p>
                  </div>
                  <div className="lg:w-64 shrink-0">
                    <p className="text-xs text-text-muted uppercase tracking-wide font-mono mb-2">Use Cases</p>
                    <ul className="space-y-1.5">
                      {tech.useCases.map((uc) => (
                        <li key={uc} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-near-green mt-1">&#x2022;</span>
                          {uc}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={tech.voidLink}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-near-green hover:text-near-green/80 transition-colors"
                    >
                      <Target className="w-3 h-3" />
                      {tech.voidLabel} →
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ScrollReveal>
  );
}
