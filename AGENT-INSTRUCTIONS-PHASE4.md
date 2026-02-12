# Phase 4: Engagement & Gamification — Agent Instructions

## Overview
Add engagement and gamification features to the Learn page that make users want to complete tracks and share their progress. This phase transforms passive content into an interactive learning platform.

## Project Location
`/home/ubuntu/.openclaw/workspace/projects/Voidspace`

## CRITICAL RULES
- **ALL data must be verifiable.** Nearcon Innovation Sandbox judges (NEAR team) will review. Zero hallucinated stats, testimonials, or claims.
- **The build tool is called "Sanctum"** — NEVER "Forge."
- **Follow the Voidspace design system exactly.** Match existing component patterns.
- **Zero new TypeScript errors.** Existing lucide-react icon errors are pre-existing — ignore them, don't add new ones.
- Commit and push when done.

## Design System Reference
- **UI Components:** `@/components/ui` — Container, Card, Button, Badge, Progress, Input
- **Effects:** `@/components/effects` — ScrollReveal, SectionHeader, GlowCard, GradientText, AnimatedCounter, TiltCard, StaggeredList, GridPattern
- **Colors:** `text-near-green` (primary accent), `text-text-primary`, `text-text-secondary`, `text-text-muted`, `bg-surface`, `bg-surface-hover`, `border-border`
- **Accent colors:** `accent-cyan`, `accent-purple`, `accent-orange` (use sparingly for different tracks)
- **Cards:** `<Card variant="glass" padding="lg">` for glass-morphism sections
- **Glow cards:** `<GlowCard>` for interactive/hoverable items
- **Animations:** framer-motion (`motion.div`), use existing patterns from learn modules
- **Client components:** Add `'use client'` only when using hooks/interactivity
- **Canonical URL base:** `https://voidspace.io`

## Existing Architecture
- **Learn page:** `src/app/learn/page.tsx` — main hub with deep dive cards, learning tracks, etc.
- **SkillTree component:** `src/app/learn/components/SkillTree.tsx` (1,490 lines) — already built with constellation visualization, nodes, connections, XP system
- **Profile page:** `src/app/profile/page.tsx` → `src/components/profile/ProfileContent.tsx` (309 lines)
- **Profile components:** `src/components/profile/` — BuilderProfileCard, QuickActionsBar, VoidMissionCard
- **Sanctum page:** `src/app/sanctum/page.tsx` (843 lines) — AI build assistant
- **Learning tracks:** Explorer (11 modules), Builder (16 modules), Hacker (11 modules), Founder (5 modules) = 43 total
- **Module layout example:** `src/app/learn/explorer/[slug]/ExplorerModuleLayout.tsx` — shared layout for modules

## Tasks

### Task 4.1 — Skill Tree Constellation on /profile
Move the SkillTree from being a hidden component on /learn to being THE centerpiece of /profile.

**What to build:**
1. Create `src/app/profile/skills/page.tsx` — dedicated `/profile/skills` route
2. Create `src/app/profile/skills/SkillConstellation.tsx` — enhanced version of SkillTree:
   - Full-page constellation visualization (not crammed into a card)
   - 4 track "galaxies" — Explorer (blue), Builder (green), Hacker (purple), Founder (orange)
   - Each module is a "star" node that lights up when completed
   - Connections between prerequisites shown as constellation lines
   - Hover on a star → tooltip with module name, estimated time, XP reward
   - Click a star → navigates to the module
   - Progress counter: "X/43 modules completed" with animated ring
   - XP total and "level" based on progress
   - Uses localStorage to track completed modules (no backend needed)
3. Update `/profile/page.tsx` to include a prominent link/card to `/profile/skills`

**XP & Leveling (client-side, localStorage):**
- Each module: 50-200 XP based on difficulty
- Explorer modules: 50 XP each
- Builder modules: 100 XP each  
- Hacker modules: 150 XP each
- Founder modules: 100 XP each
- Levels: Cadet (0), Astronaut (500), Pilot (1500), Commander (3000), Admiral (5000), Legend (7000+)

**IMPORTANT:** Use the existing SkillTree component as reference for the node data structure and connections. Enhance it, don't rebuild from scratch. The existing SkillTree has all the skill nodes, connections, XP values, and tier data.

### Task 4.2 — Quick Start Interactive
Create a "Your First Transaction in 3 Minutes" interactive walkthrough on the learn page.

**What to build:**
1. Create `src/app/learn/quick-start/page.tsx` — standalone route `/learn/quick-start`
2. Create `src/app/learn/quick-start/QuickStart.tsx` — step-by-step interactive guide:
   - **Step 1:** "Create a Testnet Wallet" — link to wallet.testnet.near.org, animated progress indicator
   - **Step 2:** "Get Testnet NEAR" — link to NEAR faucet (near-faucet.io), show wallet balance concept
   - **Step 3:** "Make Your First Transfer" — guide them to send testnet NEAR
   - **Step 4:** "See It On-Chain" — link to nearblocks.io explorer, show them how to find their tx
   - **Step 5:** "You're On-Chain! 🎉" — celebration animation, share buttons, "What's Next?" links
   
   Each step should:
   - Have a numbered progress bar at top
   - Have clear instructions with screenshots/diagrams (use placeholder illustrations with CSS)
   - Have a "Mark as Complete" button that saves to localStorage
   - Animate transition between steps
   - Include a "Pro Tip" callout in each step

