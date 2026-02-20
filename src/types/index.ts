// ============================================================
// Voidspace Type Definitions
// ============================================================

// --- Database Models ---

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_strategic: boolean;
  strategic_multiplier: number;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  website_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  logo_url: string | null;
  tvl_usd: number;
  github_stars: number;
  github_forks: number;
  github_open_issues: number;
  github_language: string | null;
  last_github_commit: string | null;
  is_active: boolean;
  raw_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  gap_score: number;
  demand_score: number | null;
  competition_level: 'low' | 'medium' | 'high';
  reasoning: string | null;
  suggested_features: string[] | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  active_project_count?: number;
  category_name?: string;
}

export interface User {
  id: string;
  near_account_id: string;
  email: string | null;
  tier: TierName;
  xp_points: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: TierName;
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  near_payment_tx: string | null;
  created_at: string;
  updated_at: string;
}

export interface Usage {
  id: string;
  user_id: string;
  action: 'brief_generated' | 'brief_preview' | 'export';
  opportunity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type MissionStatus = 'saved' | 'researching' | 'building' | 'shipped' | 'paused';
export type MissionHealth = 'green' | 'yellow' | 'red';

export interface SavedOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: MissionStatus;
  health: MissionHealth;
  progress: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  opportunity?: Opportunity;
  // Computed fields
  briefs_count?: number;
  sanctum_sessions?: number;
}

export interface ProjectBriefRecord {
  id: string;
  opportunity_id: string;
  user_id: string | null;
  content: ProjectBrief;
  created_at: string;
}

export interface SyncLog {
  id: string;
  source: 'ecosystem' | 'defillama' | 'github' | 'nearblocks' | 'fastnear' | 'pikespeak';
  status: 'started' | 'completed' | 'failed';
  records_processed: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

// --- AI Brief ---

export interface ProjectBrief {
  projectNames: string[];
  problemStatement: string;
  solutionOverview: string;
  whyNow?: string;
  targetUsers: string[];
  keyFeatures: {
    name: string;
    description: string;
    priority: 'must-have' | 'nice-to-have';
  }[];
  technicalRequirements: {
    frontend: string[];
    backend: string[];
    blockchain: string[];
  };
  nearTechStack: {
    useShadeAgents: boolean;
    useIntents: boolean;
    useChainSignatures: boolean;
    explanation: string;
  };
  competitiveLandscape: string;
  monetizationIdeas: string[];
  nextSteps?: string[];
  fundingOpportunities?: string[];
  buildComplexity: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTimeline: string;
    teamSize: string;
  };
  resources: {
    title: string;
    url: string;
    type: 'docs' | 'tutorial' | 'example';
  }[];
}

// --- Tier System ---

export type TierName = 'shade' | 'specter' | 'legion' | 'leviathan';

export interface TierConfig {
  name: string;
  tagline: string;
  price: number | null;
  briefsPerMonth: number;
  previewsPerDay: number;
  maxSaved: number;
  color: string;
  features: string[];
}

// --- Gap Score ---

export interface GapScoreInput {
  categorySlug: string;
  totalProjects: number;
  activeProjects: number;
  totalTVL: number;
  isStrategic: boolean;
  strategicMultiplier: number;
  projectTVLs: number[];
  projectGithubStats: {
    stars: number;
    forks: number;
    openIssues: number;
    lastCommit: string | null;
    isActive: boolean;
  }[];
  allCategoryActiveProjects?: number[];
  ecosystemAverageTVL?: number;
}

// --- Dashboard ---

export interface EcosystemStats {
  totalProjects: number;
  activeProjects: number;
  totalTVL: number;
  categoryCount: number;
  lastSyncAt: string | null;
}

export interface CategoryWithStats extends Category {
  projectCount: number;
  activeProjectCount: number;
  totalTVL: number;
  gapScore: number;
}

// --- Chain Stats (persisted from NearBlocks + Pikespeak) ---

export interface ChainStatsRecord {
  id: string;
  total_transactions: number;
  total_accounts: number;
  block_height: number;
  nodes_online: number;
  avg_block_time: number;
  hot_wallets: { account_id: string; amount: number }[] | null;
  recorded_at: string;
}

// --- Aggregated GitHub Stats ---

export interface GitHubAggregateStats {
  totalStars: number;
  totalForks: number;
  totalOpenIssues: number;
  projectsWithGithub: number;
  recentlyActive: number;
  topLanguages: { language: string; count: number }[];
}

// --- Gap Score Breakdown ---

export interface VoidPersona {
  emoji: string;
  type: string;       // "Weekend Builder", "DeFi Developer", etc.
  fit: string;        // Why this void is perfect for them (1-2 sentences)
  skillsNeeded: string; // e.g. "React, NEAR JS SDK, basic API design"
  timeToMVP: string;  // e.g. "1-2 weekends"
}

export interface VoidBuildAngle {
  title: string;      // e.g. "Start with a free dashboard, monetize with alerts"
  description: string; // How to approach the build
  timeToMVP: string;  // e.g. "3-4 days"
  inspiration: string; // e.g. "Like DeFiLlama but focused purely on NEAR gas"
}

export interface VoidEnrichment {
  hook: string;         // One-liner vision: "The Bloomberg Terminal of NEAR data"
  vision: string;       // 2-3 sentence picture of what this becomes at scale
  personas: VoidPersona[];
  buildAngles: VoidBuildAngle[];
  revenue: {
    model: string;      // e.g. "Freemium SaaS"
    potential: string;  // e.g. "$3K–$25K/month"
    howTo: string;      // Specific monetization path
  };
  quickStart: string[]; // ["Day 1: ...", "Day 3: ...", "Week 2: ..."]
  moat: string;         // What makes this defensible once built
  generatedAt: string;  // ISO timestamp
}

export interface GapScoreBreakdown {
  supplyScarcity: number;
  tvlConcentration: number;
  devActivityGap: number;
  strategicPriority: number;
  marketDemand: number;
  finalScore: number;
  signals: {
    label: string;
    value: number;
    weight: number;
    description: string;
  }[];
}
