'use client';

import { motion } from 'framer-motion';
import { Zap, Users, TrendingUp, Target, BarChart3, CheckCircle2, ArrowRight, Flame, Shield, Coins, Clock } from 'lucide-react';
import type { Opportunity, Category, GapScoreBreakdown } from '@/types';

interface Props {
  opportunity: Opportunity;
  category: Category;
  breakdown?: GapScoreBreakdown;
  activeBuilderCount: number;
}

// ── Deterministic headline based on void attributes ──
function getHeadline(difficulty: string, competition: string, score: number): string {
  if (competition === 'low' && score >= 85) {
    if (difficulty === 'beginner') return "An open field, a clear map, and a weekend to get started.";
    if (difficulty === 'intermediate') return "No one has claimed this corner of NEAR — yet. You could be the team that does.";
    return "A deep void at the frontier of NEAR. The builders who tackle these become ecosystem infrastructure.";
  }
  if (competition === 'low' && score >= 70) {
    if (difficulty === 'beginner') return "First-mover territory, solo-buildable. This is rare.";
    return "Low competition, real demand. The market is waiting for someone to show up.";
  }
  if (competition === 'low') return "First-mover opportunity. The audience exists — the product doesn't.";
  if (competition === 'medium' && score >= 80) {
    if (difficulty === 'beginner') return "A few teams are here, but none have nailed it. A sharper v1 wins.";
    return "The existing players left the door open. A focused, well-executed build takes the category.";
  }
  if (competition === 'medium') return "Room to compete. The market isn't saturated — there's space for a better approach.";
  if (difficulty === 'beginner') return "Competitive space, but the NEAR-native version is still up for grabs.";
  return "High competition signals real demand. The NEAR-native solution can differentiate and win.";
}

// ── Category-specific NEAR advantage ──
const NEAR_ADVANTAGES: Record<string, { title: string; body: string }> = {
  defi: {
    title: "NEAR makes DeFi economically viable for everyone",
    body: "Sub-cent gas fees eliminate the friction that killed similar ideas on Ethereum. Users who couldn't afford to participate there can participate freely here — that's a structural advantage every NEAR DeFi project benefits from.",
  },
  'data-analytics': {
    title: "On-chain data here is uniquely readable",
    body: "NEAR's human-readable account names and sharded architecture make indexing and analytics fundamentally different from address-based chains. Tools built here don't have to solve for hex soup — that's a real head start.",
  },
  infrastructure: {
    title: "Infrastructure builders on NEAR become load-bearing",
    body: "Every app in the ecosystem eventually depends on the infrastructure layer. The first to build and stabilize tooling here becomes the default — and defaults are hard to displace once they're trusted.",
  },
  gaming: {
    title: "1-second finality changes what's possible in games",
    body: "NEAR's speed and sub-cent fees mean in-game economies actually work. What's a thought experiment on Ethereum is a real product here — tradeable items, live tournaments, and player-owned assets that don't bankrupt users.",
  },
  nft: {
    title: "NEAR's storage model makes NFT UX actually good",
    body: "Storing metadata on-chain costs fractions of a cent. Users don't need to manage gas for every interaction. The UX gap between NEAR NFTs and what people expect from consumer apps is the smallest it's ever been.",
  },
  social: {
    title: "Chain abstraction makes NEAR social actually usable",
    body: "Non-crypto users can interact with NEAR social apps using familiar login flows. That onboarding gap — the biggest killer of Web3 social — is nearly solved here. The audience is reachable.",
  },
  identity: {
    title: "Named accounts are a built-in identity primitive",
    body: "NEAR accounts are human-readable by design — `alice.near` not `0x4ab3...`. Identity-layer products here have a native foundation that other chains have to bolt on or fake.",
  },
  dao: {
    title: "AstroDAO gives you a working governance foundation",
    body: "You don't have to build governance from scratch. AstroDAO is live, used, and composable. You can focus on the product problem rather than reinventing voting logic — a real build-time advantage.",
  },
  crosschain: {
    title: "Chain signatures make NEAR the cross-chain hub",
    body: "NEAR's chain signature technology lets you control wallets on any chain from a single NEAR account. No other chain offers this natively. Cross-chain products built here have a technical moat that's hard to replicate elsewhere.",
  },
  rwa: {
    title: "Regulatory-aware design is table stakes here",
    body: "NEAR's foundation in named accounts, whitelisting capabilities, and composable compliance tooling makes real-world asset tokenization structurally easier than on anonymous-address chains.",
  },
  default: {
    title: "NEAR's low fees change the economics",
    body: "Products that are economically unviable on high-fee chains become straightforward on NEAR. Users who would never pay $20 in gas will happily use a product where transactions cost fractions of a cent.",
  },
};

