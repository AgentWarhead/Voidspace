'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Globe,
  Sparkles,
  KeyRound,
  Brain,
  Layers,
  ChevronRight,
  ArrowRight,
  Code2,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/* ─── Types ────────────────────────────────────────────────── */

interface Technology {
  id: string;
  icon: React.ElementType;
  title: string;
  tagline: string;
  description: string;
  details: string[];
  builderImpact: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  glowColor: string;
  stats: { label: string; value: string }[];
  sanctumLink: string;
  connections: string[]; // ids of related techs
}

/* ─── Data ─────────────────────────────────────────────────── */

const TECHNOLOGIES: Technology[] = [
  {
    id: 'chain-abstraction',
    icon: Globe,
    title: 'Chain Abstraction',
    tagline: 'One account, every chain',
    description:
      "Users don't need to know which chain they're on. Chain Abstraction unifies the fragmented multi-chain world into a single, seamless experience — one account, one balance, every chain.",
    details: [
      "The multi-chain future shouldn't mean multi-wallet headaches. NEAR's Chain Abstraction layer lets users interact with any blockchain — Ethereum, Bitcoin, Solana, Cosmos — through a single NEAR account. No manual bridging, no switching networks, no gas token management.",
      "For developers, this means building apps that work across chains without chain-specific code. Your dApp's users don't think about infrastructure — they just use your product. It's the difference between the early internet (dial-up, manual DNS) and today's web (just type a URL).",
      "Chain Abstraction is powered by Chain Signatures (MPC cryptography) and the Intent relayer network. Together, they make NEAR the unified interface to all of crypto.",
    ],
    builderImpact:
      'Build once, deploy everywhere. Your smart contracts can interact with assets on any chain. Your users get one login, one account name, and zero friction. This is the biggest competitive advantage you can offer — simplicity.',
    accentColor: 'text-accent-cyan',
    accentBg: 'bg-accent-cyan/10',
    accentBorder: 'border-accent-cyan/30',
    glowColor: 'rgba(0, 212, 255, 0.15)',
    stats: [
      { label: 'Chains Connected', value: '15+' },
      { label: 'User Experience', value: 'Web2-quality' },
      { label: 'Bridges Required', value: 'Zero' },
    ],
    sanctumLink: '/sanctum',
    connections: ['intents', 'chain-signatures'],
  },
  {
    id: 'intents',
    icon: Sparkles,
    title: 'Intents',
    tagline: 'Tell NEAR what you want, not how',
    description:
      "Declare your desired outcome — \"Swap 100 USDC for NEAR at the best rate\" — and a competitive solver network figures out the optimal execution path. Declarative transactions, not imperative ones.",
    details: [
      "Traditional blockchain UX is imperative: find the right DEX, approve tokens, build the transaction, pay gas, hope for the best price. Intents flip this model. You declare what you want, and solvers compete to fulfill it optimally.",
      "Think of it like a limit order on steroids. You say \"I want X for Y\" and the network's solver ecosystem races to give you the best deal — routing across chains, DEXes, and liquidity sources you've never heard of. The best solver wins.",
      "This isn't just UX sugar. Intents enable complex cross-chain operations in a single user action: \"Swap my ETH on Ethereum for NEAR, stake it, and use the staking rewards to provide liquidity on Ref Finance\" — one intent, done.",
    ],
    builderImpact:
      "Your users never touch a raw transaction again. Build intent-native apps where users describe goals, not steps. This dramatically reduces drop-off rates and makes your app accessible to non-crypto-native users. You can also become a solver and earn fees by fulfilling others' intents.",
    accentColor: 'text-yellow-400',
    accentBg: 'bg-yellow-400/10',
    accentBorder: 'border-yellow-400/30',
    glowColor: 'rgba(250, 204, 21, 0.12)',
    stats: [
      { label: 'Avg Settlement', value: '<3 sec' },
      { label: 'Solver Network', value: 'Competitive' },
      { label: 'Cross-Chain', value: 'Native' },
    ],
    sanctumLink: '/sanctum',
    connections: ['chain-abstraction', 'chain-signatures'],
  },
  {
    id: 'chain-signatures',
    icon: KeyRound,
    title: 'Chain Signatures',
    tagline: 'Sign transactions on any chain from NEAR',
    description:
      "MPC cryptography distributed across NEAR validators lets alice.near sign transactions on Ethereum, Bitcoin, Solana — any chain. One key, every blockchain. No bridges. The holy grail of interoperability.",
    details: [
      "Chain Signatures use threshold Multi-Party Computation (MPC) distributed across NEAR's validator set. Your NEAR account derives signing capability for any target chain — without ever exposing a single private key. It's not a bridge, it's native multi-chain signing.",
      "This means alice.near can send Bitcoin, interact with Ethereum DeFi, sign Cosmos IBC messages, and execute Solana programs — all from one account, with one security model. No wrapped assets, no bridge risk, no intermediaries.",
      "The cryptographic breakthrough here is that no single validator ever holds a complete key. The MPC ceremony distributes key shares across the validator network. Even if some validators are compromised, the key remains safe. This is production-grade, battle-tested security.",
    ],
    builderImpact:
      "Build genuinely multi-chain applications from a single NEAR contract. Your contract can hold and move assets on any chain — BTC, ETH, SOL — programmatically. This eliminates the need for bridges entirely and opens up cross-chain DeFi, cross-chain NFTs, and universal asset management.",
    accentColor: 'text-purple-400',
    accentBg: 'bg-purple-400/10',
    accentBorder: 'border-purple-400/30',
    glowColor: 'rgba(192, 132, 252, 0.15)',
    stats: [
      { label: 'Chains Supported', value: '20+' },
      { label: 'Key Security', value: 'MPC Distributed' },
      { label: 'Bridge Risk', value: 'Zero' },
    ],
    sanctumLink: '/sanctum',
    connections: ['chain-abstraction', 'intents'],
  },
  {
    id: 'shade-agents',
    icon: Brain,
    title: 'Shade Agents (AI)',
    tagline: 'Autonomous AI agents on-chain',
    description:
      "AI agents running in Trusted Execution Environments that hold private keys, manage funds, execute trades, and run protocols — fully autonomous, fully trustless. The future of DeFi automation.",
    details: [
      "Shade Agents are AI agents operating inside TEEs (Trusted Execution Environments) — hardware-level secure enclaves where even the operators can't access private keys or manipulate execution. They combine AI autonomy with cryptographic security guarantees.",
      "Imagine an AI that manages a DeFi portfolio 24/7: rebalancing positions, harvesting yields, adjusting to market conditions — all while holding real assets that nobody can steal, not even the agent's creator. That's Shade Agents.",
      "The implications are profound: autonomous DAOs with AI treasurers, self-managing protocols that optimize their own parameters, AI market makers that provide liquidity across chains, and decentralized AI inference markets. This is where AI meets crypto in the most powerful way possible.",
    ],
    builderImpact:
      "Build AI-powered protocols that manage real assets autonomously. Deploy agents that can trade, lend, borrow, and manage treasuries without human intervention. The agent economy is the next massive opportunity in crypto — and NEAR is where it's being built.",
    accentColor: 'text-near-green',
    accentBg: 'bg-near-green/10',
    accentBorder: 'border-near-green/30',
    glowColor: 'rgba(0, 236, 151, 0.15)',
    stats: [
      { label: 'Security', value: 'TEE Hardware' },
      { label: 'Autonomy', value: 'Fully On-Chain' },
      { label: 'Status', value: 'Live on Mainnet' },
    ],
    sanctumLink: '/sanctum',
    connections: ['chain-signatures', 'nightshade'],
  },
  {
    id: 'nightshade',
    icon: Layers,
    title: 'Sharding (Nightshade)',
    tagline: 'Infinite scalability',
    description:
      "NEAR's dynamic sharding protocol splits the network into parallel shards that scale automatically with demand. Sub-second finality. Near-zero gas fees. Millions of users, no congestion.",
    details: [
      "Most blockchains force every validator to process every transaction — a fundamental bottleneck. Nightshade divides the network into shards that process transactions in parallel. Each block contains 'chunks' from all shards, producing a single unified chain with parallel throughput.",
      "The magic is dynamic scaling: as demand grows, NEAR can add more shards automatically. Phase 2 (Stateless Validation) is now live — validators can validate chunks without maintaining full shard state, dramatically improving decentralization and reducing hardware requirements.",
      "The result: sub-second finality, gas fees under $0.01, and throughput that scales to 100K+ TPS. All while maintaining the security guarantees of a single chain. This is why NEAR can support millions of mainstream users without breaking a sweat.",
    ],
    builderImpact:
      "Never worry about scalability. Your contract gets the throughput it needs, automatically. Gas fees stay predictable and low. Your users get sub-second confirmations. You focus on building great products — the infrastructure handles the rest.",
    accentColor: 'text-accent-cyan',
    accentBg: 'bg-accent-cyan/10',
    accentBorder: 'border-accent-cyan/30',
    glowColor: 'rgba(0, 212, 255, 0.12)',
    stats: [
      { label: 'Finality', value: '<1 second' },
      { label: 'Throughput', value: '100K+ TPS' },
      { label: 'Gas Cost', value: '<$0.01' },
    ],
    sanctumLink: '/sanctum',
    connections: ['shade-agents', 'chain-abstraction'],
  },
];

