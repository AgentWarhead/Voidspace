/* ─── Voidspace Achievement Registry ────────────────────────────
 * Single source of truth for ALL achievements across the platform.
 * Profile page, Sanctum, and all features import from here.
 * ────────────────────────────────────────────────────────────── */

// ─── Types ────────────────────────────────────────────────────

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type AchievementCategory =
  | 'exploration'
  | 'intelligence'
  | 'bubbles'
  | 'constellation'
  | 'sanctum'
  | 'learning'
  | 'economy'
  | 'social'
  | 'streaks'
  | 'secret';

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  icon: string; // lucide icon key
  category: AchievementCategory;
  rarity: AchievementRarity;
  xp: number;
  secret?: boolean;       // hidden until unlocked
  hint?: string;          // cryptic clue for secret achievements
  /** Automatic trigger conditions (evaluated client-side) */
  trigger?: {
    stat?: string;        // key in UserAchievementStats
    threshold?: number;   // >= this value
    custom?: string;      // custom trigger ID for event-based unlocks
  };
}

/** Stats tracked for automatic achievement evaluation */
export interface UserAchievementStats {
  // Exploration
  voidsExplored: number;
  uniqueCategoriesExplored: number;
  categoriesFullyExplored: number;  // all projects in a category viewed
  observatoryVisits: number;
  pulseStreamsRead: number;

  // Intelligence
  briefsGenerated: number;
  opportunitiesSaved: number;
  walletsAnalyzed: number;
  ownWalletAnalyzed: boolean;

  // Bubbles
  bubblesVisits: number;
  bubblesMinutesSpent: number;
  bubblesClicked: number;

  // Constellation
  constellationVisits: number;
  nodesExpanded: number;
  maxDepthReached: number;
  screenshotsTaken: number;

  // Sanctum
  sanctumMessages: number;
  codeGenerations: number;
  contractsDeployed: number;
  contractsBuilt: number;
  uniquePersonasUsed: number;
  uniqueCategoriesBuilt: number;
  totalSanctumCategories: number;
  tokensUsed: number;
  conceptsLearned: number;
  quizStreak: number;
  maxQuizStreak: number;
  longestSessionMinutes: number;
  nightBuilds: number;       // builds between 00:00-05:00 local

  // Learning
  modulesCompleted: number;
  explorerModules: number;
  builderModules: number;
  hackerModules: number;
  founderModules: number;
  certificatesEarned: number;
  quickStartCompleted: boolean;
  crossChainCompleted: boolean;
  rustPathCompleted: boolean;
  allModulesCompleted: boolean;

  // Economy
  totalSpent: number;       // USD
  topUpsCount: number;
  currentTier: string;

  // Social
  profileShares: number;
  contractsShared: number;
  referrals: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  accountAgeDays: number;
  weekendActive: boolean;

  // Secret triggers
  askedAboutThePlan: boolean;
  analyzedZeroBalance: boolean;
  bubblesClickedInSession: number;
  logoClicks: number;
  konamiEntered: boolean;
}

// ─── Default Stats ────────────────────────────────────────────

export function defaultStats(): UserAchievementStats {
  return {
    voidsExplored: 0, uniqueCategoriesExplored: 0, categoriesFullyExplored: 0,
    observatoryVisits: 0, pulseStreamsRead: 0,
    briefsGenerated: 0, opportunitiesSaved: 0, walletsAnalyzed: 0, ownWalletAnalyzed: false,
    bubblesVisits: 0, bubblesMinutesSpent: 0, bubblesClicked: 0,
    constellationVisits: 0, nodesExpanded: 0, maxDepthReached: 0, screenshotsTaken: 0,
    sanctumMessages: 0, codeGenerations: 0, contractsDeployed: 0, contractsBuilt: 0,
    uniquePersonasUsed: 0, uniqueCategoriesBuilt: 0, totalSanctumCategories: 20,
    tokensUsed: 0, conceptsLearned: 0, quizStreak: 0, maxQuizStreak: 0,
    longestSessionMinutes: 0, nightBuilds: 0,
    modulesCompleted: 0, explorerModules: 0, builderModules: 0, hackerModules: 0,
    founderModules: 0, certificatesEarned: 0, quickStartCompleted: false,
    crossChainCompleted: false, rustPathCompleted: false, allModulesCompleted: false,
    totalSpent: 0, topUpsCount: 0, currentTier: 'shade',
    profileShares: 0, contractsShared: 0, referrals: 0,
    currentStreak: 0, longestStreak: 0, accountAgeDays: 0, weekendActive: false,
    askedAboutThePlan: false, analyzedZeroBalance: false,
    bubblesClickedInSession: 0, logoClicks: 0, konamiEntered: false,
  };
}

// ─── Rarity Config ────────────────────────────────────────────

export const RARITY_CONFIG: Record<AchievementRarity, {
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  textColor: string;
}> = {
  common: {
    label: 'Common',
    color: 'text-slate-300',
    bg: 'from-slate-600/90 to-slate-700/90',
    border: 'border-slate-500',
    glow: 'shadow-slate-500/30',
    textColor: 'text-slate-200',
  },
  uncommon: {
    label: 'Uncommon',
    color: 'text-green-400',
    bg: 'from-green-700/90 to-green-800/90',
    border: 'border-green-500',
    glow: 'shadow-green-500/40',
    textColor: 'text-green-200',
  },
  rare: {
    label: 'Rare',
    color: 'text-blue-400',
    bg: 'from-blue-600/90 to-blue-700/90',
    border: 'border-blue-400',
    glow: 'shadow-blue-500/50',
    textColor: 'text-blue-200',
  },
  epic: {
    label: 'Epic',
    color: 'text-purple-400',
    bg: 'from-purple-600/90 to-purple-700/90',
    border: 'border-purple-400',
    glow: 'shadow-purple-500/50',
    textColor: 'text-purple-200',
  },
  legendary: {
    label: 'Legendary',
    color: 'text-amber-400',
    bg: 'from-amber-500/90 to-orange-600/90',
    border: 'border-amber-400',
    glow: 'shadow-500/50',
    textColor: 'text-amber-100',
  },
};

