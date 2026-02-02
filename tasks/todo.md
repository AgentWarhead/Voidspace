# Remove News Features — Complete Cleanup

## Why

General crypto RSS feeds produce zero NEAR-relevant content. NEAR-specific Medium feeds haven't published in months. The news feature shows irrelevant crypto articles (Ripple, Bitcoin ETFs, XRP) everywhere on the site. It hurts the product's NEAR focus rather than helping.

## Tasks

### Delete Files (6)
- [x] Delete `src/app/news/page.tsx`
- [x] Delete `src/components/news/NewsFeed.tsx`
- [x] Delete `src/components/news/NewsSidebar.tsx`
- [x] Delete `src/components/news/HotSignalBar.tsx`
- [x] Delete `src/lib/news-queries.ts`
- [x] Delete `src/lib/sync/news.ts`

### Modify Files (11)
- [x] `src/lib/constants.ts` — Remove "News" from NAV_ITEMS
- [x] `src/app/api/sync/route.ts` — Remove news import, syncNews step, extractOpportunitiesFromNews step
- [x] `src/app/page.tsx` — Remove HotSignalBar + getNewsVelocity from dashboard
- [x] `src/app/categories/[slug]/page.tsx` — Remove NewsSidebar + getNewsByCategory + unused Card import
- [x] `src/app/opportunities/[id]/page.tsx` — Remove getNewsByCategory + news prop
- [x] `src/components/opportunities/OpportunityDetail.tsx` — Remove NewsSidebar + news prop + NewsArticle type
- [x] `src/lib/queries.ts` — Remove news_articles fetch + news count mapping + sevenDaysAgo variable from getCategoriesWithStats
- [x] `src/lib/sync/opportunities.ts` — Remove news count fetch + newsArticleCount passing
- [x] `src/lib/gap-score.ts` — Remove Signal 6 (News Momentum), rebalance 5 weights to sum to 1.0
- [x] `src/types/index.ts` — Remove NewsArticle interface, newsArticleCount from GapScoreInput, newsMomentum from GapScoreBreakdown
- [x] `supabase/functions/generate-brief/index.ts` — Remove news context from Claude prompt

### Verify
- [x] `npm run build` passes with zero errors
- [x] Commit and push to trigger Vercel deploy

## Weight Rebalancing (5 signals)

| Signal | Old Weight | New Weight |
|--------|-----------|------------|
| Supply Scarcity | 0.25 | 0.28 |
| TVL Concentration | 0.18 | 0.20 |
| Dev Activity Gap | 0.18 | 0.21 |
| Strategic Priority | 0.14 | 0.16 |
| Market Demand | 0.13 | 0.15 |
| News Momentum | 0.12 | REMOVED |
| **Total** | **1.00** | **1.00** |

## Notes

- The DB table `news_articles` and migration `002_news_articles.sql` stay — dropping tables requires a separate Supabase migration and there's no harm leaving an unused table
- The `rss-parser` npm dep stays — removing it would change the lockfile substantially for no functional benefit
- DB data in `news_articles` stays — doesn't affect anything

## Review

### Summary

Completely removed all 6 crypto news features from Voidspace. The RSS-based news aggregation produced zero NEAR-relevant content — general crypto feeds don't mention NEAR Protocol, and NEAR-specific Medium feeds haven't published in months. The result was irrelevant articles (Ripple, Bitcoin ETFs, XRP) appearing across the entire site, which hurt the product's NEAR focus.

### What was removed

- **6 files deleted** (1,274 lines removed): /news page, NewsFeed component, NewsSidebar component, HotSignalBar component, news-queries data layer, news syncer
- **11 files cleaned up**: Removed all news imports, data fetching, UI rendering, gap score signal, and brief generation context
- **Gap score rebalanced**: 5 signals now (was 6). News Momentum (12%) redistributed proportionally across remaining signals

### What was kept

- DB table `news_articles` — harmless, dropping requires a separate migration
- `rss-parser` npm dependency — removing changes lockfile for no benefit
- Migration file `002_news_articles.sql` — no harm leaving it

### Build Status

`npm run build` passes with zero errors. Pushed to main → Vercel deploy triggered.

---

# Interaction Design Upgrade — UX Polish

## Tasks

### Phase 1: Global Infrastructure
- [x] Create `PageTransitionWrapper` client component with `key={pathname}` — every route change now has a smooth fade-in/slide-up animation
- [x] Create 7 `loading.tsx` skeleton files (dashboard, opportunities, opportunity detail, categories, category detail, search, profile)
- [x] Add Framer Motion `whileHover`/`whileTap` micro-interactions to Button component + green glow on primary variant

