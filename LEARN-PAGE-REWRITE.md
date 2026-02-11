# Voidspace /learn Page — Complete Rewrite Plan

**Goal:** Transform /learn from a 22,600px marketing brochure into a world-class, SEO-dominant blockchain education hub that captures Rust developers from NEAR, Solana, and beyond.

**Philosophy:** Stop selling, start teaching. Get users DOING something in under 5 minutes. Earn trust with real data. Harvest the Solana Rust audience.

---

## PHASE 1 — TRUST & CRITICAL FIXES
**Priority:** P0 — Do first, no dependencies
**Estimated effort:** 4-6 hours total

### 1.1 Remove all fake stats & testimonials
**File:** `components/SocialProof.tsx` (338 lines)
- [ ] Remove fake animated counter (2,858 builders, 389 projects shipped)
- [ ] Remove fictional testimonials (Sarah Chen, Marcus Johnson, Aisha Okafor)
- [ ] Replace with REAL verifiable NEAR ecosystem stats:
  - Total NEAR grants distributed (~$330M+ from NEAR Foundation — verifiable)
  - Active NEAR developers (~3,000+ monthly — from Electric Capital report)
  - Average transaction cost (<$0.01 — verifiable on-chain)
  - Transaction finality (1-2 seconds — verifiable)
- [ ] Replace testimonials with:
  - "Early Access" / "Join the first cohort" messaging
  - Real quotes from NEAR community (pull from Twitter/Discord if available)
  - Or honest: "Built for Nearcon 2026 Innovation Sandbox — be among the first to learn"

### 1.2 Fix zero counters in Social Proof
**File:** `components/SocialProof.tsx`
- [ ] The animated counters show $0M+, 0 Projects, 0 Grants, 0hrs — intersection observer or data source broken
- [ ] Either fix the animation trigger OR replace with static real numbers
- [ ] Test: counters should display correctly on first page load without requiring scroll

### 1.3 Fix OG meta tags (page-specific)
**File:** `page.tsx` metadata export + `layout.tsx` if needed
- [ ] `og:title` → "Learn NEAR Protocol — Free Blockchain Developer Course | Voidspace"
- [ ] `og:description` → "Master Rust, build smart contracts, and ship dApps on NEAR Protocol. Free, self-paced, AI-powered learning tracks for beginners to advanced developers."
- [ ] `og:url` → "https://voidspace.io/learn"
- [ ] Create a dedicated OG image for /learn (not the generic Voidspace one)
- [ ] `twitter:title` and `twitter:description` — match OG tags
- [ ] Add canonical URL: `<link rel="canonical" href="https://voidspace.io/learn" />`

### 1.4 Fix heading hierarchy (SEO)
**Files:** Multiple components
- [ ] Page currently has 20 H2s — SEO dilution. Reduce to 8-10 max.
- [ ] Pattern to fix: most sections have badge H2 + subtitle H2. The subtitle should be `<p className="text-xl">` not `<h2>`.
- [ ] Sections with double H2s to fix:
  - KeyTechnologies: "Key NEAR Technologies" + "Not Just Another L1..."
  - WhyRust: "Why Rust?" + "The Most Loved Language..."
  - RustCurriculum: "Rust for NEAR" + "From Zero Rust to Mainnet..."
  - EcosystemMap: "NEAR Ecosystem Map" + "6 Sectors. 114+ Open Voids..."
  - ProjectTemplates: "Project Templates" + "Production-Ready Templates..."
  - ResourceHub: "Resources" + "Everything You Need..."

### 1.5 Add Founder Track card
**File:** `components/LearningTracks.tsx` (539 lines)
- [ ] Add 4th track card: 🟣 Founder Track
  - Subtitle: "I want to build a business on NEAR"
  - Description: "Turn your dApp into a real business. Learn tokenomics design, revenue models, grant applications, pitching, and building in public."
  - Level: Advanced | ~6 hours | 5 modules
- [ ] Link to existing founder modules (already built: BuildingInPublic, NearGrantsFunding, PitchingYourProject, RevenueModelsForDapps, TokenomicsDesign)
- [ ] Consider placing Builder + Founder side by side as "MOST POPULAR" row

---

## PHASE 2 — PAGE RESTRUCTURE (The Big Split)
**Priority:** P1 — Depends on Phase 1 completion
**Estimated effort:** 8-12 hours total

