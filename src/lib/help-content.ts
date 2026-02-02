export const HELP_CONTENT = {
  gapScore: {
    term: 'Void Score',
    description:
      'A 0\u2013100 score measuring how deep the void is in a category. Higher scores mean bigger voids \u2014 more opportunity for builders. Calculated from capital demand, number of active projects, and NEAR priorities.',
  },
  tvl: {
    term: 'TVL (Total Value Locked)',
    description:
      'The total dollar value of crypto assets deposited in a protocol\u2019s smart contracts. Higher TVL signals more user trust and capital flowing through the ecosystem.',
  },
  competitionLevel: {
    term: 'Void Status',
    description:
      'How filled or empty this void is. \u201COpen Void\u201D means 0\u20132 projects (massive opportunity), \u201CClosing\u201D means 3\u201310 builders are moving in, and \u201CFilled\u201D means 10+ established players.',
  },
  difficulty: {
    term: 'Build Difficulty',
    description:
      'Estimated technical complexity. Beginner: basic smart contracts and frontend. Intermediate: complex contracts with integrations. Advanced: novel cryptography, infrastructure, or cross-chain systems.',
  },
  strategicCategory: {
    term: 'NEAR Priority',
    description:
      'Categories NEAR Protocol has designated as strategic priorities. These receive boosted Void Scores, reflecting extra ecosystem support, grants, and attention from the foundation.',
  },
  aiBrief: {
    term: 'Void Brief',
    description:
      'An AI-generated build plan created by Claude, tailored to the specific void. Includes tech stack recommendations, key features, monetization ideas, and NEAR-specific integration guidance.',
  },
  demandScore: {
    term: 'Signal Strength',
    description:
      'Measures how strong the market signal is for this category based on TVL and transaction volume. Stronger signals with fewer projects means a deeper void.',
  },
  shadeAgents: {
    term: 'Shade Agents',
    description:
      'NEAR\u2019s autonomous AI agent framework. Agents run in Trusted Execution Environments (TEEs) for secure, verifiable AI operations on-chain \u2014 AI bots that can hold and manage crypto assets trustlessly.',
  },
  chainAbstraction: {
    term: 'Chain Abstraction',
    description:
      'NEAR\u2019s technology that lets one account work across any blockchain. Users don\u2019t need to think about which chain they\u2019re on \u2014 NEAR handles cross-chain operations seamlessly via Intents and Chain Signatures.',
  },
  chainSignatures: {
    term: 'Chain Signatures',
    description:
      'A cryptographic scheme that enables a single NEAR account to sign transactions on any blockchain (Ethereum, Bitcoin, etc.) without bridges. The foundation for true chain abstraction.',
  },
  intents: {
    term: 'Intents',
    description:
      'A new UX paradigm where users declare what they want to achieve (e.g., \u201Cswap 10 NEAR for USDC at the best rate\u201D) and solvers compete to fulfill the intent optimally. No manual routing or bridging required.',
  },
  totalTransactions: {
    term: 'Total Transactions',
    description:
      'The total number of transactions ever processed on the NEAR blockchain. This metric reflects overall network usage and adoption.',
  },
  totalAccounts: {
    term: 'Total Accounts',
    description:
      'The total number of accounts created on the NEAR blockchain, including user wallets, smart contracts, and named accounts.',
  },
  blockHeight: {
    term: 'Block Height',
    description:
      'The current number of blocks produced on the NEAR blockchain. Each block contains a batch of transactions processed by the network.',
  },
  nodesOnline: {
    term: 'Nodes Online',
    description:
      'The number of validator and RPC nodes currently active on the NEAR network. More nodes means a healthier, more decentralized chain.',
  },
  avgBlockTime: {
    term: 'Avg Block Time',
    description:
      'The average time between blocks being produced on NEAR. Lower block times mean faster transaction finality for users.',
  },
  githubStars: {
    term: 'GitHub Stars',
    description:
      'Total stars across all project repositories in the ecosystem. Stars indicate developer interest and community engagement with open-source projects.',
  },
  githubForks: {
    term: 'GitHub Forks',
    description:
      'Total forks across ecosystem repositories. Forks indicate developers actively building on or extending existing projects.',
  },
  openIssues: {
    term: 'Open Issues',
    description:
      'Total open issues across ecosystem repositories. Active issue tracking indicates healthy projects with engaged communities.',
  },
  recentlyActive: {
    term: 'Recently Active',
    description:
      'Projects with a GitHub commit in the last 30 days. A high ratio of recently active projects signals a healthy, developing ecosystem.',
  },
  totalProjects: {
    term: 'Total Projects',
    description:
      'The total number of projects tracked in this category, including both active and inactive. More projects indicates a more mature category.',
  },
  activeProjects: {
    term: 'Active Projects',
    description:
      'Projects currently active in this category — maintained, updated, and with recent on-chain or GitHub activity.',
  },
} as const;
