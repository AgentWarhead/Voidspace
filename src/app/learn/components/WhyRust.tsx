'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Shield,
  DollarSign,
  Sparkles,
  ArrowRight,
  Code2,
  Zap,
  TrendingUp,
  Globe,
  Cpu,
  Lock,
  Brain,
  Layers,
  ChevronRight,
  Trophy,
  Briefcase,
  GraduationCap,
  Heart,
  Rocket,
  Target,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/* ─── Types ────────────────────────────────────────────────── */

interface ComparisonRow {
  feature: string;
  rust: string;
  rustIcon: '✅' | '⚠️';
  solidity: string;
  solidityIcon: '✅' | '⚠️';
  rustWins: boolean;
  detail: string;
}

/* ─── Data ─────────────────────────────────────────────────── */

const heroStats = [
  {
    icon: Heart,
    value: 8,
    suffix: ' Years #1',
    label: 'Most Admired Language',
    sublabel: 'Stack Overflow Developer Survey',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20',
  },
  {
    icon: DollarSign,
    value: 120,
    suffix: 'K+',
    label: 'Average Salary',
    sublabel: 'Highest-paid language globally',
    color: 'text-near-green',
    bgColor: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-lg shadow-green-500/10 backdrop-blur-sm',
    borderColor: 'border-green-500/20',
  },
  {
    icon: TrendingUp,
    value: 400,
    suffix: '%',
    label: 'Demand Growth',
    sublabel: 'Since 2020 — supply can\'t keep up',
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/10',
    borderColor: 'border-accent-cyan/20',
  },
  {
    icon: Globe,
    value: 3,
    suffix: 'M+',
    label: 'Developers',
    sublabel: 'Growing 50% year-over-year',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
  },
  {
    icon: Shield,
    value: 0,
    suffix: '',
    label: 'Memory Bugs',
    sublabel: 'Compile-time safety eliminates them',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
    displayValue: 'Zero',
  },
  {
    icon: Cpu,
    value: 6,
    suffix: '+',
    label: 'Blockchains',
    sublabel: 'NEAR, Solana, Polkadot, Cosmos…',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
  },
];

const companiesUsingRust = [
  { name: 'AWS', uses: 'Firecracker VMs, Lambda' },
  { name: 'Google', uses: 'Android, Fuchsia OS' },
  { name: 'Microsoft', uses: 'Windows kernel modules' },
  { name: 'Meta', uses: 'Source control (Sapling)' },
  { name: 'Discord', uses: 'Backend services (10x faster)' },
  { name: 'Cloudflare', uses: 'Edge compute, Workers' },
  { name: 'Mozilla', uses: 'Firefox rendering engine' },
  { name: 'Figma', uses: 'Multiplayer rendering' },
  { name: 'Dropbox', uses: 'File sync core engine' },
  { name: 'Linux', uses: 'Kernel modules (6.1+)' },
  { name: 'NEAR', uses: 'Entire protocol + contracts' },
  { name: 'Solana', uses: 'Entire protocol + programs' },
];

