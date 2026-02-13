'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins, Image, Vote, BarChart3, Box, Bot,
  ArrowRight, Sparkles, Filter,
  ChevronRight, Code2, Zap, Copy, Check,
  BookOpen, Github, FileCode, Clock,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface Prerequisite {
  name: string;
  slug: string;
}

interface Template {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  difficulty: Difficulty;
  standard: string;
  tech: string[];
  linesOfCode: string;
  estimatedTime: string;
  cloneUrl: string;
  walkthroughUrl: string;
  features: string[];
  prerequisites: Prerequisite[];
  codePreview: string;
  codeFilename: string;
}

const TEMPLATES: Template[] = [
  {
    title: 'Token Contract',
    subtitle: 'Launch your own fungible token',
    icon: Coins,
    description: 'Create a NEP-141 compliant fungible token with minting, burning, transfers, and storage management. The essential first contract every NEAR builder deploys.',
    difficulty: 'Beginner',
    standard: 'NEP-141',
    tech: ['Rust', 'NEAR SDK', 'NEP-141', 'NEP-148'],
    linesOfCode: '~250 lines',
    estimatedTime: '~2 hours',
    cloneUrl: 'https://github.com/near-examples/ft',
    walkthroughUrl: '/sanctum?template=token',
    features: ['Mint & burn tokens', 'Safe transfers', 'Storage staking', 'Token metadata'],
    prerequisites: [
      { name: 'Rust Fundamentals', slug: '/learn/builder/rust-fundamentals' },
      { name: 'Your First Contract', slug: '/learn/builder/your-first-contract' },
    ],
    codeFilename: 'lib.rs',
    codePreview: `#[near(contract_state)]
pub struct FungibleToken {
    token: FungibleTokenCore,
    metadata: LazyOption<FungibleTokenMetadata>,
}

#[near]
impl FungibleToken {
    #[init]
    pub fn new(owner_id: AccountId, total_supply: U128) -> Self {
        // Initialize token with supply
    }

    pub fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128) {
        self.token.ft_transfer(receiver_id, amount, None);
    }
}`,
  },
  {
    title: 'NFT Collection',
    subtitle: 'Create and mint NFTs',
    icon: Image,
    description: 'Launch an NFT collection with NEP-171 compliance, royalties, enumeration, and marketplace hooks. Includes IPFS media handling and lazy minting support.',
    difficulty: 'Intermediate',
    standard: 'NEP-171',
    tech: ['Rust', 'NEAR SDK', 'NEP-171', 'NEP-199', 'IPFS'],
    linesOfCode: '~400 lines',
    estimatedTime: '~3 hours',
    cloneUrl: 'https://github.com/near-examples/nft',
    walkthroughUrl: '/sanctum?template=nft',
    features: ['Mint with metadata', 'Royalty system', 'Enumeration', 'Marketplace hooks'],
    prerequisites: [
      { name: 'Token Standards', slug: '/learn/builder/token-standards' },
      { name: 'State Management', slug: '/learn/builder/state-management' },
    ],
    codeFilename: 'nft_core.rs',
    codePreview: `#[near(contract_state)]
pub struct NFTContract {
    tokens: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,
}

#[near]
impl NFTContract {
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        receiver_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token {
        self.tokens.internal_mint(token_id, receiver_id, Some(token_metadata))
    }
}`,
  },
  {
    title: 'DAO',
    subtitle: 'Decentralized governance',
    icon: Vote,
    description: 'Build a Sputnik DAO-compatible governance system with proposals, voting, treasury management, and role-based access control. Learn cross-contract patterns.',
    difficulty: 'Intermediate',
    standard: 'Sputnik DAO',
    tech: ['Rust', 'NEAR SDK', 'Sputnik', 'Cross-contract'],
    linesOfCode: '~600 lines',
    estimatedTime: '~4 hours',
    cloneUrl: 'https://github.com/near-daos/sputnik-dao-contract',
    walkthroughUrl: '/sanctum?template=dao',
    features: ['Proposal system', 'Token-weighted voting', 'Treasury ops', 'Role-based access'],
    prerequisites: [
      { name: 'Building a dApp', slug: '/learn/builder/building-a-dapp' },
      { name: 'Security Best Practices', slug: '/learn/builder/security-best-practices' },
    ],
    codeFilename: 'proposals.rs',
    codePreview: `pub fn add_proposal(&mut self, proposal: ProposalInput) -> u64 {
    let policy = self.policy.get().unwrap();
    let sender = env::predecessor_account_id();
    
    assert!(policy.can_propose(&sender, &proposal.kind),
        "Not allowed to propose");
    
    let id = self.last_proposal_id;
    self.proposals.insert(&id, &Proposal {
        proposer: sender,
        kind: proposal.kind,
        status: ProposalStatus::InProgress,
        vote_counts: HashMap::new(),
        submission_time: env::block_timestamp(),
    });
    self.last_proposal_id += 1;
    id
}`,
  },
  {
    title: 'DeFi Vault',
    subtitle: 'Yield strategies and staking',
    icon: BarChart3,
    description: 'Composable DeFi vault with deposit/withdraw, yield strategies, auto-compounding, and share-based accounting. Real DeFi building blocks from scratch.',
    difficulty: 'Advanced',
    standard: 'Composable DeFi',
    tech: ['Rust', 'NEAR SDK', 'NEP-141', 'Math'],
    linesOfCode: '~800 lines',
    estimatedTime: '~5 hours',
    cloneUrl: '/sanctum?template=vault',
    walkthroughUrl: '/sanctum?template=vault',
    features: ['Share-based deposits', 'Yield strategies', 'Auto-compound', 'Slippage protection'],
    prerequisites: [
      { name: 'Token Standards', slug: '/learn/builder/token-standards' },
      { name: 'Testing & Debugging', slug: '/learn/builder/testing-debugging' },
      { name: 'Optimization', slug: '/learn/builder/optimization' },
    ],
    codeFilename: 'vault.rs',
    codePreview: `pub fn deposit(&mut self, amount: U128) -> U128 {
    let shares = if self.total_shares == 0 {
        amount.0
    } else {
        (amount.0 as u128 * self.total_shares) / self.total_assets
    };
    
    self.total_shares += shares;
    self.total_assets += amount.0;
    self.user_shares.insert(&env::predecessor_account_id(), &shares);
    
    U128(shares)
}`,
  },
  {
    title: 'Marketplace',
    subtitle: 'Buy, sell, trade anything',
    icon: Box,
    description: 'Full marketplace with listings, escrow, offers, and dispute resolution. Learn complex multi-party contract patterns and secure fund management.',
    difficulty: 'Advanced',
    standard: 'Escrow + Listings',
    tech: ['Rust', 'NEAR SDK', 'NEP-171', 'Escrow'],
    linesOfCode: '~700 lines',
    estimatedTime: '~4 hours',
    cloneUrl: '/sanctum?template=marketplace',
    walkthroughUrl: '/sanctum?template=marketplace',
    features: ['List & delist items', 'Escrow payments', 'Offer system', 'Fee distribution'],
    prerequisites: [
      { name: 'Building an NFT Contract', slug: '/learn/builder/building-an-nft-contract' },
      { name: 'Security Best Practices', slug: '/learn/builder/security-best-practices' },
    ],
    codeFilename: 'marketplace.rs',
    codePreview: `pub fn buy(&mut self, nft_contract_id: AccountId, token_id: TokenId) {
    let sale = self.sales.get(&(nft_contract_id.clone(), token_id.clone()))
        .expect("No sale found");
    
    let deposit = env::attached_deposit();
    assert!(deposit >= sale.price, "Insufficient deposit");
    
    // Transfer NFT to buyer
    ext_nft::nft_transfer(
        env::predecessor_account_id(),
        token_id,
        nft_contract_id,
        1,
        GAS_FOR_NFT_TRANSFER,
    );
    
    // Pay seller (minus fee)
    self.pay_seller(sale.owner_id, sale.price);
}`,
  },
  {
    title: 'AI Agent',
    subtitle: 'Autonomous on-chain agent',
    icon: Bot,
    description: 'Deploy an autonomous AI agent in a TEE enclave that manages keys, executes trades, and responds to on-chain events. The frontier of NEAR — where AI meets crypto.',
    difficulty: 'Advanced',
    standard: 'Shade Agent',
    tech: ['Rust', 'Python', 'TEE', 'Chain Signatures'],
    linesOfCode: '~1200 lines',
    estimatedTime: '~6 hours',
    cloneUrl: 'https://github.com/near-examples/near-intents-agent-example',
    walkthroughUrl: '/sanctum?template=agent',
    features: ['TEE execution', 'Key management', 'Event listeners', 'Multi-chain signing'],
    prerequisites: [
      { name: 'Chain Signatures', slug: '/learn/hacker/chain-signatures' },
      { name: 'AI Agent Integration', slug: '/learn/hacker/ai-agent-integration' },
    ],
    codeFilename: 'agent.rs',
    codePreview: `async fn handle_event(&self, event: ChainEvent) -> Result<Action> {
    match event {
        ChainEvent::PriceUpdate(price) => {
            if self.should_rebalance(price) {
                let swap = self.compute_rebalance(price);
                Ok(Action::Swap(swap))
            } else {
                Ok(Action::Hold)
            }
        }
        ChainEvent::NewBlock(block) => {
            self.process_pending_intents(block).await
        }
    }
}`,
  },
];

