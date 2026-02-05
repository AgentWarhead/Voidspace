import { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Zap, Code2, Users, Brain, Link2, Shield, BookOpen, BarChart3, Target, Swords, Sparkles, Terminal, Cpu, Lock, Rocket } from 'lucide-react';
import { Container, Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { GlowCard } from '@/components/effects/GlowCard';

export const metadata: Metadata = {
  title: 'Learn — Voidspace',
  description: 'Learn about NEAR Protocol, its technology, and how Voidspace uses AI to help you find and build your next project.',
};

const NEAR_FEATURES = [
  {
    icon: Zap,
    title: 'Performance',
    description: 'Sub-second finality with Nightshade sharding. NEAR processes thousands of transactions per second with negligible fees, making it practical for consumer-scale applications.',
  },
  {
    icon: Code2,
    title: 'Developer Experience',
    description: 'Build with JavaScript or Rust. Human-readable account names (alice.near), familiar development patterns, and comprehensive SDKs make NEAR one of the most accessible L1s for developers.',
  },
  {
    icon: Users,
    title: 'Ecosystem Support',
    description: 'Active grants program, regular hackathons, and a growing community of builders. The NEAR Foundation actively supports projects aligned with its strategic roadmap.',
  },
];

const RUST_BENEFITS = [
  {
    icon: Cpu,
    title: 'Performance',
    description: 'Rust compiles to WebAssembly (WASM) with near-native performance. Your contracts execute faster and cost less gas than interpreted languages.',
  },
  {
    icon: Lock,
    title: 'Memory Safety',
    description: 'Rust\'s ownership model eliminates entire classes of bugs at compile time — no null pointers, no buffer overflows, no data races. Critical for code that handles real money.',
  },
  {
    icon: Terminal,
    title: 'Great Tooling',
    description: 'Cargo package manager, excellent error messages, built-in testing, and the near-sdk-rs makes NEAR-specific patterns easy. The compiler is your pair programmer.',
  },
];

const RUST_CONCEPTS = [
  {
    title: 'Ownership & Borrowing',
    code: `// Each value has exactly one owner
let wallet = String::from("alice.near");
let borrowed = &wallet;  // Borrow, don't move
// wallet is still valid here`,
    description: 'Rust\'s core innovation. Values have one owner; others can borrow references. This prevents memory bugs without garbage collection.',
  },
  {
    title: 'Structs & Impl',
    code: `#[near(contract_state)]
pub struct TokenVault {
    owner: AccountId,
    balance: Balance,
}

#[near]
impl TokenVault {
    pub fn deposit(&mut self) { ... }
}`,
    description: 'Define data structures with struct, add methods with impl. The #[near] macros handle serialization and contract boilerplate.',
  },
  {
    title: 'Result & Option',
    code: `// No null! Use Option for "maybe" values
fn find_user(id: &str) -> Option<User> {
    users.get(id)  // Returns Some(user) or None
}

// Handle errors explicitly
fn transfer() -> Result<(), Error> {
    // Must handle success AND failure
}`,
    description: 'Rust forces you to handle edge cases. Option for nullable values, Result for operations that can fail. No surprise crashes.',
  },
];

const KEY_TECHNOLOGIES = [
  {
    icon: Brain,
    title: 'Shade Agents',
    badge: 'AI',
    description: 'Autonomous AI agents that run in Trusted Execution Environments (TEEs). Shade Agents can hold private keys, manage funds, and execute complex strategies — all verifiably and trustlessly on-chain.',
    useCases: ['Autonomous trading bots', 'AI-powered portfolio management', 'Automated DAO operations', 'Intelligent DeFi yield optimization'],
    voidLink: '/opportunities?category=ai-agents',
    voidLabel: 'See AI & Agents voids',
  },
  {
    icon: Link2,
    title: 'Intents & Chain Abstraction',
    badge: 'UX',
    description: 'Users declare what they want to achieve ("swap 10 NEAR for USDC at the best rate") and a network of solvers competes to fulfill the intent optimally. No manual bridging, no chain switching — one account works everywhere.',
    useCases: ['Cross-chain swaps without bridges', 'Unified portfolio across chains', 'Gas-free user experiences', 'Seamless multi-chain dApp interactions'],
    voidLink: '/opportunities?category=intents',
    voidLabel: 'See Intents voids',
  },
  {
    icon: Shield,
    title: 'Chain Signatures',
    badge: 'CRYPTO',
    description: 'A multi-party computation (MPC) scheme that enables a single NEAR account to sign transactions on any blockchain — Ethereum, Bitcoin, Cosmos, and more. The cryptographic foundation for true chain abstraction.',
    useCases: ['Control Bitcoin from a NEAR account', 'Sign Ethereum transactions from NEAR', 'Build cross-chain dApps natively', 'Unified identity across all chains'],
    voidLink: '/opportunities?category=wallets',
    voidLabel: 'See Wallets & Identity voids',
  },
];

const VOIDSPACE_METRICS = [
  {
    icon: Target,
    title: 'Void Score (0\u2013100)',
    description: 'Measures how deep the void is in a category. Calculated from: capital demand (TVL flow), active project count (how many builders are present), and NEAR priorities. Higher score = deeper void = bigger opportunity.',
  },
  {
    icon: Swords,
    title: 'Void Status',
    description: '\u201COpen Void\u201D means 0\u20132 existing projects (massive opportunity). \u201CClosing\u201D means 3\u201310 builders are moving in. \u201CFilled\u201D means 10+ established players. Open voids with strong signals = best opportunities.',
  },
  {
    icon: BarChart3,
    title: 'NEAR Priority Categories',
    description: 'NEAR Foundation has designated certain categories (AI & Agents, Privacy, Intents, RWA, Data & Analytics) as strategic priorities. These get boosted Void Scores, reflecting extra grants, support, and ecosystem attention.',
  },
];

const RESOURCES = [
  { title: 'NEAR Documentation', url: 'https://docs.near.org', description: 'Official developer docs' },
  { title: 'NEAR Dev Portal', url: 'https://dev.near.org', description: 'Tutorials and guides' },
  { title: 'NEAR Examples', url: 'https://examples.near.org', description: 'Code examples and templates' },
  { title: 'NEAR GitHub', url: 'https://github.com/near', description: 'Open source repositories' },
  { title: 'NEAR Grants', url: 'https://near.org/ecosystem/grants', description: 'Funding for builders' },
  { title: 'NEAR Ecosystem', url: 'https://near.org/ecosystem', description: 'Explore the ecosystem' },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      {/* Page Banner */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.04) 0%, transparent 70%)',
          }}
        />
        <GridPattern className="opacity-20" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)',
          }}
        />
        <Container>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 mb-4">
              <BookOpen className="w-3.5 h-3.5 text-near-green" />
              <span className="text-xs font-mono text-near-green uppercase tracking-wider">Builder Education</span>
            </div>
            <GradientText as="h1" className="text-3xl lg:text-4xl font-bold mb-4">
              Learn NEAR Protocol
            </GradientText>
            <p className="text-text-secondary text-lg">
              Everything you need to understand NEAR, its cutting-edge technology, and how Voidspace helps you find your next build.
            </p>
          </div>
        </Container>
      </section>

      <Container className="pb-20 space-y-16">
        {/* What is NEAR? */}
        <ScrollReveal>
          <SectionHeader title="What is NEAR Protocol?" badge="OVERVIEW" />
          <Card variant="glass" padding="lg">
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                <strong className="text-text-primary">NEAR Protocol</strong> is a high-performance Layer 1 blockchain designed for usability and scalability. Often called &ldquo;The Blockchain for AI,&rdquo; NEAR combines sub-second transaction finality, human-readable account names (like <code className="text-near-green bg-near-green/10 px-1.5 py-0.5 rounded text-sm">alice.near</code>), and innovative sharding technology to deliver an experience that feels more like using a traditional web app than a blockchain.
              </p>
              <p>
                What sets NEAR apart is its focus on <strong className="text-text-primary">chain abstraction</strong> — the idea that users shouldn&apos;t need to think about which blockchain they&apos;re on. With technologies like Intents, Chain Signatures, and Shade Agents, NEAR is building toward a future where one account works seamlessly across every chain.
              </p>
            </div>
          </Card>
        </ScrollReveal>

        {/* Why Build on NEAR? */}
        <ScrollReveal delay={0.05}>
          <SectionHeader title="Why Build on NEAR?" count={3} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NEAR_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <GlowCard key={feature.title} padding="md" className="h-full">
                  <div className="space-y-3">
                    <div className="p-2 rounded-lg bg-near-green/10 w-fit">
                      <Icon className="w-5 h-5 text-near-green" />
                    </div>
                    <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Rust for NEAR */}
        <ScrollReveal delay={0.08}>
          <SectionHeader title="Rust for Smart Contracts" badge="ESSENTIAL" />
          <Card variant="glass" padding="lg" className="mb-6">
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                <strong className="text-text-primary">NEAR smart contracts are written in Rust</strong> — a modern systems language that prioritizes safety without sacrificing performance. If you&apos;re new to Rust, don&apos;t worry: it&apos;s designed to catch bugs at compile time, which means fewer surprises when your contract goes live.
              </p>
              <p>
                The <code className="text-near-green bg-near-green/10 px-1.5 py-0.5 rounded text-sm">near-sdk-rs</code> crate provides everything you need: account management, token handling, cross-contract calls, and storage. Combined with the <Link href="/sanctum" className="text-near-green hover:underline">Sanctum</Link>, you can learn Rust interactively while building real contracts.
              </p>
            </div>
          </Card>

          {/* Why Rust */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {RUST_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <GlowCard key={benefit.title} padding="md" className="h-full">
                  <div className="space-y-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 w-fit">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-text-primary">{benefit.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
                  </div>
                </GlowCard>
              );
            })}
          </div>

          {/* Rust Concepts */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-text-muted uppercase tracking-wider">Key Concepts</h3>
            {RUST_CONCEPTS.map((concept) => (
              <Card key={concept.title} variant="glass" padding="md">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="lg:w-1/2">
                    <h4 className="font-semibold text-text-primary mb-2">{concept.title}</h4>
                    <p className="text-sm text-text-secondary">{concept.description}</p>
                  </div>
                  <div className="lg:w-1/2">
                    <pre className="text-xs bg-void-black/50 border border-border rounded-lg p-3 overflow-x-auto">
                      <code className="text-text-secondary">{concept.code}</code>
                    </pre>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sanctum CTA */}
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-near-green/10 border border-purple-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Rocket className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Learn Rust by Building</h4>
                  <p className="text-sm text-text-secondary">The Sanctum teaches you Rust interactively as you build real contracts with AI.</p>
                </div>
              </div>
              <Link
                href="/sanctum"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Enter the Sanctum &rarr;
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Key Technologies */}
        <ScrollReveal delay={0.1}>
          <SectionHeader title="Key NEAR Technologies" count={3} badge="STRATEGIC" />
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
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-near-green/80 bg-near-green/10 px-2 py-0.5 rounded-full border border-near-green/20">
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
                        {tech.voidLabel} &rarr;
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollReveal>

        {/* How AI Creates Your Void Brief */}
        <ScrollReveal delay={0.12}>
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
                {[
                  { title: 'Problem & Solution', desc: 'What the void is and how to fill it' },
                  { title: 'Why Now', desc: 'Market timing and ecosystem readiness' },
                  { title: 'Tech Stack', desc: 'Frontend, backend, and NEAR-specific requirements' },
                  { title: 'Key Features', desc: 'Prioritized feature list with must-haves' },
                  { title: 'Next Steps', desc: '5 concrete actions for your first week' },
                  { title: 'Funding & Monetization', desc: 'Grants, revenue models, and build complexity' },
                ].map((item) => (
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

        {/* Understanding Voidspace Metrics */}
        <ScrollReveal delay={0.15}>
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

        {/* Resources */}
        <ScrollReveal delay={0.2}>
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

        {/* CTA */}
        <ScrollReveal delay={0.25}>
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
      </Container>
    </div>
  );
}
