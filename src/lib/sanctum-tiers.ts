// ============================================================
// Sanctum Pricing Tiers — Single source of truth
// ============================================================

export type SanctumTier = 'shade' | 'specter' | 'legion' | 'leviathan';

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
    tagline: 'Lurk the void',
    monthlyPrice: 0,
    annualPrice: 0,
    creditsPerMonth: 0,  // One-time $2.50 grant, not monthly
    features: [
      'Sanctum AI access',
      '$2.50 starter credits (one-time)',
      'Starter templates',
      'Community support',
    ],
    color: '#666666',
    glowColor: 'rgba(102, 102, 102, 0.3)',
    stripePriceIdMonthly: '',
    stripePriceIdAnnual: '',
  },
  specter: {
    name: 'Specter',
    tier: 'specter',
    tagline: 'Shape the void',
    monthlyPrice: 25,
    annualPrice: 250,
    creditsPerMonth: 25,
    features: [
      'Claude Opus 4.6',
      '$25/mo in credits',
      'All templates',
      'Guided Rust curriculum',
      'Project export',
      '3 active projects',
    ],
    color: '#00EC97',
    glowColor: 'rgba(0, 236, 151, 0.3)',
    stripePriceIdMonthly: 'price_1SzsDU0chTjWbsnZwHUVPdiA',
    stripePriceIdAnnual: 'price_1SzsDU0chTjWbsnZ90gXTP4Q',
    popular: true,
  },
  legion: {
    name: 'Legion',
    tier: 'legion',
    tagline: 'Command the void',
    monthlyPrice: 60,
    annualPrice: 600,
    creditsPerMonth: 70,
    features: [
      'Everything in Specter',
      '$70/mo in credits',
      'Unlimited projects',
      'Contract auditing',
      'Advanced NEAR tooling',
      'Priority queue',
    ],
    color: '#00D4FF',
    glowColor: 'rgba(0, 212, 255, 0.3)',
    stripePriceIdMonthly: 'price_1SzsDU0chTjWbsnZSfnTGo4G',
    stripePriceIdAnnual: 'price_1SzsDU0chTjWbsnZVfWYySmG',
  },
  leviathan: {
    name: 'Leviathan',
    tier: 'leviathan',
    tagline: 'Become the void',
    monthlyPrice: 200,
    annualPrice: 2000,
    creditsPerMonth: 230,
    features: [
      'Everything in Legion',
      '$230/mo in credits',
      'Dedicated capacity',
      'Team seats (3)',
      'Priority support',
      'White-label deploys',
    ],
    color: '#9D4EDD',
    glowColor: 'rgba(157, 78, 221, 0.3)',
    stripePriceIdMonthly: 'price_1SzsDU0chTjWbsnZxGegM9EZ',
    stripePriceIdAnnual: 'price_1SzsDV0chTjWbsnZx0gHg5id',
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
