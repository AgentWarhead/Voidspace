# Phase 5: SEO Domination + Module Routing Fix — Agent Instructions

## Overview
Two critical objectives:
1. **FIX MODULE ROUTING** — Builder, Hacker, and Founder tracks have 32 modules that are completely inaccessible (no URL routes). Only Explorer has proper `[slug]/page.tsx` routing. This is CRITICAL.
2. **SEO Domination** — Internal linking web, sitemap, performance, OG images, FAQ snippets.

## Project Location
`/home/ubuntu/.openclaw/workspace/projects/Voidspace`

## CRITICAL RULES
- **ALL data must be verifiable.** Nearcon Innovation Sandbox judges (NEAR team) will review.
- **The build tool is called "Sanctum"** — NEVER "Forge."
- **Follow the Voidspace design system exactly.**
- **Zero new TypeScript errors.** Existing lucide-react icon errors are pre-existing.
- Commit and push when done.

## Design System Reference
- **UI Components:** `@/components/ui` — Container, Card, Button, Badge, Progress, Input
- **Effects:** `@/components/effects` — ScrollReveal, SectionHeader, GlowCard, GradientText, TiltCard, StaggeredList, GridPattern
- **Colors:** `text-near-green`, `text-text-primary`, `text-text-secondary`, `text-text-muted`, `bg-surface`, `bg-surface-hover`, `border-border`
- **Client components:** Add `'use client'` only when using hooks/interactivity

---

## PART A: MODULE ROUTING FIX (PRIORITY — DO THIS FIRST)

### The Problem
Explorer track has proper routing via `src/app/learn/explorer/[slug]/page.tsx` + `ExplorerModuleLayout.tsx`. The other 3 tracks (Builder: 16 modules, Hacker: 11 modules, Founder: 5 modules) have component files but NO routing. Users cannot access these 32 modules via URL.

### The Solution
Create `[slug]/page.tsx` and a shared layout component for each track, following the Explorer pattern exactly.

### Reference: Explorer Pattern
Study these files carefully:
- `src/app/learn/explorer/[slug]/page.tsx` — Module registry, `generateStaticParams()`, `generateMetadata()`, page component
- `src/app/learn/explorer/[slug]/ExplorerModuleLayout.tsx` — Shared layout with breadcrumbs, prev/next navigation, progress bar, module component map

### Task A.1 — Builder Track Routing
Create `src/app/learn/builder/[slug]/page.tsx` and `src/app/learn/builder/[slug]/BuilderModuleLayout.tsx`

**Module registry for page.tsx** (16 modules, in order):
```
dev-environment-setup, rust-fundamentals, your-first-contract, account-model-access-keys,
state-management, near-cli-mastery, testing-debugging, frontend-integration,
token-standards, nep-standards-deep-dive, building-a-dapp, security-best-practices,
upgrading-contracts, deployment, optimization, launch-checklist
```