const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Memory Safety',
    rust: 'Compile-time guarantees',
    rustIcon: '✅',
    solidity: 'Runtime checks only',
    solidityIcon: '⚠️',
    rustWins: true,
    detail: 'Rust\'s borrow checker prevents use-after-free, data races, and null pointer bugs before your code ever runs. Solidity only catches some issues at runtime, leaving many vulnerabilities for attackers.',
  },
  {
    feature: 'Performance',
    rust: 'Near-native speed (WASM)',
    rustIcon: '✅',
    solidity: 'EVM interpreter overhead',
    solidityIcon: '⚠️',
    rustWins: true,
    detail: 'Rust compiles to optimized WASM with zero-cost abstractions — every abstraction compiles away. Solidity runs through the EVM interpreter with significant overhead.',
  },
  {
    feature: 'Ecosystem',
    rust: 'Any blockchain + web2 + systems',
    rustIcon: '✅',
    solidity: 'EVM chains only',
    solidityIcon: '⚠️',
    rustWins: true,
    detail: 'Rust skills work on NEAR, Solana, Polkadot, Cosmos, plus systems programming, game engines, web servers, CLIs, and more. Solidity only works on EVM-compatible chains.',
  },
  {
    feature: 'Career Value',
    rust: 'Web3 + web2 + systems ($120K+)',
    rustIcon: '✅',
    solidity: 'Web3 only ($100K+)',
    solidityIcon: '⚠️',
    rustWins: true,
    detail: 'Rust developers are employable EVERYWHERE — not just crypto. AWS, Google, Discord, and thousands of companies hire Rust developers. If crypto has a downturn, your skills still have massive value.',
  },
  {
    feature: 'Learning Curve',
    rust: 'Steeper — but AI helps immensely',
    rustIcon: '⚠️',
    solidity: 'Easier to start',
    solidityIcon: '✅',
    rustWins: false,
    detail: 'Rust has a steeper initial learning curve due to ownership/borrowing. But modern AI assistants (like Sanctum) make the curve much gentler, and the payoff is 10x: fewer bugs, better performance, portable skills.',
  },
  {
    feature: 'Security',
    rust: 'Compiler catches bugs for you',
    rustIcon: '✅',
    solidity: 'Many exploit vectors',
    solidityIcon: '⚠️',
    rustWins: true,
    detail: 'The $60M DAO hack, Wormhole ($320M), and countless Solidity exploits happened because of language-level vulnerabilities. Rust\'s ownership model makes entire classes of bugs impossible.',
  },
  {
    feature: 'Tooling',
    rust: 'Cargo, clippy, rust-analyzer',
    rustIcon: '✅',
    solidity: 'Hardhat, Foundry, Remix',
    solidityIcon: '✅',
    rustWins: false,
    detail: 'Both have excellent tooling. Cargo is arguably the best package manager in any language. Solidity\'s tooling is more mature for smart contracts specifically.',
  },
  {
    feature: 'Error Messages',
    rust: 'Best in any language — teaches you',
    rustIcon: '✅',
    solidity: 'Basic, sometimes cryptic',
    solidityIcon: '⚠️',
    rustWins: true,
    detail: 'Rust compiler errors are legendary — they don\'t just tell you what\'s wrong, they explain why and suggest exactly how to fix it. It\'s like having a patient teacher built into the compiler.',
  },
];

