# Voidspace Learn Section — Massive Expansion Plan

## Current State (43 modules across 4 tracks + Rust Curriculum)

### Explorer Track (11 modules) — Beginner, ~6 hours
1. What is Blockchain?
2. What is NEAR?
3. Create a Wallet
4. Your First Transaction
5. Understanding dApps
6. Reading Smart Contracts
7. NEAR Ecosystem Tour
8. NEAR vs Other Chains
9. Reading the Explorer
10. DeFi Basics
11. Choose Your Path

### Builder Track (16 modules) — Intermediate, ~20 hours
1. Dev Environment Setup
2. Rust Fundamentals
3. Your First Contract
4. Account Model & Access Keys
5. State Management
6. NEAR CLI Mastery
7. Testing & Debugging
8. Frontend Integration
9. Token Standards
10. NEP Standards Deep Dive
11. Building a dApp
12. Security Best Practices
13. Upgrading Contracts
14. Deployment
15. Optimization
16. Launch Checklist

### Hacker Track (11 modules) — Advanced, ~8 hours
1. NEAR Architecture Deep Dive
2. Cross-Contract Calls
3. Advanced Storage
4. Chain Signatures
5. Intents & Chain Abstraction
6. Shade Agents
7. AI Agent Integration
8. MEV & Transaction Ordering
9. Building an Indexer
10. Multi-Chain with NEAR
11. Production Patterns

### Founder Track (5 modules) — Advanced, ~6 hours
1. NEAR Grants & Funding
2. Tokenomics Design
3. Building in Public
4. Pitching Your Project
5. Revenue Models for dApps

### Rust Curriculum (10 modules — self-contained, in RustCurriculum.tsx)
1. Variables & Types
2. Ownership & Borrowing
3. Structs & Enums
4. Error Handling
5. Collections & Iterators
6. Traits & Generics
7. Smart Contract Basics
8. Testing & Debugging
9. Advanced Patterns
10. Deploy & Launch

---

## Target Audience Analysis

**Who comes to Voidspace to learn?**
1. **Crypto-curious beginners** — want to understand blockchain & NEAR without code
2. **Web2 devs transitioning** — know JS/Python, want to build on NEAR
3. **Solana/ETH devs** — already know blockchain, want NEAR-specific skills
4. **Entrepreneurs** — want to build a business on NEAR
5. **Students** — looking for structured free courses

**What do they want?**
- Practical, hands-on content (not theory dumps)
- Real-world examples and code they can use
- Clear progression from "I know nothing" to "I shipped a dApp"
- Security knowledge (don't want to get hacked)
- Understanding of the NEAR ecosystem opportunities
- Career/business guidance

---

## NEW MODULES TO ADD

### Explorer Track — Add 5 new modules (11 → 16)
12. **NFT Basics on NEAR** — What NFTs are, how they work on NEAR, major collections, marketplaces (Mintbase, Paras)
13. **Staking & Validators** — How staking works, choosing validators, liquid staking (LiNEAR, Meta Pool)
14. **DAOs on NEAR** — What DAOs are, Astro DAO, how to join and participate
15. **Staying Safe in Web3** — Scam awareness, phishing, safe wallet practices, verifying contracts
16. **NEAR Data Tools** — Using Voidspace Observatory, NearBlocks, Pikespeak for on-chain analysis

### Builder Track — Add 6 new modules (16 → 22)
17. **Building an NFT Contract** — NEP-171 implementation, minting, royalties, marketplace integration
18. **Building a DAO Contract** — Governance contract patterns, voting mechanisms, treasury management
19. **DeFi Contract Patterns** — AMM basics, liquidity pools, swap contract architecture on NEAR
20. **Aurora & EVM Compatibility** — Building for Aurora, Solidity on NEAR, bridging between EVM & native
21. **Wallet Selector Integration** — Complete guide to wallet-selector, handling multiple wallets, UX patterns
22. **NEAR Social & BOS** — Building on NEAR Social (BOS), widgets, composability, social graph

### Hacker Track — Add 5 new modules (11 → 16)
12. **Zero-Knowledge on NEAR** — ZK proofs overview, NEAR's ZK roadmap, building ZK-enabled contracts
13. **Oracle Integration** — Connecting contracts to real-world data, Pyth, Seda, building custom oracles
14. **Gas Optimization Deep Dive** — Gas profiling, batch optimization, storage management for cost reduction
15. **Bridge Architecture** — Rainbow Bridge, Wormhole, building cross-chain messaging
16. **Formal Verification** — Proving contract correctness, tools and approaches for NEAR contracts

### Founder Track — Add 7 new modules (5 → 12)
6. **Community Building** — Discord/Telegram growth, ambassador programs, incentive design
7. **Go-To-Market for dApps** — Launch strategy, user acquisition, growth hacking in Web3
8. **Legal & Regulatory Basics** — Token classification, KYC/AML basics, jurisdiction considerations
9. **Treasury Management** — Managing a project treasury, diversification, on-chain governance of funds
10. **Metrics That Matter** — DAU/MAU, TVL, retention, on-chain analytics for measuring success
11. **Marketing for Web3** — Content strategy, KOLs, airdrop marketing, partnership playbooks
12. **Investor Relations** — VC landscape in crypto, term sheets, cap tables, fundraising roadmap

### Rust Curriculum — Add 2 new modules (10 → 12)
11. **Async & Promises in NEAR** — How NEAR handles async, promises, callbacks, cross-contract async patterns
12. **Real-World Project: Build a Token Swap** — Capstone project building a simple AMM

---

## Implementation Phases

### Phase 1: Explorer Track Expansion (5 new modules)
- Create 5 new .tsx module files
- Update explorer/modules/index.ts
- Update LearningTracks.tsx track data (moduleCount: 16, add new modules)
- Update explorer/[slug]/page.tsx EXPLORER_MODULES array

### Phase 2: Builder Track Expansion (6 new modules)
- Create 6 new .tsx module files  
- Update builder/modules/index.ts
- Update LearningTracks.tsx track data (moduleCount: 22, add new modules)
- Update builder/[slug]/page.tsx BUILDER_MODULES array

### Phase 3: Hacker Track Expansion (5 new modules)
- Create 5 new .tsx module files
- Update hacker/modules/index.ts
- Update LearningTracks.tsx track data (moduleCount: 16, add new modules)
- Update hacker/[slug]/page.tsx HACKER_MODULES array

### Phase 4: Founder Track Expansion (7 new modules)
- Create 7 new .tsx module files
- Update founder/modules/index.ts
- Update LearningTracks.tsx track data (moduleCount: 12, add new modules)
- Update founder/[slug]/page.tsx FOUNDER_MODULES array

### Phase 5: Rust Curriculum Expansion (2 new modules)
- Add 2 new modules to the MODULES array in RustCurriculum.tsx
- Update badge requirements
- Update total module counts

### Phase 6: Final Integration
- Update learn/page.tsx metadata if needed
- Update sitemap
- Build test
- Git commit & push
- Verify deployment

---

## File Structure Reference

Each module follows this pattern (~300-450 lines):
- Educational content with sections
- Code examples (Rust/JS as appropriate)  
- Interactive elements (quizzes, try-it sections)
- Key takeaways
- Navigation to next module

Module component is a default export React component.
Uses: Container, SectionHeader, ScrollReveal, GlowCard, Card, etc.
