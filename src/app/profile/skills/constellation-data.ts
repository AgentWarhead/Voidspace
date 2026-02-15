/* ─── Skill Constellation — Pure Data + Helpers ────────────── */
/* No React imports — this is the single source of truth for all 66 modules */

import type { ElementType } from 'react';

/* ─── Types ────────────────────────────────────────────────── */

export interface SkillNode {
  id: string;
  label: string;
  icon: ElementType;
  description: string;
  details: string[];
  xp: number;
  tier: 'foundation' | 'core' | 'advanced' | 'mastery';
  track: TrackId;
  position: number;
  unlocks: string[];
  prerequisites: string[];
  estimatedTime: string;
  rewards: string[];
  link?: string;
}

export interface Connection {
  from: string;
  to: string;
}

export type NodeStatus = 'completed' | 'available' | 'locked';
export type TrackId = 'explorer' | 'builder' | 'hacker' | 'founder';

export interface TrackConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  hex: string;
  icon: ElementType;
  xpPerModule: number;
  description: string;
}

export interface Level {
  name: string;
  minXP: number;
  icon: string;
}

/* ─── Constants ────────────────────────────────────────────── */

export const STORAGE_KEY = 'voidspace-skill-progress';
export const TOTAL_MODULES = 66;

/* ─── Tier Sizes (px) ──────────────────────────────────────── */

export const TIER_SIZES: Record<string, number> = {
  foundation: 32,
  core: 40,
  advanced: 48,
  mastery: 60,
};

/* ─── Levels ───────────────────────────────────────────────── */

export const LEVELS: Level[] = [
  { name: 'Cadet', minXP: 0, icon: '🌱' },
  { name: 'Astronaut', minXP: 500, icon: '🚀' },
  { name: 'Pilot', minXP: 1500, icon: '✈️' },
  { name: 'Commander', minXP: 3000, icon: '⭐' },
  { name: 'Admiral', minXP: 5000, icon: '🎖️' },
  { name: 'Legend', minXP: 7000, icon: '👑' },
];

/* ─── Track Config ─────────────────────────────────────────── */

// Icons imported lazily by components — we store string keys here
// and map to actual icons in the component layer
// Actually, to keep compatibility, we import lucide-react here
// but only the icon references (not React components)

// We need a workaround: store icon names as strings, resolve in components
// But the original code uses ElementType... let's keep it simple and
// just import the icons we need (they're tree-shaken anyway)

import {
  BookOpen, Wallet, Code2, FileCode, FlaskConical, Rocket, Star, Brain, Globe,
  Target, Coins, AppWindow, ShieldCheck, CircleDollarSign, Trophy, Zap, Shield,
  Crown, Compass, Terminal, Flame, Award, CheckCircle, Lock,
} from 'lucide-react';

// Re-export icons for use by components
import { RotateCcw, X, ArrowRight, ChevronRight } from 'lucide-react';

export { 
  BookOpen, Wallet, Code2, FileCode, FlaskConical, Rocket, Star, Brain, Globe,
  Target, Coins, AppWindow, ShieldCheck, CircleDollarSign, Trophy, Zap, Shield,
  Crown, Compass, Terminal, Flame, Award, CheckCircle, Lock,
  RotateCcw, X, ArrowRight, ChevronRight,
};

export const TRACK_CONFIG: Record<TrackId, TrackConfig> = {
  explorer: {
    label: 'Explorer', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/30', glow: 'rgba(0, 212, 255, 0.3)', hex: '#00D4FF',
    icon: Compass, xpPerModule: 50, description: 'Discover the NEAR ecosystem',
  },
  builder: {
    label: 'Builder', color: 'text-near-green', bg: 'bg-near-green/10',
    border: 'border-near-green/30', glow: 'rgba(0, 236, 151, 0.3)', hex: '#00EC97',
    icon: Code2, xpPerModule: 100, description: 'Build smart contracts & dApps',
  },
  hacker: {
    label: 'Hacker', color: 'text-purple-400', bg: 'bg-purple-400/10',
    border: 'border-purple-400/30', glow: 'rgba(192, 132, 252, 0.3)', hex: '#C084FC',
    icon: Terminal, xpPerModule: 150, description: 'Master advanced development',
  },
  founder: {
    label: 'Founder', color: 'text-accent-orange', bg: 'bg-accent-orange/10',
    border: 'border-accent-orange/30', glow: 'rgba(251, 146, 60, 0.3)', hex: '#FB923C',
    icon: Flame, xpPerModule: 75, description: 'Launch your NEAR project',
  },
};

/* ─── Track Quadrants for positioning ──────────────────────── */

export const TRACK_QUADRANTS: Record<TrackId, { cx: number; cy: number }> = {
  explorer: { cx: 280, cy: 230 },   // top-left
  builder:  { cx: 820, cy: 230 },   // top-right
  hacker:   { cx: 280, cy: 720 },   // bottom-left
  founder:  { cx: 820, cy: 720 },   // bottom-right
};

export const MAP_WIDTH = 1100;
export const MAP_HEIGHT = 950;

/* ─── Skill Nodes — All 66 Modules ────────────────────────── */