// ─── Category Config ──────────────────────────────────────────

export const CATEGORY_CONFIG: Record<AchievementCategory, {
  label: string;
  emoji: string;
  color: string;
}> = {
  exploration:    { label: 'Exploration',    emoji: '🌌', color: 'text-cyan-400' },
  intelligence:   { label: 'Intelligence',   emoji: '🕵️', color: 'text-emerald-400' },
  bubbles:        { label: 'Void Bubbles',   emoji: '🫧', color: 'text-blue-400' },
  constellation:  { label: 'Constellation',  emoji: '✨', color: 'text-indigo-400' },
  sanctum:        { label: 'Sanctum',        emoji: '🦀', color: 'text-orange-400' },
  learning:       { label: 'Learning',       emoji: '📚', color: 'text-yellow-400' },
  economy:        { label: 'Economy',        emoji: '💳', color: 'text-green-400' },
  social:         { label: 'Social',         emoji: '🤝', color: 'text-pink-400' },
  streaks:        { label: 'Streaks',        emoji: '🔥', color: 'text-red-400' },
  secret:         { label: 'Secrets',        emoji: '🥚', color: 'text-amber-300' },
};

// ─── ACHIEVEMENT DEFINITIONS ──────────────────────────────────
// 107 achievements organized by category

export const ACHIEVEMENTS: AchievementDef[] = [

  // ═══════════════════════════════════════════════════════════
  // EXPLORATION (12)
  // ═══════════════════════════════════════════════════════════
  { id: 'first_steps',        name: 'First Steps',          description: 'Connected your wallet to the Void',                      emoji: '👣', icon: 'footprints',     category: 'exploration', rarity: 'common',    xp: 10,   trigger: { custom: 'wallet_connected' } },
  { id: 'void_walker',        name: 'Void Walker',          description: 'Explored your first project',                            emoji: '🔍', icon: 'search',         category: 'exploration', rarity: 'common',    xp: 15,   trigger: { stat: 'voidsExplored', threshold: 1 } },
  { id: 'void_hunter',        name: 'Void Hunter',          description: 'Explored 10 projects in the NEAR ecosystem',             emoji: '🌀', icon: 'radar',          category: 'exploration', rarity: 'uncommon',  xp: 50,   trigger: { stat: 'voidsExplored', threshold: 10 } },
  { id: 'void_cartographer',  name: 'Void Cartographer',    description: 'Explored 50 projects — you know this ecosystem',         emoji: '🗺️', icon: 'map',            category: 'exploration', rarity: 'rare',      xp: 150,  trigger: { stat: 'voidsExplored', threshold: 50 } },
  { id: 'void_archaeologist',  name: 'Void Archaeologist',   description: 'Explored 100 projects — nothing escapes your gaze',      emoji: '⛏️', icon: 'pickaxe',        category: 'exploration', rarity: 'epic',      xp: 300,  trigger: { stat: 'voidsExplored', threshold: 100 } },
  { id: 'seen_everything',    name: "I've Seen Everything",  description: 'Explored every single listed project',                   emoji: '👁️', icon: 'eye',            category: 'exploration', rarity: 'legendary', xp: 1000, trigger: { custom: 'all_projects_explored' } },
  { id: 'category_sampler',   name: 'Category Sampler',     description: 'Explored projects in 5 different categories',             emoji: '🎯', icon: 'target',         category: 'exploration', rarity: 'uncommon',  xp: 50,   trigger: { stat: 'uniqueCategoriesExplored', threshold: 5 } },
  { id: 'category_completionist', name: 'Category Completionist', description: 'Explored every project in a single category',      emoji: '🏁', icon: 'flag',           category: 'exploration', rarity: 'rare',      xp: 200,  trigger: { stat: 'categoriesFullyExplored', threshold: 1 } },
  { id: 'master_taxonomist',  name: 'Master Taxonomist',    description: 'Explored at least 1 project in every category',           emoji: '📚', icon: 'library',        category: 'exploration', rarity: 'epic',      xp: 500,  trigger: { custom: 'all_categories_sampled' } },
  { id: 'observatory_regular', name: 'Observatory Regular',  description: 'Visited the Observatory 10 times',                       emoji: '🔭', icon: 'telescope',      category: 'exploration', rarity: 'common',    xp: 30,   trigger: { stat: 'observatoryVisits', threshold: 10 } },
  { id: 'signal_watcher',     name: 'Signal Watcher',       description: 'Read 5 Pulse Streams entries',                            emoji: '📡', icon: 'radio',          category: 'exploration', rarity: 'common',    xp: 25,   trigger: { stat: 'pulseStreamsRead', threshold: 5 } },
  { id: 'pulse_junkie',       name: 'Pulse Junkie',         description: 'Read 50 Pulse Streams entries — addicted to alpha',       emoji: '⚡', icon: 'zap',            category: 'exploration', rarity: 'rare',      xp: 100,  trigger: { stat: 'pulseStreamsRead', threshold: 50 } },

  // ═══════════════════════════════════════════════════════════
  // INTELLIGENCE (12)
  // ═══════════════════════════════════════════════════════════
  { id: 'intel_gatherer',     name: 'Intel Gatherer',       description: 'Generated your first opportunity brief',                  emoji: '📋', icon: 'clipboard',      category: 'intelligence', rarity: 'common',  xp: 25,   trigger: { stat: 'briefsGenerated', threshold: 1 } },
  { id: 'brief_collector',    name: 'Brief Collector',      description: 'Generated 5 briefs — building your playbook',             emoji: '📑', icon: 'files',          category: 'intelligence', rarity: 'uncommon',xp: 50,   trigger: { stat: 'briefsGenerated', threshold: 5 } },
  { id: 'intelligence_officer', name: 'Intelligence Officer', description: 'Generated 25 briefs — serious researcher',              emoji: '🕵️', icon: 'user-search',    category: 'intelligence', rarity: 'rare',    xp: 150,  trigger: { stat: 'briefsGenerated', threshold: 25 } },
  { id: 'spymaster',          name: 'Spymaster',            description: 'Generated 100 briefs — you ARE the intelligence',         emoji: '🎩', icon: 'graduation-cap', category: 'intelligence', rarity: 'epic',    xp: 400,  trigger: { stat: 'briefsGenerated', threshold: 100 } },
  { id: 'opportunity_spotter', name: 'Opportunity Spotter',  description: 'Saved your first opportunity to the mission board',       emoji: '💡', icon: 'lightbulb',      category: 'intelligence', rarity: 'common',  xp: 15,   trigger: { stat: 'opportunitiesSaved', threshold: 1 } },
  { id: 'mission_board',      name: 'Mission Board',        description: '10 opportunities saved — building an empire',              emoji: '📌', icon: 'pin',            category: 'intelligence', rarity: 'rare',    xp: 75,   trigger: { stat: 'opportunitiesSaved', threshold: 10 } },
  { id: 'lens_initiate',      name: 'Lens Initiate',        description: 'Analyzed your first wallet with Void Lens',               emoji: '🔬', icon: 'microscope',     category: 'intelligence', rarity: 'common',  xp: 25,   trigger: { stat: 'walletsAnalyzed', threshold: 1 } },
  { id: 'wallet_whisperer',   name: 'Wallet Whisperer',     description: 'Analyzed 10 unique wallets',                              emoji: '👛', icon: 'wallet',         category: 'intelligence', rarity: 'rare',    xp: 100,  trigger: { stat: 'walletsAnalyzed', threshold: 10 } },
  { id: 'reputation_oracle',  name: 'Reputation Oracle',    description: 'Analyzed 50 unique wallets — you see through the chain',  emoji: '⚖️', icon: 'scale',          category: 'intelligence', rarity: 'epic',    xp: 250,  trigger: { stat: 'walletsAnalyzed', threshold: 50 } },
  { id: 'whale_watcher',      name: 'Whale Watcher',        description: 'Analyzed a wallet holding 10,000+ NEAR',                  emoji: '🐋', icon: 'fish',           category: 'intelligence', rarity: 'rare',    xp: 100,  trigger: { custom: 'whale_wallet_analyzed' } },
  { id: 'self_aware',         name: 'Self-Aware',           description: 'Analyzed your own wallet — know thyself',                  emoji: '🪞', icon: 'user-check',     category: 'intelligence', rarity: 'common',  xp: 30,   trigger: { custom: 'own_wallet_analyzed' } },
  { id: 'defi_detective',     name: 'DeFi Detective',       description: 'Analyzed a wallet with 10+ DeFi interactions',            emoji: '🔎', icon: 'search-code',    category: 'intelligence', rarity: 'rare',    xp: 75,   trigger: { custom: 'defi_heavy_wallet' } },

  // ═══════════════════════════════════════════════════════════
  // VOID BUBBLES (5)
  // ═══════════════════════════════════════════════════════════
  { id: 'bubble_popper',      name: 'Bubble Popper',        description: 'First visit to Void Bubbles',                             emoji: '🫧', icon: 'circle',         category: 'bubbles', rarity: 'common',    xp: 10,   trigger: { stat: 'bubblesVisits', threshold: 1 } },
  { id: 'market_gazer',       name: 'Market Gazer',         description: 'Spent 5+ minutes watching the bubbles dance',             emoji: '📊', icon: 'bar-chart',      category: 'bubbles', rarity: 'uncommon',  xp: 25,   trigger: { stat: 'bubblesMinutesSpent', threshold: 5 } },
  { id: 'bubble_surfer',      name: 'Bubble Surfer',        description: 'Interacted with 20 different bubbles',                    emoji: '🏄', icon: 'waves',          category: 'bubbles', rarity: 'rare',      xp: 75,   trigger: { stat: 'bubblesClicked', threshold: 20 } },
  { id: 'the_bigger_they_are', name: 'The Bigger They Are', description: 'Clicked on the largest bubble by market cap',             emoji: '💥', icon: 'maximize',       category: 'bubbles', rarity: 'common',    xp: 15,   trigger: { custom: 'largest_bubble_clicked' } },
  { id: 'micro_hunter',       name: 'Micro Hunter',         description: 'Found and clicked the smallest bubble',                   emoji: '🔬', icon: 'minimize',       category: 'bubbles', rarity: 'rare',      xp: 50,   trigger: { custom: 'smallest_bubble_clicked' } },

  // ═══════════════════════════════════════════════════════════
  // CONSTELLATION MAP (8)
  // ═══════════════════════════════════════════════════════════
  { id: 'constellation_gazer', name: 'Constellation Gazer',  description: 'Opened the Constellation Map for the first time',        emoji: '✨', icon: 'sparkles',       category: 'constellation', rarity: 'common',    xp: 15,  trigger: { stat: 'constellationVisits', threshold: 1 } },
  { id: 'web_weaver',         name: 'Web Weaver',           description: 'Expanded 5 nodes in one session',                         emoji: '🕸️', icon: 'git-branch',     category: 'constellation', rarity: 'uncommon',  xp: 30,  trigger: { stat: 'nodesExpanded', threshold: 5 } },
  { id: 'deep_diver',         name: 'Deep Diver',           description: 'Reached 4+ levels deep in a constellation',               emoji: '🤿', icon: 'arrow-down',     category: 'constellation', rarity: 'rare',      xp: 75,  trigger: { stat: 'maxDepthReached', threshold: 4 } },
  { id: 'cluster_finder',     name: 'Cluster Finder',       description: 'Discovered a cluster of 10+ connected addresses',         emoji: '🔮', icon: 'network',        category: 'constellation', rarity: 'rare',      xp: 100, trigger: { custom: 'large_cluster_found' } },
  { id: 'cartographer_screenshot', name: 'Cartographer',    description: 'Captured a screenshot of your constellation',             emoji: '📸', icon: 'camera',         category: 'constellation', rarity: 'common',    xp: 20,  trigger: { stat: 'screenshotsTaken', threshold: 1 } },
  { id: 'fullscreen_commander', name: 'Fullscreen Commander', description: 'Used fullscreen mode on the Constellation Map',         emoji: '🖥️', icon: 'maximize-2',     category: 'constellation', rarity: 'common',    xp: 10,  trigger: { custom: 'fullscreen_used' } },
  { id: 'time_traveler',      name: 'Time Traveler',        description: 'Used the time filter to go back 30+ days',                emoji: '⏳', icon: 'clock',          category: 'constellation', rarity: 'rare',      xp: 50,  trigger: { custom: 'time_filter_30d' } },
  { id: 'six_degrees',        name: 'Six Degrees',          description: 'Found a path connecting wallets through 6 hops',          emoji: '🔗', icon: 'link',           category: 'constellation', rarity: 'legendary', xp: 500, trigger: { stat: 'maxDepthReached', threshold: 6 } },

  // ═══════════════════════════════════════════════════════════
  // SANCTUM (30)
  // ═══════════════════════════════════════════════════════════
  { id: 'hello_sanctum',      name: 'Hello, Sanctum!',      description: 'Sent your first message to Sanctum',                     emoji: '💬', icon: 'message-square', category: 'sanctum', rarity: 'common',    xp: 10,   trigger: { stat: 'sanctumMessages', threshold: 1 } },
  { id: 'code_conjurer',      name: 'Code Conjurer',        description: 'Generated your first smart contract code',               emoji: '🧙', icon: 'code',           category: 'sanctum', rarity: 'common',    xp: 25,   trigger: { stat: 'codeGenerations', threshold: 1 } },
  { id: 'genesis_deploy',     name: 'Genesis Deploy',       description: 'Deployed your first contract to NEAR testnet',            emoji: '🚀', icon: 'rocket',         category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { stat: 'contractsDeployed', threshold: 1 } },
  { id: 'speed_demon',        name: 'Speed Demon',          description: 'Built and deployed a contract in under 3 minutes',        emoji: '⚡', icon: 'zap',            category: 'sanctum', rarity: 'legendary', xp: 500,  trigger: { custom: 'speed_deploy' } },
  { id: 'contract_factory',   name: 'Contract Factory',     description: 'Built 3 different contracts',                             emoji: '🏭', icon: 'factory',        category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { stat: 'contractsBuilt', threshold: 3 } },
  { id: 'mass_production',    name: 'Mass Production',      description: 'Built 10 contracts — the assembly line is humming',       emoji: '🔨', icon: 'hammer',         category: 'sanctum', rarity: 'epic',      xp: 250,  trigger: { stat: 'contractsBuilt', threshold: 10 } },
  { id: 'assembly_line',      name: 'Assembly Line',        description: 'Built 25 contracts — you are the factory now',            emoji: '⚙️', icon: 'settings',       category: 'sanctum', rarity: 'legendary', xp: 750,  trigger: { stat: 'contractsBuilt', threshold: 25 } },
  { id: 'curious_mind',       name: 'Curious Mind',         description: 'Asked "why" or "how does this work" in Sanctum',          emoji: '🤔', icon: 'help-circle',    category: 'sanctum', rarity: 'common',    xp: 25,   trigger: { custom: 'asked_why' } },
  { id: 'security_minded',    name: 'Security Minded',      description: 'Asked Warden to audit your code',                         emoji: '🛡️', icon: 'shield',         category: 'sanctum', rarity: 'rare',      xp: 75,   trigger: { custom: 'warden_audit' } },
  { id: 'council_awaits',     name: 'The Council Awaits',   description: 'Talked to 3 different Sanctum Council personas',          emoji: '👥', icon: 'users',          category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { stat: 'uniquePersonasUsed', threshold: 3 } },
  { id: 'council_completionist', name: 'Council Completionist', description: 'Talked to all 8 Council personas',                   emoji: '🎭', icon: 'drama',          category: 'sanctum', rarity: 'epic',      xp: 300,  trigger: { stat: 'uniquePersonasUsed', threshold: 8 } },
  { id: 'oxide_apprentice',   name: 'Oxide Apprentice',     description: 'Had 10+ conversations with Oxide the Rust Grandmaster',   emoji: '🦀', icon: 'terminal',       category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { custom: 'oxide_10_convos' } },
  { id: 'shades_favorite',    name: "Shade's Favorite",     description: 'Had 50+ conversations with Shade — the penguin approves', emoji: '🐧', icon: 'award',          category: 'sanctum', rarity: 'epic',      xp: 200,  trigger: { custom: 'shade_50_convos' } },
  { id: 'chain_master',       name: 'Chain Master',         description: 'Built a contract using Chain Signatures',                 emoji: '✍️', icon: 'pen-tool',       category: 'sanctum', rarity: 'epic',      xp: 150,  trigger: { custom: 'built_chain_signatures' } },
  { id: 'agent_smith',        name: 'Agent Smith',          description: 'Created an autonomous Shade Agent',                       emoji: '🤖', icon: 'bot',            category: 'sanctum', rarity: 'epic',      xp: 200,  trigger: { custom: 'built_ai_agent' } },
  { id: 'defi_architect',     name: 'DeFi Architect',       description: 'Built a DeFi smart contract',                             emoji: '💰', icon: 'banknote',       category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { custom: 'built_defi' } },
  { id: 'nft_creator',        name: 'NFT Creator',          description: 'Built an NFT contract',                                   emoji: '🎨', icon: 'palette',        category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { custom: 'built_nft' } },
  { id: 'meme_lord',          name: 'Meme Lord',            description: 'Built a meme token contract — to the moon',               emoji: '🪙', icon: 'coins',          category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { custom: 'built_meme' } },
  { id: 'game_designer',      name: 'Game Designer',        description: 'Built a gaming smart contract',                           emoji: '🎮', icon: 'gamepad-2',      category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { custom: 'built_gaming' } },
  { id: 'intent_weaver',      name: 'Intent Weaver',        description: 'Built an Intents / Chain Abstraction contract',           emoji: '🔗', icon: 'link-2',         category: 'sanctum', rarity: 'epic',      xp: 150,  trigger: { custom: 'built_intents' } },
  { id: 'privacy_phantom',    name: 'Privacy Phantom',      description: 'Built a privacy contract — secrets safe',                 emoji: '🔒', icon: 'lock',           category: 'sanctum', rarity: 'epic',      xp: 150,  trigger: { custom: 'built_privacy' } },
  { id: 'token_burner',       name: 'Token Burner',         description: 'Used 100,000+ tokens in Sanctum',                         emoji: '🔥', icon: 'flame',          category: 'sanctum', rarity: 'rare',      xp: 75,   trigger: { stat: 'tokensUsed', threshold: 100000 } },
  { id: 'million_token_club', name: 'Million Token Club',   description: 'Used 1,000,000+ tokens — truly committed',                emoji: '💎', icon: 'diamond',        category: 'sanctum', rarity: 'epic',      xp: 200,  trigger: { stat: 'tokensUsed', threshold: 1000000 } },
  { id: 'night_builder',      name: 'Night Builder',        description: 'Built a contract between midnight and 5 AM',              emoji: '🌙', icon: 'moon',           category: 'sanctum', rarity: 'rare',      xp: 50,   trigger: { stat: 'nightBuilds', threshold: 1 } },
  { id: 'marathon_session',   name: 'Marathon Session',     description: 'Single Sanctum session lasting 60+ minutes',              emoji: '⏰', icon: 'timer',          category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { stat: 'longestSessionMinutes', threshold: 60 } },
  { id: 'concept_collector',  name: 'Concept Collector',    description: 'Learned 5 concepts in Learn mode',                        emoji: '📖', icon: 'book-open',      category: 'sanctum', rarity: 'common',    xp: 50,   trigger: { stat: 'conceptsLearned', threshold: 5 } },
  { id: 'knowledge_hoarder',  name: 'Knowledge Hoarder',    description: 'Learned 20 concepts — your brain is expanding',           emoji: '🧠', icon: 'brain',          category: 'sanctum', rarity: 'epic',      xp: 200,  trigger: { stat: 'conceptsLearned', threshold: 20 } },
  { id: 'quiz_ace',           name: 'Quiz Ace',             description: 'Got 5 quizzes right in a row',                            emoji: '🎯', icon: 'target',         category: 'sanctum', rarity: 'rare',      xp: 100,  trigger: { stat: 'maxQuizStreak', threshold: 5 } },
  { id: 'perfect_score',      name: 'Perfect Score',        description: 'Got 10 quizzes right in a row — flawless',                emoji: '💯', icon: 'check-circle',   category: 'sanctum', rarity: 'epic',      xp: 250,  trigger: { stat: 'maxQuizStreak', threshold: 10 } },
  { id: 'category_conqueror', name: 'Category Conqueror',   description: 'Built a contract in every Sanctum category',              emoji: '🏆', icon: 'trophy',         category: 'sanctum', rarity: 'legendary', xp: 1000, trigger: { custom: 'all_sanctum_categories' } },
  { id: 'test_runner',        name: 'Test Runner',          description: 'Generated tests for a smart contract',                    emoji: '🧪', icon: 'flask-conical',  category: 'sanctum', rarity: 'uncommon',  xp: 50,   trigger: { custom: 'tests_generated' } },
  { id: 'mainnet_pioneer',    name: 'Mainnet Pioneer',      description: 'Deployed a contract to NEAR mainnet',                     emoji: '🌍', icon: 'globe',          category: 'sanctum', rarity: 'epic',      xp: 400,  trigger: { custom: 'mainnet_deployed' } },
  { id: 'optimizer',          name: 'Optimizer',            description: 'Optimized a contract for gas efficiency',                  emoji: '⚡', icon: 'gauge',          category: 'sanctum', rarity: 'uncommon',  xp: 50,   trigger: { custom: 'contract_optimized' } },
  { id: 'conversationalist',  name: 'Conversationalist',    description: 'Sent 100 messages to Sanctum — the void listens',          emoji: '💬', icon: 'messages-square',category: 'sanctum', rarity: 'uncommon',  xp: 75,   trigger: { stat: 'sanctumMessages', threshold: 100 } },

  // ═══════════════════════════════════════════════════════════
  // LEARNING (15)
  // ═══════════════════════════════════════════════════════════
  { id: 'first_lesson',       name: 'First Lesson',         description: 'Completed your first learning module',                    emoji: '📖', icon: 'book',           category: 'learning', rarity: 'common',    xp: 15,   trigger: { stat: 'modulesCompleted', threshold: 1 } },
  { id: 'explorer_initiate',  name: 'Explorer Initiate',    description: 'Completed 5 Explorer track modules',                      emoji: '🔍', icon: 'compass',        category: 'learning', rarity: 'common',    xp: 50,   trigger: { stat: 'explorerModules', threshold: 5 } },
  { id: 'builder_initiate',   name: 'Builder Initiate',     description: 'Completed 5 Builder track modules',                       emoji: '🔨', icon: 'hammer',         category: 'learning', rarity: 'common',    xp: 50,   trigger: { stat: 'builderModules', threshold: 5 } },
  { id: 'hacker_initiate',    name: 'Hacker Initiate',      description: 'Completed 5 Hacker track modules',                        emoji: '💻', icon: 'terminal',       category: 'learning', rarity: 'common',    xp: 50,   trigger: { stat: 'hackerModules', threshold: 5 } },
  { id: 'founder_initiate',   name: 'Founder Initiate',     description: 'Completed 5 Founder track modules',                       emoji: '👔', icon: 'briefcase',      category: 'learning', rarity: 'common',    xp: 50,   trigger: { stat: 'founderModules', threshold: 5 } },
  { id: 'explorer_graduate',  name: 'Explorer Graduate',    description: 'Completed all 16 Explorer modules — certified explorer',  emoji: '🎓', icon: 'graduation-cap', category: 'learning', rarity: 'rare',      xp: 250,  trigger: { stat: 'explorerModules', threshold: 16 } },
  { id: 'builder_graduate',   name: 'Builder Graduate',     description: 'Completed all 22 Builder modules — master craftsman',     emoji: '⚒️', icon: 'wrench',         category: 'learning', rarity: 'rare',      xp: 350,  trigger: { stat: 'builderModules', threshold: 22 } },
  { id: 'hacker_graduate',    name: 'Hacker Graduate',      description: 'Completed all 16 Hacker modules — system breaker',        emoji: '🏴‍☠️', icon: 'skull',          category: 'learning', rarity: 'rare',      xp: 250,  trigger: { stat: 'hackerModules', threshold: 16 } },
  { id: 'founder_graduate',   name: 'Founder Graduate',     description: 'Completed all 12 Founder modules — ready to launch',      emoji: '🏛️', icon: 'landmark',       category: 'learning', rarity: 'rare',      xp: 200,  trigger: { stat: 'founderModules', threshold: 12 } },
  { id: 'cross_chain_scholar', name: 'Cross-Chain Scholar',  description: 'Completed the Solana vs NEAR deep dive',                  emoji: '🌉', icon: 'git-compare',    category: 'learning', rarity: 'rare',      xp: 75,   trigger: { custom: 'cross_chain_done' } },
  { id: 'rustacean_rising',   name: 'Rustacean Rising',     description: 'Completed Why Rust + Rust Curriculum paths',              emoji: '🦀', icon: 'crab',           category: 'learning', rarity: 'rare',      xp: 100,  trigger: { custom: 'rust_path_done' } },
  { id: 'constellation_master', name: 'Constellation Master', description: 'Unlocked all 66 nodes in the Skill Constellation',      emoji: '⭐', icon: 'star',           category: 'learning', rarity: 'legendary', xp: 2000, trigger: { custom: 'all_66_modules' } },
  { id: 'first_certificate',  name: 'First Certificate',    description: 'Earned your first track certificate',                     emoji: '📜', icon: 'scroll',         category: 'learning', rarity: 'epic',      xp: 300,  trigger: { stat: 'certificatesEarned', threshold: 1 } },
  { id: 'certified_legend',   name: 'Certified Legend',     description: 'Earned all 4 track certificates — absolute unit',          emoji: '🏅', icon: 'medal',          category: 'learning', rarity: 'legendary', xp: 1500, trigger: { stat: 'certificatesEarned', threshold: 4 } },
  { id: 'quick_starter',      name: 'Quick Starter',        description: 'Completed the Quick Start guide',                         emoji: '🏃', icon: 'play',           category: 'learning', rarity: 'common',    xp: 25,   trigger: { custom: 'quick_start_done' } },

  // ═══════════════════════════════════════════════════════════
  // ECONOMY (6)
  // ═══════════════════════════════════════════════════════════
  { id: 'first_investment',   name: 'First Investment',     description: 'Purchased credits or a subscription',                     emoji: '💵', icon: 'credit-card',    category: 'economy', rarity: 'rare',      xp: 100,  trigger: { stat: 'totalSpent', threshold: 1 } },
  { id: 'specter_class',      name: 'Specter Class',        description: 'Upgraded to Specter tier',                                emoji: '👻', icon: 'ghost',          category: 'economy', rarity: 'rare',      xp: 150,  trigger: { custom: 'tier_specter' } },
  { id: 'legion_class',       name: 'Legion Class',         description: 'Upgraded to Legion tier — serious player',                emoji: '⚔️', icon: 'swords',         category: 'economy', rarity: 'epic',      xp: 300,  trigger: { custom: 'tier_legion' } },
  { id: 'leviathan_class',    name: 'Leviathan Class',      description: 'Ascended to Leviathan — ruler of the deep',               emoji: '🐉', icon: 'crown',          category: 'economy', rarity: 'legendary', xp: 750,  trigger: { custom: 'tier_leviathan' } },
  { id: 'topup_king',         name: 'Top-Up King',          description: 'Bought 5 credit top-ups',                                 emoji: '👑', icon: 'plus-circle',    category: 'economy', rarity: 'rare',      xp: 100,  trigger: { stat: 'topUpsCount', threshold: 5 } },
  { id: 'big_spender',        name: 'Big Spender',          description: 'Spent $100+ total on Voidspace — invested in the void',   emoji: '💸', icon: 'dollar-sign',    category: 'economy', rarity: 'epic',      xp: 300,  trigger: { stat: 'totalSpent', threshold: 100 } },

  // ═══════════════════════════════════════════════════════════
  // SOCIAL (4)
  // ═══════════════════════════════════════════════════════════
  { id: 'profile_shared',     name: 'Profile Shared',       description: 'Shared your Void Command profile',                        emoji: '📤', icon: 'share-2',        category: 'social', rarity: 'common',    xp: 15,   trigger: { stat: 'profileShares', threshold: 1 } },
  { id: 'show_and_tell',      name: 'Show & Tell',          description: 'Shared a deployed contract link',                         emoji: '🎪', icon: 'external-link',  category: 'social', rarity: 'rare',      xp: 50,   trigger: { stat: 'contractsShared', threshold: 1 } },
  { id: 'referral_agent',     name: 'Referral Agent',       description: 'Someone signed up through your shared profile',           emoji: '🕶️', icon: 'user-plus',      category: 'social', rarity: 'epic',      xp: 200,  trigger: { stat: 'referrals', threshold: 1 } },
  { id: 'early_adopter',      name: 'Early Adopter',        description: 'Joined Voidspace during beta — OG status forever',        emoji: '🌅', icon: 'sunrise',        category: 'social', rarity: 'legendary', xp: 500,  trigger: { custom: 'beta_user' } },

  // ═══════════════════════════════════════════════════════════
  // STREAKS (7)
  // ═══════════════════════════════════════════════════════════
  { id: 'day_one',            name: 'Day One',              description: 'Returned the day after signing up',                       emoji: '📅', icon: 'calendar',       category: 'streaks', rarity: 'common',    xp: 25,   trigger: { stat: 'currentStreak', threshold: 2 } },
  { id: 'three_day_streak',   name: 'Three-Day Streak',     description: 'Active 3 consecutive days',                               emoji: '🔥', icon: 'flame',          category: 'streaks', rarity: 'common',    xp: 50,   trigger: { stat: 'longestStreak', threshold: 3 } },
  { id: 'week_warrior',       name: 'Week Warrior',         description: 'Active 7 consecutive days — dedicated',                   emoji: '⚔️', icon: 'sword',          category: 'streaks', rarity: 'rare',      xp: 150,  trigger: { stat: 'longestStreak', threshold: 7 } },
  { id: 'monthly_legend',     name: 'Monthly Legend',       description: 'Active 30 consecutive days — unstoppable',                emoji: '🗓️', icon: 'calendar-check', category: 'streaks', rarity: 'epic',      xp: 500,  trigger: { stat: 'longestStreak', threshold: 30 } },
  { id: 'og_builder',         name: 'OG Builder',           description: 'Account older than 90 days',                              emoji: '🏛️', icon: 'building',       category: 'streaks', rarity: 'rare',      xp: 100,  trigger: { stat: 'accountAgeDays', threshold: 90 } },
  { id: 'void_veteran',       name: 'Void Veteran',         description: 'Account older than 365 days — legend',                    emoji: '🎖️', icon: 'medal',          category: 'streaks', rarity: 'legendary', xp: 500,  trigger: { stat: 'accountAgeDays', threshold: 365 } },
  { id: 'weekend_warrior',    name: 'Weekend Warrior',      description: 'Completed a task on both Saturday and Sunday',            emoji: '🎯', icon: 'calendar-days',  category: 'streaks', rarity: 'common',    xp: 30,   trigger: { custom: 'weekend_active' } },

  // ═══════════════════════════════════════════════════════════
  // SECRET / EASTER EGGS (8)
  // ═══════════════════════════════════════════════════════════
  { id: 'the_penguin_knows',  name: 'The Penguin Knows',    description: 'Asked Shade about THE PLAN in Sanctum',                   emoji: '🐧', icon: 'eye',          category: 'secret', rarity: 'legendary', xp: 250, secret: true, hint: 'Every penguin has a plan...',                    trigger: { custom: 'asked_the_plan' } },
  { id: 'near_zero',          name: 'NEAR Zero',            description: 'Analyzed a wallet with exactly 0 NEAR balance',           emoji: '0️⃣', icon: 'circle-off',   category: 'secret', rarity: 'rare',      xp: 50,  secret: true, hint: 'Some wallets hold nothing but potential',          trigger: { custom: 'zero_balance_wallet' } },
  { id: 'bubble_bath',        name: 'Bubble Bath',          description: 'Clicked 50 bubbles in one Void Bubbles session',          emoji: '🛁', icon: 'droplets',     category: 'secret', rarity: 'rare',      xp: 75,  secret: true, hint: 'Pop pop pop pop pop...',                          trigger: { stat: 'bubblesClickedInSession', threshold: 50 } },
  { id: 'explorer_404',       name: '404 Explorer',         description: 'Found a broken link or 404 page',                         emoji: '🚫', icon: 'alert-circle', category: 'secret', rarity: 'common',    xp: 10,  secret: true, hint: 'Not all who wander find a page',                  trigger: { custom: 'found_404' } },
  { id: 'dark_mode_only',     name: 'Dark Mode Only',       description: 'Welcome to the Void. It was always dark here.',           emoji: '🌑', icon: 'moon',         category: 'secret', rarity: 'common',    xp: 5,   secret: true, hint: 'The void is already dark...',                      trigger: { custom: 'first_visit' } },
  { id: 'door_number_3',      name: "What's Behind Door #3", description: 'Clicked the Voidspace logo 3 times rapidly',             emoji: '🚪', icon: 'door-open',    category: 'secret', rarity: 'rare',      xp: 30,  secret: true, hint: 'The logo knows more than it shows',                trigger: { stat: 'logoClicks', threshold: 3 } },
  { id: 'the_deep_void',      name: 'The Deep Void',        description: 'Scrolled to the absolute bottom of a massive category',  emoji: '🕳️', icon: 'arrow-down',   category: 'secret', rarity: 'common',    xp: 15,  secret: true, hint: 'How deep does the rabbit hole go?',               trigger: { custom: 'deep_scroll' } },
  { id: 'konami_coder',       name: 'Konami Coder',         description: '↑↑↓↓←→←→BA — a person of culture',                       emoji: '⬆️', icon: 'gamepad',      category: 'secret', rarity: 'legendary', xp: 100, secret: true, hint: '30 lives weren\'t enough for the void',           trigger: { custom: 'konami_code' } },
];

