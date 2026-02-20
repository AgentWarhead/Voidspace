'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lightbulb, Target, Users, Layers, Code2, Boxes, TrendingUp, DollarSign,
  Gauge, BookOpen, Copy, Check, Download, FileText, Clock, Rocket, Coins,
  Share2, Heart, Zap, Shield, ChevronRight, ExternalLink,
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { useToast } from '@/contexts/ToastContext';
import { storeBriefForSanctum } from '@/lib/brief-to-sanctum';
import type { ProjectBrief } from '@/types';
import { motion } from 'framer-motion';

const SAVED_BRIEFS_KEY = 'voidspace-saved-briefs';

function getBriefFingerprint(brief: ProjectBrief): string {
  const raw = `${(brief.projectNames ?? []).join('|')}::${brief.problemStatement ?? ''}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `brief_${Math.abs(hash).toString(36)}`;
}

function getSavedBriefs(): Record<string, { brief: ProjectBrief; savedAt: string }> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(SAVED_BRIEFS_KEY) || '{}'); }
  catch { return {}; }
}
function saveBriefToLocal(brief: ProjectBrief) {
  const id = getBriefFingerprint(brief);
  const saved = getSavedBriefs();
  saved[id] = { brief, savedAt: new Date().toISOString() };
  localStorage.setItem(SAVED_BRIEFS_KEY, JSON.stringify(saved));
}
function removeBriefFromLocal(brief: ProjectBrief) {
  const id = getBriefFingerprint(brief);
  const saved = getSavedBriefs();
  delete saved[id];
  localStorage.setItem(SAVED_BRIEFS_KEY, JSON.stringify(saved));
}
function isBriefSavedLocally(brief: ProjectBrief): boolean {
  return getBriefFingerprint(brief) in getSavedBriefs();
}

// Assign a color per target user (cycles)
const USER_COLORS = [
  { border: 'border-near-green/25', bg: 'bg-near-green/[0.06]', text: 'text-near-green', emoji: '🛠️' },
  { border: 'border-cyan-400/25', bg: 'bg-cyan-400/[0.06]', text: 'text-cyan-400', emoji: '💻' },
  { border: 'border-violet-400/25', bg: 'bg-violet-400/[0.06]', text: 'text-violet-400', emoji: '🚀' },
  { border: 'border-amber-400/25', bg: 'bg-amber-400/[0.06]', text: 'text-amber-400', emoji: '🎯' },
  { border: 'border-rose-400/25', bg: 'bg-rose-400/[0.06]', text: 'text-rose-400', emoji: '⚡' },
];

// Priority color for features
const PRIORITY_STYLES: Record<string, { badge: string; border: string; bg: string }> = {
  'must-have': { badge: 'bg-near-green/15 text-near-green border border-near-green/25', border: 'border-near-green/20', bg: 'bg-near-green/[0.04]' },
  'should-have': { badge: 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/20', border: 'border-cyan-400/15', bg: 'bg-cyan-400/[0.03]' },
  'nice-to-have': { badge: 'bg-white/[0.06] text-text-muted border border-white/[0.08]', border: 'border-white/[0.08]', bg: 'bg-white/[0.02]' },
};

const DIFFICULTY_STYLES: Record<string, { color: string; glow: string; label: string }> = {
  beginner: { color: 'text-near-green', glow: 'border-near-green/30 bg-near-green/[0.06]', label: 'Beginner' },
  intermediate: { color: 'text-amber-400', glow: 'border-amber-400/30 bg-amber-400/[0.06]', label: 'Intermediate' },
  advanced: { color: 'text-rose-400', glow: 'border-rose-400/30 bg-rose-400/[0.06]', label: 'Advanced' },
};

interface BriefDisplayProps {
  brief: ProjectBrief;
  onStartBuild?: (brief: ProjectBrief) => void;
  opportunityId?: string;
}

export function BriefDisplay({ brief, onStartBuild }: BriefDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => { setIsFavorited(isBriefSavedLocally(brief)); }, [brief]);

  const toggleFavorite = useCallback(() => {
    if (isFavorited) {
      removeBriefFromLocal(brief);
      setIsFavorited(false);
      addToast('Removed from favorites', 'success');
    } else {
      saveBriefToLocal(brief);
      setIsFavorited(true);
      addToast('Saved to favorites ❤️', 'success');
    }
  }, [isFavorited, brief, addToast]);

  const projectNames = brief.projectNames ?? [];
  const targetUsers = brief.targetUsers ?? [];
  const keyFeatures = brief.keyFeatures ?? [];
  const techReqs = brief.technicalRequirements ?? { frontend: [], backend: [], blockchain: [] };
  const frontend = techReqs.frontend ?? [];
  const backend = techReqs.backend ?? [];
  const blockchain = techReqs.blockchain ?? [];
  const monetizationIdeas = brief.monetizationIdeas ?? [];
  const nextSteps = brief.nextSteps ?? [];
  const fundingOpportunities = brief.fundingOpportunities ?? [];
  const resources = brief.resources ?? [];
  const nearTechStack = brief.nearTechStack ?? { explanation: '', useShadeAgents: false, useIntents: false, useChainSignatures: false };
  const buildComplexity = brief.buildComplexity ?? { difficulty: 'intermediate', estimatedTimeline: 'Unknown', teamSize: 'Unknown' };
  const diffStyle = DIFFICULTY_STYLES[buildComplexity.difficulty] ?? DIFFICULTY_STYLES.intermediate;

  function briefToMarkdown(): string {
    const lines: string[] = [];
    lines.push(`# ${projectNames[0] || 'Untitled Project'}`);
    lines.push(`> Suggested names: ${projectNames.join(', ')}\n`);
    lines.push(`## Problem Statement\n${brief.problemStatement || ''}\n`);
    lines.push(`## Solution Overview\n${brief.solutionOverview || ''}\n`);
    if (brief.whyNow) lines.push(`## Why Now\n${brief.whyNow}\n`);
    lines.push(`## Target Users`);
    targetUsers.forEach((u) => lines.push(`- ${u}`));
    lines.push('');
    lines.push(`## Key Features`);
    keyFeatures.forEach((f) => lines.push(`- **${f.name}** (${f.priority}): ${f.description}`));
    lines.push('');
    lines.push(`## Technical Requirements`);
    lines.push(`### Frontend\n${frontend.map((t) => `- ${t}`).join('\n')}`);
    lines.push(`### Backend\n${backend.map((t) => `- ${t}`).join('\n')}`);
    lines.push(`### Blockchain\n${blockchain.map((t) => `- ${t}`).join('\n')}\n`);
    lines.push(`## NEAR Technology\n${nearTechStack.explanation}\n`);
    lines.push(`## Void Landscape\n${brief.competitiveLandscape || ''}\n`);
    lines.push(`## Monetization Ideas`);
    monetizationIdeas.forEach((m) => lines.push(`- ${m}`));
    lines.push('');
    if (nextSteps.length) {
      lines.push(`## Next Steps — Week 1`);
      nextSteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
      lines.push('');
    }
    lines.push(`## Build Complexity`);
    lines.push(`- Difficulty: ${buildComplexity.difficulty}`);
    lines.push(`- Timeline: ${buildComplexity.estimatedTimeline}`);
    lines.push(`- Team: ${buildComplexity.teamSize}\n`);
    if (resources.length) {
      lines.push(`## Resources`);
      resources.forEach((r) => lines.push(`- [${r.title}](${r.url}) (${r.type})`));
    }
    return lines.join('\n');
  }

  async function copyAsMarkdown() {
    await navigator.clipboard.writeText(briefToMarkdown());
    addToast('Brief copied as Markdown', 'success');
  }

  async function copyBrief() {
    await navigator.clipboard.writeText(JSON.stringify(brief, null, 2));
    setCopied(true);
    addToast('Brief JSON copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectNames[0]?.replace(/\s+/g, '-').toLowerCase() || 'brief'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Brief downloaded', 'success');
  }

  function shareOnX() {
    const text = `I just found a void in the NEAR ecosystem and got an AI-generated mission brief from Voidspace.\n\nProject idea: ${projectNames[0] || 'New NEAR Project'}\n\n${(brief.problemStatement || '').slice(0, 120)}...\n\nFind your void:`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    addToast('Opening X to share', 'success');
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Header: Project Names + Actions ── */}
      <div className="flex items-start justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted/50">Suggested Names</p>
          <div className="flex flex-wrap gap-2">
            {projectNames.map((name, i) => (
              <span key={i} className="px-3 py-1 rounded-full border border-near-green/25 bg-near-green/[0.08] text-near-green text-sm font-semibold">
                {name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1 shrink-0 flex-wrap justify-end">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-lg transition-all hover:scale-110 ${isFavorited ? 'text-red-400 hover:text-red-300 bg-red-400/10' : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'}`}
            title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <Button variant="ghost" size="sm" onClick={copyAsMarkdown} leftIcon={<FileText className="w-3.5 h-3.5" />}>Markdown</Button>
          <Button variant="ghost" size="sm" onClick={downloadJSON} leftIcon={<Download className="w-3.5 h-3.5" />}>JSON</Button>
          <Button variant="ghost" size="sm" onClick={copyBrief} leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}>{copied ? 'Copied' : 'Copy'}</Button>
          <Button variant="ghost" size="sm" onClick={shareOnX} leftIcon={<Share2 className="w-3.5 h-3.5" />}>Share</Button>
        </div>
      </div>

      {/* ── Problem + Solution ── side by side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Problem Statement */}
        <div className="p-4 rounded-xl border border-rose-400/15 bg-rose-400/[0.03] space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-rose-400/70 font-semibold">The Problem</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{brief.problemStatement}</p>
        </div>
        {/* Solution Overview */}
        <div className="p-4 rounded-xl border border-near-green/15 bg-near-green/[0.03] space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-near-green shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-near-green/70 font-semibold">The Solution</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{brief.solutionOverview}</p>
        </div>
      </div>

      {/* ── Why Now ── */}
      {brief.whyNow && (
        <div className="p-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.03] space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-400/70 font-semibold">Why Now</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{brief.whyNow}</p>
        </div>
      )}

      {/* ── Target Users → Persona Cards ── */}
      {targetUsers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-text-muted/60" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted/70 font-semibold">Who Needs This</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {targetUsers.map((user, i) => {
              const c = USER_COLORS[i % USER_COLORS.length];
              return (
                <div key={i} className={`p-3 rounded-xl border ${c.border} ${c.bg} flex items-start gap-3`}>
                  <span className="text-lg shrink-0">{c.emoji}</span>
                  <p className={`text-xs leading-snug ${c.text === 'text-near-green' ? 'text-text-secondary' : 'text-text-secondary'}`}>{user}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Key Features ── */}
      {keyFeatures.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-text-muted/60" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted/70 font-semibold">Key Features</h3>
          </div>
          <div className="space-y-2">
            {keyFeatures.map((feature, i) => {
              const ps = PRIORITY_STYLES[feature.priority] ?? PRIORITY_STYLES['nice-to-have'];
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${ps.border} ${ps.bg}`}>
                  <div className="shrink-0 w-5 h-5 rounded-full border border-near-green/25 bg-near-green/10 flex items-center justify-center mt-0.5">
                    <span className="text-[10px] font-bold text-near-green">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-text-primary">{feature.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${ps.badge}`}>{feature.priority}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-snug">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tech Stack ── */}
      {(frontend.length > 0 || backend.length > 0 || blockchain.length > 0) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="w-4 h-4 text-text-muted/60" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted/70 font-semibold">Technical Stack</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Frontend', items: frontend, color: 'text-cyan-400', border: 'border-cyan-400/15', bg: 'bg-cyan-400/[0.03]' },
              { label: 'Backend', items: backend, color: 'text-violet-400', border: 'border-violet-400/15', bg: 'bg-violet-400/[0.03]' },
              { label: 'Blockchain', items: blockchain, color: 'text-near-green', border: 'border-near-green/15', bg: 'bg-near-green/[0.03]' },
            ].map(({ label, items, color, border, bg }) => items.length > 0 && (
              <div key={label} className={`p-3 rounded-xl border ${border} ${bg}`}>
                <p className={`text-[10px] font-mono uppercase tracking-[0.15em] ${color} font-semibold mb-2`}>{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item, i) => (
                    <span key={i} className="text-[10px] font-mono text-text-secondary bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-md">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NEAR Tech Stack ── */}
      {nearTechStack.explanation && (
        <div className="p-4 rounded-xl border border-near-green/20 bg-near-green/[0.04] space-y-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-near-green shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-near-green/70 font-semibold">NEAR-Specific Technology</span>
          </div>
          {(nearTechStack.useShadeAgents || nearTechStack.useIntents || nearTechStack.useChainSignatures) && (
            <div className="flex flex-wrap gap-2">
              {nearTechStack.useShadeAgents && (
                <span className="text-xs font-mono px-3 py-1 rounded-full border border-near-green/30 bg-near-green/10 text-near-green font-semibold">Shade Agents</span>
              )}
              {nearTechStack.useIntents && (
                <span className="text-xs font-mono px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 font-semibold">NEAR Intents</span>
              )}
              {nearTechStack.useChainSignatures && (
                <span className="text-xs font-mono px-3 py-1 rounded-full border border-violet-400/30 bg-violet-400/10 text-violet-400 font-semibold">Chain Signatures</span>
              )}
            </div>
          )}
          <p className="text-sm text-text-secondary leading-relaxed">{nearTechStack.explanation}</p>
        </div>
      )}

      {/* ── Competitive Landscape ── */}
      {brief.competitiveLandscape && (
        <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-text-muted/60 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted/70 font-semibold">Void Landscape</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{brief.competitiveLandscape}</p>
        </div>
      )}

      {/* ── Monetization ── */}
      {monetizationIdeas.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-400/70 font-semibold">Revenue Model</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {monetizationIdeas.map((idea, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04]">
                <Coins className="w-4 h-4 text-amber-400/60 shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary leading-snug">{idea}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Next Steps (Week 1) ── */}
      {nextSteps.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-400/70 font-semibold">Week 1 — Get Moving</h3>
          </div>
          <div className="space-y-2">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="shrink-0 w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mt-0.5">
                  <span className="text-[11px] font-bold text-cyan-400">{i + 1}</span>
                </div>
                <p className="text-sm text-text-secondary leading-snug">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Funding Opportunities ── */}
      {fundingOpportunities.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-violet-400" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-violet-400/70 font-semibold">Funding Opportunities</h3>
          </div>
          <div className="flex flex-col gap-2">
            {fundingOpportunities.map((fund, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-violet-400/15 bg-violet-400/[0.04]">
                <ChevronRight className="w-4 h-4 text-violet-400/60 shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary leading-snug">{fund}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Build Complexity ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="w-4 h-4 text-text-muted/60" />
          <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted/70 font-semibold">Build Complexity</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-4 rounded-xl border ${diffStyle.glow} text-center space-y-1`}>
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60">Difficulty</p>
            <p className={`text-base font-bold font-mono ${diffStyle.color}`}>{diffStyle.label}</p>
          </div>
          <div className="p-4 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] text-center space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60">Timeline</p>
            <p className="text-sm font-bold text-cyan-300">{buildComplexity.estimatedTimeline}</p>
          </div>
          <div className="p-4 rounded-xl border border-violet-400/15 bg-violet-400/[0.04] text-center space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60">Team Size</p>
            <p className="text-sm font-bold text-violet-300">{buildComplexity.teamSize}</p>
          </div>
        </div>
      </div>

      {/* ── Resources ── */}
      {resources.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-text-muted/60" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted/70 font-semibold">Resources</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {resources.map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
              >
                <Badge variant="default">{resource.type}</Badge>
                <span className="text-sm text-text-primary group-hover:text-near-green transition-colors flex-1 truncate">
                  {resource.title}
                </span>
                <ExternalLink className="w-3 h-3 text-text-muted/40 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Build This in Sanctum CTA ── */}
      <div className="pt-4">
        <button
          onClick={() => {
            if (onStartBuild) {
              onStartBuild(brief);
            } else {
              storeBriefForSanctum(brief);
              router.push('/sanctum?from=brief');
              addToast('Opening Sanctum with your brief...', 'success');
            }
          }}
          className="w-full group relative overflow-hidden inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-near-green text-void-black font-semibold text-base hover:shadow-[0_0_30px_rgba(0,236,151,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Rocket className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Build This in Sanctum</span>
          <span className="relative z-10 text-void-black/60">→</span>
        </button>
        <p className="text-center text-[11px] text-text-muted mt-2">
          AI-powered development studio · Your brief will be pre-loaded
        </p>
      </div>

      {/* ── Data Sources ── */}
      <div className="pt-2 border-t border-border">
        <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Powered By</p>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
          {['NearBlocks', 'Pikespeak', 'FastNEAR', 'DexScreener', 'DefiLlama', 'Mintbase', 'GitHub', 'AstroDAO', 'NEAR RPC', 'Registry'].map((source) => (
            <span key={source} className="text-[10px] font-mono text-near-green/70 bg-near-green/5 border border-near-green/10 rounded px-2 py-1 text-center">{source}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
