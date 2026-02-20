// ============================================================
// Sanctum Pricing Tiers — Single source of truth
// ============================================================

export type SanctumTier = 'shade' | 'specter' | 'legion' | 'leviathan';

export interface AvailableModel {
  id: string;
  name: string;
  description: string;
  default?: boolean;
  comingSoon?: boolean;
}

export interface SanctumTierConfig {
  name: string;
  tier: SanctumTier;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  creditsPerMonth: number;
  features: string[];
  color: string;
  glowColor: string;
  stripePriceIdMonthly: string;  // Set in Stripe dashboard
  stripePriceIdAnnual: string;
  popular?: boolean;
  // ── Enforced Limits ──────────────────────────────────────
  maxProjects: number;           // 0 = unlimited
  aiModel: 'claude-sonnet-4-6' | 'claude-opus-4-6';
  availableModels: AvailableModel[];
  canExport: boolean;
  canAudit: boolean;             // Roast Zone access
  priorityQueue: boolean;
  maxBriefsPerMonth: number;     // 0 = unlimited
  maxSavedOpportunities: number; // 0 = unlimited
}

export interface TopUpPack {
  name: string;
  slug: string;
  price: number;
  credits: number;
  bonus: string;
  stripePriceId: string;
}

export const SANCTUM_TIERS: Record<SanctumTier, SanctumTierConfig> = {
  shade: {
    name: 'Shade',
    tier: 'shade',
    tagline: 'Try Sanctum risk-free',
    monthlyPrice: 0,
    annualPrice: 0,
    creditsPerMonth: 0,  // One-time $2.50 grant, not monthly
    features: [
      'Sanctum AI builder (Claude Sonnet 4.6)',
      '$2.50 one-time starter credits',
      '1 active project',
      '66 NEAR & Rust education modules',
      'All intelligence tools (always free)',
    ],
    color: '#666666',
    glowColor: 'rgba(102, 102, 102, 0.3)',
    stripePriceIdMonthly: '',
    stripePriceIdAnnual: '',
    // ── Enforced Limits ──
    maxProjects: 1,
    aiModel: 'claude-sonnet-4-6',
    availableModels: [
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', description: 'Fast & intelligent coding assistant' },
    ],
    canExport: false,
    canAudit: false,
    priorityQueue: false,
    maxBriefsPerMonth: 3,
    maxSavedOpportunities: 5,
  },
  specter: {
    name: 'Specter',
    tier: 'specter',
    tagline: 'For solo builders getting started',
    monthlyPrice: 25,
    annualPrice: 250,
    creditsPerMonth: 25,
    features: [
      '$25/mo in Sanctum credits',
      'Claude Opus 4.6 — best AI model available',
      'Claude Sonnet 4.6 — next-gen speed & intelligence',
      'Up to 3 active projects',
      'Full project export',
      'AI contract auditing (Roast Zone)',
      'Cloud conversation history',
    ],
    color: '#00EC97',
    glowColor: 'rgba(0, 236, 151, 0.3)',
    stripePriceIdMonthly: 'price_1SzsDU0chTjWbsnZwHUVPdiA',
    stripePriceIdAnnual: 'price_1SzsDU0chTjWbsnZ90gXTP4Q',
    // ── Enforced Limits ──
    maxProjects: 3,
    aiModel: 'claude-opus-4-6',
    availableModels: [
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', description: 'Most powerful — complex contracts & deep reasoning', default: true },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', description: 'Next-gen speed & intelligence' },
    ],
    canExport: true,
    canAudit: true,
    priorityQueue: false,
    maxBriefsPerMonth: 10,
    maxSavedOpportunities: 50,
  },
  legion: {
    name: 'Legion',
    tier: 'legion',
    tagline: 'Best value for serious builders',
    monthlyPrice: 60,
    annualPrice: 600,
    creditsPerMonth: 70,
    features: [
      '$70/mo in Sanctum credits ($10 bonus)',
      'Claude Opus 4.6 — best AI model available',
      'Claude Sonnet 4.6 — next-gen speed & intelligence',
      'Unlimited active projects',
      'Full project export',
      'AI contract auditing (Roast Zone)',
      'Cloud conversation history',
    ],
    color: '#00D4FF',
    glowColor: 'rgba(0, 212, 255, 0.3)',
    stripePriceIdMonthly: 'price_1SzsDU0chTjWbsnZSfnTGo4G',
    stripePriceIdAnnual: 'price_1SzsDU0chTjWbsnZVfWYySmG',
    popular: true,
    // ── Enforced Limits ──
    maxProjects: 0,  // unlimited
    aiModel: 'claude-opus-4-6',
    availableModels: [
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', description: 'Most powerful — complex contracts & deep reasoning', default: true },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', description: 'Next-gen speed & intelligence' },
    ],
    canExport: true,
    canAudit: true,
    priorityQueue: true,
    maxBriefsPerMonth: 50,
    maxSavedOpportunities: 0,  // unlimited
  },
  leviathan: {
    name: 'Leviathan',
    tier: 'leviathan',
    tagline: 'For teams and production workloads',
    monthlyPrice: 200,
    annualPrice: 2000,
    creditsPerMonth: 230,
    features: [
      '$230/mo in Sanctum credits ($30 bonus)',
      'Claude Opus 4.6 — best AI model available',
      'Claude Sonnet 4.6 — next-gen speed & intelligence',
      'Unlimited active projects',
      'Full project export',
      'AI contract auditing (Roast Zone)',
      'Cloud conversation history',
      'Pair Programming — real-time collaboration',
    ],
    color: '#9D4EDD',
    glowColor: 'rgba(157, 78, 221, 0.3)',
    stripePriceIdMonthly: 'price_1SzsDU0chTjWbsnZxGegM9EZ',
    stripePriceIdAnnual: 'price_1SzsDV0chTjWbsnZx0gHg5id',
    // ── Enforced Limits ──
    maxProjects: 0,  // unlimited
    aiModel: 'claude-opus-4-6',
    availableModels: [
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', description: 'Most powerful — complex contracts & deep reasoning', default: true },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', description: 'Next-gen speed & intelligence' },
    ],
    canExport: true,
    canAudit: true,
    priorityQueue: true,
    maxBriefsPerMonth: 0,  // unlimited
    maxSavedOpportunities: 0,  // unlimited
  },
};

