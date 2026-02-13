'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';
import {
  BookOpen, Clock, CheckCircle2,
  Search, Blocks, ArrowRightLeft, User, FileCode,
  Activity, Eye,
} from 'lucide-react';

// ─── Explorer Concept Cards ────────────────────────────────────────────────────

function ExplorerConcepts() {
  const [activeConcept, setActiveConcept] = useState(0);

  const concepts = [
    {
      icon: Blocks,
      title: 'Blocks',
      description: 'A block is a container of transactions. On NEAR, a new block is produced every ~1 second.',
      details: [
        'Block Height — the sequence number (like page numbers in a book)',
        'Block Hash — the unique cryptographic identifier',
        'Timestamp — when the block was produced',
        'Transactions — the list of operations included',
        'Gas Used — total computational resources consumed',
      ],
      tip: 'On NearBlocks, the homepage shows the latest blocks in real-time. Click any block to see its contents.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Transactions',
      description: 'A transaction is an action initiated by an account — transfers, contract calls, staking, etc.',
      details: [
        'Transaction Hash (Tx Hash) — unique ID to look up any transaction',
        'Sender & Receiver — who initiated and who received',
        'Actions — what happened (transfer, function call, etc.)',
        'Gas Burned — computational cost',
        'Status — Success ✓ or Failure ✗',
      ],
      tip: 'Search any Tx Hash on NearBlocks to see the full details. Share the hash with others as proof.',
    },
    {
      icon: User,
      title: 'Accounts',
      description: 'Every user and contract on NEAR is an account. Accounts can hold tokens, keys, and deploy code.',
      details: [
        'Account ID — human-readable name (alice.near)',
        'Balance — NEAR tokens held',
        'Staked — tokens locked for staking',
        'Storage Used — bytes of on-chain storage consumed',
        'Access Keys — list of authorized keys',
      ],
      tip: 'Search any account name to see its balance, transactions, and deployed contracts.',
    },
    {
      icon: FileCode,
      title: 'Contract Calls',
      description: 'When someone interacts with a smart contract, it generates a detailed receipt trail.',
      details: [
        'Method Name — which function was called',
        'Arguments — the input data (often JSON)',
        'Receipts — internal execution steps',
        'Logs — messages the contract outputs',
        'Result — return value or error message',
      ],
      tip: 'Expand any contract call transaction to see receipts and logs. This is how you debug and verify.',
    },
    {
      icon: Activity,
      title: 'Network Stats',
      description: 'Real-time metrics about the NEAR network health and activity.',
      details: [
        'TPS — transactions per second (current throughput)',
        'Total Accounts — all accounts ever created',
        'Validators — nodes securing the network',
        'Gas Price — current cost per unit of gas',
        'NEAR Price — current market price',
      ],
      tip: 'Check network stats to understand current network load and health before deploying.',
    },
  ];

  const concept = concepts[activeConcept];
  const Icon = concept.icon;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {concepts.map((c, i) => {
          const CIcon = c.icon;
          return (
            <button
              key={c.title}
              onClick={() => setActiveConcept(i)}
              className={cn(
                'p-3 rounded-lg border text-center transition-all',
                activeConcept === i
                  ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 border-emerald-500/30'
                  : 'bg-surface border-border hover:border-border-hover'
              )}
            >
              <CIcon className={cn('w-5 h-5 mx-auto mb-1', activeConcept === i ? 'text-near-green' : 'text-text-muted')} />
              <div className={cn('text-xs font-medium', activeConcept === i ? 'text-near-green' : 'text-text-muted')}>
                {c.title}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeConcept}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon className="w-5 h-5 text-near-green" />
              <h3 className="text-lg font-bold text-text-primary">{concept.title}</h3>
            </div>
            <p className="text-sm text-text-secondary mb-4">{concept.description}</p>

            <div className="space-y-2 mb-4">
              {concept.details.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-2 rounded-lg bg-surface border border-border"
                >
                  <span className="text-near-green font-mono text-xs font-bold mt-0.5">•</span>
                  <span className="text-sm text-text-secondary">{detail}</span>
                </motion.div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-near-green/5 border border-near-green/15">
              <p className="text-xs text-near-green">💡 {concept.tip}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Detective Challenge ───────────────────────────────────────────────────────

function DetectiveChallenge() {
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const challenges = [
    {
      quest: 'Find the total balance of "root.near" account',
      hint: 'Search "root.near" on NearBlocks. The balance is shown at the top of the account page.',
      difficulty: 'Easy',
    },
    {
      quest: 'Find how many transactions "ref-finance.near" has processed',
      hint: 'Search "ref-finance.near" → look at the transaction count on the overview tab.',
      difficulty: 'Easy',
    },
    {
      quest: 'Find the most recent method called on "app.nearcrowd.near"',
      hint: 'Go to the account → Transactions tab → look at the most recent transaction → Method column.',
      difficulty: 'Medium',
    },
    {
      quest: 'Determine if "aurora" contract has a full access key (is it upgradeable?)',
      hint: 'Search "aurora" → Access Keys tab → check if any key has "Full Access" permission.',
      difficulty: 'Medium',
    },
    {
      quest: 'Find the gas price of the latest block',
      hint: 'Go to NearBlocks homepage → click the latest block → look at "Gas Price" field.',
      difficulty: 'Hard',
    },
  ];

  return (
    <Card variant="default" padding="lg" className="border-near-green/20">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-near-green" />
        <h3 className="font-bold text-text-primary">🕵️ Chain Detective Challenges</h3>
      </div>
      <p className="text-sm text-text-muted mb-4">
        Try these challenges on <span className="text-near-green">nearblocks.io</span>. Click &ldquo;Reveal Hint&rdquo; if you get stuck.
      </p>

      <div className="space-y-3">
        {challenges.map((c, i) => (
          <div key={i} className="p-4 rounded-lg bg-surface border border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-near-green font-mono text-xs font-bold">#{i + 1}</span>
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                    c.difficulty === 'Easy' ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 text-emerald-400' :
                    c.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-red-500/10 text-red-400'
                  )}>
                    {c.difficulty}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">{c.quest}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRevealedHints({ ...revealedHints, [i]: !revealedHints[i] })}
              >
                {revealedHints[i] ? 'Hide' : 'Hint'}
              </Button>
            </div>
            <AnimatePresence>
              {revealedHints[i] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 pt-3 border-t border-border text-xs text-near-green">
                    💡 {c.hint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Tools Comparison ──────────────────────────────────────────────────────────

function ExplorerTools() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GlowCard padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🔍</span>
          <h4 className="font-bold text-text-primary">NearBlocks</h4>
        </div>
        <p className="text-sm text-text-secondary mb-3">
          The primary block explorer for NEAR. Think of it as Google for the blockchain.
        </p>
        <ul className="space-y-1 text-xs text-text-muted">
          <li>• Block & transaction search</li>
          <li>• Account explorer</li>
          <li>• Contract inspection</li>
          <li>• Token tracking</li>
          <li>• Real-time analytics</li>
        </ul>
        <div className="mt-3 text-xs text-near-green">nearblocks.io</div>
      </GlowCard>

      <GlowCard padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📊</span>
          <h4 className="font-bold text-text-primary">Pikespeak</h4>
        </div>
        <p className="text-sm text-text-secondary mb-3">
          Advanced analytics and data APIs. For deeper research and data querying.
        </p>
        <ul className="space-y-1 text-xs text-text-muted">
          <li>• Account analytics</li>
          <li>• DeFi data</li>
          <li>• Historical trends</li>
          <li>• API access</li>
          <li>• Custom queries</li>
        </ul>
        <div className="mt-3 text-xs text-near-green">pikespeak.ai</div>
      </GlowCard>
    </div>
  );
}

// ─── Mark Complete ─────────────────────────────────────────────────────────────

function MarkComplete({ moduleSlug }: { moduleSlug: string }) {
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      return !!progress[moduleSlug];
    } catch { return false; }
  });

  const handleComplete = () => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      progress[moduleSlug] = true;
      localStorage.setItem('voidspace-explorer-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch { /* noop */ }
  };

  return (
    <div className="flex justify-center">
      <Button
        variant={completed ? 'secondary' : 'primary'}
        size="lg"
        onClick={handleComplete}
        leftIcon={completed ? <CheckCircle2 className="w-5 h-5" /> : undefined}
        className={completed ? 'border-near-green/30 text-near-green' : ''}
      >
        {completed ? 'Module Completed ✓' : 'Mark as Complete'}
      </Button>
    </div>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

export function ReadingTheExplorer() {
  return (
    <Container size="md">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 9 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            12 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            Reading the Explorer
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Become a <span className="text-near-green font-medium">chain detective</span>.
            Learn to decode blocks, transactions, and accounts like a pro.
          </p>
        </div>
      </ScrollReveal>

      {/* Why Explorers Matter */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Why Learn to Read Explorers?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            A block explorer is your <span className="text-near-green font-medium">window into the blockchain</span>.
            Every transaction, every account, every contract — it&apos;s all there, public and permanent.
            Being able to read it is like learning to read a map in an unfamiliar territory.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { emoji: '✅', title: 'Verify', desc: 'Confirm transactions went through' },
              { emoji: '🔍', title: 'Research', desc: 'Investigate projects before investing' },
              { emoji: '🐛', title: 'Debug', desc: 'Figure out why a transaction failed' },
            ].map((item) => (
              <div key={item.title} className="p-3 rounded-lg bg-surface border border-border text-center">
                <div className="text-xl mb-1">{item.emoji}</div>
                <h4 className="font-bold text-text-primary text-sm">{item.title}</h4>
                <p className="text-[10px] text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Explorer Concepts */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">📖 Key Concepts</h3>
          <p className="text-sm text-text-muted mb-6">Click each concept to learn what to look for.</p>
          <ExplorerConcepts />
        </div>
      </ScrollReveal>

      {/* Tools */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">🛠️ Your Explorer Toolkit</h3>
          <ExplorerTools />
        </div>
      </ScrollReveal>

      {/* Detective Challenges */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <DetectiveChallenge />
        </div>
      </ScrollReveal>

      {/* Key Takeaways */}
      <ScrollReveal delay={0.3}>
        <Card variant="glass" padding="lg" className="mb-12 border-near-green/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-near-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {[
              'Block explorers are your window into the blockchain — everything is public.',
              'Key concepts: blocks (containers), transactions (actions), accounts (identities).',
              'NearBlocks is the primary explorer; Pikespeak is for advanced analytics.',
              'You can verify any transaction, inspect any contract, and research any account.',
              'Being able to read explorers is a superpower — it turns you from a passive user to an informed detective.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-near-green mt-0.5 font-bold">→</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.35}>
        <MarkComplete moduleSlug="reading-the-explorer" />
      </ScrollReveal>
    </Container>
  );
}