### 2.1 Redesign /learn hub page (cut from 22,600px to ~8,000px)
**File:** `page.tsx` — rewrite the section order
New structure:
```
1. HeroSection (keep — maybe tweak copy)
2. SocialProof (fixed in Phase 1)
3. LearningTracks (with Founder track added) ← THE MAIN EVENT
4. SkillTreeCTA (NEW — small card, not full tree)
5. VoidBriefSection (keep "How AI Creates Your Void Brief")
6. EcosystemMap (keep — shows opportunity)
7. ProjectTemplates (keep — actionable)
8. ResourceHub (keep — reference value)
9. BottomCTA (keep)
```
**REMOVED from hub page (moved to standalone):**
- WalletSetup → `/learn/wallet-setup`
- WhyRust → `/learn/why-rust`
- RustCurriculum → `/learn/rust-curriculum`
- KeyTechnologies → `/learn/near-technologies`
- "What is NEAR Protocol?" inline section → `/learn/what-is-near`
- SkillTree (full) → `/profile` (skill tree tab)

### 2.2 Create `/learn/wallet-setup` standalone page
**New file:** `src/app/learn/wallet-setup/page.tsx`
- [ ] Move WalletSetup component (1,015 lines) to its own route
- [ ] Add proper metadata: "How to Set Up a NEAR Wallet — Complete Guide | Voidspace"
- [ ] Target keywords: "NEAR wallet setup", "create NEAR wallet", "best NEAR wallet"
- [ ] Add structured data: HowTo schema
- [ ] Add breadcrumb: Home > Learn > Wallet Setup
- [ ] Internal link back to /learn hub and to Explorer Track Module 3

### 2.3 Create `/learn/why-rust` standalone page
**New file:** `src/app/learn/why-rust/page.tsx`
- [ ] Move WhyRust component (1,023 lines) to its own route
- [ ] Metadata: "Why Rust for Blockchain Development — Smart Contracts Guide | Voidspace"
- [ ] Target keywords: "why Rust for blockchain", "Rust vs Solidity", "Rust smart contracts"
- [ ] THIS IS THE SOLANA BRIDGE — content should be chain-agnostic, mentioning NEAR AND Solana
- [ ] Add salary comparison data, developer survey stats (these are real, linkable)
- [ ] Structured data: Article schema with author (Voidspace)

### 2.4 Create `/learn/rust-curriculum` standalone page
**New file:** `src/app/learn/rust-curriculum/page.tsx`
- [ ] Move RustCurriculum component (1,170 lines) to its own route
- [ ] Metadata: "Rust for Blockchain — Complete Curriculum | Voidspace"
- [ ] Target keywords: "learn Rust for blockchain", "Rust blockchain tutorial", "Rust smart contract course"
- [ ] Modules 1-7 should be chain-agnostic (this is generic Rust)
- [ ] Modules 8-10 branch into NEAR-specific deployment
- [ ] Add "Also applicable to: Solana, Polkadot, Cosmos" note on chain-agnostic modules
- [ ] Each module card should link to actual interactive content in Sanctum

### 2.5 Create `/learn/near-technologies` standalone page
**New file:** `src/app/learn/near-technologies/page.tsx`
- [ ] Move KeyTechnologies component (558 lines) + the inline "What is NEAR?" section
- [ ] Metadata: "NEAR Protocol Technologies — Chain Abstraction, Intents, Sharding | Voidspace"
- [ ] Target keywords: "NEAR Protocol explained", "what is chain abstraction", "NEAR sharding"
- [ ] Expand the "What is NEAR?" paragraph into a full intro section
- [ ] Structured data: TechArticle schema

### 2.6 Add Sticky Table of Contents to /learn hub
**New file:** `components/TableOfContents.tsx`
- [ ] Floating sidebar (desktop) / sticky top bar (mobile) showing:
  - Tracks | Skills | AI Briefs | Ecosystem | Templates | Resources
- [ ] Highlight current section on scroll (intersection observer)
- [ ] Click to smooth-scroll to section
- [ ] Collapse on mobile to a hamburger or pill bar

