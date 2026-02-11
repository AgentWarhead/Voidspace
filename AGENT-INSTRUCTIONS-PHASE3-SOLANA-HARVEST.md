# Phase 3: The Solana Harvest — Agent Instructions

## Overview
Create 3 NEW standalone routes that capture Rust/blockchain learners searching for Solana content and funnel them into the NEAR ecosystem. These are SEO-targeted pages that position Voidspace as THE place to learn Rust for blockchain — not just NEAR.

## Project Location
`/home/ubuntu/.openclaw/workspace/projects/Voidspace`

## CRITICAL RULES
- **ALL data must be verifiable.** Nearcon Innovation Sandbox judges (NEAR team) will review. Zero hallucinated stats, testimonials, or claims. Every fact must be traceable to a public source.
- **Never call the build tool "Forge"** — it's called **Sanctum**.
- **Follow the Voidspace design system exactly.** Match existing components' patterns.
- **Zero new TypeScript errors.** Existing lucide-react icon errors are pre-existing — don't fix them, don't add new ones.
- Commit and push when done.

## Design System Reference
- **UI Components:** `@/components/ui` — Container, Card, Button, Badge, Progress, Input
- **Effects:** `@/components/effects` — ScrollReveal, SectionHeader, GlowCard, GradientText, AnimatedCounter, TiltCard, StaggeredList, GridPattern
- **Colors:** `text-near-green` (primary accent), `text-text-primary`, `text-text-secondary`, `text-text-muted`, `bg-surface`, `bg-surface-hover`, `border-border`
- **Accent colors:** `accent-cyan`, `accent-purple`, `accent-orange` (use sparingly)
- **Cards:** `<Card variant="glass" padding="lg">` for glass-morphism sections
- **Glow cards:** `<GlowCard>` for interactive/hoverable items
- **Animations:** framer-motion (`motion.div`), use existing patterns from explorer/builder modules
- **Client components:** Add `'use client'` only when using hooks/interactivity
- **Canonical URL base:** `https://voidspace.io`

## Standalone Route Page Pattern
Follow this exact pattern (see `/learn/why-rust/page.tsx` for reference):
```tsx
import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
// import your component

export const metadata: Metadata = {
  title: '...',
  description: '...',
  keywords: '...',  // SEO keywords targeting Solana/Rust searches
  alternates: { canonical: 'https://voidspace.io/learn/...' },
  openGraph: { ... },
  twitter: { ... },
};

export default function PageName() {
  return (
    <div className="min-h-screen">
      {/* BreadcrumbList JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({...}) }} />
      
      {/* Back nav + breadcrumbs */}
      <Container className="pt-8 pb-4">
        <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-near-green transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Learn
        </Link>
        <nav className="mt-2 text-xs text-text-muted">
          <Link href="/learn" className="hover:text-near-green">Learn</Link>
          <span className="mx-1">›</span>
          <span className="text-text-secondary">Page Title</span>
        </nav>
      </Container>
      
      {/* Main content */}
      <Container className="pb-20">
        <YourComponent />
      </Container>
    </div>
  );
}
```

## The 3 Routes to Build

### Route 1: `/learn/rust-for-blockchain` — THE SEO Magnet
**File:** `src/app/learn/rust-for-blockchain/page.tsx`
**Component:** `src/app/learn/rust-for-blockchain/RustForBlockchain.tsx`

**Purpose:** Capture ALL "learn Rust for blockchain" search traffic. Chain-agnostic content that serves Solana, NEAR, Polkadot, and Cosmos developers — but naturally shows NEAR's advantages.

**SEO Keywords:** `learn Rust blockchain, Rust smart contract tutorial, Rust blockchain development, Rust web3, Rust Solana tutorial, Rust NEAR tutorial`

**Content Sections:**
1. **Hero:** "Rust: The Language of Secure Blockchains" — why every major chain is betting on Rust
2. **Chain-Agnostic Rust Modules (7 modules):**
   - Module 1: Ownership & Borrowing for Smart Contracts
   - Module 2: Error Handling in Blockchain Contexts
   - Module 3: Serialization (Borsh vs JSON vs MessagePack)
   - Module 4: Testing Smart Contracts
   - Module 5: Gas & Compute Optimization
   - Module 6: Security Patterns (reentrancy, overflow, access control)
   - Module 7: Cross-Contract Communication Patterns
   
   Each module should have a **"Works on"** badge row showing which chains use this pattern (NEAR ✓, Solana ✓, Cosmos ✓, etc.) — but NEAR should have extra detail/tips where relevant.
   
