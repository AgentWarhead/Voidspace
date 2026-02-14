'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lightbulb,
  Target,
  Users,
  Layers,
  Code2,
  Boxes,
  TrendingUp,
  DollarSign,
  Gauge,
  BookOpen,
  Copy,
  Check,
  Download,
  FileText,
  Clock,
  Rocket,
  Coins,
  Share2,
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { BriefSection } from './BriefSection';
import { useToast } from '@/contexts/ToastContext';
import { storeBriefForSanctum } from '@/lib/brief-to-sanctum';
import type { ProjectBrief } from '@/types';

interface BriefDisplayProps {
  brief: ProjectBrief;
  /** Optional callback when user clicks "Build in Sanctum" (used on Sanctum page itself) */
  onStartBuild?: (brief: ProjectBrief) => void;
}

export function BriefDisplay({ brief, onStartBuild }: BriefDisplayProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  // Defensive: ensure all expected arrays exist
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
    keyFeatures.forEach((f) =>
      lines.push(`- **${f.name}** (${f.priority}): ${f.description}`)
    );
    lines.push('');
    lines.push(`## Technical Requirements`);
    lines.push(`### Frontend\n${frontend.map((t) => `- ${t}`).join('\n')}`);
    lines.push(`### Backend\n${backend.map((t) => `- ${t}`).join('\n')}`);
    lines.push(`### Blockchain\n${blockchain.map((t) => `- ${t}`).join('\n')}\n`);
    lines.push(`## NEAR Technology\n${nearTechStack.explanation}\n`);
    const nearTech = [];
    if (nearTechStack.useShadeAgents) nearTech.push('Shade Agents');
    if (nearTechStack.useIntents) nearTech.push('NEAR Intents');
    if (nearTechStack.useChainSignatures) nearTech.push('Chain Signatures');
    if (nearTech.length) lines.push(`Recommended: ${nearTech.join(', ')}\n`);
    lines.push(`## Void Landscape\n${brief.competitiveLandscape || ''}\n`);
    lines.push(`## Monetization Ideas`);
    monetizationIdeas.forEach((m) => lines.push(`- ${m}`));
    lines.push('');
    if (nextSteps.length) {
      lines.push(`## Next Steps — Week 1`);
      nextSteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
      lines.push('');
    }
    if (fundingOpportunities.length) {
      lines.push(`## Funding Opportunities`);
      fundingOpportunities.forEach((f) => lines.push(`- ${f}`));
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
    <div className="space-y-3">
      {/* Header with project names */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Project Names</h3>
          <div className="flex flex-wrap gap-2">
            {projectNames.map((name, i) => (
              <Badge key={i} variant="default">{name}</Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyAsMarkdown}
            leftIcon={<FileText className="w-3.5 h-3.5" />}
          >
            Markdown
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadJSON}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyBrief}
            leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={shareOnX}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
          >
            Share
          </Button>
        </div>
      </div>

      {/* Problem Statement */}
      <BriefSection title="Problem Statement" icon={<Target className="w-4 h-4" />}>
        <p className="text-sm text-text-secondary leading-relaxed">
          {brief.problemStatement}
        </p>
      </BriefSection>

      {/* Solution Overview */}
      <BriefSection title="Solution Overview" icon={<Lightbulb className="w-4 h-4" />}>
        <p className="text-sm text-text-secondary leading-relaxed">
          {brief.solutionOverview}
        </p>
      </BriefSection>

      {/* Why Now */}
      {brief.whyNow && (
        <BriefSection title="Why Now" icon={<Clock className="w-4 h-4" />}>
          <p className="text-sm text-text-secondary leading-relaxed">
            {brief.whyNow}
          </p>
        </BriefSection>
      )}

      {/* Target Users */}
      <BriefSection title="Target Users" icon={<Users className="w-4 h-4" />}>
        <ul className="space-y-1.5">
          {targetUsers.map((user, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="text-near-green mt-1">-</span>
              {user}
            </li>
          ))}
        </ul>
      </BriefSection>

      {/* Key Features */}
      <BriefSection title="Key Features" icon={<Layers className="w-4 h-4" />}>
        <div className="space-y-2">
          {keyFeatures.map((feature, i) => (
            <div key={i} className="p-3 rounded-lg bg-surface-hover">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-text-primary">{feature.name}</span>
                <Badge variant={feature.priority === 'must-have' ? 'default' : 'difficulty'}>
                  {feature.priority}
                </Badge>
              </div>
              <p className="text-xs text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </BriefSection>

      {/* Technical Requirements */}
      <BriefSection title="Technical Requirements" icon={<Code2 className="w-4 h-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">Frontend</h4>
            <ul className="space-y-1">
              {frontend.map((item, i) => (
                <li key={i} className="text-xs text-text-secondary">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">Backend</h4>
            <ul className="space-y-1">
              {backend.map((item, i) => (
                <li key={i} className="text-xs text-text-secondary">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">Blockchain</h4>
            <ul className="space-y-1">
              {blockchain.map((item, i) => (
                <li key={i} className="text-xs text-text-secondary">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </BriefSection>

      {/* NEAR Tech Stack */}
      <BriefSection title="NEAR Technology" icon={<Boxes className="w-4 h-4" />}>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {nearTechStack.useShadeAgents && (
              <Badge variant="default">Shade Agents</Badge>
            )}
            {nearTechStack.useIntents && (
              <Badge variant="default">NEAR Intents</Badge>
            )}
            {nearTechStack.useChainSignatures && (
              <Badge variant="default">Chain Signatures</Badge>
            )}
          </div>
          <p className="text-sm text-text-secondary">{nearTechStack.explanation}</p>
        </div>
      </BriefSection>

      {/* Competitive Landscape */}
      <BriefSection title="Void Landscape" icon={<TrendingUp className="w-4 h-4" />}>
        <p className="text-sm text-text-secondary leading-relaxed">
          {brief.competitiveLandscape}
        </p>
      </BriefSection>

      {/* Monetization */}
      <BriefSection title="Monetization Ideas" icon={<DollarSign className="w-4 h-4" />}>
        <ul className="space-y-1.5">
          {monetizationIdeas.map((idea, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="text-near-green mt-1">-</span>
              {idea}
            </li>
          ))}
        </ul>
      </BriefSection>

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <BriefSection title="Next Steps — Week 1" icon={<Rocket className="w-4 h-4" />}>
          <ol className="space-y-1.5">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-near-green font-mono text-xs mt-0.5">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </BriefSection>
      )}

      {/* Funding Opportunities */}
      {fundingOpportunities.length > 0 && (
        <BriefSection title="Funding Opportunities" icon={<Coins className="w-4 h-4" />}>
          <ul className="space-y-1.5">
            {fundingOpportunities.map((fund, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-near-green mt-1">-</span>
                {fund}
              </li>
            ))}
          </ul>
        </BriefSection>
      )}

      {/* Build Complexity */}
      <BriefSection title="Build Complexity" icon={<Gauge className="w-4 h-4" />}>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-surface-hover text-center">
            <p className="text-xs text-text-muted mb-1">Difficulty</p>
            <Badge variant="difficulty" difficulty={buildComplexity.difficulty}>
              {buildComplexity.difficulty}
            </Badge>
          </div>
          <div className="p-3 rounded-lg bg-surface-hover text-center">
            <p className="text-xs text-text-muted mb-1">Timeline</p>
            <p className="text-sm font-medium text-text-primary">{buildComplexity.estimatedTimeline}</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-hover text-center">
            <p className="text-xs text-text-muted mb-1">Team</p>
            <p className="text-sm font-medium text-text-primary">{buildComplexity.teamSize}</p>
          </div>
        </div>
      </BriefSection>

      {/* Resources */}
      {resources.length > 0 && (
        <BriefSection title="Resources" icon={<BookOpen className="w-4 h-4" />}>
          <div className="space-y-2">
            {resources.map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <Badge variant="default">{resource.type}</Badge>
                <span className="text-sm text-text-primary hover:text-near-green transition-colors">
                  {resource.title}
                </span>
              </a>
            ))}
          </div>
        </BriefSection>
      )}

      {/* Build This in Sanctum CTA */}
      <div className="pt-6 pb-2">
        <button
          onClick={() => {
            if (onStartBuild) {
              // Already on Sanctum page — use the callback directly
              onStartBuild(brief);
            } else {
              // On opportunity page — store brief and navigate to Sanctum
              storeBriefForSanctum(brief);
              router.push('/sanctum?from=brief');
              addToast('Opening Sanctum with your brief...', 'success');
            }
          }}
          className="w-full group relative overflow-hidden inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-near-green text-void-black font-semibold text-base hover:shadow-[0_0_30px_rgba(0,236,151,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Animated shimmer */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Rocket className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Build This in Sanctum</span>
          <span className="relative z-10 text-void-black/60">→</span>
        </button>
        <p className="text-center text-[11px] text-text-muted mt-2">
          AI-powered development studio • Your brief will be pre-loaded
        </p>
      </div>

      {/* Powered By Data Sources */}
      <div className="pt-4 border-t border-border">
        <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Powered By</p>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
          {['NearBlocks', 'Pikespeak', 'FastNEAR', 'DexScreener', 'DefiLlama', 'Mintbase', 'GitHub', 'AstroDAO', 'NEAR RPC', 'Registry'].map((source) => (
            <span
              key={source}
              className="text-[10px] font-mono text-near-green/70 bg-near-green/5 border border-near-green/10 rounded px-2 py-1 text-center"
            >
              {source}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