### 2.7 Add structured data to /learn hub
**File:** `page.tsx` or new `learn-jsonld.tsx`
- [ ] `Course` schema for each learning track (Explorer, Builder, Hacker, Founder)
- [ ] `BreadcrumbList`: Home > Learn
- [ ] `ItemList` for the tracks
- [ ] `FAQPage` schema — add an FAQ section or invisible structured data:
  - "Is Voidspace free?" → "Yes, all tracks are free, self-paced, and AI-assisted."
  - "Do I need to know Rust?" → "No, the Explorer track requires zero coding knowledge."
  - "How long does it take?" → "Explorer: ~4 hours. Builder: ~20 hours..."
  - "Can I use this to learn Solana too?" → "Yes, Rust fundamentals (Modules 1-7) apply to any Rust-based blockchain."

### 2.8 Replace SkillTree on /learn with CTA card
**New file:** `components/SkillTreeCTA.tsx` (~80 lines)
- [ ] Small, sexy card with a preview of the constellation graphic (static or mini animation)
- [ ] Copy: "Track Your Journey Through the Constellation of Skills"
- [ ] Subtext: "Earn XP, unlock achievements, and level up from Observer to Master Builder"
- [ ] Button: "View Your Skill Tree →" linking to /profile#skills (or /profile?tab=skills)
- [ ] Show current rank if wallet connected, or "Connect wallet to start" if not

---

## PHASE 3 — THE SOLANA HARVEST
**Priority:** P1 — Can run parallel with Phase 2
**Estimated effort:** 6-8 hours total

### 3.1 Create `/learn/rust-for-blockchain` (SEO magnet page)
**New file:** `src/app/learn/rust-for-blockchain/page.tsx`
- [ ] THE flagship SEO page. Targets: "learn Rust for blockchain" (1,200/mo), "Rust blockchain development" (890/mo)
- [ ] Content structure:
  1. Why Rust dominates blockchain (real stats from Stack Overflow survey, Electric Capital)
  2. Which blockchains use Rust (NEAR, Solana, Polkadot, Cosmos, Aptos — with logos)
  3. Rust fundamentals roadmap (link to our curriculum)
  4. Chain-specific paths (NEAR path highlighted, Solana path acknowledged)
  5. CTA: "Start the Rust Curriculum" → `/learn/rust-curriculum`
- [ ] Metadata: "Learn Rust for Blockchain Development — Free Course | Voidspace"
- [ ] This page captures EVERYONE learning Rust for ANY chain

### 3.2 Create `/learn/solana-vs-near` (comparison page)
**New file:** `src/app/learn/solana-vs-near/page.tsx`
- [ ] Honest, fair comparison that naturally highlights NEAR advantages
- [ ] Sections:
  1. Overview (both are Rust-based L1s)
  2. Developer Experience comparison (NEAR wins: named accounts, simpler deployment)
  3. Transaction model (Solana: fees vary; NEAR: predictable, <$0.01)
  4. Smart contract model (Solana: programs; NEAR: contracts with state)
  5. Ecosystem maturity (Solana: larger; NEAR: more grant opportunities = less competition)
  6. Chain Abstraction (NEAR's killer feature Solana doesn't have)
  7. "Your Rust skills transfer 80%" — migration is easy
  8. CTA: "Already know Solana? Start the Hacker Track" → Builder/Hacker track
- [ ] Metadata: "Solana vs NEAR Protocol for Developers — 2026 Comparison | Voidspace"
- [ ] Target: "Solana vs NEAR" (890/mo), "NEAR vs Solana" (same)

### 3.3 Create `/learn/for-solana-developers` (migration guide)
**New file:** `src/app/learn/for-solana-developers/page.tsx`
- [ ] "NEAR for Solana Developers" — fast-track guide
- [ ] Sections:
  1. "You already know 80% of what you need" (Rust skills transfer)
  2. Key differences: Accounts, state, gas, deployment
  3. "Port your first Solana program to NEAR in 30 minutes" (guided walkthrough)
  4. Why add NEAR to your toolkit (chain abstraction, grants, less competition)
  5. Quick reference table: Solana concept → NEAR equivalent
- [ ] CTA: "Start the Hacker Track" (for experienced devs)
- [ ] Metadata: "NEAR Protocol for Solana Developers — Migration Guide | Voidspace"