3. **"Which Chain Should You Build On?"** — honest comparison table:
   - NEAR: Human-readable accounts, async cross-contract calls, JS SDK alternative, sub-second finality
   - Solana: Raw speed, large DeFi ecosystem
   - Cosmos: Sovereign chains, IBC
   - Polkadot: Parachains, shared security
   
   Be honest but let NEAR's developer experience shine naturally.
   
4. **Start Building CTA** — links to `/learn/explorer` (beginners) and Builder track modules

**Interactive Elements:**
- Expandable module cards (click to reveal content)
- "Works on" chain badges with tooltips
- Animated code snippets showing Rust patterns

### Route 2: `/learn/solana-vs-near` — Honest Comparison
**File:** `src/app/learn/solana-vs-near/page.tsx`
**Component:** `src/app/learn/solana-vs-near/SolanaVsNear.tsx`

**Purpose:** Capture "Solana vs NEAR" comparison searches. Honest, fair, but shows NEAR's unique strengths. NOT a hit piece on Solana — respect both chains.

**SEO Keywords:** `Solana vs NEAR, NEAR vs Solana comparison, Solana developer experience, NEAR developer experience, which blockchain to build on`

**Content Sections:**
1. **Hero:** "Solana vs NEAR: An Honest Developer's Guide" — positioned as fair comparison by builders who respect both
2. **Side-by-Side Comparison Table** (interactive, toggleable categories):
   - **Architecture:** Solana (monolithic, proof-of-history) vs NEAR (sharded, Nightshade)
   - **Account Model:** Solana (public keys) vs NEAR (human-readable, named accounts)
   - **Smart Contract Language:** Both Rust. Solana = Anchor framework. NEAR = near-sdk-rs + optional JS SDK
   - **Transaction Costs:** Solana (~$0.00025) vs NEAR (~$0.001 but 30% to contract)
   - **Finality:** Solana (~400ms) vs NEAR (~1.4s)
   - **State Management:** Solana (accounts model, rent) vs NEAR (key-value storage, storage staking)
   - **Cross-Chain:** Solana (Wormhole) vs NEAR (Chain Signatures, Intents — native)
   - **Developer Tooling:** Compare SDKs, CLIs, testnet experience
   
   **ALL numbers must be real and sourced.** Use only publicly verifiable data.
   
3. **"I'm a Solana Developer, Why Should I Look at NEAR?"** section:
   - Chain Abstraction (build once, reach every chain)
   - Named accounts (alice.near vs 7Fy8...)
   - Storage staking vs rent (no data loss)
   - JavaScript SDK option
   - NEAR's AI focus (relevant for AI-agent builders)
   
4. **"I'm a NEAR Developer, What Can I Learn from Solana?"** section — fair play:
   - Solana's DeFi ecosystem maturity
   - Performance optimization patterns
   - Community-driven development
   
5. **Migration Quick Start** — link to Route 3

**Interactive Elements:**
- Toggleable comparison cards (click category to expand details)
- Animated architecture diagrams (Solana monolithic vs NEAR sharded — simple SVG-based)
- "My priorities" quiz: answer 3 questions → get recommendation (simple client-side logic)

### Route 3: `/learn/for-solana-developers` — Migration Fast-Track
**File:** `src/app/learn/for-solana-developers/page.tsx`
**Component:** `src/app/learn/for-solana-developers/ForSolanaDevelopers.tsx`

**Purpose:** Conversion page for Solana devs ready to try NEAR. Shows how their existing Rust knowledge transfers. NOT "abandon Solana" — position as "expand your toolkit."

**SEO Keywords:** `Solana developer NEAR, migrate Solana to NEAR, Solana Rust developer, NEAR for Solana devs, blockchain multi-chain developer`

**Content Sections:**
1. **Hero:** "NEAR for Solana Developers — Your Rust Skills Already Work Here" — welcoming, not competitive
2. **Skill Transfer Map** — visual showing Solana concepts → NEAR equivalents:
   - Program → Smart Contract
   - Account (data) → Contract State (key-value)
   - PDA → Sub-accounts
   - CPI → Cross-contract calls (async!)
   - Anchor macros → near_bindgen macros
   - Rent → Storage staking
   - Transaction → Receipt (important distinction)
   
