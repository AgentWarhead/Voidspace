import type { ProjectBrief } from '@/types';

const STORAGE_KEY = 'sanctum-brief-context';

/**
 * Convert a ProjectBrief into a rich, structured Sanctum prompt
 * that gives the AI builder full context to start the project.
 */
export function briefToSanctumPrompt(brief: ProjectBrief): string {
  const projectName = brief.projectNames?.[0] || 'My NEAR Project';
  const mustHaves = (brief.keyFeatures ?? [])
    .filter((f) => f.priority === 'must-have')
    .map((f) => f.name);
  const niceToHaves = (brief.keyFeatures ?? [])
    .filter((f) => f.priority === 'nice-to-have')
    .map((f) => f.name);

  const nearTech: string[] = [];
  if (brief.nearTechStack?.useShadeAgents) nearTech.push('Shade Agents');
  if (brief.nearTechStack?.useIntents) nearTech.push('NEAR Intents');
  if (brief.nearTechStack?.useChainSignatures) nearTech.push('Chain Signatures');

  const blockchain = brief.technicalRequirements?.blockchain ?? [];

  const lines = [
    `I want to build "${projectName}" on NEAR Protocol.`,
    '',
    `**Problem:** ${brief.problemStatement || 'N/A'}`,
    '',
    `**Solution:** ${brief.solutionOverview || 'N/A'}`,
    '',
  ];

  if (mustHaves.length > 0) {
    lines.push(`**Must-have features:** ${mustHaves.join(', ')}`);
  }
  if (niceToHaves.length > 0) {
    lines.push(`**Nice-to-have features:** ${niceToHaves.join(', ')}`);
  }

  if (blockchain.length > 0) {
    lines.push(`**Blockchain requirements:** ${blockchain.join(', ')}`);
  }

  if (nearTech.length > 0) {
    lines.push(`**NEAR tech to leverage:** ${nearTech.join(', ')}`);
  }

  if (brief.buildComplexity) {
    lines.push(
      `**Complexity:** ${brief.buildComplexity.difficulty} · ${brief.buildComplexity.estimatedTimeline}`
    );
  }

  lines.push('');
  lines.push(
    'Walk me through building the smart contract for this project step by step. ' +
      'Start with the core data structures and main contract logic.'
  );

  return lines.join('\n');
}

/** Store a brief in sessionStorage for Sanctum to pick up */
export function storeBriefForSanctum(brief: ProjectBrief): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(brief));
  } catch {
    // sessionStorage might be full or unavailable
  }
}

/** Retrieve and clear the stored brief (one-time read) */
export function consumeStoredBrief(): ProjectBrief | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw) as ProjectBrief;
  } catch {
    return null;
  }
}