### 3.4 Update Rust curriculum for chain-agnostic modules
**Files:** `components/RustCurriculum.tsx` + individual module files
- [ ] Modules 1-7 (Variables, Ownership, Structs, Errors, Collections, Traits, Smart Contract Basics):
  - Remove NEAR-specific references from descriptions
  - Add note: "These fundamentals apply to NEAR, Solana, Polkadot, and any Rust-based chain"
- [ ] Module 8+ keep NEAR-specific but add: "Coming from Solana? See our migration guide"
- [ ] Add "Applicable to:" badges on each module card (🟢 NEAR 🟣 Solana 🔵 Polkadot)

### 3.5 "I Already Know Crypto" button → smart routing
**File:** `components/HeroSection.tsx`
- [ ] Currently the button does nothing meaningful
- [ ] On click → show a quick selector:
  - "I'm a developer" → Hacker Track
  - "I know Solana" → `/learn/for-solana-developers`
  - "I know Ethereum/Solidity" → Builder Track (Rust from scratch, but skip blockchain basics)
  - "I understand crypto but can't code" → Builder Track Module 1
- [ ] This respects experienced users' time and prevents bounces

---

## PHASE 4 — ENGAGEMENT & GAMIFICATION
**Priority:** P2 — Depends on Phase 2 (page split) completion
**Estimated effort:** 10-14 hours total

### 4.1 Move Skill Tree to /profile
**Files:** Move `components/SkillTree.tsx` (1,490 lines) → `src/components/profile/SkillTree.tsx`
- [ ] Add as a tab/section on the profile page
- [ ] Skill tree only activates when wallet is connected
- [ ] Skills map to actual module completions (stored in localStorage or on-chain)
- [ ] The constellation visualization becomes the centerpiece of the profile
- [ ] Add: leaderboard snippet ("You're rank #47 of 312 builders")
- [ ] Add: "Share your progress" button → generates a shareable OG card image

### 4.2 Add Quick Start interactive experience
**New file:** `components/QuickStart.tsx` (embed in HeroSection or first module)
- [ ] The "tell your friends" moment — 3-minute guided experience:
  1. Click "Start Learning" → inline interactive begins
  2. Step 1: "Let's create a testnet wallet" (guided NEAR testnet account creation)
  3. Step 2: "Here's 10 testNEAR" (automatic faucet)
  4. Step 3: "Send 1 NEAR to voidspace.testnet" (they click, it happens)
  5. Step 4: 🎉 Confetti + "You just used a blockchain. That took 3 minutes."
  6. "Ready for more?" → Choose Your Track
- [ ] This can be a v2 feature if too complex now — but even a SIMULATED version (showing what the flow looks like) adds massive engagement

### 4.3 Sanctum AI preview on /learn
**New file:** `components/SanctumPreview.tsx`
- [ ] Show a mock conversation demonstrating the AI tutor:
  ```
  User: "I don't understand ownership in Rust"
  Sanctum: "Think of it like passing a book to a friend..."
  ```
- [ ] Animated typing effect to make it feel alive
- [ ] CTA: "Try asking Sanctum anything about NEAR →" (links to /sanctum)
- [ ] Position: below the tracks section, above ecosystem map

### 4.4 Certificate system
**New files:** `src/app/certificate/[id]/page.tsx` + certificate generation logic
- [ ] On completing a track → generate a "NEAR Certified Explorer/Builder/Hacker/Founder" certificate
- [ ] Downloadable as PNG/PDF
- [ ] Shareable URL: `voidspace.io/certificate/[unique-id]`
- [ ] OG tags on certificate page for social sharing
- [ ] Stretch: on-chain attestation (mint an SBT on NEAR)
- [ ] This costs us nothing but massively increases completion motivation

### 4.5 Capstone projects for each track
**Update track descriptions + add capstone module to each track**
- [ ] Explorer capstone: "Build a personal NEAR portfolio page" (static site showing your .near account, balances, recent transactions)
- [ ] Builder capstone: "Deploy a working FT or NFT contract on testnet"
- [ ] Hacker capstone: "Build a cross-contract call dApp"
- [ ] Founder capstone: "Complete a grant application with live prototype"
- [ ] Show the finished capstone project at the TOP of each track: "By the end, you'll have built THIS"

