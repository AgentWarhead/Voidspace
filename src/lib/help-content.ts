export const HELP_CONTENT = {
  gapScore: {
    term: 'Gap Score',
    description:
      'A 0\u2013100 score measuring how much opportunity exists in a category. Higher scores mean bigger gaps waiting to be filled. Calculated from TVL demand, number of active projects, and NEAR strategic priorities.',
  },
  tvl: {
    term: 'TVL (Total Value Locked)',
    description:
      'The total dollar value of crypto assets deposited in a protocol\u2019s smart contracts. Higher TVL signals more user trust and capital flowing through the ecosystem.',
  },
  competitionLevel: {
    term: 'Competition Level',
    description:
      'How many active projects already exist in this space. \u201CWide Open\u201D means 0\u20132 projects (huge opportunity), \u201CCompetitive\u201D means 3\u201310, and \u201CSaturated\u201D means 10+ existing players.',
  },
  difficulty: {
    term: 'Build Difficulty',
    description:
      'Estimated technical complexity. Beginner: basic smart contracts and frontend. Intermediate: complex contracts with integrations. Advanced: novel cryptography, infrastructure, or cross-chain systems.',
  },
  strategicCategory: {
    term: 'Strategic Category',
    description:
      'Categories NEAR Protocol has designated as strategic priorities. These receive a 2\u00D7 multiplier on their Gap Score, reflecting extra ecosystem support, grants, and attention from the foundation.',
  },
  aiBrief: {
    term: 'AI Project Brief',
    description:
      'An AI-generated project plan created by Claude, tailored to the specific opportunity. Includes tech stack recommendations, key features, monetization ideas, and NEAR-specific integration guidance.',
  },
  demandScore: {
    term: 'Demand Score',
    description:
      'Measures user demand in a category based on TVL and transaction volume. Higher demand with fewer projects means a bigger opportunity gap.',
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
} as const;