// ─── Lookup Helpers ───────────────────────────────────────────

/** Map of id → AchievementDef for O(1) lookup */
export const ACHIEVEMENT_MAP: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map(a => [a.id, a])
);

/** Get achievements by category */
export function getByCategory(cat: AchievementCategory): AchievementDef[] {
  return ACHIEVEMENTS.filter(a => a.category === cat);
}

/** Get all visible (non-secret) achievements */
export function getVisible(): AchievementDef[] {
  return ACHIEVEMENTS.filter(a => !a.secret);
}

/** Get visible + unlocked secrets */
export function getDisplayable(unlocked: Set<string>): AchievementDef[] {
  return ACHIEVEMENTS.filter(a => !a.secret || unlocked.has(a.id));
}

/** Count by rarity */
export function countByRarity(unlocked: Set<string>): Record<AchievementRarity, { total: number; unlocked: number }> {
  const result: Record<AchievementRarity, { total: number; unlocked: number }> = {
    common:    { total: 0, unlocked: 0 },
    uncommon:  { total: 0, unlocked: 0 },
    rare:      { total: 0, unlocked: 0 },
    epic:      { total: 0, unlocked: 0 },
    legendary: { total: 0, unlocked: 0 },
  };
  for (const a of ACHIEVEMENTS) {
    result[a.rarity].total++;
    if (unlocked.has(a.id)) result[a.rarity].unlocked++;
  }
  return result;
}