### 4.6 Community / social layer
**New file:** `components/CommunityBanner.tsx`
- [ ] Add Discord/Telegram community link prominently
- [ ] Live activity feed: "Builder #847 just completed Rust Fundamentals" (can be simulated initially from real module completion events)
- [ ] "X builders learning right now" counter (websocket or polling)
- [ ] Place between tracks and Skill Tree CTA on /learn hub

---

## PHASE 5 — SEO DOMINATION & POLISH
**Priority:** P2 — Final polish after all content is in place
**Estimated effort:** 4-6 hours

### 5.1 Internal linking strategy
- [ ] Every standalone page links back to /learn hub
- [ ] Every standalone page links to 2-3 other standalone pages
- [ ] Track pages link to relevant standalone content (e.g., Builder Track → Why Rust, Rust Curriculum)
- [ ] Module pages link to relevant standalone content
- [ ] Add "Related Content" section at bottom of each standalone page

### 5.2 XML sitemap update
- [ ] Ensure all new /learn/* routes are in sitemap.xml
- [ ] Set priority: /learn = 0.9, /learn/rust-for-blockchain = 0.8, sub-pages = 0.7
- [ ] Set changefreq: weekly for learn pages

### 5.3 Performance optimization
- [ ] Lazy load below-fold sections (intersection observer)
- [ ] The 420 inline SVGs need audit — consider sprite sheet or icon font
- [ ] Measure Core Web Vitals (LCP, FID, CLS) after restructure
- [ ] Target: LCP < 2.5s, CLS < 0.1

### 5.4 Create dedicated OG images
- [ ] /learn hub: "Learn NEAR Protocol" branded image
- [ ] /learn/why-rust: Rust + blockchain themed
- [ ] /learn/solana-vs-near: Side-by-side comparison visual
- [ ] /learn/rust-for-blockchain: Rust logo + chain logos
- [ ] Can use nano-banana-pro or a simple template

### 5.5 Add FAQ section to /learn hub
- [ ] Visible FAQ accordion at bottom (above BottomCTA)
- [ ] Questions that target featured snippets:
  - "Is learning NEAR Protocol free?"
  - "How long does it take to learn NEAR?"
  - "Do I need to know Rust to build on NEAR?"
  - "Can I learn Rust for Solana and NEAR at the same time?"
  - "What can I build on NEAR Protocol?"
- [ ] Backed by FAQPage structured data (Phase 2.7)

---

## SUMMARY

| Phase | Focus | Hours | New Pages | Key Outcome |
|-------|-------|-------|-----------|-------------|
| 1 | Trust & Fixes | 4-6h | 0 | Credible, functional page |
| 2 | Page Restructure | 8-12h | 4 new routes | Fast hub + SEO sub-pages |
| 3 | Solana Harvest | 6-8h | 3 new routes | Capture Rust/Solana devs |
| 4 | Engagement | 10-14h | 2+ new routes | Gamification + retention |
| 5 | SEO Polish | 4-6h | 0 | Rank #1 for target keywords |
| **Total** | | **32-46h** | **9 new routes** | **SEO-dominant education hub** |

## NEW URL STRUCTURE (after all phases)
```
/learn                          — Hub page (fast, scannable)
/learn/wallet-setup             — Full wallet setup guide
/learn/why-rust                 — Why Rust for blockchain (Solana bridge)
/learn/rust-curriculum          — Complete Rust course
/learn/near-technologies        — NEAR tech deep dive
/learn/rust-for-blockchain      — Chain-agnostic Rust SEO magnet
/learn/solana-vs-near           — Comparison page
/learn/for-solana-developers    — Migration guide
/learn/explorer/[slug]          — Explorer track modules (existing)
/learn/builder/[slug]           — Builder track modules (existing, needs route)
/learn/hacker/[slug]            — Hacker track modules (existing, needs route)
/learn/founder/[slug]           — Founder track modules (existing, needs route)
/profile#skills                 — Skill Tree constellation
/certificate/[id]               — Shareable completion certificates
```

## EXECUTION NOTES
- Each phase can be assigned to an Opus sub-agent
- Phases 1 + 2 are sequential (2 depends on 1)
- Phase 3 can run parallel with Phase 2
- Phases 4 + 5 depend on Phase 2 completion
- All phases: commit and push after each phase, verify build passes
- Use real NEAR data wherever possible — link sources
