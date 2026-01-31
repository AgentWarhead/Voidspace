-- ============================================================
-- News Articles Table (cached from RSS feeds)
-- Powers: news feed, news-enhanced briefs, gap score signal,
--         category sidebars, hot signal bar, opportunity pipeline
-- ============================================================

CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  source_quality INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ,
  summary TEXT,
  category TEXT,
  relevance_score DECIMAL DEFAULT 0,
  coins_mentioned TEXT[] DEFAULT '{}',
  near_relevant BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_relevance ON news_articles(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_news_near ON news_articles(near_relevant, published_at DESC);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read news_articles" ON news_articles FOR SELECT USING (true);