export const skillNodes: SkillNode[] = [
  // EXPLORER TRACK (16 modules) — 50 XP each = 800 XP
  { id: 'what-is-blockchain', label: 'What is Blockchain?', icon: BookOpen, description: 'Understand the fundamentals of blockchain technology and why it matters.', details: ['Distributed ledger basics', 'Consensus mechanisms', 'Blocks and transactions', 'Decentralization benefits', 'Public vs private chains', 'Blockchain use cases'], xp: 50, tier: 'foundation', track: 'explorer', position: 0, unlocks: ['what-is-near'], prerequisites: [], estimatedTime: '1.5 hours', rewards: ['Blockchain Basics Badge'], link: '/learn/explorer/what-is-blockchain' },
  { id: 'what-is-near', label: 'What is NEAR?', icon: Star, description: "Discover NEAR Protocol — its architecture, vision, and what makes it unique.", details: ["NEAR's sharded architecture", 'Nightshade consensus', 'Named accounts model', 'Human-readable addresses', 'Developer experience focus', 'Chain abstraction vision'], xp: 50, tier: 'foundation', track: 'explorer', position: 1, unlocks: ['create-a-wallet'], prerequisites: ['what-is-blockchain'], estimatedTime: '2 hours', rewards: ['NEAR Explorer Badge'], link: '/learn/explorer/what-is-near' },
  { id: 'create-a-wallet', label: 'Create a Wallet', icon: Wallet, description: 'Set up your first NEAR wallet and secure your account.', details: ['Choose a wallet provider', 'Create testnet account', 'Understand access keys', 'Backup seed phrase', 'Fund with testnet NEAR', 'Security best practices'], xp: 50, tier: 'foundation', track: 'explorer', position: 2, unlocks: ['your-first-transaction'], prerequisites: ['what-is-near'], estimatedTime: '30 min', rewards: ['Wallet Pioneer Badge'], link: '/learn/explorer/create-a-wallet' },
  { id: 'your-first-transaction', label: 'Your First Transaction', icon: Zap, description: 'Send your first on-chain transaction on NEAR.', details: ['Send NEAR between accounts', 'Explore on NearBlocks', 'Understand gas & receipts', 'Call a smart contract', 'Check account state', 'View transaction history'], xp: 50, tier: 'foundation', track: 'explorer', position: 3, unlocks: ['understanding-dapps'], prerequisites: ['create-a-wallet'], estimatedTime: '20 min', rewards: ['First Tx Badge'], link: '/learn/explorer/your-first-transaction' },
  { id: 'understanding-dapps', label: 'Understanding dApps', icon: AppWindow, description: 'Learn what decentralized applications are and how they work on NEAR.', details: ['What makes an app "decentralized"', 'Frontend + smart contract', 'Wallet connection flow', 'On-chain vs off-chain data', 'Popular NEAR dApps', 'User experience patterns'], xp: 50, tier: 'foundation', track: 'explorer', position: 4, unlocks: ['reading-smart-contracts'], prerequisites: ['your-first-transaction'], estimatedTime: '1 hour', rewards: ['dApp Explorer Badge'], link: '/learn/explorer/understanding-dapps' },
  { id: 'reading-smart-contracts', label: 'Reading Smart Contracts', icon: FileCode, description: 'Learn to read and understand NEAR smart contract code.', details: ['Contract structure overview', 'View vs change methods', 'State and storage', 'Reading contract source', 'ABI and interfaces', 'Common contract patterns'], xp: 50, tier: 'core', track: 'explorer', position: 0, unlocks: ['near-ecosystem-tour'], prerequisites: ['understanding-dapps'], estimatedTime: '1.5 hours', rewards: ['Code Reader Badge'], link: '/learn/explorer/reading-smart-contracts' },
  { id: 'near-ecosystem-tour', label: 'NEAR Ecosystem Tour', icon: Globe, description: 'Explore the major dApps, protocols, and projects in the NEAR ecosystem.', details: ['DeFi protocols (Ref, Burrow)', 'NFT marketplaces', 'Social protocols', 'Infrastructure tools', 'DAO ecosystem', 'Chain abstraction projects'], xp: 50, tier: 'core', track: 'explorer', position: 1, unlocks: ['near-vs-other-chains', 'reading-the-explorer'], prerequisites: ['reading-smart-contracts'], estimatedTime: '1 hour', rewards: ['Ecosystem Explorer Badge'], link: '/learn/explorer/near-ecosystem-tour' },
  { id: 'near-vs-other-chains', label: 'NEAR vs Other Chains', icon: Shield, description: 'Compare NEAR Protocol with Ethereum, Solana, and other L1s.', details: ['Sharding vs monolithic', 'Gas fee comparison', 'Developer experience', 'Account model differences', 'Finality & throughput', 'Ecosystem maturity'], xp: 50, tier: 'core', track: 'explorer', position: 2, unlocks: ['choose-your-path'], prerequisites: ['near-ecosystem-tour'], estimatedTime: '1 hour', rewards: ['Chain Analyst Badge'], link: '/learn/explorer/near-vs-other-chains' },
  { id: 'reading-the-explorer', label: 'Reading the Explorer', icon: Target, description: 'Master NearBlocks and other block explorers to investigate on-chain activity.', details: ['NearBlocks navigation', 'Transaction details', 'Account inspection', 'Token tracking', 'Contract verification', 'Receipt tracing'], xp: 50, tier: 'core', track: 'explorer', position: 3, unlocks: ['defi-basics'], prerequisites: ['near-ecosystem-tour'], estimatedTime: '45 min', rewards: ['Explorer Pro Badge'], link: '/learn/explorer/reading-the-explorer' },
  { id: 'defi-basics', label: 'DeFi Basics', icon: Coins, description: 'Understand DeFi primitives on NEAR — AMMs, lending, and more.', details: ['AMM mechanics', 'Lending protocols', 'Staking & liquid staking', 'Yield strategies', 'DEX aggregation', 'Risk management'], xp: 50, tier: 'core', track: 'explorer', position: 4, unlocks: ['nft-basics-on-near', 'staking-and-validators'], prerequisites: ['reading-the-explorer'], estimatedTime: '1.5 hours', rewards: ['DeFi Literate Badge'], link: '/learn/explorer/defi-basics' },
  { id: 'choose-your-path', label: 'Choose Your Path', icon: Compass, description: 'Decide which track to pursue — Builder, Hacker, or Founder.', details: ['Self-assessment quiz', 'Track comparison', 'Skill prerequisites', 'Career pathways', 'Community recommendations', 'Personalized roadmap'], xp: 50, tier: 'advanced', track: 'explorer', position: 0, unlocks: ['staying-safe-in-web3'], prerequisites: ['near-vs-other-chains'], estimatedTime: '30 min', rewards: ['Pathfinder Badge'], link: '/learn/explorer/choose-your-path' },
  { id: 'nft-basics-on-near', label: 'NFT Basics on NEAR', icon: Star, description: 'Explore NFT standards, marketplaces, and use cases on NEAR.', details: ['NEP-171 standard', 'Minting & collecting', 'Marketplace ecosystem', 'Royalties on NEAR', 'NFT utilities', 'Series & collections'], xp: 50, tier: 'advanced', track: 'explorer', position: 1, unlocks: ['near-data-tools'], prerequisites: ['defi-basics'], estimatedTime: '1 hour', rewards: ['NFT Explorer Badge'], link: '/learn/explorer/nft-basics-on-near' },
  { id: 'staking-and-validators', label: 'Staking & Validators', icon: Shield, description: 'Learn how staking and validation work on NEAR Protocol.', details: ['Proof of Stake on NEAR', 'Validator roles', 'Delegated staking', 'Liquid staking protocols', 'Rewards mechanics', 'Slashing conditions'], xp: 50, tier: 'advanced', track: 'explorer', position: 2, unlocks: ['daos-on-near'], prerequisites: ['defi-basics'], estimatedTime: '1 hour', rewards: ['Staking Expert Badge'], link: '/learn/explorer/staking-and-validators' },
  { id: 'daos-on-near', label: 'DAOs on NEAR', icon: Crown, description: 'How DAOs and on-chain governance work on NEAR.', details: ['DAO structures', 'Astro DAO', 'Proposal lifecycle', 'Voting mechanisms', 'Treasury management', 'Multi-sig patterns'], xp: 50, tier: 'advanced', track: 'explorer', position: 3, unlocks: ['staying-safe-in-web3'], prerequisites: ['staking-and-validators'], estimatedTime: '1 hour', rewards: ['Governance Badge'], link: '/learn/explorer/daos-on-near' },
  { id: 'staying-safe-in-web3', label: 'Staying Safe in Web3', icon: ShieldCheck, description: 'Security practices to protect yourself in the Web3 ecosystem.', details: ['Phishing detection', 'Wallet security', 'Smart contract risks', 'Social engineering', 'Rug pull red flags', 'Recovery strategies'], xp: 50, tier: 'mastery', track: 'explorer', position: 0, unlocks: ['near-data-tools'], prerequisites: ['choose-your-path', 'daos-on-near'], estimatedTime: '1 hour', rewards: ['Security Aware Badge'], link: '/learn/explorer/staying-safe-in-web3' },
  { id: 'near-data-tools', label: 'NEAR Data Tools', icon: Target, description: 'Master NEAR analytics, indexers, and on-chain data tools.', details: ['Pikespeak analytics', 'NEAR Lake indexer', 'On-chain queries', 'DeFiLlama NEAR', 'FastNEAR', 'Building dashboards'], xp: 50, tier: 'mastery', track: 'explorer', position: 1, unlocks: [], prerequisites: ['staying-safe-in-web3', 'nft-basics-on-near'], estimatedTime: '1.5 hours', rewards: ['Data Analyst Badge'], link: '/learn/explorer/near-data-tools' },

  // BUILDER TRACK (22 modules) — 100 XP each = 2200 XP
  { id: 'dev-environment-setup', label: 'Dev Environment Setup', icon: Terminal, description: 'Set up your NEAR development environment with all essential tools.', details: ['Install Rust & cargo', 'near-cli-rs setup', 'Node.js & npm', 'IDE configuration', 'Testnet account', 'Project scaffolding'], xp: 100, tier: 'foundation', track: 'builder', position: 0, unlocks: ['rust-fundamentals'], prerequisites: [], estimatedTime: '1 hour', rewards: ['Dev Setup Badge'], link: '/learn/builder/dev-environment-setup' },
  { id: 'rust-fundamentals', label: 'Rust Fundamentals', icon: Code2, description: 'Master the language that powers NEAR smart contracts.', details: ['Variables, types & mutability', 'Functions & control flow', 'Pattern matching', 'Modules & crates', 'Cargo basics', 'Rust playground'], xp: 100, tier: 'foundation', track: 'builder', position: 1, unlocks: ['your-first-contract'], prerequisites: ['dev-environment-setup'], estimatedTime: '6 hours', rewards: ['Rustacean Badge'], link: '/learn/builder/rust-fundamentals' },
  { id: 'your-first-contract', label: 'Your First Contract', icon: FileCode, description: 'Build and deploy your first NEAR smart contract.', details: ['#[near] macro', 'Contract structure', 'Init methods', 'View vs change methods', 'Storage basics', 'Deploy to testnet'], xp: 100, tier: 'core', track: 'builder', position: 0, unlocks: ['account-model-access-keys', 'near-cli-mastery'], prerequisites: ['rust-fundamentals'], estimatedTime: '4 hours', rewards: ['First Contract Badge'], link: '/learn/builder/your-first-contract' },
  { id: 'account-model-access-keys', label: 'Account Model & Access Keys', icon: Wallet, description: "Deep dive into NEAR's unique account model and access key system.", details: ['Named accounts', 'Sub-accounts', 'Full access keys', 'Function call keys', 'Key rotation', 'Multi-key patterns'], xp: 100, tier: 'core', track: 'builder', position: 1, unlocks: ['state-management'], prerequisites: ['your-first-contract'], estimatedTime: '2 hours', rewards: ['Account Model Badge'], link: '/learn/builder/account-model-access-keys' },
  { id: 'state-management', label: 'State Management', icon: Shield, description: 'Master on-chain state management and storage collections.', details: ['Borsh serialization', 'LookupMap & UnorderedMap', 'LazyOption & TreeMap', 'Storage staking', 'State versioning', 'Migration patterns'], xp: 100, tier: 'core', track: 'builder', position: 2, unlocks: ['testing-debugging'], prerequisites: ['account-model-access-keys'], estimatedTime: '4 hours', rewards: ['State Manager Badge'], link: '/learn/builder/state-management' },
  { id: 'near-cli-mastery', label: 'NEAR CLI Mastery', icon: Terminal, description: 'Master the NEAR CLI for deployment, debugging, and account management.', details: ['near-cli-rs commands', 'Deploy & call', 'Account management', 'Key management', 'Transaction inspection', 'Batch operations'], xp: 100, tier: 'core', track: 'builder', position: 3, unlocks: ['testing-debugging'], prerequisites: ['your-first-contract'], estimatedTime: '2 hours', rewards: ['CLI Ninja Badge'], link: '/learn/builder/near-cli-mastery' },
  { id: 'testing-debugging', label: 'Testing & Debugging', icon: FlaskConical, description: 'Write bulletproof tests and debug NEAR smart contracts.', details: ['Unit tests with #[cfg(test)]', 'near-workspaces integration tests', 'Sandbox testing', 'Multi-user simulation', 'Gas profiling', 'Debug logging'], xp: 100, tier: 'core', track: 'builder', position: 4, unlocks: ['frontend-integration', 'token-standards'], prerequisites: ['state-management', 'near-cli-mastery'], estimatedTime: '5 hours', rewards: ['QA Expert Badge'], link: '/learn/builder/testing-debugging' },
  { id: 'frontend-integration', label: 'Frontend Integration', icon: AppWindow, description: 'Connect a frontend to your NEAR smart contracts.', details: ['near-api-js setup', 'Wallet selector', 'View & change methods', 'Transaction signing', 'Real-time state updates', 'Error handling UX'], xp: 100, tier: 'core', track: 'builder', position: 5, unlocks: ['building-a-dapp'], prerequisites: ['testing-debugging'], estimatedTime: '5 hours', rewards: ['Frontend Badge'], link: '/learn/builder/frontend-integration' },
  { id: 'token-standards', label: 'Token Standards', icon: Coins, description: 'Build NEP-141 fungible tokens on NEAR.', details: ['NEP-141 standard', 'Token metadata (NEP-148)', 'Minting & burning', 'Storage management', 'Transfer & approval', 'DEX integration'], xp: 100, tier: 'core', track: 'builder', position: 6, unlocks: ['nep-standards-deep-dive', 'building-an-nft-contract'], prerequisites: ['testing-debugging'], estimatedTime: '4 hours', rewards: ['Token Minter Badge'], link: '/learn/builder/token-standards' },
  { id: 'nep-standards-deep-dive', label: 'NEP Standards Deep Dive', icon: FileCode, description: 'Master the full range of NEAR Enhancement Proposals.', details: ['NEP-141 fungible tokens', 'NEP-171 NFTs', 'NEP-145 storage management', 'NEP-148 metadata', 'NEP-199 royalties', 'Proposing new NEPs'], xp: 100, tier: 'advanced', track: 'builder', position: 0, unlocks: ['building-a-dapp', 'building-a-dao-contract'], prerequisites: ['token-standards'], estimatedTime: '4 hours', rewards: ['Standards Expert Badge'], link: '/learn/builder/nep-standards-deep-dive' },
  { id: 'building-a-dapp', label: 'Building a dApp', icon: AppWindow, description: 'Build a complete decentralized application end-to-end.', details: ['Architecture design', 'Smart contract backend', 'React frontend', 'Wallet integration', 'State management', 'Full deployment'], xp: 100, tier: 'advanced', track: 'builder', position: 1, unlocks: ['security-best-practices', 'defi-contract-patterns'], prerequisites: ['frontend-integration', 'nep-standards-deep-dive'], estimatedTime: '8 hours', rewards: ['Full-Stack Builder Badge'], link: '/learn/builder/building-a-dapp' },
  { id: 'security-best-practices', label: 'Security Best Practices', icon: ShieldCheck, description: 'Secure your smart contracts against common attack vectors.', details: ['Reentrancy protection', 'Access control patterns', 'Input validation', 'Storage attacks', 'Gas manipulation', 'Audit checklist'], xp: 100, tier: 'advanced', track: 'builder', position: 2, unlocks: ['upgrading-contracts'], prerequisites: ['building-a-dapp'], estimatedTime: '4 hours', rewards: ['Security Badge'], link: '/learn/builder/security-best-practices' },
  { id: 'upgrading-contracts', label: 'Upgrading Contracts', icon: Rocket, description: 'Deploy contracts that can be safely upgraded over time.', details: ['Upgrade patterns', 'State migration', 'Versioning strategy', 'Proxy patterns', 'DAO-controlled upgrades', 'Rollback plans'], xp: 100, tier: 'advanced', track: 'builder', position: 3, unlocks: ['deployment'], prerequisites: ['security-best-practices'], estimatedTime: '4 hours', rewards: ['Upgrade Master Badge'], link: '/learn/builder/upgrading-contracts' },
  { id: 'deployment', label: 'Deployment', icon: Rocket, description: 'Deploy your contracts to testnet and mainnet with confidence.', details: ['Testnet deployment', 'Mainnet preparation', 'Contract verification', 'Environment configs', 'CI/CD pipelines', 'Monitoring setup'], xp: 100, tier: 'advanced', track: 'builder', position: 4, unlocks: ['optimization'], prerequisites: ['upgrading-contracts'], estimatedTime: '3 hours', rewards: ['Deployer Badge'], link: '/learn/builder/deployment' },
  { id: 'optimization', label: 'Optimization', icon: Zap, description: 'Optimize your contracts for gas, storage, and performance.', details: ['Gas profiling', 'Storage optimization', 'Serialization tuning', 'Batch operations', 'Lazy evaluation', 'WASM size reduction'], xp: 100, tier: 'advanced', track: 'builder', position: 5, unlocks: ['launch-checklist'], prerequisites: ['deployment'], estimatedTime: '3 hours', rewards: ['Optimizer Badge'], link: '/learn/builder/optimization' },
  { id: 'launch-checklist', label: 'Launch Checklist', icon: CheckCircle, description: 'Everything you need before going live on mainnet.', details: ['Security audit', 'Gas budget review', 'Monitoring & alerts', 'Documentation', 'Community preparation', 'Launch day plan'], xp: 100, tier: 'advanced', track: 'builder', position: 6, unlocks: ['aurora-evm-compatibility', 'wallet-selector-integration', 'near-social-bos'], prerequisites: ['optimization'], estimatedTime: '2 hours', rewards: ['Launch Ready Badge'], link: '/learn/builder/launch-checklist' },
  { id: 'building-an-nft-contract', label: 'Building an NFT Contract', icon: Star, description: 'Build NEP-171 NFT contracts with metadata and royalties.', details: ['NEP-171 implementation', 'Token metadata', 'Minting & royalties', 'Marketplace integration', 'Enumeration methods', 'Series & collections'], xp: 100, tier: 'advanced', track: 'builder', position: 7, unlocks: ['aurora-evm-compatibility'], prerequisites: ['token-standards'], estimatedTime: '5 hours', rewards: ['NFT Builder Badge'], link: '/learn/builder/building-an-nft-contract' },
  { id: 'building-a-dao-contract', label: 'Building a DAO Contract', icon: Crown, description: 'Build governance contracts with proposals, voting, and treasury.', details: ['Proposal lifecycle', 'Voting mechanisms', 'Role-based permissions', 'Treasury management', 'Multi-sig patterns', 'DAO factory'], xp: 100, tier: 'advanced', track: 'builder', position: 8, unlocks: ['wallet-selector-integration'], prerequisites: ['nep-standards-deep-dive'], estimatedTime: '6 hours', rewards: ['DAO Builder Badge'], link: '/learn/builder/building-a-dao-contract' },
  { id: 'defi-contract-patterns', label: 'DeFi Contract Patterns', icon: Coins, description: 'AMM mechanics, liquidity pools, and swap contract architecture.', details: ['Constant product formula', 'Liquidity pool design', 'Swap mechanics', 'Fee structures', 'Flash loan patterns', 'Oracle integration'], xp: 100, tier: 'advanced', track: 'builder', position: 9, unlocks: ['near-social-bos'], prerequisites: ['building-a-dapp'], estimatedTime: '6 hours', rewards: ['DeFi Builder Badge'], link: '/learn/builder/defi-contract-patterns' },
  { id: 'aurora-evm-compatibility', label: 'Aurora EVM Compatibility', icon: Globe, description: 'Deploy Solidity contracts on NEAR via the Aurora EVM runtime.', details: ['Aurora architecture', 'EVM on NEAR', 'Rainbow Bridge', 'Solidity deployment', 'Cross-runtime calls', 'Dev tooling'], xp: 100, tier: 'mastery', track: 'builder', position: 0, unlocks: [], prerequisites: ['launch-checklist', 'building-an-nft-contract'], estimatedTime: '5 hours', rewards: ['EVM Bridge Badge'], link: '/learn/builder/aurora-evm-compatibility' },
  { id: 'wallet-selector-integration', label: 'Wallet Connector Integration', icon: Wallet, description: 'Multi-wallet support with @hot-labs/near-connect for seamless UX.', details: ['NEAR Connector setup', 'Multiple wallet support', 'Sign-in flows', 'Transaction signing UX', 'Mobile support', 'Social login'], xp: 100, tier: 'mastery', track: 'builder', position: 1, unlocks: [], prerequisites: ['launch-checklist', 'building-a-dao-contract'], estimatedTime: '4 hours', rewards: ['Wallet Expert Badge'], link: '/learn/builder/wallet-selector-integration' },
  { id: 'near-social-bos', label: 'NEAR Social & BOS', icon: Globe, description: 'Build composable on-chain widgets with NEAR Social and BOS.', details: ['Social DB', 'Widget development', 'Composability patterns', 'On-chain frontends', 'Social graph', 'BOS gateway'], xp: 100, tier: 'mastery', track: 'builder', position: 2, unlocks: [], prerequisites: ['launch-checklist', 'defi-contract-patterns'], estimatedTime: '5 hours', rewards: ['Social Builder Badge'], link: '/learn/builder/near-social-bos' },

  // HACKER TRACK (16 modules) — 150 XP each = 2400 XP
  { id: 'near-architecture-deep-dive', label: 'NEAR Architecture Deep Dive', icon: Brain, description: "Deep dive into NEAR's sharding, consensus, and runtime architecture.", details: ['Nightshade sharding', 'Chunk production', 'Runtime internals', 'State storage trie', 'Receipt system', 'Validator selection'], xp: 150, tier: 'foundation', track: 'hacker', position: 0, unlocks: ['cross-contract-calls'], prerequisites: [], estimatedTime: '6 hours', rewards: ['Architecture Badge'], link: '/learn/hacker/near-architecture-deep-dive' },
  { id: 'cross-contract-calls', label: 'Cross-Contract Calls', icon: Globe, description: 'Master complex cross-contract interactions and promise chains.', details: ['Promise chains', 'Callback patterns', 'Error propagation', 'Gas allocation', 'Batch actions', 'Atomic operations'], xp: 150, tier: 'foundation', track: 'hacker', position: 1, unlocks: ['advanced-storage'], prerequisites: ['near-architecture-deep-dive'], estimatedTime: '5 hours', rewards: ['Cross-Contract Badge'], link: '/learn/hacker/cross-contract-calls' },
  { id: 'advanced-storage', label: 'Advanced Storage', icon: Shield, description: 'Advanced storage patterns, optimization, and state management.', details: ['Trie storage internals', 'Storage staking costs', 'Pagination patterns', 'State migration', 'Cost optimization', 'Custom collections'], xp: 150, tier: 'foundation', track: 'hacker', position: 2, unlocks: ['chain-signatures'], prerequisites: ['cross-contract-calls'], estimatedTime: '4 hours', rewards: ['Storage Expert Badge'], link: '/learn/hacker/advanced-storage' },
  { id: 'chain-signatures', label: 'Chain Signatures', icon: Shield, description: "Use NEAR's Chain Signatures for cross-chain operations.", details: ['MPC key derivation', 'Signing for other chains', 'Cross-chain verification', 'Multi-chain wallets', 'Bridge patterns', 'Security considerations'], xp: 150, tier: 'foundation', track: 'hacker', position: 3, unlocks: ['intents-chain-abstraction', 'multi-chain-with-near'], prerequisites: ['advanced-storage'], estimatedTime: '6 hours', rewards: ['Chain Sig Badge'], link: '/learn/hacker/chain-signatures' },
  { id: 'intents-chain-abstraction', label: 'Intents & Chain Abstraction', icon: Brain, description: "Build with NEAR's intent-based transaction and chain abstraction system.", details: ['Intent lifecycle', 'Solver architecture', 'Intent composition', 'Cross-chain intents', 'Account aggregation', 'Solver incentives'], xp: 150, tier: 'core', track: 'hacker', position: 0, unlocks: ['shade-agents'], prerequisites: ['chain-signatures'], estimatedTime: '5 hours', rewards: ['Intents Badge'], link: '/learn/hacker/intents-chain-abstraction' },
  { id: 'shade-agents', label: 'Shade Agents', icon: Brain, description: 'Build autonomous AI agents that execute on-chain actions on NEAR.', details: ['Agent architecture', 'Autonomous transactions', 'On-chain tool calling', 'Safety guardrails', 'Agent-to-agent comms', 'Deployment patterns'], xp: 150, tier: 'core', track: 'hacker', position: 1, unlocks: ['ai-agent-integration'], prerequisites: ['intents-chain-abstraction'], estimatedTime: '6 hours', rewards: ['Shade Agent Badge'], link: '/learn/hacker/shade-agents' },
  { id: 'ai-agent-integration', label: 'AI Agent Integration', icon: Brain, description: 'Integrate AI models and agents with NEAR Protocol.', details: ['On-chain AI models', 'NEAR AI platform', 'Agent wallets', 'Autonomous execution', 'Safety guardrails', 'Multi-agent systems'], xp: 150, tier: 'core', track: 'hacker', position: 2, unlocks: ['mev-transaction-ordering'], prerequisites: ['shade-agents'], estimatedTime: '6 hours', rewards: ['AI Agent Badge'], link: '/learn/hacker/ai-agent-integration' },
  { id: 'mev-transaction-ordering', label: 'MEV & Transaction Ordering', icon: Zap, description: 'Understand MEV, transaction ordering, and protection strategies on NEAR.', details: ['MEV on NEAR', 'Transaction ordering', 'Front-running protection', 'Backrunning strategies', 'MEV mitigation', 'Fair ordering'], xp: 150, tier: 'core', track: 'hacker', position: 3, unlocks: ['building-an-indexer'], prerequisites: ['ai-agent-integration'], estimatedTime: '4 hours', rewards: ['MEV Expert Badge'], link: '/learn/hacker/mev-transaction-ordering' },
  { id: 'building-an-indexer', label: 'Building an Indexer', icon: Target, description: 'Build custom indexers for NEAR on-chain data.', details: ['NEAR Lake framework', 'Block & receipt processing', 'Custom data models', 'Database integration', 'Real-time streaming', 'Query optimization'], xp: 150, tier: 'advanced', track: 'hacker', position: 0, unlocks: ['production-patterns'], prerequisites: ['mev-transaction-ordering'], estimatedTime: '8 hours', rewards: ['Indexer Badge'], link: '/learn/hacker/building-an-indexer' },
  { id: 'multi-chain-with-near', label: 'Multi-Chain with NEAR', icon: Globe, description: 'Build multi-chain applications using NEAR as the coordination layer.', details: ['Chain abstraction in practice', 'Multi-chain wallet UX', 'Cross-chain messaging', 'Bridge integration', 'Settlement patterns', 'Multi-chain dApp design'], xp: 150, tier: 'advanced', track: 'hacker', position: 1, unlocks: ['production-patterns'], prerequisites: ['chain-signatures'], estimatedTime: '6 hours', rewards: ['Multi-Chain Badge'], link: '/learn/hacker/multi-chain-with-near' },
  { id: 'production-patterns', label: 'Production Patterns', icon: Rocket, description: 'Battle-tested patterns for production-grade NEAR applications.', details: ['Error recovery', 'Monitoring & alerting', 'Rate limiting', 'Graceful degradation', 'Load testing', 'Incident response'], xp: 150, tier: 'advanced', track: 'hacker', position: 2, unlocks: ['zero-knowledge-on-near', 'oracle-integration'], prerequisites: ['building-an-indexer', 'multi-chain-with-near'], estimatedTime: '5 hours', rewards: ['Production Pro Badge'], link: '/learn/hacker/production-patterns' },
  { id: 'zero-knowledge-on-near', label: 'Zero Knowledge on NEAR', icon: ShieldCheck, description: 'Explore zero-knowledge proofs and privacy solutions on NEAR.', details: ['ZK proof basics', 'ZK on NEAR', 'Privacy-preserving txns', 'Verifier contracts', 'ZK rollup patterns', 'Privacy protocols'], xp: 150, tier: 'advanced', track: 'hacker', position: 3, unlocks: ['gas-optimization-deep-dive'], prerequisites: ['production-patterns'], estimatedTime: '6 hours', rewards: ['ZK Explorer Badge'], link: '/learn/hacker/zero-knowledge-on-near' },
  { id: 'oracle-integration', label: 'Oracle Integration', icon: Target, description: 'Integrate price feeds and off-chain data using oracles.', details: ['Oracle architectures', 'Price feed integration', 'Data verification', 'Decentralized oracles', 'Custom data feeds', 'Reliability patterns'], xp: 150, tier: 'advanced', track: 'hacker', position: 4, unlocks: ['gas-optimization-deep-dive'], prerequisites: ['production-patterns'], estimatedTime: '4 hours', rewards: ['Oracle Master Badge'], link: '/learn/hacker/oracle-integration' },
  { id: 'gas-optimization-deep-dive', label: 'Gas Optimization Deep Dive', icon: Zap, description: 'Advanced gas optimization techniques for NEAR contracts.', details: ['Gas profiling tools', 'Serialization optimization', 'Storage minimization', 'Batch operations', 'WASM optimization', 'Benchmarking framework'], xp: 150, tier: 'mastery', track: 'hacker', position: 0, unlocks: ['bridge-architecture'], prerequisites: ['zero-knowledge-on-near', 'oracle-integration'], estimatedTime: '5 hours', rewards: ['Gas Optimizer Badge'], link: '/learn/hacker/gas-optimization-deep-dive' },
  { id: 'bridge-architecture', label: 'Bridge Architecture', icon: Globe, description: 'Design and build cross-chain bridge architectures.', details: ['Bridge design patterns', 'Rainbow Bridge internals', 'Light client verification', 'Asset locking/minting', 'Security considerations', 'Bridge monitoring'], xp: 150, tier: 'mastery', track: 'hacker', position: 1, unlocks: ['formal-verification'], prerequisites: ['gas-optimization-deep-dive'], estimatedTime: '6 hours', rewards: ['Bridge Architect Badge'], link: '/learn/hacker/bridge-architecture' },
  { id: 'formal-verification', label: 'Formal Verification', icon: Award, description: 'Apply formal verification techniques to NEAR smart contracts.', details: ['Formal methods intro', 'Property specification', 'Model checking', 'Theorem proving', 'Verification tools', 'Audit integration'], xp: 150, tier: 'mastery', track: 'hacker', position: 2, unlocks: [], prerequisites: ['bridge-architecture'], estimatedTime: '8 hours', rewards: ['Formal Verifier Badge'], link: '/learn/hacker/formal-verification' },

  // FOUNDER TRACK (12 modules) — 75 XP each = 900 XP
  { id: 'near-grants-funding', label: 'NEAR Grants & Funding', icon: CircleDollarSign, description: 'Navigate NEAR ecosystem grants, funding programs, and opportunities.', details: ['NEAR Foundation grants', 'DevDAO funding', 'Ecosystem funds', 'Application process', 'Budget planning', 'Milestone design'], xp: 75, tier: 'foundation', track: 'founder', position: 0, unlocks: ['tokenomics-design'], prerequisites: [], estimatedTime: '3 hours', rewards: ['Grant Ready Badge'], link: '/learn/founder/near-grants-funding' },
  { id: 'tokenomics-design', label: 'Tokenomics Design', icon: Coins, description: 'Design sustainable token economics for your project.', details: ['Supply mechanics', 'Distribution strategy', 'Utility design', 'Incentive alignment', 'Vesting schedules', 'Governance rights'], xp: 75, tier: 'foundation', track: 'founder', position: 1, unlocks: ['building-in-public'], prerequisites: ['near-grants-funding'], estimatedTime: '5 hours', rewards: ['Tokenomics Badge'], link: '/learn/founder/tokenomics-design' },
  { id: 'building-in-public', label: 'Building in Public', icon: Globe, description: 'Leverage transparency and community engagement while building.', details: ['Public roadmaps', 'Dev logs & updates', 'Community feedback loops', 'Social media strategy', 'Open-source benefits', 'Accountability frameworks'], xp: 75, tier: 'foundation', track: 'founder', position: 2, unlocks: ['pitching-your-project'], prerequisites: ['tokenomics-design'], estimatedTime: '2 hours', rewards: ['Transparent Builder Badge'], link: '/learn/founder/building-in-public' },
  { id: 'pitching-your-project', label: 'Pitching Your Project', icon: Rocket, description: 'Create a compelling pitch for your NEAR project.', details: ['Problem statement', 'Solution architecture', 'Market sizing', 'Business model', 'Team & traction', 'Demo preparation'], xp: 75, tier: 'core', track: 'founder', position: 0, unlocks: ['revenue-models-for-dapps'], prerequisites: ['building-in-public'], estimatedTime: '4 hours', rewards: ['Pitch Pro Badge'], link: '/learn/founder/pitching-your-project' },
  { id: 'revenue-models-for-dapps', label: 'Revenue Models for dApps', icon: CircleDollarSign, description: 'Explore sustainable revenue models for decentralized applications.', details: ['Transaction fees', 'Freemium models', 'Token-gated access', 'Protocol fees', 'SaaS in Web3', 'Hybrid models'], xp: 75, tier: 'core', track: 'founder', position: 1, unlocks: ['community-building'], prerequisites: ['pitching-your-project'], estimatedTime: '3 hours', rewards: ['Revenue Architect Badge'], link: '/learn/founder/revenue-models-for-dapps' },
  { id: 'community-building', label: 'Community Building', icon: Globe, description: 'Build and nurture a thriving community around your project.', details: ['Community platforms', 'Engagement strategies', 'Ambassador programs', 'Governance participation', 'Event planning', 'Growth metrics'], xp: 75, tier: 'core', track: 'founder', position: 2, unlocks: ['go-to-market'], prerequisites: ['revenue-models-for-dapps'], estimatedTime: '3 hours', rewards: ['Community Builder Badge'], link: '/learn/founder/community-building' },
  { id: 'go-to-market', label: 'Go-to-Market', icon: Rocket, description: 'Plan and execute your go-to-market strategy for Web3.', details: ['GTM strategy framework', 'User acquisition', 'Partnership development', 'Launch planning', 'Distribution channels', 'Growth hacking'], xp: 75, tier: 'advanced', track: 'founder', position: 0, unlocks: ['legal-regulatory-basics', 'treasury-management'], prerequisites: ['community-building'], estimatedTime: '4 hours', rewards: ['GTM Badge'], link: '/learn/founder/go-to-market' },
  { id: 'legal-regulatory-basics', label: 'Legal & Regulatory Basics', icon: Shield, description: 'Navigate the legal and regulatory landscape for Web3 projects.', details: ['Token classification', 'Securities law basics', 'KYC/AML requirements', 'DAO legal wrappers', 'Jurisdiction selection', 'Compliance frameworks'], xp: 75, tier: 'advanced', track: 'founder', position: 1, unlocks: ['metrics-that-matter'], prerequisites: ['go-to-market'], estimatedTime: '3 hours', rewards: ['Legal Aware Badge'], link: '/learn/founder/legal-regulatory-basics' },
  { id: 'treasury-management', label: 'Treasury Management', icon: Coins, description: 'Manage your project treasury and financial operations effectively.', details: ['Multi-sig setup', 'Treasury diversification', 'Runway planning', 'DeFi yield strategies', 'Reporting & transparency', 'Risk management'], xp: 75, tier: 'advanced', track: 'founder', position: 2, unlocks: ['metrics-that-matter'], prerequisites: ['go-to-market'], estimatedTime: '3 hours', rewards: ['Treasury Manager Badge'], link: '/learn/founder/treasury-management' },
  { id: 'metrics-that-matter', label: 'Metrics That Matter', icon: Target, description: 'Track the right metrics to measure and grow your project.', details: ['On-chain analytics', 'User retention metrics', 'TVL & volume tracking', 'Community health', 'Developer activity', 'Growth dashboards'], xp: 75, tier: 'mastery', track: 'founder', position: 0, unlocks: ['marketing-for-web3'], prerequisites: ['legal-regulatory-basics', 'treasury-management'], estimatedTime: '3 hours', rewards: ['Data-Driven Badge'], link: '/learn/founder/metrics-that-matter' },
  { id: 'marketing-for-web3', label: 'Marketing for Web3', icon: Flame, description: 'Master Web3-native marketing strategies and channels.', details: ['Crypto Twitter strategy', 'Discord marketing', 'Influencer partnerships', 'Airdrop campaigns', 'Content marketing', 'Brand building'], xp: 75, tier: 'mastery', track: 'founder', position: 1, unlocks: ['investor-relations'], prerequisites: ['metrics-that-matter'], estimatedTime: '3 hours', rewards: ['Web3 Marketer Badge'], link: '/learn/founder/marketing-for-web3' },
  { id: 'investor-relations', label: 'Investor Relations', icon: Trophy, description: 'Build and maintain relationships with investors and stakeholders.', details: ['Investor outreach', 'Due diligence preparation', 'Term sheets & SAFTs', 'Quarterly reporting', 'Board management', 'Follow-on funding'], xp: 75, tier: 'mastery', track: 'founder', position: 2, unlocks: [], prerequisites: ['marketing-for-web3'], estimatedTime: '4 hours', rewards: ['Investor Ready Badge'], link: '/learn/founder/investor-relations' },
];

