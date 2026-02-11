# Phase 1 — Trust & Critical Fixes

You are an Opus sub-agent working on the Voidspace /learn page rewrite.
Your job: Execute Phase 1 ONLY. Do not touch anything outside Phase 1 scope.

**Project root:** `/home/ubuntu/workspace/projects/voidspace` (this is the correct absolute path — use it for all file operations)
**Reference plan:** `/home/ubuntu/workspace/projects/voidspace/LEARN-PAGE-REWRITE.md`

## CRITICAL RULES
- Do NOT use `process.exit()` anywhere — kills Vercel build worker
- Do NOT create fake data. All stats must be real and verifiable.
- Do NOT break the build. Run `npm run build` after ALL changes and fix any errors.
- Commit with a clear message when done.
- The build tool is Next.js. Components are in `src/app/learn/components/`.

## Task 1.1 — Fix SocialProof.tsx (remove fakes, add real stats)

**File:** `src/app/learn/components/SocialProof.tsx`

Remove:
- The fake animated builder counter (shows random incrementing numbers like "2,858 builders")
- The fake "389 Projects Shipped" counter
- All three fictional testimonials (Sarah Chen, Marcus Johnson, Aisha Okafor)
- The animated counter that shows "$0M+" and "0" for various stats (the intersection observer is broken)

Replace the stats section with REAL, verifiable NEAR ecosystem data (use static values, no broken animations):
- **$330M+** — "Grants Distributed by NEAR Foundation" (source: near.org/ecosystem/grants)
- **3,000+** — "Monthly Active Developers" (source: Electric Capital Developer Report 2025)
- **< $0.01** — "Average Transaction Cost" (source: on-chain data)
- **1-2s** — "Transaction Finality" (source: NEAR protocol specs)

Replace the testimonials section with an honest "early access" section:
- Headline: "Built for Nearcon Innovation Sandbox"
- Subtext: "Voidspace is the first AI-powered NEAR education platform. Be among the first builders to learn, build, and ship on NEAR Protocol."
- Include a small grid of what makes Voidspace different:
  - "AI-Powered" — Sanctum AI tutor answers your questions in real-time
  - "Free Forever" — All tracks, all modules, no paywall
  - "Learn by Building" — Ship real smart contracts, not just read about them
  - "Rust + NEAR" — The most in-demand blockchain skill set

Keep the visual design language (dark cards, green accents, glass effects) consistent with the rest of the site. Use the existing UI components (Card, etc.) from `@/components/ui`.

## Task 1.2 — Fix the zero counters

This is likely part of the same SocialProof.tsx issue. The animated number counters show 0 because:
- Either the intersection observer never triggers
- Or the target values are set to 0 / not initialized

Since we're replacing the fake stats with real static ones in Task 1.1, this should be resolved by using static display values instead of animated counters. If you keep any animation, make sure it works by:
1. Starting the animation on component mount (not just intersection)
2. Having fallback static values visible immediately

## Task 1.3 — Fix OG meta tags

**File:** `src/app/learn/page.tsx`

Update the `metadata` export to include page-specific OG tags:

```typescript
export const metadata: Metadata = {
  title: 'Learn NEAR Protocol — Free Blockchain Developer Course | Voidspace',
  description: 'Master Rust, build smart contracts, and ship dApps on NEAR Protocol. Free, self-paced, AI-powered learning tracks for beginners to advanced developers.',
  keywords: 'learn NEAR Protocol, NEAR developer tutorial, Rust smart contract tutorial, blockchain course free, Web3 developer guide, learn Rust blockchain, Solana Rust developer',
  alternates: {
    canonical: 'https://voidspace.io/learn',
  },
  openGraph: {
    title: 'Learn NEAR Protocol — Free Blockchain Developer Course | Voidspace',
    description: 'Master Rust, build smart contracts, and ship dApps on NEAR Protocol. Free, self-paced, AI-powered learning tracks.',
    url: 'https://voidspace.io/learn',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
    // Keep existing og:image for now — dedicated image comes in Phase 5
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn NEAR Protocol — Free Blockchain Developer Course | Voidspace',
    description: 'Master Rust, build smart contracts, and ship dApps. Free, AI-powered tracks from beginner to advanced.',
    creator: '@VoidSpaceNear',
  },
};
```

## Task 1.4 — Fix heading hierarchy

**Files:** Multiple components. The pattern to fix: each section currently has TWO `<h2>` tags — one from the `SectionHeader` component (the main title) and one subtitle that should be a `<p>`.

Check each of these components and convert the SUBTITLE h2 to a `<p>` or `<div>` with appropriate styling (keep it visually large but semantically correct):

1. **KeyTechnologies.tsx** — "Not Just Another L1 — The Chain Abstraction Layer" should be `<p className="text-xl md:text-2xl text-text-secondary font-light mt-2">`
2. **WhyRust.tsx** — "The Most Loved Language. The Safest Code. Your Unfair Advantage." → `<p>`
3. **RustCurriculum.tsx** — "From Zero Rust to Mainnet Deployment" → `<p>`
4. **EcosystemMap.tsx** — "6 Sectors. 114+ Open Voids. Your Opportunity Is NOW." → `<p>`
5. **ProjectTemplates.tsx** — "Production-Ready Templates. Clone, Customize, Deploy." → `<p>`
6. **ResourceHub.tsx** — "Everything You Need, Organized and Curated" → `<p>`

**Important:** Look at how the subtitle h2 is implemented. It might be:
- A direct `<h2>` tag
- Part of a SectionHeader component call
- A separate heading below SectionHeader

In each case, change it to a `<p>` with similar visual styling. Do NOT change the primary SectionHeader h2 — that one stays.

After fixes, the page should have approximately 8-10 H2s (one per major section), not 20.

## Task 1.5 — Add Founder Track card

**File:** `src/app/learn/components/LearningTracks.tsx`

Add a 4th track card for the Founder Track. Study the existing 3 cards (Explorer, Builder, Hacker) and match their exact structure and styling.

Founder Track details:
- Color: Purple (🟣) — use `purple-400` or `purple-500` for the accent
- Title: "Founder Track"
- Subtitle: "I want to build a business on NEAR"
- Description: "Turn your dApp into a real business. Learn tokenomics design, revenue models, grant applications, pitching, and building in public."
- Level: Advanced
- Duration: ~6 hours
- Modules: 5 modules
- Icon: Use a rocket 🚀 or briefcase 💼 emoji, matching the style of the other track icons (🟢🟡🔴)

The 5 modules (already built) are:
1. BuildingInPublic
2. NearGrantsFunding
3. PitchingYourProject
4. RevenueModelsForDapps
5. TokenomicsDesign

The "View All 5 Modules" button should work the same way as the other track buttons.

**Layout consideration:** With 4 cards, consider a 2x2 grid on desktop instead of the current 3-column layout, OR keep the horizontal scroll/flex but ensure the 4th card is visible without scrolling.

## VERIFICATION

After ALL changes:
1. `cd /home/ubuntu/workspace/projects/voidspace && npm run build`
2. If build fails, fix ALL errors
3. Verify no TypeScript errors: `npx tsc --noEmit`
4. Commit: `git add -A && git commit -m "Phase 1: Trust & critical fixes — real stats, OG tags, heading hierarchy, Founder track"`
5. Push: `git push`

Report back with:
- Summary of all changes made
- Build status (pass/fail)
- Any issues encountered