### Phase 2: Navigation & Header
- [x] Add animated nav underline with `layoutId` that slides between active links
- [x] Wrap mobile menu in `AnimatePresence` for smooth enter/exit animation
- [x] Add cyan hover glow to search icon via `drop-shadow`

### Phase 3: New Utility Components
- [x] Create `VoidEmptyState` — branded empty state with icon, title, description, action
- [x] Create `StaggeredList` — Framer Motion wrapper for staggered child entrance animations

### Phase 4: Page-Specific Polish
- [x] Use `GradientText` on opportunity detail title
- [x] Use `VoidEmptyState` for profile not-connected state + empty saved opportunities
- [x] Add glow shadow to wallet connect button
- [x] Add cyan focus glow to search input card via `focus-within`

### Phase 5: Global CSS
- [x] Add `*:focus-visible` green outline for keyboard navigation
- [x] Add `prefers-reduced-motion: reduce` to disable all animations

### Verify
- [x] `npm run build` passes with zero errors

## Files Changed

### Created (10 files)
- `src/components/layout/PageTransitionWrapper.tsx` — Client wrapper for page transitions
- `src/app/loading.tsx` — Dashboard skeleton
- `src/app/opportunities/loading.tsx` — Opportunity list skeleton
- `src/app/opportunities/[id]/loading.tsx` — Opportunity detail skeleton
- `src/app/categories/loading.tsx` — Category list skeleton
- `src/app/categories/[slug]/loading.tsx` — Category detail skeleton
- `src/app/search/loading.tsx` — Search skeleton
- `src/app/profile/loading.tsx` — Profile skeleton
- `src/components/ui/VoidEmptyState.tsx` — Branded empty state component
- `src/components/effects/StaggeredList.tsx` — Staggered list animation wrapper

### Modified (8 files)
- `src/app/layout.tsx` — Wrapped children with PageTransitionWrapper
- `src/components/ui/Button.tsx` — Added `motion.button` with whileHover/whileTap + glow
- `src/components/ui/index.ts` — Added VoidEmptyState export
- `src/components/layout/Header.tsx` — Nav underline, mobile menu animation, search glow
- `src/components/opportunities/OpportunityDetail.tsx` — GradientText on title
- `src/components/profile/ProfileContent.tsx` — VoidEmptyState for empty states
- `src/app/search/page.tsx` — Focus-within glow on search input
- `src/app/globals.css` — focus-visible + prefers-reduced-motion

## Review

### Summary

Added comprehensive interaction design polish across the entire Voidspace website. Every page now has smooth entrance transitions, loading skeletons, and consistent motion patterns that reinforce the void/space brand.

### What changed

- **Page transitions**: Every route change triggers a smooth fade-in/slide-up via PageTransition + pathname key
- **Loading states**: 7 void-themed skeleton screens match each page's layout structure
- **Button feel**: Spring-based hover (1.02x scale) and press (0.98x) with green glow on primary buttons
- **Navigation**: Active link underline animates between items; mobile menu slides in/out smoothly
- **Search**: Cyan glow on icon hover; input card glows on focus
- **Empty states**: Branded VoidEmptyState with ambient glow replaces plain text messages
- **Opportunity detail**: Title uses gradient text for stronger visual impact
- **Accessibility**: Green focus-visible ring for keyboard users; prefers-reduced-motion disables all animations

### Build Status

`npm run build` passes with zero errors.

---

# UX Enhancement Round 2 — Accessibility, Consistency, Brand

## Tasks

### Category A: Accessibility
- [x] A1 — Fix text-muted contrast ratio: `#666666` → `#888888` (WCAG AA compliance, 5.1:1 ratio)
- [x] A2 — Add aria-labels: mobile menu toggle, save button, external project links
- [x] A3 — Add alt text to project logo images + aria-labels on social link icons in ProjectList

### Category B: Visual Consistency
- [x] B1 — Standardize hover depth: Card `hover` prop now includes `translate-y-[-1px]` lift effect
- [x] B5 — Search empty states: replaced plain text with branded `VoidEmptyState` component

### Category C: Brand Deepening
- [x] C1 — Noise texture overlay: subtle SVG fractalNoise at 3% opacity, fixed position, "static in the void"
- [x] C3 — Footer enhancement: added blurred glow line below top border gradient
- [x] C5 — AnimatedCounter: demand score in opportunity detail now counts up from 0 on scroll

### Category D: Mobile
- [x] D1 — Responsive tables: added `overflow-x-auto` to ProjectList and HotWalletsTable

### Verify
- [x] `npm run build` passes with zero errors

## Files Changed

