// ============================================================
// Cross-Chain Competition Data
// ============================================================

export interface CrossChainCompetitor {
  name: string;
  chain: 'Ethereum' | 'Solana' | 'Polygon' | 'Arbitrum' | 'Base' | 'Avalanche';
  category: string; // matches Voidspace category slugs
  tvl?: string; // e.g. "$1.2B"
  description: string;
}

// Static competitor data for demo purposes at Nearcon
const COMPETITORS: CrossChainCompetitor[] = [
  // DeFi
  {
    name: 'Uniswap',
    chain: 'Ethereum',
    category: 'defi',
    tvl: '$4.2B',
    description: 'Leading decentralized exchange and automated market maker'
  },
  {
    name: 'Raydium',
    chain: 'Solana',
    category: 'defi',
    tvl: '$1.8B',
    description: 'Solana-based AMM providing liquidity to Serum orderbook'
  },
  {
    name: 'Aave',
    chain: 'Ethereum',
    category: 'defi',
    tvl: '$12.5B',
    description: 'Decentralized lending and borrowing protocol'
  },
  {
    name: 'GMX',
    chain: 'Arbitrum',
    category: 'defi',
    tvl: '$2.1B',
    description: 'Perpetual exchange with zero-price-impact trading'
  },
  {
    name: 'Aerodrome',
    chain: 'Base',
    category: 'defi',
    tvl: '$890M',
    description: 'Next-generation AMM designed for Base ecosystem'
  },

  // NFTs
  {
    name: 'OpenSea',
    chain: 'Ethereum',
    category: 'nfts',
    tvl: '$15.2B',
    description: 'The largest NFT marketplace with millions of digital assets'
  },
  {
    name: 'Magic Eden',
    chain: 'Solana',
    category: 'nfts',
    tvl: '$2.8B',
    description: 'Leading Solana NFT marketplace with gaming focus'
  },
  {
    name: 'Blur',
    chain: 'Ethereum',
    category: 'nfts',
    tvl: '$8.9B',
    description: 'Professional NFT trading platform for pro traders'
  },
  {
    name: 'Element',
    chain: 'Ethereum',
    category: 'nfts',
    tvl: '$1.2B',
    description: 'Community-driven NFT marketplace and aggregator'
  },

  // Gaming
  {
    name: 'Immutable X',
    chain: 'Ethereum',
    category: 'gaming',
    tvl: '$450M',
    description: 'Layer 2 scaling solution for NFT games with zero gas fees'
  },
  {
    name: 'Star Atlas',
    chain: 'Solana',
    category: 'gaming',
    tvl: '$285M',
    description: 'Grand strategy game of space exploration built on Solana'
  },
  {
    name: 'Treasure',
    chain: 'Arbitrum',
    category: 'gaming',
    tvl: '$180M',
    description: 'Decentralized gaming ecosystem connecting metaverse'
  },
  {
    name: 'Beam',
    chain: 'Ethereum',
    category: 'gaming',
    tvl: '$92M',
    description: 'Gaming-focused blockchain with ecosystem of 100+ games'
  },
  {
    name: 'Gala',
    chain: 'Ethereum',
    category: 'gaming',
    tvl: '$340M',
    description: 'Blockchain gaming ecosystem with 1.3M monthly players'
  },

  // DAOs
  {
    name: 'Snapshot',
    chain: 'Ethereum',
    category: 'daos',
    tvl: '$25B',
    description: 'Off-chain governance platform used by 1000+ DAOs'
  },
  {
    name: 'Realms',
    chain: 'Solana',
    category: 'daos',
    tvl: '$3.2B',
    description: 'Governance platform for Solana DAOs and SPL tokens'
  },
  {
    name: 'Aragon',
    chain: 'Ethereum',
    category: 'daos',
    tvl: '$2.8B',
    description: 'Platform to create and manage decentralized organizations'
  },
  {
    name: 'Colony',
    chain: 'Ethereum',
    category: 'daos',
    tvl: '$180M',
    description: 'DAO framework for reputation-weighted governance'
  },

  // Infrastructure
  {
    name: 'The Graph',
    chain: 'Ethereum',
    category: 'infrastructure',
    tvl: '$2.1B',
    description: 'Indexing protocol for querying blockchain data'
  },
  {
    name: 'Chainlink',
    chain: 'Ethereum',
    category: 'infrastructure',
    tvl: '$14.8B',
    description: 'Decentralized oracle network providing real-world data'
  },
  {
    name: 'Pyth Network',
    chain: 'Solana',
    category: 'infrastructure',
    tvl: '$1.8B',
    description: 'Real-time market data oracle network'
  },
  {
    name: 'Gelato',
    chain: 'Ethereum',
    category: 'infrastructure',
    tvl: '$890M',
    description: 'Automated smart contract execution network'
  },
  {
    name: 'Livepeer',
    chain: 'Ethereum',
    category: 'infrastructure',
    tvl: '$450M',
    description: 'Decentralized video streaming network'
  },

  // Developer Tools
  {
    name: 'Hardhat',
    chain: 'Ethereum',
    category: 'developer-tools',
    description: 'Development environment to compile and test smart contracts'
  },
  {
    name: 'Anchor',
    chain: 'Solana',
    category: 'developer-tools',
    description: 'Framework for quickly building secure Solana programs'
  },
  {
    name: 'Foundry',
    chain: 'Ethereum',
    category: 'developer-tools',
    description: 'Fast, portable and modular toolkit for Ethereum development'
  },
  {
    name: 'Truffle',
    chain: 'Ethereum',
    category: 'developer-tools',
    description: 'Development environment and testing framework'
  },
  {
    name: 'Metaplex',
    chain: 'Solana',
    category: 'developer-tools',
    description: 'Protocol and tooling for building NFT experiences on Solana'
  },

  // Social
  {
    name: 'Lens Protocol',
    chain: 'Polygon',
    category: 'social',
    tvl: '$85M',
    description: 'Decentralized social graph protocol with 100K+ profiles'
  },
  {
    name: 'Farcaster',
    chain: 'Base',
    category: 'social',
    tvl: '$45M',
    description: 'Decentralized social network with protocol-native apps'
  },
  {
    name: 'DeSo',
    chain: 'Ethereum',
    category: 'social',
    tvl: '$120M',
    description: 'Blockchain built for decentralized social applications'
  },
  {
    name: 'Cyberconnect',
    chain: 'Ethereum',
    category: 'social',
    tvl: '$28M',
    description: 'Web3 social network infrastructure'
  },

  // Identity
  {
    name: 'ENS',
    chain: 'Ethereum',
    category: 'identity',
    tvl: '$1.2B',
    description: 'Ethereum Name Service for human-readable wallet addresses'
  },
  {
    name: 'Bonfida',
    chain: 'Solana',
    category: 'identity',
    tvl: '$45M',
    description: 'Solana Name Service and on-chain data analytics'
  },
  {
    name: 'Worldcoin',
    chain: 'Ethereum',
    category: 'identity',
    tvl: '$890M',
    description: 'Global identity and financial network using biometric proof'
  },
  {
    name: 'Unstoppable Domains',
    chain: 'Ethereum',
    category: 'identity',
    tvl: '$280M',
    description: 'Blockchain domains that replace wallet addresses'
  },

  // Cross-Chain
  {
    name: 'LayerZero',
    chain: 'Ethereum',
    category: 'cross-chain',
    tvl: '$6.8B',
    description: 'Omnichain interoperability protocol'
  },
  {
    name: 'Wormhole',
    chain: 'Solana',
    category: 'cross-chain',
    tvl: '$1.2B',
    description: 'Generic message passing for cross-chain communication'
  },
  {
    name: 'Axelar',
    chain: 'Ethereum',
    category: 'cross-chain',
    tvl: '$890M',
    description: 'Secure cross-chain communication for Web3'
  },
  {
    name: 'Stargate',
    chain: 'Ethereum',
    category: 'cross-chain',
    tvl: '$450M',
    description: 'Fully composable liquidity transport protocol'
  },

  // Payments
  {
    name: 'Circle USDC',
    chain: 'Ethereum',
    category: 'payments',
    tvl: '$33.4B',
    description: 'Fully reserved digital dollar stablecoin'
  },
  {
    name: 'Solana Pay',
    chain: 'Solana',
    category: 'payments',
    tvl: '$2.8B',
    description: 'Open payment framework built on Solana blockchain'
  },
  {
    name: 'Request Network',
    chain: 'Ethereum',
    category: 'payments',
    tvl: '$120M',
    description: 'Decentralized payment requests and invoicing'
  },
  {
    name: 'Flexa',
    chain: 'Ethereum',
    category: 'payments',
    tvl: '$890M',
    description: 'Digital payment network enabling instant crypto spending'
  },

  // AI/ML
  {
    name: 'Bittensor',
    chain: 'Ethereum',
    category: 'ai',
    tvl: '$3.2B',
    description: 'Decentralized machine learning network'
  },
  {
    name: 'Fetch.ai',
    chain: 'Ethereum',
    category: 'ai',
    tvl: '$890M',
    description: 'AI-driven autonomous economic agents'
  },
  {
    name: 'Ocean Protocol',
    chain: 'Ethereum',
    category: 'ai',
    tvl: '$450M',
    description: 'Data sharing and monetization platform for AI'
  },
  {
    name: 'SingularityNET',
    chain: 'Ethereum',
    category: 'ai',
    tvl: '$280M',
    description: 'Decentralized AI marketplace'
  },

  // Privacy
  {
    name: 'Tornado Cash',
    chain: 'Ethereum',
    category: 'privacy',
    tvl: '$2.8B',
    description: 'Privacy solution for Ethereum transactions'
  },
  {
    name: 'Aztec',
    chain: 'Ethereum',
    category: 'privacy',
    tvl: '$120M',
    description: 'Privacy-preserving smart contracts and rollup'
  },
  {
    name: 'Oasis Network',
    chain: 'Ethereum',
    category: 'privacy',
    tvl: '$180M',
    description: 'Privacy-enabled blockchain platform'
  }
];

