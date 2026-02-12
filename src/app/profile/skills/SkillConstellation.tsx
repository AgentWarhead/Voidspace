'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Wallet,
  Code2,
  FileCode,
  FlaskConical,
  Rocket,
  Lock,
  CheckCircle,
  ChevronRight,
  X,
  Crown,
  Zap,
  Shield,
  Star,
  Brain,
  Globe,
  Target,
  Coins,
  AppWindow,
  ShieldCheck,
  CircleDollarSign,
  Trophy,
  ArrowRight,
  RotateCcw,
  Compass,
  Terminal,
  Flame,
  Award,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ─── Types ────────────────────────────────────────────────── */

interface SkillNode {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  details: string[];
  xp: number;
  tier: 'foundation' | 'core' | 'advanced' | 'mastery';
  track: 'explorer' | 'builder' | 'hacker' | 'founder';
  position: number;
  unlocks: string[];
  prerequisites: string[];
  estimatedTime: string;
  rewards: string[];
  link?: string;
}

interface Connection {
  from: string;
  to: string;
}

type NodeStatus = 'completed' | 'available' | 'locked';

/* ─── Track (Galaxy) Config ───────────────────────────────── */

const TRACK_CONFIG = {
  explorer: {
    label: 'Explorer',
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/30',
    glow: 'rgba(0, 212, 255, 0.3)',
    icon: Compass,
    xpPerModule: 50,
    description: 'Discover the NEAR ecosystem',
  },
  builder: {
    label: 'Builder',
    color: 'text-near-green',
    bg: 'bg-near-green/10',
    border: 'border-near-green/30',
    glow: 'rgba(0, 236, 151, 0.3)',
    icon: Code2,
    xpPerModule: 100,
    description: 'Build smart contracts & dApps',
  },
  hacker: {
    label: 'Hacker',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30',
    glow: 'rgba(192, 132, 252, 0.3)',
    icon: Terminal,
    xpPerModule: 150,
    description: 'Master advanced development',
  },
  founder: {
    label: 'Founder',
    color: 'text-accent-orange',
    bg: 'bg-accent-orange/10',
    border: 'border-accent-orange/30',
    glow: 'rgba(251, 146, 60, 0.3)',
    icon: Flame,
    xpPerModule: 100,
    description: 'Launch your NEAR project',
  },
};

const LEVELS = [
  { name: 'Cadet', minXP: 0, icon: '🌱' },
  { name: 'Astronaut', minXP: 500, icon: '🚀' },
  { name: 'Pilot', minXP: 1500, icon: '✈️' },
  { name: 'Commander', minXP: 3000, icon: '⭐' },
  { name: 'Admiral', minXP: 5000, icon: '🎖️' },
  { name: 'Legend', minXP: 7000, icon: '👑' },
];

/* ─── Skill Nodes (from SkillTree, enhanced with tracks) ──── */