export const TOPUP_PACKS: TopUpPack[] = [
  {
    name: 'Spark',
    slug: 'spark',
    price: 5,
    credits: 5,
    bonus: '',
    stripePriceId: 'price_1SzsDc0chTjWbsnZ3nzxmGSt',
  },
  {
    name: 'Boost',
    slug: 'boost',
    price: 20,
    credits: 22,
    bonus: '10% bonus',
    stripePriceId: 'price_1SzsDc0chTjWbsnZGRWYiVEz',
  },
  {
    name: 'Surge',
    slug: 'surge',
    price: 50,
    credits: 58,
    bonus: '16% bonus',
    stripePriceId: 'price_1SzsDc0chTjWbsnZ6QJyY8fN',
  },
  {
    name: 'Overload',
    slug: 'overload',
    price: 100,
    credits: 120,
    bonus: '20% bonus',
    stripePriceId: 'price_1SzsDc0chTjWbsnZNBC3OzZR',
  },
];

/** Get credit amount for a tier (monthly subscription reset) */
export function getTierCredits(tier: SanctumTier): number {
  return SANCTUM_TIERS[tier].creditsPerMonth;
}

/** Get the AI model for a given tier */
export function getTierModel(tier: SanctumTier): string {
  return SANCTUM_TIERS[tier].aiModel;
}

/** Get available models for a given tier */
export function getAvailableModels(tier: SanctumTier): AvailableModel[] {
  return SANCTUM_TIERS[tier].availableModels;
}

/** Check if a model ID is available for a given tier (excludes coming-soon models) */
export function isModelAvailable(tier: SanctumTier, modelId: string): boolean {
  return SANCTUM_TIERS[tier].availableModels.some(m => m.id === modelId && !m.comingSoon);
}

/** Resolve the effective model: preferred (if valid for tier) or default */
export function resolveModel(tier: SanctumTier, preferredModel?: string | null): string {
  if (preferredModel && isModelAvailable(tier, preferredModel)) {
    return preferredModel;
  }
  return SANCTUM_TIERS[tier].aiModel;
}

/** Check if user can create another project */
export function canCreateProject(tier: SanctumTier, currentCount: number): boolean {
  const max = SANCTUM_TIERS[tier].maxProjects;
  return max === 0 || currentCount < max;
}

/** Check if user can export projects */
export function canExportProject(tier: SanctumTier): boolean {
  return SANCTUM_TIERS[tier].canExport;
}

/** Check if user can use Roast Zone (contract auditing) */
export function canUseRoastZone(tier: SanctumTier): boolean {
  return SANCTUM_TIERS[tier].canAudit;
}

/** Check if user can generate a Void Brief */
export function canGenerateVoidBrief(tier: SanctumTier, usageCount: number): boolean {
  const max = SANCTUM_TIERS[tier].maxBriefsPerMonth;
  return max === 0 || usageCount < max;
}

/** Check if user can save an opportunity */
export function canSaveOpportunityByTier(tier: SanctumTier, savedCount: number): boolean {
  const max = SANCTUM_TIERS[tier].maxSavedOpportunities;
  return max === 0 || savedCount < max;
}

/** Get project limit for display (returns "Unlimited" or number) */
export function getProjectLimitDisplay(tier: SanctumTier): string {
  const max = SANCTUM_TIERS[tier].maxProjects;
  return max === 0 ? 'Unlimited' : String(max);
}

/** Get tier config from a Stripe price ID */
export function getTierFromPriceId(priceId: string): SanctumTierConfig | null {
  for (const tier of Object.values(SANCTUM_TIERS)) {
    if (tier.stripePriceIdMonthly === priceId || tier.stripePriceIdAnnual === priceId) {
      return tier;
    }
  }
  return null;
}

/** Get top-up pack from a Stripe price ID */
export function getTopUpFromPriceId(priceId: string): TopUpPack | null {
  return TOPUP_PACKS.find(p => p.stripePriceId === priceId) || null;
}
