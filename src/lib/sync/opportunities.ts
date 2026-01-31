import { SupabaseClient } from '@supabase/supabase-js';
import { calculateGapScore, getCompetitionLevel, getDifficulty } from '@/lib/gap-score';

interface OpportunityTemplate {
  title: string;
  description: string;
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Adjust gap score relative to category base: 1.0 = same, 0.9 = slightly lower */
  scoreMultiplier: number;
}

const categoryOpportunities: Record<string, OpportunityTemplate[]> = {
  'ai-agents': [
    {
      title: 'Autonomous AI Agent Marketplace',
      description: 'A decentralized marketplace for discovering, deploying, and monetizing autonomous AI agents built on NEAR Shade Agents with TEE-based execution.',
      features: ['Agent discovery and rating system', 'TEE-based secure execution via Shade Agents', 'Pay-per-use agent monetization', 'Multi-model orchestration dashboard'],
      difficulty: 'advanced',
      scoreMultiplier: 1.0,
    },
    {
      title: 'AI-Powered Smart Contract Auditor',
      description: 'An AI agent that automatically audits NEAR smart contracts for vulnerabilities, gas optimization opportunities, and best practice violations.',
      features: ['Automated vulnerability scanning', 'Gas optimization suggestions', 'Natural language audit reports', 'CI/CD integration for pre-deploy checks'],
      difficulty: 'advanced',
      scoreMultiplier: 0.95,
    },
    {
      title: 'On-Chain AI Inference Network',
      description: 'A decentralized compute network for running AI model inference on-chain, enabling trustless AI predictions for DeFi, gaming, and governance.',
      features: ['Decentralized GPU compute marketplace', 'Verifiable inference proofs', 'Model registry and versioning', 'API gateway for dApp integration'],
      difficulty: 'advanced',
      scoreMultiplier: 0.9,
    },
  ],
  'privacy': [
    {
      title: 'Private DeFi Protocol',
      description: 'A privacy-preserving DeFi suite enabling confidential swaps, lending, and yield farming using zero-knowledge proofs on NEAR.',
      features: ['ZK-proof based private swaps', 'Confidential lending pools', 'Shielded yield vaults', 'Compliance-friendly selective disclosure'],
      difficulty: 'advanced',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Decentralized Identity & Credentials',
      description: 'A self-sovereign identity platform on NEAR that lets users prove credentials (age, KYC, membership) without revealing personal data.',
      features: ['ZK credential verification', 'Selective disclosure proofs', 'Cross-chain identity portability', 'Verifiable credential issuance tools'],
      difficulty: 'advanced',
      scoreMultiplier: 0.95,
    },
  ],
  'intents': [
    {
      title: 'Intent Solver Network',
      description: 'A competitive solver network for NEAR Intents that finds optimal execution paths for user transactions across multiple chains and protocols.',
      features: ['Multi-chain intent resolution', 'Solver competition framework', 'Gas-optimized routing', 'Intent composability engine'],
      difficulty: 'advanced',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Cross-Chain Asset Bridge',
      description: 'A seamless bridge leveraging NEAR Chain Signatures for trustless asset transfers between NEAR, Ethereum, Bitcoin, and other chains.',
      features: ['Chain Signatures integration', 'Multi-chain liquidity pools', 'Real-time bridging status', 'Automated slippage protection'],
      difficulty: 'advanced',
      scoreMultiplier: 0.95,
    },
    {
      title: 'Universal Account Abstraction Layer',
      description: 'An account abstraction SDK that lets users interact with any blockchain using a single NEAR account, powered by Chain Abstraction.',
      features: ['Single-account multi-chain access', 'Social recovery and session keys', 'Gas sponsorship for new users', 'SDK for dApp developers'],
      difficulty: 'intermediate',
      scoreMultiplier: 0.9,
    },
  ],
  'rwa': [
    {
      title: 'Real Estate Tokenization Platform',
      description: 'A platform for fractional ownership of real estate through NEAR-based tokens, with automated rental income distribution.',
      features: ['Property tokenization framework', 'Automated dividend distribution', 'Secondary market trading', 'Legal compliance oracle'],
      difficulty: 'intermediate',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Supply Chain Verification System',
      description: 'An end-to-end supply chain tracking system using NEAR for provenance verification, from raw materials to consumer products.',
      features: ['IoT device integration', 'Immutable provenance records', 'QR-based consumer verification', 'Multi-party attestation'],
      difficulty: 'intermediate',
      scoreMultiplier: 0.95,
    },
    {
      title: 'NEAR-Native Payments Gateway',
      description: 'A merchant payment processor enabling businesses to accept NEAR and stablecoin payments with instant fiat off-ramps.',
      features: ['POS integration SDK', 'Instant stablecoin settlement', 'Multi-currency support', 'Invoice and billing automation'],
      difficulty: 'beginner',
      scoreMultiplier: 0.9,
    },
  ],
  'data-analytics': [
    {
      title: 'NEAR Ecosystem Intelligence Dashboard',
      description: 'A comprehensive analytics platform tracking NEAR ecosystem health: TVL flows, developer activity, user growth, and protocol metrics.',
      features: ['Real-time TVL tracking', 'Developer activity heatmaps', 'Cross-protocol comparison tools', 'Custom alert system'],
      difficulty: 'intermediate',
      scoreMultiplier: 1.0,
    },
    {
      title: 'On-Chain Data Indexing Service',
      description: 'A high-performance indexing service for NEAR blockchain data, providing GraphQL APIs for dApp developers to query historical and real-time data.',
      features: ['Sub-second query latency', 'GraphQL and REST APIs', 'Custom indexer deployment', 'WebSocket real-time subscriptions'],
      difficulty: 'advanced',
      scoreMultiplier: 0.95,
    },
  ],
  'defi': [
    {
      title: 'Cross-Chain Yield Aggregator',
      description: 'An intelligent yield optimization platform that automatically moves assets across NEAR and other chains to maximize returns.',
      features: ['Auto-compounding vaults', 'Risk-adjusted strategy selection', 'Cross-chain yield routing', 'Portfolio analytics dashboard'],
      difficulty: 'intermediate',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Undercollateralized Lending Protocol',
      description: 'A reputation-based lending protocol on NEAR that uses on-chain credit scoring to offer reduced collateral requirements.',
      features: ['On-chain credit scoring', 'Graduated collateral tiers', 'Flash loan prevention', 'Liquidation insurance pool'],
      difficulty: 'advanced',
      scoreMultiplier: 0.95,
    },
    {
      title: 'Structured DeFi Products',
      description: 'A platform for creating and trading structured financial products like options, perpetuals, and yield tranches on NEAR.',
      features: ['Options pricing engine', 'Perpetual futures with NEAR-native settlement', 'Yield tranching (senior/junior)', 'Risk analytics dashboard'],
      difficulty: 'advanced',
      scoreMultiplier: 0.9,
    },
  ],
  'dex-trading': [
    {
      title: 'NEAR-Native Order Book DEX',
      description: 'A high-performance central limit order book DEX leveraging NEAR sub-second finality for a CEX-like trading experience.',
      features: ['On-chain order book with sub-600ms matching', 'Advanced order types (limit, stop, trailing)', 'Trading API for bots', 'Real-time depth charts'],
      difficulty: 'advanced',
      scoreMultiplier: 1.0,
    },
    {
      title: 'DEX Aggregator & Best Execution Router',
      description: 'A trade routing engine that splits orders across multiple NEAR DEXs to find the best price with minimal slippage.',
      features: ['Multi-DEX price comparison', 'Smart order routing', 'MEV protection', 'Transaction cost estimation'],
      difficulty: 'intermediate',
      scoreMultiplier: 0.95,
    },
  ],
  'gaming': [
    {
      title: 'Blockchain Gaming SDK for NEAR',
      description: 'A game developer SDK that makes it easy to integrate NEAR wallets, NFT items, and token economies into Unity and Unreal Engine games.',
      features: ['Unity and Unreal Engine plugins', 'In-game wallet integration', 'NFT item minting and trading', 'Player progression on-chain'],
      difficulty: 'intermediate',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Play-to-Earn Game Platform',
      description: 'A gaming platform where players earn NEAR tokens and NFTs through skill-based gameplay, with anti-bot measures and fair reward distribution.',
      features: ['Skill-based reward distribution', 'Anti-bot Sybil resistance', 'Tournament and leaderboard system', 'NFT crafting and evolution'],
      difficulty: 'intermediate',
      scoreMultiplier: 0.95,
    },
    {
      title: 'Metaverse World Builder',
      description: 'A no-code platform for creating and deploying 3D metaverse experiences on NEAR with land ownership, social features, and a creator economy.',
      features: ['Drag-and-drop 3D editor', 'Land NFT ownership', 'Avatar customization system', 'In-world commerce and events'],
      difficulty: 'beginner',
      scoreMultiplier: 0.9,
    },
  ],
  'nfts': [
    {
      title: 'AI-Generative NFT Platform',
      description: 'An NFT creation platform that uses AI to help artists generate, remix, and mint unique digital art with provable on-chain provenance.',
      features: ['AI art generation tools', 'On-chain provenance and royalties', 'Collaborative creation features', 'Auction and fixed-price marketplace'],
      difficulty: 'intermediate',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Dynamic NFT Framework',
      description: 'A framework for creating NFTs that evolve over time based on on-chain events, oracles, or user interactions — living digital assets.',
      features: ['Event-driven NFT mutations', 'Oracle-connected dynamic traits', 'Composable NFT standards', 'Visual evolution timeline'],
      difficulty: 'intermediate',
      scoreMultiplier: 0.95,
    },
  ],
  'daos': [
    {
      title: 'DAO Operating System',
      description: 'A full-stack DAO management platform for NEAR with proposal creation, voting, treasury management, and contributor compensation.',
      features: ['Proposal templates and workflows', 'Quadratic and conviction voting', 'Treasury multi-sig with spending limits', 'Contributor reputation tracking'],
      difficulty: 'intermediate',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Cross-DAO Collaboration Hub',
      description: 'A platform enabling DAOs on NEAR to collaborate on shared initiatives, pool resources, and coordinate governance across organizations.',
      features: ['Inter-DAO proposal system', 'Shared treasury pools', 'Cross-DAO delegate voting', 'Collaboration analytics'],
      difficulty: 'intermediate',
      scoreMultiplier: 0.95,
    },
  ],
  'social': [
    {
      title: 'Decentralized Social Media Platform',
      description: 'A censorship-resistant social platform on NEAR where users own their content, social graph, and earn from engagement.',
      features: ['User-owned content and social graph', 'Token-gated communities', 'Creator tipping and subscriptions', 'Content moderation DAO'],
      difficulty: 'intermediate',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Creator Monetization Toolkit',
      description: 'A suite of tools for content creators to monetize on NEAR: memberships, digital products, tipping, and revenue sharing with collaborators.',
      features: ['Subscription NFT memberships', 'Digital product storefront', 'Revenue splitting contracts', 'Fan engagement analytics'],
      difficulty: 'beginner',
      scoreMultiplier: 0.95,
    },
  ],
  'dev-tools': [
    {
      title: 'NEAR Smart Contract IDE',
      description: 'A browser-based IDE for writing, testing, and deploying NEAR smart contracts in Rust and JavaScript with built-in debugging and simulation.',
      features: ['Browser-based code editor with LSP', 'Contract simulation sandbox', 'One-click testnet deployment', 'Gas profiling and optimization hints'],
      difficulty: 'intermediate',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Smart Contract Testing Framework',
      description: 'A comprehensive testing framework for NEAR contracts with property-based testing, fuzzing, gas benchmarking, and CI integration.',
      features: ['Property-based testing', 'Automated fuzzing', 'Gas benchmarking suite', 'GitHub Actions integration'],
      difficulty: 'intermediate',
      scoreMultiplier: 0.95,
    },
    {
      title: 'No-Code dApp Builder',
      description: 'A visual builder that lets non-developers create NEAR dApps by connecting pre-built components — smart contracts, UI, and wallet auth.',
      features: ['Drag-and-drop UI builder', 'Pre-built contract templates', 'Wallet connection wizard', 'One-click mainnet deployment'],
      difficulty: 'beginner',
      scoreMultiplier: 0.9,
    },
  ],
  'wallets': [
    {
      title: 'Social Recovery Smart Wallet',
      description: 'A next-gen NEAR wallet with social recovery, session keys, and biometric auth — no seed phrases needed.',
      features: ['Social recovery via trusted contacts', 'Biometric authentication', 'Session keys for dApp interactions', 'Transaction simulation previews'],
      difficulty: 'intermediate',
      scoreMultiplier: 1.0,
    },
    {
      title: 'Multi-Chain Portfolio Manager',
      description: 'A unified portfolio app that tracks assets across NEAR and other chains via Chain Signatures, with DeFi position management.',
      features: ['Cross-chain asset tracking', 'DeFi position aggregation', 'Profit/loss analytics', 'Tax reporting export'],
      difficulty: 'intermediate',
      scoreMultiplier: 0.95,
    },
  ],
  'education': [
    {
      title: 'Learn-to-Earn NEAR Academy',
      description: 'An interactive learning platform where developers earn NEAR tokens and NFT credentials by completing courses on NEAR development.',
      features: ['Interactive coding challenges', 'NFT completion certificates', 'Token rewards for course completion', 'Peer review system'],
      difficulty: 'beginner',
      scoreMultiplier: 1.0,
    },
    {
      title: 'NEAR Developer Onboarding Portal',
      description: 'A guided onboarding experience for new NEAR developers with project scaffolding, tutorials, and a path from zero to deployed dApp.',
      features: ['Step-by-step guided tutorials', 'Project template generator', 'Testnet faucet integration', 'Community mentorship matching'],
      difficulty: 'beginner',
      scoreMultiplier: 0.95,
    },
  ],
  'infrastructure': [
    {
      title: 'Decentralized RPC Network',
      description: 'A decentralized, incentivized RPC node network for NEAR that provides high-availability endpoints with geographic load balancing.',
      features: ['Incentivized node operators', 'Geographic load balancing', 'Rate limiting and API key management', 'Uptime monitoring dashboard'],
      difficulty: 'advanced',
      scoreMultiplier: 1.0,
    },
    {
      title: 'NEAR Block Explorer 2.0',
      description: 'A next-generation block explorer with advanced search, contract verification, token analytics, and developer-friendly API.',
      features: ['Advanced transaction search', 'Smart contract source verification', 'Token holder analytics', 'REST and WebSocket APIs'],
      difficulty: 'intermediate',
      scoreMultiplier: 0.95,
    },
  ],
};