const skillNodes: SkillNode[] = [
  // Explorer Track (11 nodes)
  {
    id: 'near-basics',
    label: 'NEAR Basics',
    icon: BookOpen,
    description: 'Understand blockchain fundamentals and what makes NEAR unique.',
    details: ['What is a blockchain & why NEAR?', 'NEAR\'s sharded architecture', 'Named accounts vs hex addresses', 'Access keys model', 'Gas fees & storage staking', 'Transaction finality'],
    xp: 50, tier: 'foundation', track: 'explorer', position: 0,
    unlocks: ['wallet-setup'], prerequisites: [], estimatedTime: '2 hours',
    rewards: ['NEAR Basics Badge'], link: '/learn/explorer/near-basics',
  },
  {
    id: 'wallet-setup',
    label: 'Wallet Setup',
    icon: Wallet,
    description: 'Create, fund, and secure your NEAR wallet.',
    details: ['Choose & install a wallet', 'Create a testnet account', 'NEAR account model', 'Access key types', 'Get testnet NEAR', 'Security best practices'],
    xp: 50, tier: 'foundation', track: 'explorer', position: 1,
    unlocks: ['first-transaction'], prerequisites: ['near-basics'], estimatedTime: '30 min',
    rewards: ['Wallet Pioneer Badge'], link: '/learn/wallet-setup',
  },
  {
    id: 'first-transaction',
    label: 'First Transaction',
    icon: Zap,
    description: 'Send your first on-chain transaction on NEAR.',
    details: ['Send NEAR between accounts', 'Explore on NearBlocks', 'Understand gas and receipts', 'Call a smart contract', 'Check account state', 'View transaction history'],
    xp: 50, tier: 'foundation', track: 'explorer', position: 2,
    unlocks: ['ecosystem-tour'], prerequisites: ['wallet-setup'], estimatedTime: '20 min',
    rewards: ['First Tx Badge'], link: '/learn/quick-start',
  },
  {
    id: 'ecosystem-tour',
    label: 'Ecosystem Tour',
    icon: Globe,
    description: 'Explore the major dApps and protocols in the NEAR ecosystem.',
    details: ['DeFi on NEAR (Ref Finance, Burrow)', 'NFT marketplaces', 'Social protocols', 'Infrastructure tools', 'DAO ecosystem', 'Chain abstraction'],
    xp: 50, tier: 'foundation', track: 'explorer', position: 3,
    unlocks: ['near-overview'], prerequisites: ['first-transaction'], estimatedTime: '1 hour',
    rewards: ['Explorer Badge'], link: '/learn/explorer/ecosystem-tour',
  },
  {
    id: 'near-overview',
    label: 'NEAR Overview',
    icon: Star,
    description: 'Deep dive into NEAR Protocol architecture and vision.',
    details: ['Nightshade sharding', 'Consensus mechanism', 'Chain abstraction vision', 'NEAR DA layer', 'Aurora EVM', 'Developer experience'],
    xp: 50, tier: 'core', track: 'explorer', position: 0,
    unlocks: ['key-technologies'], prerequisites: ['ecosystem-tour'], estimatedTime: '1.5 hours',
    rewards: ['Architecture Badge'], link: '/learn/explorer/near-overview',
  },
  {
    id: 'key-technologies',
    label: 'Key Technologies',
    icon: Brain,
    description: 'Chain Abstraction, Intents, Chain Signatures, and more.',
    details: ['Chain Signatures', 'Intents framework', 'Account aggregation', 'NEAR DA', 'Meta transactions', 'Relayers'],
    xp: 50, tier: 'core', track: 'explorer', position: 1,
    unlocks: ['defi-basics'], prerequisites: ['near-overview'], estimatedTime: '2 hours',
    rewards: ['Tech Savvy Badge'], link: '/learn/key-technologies',
  },
  {
    id: 'defi-basics',
    label: 'DeFi Basics',
    icon: Coins,
    description: 'Understand DeFi primitives on NEAR.',
    details: ['AMM mechanics', 'Lending protocols', 'Staking & liquid staking', 'Yield strategies', 'DEX aggregation', 'Risk management'],
    xp: 50, tier: 'core', track: 'explorer', position: 2,
    unlocks: ['governance'], prerequisites: ['key-technologies'], estimatedTime: '1.5 hours',
    rewards: ['DeFi Literate Badge'], link: '/learn/explorer/defi-basics',
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: Shield,
    description: 'How DAOs and governance work on NEAR.',
    details: ['DAO structures', 'Astro DAO', 'Proposal lifecycle', 'Voting mechanisms', 'Treasury management', 'Multi-sig patterns'],
    xp: 50, tier: 'advanced', track: 'explorer', position: 0,
    unlocks: ['community-nav'], prerequisites: ['defi-basics'], estimatedTime: '1 hour',
    rewards: ['Governance Badge'], link: '/learn/explorer/governance',
  },
  {
    id: 'community-nav',
    label: 'Community Navigation',
    icon: Globe,
    description: 'Navigate the NEAR community and find your tribe.',
    details: ['NEAR forums', 'Developer channels', 'Ecosystem events', 'Working groups', 'Contributor pathways', 'Grant programs'],
    xp: 50, tier: 'advanced', track: 'explorer', position: 1,
    unlocks: ['explorer-capstone'], prerequisites: ['governance'], estimatedTime: '45 min',
    rewards: ['Community Badge'], link: '/learn/explorer/community',
  },
  {
    id: 'data-tools',
    label: 'Data & Analytics',
    icon: Target,
    description: 'Master NEAR analytics and on-chain data tools.',
    details: ['NearBlocks explorer', 'Pikespeak analytics', 'NEAR Lake indexer', 'On-chain queries', 'DeFiLlama NEAR', 'FastNEAR'],
    xp: 50, tier: 'advanced', track: 'explorer', position: 2,
    unlocks: ['explorer-capstone'], prerequisites: ['defi-basics'], estimatedTime: '1 hour',
    rewards: ['Data Analyst Badge'], link: '/learn/explorer/data-tools',
  },
  {
    id: 'explorer-capstone',
    label: 'Explorer Capstone',
    icon: Award,
    description: 'Build a personal dashboard tracking 5 NEAR dApps.',
    details: ['Choose 5 dApps to track', 'Aggregate on-chain data', 'Build a dashboard', 'Present findings', 'Community sharing', 'Certificate earned'],
    xp: 50, tier: 'mastery', track: 'explorer', position: 0,
    unlocks: [], prerequisites: ['community-nav', 'data-tools'], estimatedTime: '3 hours',
    rewards: ['Explorer Certificate'], link: '/learn/certificate',
  },

  // Builder Track (16 nodes) - uses the original SkillTree data
  {
    id: 'rust-fundamentals',
    label: 'Rust Fundamentals',
    icon: Code2,
    description: 'Master the language that powers NEAR smart contracts.',
    details: ['Variables, types & mutability', 'Ownership & borrowing model', 'Structs, enums & pattern matching', 'Error handling with Result/Option', 'Traits & generics basics', 'Collections: Vec, HashMap, iterators'],
    xp: 100, tier: 'foundation', track: 'builder', position: 0,
    unlocks: ['smart-contracts-101'], prerequisites: ['first-transaction'], estimatedTime: '8 hours',
    rewards: ['Rustacean Badge'], link: '/learn/why-rust',
  },
  {
    id: 'smart-contracts-101',
    label: 'Smart Contracts 101',
    icon: FileCode,
    description: 'Build and deploy your first NEAR smart contract.',
    details: ['Contract structure with #[near] macro', 'State management & Borsh', 'View vs change methods', 'Storage collections', 'Cross-contract calls', 'Events & logging'],
    xp: 100, tier: 'foundation', track: 'builder', position: 1,
    unlocks: ['testing-basics'], prerequisites: ['rust-fundamentals'], estimatedTime: '10 hours',
    rewards: ['Contract Builder Badge'], link: '/sanctum',
  },
  {
    id: 'testing-basics',
    label: 'Testing',
    icon: FlaskConical,
    description: 'Write bulletproof tests for smart contracts.',
    details: ['Unit tests with #[cfg(test)]', 'Integration tests with near-workspaces', 'Sandbox testing', 'Multi-user simulation', 'Gas profiling', 'Security checklist'],
    xp: 100, tier: 'core', track: 'builder', position: 0,
    unlocks: ['build-token', 'build-dapp'], prerequisites: ['smart-contracts-101'], estimatedTime: '6 hours',
    rewards: ['QA Badge'], link: '/sanctum',
  },
  {
    id: 'build-token',
    label: 'Build a Token',
    icon: Coins,
    description: 'Create an NEP-141 fungible token.',
    details: ['NEP-141 standard', 'Token metadata (NEP-148)', 'Minting & burning', 'Storage management', 'Transfer & approval flow', 'DEX listing'],
    xp: 100, tier: 'core', track: 'builder', position: 1,
    unlocks: ['nft-contracts'], prerequisites: ['testing-basics'], estimatedTime: '8 hours',
    rewards: ['Token Minter Badge'], link: '/sanctum',
  },
  {
    id: 'build-dapp',
    label: 'Build a dApp',
    icon: AppWindow,
    description: 'Connect a frontend to your smart contracts.',
    details: ['near-api-js setup', 'Wallet selector', 'View & change methods', 'Transaction signing', 'Real-time state', 'Full deployment'],
    xp: 100, tier: 'core', track: 'builder', position: 2,
    unlocks: ['storage-patterns'], prerequisites: ['testing-basics'], estimatedTime: '10 hours',
    rewards: ['Full-Stack Badge'], link: '/sanctum',
  },
  {
    id: 'nft-contracts',
    label: 'NFT Contracts',
    icon: Star,
    description: 'Build NEP-171 NFT contracts with metadata and royalties.',
    details: ['NEP-171 standard', 'Token metadata', 'Minting & royalties', 'Marketplace integration', 'Enumeration methods', 'Series & collections'],
    xp: 100, tier: 'advanced', track: 'builder', position: 0,
    unlocks: ['upgradeable-contracts'], prerequisites: ['build-token'], estimatedTime: '6 hours',
    rewards: ['NFT Builder Badge'], link: '/sanctum',
  },
  {
    id: 'storage-patterns',
    label: 'Storage Patterns',
    icon: Shield,
    description: 'Master NEAR storage: collections, staking, and optimization.',
    details: ['LookupMap, UnorderedMap', 'LazyOption & TreeMap', 'Storage staking costs', 'Pagination patterns', 'State migration', 'Cost optimization'],
    xp: 100, tier: 'advanced', track: 'builder', position: 1,
    unlocks: ['upgradeable-contracts'], prerequisites: ['build-dapp'], estimatedTime: '4 hours',
    rewards: ['Storage Expert Badge'], link: '/sanctum',
  },
  {
    id: 'upgradeable-contracts',
    label: 'Upgradeable Contracts',
    icon: Rocket,
    description: 'Deploy contracts that can be safely upgraded over time.',
    details: ['Upgrade patterns', 'State migration', 'Versioning strategy', 'Proxy patterns', 'DAO-controlled upgrades', 'Rollback plans'],
    xp: 100, tier: 'advanced', track: 'builder', position: 2,
    unlocks: ['builder-capstone'], prerequisites: ['nft-contracts', 'storage-patterns'], estimatedTime: '5 hours',
    rewards: ['Upgrade Master Badge'], link: '/sanctum',
  },
  {
    id: 'near-cli',
    label: 'NEAR CLI Mastery',
    icon: Terminal,
    description: 'Master the NEAR CLI for deployment and debugging.',
    details: ['near-cli-rs setup', 'Deploy & call commands', 'Account management', 'Key management', 'Transaction inspection', 'Batch operations'],
    xp: 100, tier: 'foundation', track: 'builder', position: 2,
    unlocks: ['testing-basics'], prerequisites: ['first-transaction'], estimatedTime: '2 hours',
    rewards: ['CLI Ninja Badge'], link: '/sanctum',
  },
  {
    id: 'frontend-integration',
    label: 'Frontend Integration',
    icon: AppWindow,
    description: 'Deep dive into wallet selector and near-api-js patterns.',
    details: ['Wallet selector customization', 'Multiple wallet support', 'Session management', 'Error handling UX', 'Mobile wallet support', 'Social login integration'],
    xp: 100, tier: 'advanced', track: 'builder', position: 3,
    unlocks: ['builder-capstone'], prerequisites: ['build-dapp'], estimatedTime: '5 hours',
    rewards: ['Frontend Expert Badge'], link: '/sanctum',
  },
  {
    id: 'builder-capstone',
    label: 'Builder Capstone',
    icon: Trophy,
    description: 'Deploy an NEP-141 token with a simple frontend.',
    details: ['Design token economics', 'Write token contract', 'Build frontend UI', 'Deploy to testnet', 'Test full flow', 'Certificate earned'],
    xp: 100, tier: 'mastery', track: 'builder', position: 0,
    unlocks: [], prerequisites: ['upgradeable-contracts', 'frontend-integration'], estimatedTime: '10 hours',
    rewards: ['Builder Certificate'], link: '/learn/certificate',
  },

  // Hacker Track (11 nodes)
  {
    id: 'security-fundamentals',
    label: 'Security Fundamentals',
    icon: ShieldCheck,
    description: 'Master smart contract security patterns.',
    details: ['Common attack vectors', 'Reentrancy protection', 'Access control', 'Contract upgrades', 'Gas & storage attacks', 'Audit process'],
    xp: 150, tier: 'foundation', track: 'hacker', position: 0,
    unlocks: ['advanced-rust'], prerequisites: ['testing-basics'], estimatedTime: '6 hours',
    rewards: ['Security Expert Badge'], link: '/sanctum',
  },
  {
    id: 'advanced-rust',
    label: 'Advanced Rust',
    icon: Code2,
    description: 'Advanced Rust patterns for high-performance contracts.',
    details: ['Async/await patterns', 'Custom derive macros', 'Zero-copy parsing', 'Unsafe Rust (when needed)', 'Performance optimization', 'Memory layout control'],
    xp: 150, tier: 'core', track: 'hacker', position: 0,
    unlocks: ['cross-contract', 'indexer-dev'], prerequisites: ['security-fundamentals'], estimatedTime: '8 hours',
    rewards: ['Advanced Rustacean Badge'], link: '/sanctum',
  },
  {
    id: 'cross-contract',
    label: 'Cross-Contract Calls',
    icon: Globe,
    description: 'Master complex cross-contract interactions and promises.',
    details: ['Promise chains', 'Callback patterns', 'Error propagation', 'Gas allocation', 'Batch actions', 'Atomic operations'],
    xp: 150, tier: 'core', track: 'hacker', position: 1,
    unlocks: ['chain-signatures'], prerequisites: ['advanced-rust'], estimatedTime: '6 hours',
    rewards: ['Cross-Contract Badge'], link: '/sanctum',
  },
  {
    id: 'indexer-dev',
    label: 'Indexer Development',
    icon: Target,
    description: 'Build custom indexers for NEAR on-chain data.',
    details: ['NEAR Lake framework', 'Block & receipt processing', 'Custom data models', 'Database integration', 'Real-time streaming', 'Querying patterns'],
    xp: 150, tier: 'core', track: 'hacker', position: 2,
    unlocks: ['hacker-capstone'], prerequisites: ['advanced-rust'], estimatedTime: '8 hours',
    rewards: ['Indexer Badge'], link: '/sanctum',
  },
  {
    id: 'chain-signatures',
    label: 'Chain Signatures',
    icon: Shield,
    description: 'Use NEAR\'s Chain Signatures for cross-chain operations.',
    details: ['MPC key derivation', 'Signing for other chains', 'Cross-chain verification', 'Multi-chain wallets', 'Bridge patterns', 'Security considerations'],
    xp: 150, tier: 'advanced', track: 'hacker', position: 0,
    unlocks: ['intents-protocol'], prerequisites: ['cross-contract'], estimatedTime: '8 hours',
    rewards: ['Chain Sig Badge'], link: '/sanctum',
  },
  {
    id: 'intents-protocol',
    label: 'Intents Protocol',
    icon: Brain,
    description: 'Build with NEAR\'s intent-based transaction system.',
    details: ['Intent lifecycle', 'Solver architecture', 'Intent composition', 'Cross-chain intents', 'MEV protection', 'Solver incentives'],
    xp: 150, tier: 'advanced', track: 'hacker', position: 1,
    unlocks: ['ai-agents'], prerequisites: ['chain-signatures'], estimatedTime: '6 hours',
    rewards: ['Intents Badge'], link: '/sanctum',
  },
  {
    id: 'ai-agents',
    label: 'AI Agents on NEAR',
    icon: Brain,
    description: 'Build AI agents that interact with NEAR Protocol.',
    details: ['Agent architecture', 'On-chain AI models', 'Autonomous transactions', 'Agent-to-agent comms', 'Safety guardrails', 'NEAR AI integration'],
    xp: 150, tier: 'advanced', track: 'hacker', position: 2,
    unlocks: ['hacker-capstone'], prerequisites: ['intents-protocol'], estimatedTime: '8 hours',
    rewards: ['AI Agent Badge'], link: '/sanctum',
  },
  {
    id: 'gas-optimization',
    label: 'Gas Optimization',
    icon: Zap,
    description: 'Optimize contracts for minimum gas consumption.',
    details: ['Gas profiling tools', 'Serialization optimization', 'Storage minimization', 'Batch operations', 'Lazy evaluation', 'Benchmarking'],
    xp: 150, tier: 'core', track: 'hacker', position: 3,
    unlocks: ['chain-signatures'], prerequisites: ['advanced-rust'], estimatedTime: '4 hours',
    rewards: ['Gas Optimizer Badge'], link: '/sanctum',
  },
  {
    id: 'audit-practice',
    label: 'Audit Practice',
    icon: ShieldCheck,
    description: 'Practice auditing real-world NEAR contracts.',
    details: ['Read audit reports', 'Common vulnerability patterns', 'Manual review process', 'Automated tools', 'Report writing', 'Bug bounty programs'],
    xp: 150, tier: 'advanced', track: 'hacker', position: 3,
    unlocks: ['hacker-capstone'], prerequisites: ['chain-signatures'], estimatedTime: '6 hours',
    rewards: ['Auditor Badge'], link: '/sanctum',
  },
  {
    id: 'hacker-capstone',
    label: 'Hacker Capstone',
    icon: Trophy,
    description: 'Build a cross-chain oracle using Chain Signatures.',
    details: ['Design oracle architecture', 'Implement Chain Signatures', 'Build verification logic', 'Cross-chain data feed', 'Deploy & test', 'Certificate earned'],
    xp: 150, tier: 'mastery', track: 'hacker', position: 0,
    unlocks: [], prerequisites: ['indexer-dev', 'ai-agents', 'audit-practice'], estimatedTime: '15 hours',
    rewards: ['Hacker Certificate'], link: '/learn/certificate',
  },

  // Founder Track (5 nodes)
  {
    id: 'market-research',
    label: 'Market Research',
    icon: Target,
    description: 'Identify real opportunities in the NEAR ecosystem.',
    details: ['Ecosystem gap analysis', 'User research methods', 'Competitive landscape', 'TVL & usage data', 'Community needs', 'Timing analysis'],
    xp: 100, tier: 'foundation', track: 'founder', position: 0,
    unlocks: ['pitch-deck'], prerequisites: ['ecosystem-tour'], estimatedTime: '4 hours',
    rewards: ['Researcher Badge'], link: '/opportunities',
  },
  {
    id: 'pitch-deck',
    label: 'Pitch Deck',
    icon: Rocket,
    description: 'Create a compelling pitch for your NEAR project.',
    details: ['Problem statement', 'Solution architecture', 'Market sizing', 'Business model', 'Team & traction', 'Funding ask'],
    xp: 100, tier: 'core', track: 'founder', position: 0,
    unlocks: ['tokenomics'], prerequisites: ['market-research'], estimatedTime: '6 hours',
    rewards: ['Pitch Ready Badge'], link: '/opportunities',
  },
  {
    id: 'tokenomics',
    label: 'Tokenomics',
    icon: CircleDollarSign,
    description: 'Design sustainable token economics for your project.',
    details: ['Supply mechanics', 'Distribution strategy', 'Utility design', 'Incentive alignment', 'Vesting schedules', 'Governance rights'],
    xp: 100, tier: 'core', track: 'founder', position: 1,
    unlocks: ['grant-application'], prerequisites: ['pitch-deck'], estimatedTime: '5 hours',
    rewards: ['Tokenomics Badge'], link: '/opportunities',
  },
  {
    id: 'grant-application',
    label: 'Grant Application',
    icon: CircleDollarSign,
    description: 'Apply for NEAR ecosystem grants and funding.',
    details: ['NEAR Foundation grants', 'DevDAO funding', 'Proposal writing', 'Budget planning', 'Milestone design', 'Reporting requirements'],
    xp: 100, tier: 'advanced', track: 'founder', position: 0,
    unlocks: ['founder-capstone'], prerequisites: ['tokenomics'], estimatedTime: '4 hours',
    rewards: ['Grant Ready Badge'], link: '/opportunities',
  },
  {
    id: 'founder-capstone',
    label: 'Founder Capstone',
    icon: Trophy,
    description: 'Create a complete project pitch with deployed testnet demo.',
    details: ['Complete pitch deck', 'Testnet deployment', 'Demo video', 'Grant proposal draft', 'Community feedback', 'Certificate earned'],
    xp: 100, tier: 'mastery', track: 'founder', position: 0,
    unlocks: [], prerequisites: ['grant-application'], estimatedTime: '20 hours',
    rewards: ['Founder Certificate'], link: '/learn/certificate',
  },
];