/* ─── Constellation Lines (SVG) ────────────────────────────── */

function ConstellationLines() {
  // We render subtle lines between the cards using absolute positioning
  // This is a visual-only decorative element
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="constellation-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 236, 151, 0.08)" />
            <stop offset="50%" stopColor="rgba(0, 212, 255, 0.12)" />
            <stop offset="100%" stopColor="rgba(192, 132, 252, 0.08)" />
          </linearGradient>
        </defs>
        {/* Horizontal connections row 1: card 0 -> card 1 */}
        <line x1="50%" y1="18%" x2="50%" y2="18%" stroke="url(#constellation-grad)" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="x1" values="30%;35%;30%" dur="6s" repeatCount="indefinite" />
          <animate attributeName="x2" values="65%;70%;65%" dur="6s" repeatCount="indefinite" />
        </line>
        {/* Vertical connection: row 1 to row 2 */}
        <line x1="25%" y1="35%" x2="40%" y2="48%" stroke="url(#constellation-grad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        <line x1="75%" y1="35%" x2="60%" y2="48%" stroke="url(#constellation-grad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        {/* Row 2 connection */}
        <line x1="35%" y1="60%" x2="65%" y2="60%" stroke="url(#constellation-grad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
        {/* Row 2 to row 3 */}
        <line x1="40%" y1="72%" x2="50%" y2="85%" stroke="url(#constellation-grad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
        <line x1="60%" y1="72%" x2="50%" y2="85%" stroke="url(#constellation-grad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
      </svg>
    </div>
  );
}