function generateReasoning(
  categoryName: string,
  activeCount: number,
  totalTVL: number,
  isStrategic: boolean,
  template: OpportunityTemplate,
): string {
  const tvlStr = totalTVL > 0
    ? `$${(totalTVL / 1_000_000).toFixed(1)}M in TVL`
    : 'minimal TVL';

  const strategic = isStrategic
    ? ' This is a strategic priority area for NEAR Protocol, attracting extra ecosystem support.'
    : '';

  return `The ${categoryName} category on NEAR has ${activeCount} active project${activeCount !== 1 ? 's' : ''} with ${tvlStr}.${strategic} "${template.title}" addresses a specific gap: ${template.description.split('.')[0].toLowerCase()}.`;
}

export async function generateOpportunities(supabase: SupabaseClient) {
  let created = 0;
  let updated = 0;

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  if (!categories) throw new Error('No categories found');

  for (const category of categories) {
    // Count total and active projects in this category
    const { count: totalCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id);

    const { count: activeCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id)
      .eq('is_active', true);

    // Fetch per-project stats for this category
    const { data: projectStats } = await supabase
      .from('projects')
      .select('tvl_usd, github_stars, github_forks, github_open_issues, last_github_commit, is_active')
      .eq('category_id', category.id);

    const categoryProjects = projectStats || [];
    const totalTVL = categoryProjects.reduce((sum, p) => sum + (Number(p.tvl_usd) || 0), 0);

    // Calculate base gap score
    const baseGapScore = calculateGapScore({
      categorySlug: category.slug,
      totalProjects: totalCount || 0,
      activeProjects: activeCount || 0,
      totalTVL,
      isStrategic: category.is_strategic,
      strategicMultiplier: Number(category.strategic_multiplier),
      projectTVLs: categoryProjects.map((p) => Number(p.tvl_usd) || 0),
      projectGithubStats: categoryProjects.map((p) => ({
        stars: p.github_stars || 0,
        forks: p.github_forks || 0,
        openIssues: p.github_open_issues || 0,
        lastCommit: p.last_github_commit,
        isActive: p.is_active,
      })),
    });

    const competitionLevel = getCompetitionLevel(activeCount || 0);

    // Get templates for this category (or generate a default one)
    const templates = categoryOpportunities[category.slug] || [
      {
        title: `Build on ${category.name} — NEAR`,
        description: `An opportunity to build innovative solutions in the ${category.name} space on NEAR Protocol.`,
        features: ['Core protocol feature', 'User dashboard', 'API integration', 'Analytics'],
        difficulty: getDifficulty(category.slug),
        scoreMultiplier: 1.0,
      },
    ];

    // Fetch existing opportunities for this category
    const { data: existingOpps } = await supabase
      .from('opportunities')
      .select('id, title')
      .eq('category_id', category.id);

    const existingByTitle = new Map(
      (existingOpps || []).map((o) => [o.title, o.id])
    );

    for (const template of templates) {
      const gapScore = Math.min(
        Math.round(baseGapScore * template.scoreMultiplier),
        100
      );

      const opportunityData = {
        category_id: category.id,
        title: template.title,
        description: template.description,
        gap_score: gapScore,
        demand_score: Math.log10(totalTVL + 1),
        competition_level: competitionLevel,
        reasoning: generateReasoning(
          category.name,
          activeCount || 0,
          totalTVL,
          category.is_strategic,
          template,
        ),
        suggested_features: template.features,
        difficulty: template.difficulty,
      };

      const existingId = existingByTitle.get(template.title);

      if (existingId) {
        await supabase
          .from('opportunities')
          .update(opportunityData)
          .eq('id', existingId);
        updated++;
      } else {
        await supabase
          .from('opportunities')
          .insert(opportunityData);
        created++;
      }
    }
  }

  return { created, updated };
}
