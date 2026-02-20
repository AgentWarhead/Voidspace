'use client';

import { TrendingUp, Users, Clock, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import type { Opportunity, Category, GapScoreBreakdown as GapScoreBreakdownType } from '@/types';

interface VoidMotivationPanelProps {
  opportunity: Opportunity;
  category: Category;
  activeBuilderCount: number;
  breakdown?: GapScoreBreakdownType;
}

// ── Part 1: Empowerment Headline logic ───────────────────────────────────────
function getEmpowermentHeadline(
  competitionLevel: 'low' | 'medium' | 'high',
  gapScore: number,
  activeBuilderCount: number,
): string {
  if (activeBuilderCount === 0) {
    return "Zero active builders. You'd be the founding team.";
  }
  if (competitionLevel === 'low') {
    return gapScore >= 70
      ? 'Nobody owns this space on NEAR. You could be first.'
      : 'The field is clear — this void is waiting for a builder.';
  }
  if (competitionLevel === 'medium') {
    return gapScore >= 75
      ? 'Strong signal, manageable competition — this is a winnable space.'
      : 'Some builders are nearby, but the gap is real.';
  }
  // high
  if (gapScore >= 80) {
    return 'High competition — but this score says the gap is still massive.';
  }
  return 'Competitive space, but proven demand. Quality wins here.';
}

const competitionBorder: Record<'low' | 'medium' | 'high', string> = {
  low: 'border-l-near-green',
  medium: 'border-l-amber-400',
  high: 'border-l-rose-400',
};

const competitionCardStyle: Record<'low' | 'medium' | 'high', string> = {
  low: 'border-near-green/20 bg-near-green/[0.04]',
  medium: 'border-amber-400/20 bg-amber-400/[0.04]',
  high: 'border-rose-400/20 bg-rose-400/[0.04]',
};

// ── Part 2: Gap Strength badge ───────────────────────────────────────────────
function getGapStrengthBadge(gapScore: number): { label: string; color: string } {
  if (gapScore >= 80) return { label: 'Exceptional', color: 'text-near-green bg-near-green/10 border-near-green/20' };
  if (gapScore >= 65) return { label: 'Strong', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' };
  return { label: 'Moderate', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' };
}

// ── Part 2: Build Window text ────────────────────────────────────────────────
function getBuildWindow(difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
  if (difficulty === 'beginner') return 'Weeks not months';
  if (difficulty === 'intermediate') return 'Ready in a quarter';
  return 'Ambitious but achievable';
}

// ── Part 3: NEAR-specific advantage ──────────────────────────────────────────
function getNearAdvantage(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes('defi') || s.includes('swap') || s.includes('dex')) {
    return "NEAR's <2s finality + sub-cent gas means DeFi UX that Ethereum can't match.";
  }
  if (s.includes('nft') || s.includes('collectible') || s.includes('art')) {
    return "NEAR's low mint costs and account-based storage make NFT UX dramatically simpler.";
  }
  if (s.includes('gaming') || s.includes('game')) {
    return "NEAR Intents enable gasless gameplay — players never touch gas tokens.";
  }
  if (s.includes('dao') || s.includes('governance')) {
    return 'Named accounts + social primitives make on-chain governance legible to non-crypto users.';
  }
  if (s.includes('infrastructure') || s.includes('tool') || s.includes('dev')) {
    return "NEAR's contract-call model and Aurora EVM compatibility gives you the broadest builder reach.";
  }
  if (s.includes('bridge') || s.includes('cross-chain') || s.includes('crosschain')) {
    return "NEAR Intents already solve cross-chain UX — you're building on the right side of history.";
  }
  return "NEAR's account model and sub-cent fees remove the friction that kills adoption elsewhere.";
}

// ── Part 4: Milestone timeline ────────────────────────────────────────────────
type Milestone = { step: string; text: string };

const MILESTONES: Record<'beginner' | 'intermediate' | 'advanced', Milestone[]> = {
  beginner: [
    { step: 'Week 1', text: 'Smart contract skeleton + basic tests' },
    { step: 'Week 2', text: 'Frontend MVP + wallet connect' },
    { step: 'Week 3–4', text: 'Testnet deploy + first user feedback' },
  ],
  intermediate: [
    { step: 'Month 1', text: 'Architecture + core contracts built' },
    { step: 'Month 2', text: 'Full integration + testnet live' },
    { step: 'Month 3', text: 'Security audit + mainnet launch' },
  ],
  advanced: [
    { step: 'Month 1–2', text: 'Protocol design + team alignment' },
    { step: 'Month 3–4', text: 'Core contracts + integration layer' },
    { step: 'Month 5–6', text: 'Audit → mainnet → growth' },
  ],
};

export function VoidMotivationPanel({
  opportunity,
  category,
  activeBuilderCount,
  breakdown: _breakdown,
}: VoidMotivationPanelProps) {
  const { gap_score, competition_level, difficulty } = opportunity;

  const headline = getEmpowermentHeadline(competition_level, gap_score, activeBuilderCount);
  const gapBadge = getGapStrengthBadge(gap_score);
  const buildWindow = getBuildWindow(difficulty);
  const nearReason = getNearAdvantage(category.slug);
  const milestones = MILESTONES[difficulty] ?? MILESTONES.intermediate;

  // Builder vacuum display
  const builderVacuumValue =
    activeBuilderCount === 0
      ? 'Wide Open'
      : activeBuilderCount === 1
        ? '1 active builder'
        : `${activeBuilderCount} active builders`;
  const builderVacuumSub = activeBuilderCount === 0 ? "You'd be the pioneer" : null;

  return (
    <div className="space-y-4">
      <SectionHeader title="Builder Intelligence" badge="NO AI REQUIRED" />

      {/* ── Part 1: Empowerment Headline ─────────────────────────────────────── */}
      <div
        className={`rounded-xl border border-l-4 ${competitionCardStyle[competition_level]} ${competitionBorder[competition_level]} px-5 py-4`}
      >
        <p className="text-lg font-bold text-text-primary">{headline}</p>
      </div>

      {/* ── Part 2: Three "Why This Matters" cards ───────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {/* Gap Strength */}
        <div className="rounded-xl border border-near-green/20 bg-near-green/[0.05] px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-near-green shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted">Gap Strength</span>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold font-mono text-near-green">{gap_score}</span>
            <span className="text-[10px] text-text-muted font-mono">/100</span>
          </div>
          <span
            className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border w-fit ${gapBadge.color}`}
          >
            {gapBadge.label}
          </span>
        </div>

        {/* Builder Vacuum */}
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted">Builder Vacuum</span>
          </div>
          <span className="text-sm font-bold text-cyan-400 leading-tight">{builderVacuumValue}</span>
          {builderVacuumSub && (
            <span className="text-[10px] text-text-muted font-mono">{builderVacuumSub}</span>
          )}
        </div>

        {/* Build Window */}
        <div className="rounded-xl border border-violet-400/20 bg-violet-400/[0.05] px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted">Build Window</span>
          </div>
          <span className="text-sm font-bold text-violet-400 leading-tight">{buildWindow}</span>
        </div>
      </div>

      {/* ── Part 3: NEAR-Specific Advantage ─────────────────────────────────── */}
      <div className="rounded-xl border border-near-green/20 bg-near-green/[0.04] p-4 flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <Zap className="w-4 h-4 text-near-green" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-near-green/70 font-semibold">
            Why NEAR Is Right
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">{nearReason}</p>
        </div>
      </div>

      {/* ── Part 4: "What v1 Looks Like" Timeline ───────────────────────────── */}
      <div className="space-y-2">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">What v1 Looks Like</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {milestones.map((milestone, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 flex flex-col gap-0.5 min-w-[140px]">
                <span className="text-[10px] font-mono text-text-muted">{milestone.step}</span>
                <span className="text-xs text-text-primary leading-snug">{milestone.text}</span>
              </div>
              {i < milestones.length - 1 && (
                <span className="text-text-muted/40 text-sm shrink-0 hidden sm:inline">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