const connections: Connection[] = [
  // Explorer track
  { from: 'near-basics', to: 'wallet-setup' },
  { from: 'wallet-setup', to: 'first-transaction' },
  { from: 'first-transaction', to: 'ecosystem-tour' },
  { from: 'ecosystem-tour', to: 'near-overview' },
  { from: 'near-overview', to: 'key-technologies' },
  { from: 'key-technologies', to: 'defi-basics' },
  { from: 'defi-basics', to: 'governance' },
  { from: 'governance', to: 'community-nav' },
  { from: 'defi-basics', to: 'data-tools' },
  { from: 'community-nav', to: 'explorer-capstone' },
  { from: 'data-tools', to: 'explorer-capstone' },
  // Builder track
  { from: 'first-transaction', to: 'rust-fundamentals' },
  { from: 'first-transaction', to: 'near-cli' },
  { from: 'rust-fundamentals', to: 'smart-contracts-101' },
  { from: 'smart-contracts-101', to: 'testing-basics' },
  { from: 'near-cli', to: 'testing-basics' },
  { from: 'testing-basics', to: 'build-token' },
  { from: 'testing-basics', to: 'build-dapp' },
  { from: 'build-token', to: 'nft-contracts' },
  { from: 'build-dapp', to: 'storage-patterns' },
  { from: 'build-dapp', to: 'frontend-integration' },
  { from: 'nft-contracts', to: 'upgradeable-contracts' },
  { from: 'storage-patterns', to: 'upgradeable-contracts' },
  { from: 'upgradeable-contracts', to: 'builder-capstone' },
  { from: 'frontend-integration', to: 'builder-capstone' },
  // Hacker track
  { from: 'testing-basics', to: 'security-fundamentals' },
  { from: 'security-fundamentals', to: 'advanced-rust' },
  { from: 'advanced-rust', to: 'cross-contract' },
  { from: 'advanced-rust', to: 'indexer-dev' },
  { from: 'advanced-rust', to: 'gas-optimization' },
  { from: 'cross-contract', to: 'chain-signatures' },
  { from: 'gas-optimization', to: 'chain-signatures' },
  { from: 'chain-signatures', to: 'intents-protocol' },
  { from: 'chain-signatures', to: 'audit-practice' },
  { from: 'intents-protocol', to: 'ai-agents' },
  { from: 'ai-agents', to: 'hacker-capstone' },
  { from: 'indexer-dev', to: 'hacker-capstone' },
  { from: 'audit-practice', to: 'hacker-capstone' },
  // Founder track
  { from: 'ecosystem-tour', to: 'market-research' },
  { from: 'market-research', to: 'pitch-deck' },
  { from: 'pitch-deck', to: 'tokenomics' },
  { from: 'tokenomics', to: 'grant-application' },
  { from: 'grant-application', to: 'founder-capstone' },
];