// Chain colors for UI
export const CHAIN_COLORS = {
  Ethereum: '#627EEA',
  Solana: '#9945FF',
  Polygon: '#8247E5',
  Arbitrum: '#28A0F0',
  Base: '#0052FF',
  Avalanche: '#E84142'
} as const;

// Chain emojis for visual distinction
export const CHAIN_EMOJIS = {
  Ethereum: '⟠',
  Solana: '◎',
  Polygon: '⬢',
  Arbitrum: '🅰',
  Base: '🔵',
  Avalanche: '🔺'
} as const;

/**
 * Get competitors for a specific category
 */
export function getCompetitorsForCategory(categorySlug: string): CrossChainCompetitor[] {
  return COMPETITORS.filter(competitor => 
    competitor.category === categorySlug ||
    competitor.category === categorySlug.replace('-', '') ||
    competitor.category.replace('-', '') === categorySlug
  );
}

/**
 * Get summary stats for a category's cross-chain competition
 */
export function getCategoryCompetitionSummary(categorySlug: string) {
  const competitors = getCompetitorsForCategory(categorySlug);
  const chainStats = competitors.reduce((acc, comp) => {
    acc[comp.chain] = (acc[comp.chain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalTVL = competitors
    .filter(comp => comp.tvl)
    .reduce((sum, comp) => {
      const tvlValue = parseFloat(comp.tvl!.replace(/[$BMK]/g, ''));
      const multiplier = comp.tvl!.includes('B') ? 1e9 : comp.tvl!.includes('M') ? 1e6 : comp.tvl!.includes('K') ? 1e3 : 1;
      return sum + (tvlValue * multiplier);
    }, 0);

  return {
    totalCompetitors: competitors.length,
    chainStats,
    totalTVL,
    topChains: Object.entries(chainStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([chain, count]) => ({ chain, count }))
  };
}

/**
 * Get all available categories with competitor data
 */
export function getAvailableCategories(): string[] {
  return Array.from(new Set(COMPETITORS.map(comp => comp.category))).sort();
}

/**
 * Get random competitors from other chains (for constellation map insights)
 */
export function getRandomCrossChainInsight(): string {
  const categories = getAvailableCategories();
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const competitors = getCompetitorsForCategory(randomCategory);
  
  if (competitors.length === 0) return '';
  
  const chainCounts = competitors.reduce((acc, comp) => {
    acc[comp.chain] = (acc[comp.chain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topChain = Object.entries(chainCounts).sort(([,a], [,b]) => b - a)[0];
  
  return `${topChain[1]} ${randomCategory} protocols dominate on ${topChain[0]}`;
}