/** Total XP from unlocked achievements */
export function totalAchievementXP(unlocked: Set<string>): number {
  return ACHIEVEMENTS.reduce((sum, a) => unlocked.has(a.id) ? sum + a.xp : sum, 0);
}

/** Evaluate which achievements should be unlocked based on stats */
export function evaluateAchievements(
  stats: UserAchievementStats,
  alreadyUnlocked: Set<string>
): AchievementDef[] {
  const newlyUnlocked: AchievementDef[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(achievement.id)) continue;
    if (!achievement.trigger) continue;

    const { stat, threshold, custom } = achievement.trigger;

    // Stat-based triggers
    if (stat && threshold !== undefined) {
      const value = stats[stat as keyof UserAchievementStats];
      if (typeof value === 'number' && value >= threshold) {
        newlyUnlocked.push(achievement);
      } else if (typeof value === 'boolean' && value && threshold === 1) {
        newlyUnlocked.push(achievement);
      }
    }

    // Custom triggers that can be mapped to boolean stats
    if (custom) {
      switch (custom) {
        case 'wallet_connected':
          // Always true if we're evaluating (user is connected)
          newlyUnlocked.push(achievement);
          break;
        case 'own_wallet_analyzed':
          if (stats.ownWalletAnalyzed) newlyUnlocked.push(achievement);
          break;
        case 'first_visit':
          // Grant on first evaluation
          newlyUnlocked.push(achievement);
          break;
        // Other custom triggers are event-based and unlocked explicitly
        default:
          break;
      }
    }
  }

  return newlyUnlocked;
}