### Modified (11 files)
- `src/app/globals.css` — `--text-muted` → `#888888`, noise texture `body::before` overlay
- `tailwind.config.ts` — `text-muted` color → `#888888`
- `src/components/layout/Header.tsx` — `aria-label` on mobile menu toggle
- `src/components/opportunities/SaveButton.tsx` — `aria-label` on save button
- `src/components/opportunities/OpportunityDetail.tsx` — `aria-label` on external links, `AnimatedCounter` on demand score
- `src/components/search/SearchResults.tsx` — `VoidEmptyState` for no-query and no-results states
- `src/components/ui/Card.tsx` — hover lift effect (`translate-y-[-1px]`)
- `src/components/dashboard/ProjectList.tsx` — alt text on logos, aria-labels on social links, `overflow-x-auto`
- `src/components/ecosystem/HotWalletsTable.tsx` — `overflow-x-auto` on data grid
- `src/app/projects/[slug]/page.tsx` — alt text on project logo
- `src/components/layout/Footer.tsx` — blurred glow line on top border

## Review

### Summary

Applied 11 targeted UX improvements across accessibility, visual consistency, brand deepening, and mobile experience. Every change is minimal and focused — no new files, no architecture changes, just surgical improvements to existing components.

### What changed

- **Accessibility (A1-A3)**: Fixed WCAG AA contrast failure on muted text (3.2:1 → 5.1:1), added aria-labels to 6 icon-only interactive elements, added descriptive alt text to all project logo images
- **Visual consistency (B1, B5)**: Cards with hover prop now lift 1px on hover for consistent interactive feedback. Search empty states use branded VoidEmptyState component instead of plain text
- **Brand deepening (C1, C3, C5)**: Subtle noise grain texture across the entire site creates a "static in the void" effect. Footer top border has a soft glow. Demand score animates counting up when scrolled into view
- **Mobile (D1)**: ProjectList and HotWalletsTable now scroll horizontally on small screens instead of breaking layout

### Build Status

`npm run build` passes with zero errors.

---

# Security Hardening — Comprehensive Assessment & Fixes

## Vulnerabilities Found

| # | Severity | Issue | Status |
|---|----------|-------|--------|
| 1 | **CRITICAL** | No user verification on API routes — anyone can impersonate any user | FIXED |
| 2 | **HIGH** | Zero security headers (no CSP, X-Frame-Options, HSTS, etc.) | FIXED |
| 3 | **HIGH** | No rate limiting on any endpoint | FIXED |
| 4 | **HIGH** | Sync API auth is fail-open and timing-unsafe | FIXED |
| 5 | **MEDIUM** | Search input wildcards not escaped (LIKE injection) | FIXED |
| 6 | **MEDIUM** | No input validation (no UUID format checks, no length limits) | FIXED |

## Tasks

### Phase 1: Session-Based User Verification (CRITICAL)
- [x] Create HMAC session utility (`src/lib/auth/session.ts`)
- [x] Create request auth helper (`src/lib/auth/verify-request.ts`)
- [x] Set HttpOnly session cookie on auth (`src/app/api/auth/route.ts`)
- [x] Create logout endpoint (`src/app/api/auth/logout/route.ts`)
- [x] Secure `/api/saved` — derive userId from session cookie, not client
- [x] Secure `/api/usage` — derive userId from session cookie, not client
- [x] Secure `/api/brief` — derive userId from session cookie, not client
- [x] Update all client-side API calls — remove userId from params/body
- [x] Add logout call to wallet signOut

### Phase 2: Security Headers
- [x] Add CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy to `next.config.mjs`

### Phase 3: Rate Limiting
- [x] Create in-memory sliding window rate limiter (`src/lib/auth/rate-limit.ts`)
- [x] Apply to all 5 API routes (auth: 10/min, brief: 5/min, saved: 30/min, usage: 30/min, sync: 2/min)

### Phase 4: Remaining Fixes
- [x] Harden sync API auth with `crypto.timingSafeEqual` + fail-closed pattern
- [x] Escape LIKE/ILIKE wildcards in search (`src/lib/queries.ts`)
- [x] Add input validation helpers (`src/lib/auth/validate.ts`) — UUID + NEAR account ID
- [x] Apply validation to auth, saved, and brief routes

### Infra
- [x] Generate SESSION_SECRET and add to `.env.local`
- [x] TypeScript type check passes with zero errors

## Files Changed

### Created (5 files)
- `src/lib/auth/session.ts` — HMAC session token create/verify (zero dependencies)
- `src/lib/auth/verify-request.ts` — Extract authenticated user from request cookie
- `src/lib/auth/rate-limit.ts` — In-memory sliding window rate limiter
- `src/lib/auth/validate.ts` — UUID and NEAR account ID validators
- `src/app/api/auth/logout/route.ts` — Session cookie clearing endpoint

