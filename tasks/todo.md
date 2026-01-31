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