const STORAGE_KEY = 'voidspace-skill-progress';
const TOTAL_MODULES = 43;

/* ─── Helpers ──────────────────────────────────────────────── */

function loadProgress(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return new Set(JSON.parse(data));
  } catch { /* ignore */ }
  return new Set();
}

function saveProgress(completed: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
  } catch { /* ignore */ }
}

function getNodeStatus(nodeId: string, completed: Set<string>): NodeStatus {
  if (completed.has(nodeId)) return 'completed';
  const node = skillNodes.find(n => n.id === nodeId);
  if (!node) return 'locked';
  if (node.prerequisites.length === 0) return 'available';
  const allPrereqsMet = node.prerequisites.every(p => completed.has(p));
  return allPrereqsMet ? 'available' : 'locked';
}

function getLevel(xp: number) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) level = l;
  }
  return level;
}

/* ─── Progress Ring ────────────────────────────────────────── */

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;

  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={radius} fill="none"
          stroke="url(#ring-gradient)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00EC97" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-near-green font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {completed}
        </motion.span>
        <span className="text-[10px] text-text-muted">/ {total} modules</span>
      </div>
    </div>
  );
}

/* ─── Star Field ───────────────────────────────────────────── */

function StarField() {
  const stars = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: ((i * 17 + 31) % 100),
    y: ((i * 23 + 7) % 100),
    size: (i % 5) === 0 ? 2.5 : (i % 3) === 0 ? 1.5 : 1,
    delay: (i % 8) * 0.5,
    duration: 2 + (i % 5),
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className={cn(
            'absolute rounded-full',
            star.size > 2 ? 'bg-near-green/50' : star.size > 1 ? 'bg-accent-cyan/30' : 'bg-white/60'
          )}
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
          animate={{ opacity: [0.05, star.size > 1.5 ? 0.8 : 0.4, 0.05] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─── Galaxy Node ──────────────────────────────────────────── */

function GalaxyNode({
  node,
  status,
  isSelected,
  onSelect,
  x,
  y,
  index,
}: {
  node: SkillNode;
  status: NodeStatus;
  isSelected: boolean;
  onSelect: (id: string) => void;
  x: number;
  y: number;
  index: number;
}) {
  const track = TRACK_CONFIG[node.track];
  const isCompleted = status === 'completed';
  const isAvailable = status === 'available';
  const isLocked = status === 'locked';

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer z-10 group"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.04, type: 'spring', stiffness: 200, damping: 18 }}
      onClick={() => onSelect(node.id)}
    >
      {/* Glow for completed */}
      {isCompleted && (
        <motion.div
          className="absolute w-16 h-16 rounded-full"
          animate={{
            boxShadow: [
              `0 0 15px ${track.glow}, 0 0 30px rgba(0,236,151,0.06)`,
              `0 0 25px ${track.glow}, 0 0 45px rgba(0,236,151,0.1)`,
              `0 0 15px ${track.glow}, 0 0 30px rgba(0,236,151,0.06)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Pulse for available */}
      {isAvailable && (
        <motion.div
          className="absolute w-14 h-14 rounded-full border-2"
          style={{ borderColor: track.glow }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Node circle */}
      <motion.div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center border-2 relative backdrop-blur-sm transition-shadow',
          isCompleted ? 'border-near-green bg-near-green/15' :
          isAvailable ? `${track.border} ${track.bg}` :
          'border-border/40 bg-surface/40',
          isSelected && 'ring-2 ring-near-green/60 ring-offset-2 ring-offset-background'
        )}
        whileHover={{ scale: 1.2, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.9 }}
      >
        {isLocked ? (
          <Lock className="w-3.5 h-3.5 text-text-muted/30" />
        ) : (
          <node.icon className={cn('w-4 h-4', isCompleted ? 'text-near-green' : track.color)} />
        )}
        {isCompleted && (
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-near-green flex items-center justify-center shadow-lg shadow-near-green/30">
            <CheckCircle className="w-2.5 h-2.5 text-background" />
          </div>
        )}
        {isAvailable && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent-cyan flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-2 h-2 text-background" />
          </motion.div>
        )}
      </motion.div>

      {/* Label */}
      <span className={cn(
        'text-[9px] font-semibold text-center max-w-[80px] leading-tight opacity-0 group-hover:opacity-100 transition-opacity',
        isCompleted ? 'text-near-green' : isAvailable ? track.color : 'text-text-muted/40'
      )}>
        {node.label}
      </span>
    </motion.div>
  );
}

/* ─── Tooltip Panel ────────────────────────────────────────── */

function NodeTooltip({
  node,
  status,
  onClose,
  onToggleComplete,
}: {
  node: SkillNode;
  status: NodeStatus;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
}) {
  const track = TRACK_CONFIG[node.track];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="glass" padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-near-green/60 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border-2', track.bg, track.border)}>
                <node.icon className={cn('w-5 h-5', track.color)} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-lg font-bold text-text-primary">{node.label}</h3>
                  <span className={cn('text-[9px] font-mono font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border', track.bg, track.color, track.border)}>
                    {track.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="font-mono text-near-green">{node.xp} XP</span>
                  <span>•</span>
                  <span>{node.estimatedTime}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-text-muted" />
            </button>
          </div>
          <p className="text-sm text-text-secondary mb-4">{node.description}</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {node.details.map((d, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-surface/50">
                <div className={cn('w-1.5 h-1.5 rounded-full', status === 'completed' ? 'bg-near-green' : 'bg-border')} />
                <span className="text-xs text-text-secondary">{d}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {status === 'available' && (
              <Link href={node.link || '/sanctum'} className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  Start Learning <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            )}
            {status === 'completed' && (
              <Link href={node.link || '/sanctum'} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">Review</Button>
              </Link>
            )}
            {status !== 'locked' && (
              <button
                onClick={() => onToggleComplete(node.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                  status === 'completed'
                    ? 'border-near-green/30 bg-near-green/10 text-near-green'
                    : 'border-border bg-surface hover:bg-surface-hover text-text-muted'
                )}
              >
                {status === 'completed' ? <><CheckCircle className="w-3 h-3" /> Done</> : <><Target className="w-3 h-3" /> Complete</>}
              </button>
            )}
            {status === 'locked' && (
              <div className="flex-1 text-center py-2 rounded-lg bg-surface/50 border border-border/50">
                <p className="text-xs text-text-muted flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Complete prerequisites first
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── Galaxy Constellation Lines ───────────────────────────── */

function GalaxyLines({
  positions,
  completed,
}: {
  positions: Map<string, { x: number; y: number }>;
  completed: Set<string>;
}) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gl-completed" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00EC97" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="gl-available" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00EC97" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.15" />
        </linearGradient>
        <filter id="gl-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {connections.map((conn) => {
        const from = positions.get(conn.from);
        const to = positions.get(conn.to);
        if (!from || !to) return null;
        const fromDone = completed.has(conn.from);
        const toDone = completed.has(conn.to);
        const isCompleted = fromDone && toDone;
        const isAvailable = fromDone && !toDone;
        const gradient = isCompleted ? 'url(#gl-completed)' : isAvailable ? 'url(#gl-available)' : 'rgba(60,60,60,0.15)';
        return (
          <motion.line
            key={`${conn.from}-${conn.to}`}
            x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`}
            stroke={gradient}
            strokeWidth={isCompleted ? 1.5 : 1}
            strokeDasharray={isCompleted || isAvailable ? '0' : '4 3'}
            filter={isCompleted ? 'url(#gl-glow)' : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        );
      })}
    </svg>
  );
}

/* ─── Track Summary Card ───────────────────────────────────── */

function TrackSummary({
  trackId,
  completed,
}: {
  trackId: keyof typeof TRACK_CONFIG;
  completed: Set<string>;
}) {
  const config = TRACK_CONFIG[trackId];
  const trackNodes = skillNodes.filter(n => n.track === trackId);
  const completedCount = trackNodes.filter(n => completed.has(n.id)).length;
  const totalXP = trackNodes.reduce((s, n) => s + n.xp, 0);
  const earnedXP = trackNodes.filter(n => completed.has(n.id)).reduce((s, n) => s + n.xp, 0);
  const pct = trackNodes.length > 0 ? Math.round((completedCount / trackNodes.length) * 100) : 0;
  const Icon = config.icon;

  return (
    <div className="p-4 rounded-xl bg-surface/60 border border-border/50 space-y-3">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center border', config.bg, config.border)}>
          <Icon className={cn('w-5 h-5', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={cn('text-sm font-bold', config.color)}>{config.label}</h4>
            <span className="text-xs font-mono text-text-muted">{completedCount}/{trackNodes.length}</span>
          </div>
          <p className="text-[10px] text-text-muted">{config.description}</p>
        </div>
      </div>
      <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/30">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${config.glow}, rgba(0,236,151,0.5))` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-text-muted">
        <span>{pct}% complete</span>
        <span className="font-mono text-near-green">{earnedXP}/{totalXP} XP</span>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function SkillConstellation() {
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(() => loadProgress());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<keyof typeof TRACK_CONFIG | 'all'>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });

  useEffect(() => { saveProgress(completedNodes); }, [completedNodes]);

  const handleSelect = useCallback((id: string) => {
    setSelectedNode(prev => (prev === id ? null : id));
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    setCompletedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setCompletedNodes(new Set());
    setSelectedNode(null);
  }, []);

  // Calculate positions for the galaxy view — each track gets a quadrant
  const positions = useMemo(() => {
    const pos = new Map<string, { x: number; y: number }>();
    const trackQuadrants = {
      explorer: { cx: 25, cy: 30 },   // top-left
      builder: { cx: 75, cy: 30 },    // top-right
      hacker: { cx: 25, cy: 72 },     // bottom-left
      founder: { cx: 75, cy: 72 },    // bottom-right
    };

    (Object.keys(TRACK_CONFIG) as Array<keyof typeof TRACK_CONFIG>).forEach(trackId => {
      const { cx, cy } = trackQuadrants[trackId];
      const trackNodes_local = skillNodes.filter(n => n.track === trackId);
      const radius = 14;
      trackNodes_local.forEach((node, i) => {
        const angle = (i / trackNodes_local.length) * 2 * Math.PI - Math.PI / 2;
        const r = radius * (0.4 + (i % 3) * 0.3);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        pos.set(node.id, { x: Math.max(3, Math.min(97, x)), y: Math.max(3, Math.min(97, y)) });
      });
    });

    return pos;
  }, []);

  const selectedData = skillNodes.find(n => n.id === selectedNode);
  const selectedStatus = selectedData ? getNodeStatus(selectedData.id, completedNodes) : 'locked';

  const completedCount = skillNodes.filter(n => completedNodes.has(n.id)).length;
  const totalXP = skillNodes.reduce((s, n) => s + n.xp, 0);
  const earnedXP = skillNodes.filter(n => completedNodes.has(n.id)).reduce((s, n) => s + n.xp, 0);
  const level = getLevel(earnedXP);
  const nextLevel = LEVELS.find(l => l.minXP > earnedXP);

  const filteredNodes = activeTrack === 'all' ? skillNodes : skillNodes.filter(n => n.track === activeTrack);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <ProgressRing completed={completedCount} total={TOTAL_MODULES} />
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              <GradientText>Skill Constellation</GradientText>
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {completedCount}/{TOTAL_MODULES} modules completed · {earnedXP} XP earned
            </p>
          </div>
          {/* Level */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">{level.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-text-primary">{level.name}</span>
                {nextLevel && (
                  <span className="text-[10px] text-text-muted font-mono">
                    {nextLevel.minXP - earnedXP} XP to {nextLevel.name}
                  </span>
                )}
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-near-green via-accent-cyan to-purple-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: nextLevel
                      ? `${((earnedXP - level.minXP) / (nextLevel.minXP - level.minXP)) * 100}%`
                      : '100%',
                  }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
          {completedCount > 0 && (
            <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-red-400 transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset Progress
            </button>
          )}
        </div>
      </div>

      {/* Track Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTrack('all')}
          className={cn(
            'text-xs px-3 py-1.5 rounded-full border font-medium transition-all',
            activeTrack === 'all'
              ? 'border-near-green bg-near-green/10 text-near-green'
              : 'border-border bg-surface text-text-muted hover:text-text-primary'
          )}
        >
          All Tracks
        </button>
        {(Object.keys(TRACK_CONFIG) as Array<keyof typeof TRACK_CONFIG>).map(trackId => {
          const cfg = TRACK_CONFIG[trackId];
          return (
            <button
              key={trackId}
              onClick={() => setActiveTrack(trackId)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border font-medium transition-all',
                activeTrack === trackId
                  ? `${cfg.border} ${cfg.bg} ${cfg.color}`
                  : 'border-border bg-surface text-text-muted hover:text-text-primary'
              )}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Track Summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(TRACK_CONFIG) as Array<keyof typeof TRACK_CONFIG>).map(trackId => (
          <TrackSummary key={trackId} trackId={trackId} completed={completedNodes} />
        ))}
      </div>

      {/* Galaxy Map (desktop) */}
      <div ref={containerRef} className="hidden lg:block relative h-[600px] rounded-xl border border-border/30 bg-background/80 overflow-hidden">
        <StarField />
        {/* Nebula backgrounds per quadrant */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_25%_30%,rgba(0,212,255,0.04),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_75%_30%,rgba(0,236,151,0.04),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_25%_72%,rgba(192,132,252,0.04),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_75%_72%,rgba(251,146,60,0.03),transparent)]" />
        </div>

        {/* Track labels */}
        {[
          { label: 'Explorer', x: 25, y: 12, color: 'text-accent-cyan' },
          { label: 'Builder', x: 75, y: 12, color: 'text-near-green' },
          { label: 'Hacker', x: 25, y: 55, color: 'text-purple-400' },
          { label: 'Founder', x: 75, y: 55, color: 'text-accent-orange' },
        ].map(t => (
          <div key={t.label} className="absolute z-20" style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}>
            <span className={cn('text-[10px] font-mono uppercase tracking-widest', t.color)}>{t.label}</span>
          </div>
        ))}

        <GalaxyLines positions={positions} completed={completedNodes} />

        {filteredNodes.map((node, i) => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          return (
            <GalaxyNode
              key={node.id}
              node={node}
              status={getNodeStatus(node.id, completedNodes)}
              isSelected={selectedNode === node.id}
              onSelect={handleSelect}
              x={pos.x}
              y={pos.y}
              index={i}
            />
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {selectedData && (
          <NodeTooltip
            key={selectedData.id}
            node={selectedData}
            status={selectedStatus}
            onClose={() => setSelectedNode(null)}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </AnimatePresence>

      {/* Mobile list */}
      <div className="lg:hidden space-y-3">
        {(Object.keys(TRACK_CONFIG) as Array<keyof typeof TRACK_CONFIG>).map(trackId => {
          if (activeTrack !== 'all' && activeTrack !== trackId) return null;
          const cfg = TRACK_CONFIG[trackId];
          const trackNodesList = skillNodes.filter(n => n.track === trackId);
          const Icon = cfg.icon;
          return (
            <div key={trackId} className="space-y-2">
              <div className="flex items-center gap-2 py-2">
                <div className={cn('p-1.5 rounded-lg border', cfg.bg, cfg.border)}>
                  <Icon className={cn('w-3.5 h-3.5', cfg.color)} />
                </div>
                <span className={cn('text-xs font-mono font-bold uppercase tracking-widest', cfg.color)}>{cfg.label}</span>
                <div className="flex-1 h-px bg-border/30" />
              </div>
              {trackNodesList.map((node) => {
                const status = getNodeStatus(node.id, completedNodes);
                const isSelected_local = selectedNode === node.id;
                return (
                  <div key={node.id}>
                    <div
                      className={cn('flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                        status === 'locked' ? 'opacity-40 border-border/30 bg-surface/30' :
                        isSelected_local ? 'border-near-green/40 bg-near-green/5' :
                        'border-border/50 bg-surface/50 hover:bg-surface-hover'
                      )}
                      onClick={() => handleSelect(node.id)}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center border',
                        status === 'completed' ? 'border-near-green bg-near-green/15' :
                        status === 'available' ? `${cfg.border} ${cfg.bg}` :
                        'border-border/40 bg-surface/40'
                      )}>
                        {status === 'locked' ? <Lock className="w-3 h-3 text-text-muted/30" /> :
                         <node.icon className={cn('w-3.5 h-3.5', status === 'completed' ? 'text-near-green' : cfg.color)} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn('text-xs font-bold', status === 'completed' ? 'text-near-green' : status === 'available' ? 'text-text-primary' : 'text-text-muted/50')}>
                          {node.label}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted">
                          <span className="font-mono text-near-green/60">{node.xp} XP</span>
                          <span>•</span>
                          <span>{node.estimatedTime}</span>
                        </div>
                      </div>
                      {status === 'completed' && <CheckCircle className="w-4 h-4 text-near-green flex-shrink-0" />}
                      {status === 'available' && <Zap className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />}
                    </div>
                    <AnimatePresence>
                      {isSelected_local && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 space-y-2">
                            <p className="text-xs text-text-secondary">{node.description}</p>
                            <div className="flex gap-2">
                              {status !== 'locked' && (
                                <>
                                  <Link href={node.link || '/sanctum'}>
                                    <Button variant="primary" size="sm">
                                      {status === 'completed' ? 'Review' : 'Start'} <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  </Link>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleComplete(node.id); }}
                                    className={cn(
                                      'text-[10px] font-mono px-2 py-1 rounded border',
                                      status === 'completed' ? 'border-near-green/30 text-near-green bg-near-green/10' : 'border-border text-text-muted'
                                    )}
                                  >
                                    {status === 'completed' ? '✓ Done' : 'Mark Done'}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Certificates CTA */}
      <ScrollReveal>
        <Link href="/learn/certificate" className="block group">
          <GlowCard className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <Award className="w-8 h-8 text-near-green" />
              <h3 className="text-lg font-bold text-text-primary group-hover:text-near-green transition-colors">
                Earn Your Certificates
              </h3>
              <p className="text-sm text-text-muted max-w-md">
                Complete a track to earn a shareable NEAR certificate. Prove your skills to the ecosystem.
              </p>
              <span className="text-xs text-near-green font-mono">View Certificates →</span>
            </div>
          </GlowCard>
        </Link>
      </ScrollReveal>
    </div>
  );
}