/* ─── Connections ──────────────────────────────────────────── */

export const connections: Connection[] = [
  // Explorer
  { from: 'what-is-blockchain', to: 'what-is-near' },
  { from: 'what-is-near', to: 'create-a-wallet' },
  { from: 'create-a-wallet', to: 'your-first-transaction' },
  { from: 'your-first-transaction', to: 'understanding-dapps' },
  { from: 'understanding-dapps', to: 'reading-smart-contracts' },
  { from: 'reading-smart-contracts', to: 'near-ecosystem-tour' },
  { from: 'near-ecosystem-tour', to: 'near-vs-other-chains' },
  { from: 'near-ecosystem-tour', to: 'reading-the-explorer' },
  { from: 'near-vs-other-chains', to: 'choose-your-path' },
  { from: 'reading-the-explorer', to: 'defi-basics' },
  { from: 'defi-basics', to: 'nft-basics-on-near' },
  { from: 'defi-basics', to: 'staking-and-validators' },
  { from: 'staking-and-validators', to: 'daos-on-near' },
  { from: 'choose-your-path', to: 'staying-safe-in-web3' },
  { from: 'daos-on-near', to: 'staying-safe-in-web3' },
  { from: 'nft-basics-on-near', to: 'near-data-tools' },
  { from: 'staying-safe-in-web3', to: 'near-data-tools' },
  // Builder
  { from: 'dev-environment-setup', to: 'rust-fundamentals' },
  { from: 'rust-fundamentals', to: 'your-first-contract' },
  { from: 'your-first-contract', to: 'account-model-access-keys' },
  { from: 'your-first-contract', to: 'near-cli-mastery' },
  { from: 'account-model-access-keys', to: 'state-management' },
  { from: 'state-management', to: 'testing-debugging' },
  { from: 'near-cli-mastery', to: 'testing-debugging' },
  { from: 'testing-debugging', to: 'frontend-integration' },
  { from: 'testing-debugging', to: 'token-standards' },
  { from: 'frontend-integration', to: 'building-a-dapp' },
  { from: 'token-standards', to: 'nep-standards-deep-dive' },
  { from: 'token-standards', to: 'building-an-nft-contract' },
  { from: 'nep-standards-deep-dive', to: 'building-a-dapp' },
  { from: 'nep-standards-deep-dive', to: 'building-a-dao-contract' },
  { from: 'building-a-dapp', to: 'security-best-practices' },
  { from: 'building-a-dapp', to: 'defi-contract-patterns' },
  { from: 'security-best-practices', to: 'upgrading-contracts' },
  { from: 'upgrading-contracts', to: 'deployment' },
  { from: 'deployment', to: 'optimization' },
  { from: 'optimization', to: 'launch-checklist' },
  { from: 'launch-checklist', to: 'aurora-evm-compatibility' },
  { from: 'launch-checklist', to: 'wallet-selector-integration' },
  { from: 'launch-checklist', to: 'near-social-bos' },
  { from: 'building-an-nft-contract', to: 'aurora-evm-compatibility' },
  { from: 'building-a-dao-contract', to: 'wallet-selector-integration' },
  { from: 'defi-contract-patterns', to: 'near-social-bos' },
  // Hacker
  { from: 'near-architecture-deep-dive', to: 'cross-contract-calls' },
  { from: 'cross-contract-calls', to: 'advanced-storage' },
  { from: 'advanced-storage', to: 'chain-signatures' },
  { from: 'chain-signatures', to: 'intents-chain-abstraction' },
  { from: 'chain-signatures', to: 'multi-chain-with-near' },
  { from: 'intents-chain-abstraction', to: 'shade-agents' },
  { from: 'shade-agents', to: 'ai-agent-integration' },
  { from: 'ai-agent-integration', to: 'mev-transaction-ordering' },
  { from: 'mev-transaction-ordering', to: 'building-an-indexer' },
  { from: 'building-an-indexer', to: 'production-patterns' },
  { from: 'multi-chain-with-near', to: 'production-patterns' },
  { from: 'production-patterns', to: 'zero-knowledge-on-near' },
  { from: 'production-patterns', to: 'oracle-integration' },
  { from: 'zero-knowledge-on-near', to: 'gas-optimization-deep-dive' },
  { from: 'oracle-integration', to: 'gas-optimization-deep-dive' },
  { from: 'gas-optimization-deep-dive', to: 'bridge-architecture' },
  { from: 'bridge-architecture', to: 'formal-verification' },
  // Founder
  { from: 'near-grants-funding', to: 'tokenomics-design' },
  { from: 'tokenomics-design', to: 'building-in-public' },
  { from: 'building-in-public', to: 'pitching-your-project' },
  { from: 'pitching-your-project', to: 'revenue-models-for-dapps' },
  { from: 'revenue-models-for-dapps', to: 'community-building' },
  { from: 'community-building', to: 'go-to-market' },
  { from: 'go-to-market', to: 'legal-regulatory-basics' },
  { from: 'go-to-market', to: 'treasury-management' },
  { from: 'legal-regulatory-basics', to: 'metrics-that-matter' },
  { from: 'treasury-management', to: 'metrics-that-matter' },
  { from: 'metrics-that-matter', to: 'marketing-for-web3' },
  { from: 'marketing-for-web3', to: 'investor-relations' },
];