3. **"Your First NEAR Contract in 10 Minutes"** — quick walkthrough:
   - Install NEAR CLI
   - Write a simple storage contract (show Anchor equivalent side-by-side)
   - Deploy to testnet
   - Call it
   All code must be real, working NEAR SDK code.
   
4. **Key Differences That Will Trip You Up:**
   - Async cross-contract calls (promises, not synchronous CPI)
   - Storage staking model (prepay storage, get refund when delete)
   - Account model (named accounts, access keys)
   - Gas model (prepaid gas, gas refunds)
   - No "rent" anxiety — your data stays forever if staked
   
5. **What You Gain** — NEAR-specific superpowers:
   - Chain Signatures: sign transactions on ANY chain from a NEAR contract
   - Intents: cross-chain operations without bridges
   - JavaScript SDK: prototype in JS, optimize in Rust later
   - Human-readable accounts for better UX
   
6. **Resources & Next Steps:**
   - Link to Builder track (`/learn/builder`)
   - Link to Rust Curriculum (`/learn/rust-curriculum`)
   - NEAR docs, Discord, examples repo
   - Sanctum (Voidspace's AI build assistant)

**Interactive Elements:**
- Animated "concept translator" — hover/click Solana concept → see NEAR equivalent with explanation
- Side-by-side code comparison cards (Anchor vs near-sdk)
- Quick quiz: "Test your NEAR knowledge" (5 questions, client-side)

## Integration with Main Learn Page

After creating the 3 routes, update the main `/learn/page.tsx`:

1. **Add to DEEP_DIVE_CARDS array** (or create a new "Solana Harvest" / "Cross-Chain" section):
   ```tsx
   {
     emoji: '🦀',
     title: 'Rust for Blockchain',
     description: 'Chain-agnostic Rust skills for any blockchain',
     href: '/learn/rust-for-blockchain',
     icon: Code2,  // from lucide-react
   },
   {
     emoji: '⚡',
     title: 'Solana vs NEAR',
     description: 'Honest comparison for developers',
     href: '/learn/solana-vs-near',
     icon: GitCompare,  // from lucide-react
   },
   {
     emoji: '🔄',
     title: 'For Solana Developers',
     description: 'Your Rust skills already work here',
     href: '/learn/for-solana-developers',
     icon: ArrowRightLeft,  // from lucide-react
   },
   ```

2. **Update TableOfContents** if needed to include a "Cross-Chain" section anchor.

## Also: Fix "I Already Know Crypto" Button
Find the existing "I Already Know Crypto" or similar button in the learn page/components and make it route intelligently:
- If beginner → Explorer track
- If knows crypto but not NEAR → `/learn/for-solana-developers` or Builder track
- If knows NEAR → Hacker track

This could be a simple modal/dropdown with 3 options.

## Structured Data
Add appropriate JSON-LD to each page:
- **BreadcrumbList** on all 3 pages (same pattern as existing)
- **Article** schema on `/learn/rust-for-blockchain` (educational article)
- **FAQPage** schema on `/learn/solana-vs-near` (the comparison naturally has FAQ-like content)

## Build Verification
Before committing:
```bash
cd /home/ubuntu/.openclaw/workspace/projects/Voidspace
npx next build 2>&1 | tail -30
```
Fix any errors (existing lucide-react icon errors are acceptable — don't introduce NEW ones).

## Commit
```bash
git add -A
git commit -m "Phase 3: Solana Harvest — 3 cross-chain SEO routes (rust-for-blockchain, solana-vs-near, for-solana-developers)"
git push origin main
```

## Summary Checklist
- [ ] `/learn/rust-for-blockchain/page.tsx` + `RustForBlockchain.tsx` — 7 chain-agnostic modules
- [ ] `/learn/solana-vs-near/page.tsx` + `SolanaVsNear.tsx` — honest comparison + quiz
- [ ] `/learn/for-solana-developers/page.tsx` + `ForSolanaDevelopers.tsx` — migration guide + code examples
- [ ] Main `/learn/page.tsx` updated with new Deep Dive cards
- [ ] "I Already Know Crypto" smart routing
- [ ] JSON-LD structured data on all 3 pages
- [ ] Build passes, committed, pushed
