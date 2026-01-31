# Crypto News Integration — Task List

## Tasks

- [x] Phase 1: Install rss-parser dependency
- [x] Phase 1: Create news_articles DB migration
- [x] Phase 1: Create src/lib/sync/news.ts (core news syncer)
- [x] Phase 1: Add NewsArticle type to types/index.ts
- [x] Phase 1: Add syncNews step to sync route
- [x] Phase 2: Create src/lib/news-queries.ts
- [x] Phase 2: Create NewsFeed component
- [x] Phase 2: Create /news page
- [x] Phase 2: Add News to navigation
- [x] Phase 3: Modify generate-brief to inject news context
- [x] Phase 4: Add newsMomentum signal to gap-score.ts
- [x] Phase 4: Update queries.ts and opportunities.ts for news counts
- [x] Phase 5: Create NewsSidebar component
- [x] Phase 5: Add sidebar to opportunity detail + category pages
- [x] Phase 6: Create HotSignalBar component
- [x] Phase 6: Add HotSignalBar to dashboard
- [x] Phase 7: Add extractOpportunitiesFromNews to news.ts
- [x] Build and verify all changes

## Review

### Summary of Changes

Integrated 6 crypto news features into Voidspace using a TypeScript port of the Python RSS news aggregator skill. All features share a single `news_articles` DB table and sync pipeline.

### New Files Created (7)

| File | Purpose |
|------|---------|
| `supabase/migrations/002_news_articles.sql` | DB table + indexes + RLS |
| `src/lib/sync/news.ts` | Core RSS fetcher, scorer, syncer, news-to-opportunity pipeline |
| `src/lib/news-queries.ts` | Data access layer for news (5 query functions) |
| `src/components/news/NewsFeed.tsx` | Full news feed component with source badges + scores |
| `src/components/news/NewsSidebar.tsx` | Compact 5-article sidebar for detail pages |
| `src/components/news/HotSignalBar.tsx` | Trending topics bar with velocity spike detection |
| `src/app/news/page.tsx` | New /news page with NEAR-specific section |

### Existing Files Modified (11)

| File | Change |
|------|--------|
| `src/types/index.ts` | Added `NewsArticle` type, `newsArticleCount` to `GapScoreInput`, `newsMomentum` to `GapScoreBreakdown` |
| `src/app/api/sync/route.ts` | Added news sync + opportunity extraction steps |
| `src/lib/gap-score.ts` | Added 6th signal "News Momentum" (12% weight), rebalanced weights |
| `src/lib/queries.ts` | Fetches news counts per category, passes to gap score |
| `src/lib/sync/opportunities.ts` | Fetches news counts, passes to gap score |
| `supabase/functions/generate-brief/index.ts` | Fetches recent news, injects into Claude prompt |
| `src/app/opportunities/[id]/page.tsx` | Fetches category news, passes to detail component |
| `src/components/opportunities/OpportunityDetail.tsx` | Renders NewsSidebar after competition analysis |
| `src/app/categories/[slug]/page.tsx` | Fetches category news, renders NewsSidebar |
| `src/app/page.tsx` | Fetches news velocity, renders HotSignalBar on dashboard |
| `src/lib/constants.ts` | Added "News" to NAV_ITEMS |

### Dependencies Added

- `rss-parser` (v3.x) — 1 new npm package

### Build Status

`npm run build` passes with zero errors.

### Next Steps

1. Run the DB migration (`002_news_articles.sql`) on Supabase
2. Trigger a data sync (`POST /api/sync`) to populate news articles
3. Verify the /news page, hot signal bar, news sidebars, and brief generation
4. Deploy to Vercel

---

## NEAR News Curation Fix

### Problem
News articles across the site were showing random crypto content (Ripple, Bitcoin ETFs, etc.) with no NEAR ecosystem relevance.

### Tasks

- [x] Expand NEAR_KEYWORDS from 18 to 50+ terms (NEAR ecosystem projects)
- [x] Add 2 NEAR-specific RSS feeds (NEAR Protocol Medium, Mintbase Medium)
- [x] Add `nearSource` flag to auto-tag articles from NEAR feeds
- [x] Add +25 scoring bonus for NEAR-relevant articles
- [x] Add `near_relevant: true` filter to all 4 query functions
- [x] Update /news page copy to "NEAR Ecosystem News"
- [x] Build passes with zero errors
- [x] Re-sync completed (496 articles fetched, 491 inserted)

### Files Modified (3)

| File | Change |
|------|--------|
| `src/lib/sync/news.ts` | Added `nearSource` flag to RSSSource, 2 NEAR RSS feeds, expanded NEAR_KEYWORDS (18→50+), +25 NEAR bonus in scoreArticle(), pre-computed `isNear` in sync loop |
| `src/lib/news-queries.ts` | Added `.eq('near_relevant', true)` to `getNewsByCategory()`, `getNewsVelocity()` (2 queries), `getNewsCountByCategory()`, changed `nearOnly` default to `true` |
| `src/app/news/page.tsx` | Updated page title to "NEAR Ecosystem News", section title to "Latest NEAR News" |