// ─── Rank System ──────────────────────────────────────────────

export interface Rank {
  name: string;
  minXp: number;
  icon: string;
  color: string;
}

export const RANKS: Rank[] = [
  { name: 'Void Initiate',    minXp: 0,      icon: '👤', color: 'text-zinc-400' },
  { name: 'Void Explorer',    minXp: 100,    icon: '🔍', color: 'text-cyan-400' },
  { name: 'Rust Apprentice',  minXp: 500,    icon: '🦀', color: 'text-amber-400' },
  { name: 'Builder',          minXp: 1500,   icon: '🔨', color: 'text-purple-400' },
  { name: 'Deployer',         minXp: 5000,   icon: '🚀', color: 'text-near-green' },
  { name: 'Architect',        minXp: 10000,  icon: '🏗️', color: 'text-blue-400' },
  { name: 'Void Commander',   minXp: 20000,  icon: '⭐', color: 'text-indigo-400' },
  { name: 'Void Master',      minXp: 50000,  icon: '👑', color: 'text-amber-300' },
  { name: 'Leviathan',        minXp: 100000, icon: '🐉', color: 'text-purple-300' },
];

export function getRank(xp: number): { current: Rank; next: Rank | null; progress: number } {
  const current = [...RANKS].reverse().find(r => xp >= r.minXp) || RANKS[0];
  const next = RANKS.find(r => r.minXp > xp) || null;
  const progress = next
    ? ((xp - current.minXp) / (next.minXp - current.minXp)) * 100
    : 100;
  return { current, next, progress };
}

/** Calculate total XP from all activity */
export function calculateTotalXP(stats: UserAchievementStats, unlocked: Set<string>): number {
  return (
    (stats.voidsExplored * 10) +
    (stats.briefsGenerated * 50) +
    (stats.sanctumMessages * 5) +
    (stats.codeGenerations * 25) +
    (stats.contractsDeployed * 500) +
    (stats.modulesCompleted * 75) +
    (stats.walletsAnalyzed * 25) +
    totalAchievementXP(unlocked) +
    (stats.currentStreak > 2 ? Math.floor(stats.currentStreak * 10) : 0) // streak bonus
  );
}