// ── Signal → empowerment card content ──
interface SignalCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  color: string;
  border: string;
  bg: string;
}

function getSignalCards(
  breakdown: GapScoreBreakdown | undefined,
  activeBuilderCount: number,
  competition: string
): SignalCard[] {
  const cards: SignalCard[] = [];
  if (!breakdown) return cards;

  const signals = [...breakdown.signals].sort((a, b) => b.value - a.value);

  for (const signal of signals.slice(0, 3)) {
    if (signal.label === 'Builder Gap' && signal.value >= 60) {
      const count = activeBuilderCount;
      cards.push({
        icon: Users,
        title: count === 0 ? "No active builders. You'd be first." : `Only ${count} active builder${count === 1 ? '' : 's'} in this space.`,
        body: count === 0
          ? "An empty field isn't a red flag — it's a runway. No one to race against, no entrenched incumbents to displace. The category is yours to define."
          : `With ${count} active project${count === 1 ? '' : 's'}, you're not walking into a crowded market. There's room to establish yourself as the go-to option.`,
        color: 'text-near-green',
        border: 'border-near-green/25',
        bg: 'bg-near-green/[0.05]',
      });
    } else if (signal.label === 'Dev Momentum' && signal.value >= 60) {
      cards.push({
        icon: Zap,
        title: "Development has slowed. The audience hasn't moved on.",
        body: "When builders stop shipping, users don't disappear — they wait. A fresh team entering a stalled category inherits the existing demand without fighting the incumbents for it.",
        color: 'text-cyan-400',
        border: 'border-cyan-400/25',
        bg: 'bg-cyan-400/[0.05]',
      });
    } else if (signal.label === 'Market Control' && signal.value >= 60) {
      const isLow = competition === 'low';
      cards.push({
        icon: TrendingUp,
        title: isLow ? "The market isn't owned by anyone yet." : "The market is fragmented — a challenger can win.",
        body: isLow
          ? "No single player has set the standard in this category. Whoever ships first and executes consistently becomes the default — and defaults are sticky."
          : "When the market is fragmented between a few players, a focused product with better UX or a sharper niche can take significant share without needing to outspend anyone.",
        color: 'text-violet-400',
        border: 'border-violet-400/25',
        bg: 'bg-violet-400/[0.05]',
      });
    } else if (signal.label === 'NEAR Focus' && signal.value >= 60) {
      cards.push({
        icon: Target,
        title: "NEAR Foundation has flagged this as a priority area.",
        body: "Strategic priority areas receive ecosystem grants, co-marketing, and developer support. Building in a priority area isn't just good timing — it means institutional tailwinds behind your launch.",
        color: 'text-amber-400',
        border: 'border-amber-400/25',
        bg: 'bg-amber-400/[0.05]',
      });
    } else if (signal.label === 'Untapped Demand' && signal.value >= 60) {
      cards.push({
        icon: BarChart3,
        title: "Demand exists and isn't being met right now.",
        body: "This isn't speculative — there's measurable signal from on-chain behavior and ecosystem activity that users want something in this category. You're not betting on a market forming. It's already there.",
        color: 'text-near-green',
        border: 'border-near-green/25',
        bg: 'bg-near-green/[0.05]',
      });
    }
  }

  // Pad to at least 2 cards if needed
  if (cards.length < 2 && competition === 'low') {
    cards.push({
      icon: Flame,
      title: "First-mover advantage is real and compounding.",
      body: "The first credible product in a category earns the search rankings, the developer mindshare, and the social proof. Every month without competition is a month of free user acquisition.",
      color: 'text-amber-400',
      border: 'border-amber-400/25',
      bg: 'bg-amber-400/[0.05]',
    });
  }

  return cards.slice(0, 3);
}