const DIFFICULTY_STYLES: Record<Difficulty, { badge: string; glow: string; color: string; border: string }> = {
  Beginner: {
    badge: 'bg-near-green/10 text-near-green border-near-green/20',
    glow: 'from-near-green/20',
    color: 'text-near-green',
    border: 'border-near-green/20',
  },
  Intermediate: {
    badge: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    glow: 'from-accent-cyan/20',
    color: 'text-accent-cyan',
    border: 'border-accent-cyan/20',
  },
  Advanced: {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    glow: 'from-purple-500/20',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
  },
};

const FILTERS: Array<'All' | Difficulty> = ['All', 'Beginner', 'Intermediate', 'Advanced'];

/* ─── Template Card ────────────────────────────────────────── */

function TemplateCard({ template, index }: { template: Template; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const Icon = template.icon;
  const styles = DIFFICULTY_STYLES[template.difficulty];

  const isExternalClone = template.cloneUrl.startsWith('http');

  const handleCopyClone = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`git clone ${template.cloneUrl}.git`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = `git clone ${template.cloneUrl}.git`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [template.cloneUrl]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <GlowCard className="h-full group" padding="none">
        {/* Top gradient accent */}
        <div className={cn('h-1 bg-gradient-to-r to-transparent', styles.glow)} />

        <div className="p-5 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className={cn('p-2.5 rounded-xl border shrink-0', styles.badge)}>
              <Icon className={cn('w-5 h-5', styles.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-text-primary group-hover:text-near-green transition-colors leading-tight">
                {template.title}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">{template.subtitle}</p>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide',
              styles.badge,
            )}>
              {template.difficulty}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-surface text-text-muted font-mono">
              {template.standard}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-text-muted font-mono">
              <FileCode className="w-3 h-3" />
              {template.linesOfCode}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-text-muted font-mono">
              <Clock className="w-3 h-3" />
              {template.estimatedTime}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed">{template.description}</p>

          {/* Prerequisites */}
          {template.prerequisites.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-text-muted">
              <span className="font-medium text-text-muted/70">Requires:</span>
              {template.prerequisites.map((prereq, i) => (
                <span key={prereq.slug} className="inline-flex items-center gap-0.5">
                  <Link
                    href={prereq.slug}
                    className="text-text-muted hover:text-near-green transition-colors underline underline-offset-2 decoration-border hover:decoration-near-green/40"
                  >
                    {prereq.name}
                  </Link>
                  {i < template.prerequisites.length - 1 && (
                    <span className="text-text-muted/40 ml-0.5">·</span>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-1.5">
            {template.features.map((feat) => (
              <div key={feat} className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-near-green shrink-0" />
                {feat}
              </div>
            ))}
          </div>

          {/* Code Preview Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn('flex items-center gap-1 text-xs font-medium transition-colors', styles.color, 'hover:opacity-80')}
          >
            <Code2 className="w-3 h-3" />
            {expanded ? 'Hide code preview' : 'Show code preview'}
            <motion.span animate={{ rotate: expanded ? 90 : 0 }}>
              <ChevronRight className="w-3 h-3" />
            </motion.span>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg bg-background/80 border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface/30">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3 h-3 text-text-muted" />
                      <span className="text-[10px] font-mono text-text-muted">{template.codeFilename}</span>
                    </div>
                    <span className="text-[9px] font-mono text-text-muted/50">PREVIEW</span>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-text-secondary leading-relaxed overflow-x-auto">
                    {template.codePreview}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {template.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-2 py-0.5 bg-background rounded border border-border text-text-muted"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
            {isExternalClone ? (
              <button onClick={handleCopyClone} className="flex-1">
                <Button variant="primary" size="sm" className="w-full group">
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Clone Template
                      <Github className="w-3 h-3 opacity-50" />
                    </>
                  )}
                </Button>
              </button>
            ) : (
              <Link href={template.cloneUrl} className="flex-1">
                <Button variant="primary" size="sm" className="w-full group">
                  <Sparkles className="w-3 h-3" />
                  Open in Sanctum
                </Button>
              </Link>
            )}
            <Link href={template.walkthroughUrl} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full group">
                <BookOpen className="w-3 h-3" />
                Walk Through
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export default function ProjectTemplates() {
  const [activeFilter, setActiveFilter] = useState<'All' | Difficulty>('All');

  const filtered = activeFilter === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.difficulty === activeFilter);

  return (
    <section id="templates" className="py-16 space-y-8">
      <SectionHeader
        title="Project Templates"
        badge="CLONE & BUILD"
        count={TEMPLATES.length}
      />

      <ScrollReveal>
        <div className="max-w-3xl space-y-3">
          <GradientText as="p" animated className="text-xl md:text-2xl font-bold mt-2">
            Production-Ready Templates. Clone, Customize, Deploy.
          </GradientText>
          <p className="text-text-secondary text-base leading-relaxed">
            Don&apos;t start from scratch. Each template is a battle-tested starting point with
            AI-guided walkthroughs in the Sanctum. Clone from GitHub, follow the guided tutorial,
            and ship to mainnet in hours — not weeks.
          </p>
        </div>
      </ScrollReveal>

      {/* Difficulty Filter */}
      <ScrollReveal delay={0.05}>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-text-muted" />
          {FILTERS.map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
                activeFilter === f
                  ? f === 'All' ? 'bg-near-green/10 text-near-green border-near-green/30'
                    : DIFFICULTY_STYLES[f as Difficulty].badge
                  : 'bg-surface text-text-muted border-border hover:text-text-secondary'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f}
              <span className="text-[10px] ml-1 opacity-60">
                ({f === 'All' ? TEMPLATES.length : TEMPLATES.filter(t => t.difficulty === f).length})
              </span>
            </motion.button>
          ))}
        </div>
      </ScrollReveal>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((template, i) => (
            <TemplateCard key={template.title} template={template} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Sanctum Integration Callout */}
      <ScrollReveal delay={0.2}>
        <GlowCard padding="lg" className="text-center">
          <div className="flex flex-col items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-near-green/20 to-purple-400/20 border border-near-green/30 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 15px rgba(0,236,151,0.15)',
                  '0 0 30px rgba(0,236,151,0.25)',
                  '0 0 15px rgba(0,236,151,0.15)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-6 h-6 text-near-green" />
            </motion.div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Every Template Includes AI-Powered Walkthroughs</h3>
              <p className="text-sm text-text-muted mt-1 max-w-md mx-auto">
                Click &ldquo;Walk Through&rdquo; on any template to open it in the Sanctum, where AI guides you
                through every line of code, explains concepts, and helps debug issues in real time.
              </p>
            </div>
            <Link href="/sanctum">
              <Button variant="primary" size="md" className="group">
                <Zap className="w-4 h-4" />
                Open Sanctum — AI Build Assistant
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </GlowCard>
      </ScrollReveal>
    </section>
  );
}