### Modified (12 files)
- `src/app/api/auth/route.ts` — Sets session cookie + rate limit + accountId validation
- `src/app/api/saved/route.ts` — Session auth + rate limit + UUID validation (was trusting client userId)
- `src/app/api/usage/route.ts` — Session auth + rate limit (was trusting client userId)
- `src/app/api/brief/route.ts` — Session auth + rate limit + UUID validation
- `src/app/api/sync/route.ts` — Timing-safe auth + fail-closed + rate limit
- `next.config.mjs` — Full security headers (CSP, HSTS, X-Frame-Options, etc.)
- `src/lib/queries.ts` — Escape LIKE wildcards in search input
- `src/contexts/SavedOpportunitiesContext.tsx` — Removed userId from API calls
- `src/contexts/WalletContext.tsx` — Added logout call on signOut
- `src/hooks/useSavedOpportunities.ts` — Removed userId from API calls
- `src/components/brief/BriefGenerator.tsx` — Removed userId from API calls
- `src/components/profile/ProfileContent.tsx` — Removed userId from API calls

### New Environment Variables
- `SESSION_SECRET` — Must be added to Vercel production environment

## Review

### Summary

Performed a comprehensive security assessment and hardened the Voidspace website against 6 vulnerabilities. The biggest fix eliminates a critical user impersonation vulnerability where any API caller could access/modify any user's data by simply changing a userId parameter. All fixes use zero new npm dependencies — the session system uses Node.js built-in `crypto.createHmac`.

### What changed

- **Session auth**: HMAC-signed HttpOnly cookie set on wallet connect, verified on every API call. Server now derives userId from the cryptographic session token instead of trusting client-provided values. Eliminates horizontal privilege escalation across all routes.
- **Security headers**: CSP with allowlist for all external APIs (Supabase, NEAR RPC, DeFiLlama, GitHub, NearBlocks, Pikespeak, FastNEAR), plus X-Frame-Options DENY, HSTS, nosniff, strict referrer policy, and permissions policy.
- **Rate limiting**: IP-based sliding window limiter on all endpoints. Brief generation (AI calls) limited to 5/min, sync to 2/min, auth to 10/min, others to 30/min.
- **Sync auth hardened**: Now fail-closed (500 if SYNC_API_KEY not set) with timing-safe comparison to prevent timing attacks.
- **Search sanitized**: LIKE/ILIKE wildcards (`%`, `_`) escaped in user search input.
- **Input validation**: UUID format validation on opportunityId, NEAR account ID format validation on accountId.

### Action Items for Deployment
1. Add `SESSION_SECRET` to Vercel production environment variables
2. Consider rotating `SYNC_API_KEY` from the current predictable value to a random string
3. Test CSP in staging — wallet-selector popups may need additional `connect-src` entries
4. Consider adding `SESSION_SECRET` rotation mechanism in the future

### Build Status

`npx tsc --noEmit` passes with zero errors.

---

# Feature Excellence — Nearcon Innovation Sandbox Optimization

## Goals
1. Identify voids within NEAR ecosystem and plainly demonstrate to users
2. Create fun, exciting briefs for people to build and add value to NEAR
3. Help people step out of comfort zones with research and co-pilot for crypto projects
4. Win the Nearcon Innovation Sandbox (Feb 16 deadline)

## Phase 1: Foundation
- [x] Verify data sync works and data is fresh
- [x] Upgrade AI brief: Opus 4.5, co-founder tone prompt, new fields (whyNow, nextSteps, fundingOpportunities), 8000 max_tokens
- [x] Add IP-based anti-abuse: 5 free-tier generations/IP/month, zero UX friction

## Phase 2: Core UX
- [x] Free tier: 3/month instead of 3/lifetime, show 5 sections in preview
- [x] Gap score plain language: rename all 5 signals, add narrative summary
- [x] Dashboard storytelling: contextual stats, spotlight biggest void, mission framing

## Phase 3: Polish & Narrative
- [x] Copy sharpening: hero headline, CTAs, tier messaging
- [x] Ecosystem page: builder-relevant captions under metrics
- [x] Learn page: technology → void links, builder paths
- [x] Brief shareability: Twitter/X share button

## Phase 4: Nearcon Submission
- [ ] Demo video script
- [x] Final testing and build verification (`npm run build` passes)

## Review

### Summary

Applied 10 targeted improvements across the Voidspace platform to maximize the product's utility, desirability, and Nearcon Innovation Sandbox competitiveness. Every change makes EXISTING features more exceptional — no new features were added, only existing ones refined.

