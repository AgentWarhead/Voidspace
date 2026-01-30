'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { BriefSection } from './BriefSection';
import { useToast } from '@/contexts/ToastContext';
import type { ProjectBrief } from '@/types';

interface BriefDisplayProps {
  brief: ProjectBrief;
}

export function BriefDisplay({ brief }: BriefDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  function briefToMarkdown(): string {
    const lines: string[] = [];
    lines.push(`# ${brief.projectNames[0]}`);
    lines.push(`> Suggested names: ${brief.projectNames.join(', ')}\n`);
    lines.push(`## Problem Statement\n${brief.problemStatement}\n`);
    lines.push(`## Solution Overview\n${brief.solutionOverview}\n`);
    lines.push(`## Target Users`);
    brief.targetUsers.forEach((u) => lines.push(`- ${u}`));
    lines.push('');
    lines.push(`## Key Features`);
    brief.keyFeatures.forEach((f) =>
      lines.push(`- **${f.name}** (${f.priority}): ${f.description}`)
    );
    lines.push('');
    lines.push(`## Technical Requirements`);
    lines.push(`### Frontend\n${brief.technicalRequirements.frontend.map((t) => `- ${t}`).join('\n')}`);
    lines.push(`### Backend\n${brief.technicalRequirements.backend.map((t) => `- ${t}`).join('\n')}`);
    lines.push(`### Blockchain\n${brief.technicalRequirements.blockchain.map((t) => `- ${t}`).join('\n')}\n`);
    lines.push(`## NEAR Technology\n${brief.nearTechStack.explanation}\n`);
    const nearTech = [];
    if (brief.nearTechStack.useShadeAgents) nearTech.push('Shade Agents');
    if (brief.nearTechStack.useIntents) nearTech.push('NEAR Intents');
    if (brief.nearTechStack.useChainSignatures) nearTech.push('Chain Signatures');
    if (nearTech.length) lines.push(`Recommended: ${nearTech.join(', ')}\n`);
    lines.push(`## Void Landscape\n${brief.competitiveLandscape}\n`);
    lines.push(`## Monetization Ideas`);
    brief.monetizationIdeas.forEach((m) => lines.push(`- ${m}`));
    lines.push('');
    lines.push(`## Build Complexity`);
    lines.push(`- Difficulty: ${brief.buildComplexity.difficulty}`);
    lines.push(`- Timeline: ${brief.buildComplexity.estimatedTimeline}`);
    lines.push(`- Team: ${brief.buildComplexity.teamSize}\n`);
    if (brief.resources?.length) {
      lines.push(`## Resources`);
      brief.resources.forEach((r) => lines.push(`- [${r.title}](${r.url}) (${r.type})`));
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
    a.download = `${brief.projectNames[0]?.replace(/\s+/g, '-').toLowerCase() || 'brief'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Brief downloaded', 'success');
  }

  return (
    <div className="space-y-3">
      {/* Header with project names */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Project Names</h3>
          <div className="flex flex-wrap gap-2">
            {brief.projectNames.map((name, i) => (
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

      {/* Target Users */}
      <BriefSection title="Target Users" icon={<Users className="w-4 h-4" />}>
        <ul className="space-y-1.5">
          {brief.targetUsers.map((user, i) => (
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
          {brief.keyFeatures.map((feature, i) => (
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
              {brief.technicalRequirements.frontend.map((item, i) => (
                <li key={i} className="text-xs text-text-secondary">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">Backend</h4>
            <ul className="space-y-1">
              {brief.technicalRequirements.backend.map((item, i) => (
                <li key={i} className="text-xs text-text-secondary">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">Blockchain</h4>
            <ul className="space-y-1">
              {brief.technicalRequirements.blockchain.map((item, i) => (
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
            {brief.nearTechStack.useShadeAgents && (
              <Badge variant="default">Shade Agents</Badge>
            )}
            {brief.nearTechStack.useIntents && (
              <Badge variant="default">NEAR Intents</Badge>
            )}
            {brief.nearTechStack.useChainSignatures && (
              <Badge variant="default">Chain Signatures</Badge>
            )}
          </div>
          <p className="text-sm text-text-secondary">{brief.nearTechStack.explanation}</p>
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
          {brief.monetizationIdeas.map((idea, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="text-near-green mt-1">-</span>
              {idea}
            </li>
          ))}
        </ul>
      </BriefSection>

      {/* Build Complexity */}
      <BriefSection title="Build Complexity" icon={<Gauge className="w-4 h-4" />}>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-surface-hover text-center">
            <p className="text-xs text-text-muted mb-1">Difficulty</p>
            <Badge variant="difficulty" difficulty={brief.buildComplexity.difficulty}>
              {brief.buildComplexity.difficulty}
            </Badge>
          </div>
          <div className="p-3 rounded-lg bg-surface-hover text-center">
            <p className="text-xs text-text-muted mb-1">Timeline</p>
            <p className="text-sm font-medium text-text-primary">{brief.buildComplexity.estimatedTimeline}</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-hover text-center">
            <p className="text-xs text-text-muted mb-1">Team</p>
            <p className="text-sm font-medium text-text-primary">{brief.buildComplexity.teamSize}</p>
          </div>
        </div>
      </BriefSection>

      {/* Resources */}
      {brief.resources && brief.resources.length > 0 && (
        <BriefSection title="Resources" icon={<BookOpen className="w-4 h-4" />}>
          <div className="space-y-2">
            {brief.resources.map((resource, i) => (
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

      {/* Powered By Data Sources */}
      <div className="pt-4 border-t border-border">
        <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Powered By</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {['Ecosystem', 'DeFiLlama', 'GitHub', 'NearBlocks', 'FastNEAR', 'Pikespeak'].map((source) => (
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
