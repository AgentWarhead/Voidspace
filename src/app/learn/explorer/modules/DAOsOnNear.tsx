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
  BookOpen, Clock, CheckCircle2, ChevronDown,
  Users, Vote, Landmark, FileText,
  Shield, Wallet, Scale, Eye,
  AlertTriangle, MessagesSquare, Handshake,
} from 'lucide-react';

// ─── DAO Concept Explorer ──────────────────────────────────────────────────────

function DAOConceptExplorer() {
  const [activeConcept, setActiveConcept] = useState(0);

  const concepts = [
    {
      icon: Users,
      title: 'What are DAOs?',
      emoji: '🏛️',
      tagline: 'Organizations run by code and community.',
      description: 'A DAO (Decentralized Autonomous Organization) is a community-led entity with no central leadership. Decisions are made through proposals and on-chain voting by token holders or members. Smart contracts enforce the rules — treasury management, membership, and governance are all transparent and automated.',
      nearProject: 'Astro DAO',
      howItWorks: [
        'A DAO is created with a smart contract defining governance rules',
        'Members join by holding tokens, receiving council roles, or being approved',
        'Anyone (or council members) can submit proposals — funding, policy, bounties',
        'Members vote on proposals within a defined voting period',
        'If the proposal passes, the smart contract executes it automatically',
      ],
      risk: 'Low voter participation can lead to decisions by a small minority. Always vote on proposals you care about.',
    },
    {
      icon: Landmark,
      title: 'Astro DAO',
      emoji: '🚀',
      tagline: 'The DAO launchpad on NEAR.',
      description: 'Astro DAO (built on SputnikDAO v2 contracts) is the primary platform for creating and managing DAOs on NEAR. It provides a user-friendly interface for creating DAOs, managing proposals, handling treasury, and coordinating community governance. Hundreds of DAOs run on Astro, from developer guilds to creative collectives.',
      nearProject: 'app.astrodao.com',
      howItWorks: [
        'Visit Astro DAO and connect your NEAR wallet',
        'Create a new DAO or join an existing one',
        'Configure governance: voting policy, bond amounts, council members',
        'Submit proposals: transfer funds, add members, change policy, bounties',
        'Track all activity transparently — every vote and transaction is on-chain',
      ],
      risk: 'DAO bonds (deposits for proposals) are forfeited if a proposal is rejected. Understand the rules before proposing.',
    },
    {
      icon: Vote,
      title: 'Voting & Proposals',
      emoji: '🗳️',
      tagline: 'How decisions are made in DAOs.',
      description: 'DAO proposals are the mechanism for collective decision-making. Common proposal types include funding requests (transfer NEAR/tokens), bounties (pay for completed work), policy changes (modify governance rules), and membership changes (add/remove council). Each DAO sets its own voting thresholds and periods.',
      nearProject: 'SputnikDAO v2',
      howItWorks: [
        'A member creates a proposal with a description and requested action',
        'They attach a bond (small NEAR deposit) to prevent spam',
        'Council members or token holders vote: Approve, Reject, or Abstain',
        'Voting period lasts a defined time (commonly 24-72 hours)',
        'If threshold is met (e.g., >50% approval), the action executes on-chain',
      ],
      risk: 'Read proposals carefully before voting. Once approved, smart contract actions execute automatically and are irreversible.',
    },
    {
      icon: Wallet,
      title: 'Treasury',
      emoji: '💰',
      tagline: 'Community-controlled funds, fully transparent.',
      description: 'A DAO treasury holds community funds in a smart contract — visible to everyone on the blockchain. Spending requires a governance proposal and vote. This prevents any single person from misusing funds. NEAR DAOs can hold NEAR tokens, fungible tokens, and even NFTs in their treasury.',
      nearProject: 'On-chain Treasury',
      howItWorks: [
        'The DAO smart contract acts as a multi-sig wallet',
        'Funds are deposited by members, grants, or revenue streams',
        'Any spending requires a proposal and successful vote',
        'Treasury balance is publicly visible on NearBlocks',
        'Some DAOs diversify — holding NEAR, stablecoins, and other tokens',
      ],
      risk: 'Treasury governance is critical. Ensure proposals have adequate voting periods and thresholds to prevent rushed spending.',
    },
  ];

  const concept = concepts[activeConcept];
  const Icon = concept.icon;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {concepts.map((c, i) => (
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
            <div className="text-xl mb-1">{c.emoji}</div>
            <div className={cn('text-xs font-medium', activeConcept === i ? 'text-near-green' : 'text-text-muted')}>
              {c.title}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeConcept}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 text-near-green" />
              <h3 className="text-xl font-bold text-text-primary">{concept.title}</h3>
            </div>
            <p className="text-near-green text-sm font-medium mb-3">{concept.tagline}</p>
            <p className="text-text-secondary leading-relaxed mb-4">{concept.description}</p>

            <div className="p-3 rounded-lg bg-surface border border-border mb-4">
              <div className="text-xs text-text-muted mb-1">On NEAR →</div>
              <div className="text-sm text-near-green font-bold">{concept.nearProject}</div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">How It Works</h4>
              <div className="space-y-2">
                {concept.howItWorks.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <span className="text-near-green font-mono text-xs font-bold mt-0.5">{i + 1}</span>
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/15">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">Note</span>
              </div>
              <p className="text-xs text-text-secondary">{concept.risk}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Notable NEAR DAOs ─────────────────────────────────────────────────────────

function NotableDAOs() {
  const daos = [
    { name: 'NEAR Digital Collective (NDC)', desc: 'The grassroots governance initiative for the NEAR ecosystem. Community-elected houses that allocate ecosystem funding.', members: 'Ecosystem-wide', type: 'Governance' },
    { name: 'Marketing DAO', desc: 'Funds marketing initiatives, events, and awareness campaigns for the NEAR ecosystem.', members: 'Council-based', type: 'Funding' },
    { name: 'Developer DAO', desc: 'Supports developer education, tooling grants, and technical content creation on NEAR.', members: 'Council-based', type: 'Grants' },
    { name: 'Creatives DAO', desc: 'Supports artists, musicians, and creative projects building on NEAR. Funds NFT collections and cultural events.', members: 'Open membership', type: 'Creative' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {daos.map((d) => (
        <GlowCard key={d.name} padding="md">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="w-4 h-4 text-near-green" />
            <h4 className="font-bold text-text-primary text-sm">{d.name}</h4>
          </div>
          <p className="text-xs text-text-secondary mb-2">{d.desc}</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] text-text-muted">
              <Users className="w-3 h-3" />
              <span>{d.members}</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 font-bold shadow-sm shadow-emerald-500/10">
              {d.type}
            </span>
          </div>
        </GlowCard>
      ))}
    </div>
  );
}

// ─── Interactive: Explore DAO Proposals ────────────────────────────────────────

function ExploreProposals() {
  const [activeProposal, setActiveProposal] = useState(0);

  const proposals = [
    {
      id: '#142',
      title: 'Fund Community Meetup in Lagos',
      type: 'Transfer',
      amount: '500 NEAR',
      status: 'Approved',
      votes: { yes: 4, no: 1 },
      description: 'Request to fund a NEAR community meetup in Lagos, Nigeria. Covers venue rental, refreshments, and speaker compensation.',
    },
    {
      id: '#143',
      title: 'Add New Council Member',
      type: 'Membership',
      amount: 'N/A',
      status: 'In Progress',
      votes: { yes: 2, no: 0 },
      description: 'Proposal to add alice.near as a council member. Alice has contributed to 12 bounties and been active in governance discussions.',
    },
    {
      id: '#144',
      title: 'Update Voting Policy',
      type: 'Policy',
      amount: 'N/A',
      status: 'Rejected',
      votes: { yes: 1, no: 3 },
      description: 'Proposal to reduce the voting period from 72 hours to 24 hours. Rejected due to concerns about insufficient participation time.',
    },
  ];

  const proposal = proposals[activeProposal];

  return (
    <Card variant="default" padding="lg" className="border-near-green/20">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-near-green" />
        <h3 className="font-bold text-text-primary">🗳️ Explore DAO Proposals</h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        Here&apos;s what real DAO proposals look like. Click through to see different types:
      </p>

      <div className="flex gap-2 mb-4">
        {proposals.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActiveProposal(i)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              activeProposal === i
                ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-surface text-text-muted border border-border hover:border-border-hover'
            )}
          >
            {p.id}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeProposal}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="p-4 rounded-lg bg-surface border border-border"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-text-primary text-sm">{proposal.title}</h4>
            <span className={cn(
              'text-[9px] px-2 py-0.5 rounded-full font-bold',
              proposal.status === 'Approved' ? 'bg-green-500/10 text-green-400' :
              proposal.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
              'bg-red-500/10 text-red-400'
            )}>
              {proposal.status}
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-3">{proposal.description}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-background">
              <div className="text-[10px] text-text-muted">Type</div>
              <div className="text-xs text-text-primary font-medium">{proposal.type}</div>
            </div>
            <div className="p-2 rounded bg-background">
              <div className="text-[10px] text-text-muted">Amount</div>
              <div className="text-xs text-near-green font-medium">{proposal.amount}</div>
            </div>
            <div className="p-2 rounded bg-background">
              <div className="text-[10px] text-text-muted">Votes</div>
              <div className="text-xs text-text-primary font-medium">
                <span className="text-green-400">{proposal.votes.yes}✓</span>
                {' / '}
                <span className="text-red-400">{proposal.votes.no}✗</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 p-3 rounded-lg bg-near-green/5 border border-near-green/15">
        <p className="text-xs text-near-green">
          💡 Visit <span className="font-mono">app.astrodao.com</span> to explore real DAOs and their proposals.
          Join a DAO that aligns with your interests — most are open to new members!
        </p>
      </div>
    </Card>
  );
}

// ─── DAO Glossary ──────────────────────────────────────────────────────────────

function DAOGlossary() {
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);

  const terms = [
    { term: 'DAO', full: 'Decentralized Autonomous Organization', definition: 'A community-governed entity where rules are encoded in smart contracts. Decisions require proposals and votes.' },
    { term: 'Proposal', full: 'Governance Proposal', definition: 'A formal request submitted to a DAO — funding, membership changes, policy updates, or bounties.' },
    { term: 'Bond', full: 'Proposal Bond', definition: 'A small NEAR deposit required to submit a proposal. Returned if approved, forfeited if rejected (prevents spam).' },
    { term: 'Council', full: 'DAO Council', definition: 'A group of trusted members with voting power. Councils often have elevated permissions like creating proposals.' },
    { term: 'Quorum', full: 'Voting Quorum', definition: 'The minimum number of votes required for a proposal to be valid. Prevents decisions by tiny minorities.' },
    { term: 'Multi-sig', full: 'Multi-Signature', definition: 'A wallet that requires multiple approvals to execute a transaction. DAOs are essentially programmable multi-sigs.' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {terms.map((t, i) => (
        <GlowCard key={t.term} padding="md" onClick={() => setExpandedTerm(expandedTerm === i ? null : i)}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-near-green font-mono font-bold text-sm">{t.term}</span>
              <span className="text-xs text-text-muted">— {t.full}</span>
            </div>
            <motion.div animate={{ rotate: expandedTerm === i ? 180 : 0 }}>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </motion.div>
          </div>
          <AnimatePresence>
            {expandedTerm === i && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-xs text-text-secondary mt-2 pt-2 border-t border-border overflow-hidden"
              >
                {t.definition}
              </motion.p>
            )}
          </AnimatePresence>
        </GlowCard>
      ))}
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

export function DAOsOnNear() {
  return (
    <Container size="md">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 14 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            14 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            DAOs on NEAR
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            <span className="text-near-green font-medium">Decentralized Autonomous Organizations</span> —
            community-governed entities where code is law and every voice counts.
          </p>
        </div>
      </ScrollReveal>

      {/* What are DAOs */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
              <Scale className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Why DAOs Matter</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            DAOs are <span className="text-near-green font-medium">organizations without bosses</span>.
            Instead of a CEO making decisions, members propose and vote. Instead of a CFO controlling the budget,
            a smart contract manages the treasury. Everything is transparent, auditable, and governed by the community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { emoji: '🏛️', title: 'Transparent', desc: 'Every decision and transaction is on-chain' },
              { emoji: '🗳️', title: 'Democratic', desc: 'Members vote on proposals and changes' },
              { emoji: '🔐', title: 'Trustless', desc: 'Smart contracts enforce rules — no need to trust individuals' },
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

      {/* How to Participate */}
      <ScrollReveal delay={0.12}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
              <Handshake className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">How to Join a DAO</h2>
          </div>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Find a DAO', desc: 'Browse DAOs on app.astrodao.com — filter by category (DeFi, NFT, Social, Grants).' },
              { step: '2', title: 'Join the Community', desc: 'Most DAOs have Telegram or Discord groups. Introduce yourself and learn the culture.' },
              { step: '3', title: 'Start Contributing', desc: 'Pick up bounties, participate in discussions, and show up consistently.' },
              { step: '4', title: 'Vote & Propose', desc: 'Once you\'re a member, vote on proposals and eventually submit your own.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border">
                <span className="text-near-green font-mono font-bold text-lg">{item.step}</span>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm">{item.title}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Core Concepts */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">💡 DAO Deep Dive</h3>
          <p className="text-sm text-text-muted mb-6">Explore the building blocks of DAOs on NEAR.</p>
          <DAOConceptExplorer />
        </div>
      </ScrollReveal>

      {/* Notable DAOs */}
      <ScrollReveal delay={0.18}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">🏆 Notable NEAR DAOs</h3>
          <NotableDAOs />
        </div>
      </ScrollReveal>

      {/* Interactive: Explore Proposals */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <ExploreProposals />
        </div>
      </ScrollReveal>

      {/* Glossary */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📖 DAO Glossary</h3>
          <DAOGlossary />
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
              'DAOs are community-governed organizations where decisions are made through proposals and on-chain voting.',
              'Astro DAO (SputnikDAO v2) is the primary DAO platform on NEAR — hundreds of DAOs run on it.',
              'Proposals can request funds, change membership, update policies, or create bounties.',
              'Treasury management is transparent — every token movement requires a community vote.',
              'The NEAR Digital Collective (NDC) brings ecosystem-wide governance to NEAR.',
              'Join a DAO that interests you — start with bounties, build reputation, then help govern.',
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
        <MarkComplete moduleSlug="daos-on-near" />
      </ScrollReveal>
    </Container>
  );
}