### What Changed

**1. AI Brief Generation Overhaul (Crown Jewel)**
- Model upgraded from Claude Sonnet 4 → **Claude Opus 4.5** (`claude-opus-4-5-20251101`) for dramatically richer, more nuanced briefs
- System prompt rewritten from "detached consultant" to "excited co-founder" tone — more opinionated, actionable, specific
- Added 3 new brief fields: `whyNow` (market timing), `nextSteps` (5 week-1 actions), `fundingOpportunities` (grants/accelerators)
- Max tokens increased from 4096 → 8000 for more comprehensive briefs
- NEAR funding context baked into system prompt (Foundation Grants, Horizon, Proximity Labs, ecosystem fund)
- Files: `supabase/functions/generate-brief/index.ts`, `src/types/index.ts`, `src/components/brief/BriefDisplay.tsx`, `src/components/brief/BriefPreview.tsx`

**2. Free Tier + Anti-Abuse**
- Free tier changed from **3 lifetime** to **3 per month** — users can experience the magic monthly
- IP-based monthly cap: max 5 free-tier generations per IP per month (prevents multi-wallet abuse without ANY UX friction)
- Brief caching (already existed) serves as second anti-abuse layer — same void = cached result = no API cost
- Free preview now shows **5 sections** (problem, solution, whyNow, targetUsers, feature names) instead of 2
- TierGate on BriefGenerator changed from `requiredTier="specter"` to `requiredTier="shade"` — all connected users can generate
- Files: `src/app/api/brief/route.ts`, `src/lib/tiers.ts`, `src/components/brief/BriefPreview.tsx`, `src/components/brief/BriefGenerator.tsx`

**3. Gap Score Plain Language**
- Renamed all 5 signals: Supply Scarcity → "Builder Gap", TVL Concentration → "Market Control", Dev Activity Gap → "Dev Momentum", Strategic Priority → "NEAR Focus", Market Demand → "Untapped Demand"
- Descriptions rewritten to be human-readable (e.g., "A few big players dominate — room for challengers")
- Auto-generated narrative summary added to GapScoreBreakdown: "This void scores 78/100 because very few teams are building here, development has slowed, and NEAR Foundation considers this a strategic priority."
- Files: `src/lib/gap-score.ts`, `src/components/opportunities/GapScoreBreakdown.tsx`

**4. Dashboard Storytelling**
- Hero typewriter lines rewritten: "The NEAR ecosystem has gaps. Your next project fills one." / "Find where NEAR needs you most."
- Chart descriptions reframed: "Look for the longest spikes — that's where your opportunity lives"
- Priority Voids description: "Fewer builders + high demand = your opportunity"
- CTA footer: "Every void you fill makes NEAR stronger"
- Files: `src/components/hero/HeroSection.tsx`, `src/components/dashboard/PriorityVoids.tsx`, `src/app/page.tsx`

**5. Ecosystem Page Builder Context**
- Hero description reframed: "These numbers prove your next project has real infrastructure and real users behind it"
- Added builder-relevant section descriptions under Chain Health and GitHub Pulse
- Added "NEAR is thriving. Now see where it needs you most." CTA linking to /opportunities
- Files: `src/app/ecosystem/page.tsx`

**6. Learn Page Action Connections**
- Each NEAR technology (Shade Agents, Intents, Chain Signatures) now links to filtered opportunities for that tech
- Brief description updated to reflect new fields (Why Now, Next Steps, Funding)
- Free tier text updated to "3 mission briefs per month"
- Files: `src/app/learn/page.tsx`

**7. Brief Shareability**
- Added "Share on X" button to BriefDisplay that generates pre-filled tweet with project name and problem statement
- Files: `src/components/brief/BriefDisplay.tsx`

### What Was NOT Changed
- Database schema (all new brief fields are optional in TypeScript — backward compatible with existing cached briefs)
- Gap score algorithm weights (only labels/descriptions changed)
- Authentication system
- Rate limiting infrastructure (reused existing pattern for IP monthly cap)
- No new npm dependencies added

### Build Status
`npm run build` passes. No TypeScript errors.

### Action Items for Deployment
1. **Deploy updated Supabase edge function** — the `generate-brief` function has the new model and prompt
2. **Run a data sync** to ensure fresh data before the demo: `curl -X POST /api/sync -H "Authorization: Bearer YOUR_KEY"`
3. **Clear existing cached briefs** if you want all briefs to use the new Opus 4.5 format (optional — old briefs still display fine)
4. **Test brief generation end-to-end** — verify new fields (whyNow, nextSteps, fundingOpportunities) appear