// ── Milestone path by difficulty ──
const MILESTONES = {
  beginner: [
    { label: 'Day 1', text: 'Bootstrap with create-near-app, define the core problem you\'re solving' },
    { label: 'Day 3', text: 'Core logic working locally — something you can demo to yourself' },
    { label: 'Week 2', text: 'Alpha on testnet, share with 5 builders in the NEAR ecosystem for feedback' },
    { label: 'Month 1', text: 'v1 on mainnet, first real users — apply for a NEAR foundation grant' },
  ],
  intermediate: [
    { label: 'Week 1', text: 'Architecture defined, smart contract skeleton deployed on testnet' },
    { label: 'Week 3', text: 'Core contract logic complete, basic UI functional end-to-end' },
    { label: 'Month 2', text: 'Closed beta with 10–20 real users, refining based on actual feedback' },
    { label: 'Month 3', text: 'Mainnet v1 launch, foundation grant application, ecosystem partnerships' },
  ],
  advanced: [
    { label: 'Month 1', text: 'Deep technical research complete, architecture spec finalized and peer-reviewed' },
    { label: 'Month 2', text: 'Core protocol running on testnet, security properties defined' },
    { label: 'Month 4', text: 'Audit complete, mainnet deployment ready, documentation shipped' },
    { label: 'Month 6', text: 'Public launch, ecosystem integrations live, grant funding secured' },
  ],
};

export function VoidOpportunityPanel({ opportunity, category, breakdown, activeBuilderCount }: Props) {
  const headline = getHeadline(opportunity.difficulty, opportunity.competition_level, opportunity.gap_score);
  const nearAdvantage = NEAR_ADVANTAGES[category.slug] ?? NEAR_ADVANTAGES.default;
  const signalCards = getSignalCards(breakdown, activeBuilderCount, opportunity.competition_level);
  const milestones = MILESTONES[opportunity.difficulty] ?? MILESTONES.intermediate;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Empowerment Headline ── */}
      <div className="relative overflow-hidden rounded-2xl border border-near-green/20 bg-gradient-to-br from-near-green/[0.07] via-transparent to-cyan-400/[0.04] p-5 sm:p-6">
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-near-green/50 to-transparent" />
        <div className="absolute top-3 left-6 w-24 h-24 rounded-full bg-near-green/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-near-green" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-near-green/70 font-semibold">The Opportunity</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-white leading-snug max-w-2xl">
            {headline}
          </p>
          {opportunity.competition_level === 'low' && activeBuilderCount === 0 && (
            <p className="text-sm text-text-secondary max-w-xl">
              Every major NEAR protocol started as a void exactly like this one. The builders who moved early didn&apos;t have more information — they just moved.
            </p>
          )}
        </div>
      </div>

      {/* ── Why This Matters — Signal Cards ── */}
      {signalCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {signalCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06 }}
              className={`rounded-xl border ${card.border} ${card.bg} p-4 space-y-2`}
            >
              <div className="flex items-center gap-2">
                <card.icon className={`w-4 h-4 ${card.color} shrink-0`} />
                <span className={`text-xs font-bold ${card.color}`}>{card.title}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── NEAR Advantage ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4 flex items-start gap-4"
      >
        <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mt-0.5">
          <Shield className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-bold text-cyan-300">{nearAdvantage.title}</p>
          <p className="text-xs text-text-secondary leading-relaxed">{nearAdvantage.body}</p>
        </div>
      </motion.div>

      {/* ── What v1 Looks Like ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-text-muted/60" />
          <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted/70 font-semibold">If You Started Today</h3>
          <span className="text-[10px] font-mono text-text-muted/40 ml-auto">
            {opportunity.difficulty === 'beginner' ? 'Solo-buildable' : opportunity.difficulty === 'intermediate' ? 'Small team' : 'Experienced team'}
          </span>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gradient-to-b from-near-green/40 via-cyan-400/20 to-transparent hidden sm:block" />

          <div className="space-y-3">
            {milestones.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center border mt-0.5 ${
                  i === 0 ? 'bg-near-green/20 border-near-green/40' : 'bg-white/[0.04] border-white/[0.10]'
                }`}>
                  {i === 0
                    ? <ArrowRight className="w-3 h-3 text-near-green" />
                    : <CheckCircle2 className="w-3 h-3 text-text-muted/40" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold ${i === 0 ? 'text-near-green' : 'text-text-muted/60'} uppercase tracking-[0.15em]`}>
                      {step.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-snug mt-0.5">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Grant nudge */}
        <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
          <p className="text-[11px] text-text-muted/60">
            NEAR Foundation grants for this category range{' '}
            <span className="text-amber-300 font-semibold">
              {opportunity.gap_score >= 80 ? '$25K–$50K+' : opportunity.gap_score >= 60 ? '$10K–$25K' : '$5K–$10K'}
            </span>
            {' '}— apply after your testnet launch.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
