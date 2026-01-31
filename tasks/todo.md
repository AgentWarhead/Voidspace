# Remove News Features — Complete Cleanup

## Why

General crypto RSS feeds produce zero NEAR-relevant content. NEAR-specific Medium feeds haven't published in months. The news feature shows irrelevant crypto articles (Ripple, Bitcoin ETFs, XRP) everywhere on the site. It hurts the product's NEAR focus rather than helping.

## Tasks

### Delete Files (6)
- [ ] Delete `src/app/news/page.tsx`
- [ ] Delete `src/components/news/NewsFeed.tsx`
- [ ] Delete `src/components/news/NewsSidebar.tsx`
- [ ] Delete `src/components/news/HotSignalBar.tsx`
- [ ] Delete `src/lib/news-queries.ts`
- [ ] Delete `src/lib/sync/news.ts`

### Modify Files (11)
- [ ] `src/lib/constants.ts` — Remove "News" from NAV_ITEMS
- [ ] `src/app/api/sync/route.ts` — Remove news import, syncNews step, extractOpportunitiesFromNews step
- [ ] `src/app/page.tsx` — Remove HotSignalBar + getNewsVelocity from dashboard
- [ ] `src/app/categories/[slug]/page.tsx` — Remove NewsSidebar + getNewsByCategory
- [ ] `src/app/opportunities/[id]/page.tsx` — Remove getNewsByCategory + news prop
- [ ] `src/components/opportunities/OpportunityDetail.tsx` — Remove NewsSidebar + news prop + NewsArticle type
- [ ] `src/lib/queries.ts` — Remove news_articles fetch + news count mapping from getCategoriesWithStats
- [ ] `src/lib/sync/opportunities.ts` — Remove news count fetch + newsArticleCount passing
- [ ] `src/lib/gap-score.ts` — Remove Signal 6 (News Momentum), rebalance 5 weights to sum to 1.0
- [ ] `src/types/index.ts` — Remove NewsArticle interface, newsArticleCount from GapScoreInput, newsMomentum from GapScoreBreakdown
- [ ] `supabase/functions/generate-brief/index.ts` — Remove news context from Claude prompt

### Verify
- [ ] `npm run build` passes with zero errors
- [ ] Commit and push to trigger Vercel deploy

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

_(to be filled after completion)_