/* ─── Helpers ──────────────────────────────────────────────── */

export function loadProgress(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return new Set(JSON.parse(data));
  } catch { /* ignore */ }
  return new Set();
}

export function saveProgress(completed: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
  } catch { /* ignore */ }
}

export function getNodeStatus(nodeId: string, completed: Set<string>): NodeStatus {
  if (completed.has(nodeId)) return 'completed';
  const node = skillNodes.find(n => n.id === nodeId);
  if (!node) return 'locked';
  if (node.prerequisites.length === 0) return 'available';
  return node.prerequisites.every(p => completed.has(p)) ? 'available' : 'locked';
}

export function getLevel(xp: number): Level {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) level = l;
  }
  return level;
}

/* ─── Node Positioning — Graph-aware layout ────────────────── */

const TIER_ORDER: Record<string, number> = { foundation: 0, core: 1, advanced: 2, mastery: 3 };

export function computeNodePositions(): Map<string, { x: number; y: number }> {
  const pos = new Map<string, { x: number; y: number }>();

  const trackIds: TrackId[] = ['explorer', 'builder', 'hacker', 'founder'];

  for (const trackId of trackIds) {
    const { cx, cy } = TRACK_QUADRANTS[trackId];
    const nodes = skillNodes.filter(n => n.track === trackId);

    // Group by tier
    const tiers: Record<string, SkillNode[]> = {};
    for (const n of nodes) {
      if (!tiers[n.tier]) tiers[n.tier] = [];
      tiers[n.tier].push(n);
    }

    const tierKeys = Object.keys(tiers).sort((a, b) => TIER_ORDER[a] - TIER_ORDER[b]);
    const tierCount = tierKeys.length;

    // Spread tiers left-to-right within quadrant
    const spreadX = nodes.length > 12 ? 320 : 260;
    const spreadY = nodes.length > 12 ? 280 : 220;

    tierKeys.forEach((tier, ti) => {
      const tierNodes = tiers[tier];
      const xOffset = ((ti / (tierCount - 1 || 1)) - 0.5) * spreadX;

      tierNodes.forEach((node, ni) => {
        const count = tierNodes.length;
        const yOffset = count === 1 ? 0 : ((ni / (count - 1)) - 0.5) * spreadY;

        // Add small jitter based on node id hash for organic feel
        const hash = node.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const jx = ((hash % 30) - 15);
        const jy = (((hash * 7) % 30) - 15);

        const x = cx + xOffset + jx;
        const y = cy + yOffset + jy;

        pos.set(node.id, {
          x: Math.max(40, Math.min(MAP_WIDTH - 40, x)),
          y: Math.max(40, Math.min(MAP_HEIGHT - 40, y)),
        });
      });
    });
  }

  // Spring relaxation: push apart overlapping nodes (3 passes)
  const MIN_DIST = 70;
  const allIds = Array.from(pos.keys());
  for (let pass = 0; pass < 5; pass++) {
    for (let i = 0; i < allIds.length; i++) {
      for (let j = i + 1; j < allIds.length; j++) {
        const a = pos.get(allIds[i])!;
        const b = pos.get(allIds[j])!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MIN_DIST && dist > 0) {
          const push = (MIN_DIST - dist) / 2;
          const nx = (dx / dist) * push;
          const ny = (dy / dist) * push;
          a.x -= nx; a.y -= ny;
          b.x += nx; b.y += ny;
        }
      }
    }
  }

  // Pull connected nodes closer (2 passes)
  const IDEAL_CONN_DIST = 100;
  for (let pass = 0; pass < 3; pass++) {
    for (const conn of connections) {
      const a = pos.get(conn.from);
      const b = pos.get(conn.to);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > IDEAL_CONN_DIST * 1.5) {
        const pull = (dist - IDEAL_CONN_DIST) * 0.05;
        const nx = (dx / dist) * pull;
        const ny = (dy / dist) * pull;
        a.x += nx; a.y += ny;
        b.x -= nx; b.y -= ny;
      }
    }
  }

  // Clamp
  for (const [id, p] of pos) {
    p.x = Math.max(40, Math.min(MAP_WIDTH - 40, p.x));
    p.y = Math.max(40, Math.min(MAP_HEIGHT - 40, p.y));
  }

  return pos;
}