const salaryComparison = [
  { lang: 'Rust', salary: 120, growth: 95, color: 'bg-near-green', textColor: 'text-near-green' },
  { lang: 'Go', salary: 110, growth: 70, color: 'bg-accent-cyan', textColor: 'text-accent-cyan' },
  { lang: 'Solidity', salary: 100, growth: 60, color: 'bg-purple-400', textColor: 'text-purple-400' },
  { lang: 'TypeScript', salary: 95, growth: 45, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
  { lang: 'Python', salary: 90, growth: 40, color: 'bg-blue-400', textColor: 'text-blue-400' },
  { lang: 'Java', salary: 85, growth: 20, color: 'bg-red-400', textColor: 'text-red-400' },
];

const topRustProjects = [
  {
    name: 'NEAR Protocol',
    icon: Globe,
    fact: 'Core protocol (nearcore) is written entirely in Rust. Smart contracts compile to WASM from Rust.',
    color: 'text-near-green',
    bgColor: 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 shadow-lg shadow-emerald-500/10 backdrop-blur-sm',
    borderColor: 'border-emerald-500/20',
  },
  {
    name: 'Solana',
    icon: Zap,
    fact: 'Validator client and runtime built in Rust. On-chain programs (smart contracts) are written in Rust.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
  },
  {
    name: 'Polkadot / Substrate',
    icon: Layers,
    fact: 'Substrate framework for building blockchains is written in Rust. Powers Polkadot, Kusama, and 100+ parachains.',
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/10',
    borderColor: 'border-accent-cyan/20',
  },
  {
    name: 'Discord',
    icon: Cpu,
    fact: 'Switched Read States service from Go to Rust, reducing tail latencies and memory usage dramatically. Published results in 2020.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
  },
  {
    name: 'Cloudflare',
    icon: Shield,
    fact: 'Uses Rust for Pingora (their HTTP proxy replacing nginx) and edge compute infrastructure serving millions of requests per second.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
  },
  {
    name: 'Dropbox',
    icon: Lock,
    fact: 'Rebuilt their core file sync engine in Rust for better performance and reliability, replacing legacy Python code.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
  },
];

const codeExample = `// A NEAR smart contract in Rust — clean, safe, powerful
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::{env, near, AccountId};
use near_sdk::store::LookupMap;

#[near(contract_state)]
pub struct VoidContract {
    owner: AccountId,
    voids: LookupMap<String, Void>,
    total_filled: u64,
}

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct Void {
    title: String,
    reward: u128,       // in yoctoNEAR
    filler: Option<AccountId>,
    filled_at: Option<u64>,
}

#[near]
impl VoidContract {
    #[init]
    pub fn new(owner: AccountId) -> Self {
        Self {
            owner,
            voids: LookupMap::new(b"v"),
            total_filled: 0,
        }
    }

    /// Fill a void — claim the bounty reward
    pub fn fill_void(&mut self, void_id: String) {
        let caller = env::predecessor_account_id();
        let mut void = self.voids.get(&void_id)
            .expect("Void not found")
            .clone();

        assert!(void.filler.is_none(), "Already filled!");

        void.filler = Some(caller.clone());
        void.filled_at = Some(env::block_timestamp());
        self.voids.insert(void_id, void);
        self.total_filled += 1;

        env::log_str(&format!(
            "void_filled:{}:{}",
            self.total_filled, caller
        ));
    }

    /// View: check void status
    pub fn get_void(&self, void_id: String) -> Option<Void> {
        self.voids.get(&void_id).cloned()
    }
}`;

/* ─── Animated Code Block ──────────────────────────────────── */

function AnimatedCodeBlock() {
  const lines = codeExample.split('\n');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="relative rounded-xl border border-border overflow-hidden bg-background/90 backdrop-blur-xl shadow-2xl">
      {/* Tab bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-near-green/50" />
        </div>
        <div className="flex items-center gap-2 ml-3">
          <span className="text-[11px] font-mono text-text-secondary bg-surface px-2.5 py-0.5 rounded border border-border">lib.rs</span>
          <span className="text-[11px] font-mono text-text-muted">Cargo.toml</span>
        </div>
        <div className="ml-auto text-[10px] font-mono text-text-muted/40">Rust • near-sdk v5.6</div>
      </div>

      <div className="p-4 overflow-x-auto max-h-[480px] overflow-y-auto scrollbar-hide">
        <pre className="text-[12px] leading-[1.7] font-mono">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{ delay: i * 0.015, duration: 0.3 }}
              className="flex hover:bg-surface/30 -mx-2 px-2 rounded"
            >
              <span className="text-text-muted/20 select-none w-8 text-right mr-4 flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-text-secondary">
                {colorizeRust(line)}
              </span>
            </motion.div>
          ))}
        </pre>
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-surface/30 text-[10px] font-mono text-text-muted/50">
        <span>{lines.length} lines • Complete NEAR smart contract</span>
        <span className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-near-green" />
          Memory safe at compile time
        </span>
      </div>
    </div>
  );
}

function colorizeRust(line: string): React.ReactNode {
  const keywords = ['pub', 'fn', 'struct', 'impl', 'let', 'mut', 'self', 'Self', 'use', 'mod', 'return', 'const', 'assert!'];
  const types = ['String', 'Vec', 'AccountId', 'LookupMap', 'Void', 'u64', 'u128', 'bool', 'Option', 'Some', 'None'];

  if (line.trimStart().startsWith('//') || line.trimStart().startsWith('///')) {
    return <span className="text-text-muted/50 italic">{line}</span>;
  }
  if (line.trimStart().startsWith('#[')) {
    return <span className="text-accent-cyan/80">{line}</span>;
  }
  if (line.trimStart().startsWith('use ')) {
    return <span className="text-text-muted/70">{line}</span>;
  }

  const parts = line.split(/(\b)/);
  return parts.map((part, i) => {
    if (keywords.includes(part)) return <span key={i} className="text-near-green">{part}</span>;
    if (types.includes(part)) return <span key={i} className="text-accent-cyan">{part}</span>;
    if (part.startsWith('"') || part.startsWith('&"')) return <span key={i} className="text-yellow-400/80">{part}</span>;
    if (part === 'env' || part === 'near_sdk') return <span key={i} className="text-purple-400/80">{part}</span>;
    return <span key={i}>{part}</span>;
  });
}

/* ─── Why Top Projects Choose Rust ─────────────────────────── */

function TopRustProjectsSection() {
  return (
    <GlowCard padding="lg">
      <div className="flex items-center gap-2 mb-5">
        <Rocket className="w-4 h-4 text-near-green" />
        <h3 className="text-sm font-bold text-text-primary">Why Top Projects Choose Rust</h3>
        <span className="text-[10px] text-text-muted ml-auto">Real companies, real results</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topRustProjects.map((project, i) => {
          const ProjectIcon = project.icon;
          return (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface/30 border border-border/30 hover:border-near-green/20 transition-colors"
            >
              <div className={cn(
                'p-2 rounded-lg border flex-shrink-0',
                project.bgColor, project.borderColor
              )}>
                <ProjectIcon className={cn('w-4 h-4', project.color)} />
              </div>
              <div>
                <span className="text-sm font-bold text-text-primary">{project.name}</span>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{project.fact}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlowCard>
  );
}

/* ─── Salary / Job Market Visualization ────────────────────── */

function JobMarketChart() {
  return (
    <GlowCard padding="lg">
      <div className="flex items-center gap-2 mb-5">
        <Briefcase className="w-4 h-4 text-near-green" />
        <h3 className="text-sm font-bold text-text-primary">Developer Salary Comparison</h3>
        <span className="text-[10px] text-text-muted ml-auto">Median annual (USD)</span>
      </div>

      <div className="space-y-3">
        {salaryComparison.map((lang, i) => {
          const isRust = lang.lang === 'Rust';
          return (
            <motion.div
              key={lang.lang}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group"
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  'text-xs font-mono w-20 text-right',
                  isRust ? 'text-near-green font-bold' : 'text-text-muted'
                )}>
                  {lang.lang}
                </span>
                <div className="flex-1 relative">
                  <div className="h-7 bg-surface rounded-md overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-md flex items-center justify-end pr-2 relative',
                        isRust ? 'bg-gradient-to-r from-near-green/80 to-near-green' : lang.color + '/40'
                      )}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(lang.salary / 130) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.08 + 0.2 }}
                    >
                      {isRust && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                        />
                      )}
                    </motion.div>
                  </div>
                </div>
                <span className={cn(
                  'text-xs font-mono w-14 text-right',
                  isRust ? 'text-near-green font-bold' : 'text-text-muted/70'
                )}>
                  ${lang.salary}K
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Growth stat */}
      <div className="mt-5 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-near-green" />
          <h4 className="text-xs font-bold text-text-primary">Demand Growth (since 2020)</h4>
        </div>
        <div className="space-y-2">
          {salaryComparison.slice(0, 4).map((lang, i) => {
            const isRust = lang.lang === 'Rust';
            return (
              <div key={lang.lang} className="flex items-center gap-3">
                <span className={cn('text-[10px] font-mono w-20 text-right', isRust ? 'text-near-green font-bold' : 'text-text-muted/60')}>
                  {lang.lang}
                </span>
                <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full', isRust ? 'bg-near-green' : lang.color + '/30')}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.growth}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05 + 0.3 }}
                  />
                </div>
                <span className={cn('text-[10px] font-mono w-10', isRust ? 'text-near-green font-bold' : 'text-text-muted/50')}>
                  +{lang.growth}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </GlowCard>
  );
}

/* ─── Companies Grid ───────────────────────────────────────── */

function CompaniesSection() {
  return (
    <GlowCard padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-near-green" />
        <h3 className="text-sm font-bold text-text-primary">Who Uses Rust?</h3>
        <span className="text-xs text-text-muted ml-auto">Everyone that matters.</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {companiesUsingRust.map((company, i) => (
          <motion.div
            key={company.name}
            className="text-center p-2.5 rounded-lg bg-surface/50 border border-border/30 hover:border-near-green/20 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
          >
            <span className="text-sm font-bold text-text-primary">{company.name}</span>
            <p className="text-[10px] text-text-muted mt-0.5">{company.uses}</p>
          </motion.div>
        ))}
      </div>
    </GlowCard>
  );
}

/* ─── Why Rust for Smart Contracts ─────────────────────────── */

function WhyRustForContracts() {
  const benefits = [
    {
      icon: Lock,
      title: 'No Reentrancy Attacks',
      description: 'Rust\'s ownership model prevents the class of bugs that led to the $60M DAO hack and $320M Wormhole exploit. The borrow checker won\'t let you write vulnerable code.',
      color: 'text-near-green',
    },
    {
      icon: Zap,
      title: 'Zero-Cost Abstractions',
      description: 'Write high-level, readable code that compiles to WASM as fast as hand-written assembly. No garbage collector, no runtime overhead, no surprises.',
      color: 'text-accent-cyan',
    },
    {
      icon: Brain,
      title: 'Compiler Is Your Teacher',
      description: 'Rust\'s error messages are legendary. The compiler doesn\'t just catch bugs — it explains exactly what went wrong and suggests how to fix it, with code examples.',
      color: 'text-purple-400',
    },
    {
      icon: Layers,
      title: 'Multi-Chain Portability',
      description: 'Learn Rust once, build on NEAR, Solana, Polkadot, Cosmos, Internet Computer, and any WASM-based chain. Your skills transfer everywhere.',
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {benefits.map((benefit, i) => {
        const Icon = benefit.icon;
        return (
          <ScrollReveal key={benefit.title} delay={i * 0.06}>
            <GlowCard padding="lg" className="h-full">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'p-2.5 rounded-lg border flex-shrink-0',
                  benefit.color === 'text-near-green' ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/20 shadow-lg shadow-emerald-500/10 backdrop-blur-sm' :
                  benefit.color === 'text-accent-cyan' ? 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-sm' :
                  benefit.color === 'text-purple-400' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/20 shadow-lg shadow-purple-500/10 backdrop-blur-sm' :
                  'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/20 shadow-lg shadow-amber-500/10 backdrop-blur-sm'
                )}>
                  <Icon className={cn('w-5 h-5', benefit.color)} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-1">{benefit.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </GlowCard>
          </ScrollReveal>
        );
      })}
    </div>
  );
}

/* ─── Career Transformation Section ────────────────────────── */

function CareerSection() {
  const paths = [
    {
      icon: Cpu,
      title: 'Systems Programming',
      description: 'Operating systems, embedded devices, game engines, compilers — Rust is the modern C/C++.',
      companies: 'AWS, Microsoft, Linux Foundation',
    },
    {
      icon: Globe,
      title: 'Web & Cloud',
      description: 'High-performance web servers, serverless functions, CLI tools — Rust is taking over infrastructure.',
      companies: 'Cloudflare, Vercel, Deno',
    },
    {
      icon: Layers,
      title: 'Blockchain & Web3',
      description: 'Smart contracts, protocols, bridges, indexers — Rust is THE blockchain language.',
      companies: 'NEAR, Solana, Polkadot, Cosmos',
    },
    {
      icon: Rocket,
      title: 'Startups & Entrepreneurship',
      description: 'Build performant MVPs, win hackathons, attract investors who value technical excellence.',
      companies: 'Y Combinator, a16z, NEAR Horizon',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="max-w-3xl">
        <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-near-green" />
          Career Transformation
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          Learning Rust makes you employable <span className="text-near-green font-semibold">everywhere</span> — not just crypto.
          If web3 has a downturn, your Rust skills are still in massive demand across systems programming,
          cloud infrastructure, gaming, and more. It&apos;s the most future-proof language investment you can make.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paths.map((path, i) => {
          const PathIcon = path.icon;
          return (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Card variant="glass" padding="md" className="h-full">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex-shrink-0 shadow-lg shadow-blue-500/10 backdrop-blur-sm">
                    <PathIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary mb-0.5">{path.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed mb-1.5">{path.description}</p>
                    <span className="text-[10px] text-text-muted font-mono">Hiring: {path.companies}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── "But Rust is Hard" Section ───────────────────────────── */

function RustIsEasyNow() {
  const reasons = [
    {
      icon: Sparkles,
      title: 'AI-Powered Learning',
      description: 'The Sanctum pairs you with Claude AI that explains ownership, borrowing, and lifetimes in plain English. Ask "why does the borrow checker complain here?" and get an instant, clear answer.',
    },
    {
      icon: Brain,
      title: 'World\'s Best Error Messages',
      description: 'Rust\'s compiler is your patient teacher. It doesn\'t just say "error" — it highlights the exact problem, explains why it\'s wrong, and suggests the fix with code.',
    },
    {
      icon: Target,
      title: 'Focused Learning Path',
      description: 'You don\'t need to master all of Rust. For NEAR contracts, you need ~30% of the language. Our curriculum cuts straight to what matters.',
    },
    {
      icon: Trophy,
      title: 'The Payoff Is 10x',
      description: 'Yes, the first week is harder than Solidity. But after that, you write safer code, faster programs, and have skills that transfer to any platform.',
    },
  ];

  return (
    <GlowCard padding="lg" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,236,151,0.06),transparent)] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-near-green/20 to-accent-cyan/20 border border-near-green/30 flex items-center justify-center flex-shrink-0"
            animate={{
              boxShadow: [
                '0 0 20px rgba(0,236,151,0.1)',
                '0 0 40px rgba(0,236,151,0.2)',
                '0 0 20px rgba(0,236,151,0.1)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-8 h-8 text-near-green" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">
              &ldquo;But Rust Is Hard!&rdquo; — Not With AI.
            </h3>
            <p className="text-sm text-text-muted mt-1">
              The #1 objection to Rust was its learning curve. That was before AI assistants changed everything.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reasons.map((reason, i) => {
            const ReasonIcon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface/30"
              >
                <ReasonIcon className="w-5 h-5 text-near-green flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-0.5">{reason.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{reason.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/sanctum">
            <Button variant="primary" size="lg" className="group">
              Enter the Sanctum — Start Learning Rust
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-xs text-text-muted">
            AI-assisted • No prior Rust experience needed • Free
          </p>
        </div>
      </div>
    </GlowCard>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function WhyRust() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  return (
    <div className="w-full space-y-10">
      <SectionHeader title="Why Rust?" badge="THE LANGUAGE OF THE FUTURE" />

      {/* Hero intro */}
      <ScrollReveal>
        <div className="max-w-4xl space-y-4">
          <GradientText as="p" animated className="text-2xl md:text-3xl font-bold mt-2">
            The Most Loved Language. The Safest Code. Your Unfair Advantage.
          </GradientText>
          <p className="text-lg text-text-secondary leading-relaxed">
            Rust isn&apos;t just NEAR&apos;s smart contract language — it&apos;s the{' '}
            <span className="text-near-green font-semibold">#1 most admired programming language for 8 consecutive years</span>.
            It&apos;s the backbone of AWS, Google, Discord, Cloudflare, and the Linux kernel.
            Learning Rust doesn&apos;t just let you build on NEAR — it makes you{' '}
            <span className="text-near-green font-semibold">one of the highest-paid, most in-demand developers on Earth</span>.
          </p>
          <p className="text-base text-text-muted leading-relaxed">
            Memory-safe without garbage collection. Solana, NEAR, and Polkadot all chose Rust for a reason.
            The question isn&apos;t <em>should</em> you learn Rust — it&apos;s <em>how fast can you start</em>.
          </p>
        </div>
      </ScrollReveal>

      {/* Stats grid */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {heroStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <GlowCard padding="md" className="text-center h-full">
                  <div className={cn('w-9 h-9 mx-auto mb-2 rounded-full flex items-center justify-center border', stat.bgColor, stat.borderColor)}>
                    <Icon className={cn('w-4 h-4', stat.color)} />
                  </div>
                  <div className={cn('text-lg font-bold', stat.color)}>
                    {stat.displayValue ? (
                      stat.displayValue
                    ) : (
                      <>{stat.value}{stat.suffix}</>
                    )}
                  </div>
                  <p className="text-xs font-medium text-text-primary mt-1">{stat.label}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{stat.sublabel}</p>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Companies Using Rust */}
      <ScrollReveal delay={0.12}>
        <CompaniesSection />
      </ScrollReveal>

      {/* Why Rust for Smart Contracts */}
      <ScrollReveal delay={0.14}>
        <h3 className="text-sm font-mono font-semibold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-near-green" />
          Why Rust for Smart Contracts?
        </h3>
        <WhyRustForContracts />
      </ScrollReveal>

      {/* Rust vs Solidity Comparison */}
      <ScrollReveal delay={0.16}>
        <GlowCard padding="lg" className="overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="w-5 h-5 text-near-green" />
            <h3 className="text-lg font-bold text-text-primary">Rust vs Solidity — Head to Head</h3>
            <span className="text-[10px] text-text-muted ml-auto hidden sm:inline">Click rows for details</span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 mb-3">
              <div className="text-xs font-mono uppercase tracking-wider text-text-muted px-3 py-2">Feature</div>
              <div className="text-xs font-mono uppercase tracking-wider text-near-green px-3 py-2 text-center">Rust / NEAR</div>
              <div className="text-xs font-mono uppercase tracking-wider text-text-muted px-3 py-2 text-center">Solidity / EVM</div>
            </div>
            {comparisonRows.map((row, i) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  className={cn(
                    'grid grid-cols-[1.2fr_1fr_1fr] gap-3 rounded-lg cursor-pointer transition-colors',
                    i % 2 === 0 ? 'bg-surface/30' : '',
                    expandedRow === i && 'bg-near-green/5'
                  )}
                  onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                >
                  <div className="px-3 py-3 text-sm font-medium text-text-primary flex items-center gap-2">
                    {row.feature}
                    <motion.span
                      className="text-text-muted/30"
                      animate={{ rotate: expandedRow === i ? 90 : 0 }}
                    >
                      <ChevronRight className="w-3 h-3" />
                    </motion.span>
                  </div>
                  <div className="px-3 py-3 text-sm text-center flex items-center justify-center gap-2">
                    <span>{row.rustIcon}</span>
                    <span className={row.rustIcon === '✅' ? 'text-near-green' : 'text-text-muted'}>{row.rust}</span>
                  </div>
                  <div className="px-3 py-3 text-sm text-center flex items-center justify-center gap-2">
                    <span>{row.solidityIcon}</span>
                    <span className={row.solidityIcon === '✅' ? 'text-text-secondary' : 'text-text-muted'}>{row.solidity}</span>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedRow === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3">
                        <p className="text-xs text-text-secondary bg-near-green/5 border border-near-green/10 rounded-lg p-3 leading-relaxed">
                          <Sparkles className="w-3 h-3 text-near-green inline mr-1.5" />
                          {row.detail}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Mobile stacked */}
          <div className="md:hidden space-y-3">
            {comparisonRows.map((row, i) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg bg-surface/30 p-3 space-y-2 cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono uppercase tracking-wider text-text-muted">{row.feature}</p>
                  <ChevronRight className={cn('w-3 h-3 text-text-muted/30 transition-transform', expandedRow === i && 'rotate-90')} />
                </div>
                <div className="flex items-start gap-2">
                  <span>{row.rustIcon}</span>
                  <span className={cn('text-sm', row.rustIcon === '✅' ? 'text-near-green' : 'text-text-muted')}>{row.rust}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{row.solidityIcon}</span>
                  <span className={cn('text-sm', row.solidityIcon === '✅' ? 'text-text-secondary' : 'text-text-muted')}>{row.solidity}</span>
                </div>
                <AnimatePresence>
                  {expandedRow === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-xs text-text-secondary bg-near-green/5 rounded-lg p-2 leading-relaxed"
                    >
                      {row.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border/30">
            <p className="text-xs text-text-muted text-center">
              <span className="text-near-green font-semibold">TL;DR:</span> Rust wins on safety, performance, and career value. Solidity is easier to start but limits you to EVM chains.
              Both are valid — but Rust is the smarter long-term investment.
            </p>
          </div>
        </GlowCard>
      </ScrollReveal>

      {/* Code Example + Job Market */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ScrollReveal delay={0.1}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="w-4 h-4 text-near-green" />
              <h3 className="text-sm font-semibold text-text-primary">Elegant & Expressive</h3>
              <span className="text-xs text-text-muted ml-auto">~50 lines = complete contract</span>
            </div>
            <AnimatedCodeBlock />
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          <ScrollReveal delay={0.15}>
            <JobMarketChart />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <TopRustProjectsSection />
          </ScrollReveal>
        </div>
      </div>

      {/* Career Transformation */}
      <ScrollReveal delay={0.15}>
        <CareerSection />
      </ScrollReveal>

      {/* "But Rust is Hard!" Section */}
      <ScrollReveal delay={0.2}>
        <RustIsEasyNow />
      </ScrollReveal>
    </div>
  );
}