/* ─── Tilt Card Wrapper ────────────────────────────────────── */

function TiltCardWrapper({
  children,
  className,
  glowColor,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={(e) => { handleMouse(e); setIsHovered(true); }}
      onMouseLeave={handleLeave}
    >
      {/* Cursor-following glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px at ${50}% ${50}%, ${glowColor}, transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

/* ─── Tech Card ────────────────────────────────────────────── */

function TechCard({ tech, index }: { tech: Technology; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = tech.icon;

  return (
    <ScrollReveal delay={index * 0.08}>
      <TiltCardWrapper glowColor={tech.glowColor} className="perspective-[1000px]">
        <motion.div
          className={cn(
            'relative rounded-xl overflow-hidden',
            'bg-surface/60 backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
            tech.accentBorder,
            'transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]'
          )}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
        >
          {/* Top accent line */}
          <div className={cn(
            'absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-transparent',
            tech.id === 'chain-abstraction' && 'via-accent-cyan',
            tech.id === 'intents' && 'via-yellow-400',
            tech.id === 'chain-signatures' && 'via-purple-400',
            tech.id === 'shade-agents' && 'via-near-green',
            tech.id === 'nightshade' && 'via-accent-cyan',
          )} />

          <div className="relative z-10 p-6">
            {/* Header: icon + badge */}
            <div className="flex items-start justify-between mb-4">
              <motion.div
                className={cn('p-3 rounded-xl border', tech.accentBg, tech.accentBorder)}
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className={cn('w-6 h-6', tech.accentColor)} />
              </motion.div>
              <span className={cn(
                'text-[9px] font-mono font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-full border',
                tech.accentColor, tech.accentBg, tech.accentBorder
              )}>
                {tech.id === 'shade-agents' ? 'AI' : tech.id === 'nightshade' ? 'INFRA' : tech.id === 'chain-signatures' ? 'CRYPTO' : 'UX'}
              </span>
            </div>

            {/* Title + Tagline */}
            <h3 className="text-xl font-bold text-text-primary mb-1">{tech.title}</h3>
            <p className={cn('text-sm font-medium mb-3 italic', tech.accentColor)}>
              &ldquo;{tech.tagline}&rdquo;
            </p>

            {/* Description */}
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{tech.description}</p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {tech.stats.map((stat) => (
                <div key={stat.label} className="text-center p-2 rounded-lg bg-surface/50 border border-border/30">
                  <div className={cn('text-sm font-bold font-mono', tech.accentColor)}>{stat.value}</div>
                  <div className="text-[9px] text-text-muted uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Expandable deep dive */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  {/* Full explanation */}
                  <div className={cn('rounded-lg p-4 mb-4 border space-y-3', tech.accentBg, tech.accentBorder)}>
                    {tech.details.map((paragraph, i) => (
                      <p key={i} className="text-xs text-text-secondary leading-relaxed">{paragraph}</p>
                    ))}
                  </div>

                  {/* How This Affects You as a Builder */}
                  <div className="rounded-lg p-4 mb-4 bg-near-green/5 border border-near-green/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-near-green" />
                      <span className="text-xs font-bold text-near-green uppercase tracking-wider">
                        How This Affects You as a Builder
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{tech.builderImpact}</p>
                  </div>

                  {/* Related techs */}
                  {tech.connections.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Related: </span>
                      {tech.connections.map((connId, i) => {
                        const conn = TECHNOLOGIES.find(t => t.id === connId);
                        if (!conn) return null;
                        return (
                          <span key={connId}>
                            {i > 0 && <span className="text-text-muted/30"> · </span>}
                            <span className={cn('text-[10px] font-mono', conn.accentColor)}>
                              {conn.title}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Sanctum link */}
                  <Link href={tech.sanctumLink}>
                    <Button variant="secondary" size="sm" className="w-full group">
                      <Code2 className="w-3.5 h-3.5" />
                      Practice in Sanctum
                      <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions row */}
            <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                  'text-xs font-medium transition-colors flex items-center gap-1',
                  tech.accentColor, 'hover:opacity-80'
                )}
              >
                {expanded ? 'Show less' : 'Deep dive'}
                <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="w-3 h-3" />
                </motion.span>
              </button>
              <Link
                href="/opportunities"
                className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
              >
                Explore opportunities
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      </TiltCardWrapper>
    </ScrollReveal>
  );
}

/* ─── Animated Node Visual ─────────────────────────────────── */

function TechConnectionVisual() {
  return (
    <div className="relative py-6">
      <div className="flex items-center justify-center gap-2">
        {TECHNOLOGIES.map((tech, i) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={tech.id}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className={cn(
                  'w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border',
                  tech.accentBg, tech.accentBorder
                )}
                whileHover={{ scale: 1.15 }}
                animate={{
                  boxShadow: [
                    `0 0 8px ${tech.glowColor}`,
                    `0 0 20px ${tech.glowColor}`,
                    `0 0 8px ${tech.glowColor}`,
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              >
                <Icon className={cn('w-5 h-5 md:w-6 md:h-6', tech.accentColor)} />
              </motion.div>
              <span className="text-[8px] md:text-[9px] font-mono text-text-muted text-center max-w-[60px] leading-tight">
                {tech.title}
              </span>
              {/* Connecting line to next */}
              {i < TECHNOLOGIES.length - 1 && (
                <motion.div
                  className="absolute h-px bg-gradient-to-r from-transparent via-near-green/20 to-transparent"
                  style={{
                    width: '40px',
                    left: `${(i + 0.5) * (100 / TECHNOLOGIES.length) + 2}%`,
                    top: '28px',
                  }}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function KeyTechnologies() {
  return (
    <section id="key-technologies" className="py-12 space-y-8">
      <SectionHeader
        title="Key NEAR Technologies"
        badge="THE BLEEDING EDGE"
        count={TECHNOLOGIES.length}
      />

      {/* Intro */}
      <ScrollReveal>
        <div className="max-w-3xl space-y-3">
          <GradientText as="h2" animated className="text-xl md:text-2xl font-bold">
            Not Just Another L1 — The Chain Abstraction Layer
          </GradientText>
          <p className="text-text-secondary text-base leading-relaxed">
            NEAR isn&apos;t competing on TPS benchmarks. These{' '}
            <span className="text-near-green font-semibold">5 breakthrough technologies</span>{' '}
            define the next generation of blockchain infrastructure — where users don&apos;t think
            about chains, AI agents operate autonomously, and one account works everywhere.
          </p>
          <p className="text-text-muted text-sm">
            Click &ldquo;Deep dive&rdquo; on any card for full technical details and builder impact.
          </p>
        </div>
      </ScrollReveal>

      {/* Tech node connection visual */}
      <ScrollReveal delay={0.05}>
        <TechConnectionVisual />
      </ScrollReveal>

      {/* Technology Grid — relative container for constellation lines */}
      <div className="relative">
        <ConstellationLines />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TECHNOLOGIES.map((tech, i) => (
            <TechCard key={tech.id} tech={tech} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <ScrollReveal delay={0.3}>
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-near-green/5 via-accent-cyan/5 to-purple-400/5" />
          <div className="absolute inset-0 border border-near-green/20 rounded-xl" />
          <div className="relative z-10 p-6 flex flex-col sm:flex-row items-center gap-4">
            <motion.div
              className="p-3 rounded-xl bg-near-green/10 border border-near-green/20"
              animate={{
                boxShadow: [
                  '0 0 15px rgba(0,236,151,0.1)',
                  '0 0 30px rgba(0,236,151,0.25)',
                  '0 0 15px rgba(0,236,151,0.1)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-6 h-6 text-near-green" />
            </motion.div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-semibold text-text-primary">
                Voidspace tracks opportunities across all 5 technologies
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Find funded bounties, grants, and open roles in Chain Abstraction,
                Intents, Chain Signatures, Shade Agents, and Nightshade.
              </p>
            </div>
            <Link href="/opportunities">
              <Button variant="primary" size="sm" className="group flex-shrink-0">
                Browse Opportunities
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