/* ─── Prereq/unlock helpers for side panel ─────────────────── */

/* ─── Streak helpers ───────────────────────────────────────── */

export const STREAK_KEY = 'voidspace-skill-streak';

interface StreakData {
  lastCompletionDate: string; // YYYY-MM-DD
  count: number;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadStreak(): StreakData {
  if (typeof window === 'undefined') return { lastCompletionDate: '', count: 0 };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { lastCompletionDate: '', count: 0 };
}

export function saveStreak(data: StreakData) {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

export function recordCompletion(): StreakData {
  const streak = loadStreak();
  const today = todayStr();
  if (streak.lastCompletionDate === today) return streak; // already recorded today
  const yesterday = yesterdayStr();
  const newStreak: StreakData = {
    lastCompletionDate: today,
    count: streak.lastCompletionDate === yesterday ? streak.count + 1 : 1,
  };
  saveStreak(newStreak);
  return newStreak;
}

export function getCurrentStreak(): number {
  const streak = loadStreak();
  const today = todayStr();
  const yesterday = yesterdayStr();
  if (streak.lastCompletionDate === today || streak.lastCompletionDate === yesterday) return streak.count;
  return 0;
}

/* ─── Prereq/unlock helpers for side panel ─────────────────── */

export function getPrerequisiteChain(nodeId: string): SkillNode[] {
  const node = skillNodes.find(n => n.id === nodeId);
  if (!node) return [];
  return node.prerequisites.map(id => skillNodes.find(n => n.id === id)!).filter(Boolean);
}

export function getUnlocksNext(nodeId: string): SkillNode[] {
  const node = skillNodes.find(n => n.id === nodeId);
  if (!node) return [];
  return node.unlocks.map(id => skillNodes.find(n => n.id === id)!).filter(Boolean);
}