3. Add a prominent Quick Start CTA to the learn page hero section or near the top

### Task 4.3 — Sanctum AI Preview on /learn
Add a compact Sanctum preview/teaser on the main learn page that shows what the AI build assistant can do.

**What to build:**
1. Create `src/app/learn/components/SanctumPreview.tsx`:
   - Compact card/section on the learn page
   - Shows a mock "conversation" with Sanctum (3-4 message bubbles):
     - User: "I want to build a DEX on NEAR"
     - Sanctum: gives a brief, impressive response about project architecture
   - Animated typing effect for the Sanctum response
   - "Try Sanctum →" CTA button linking to `/sanctum`
   - Styled like a mini terminal/chat window with the Voidspace aesthetic
2. Add it to the learn page between appropriate sections (after Learning Tracks, before Deep Dives)

### Task 4.4 — Certificate System
Create a shareable certificate that users earn when completing a track.

**What to build:**
1. Create `src/app/learn/certificate/page.tsx` — route `/learn/certificate`
2. Create `src/app/learn/certificate/Certificate.tsx`:
   - Shows available certificates for each completed track
   - Certificate design: sleek card with:
     - "NEAR Certified [Track Name]" title
     - Voidspace + NEAR branding
     - User's wallet address or name (from localStorage or input)
     - Completion date
     - Track summary (X modules, Y XP earned)
     - Unique certificate ID (generated hash)
   - "Share" buttons: copy image, share to X/Twitter
   - Certificate is rendered as a styled div (CSS-only, no canvas needed)
   - Uses localStorage to check which tracks are fully completed
   
**Track certificates:**
- **NEAR Explorer** — "You understand the NEAR ecosystem"
- **NEAR Builder** — "You can build and deploy smart contracts"
- **NEAR Hacker** — "You've mastered advanced NEAR development"
- **NEAR Founder** — "You know how to launch a NEAR project"
- **NEAR Legend** — Complete all 4 tracks (special golden certificate)

### Task 4.5 — Capstone Projects
Add capstone project descriptions at the end of each track — real projects users can build to prove their skills.

**What to build:**
1. Create `src/app/learn/components/CapstoneProjects.tsx`:
   - Section on the main learn page (or individual track pages) showing capstone projects
   - Each track gets 1-2 capstone project ideas:
   
   **Explorer Capstones:**
   - "Ecosystem Navigator" — Build a personal dashboard that tracks 5 NEAR dApps you use
   
   **Builder Capstones:**
   - "Token Launcher" — Deploy an NEP-141 fungible token with a simple frontend
   - "Mini DAO" — Build a basic voting contract with proposal creation
   
   **Hacker Capstones:**
   - "Cross-Chain Oracle" — Build a contract that uses Chain Signatures to verify data from another chain
   - "Indexer Dashboard" — Create a custom indexer for a specific NEAR contract
   
   **Founder Capstones:**
   - "Pitch Deck + Demo" — Create a complete project pitch with a deployed testnet demo
   
   Each capstone card shows:
   - Project name and description
   - Difficulty rating (1-5 stars)
   - Estimated time
   - Skills demonstrated
   - "Start Project" link → relevant resources/modules
   
2. Add the capstone section to the learn page (after Learning Tracks or after Deep Dives)

### Task 4.6 — Update Main Learn Page
Integrate all new components into the learn page flow:

1. Add Quick Start CTA near the hero (prominent, eye-catching)
2. Add SanctumPreview after Learning Tracks section
3. Add CapstoneProjects section
4. Add Certificate teaser ("Earn Your Certificate" card linking to /learn/certificate)
5. Update the TableOfContents with new section anchors
6. Keep the page flow logical and not overwhelming

## Build Verification
Before committing:
```bash
cd /home/ubuntu/.openclaw/workspace/projects/Voidspace
npx next build 2>&1 | tail -30
```
Fix any errors. Existing lucide-react icon errors are acceptable — don't introduce NEW ones.

## Commit
```bash
git add -A
git commit -m "Phase 4: Engagement & Gamification — Skill constellation, Quick Start, Sanctum preview, certificates, capstones"
git push origin main
```

## Summary Checklist
- [ ] `/profile/skills/page.tsx` + `SkillConstellation.tsx` — full constellation visualization with XP/leveling
- [ ] `/learn/quick-start/page.tsx` + `QuickStart.tsx` — 5-step interactive walkthrough
- [ ] `SanctumPreview.tsx` — AI assistant teaser on learn page
- [ ] `/learn/certificate/page.tsx` + `Certificate.tsx` — shareable track certificates
- [ ] `CapstoneProjects.tsx` — capstone project cards for each track
- [ ] Main learn page updated with all new sections
- [ ] TableOfContents updated
- [ ] Build passes, committed, pushed