**BuilderModuleLayout.tsx must:**
- Import all 16 components from `../modules`
- Map slugs to components (same pattern as ExplorerModuleLayout)
- Show breadcrumbs: Learn › Builder Track › Module Title
- Show progress bar (current module X of 16)
- Show prev/next navigation buttons
- Link back to `/learn` (not `/learn/builder` since there's no builder index page)

**Module imports from `../modules/index.ts`:**
```typescript
import {
  DevEnvironmentSetup, RustFundamentals, YourFirstContract, AccountModelAccessKeys,
  StateManagement, NearCliMastery, TestingDebugging, FrontendIntegration,
  TokenStandards, NepStandardsDeepDive, BuildingADapp, SecurityBestPractices,
  UpgradingContracts, Deployment, Optimization, LaunchChecklist,
} from '../modules';
```

### Task A.2 — Hacker Track Routing
Create `src/app/learn/hacker/[slug]/page.tsx` and `src/app/learn/hacker/[slug]/HackerModuleLayout.tsx`

**Module registry** (11 modules, in order):
```
near-architecture-deep-dive, cross-contract-calls, advanced-storage, chain-signatures,
intents-chain-abstraction, shade-agents, ai-agent-integration, mev-transaction-ordering,
building-an-indexer, multi-chain-with-near, production-patterns
```

**Imports from `../modules/index.ts`:**
```typescript
import {
  NearArchitectureDeepDive, CrossContractCalls, AdvancedStorage, ChainSignatures,
  IntentsChainAbstraction, ShadeAgents, AiAgentIntegration, MevTransactionOrdering,
  BuildingAnIndexer, MultiChainWithNear, ProductionPatterns,
} from '../modules';
```

### Task A.3 — Founder Track Routing
Create `src/app/learn/founder/[slug]/page.tsx` and `src/app/learn/founder/[slug]/FounderModuleLayout.tsx`

**Module registry** (5 modules, in order):
```
near-grants-funding, tokenomics-design, building-in-public, pitching-your-project,
revenue-models-for-dapps
```

**Imports from `../modules/index.ts`:**
```typescript
import {
  NearGrantsFunding, TokenomicsDesign, BuildingInPublic, PitchingYourProject,
  RevenueModelsForDapps,
} from '../modules';
```

### Task A.4 — Update LearningTracks Component
Update `src/app/learn/components/LearningTracks.tsx` to make Builder, Hacker, and Founder module cards clickable links (like Explorer already is).

Currently Explorer modules link to `/learn/explorer/{slug}`. Add the same for:
- Builder modules → `/learn/builder/{slug}`
- Hacker modules → `/learn/hacker/{slug}`  
- Founder modules → `/learn/founder/{slug}`

Find where Explorer modules render as `<Link>` and replicate that pattern for the other tracks.

---

## PART B: SEO DOMINATION

### Task B.1 — Internal Linking Web
Create `src/app/learn/components/RelatedContent.tsx` — a reusable "Related Content" or "Continue Learning" section that can be added to module layouts.

**What it does:**
- Shows 2-3 related module cards at the bottom of each module page
- Cross-links between tracks (e.g., Explorer "What is NEAR?" links to Builder "Your First Contract")
- Each card: title, track badge, read time, link

Add this component to ALL 4 track layout components (ExplorerModuleLayout, BuilderModuleLayout, HackerModuleLayout, FounderModuleLayout).

**Cross-linking logic (simple mapping):**
- After Explorer modules → suggest first Builder module
- After Builder modules → suggest relevant Hacker module  
- After Hacker modules → suggest Founder module
- After Founder modules → suggest Explorer or Builder advanced modules
- Always include a "Back to All Tracks" link

### Task B.2 — Sitemap
Create or update `src/app/sitemap.ts` (Next.js App Router sitemap):

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://voidspace.io';
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/learn`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/learn/quick-start`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/learn/certificate`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/learn/rust-for-blockchain`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/learn/solana-vs-near`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/learn/for-solana-developers`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/learn/wallet-setup`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/learn/key-technologies`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/learn/why-rust`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/learn/rust-curriculum`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/profile/skills`, lastModified: new Date(), priority: 0.5 },
    // ... other existing pages
  ];
  
  // Dynamic module pages — all 43 modules
  // Explorer (11), Builder (16), Hacker (11), Founder (5)
  // Generate entries for each module
  
  return [...staticPages, ...modulePages];
}
```

Include ALL 43 module URLs with appropriate priority (0.6 for modules).

### Task B.3 — Performance: Lazy Loading
Review the main learn page (`src/app/learn/page.tsx`) and add dynamic imports for heavy below-the-fold components:

```typescript
import dynamic from 'next/dynamic';

const EcosystemMap = dynamic(() => import('./components/EcosystemMap'), { 
  loading: () => <div className="h-96 animate-pulse bg-surface rounded-xl" /> 
});
```

Apply to: EcosystemMap, ProjectTemplates, ResourceHub, CapstoneProjects, SanctumPreview — anything below the fold.

Keep above-the-fold components (HeroSection, SocialProof, LearningTracks) as static imports.

### Task B.4 — FAQ Section for Featured Snippets
The learn page already has FAQ structured data (JSON-LD). Enhance it:

1. Create `src/app/learn/components/FAQ.tsx` — visible FAQ section (not just JSON-LD)
   - Accordion-style expandable Q&A
   - 6-8 questions targeting featured snippets:
     - "Is this course free?"
     - "Do I need coding experience?"
     - "What is NEAR Protocol?"
     - "What will I be able to build?"
     - "How long does it take to complete?"
     - "Is Rust hard to learn?"
     - "How does NEAR compare to Solana?"
     - "What is Chain Abstraction?"
   - Each answer: 2-3 sentences, clear, factual
   - Match the existing FAQPage JSON-LD (update it if you add new questions)

2. Add FAQ section to the learn page (near the bottom, before BottomCTA)

### Task B.5 — Metadata Enhancement
Ensure every route has complete metadata:
- All 4 track `[slug]/page.tsx` files should have `generateMetadata()` with title, description, and keywords
- Add `robots` metadata where appropriate
- Ensure canonical URLs are set on all learn pages

---

## Build Verification
Before committing:
```bash
cd /home/ubuntu/.openclaw/workspace/projects/Voidspace
npx next build 2>&1 | tail -30
```

## Commit
```bash
git add -A
git commit -m "Phase 5: SEO Domination — module routing for all tracks, internal linking, sitemap, lazy loading, FAQ"
git push origin main
```

## Summary Checklist
- [ ] Builder `[slug]/page.tsx` + `BuilderModuleLayout.tsx` (16 modules routed)
- [ ] Hacker `[slug]/page.tsx` + `HackerModuleLayout.tsx` (11 modules routed)
- [ ] Founder `[slug]/page.tsx` + `FounderModuleLayout.tsx` (5 modules routed)
- [ ] LearningTracks updated with clickable links for all tracks
- [ ] RelatedContent.tsx cross-linking component
- [ ] sitemap.ts with all 43 modules + all pages
- [ ] Lazy loading for below-fold components
- [ ] FAQ.tsx visible accordion section
- [ ] Build passes, committed, pushed
