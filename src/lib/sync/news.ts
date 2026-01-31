import type { SupabaseClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';

// ============================================================
// RSS Source Registry (ported from sources.yaml)
// ============================================================

interface RSSSource {
  name: string;
  url: string;
  category: string;
  quality: number;
  nearSource?: boolean;
}

const RSS_SOURCES: RSSSource[] = [
  // Tier 1
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'market', quality: 9 },
  { name: 'The Block', url: 'https://www.theblock.co/rss.xml', category: 'market', quality: 9 },
  { name: 'Decrypt', url: 'https://decrypt.co/feed', category: 'market', quality: 8 },
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', category: 'market', quality: 8 },
  { name: 'Blockworks', url: 'https://blockworks.co/feed/', category: 'market', quality: 8 },
  // Tier 2
  { name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com/feed', category: 'market', quality: 8 },
  { name: 'CryptoSlate', url: 'https://cryptoslate.com/feed/', category: 'market', quality: 7 },
  { name: 'DL News', url: 'https://www.dlnews.com/feed/', category: 'market', quality: 7 },
  { name: 'Unchained', url: 'https://unchainedcrypto.com/feed/', category: 'market', quality: 7 },
  // Tier 3
  { name: 'NewsBTC', url: 'https://www.newsbtc.com/feed/', category: 'market', quality: 6 },
  { name: 'CryptoPotato', url: 'https://cryptopotato.com/feed/', category: 'market', quality: 6 },
  { name: 'U.Today', url: 'https://u.today/rss', category: 'market', quality: 6 },
  { name: 'Bitcoinist', url: 'https://bitcoinist.com/feed/', category: 'market', quality: 6 },
  { name: 'AMBCrypto', url: 'https://ambcrypto.com/feed/', category: 'market', quality: 5 },
  // DeFi
  { name: 'DeFi Pulse', url: 'https://defipulse.com/blog/feed/', category: 'defi', quality: 8 },
  { name: 'The Defiant', url: 'https://thedefiant.io/feed/', category: 'defi', quality: 8 },
  // NFT
  { name: 'NFT Now', url: 'https://nftnow.com/feed/', category: 'nft', quality: 7 },
  // Layer 1
  { name: 'Week in Ethereum', url: 'https://weekinethereumnews.com/feed/', category: 'layer1', quality: 8 },
  // Regulatory
  { name: 'Crypto Law Insider', url: 'https://cryptolawinsider.com/feed/', category: 'regulatory', quality: 7 },
  // NEAR Ecosystem (all articles auto-tagged as NEAR-relevant)
  { name: 'NEAR Protocol', url: 'https://medium.com/feed/nearprotocol', category: 'layer1', quality: 10, nearSource: true },
  { name: 'Mintbase', url: 'https://medium.com/feed/mintbase', category: 'nft', quality: 7, nearSource: true },
];

// ============================================================
// Coin Detection
// ============================================================

const COIN_PATTERNS: [string, string[]][] = [
  ['BTC', ['BITCOIN', 'BTC']],
  ['ETH', ['ETHEREUM', 'ETH', 'ETHER']],
  ['NEAR', ['NEAR PROTOCOL', 'NEAR']],
  ['SOL', ['SOLANA', 'SOL']],
  ['BNB', ['BINANCE', 'BNB']],
  ['XRP', ['RIPPLE', 'XRP']],
  ['ADA', ['CARDANO', 'ADA']],
  ['DOGE', ['DOGECOIN', 'DOGE']],
  ['DOT', ['POLKADOT', 'DOT']],
  ['AVAX', ['AVALANCHE', 'AVAX']],
  ['LINK', ['CHAINLINK', 'LINK']],
  ['MATIC', ['POLYGON', 'MATIC']],
  ['UNI', ['UNISWAP', 'UNI']],
  ['AAVE', ['AAVE']],
  ['MKR', ['MAKER', 'MKR']],
  ['CRV', ['CURVE', 'CRV']],
  ['LDO', ['LIDO', 'LDO']],
  ['ARB', ['ARBITRUM', 'ARB']],
  ['OP', ['OPTIMISM']],
];

function detectCoins(text: string): string[] {
  const upper = text.toUpperCase();
  const coins: string[] = [];
  for (const [symbol, patterns] of COIN_PATTERNS) {
    for (const pattern of patterns) {
      if (upper.includes(pattern)) {
        if (!coins.includes(symbol)) coins.push(symbol);
        break;
      }
    }
  }
  return coins;
}

// ============================================================
// Category Detection
// ============================================================

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  defi: ['defi', 'yield farming', 'liquidity pool', 'dex', 'lending protocol', 'aave', 'uniswap', 'curve'],
  nft: ['nft', 'opensea', 'blur', 'collection', 'mint', 'pfp', 'digital art'],
  regulatory: ['sec', 'cftc', 'regulation', 'congress', 'senator', 'compliance', 'lawsuit', 'settlement'],
  exchange: ['binance', 'coinbase', 'kraken', 'listing', 'delist', 'exchange', 'trading pair'],
  security: ['hack', 'exploit', 'vulnerability', 'audit', 'breach', 'stolen', 'attack', 'rug pull'],
  layer2: ['arbitrum', 'optimism', 'polygon', 'zksync', 'base', 'layer 2', 'l2', 'rollup'],
};

function detectCategory(text: string, fallback: string): string {
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return fallback;
}

// ============================================================
// NEAR Relevance Detection
// ============================================================

const NEAR_KEYWORDS = [
  // Core NEAR
  'near protocol', 'near blockchain', 'near foundation', 'nearcon',
  'near ecosystem', 'near wallet', 'near token', '$near',
  // Aurora
  'aurora chain', 'aurora network', 'aurora evm',
  // NEAR Tech
  'shade agent', 'chain signatures', 'chain abstraction',
  'near intents', 'near sharding', 'nightshade', 'doomslug',
  'near data availability', 'near da', 'account abstraction',
  // NEAR-Adjacent Topics (AI + Chain Abstraction — core NEAR narratives)
  'ai agent crypto', 'crypto ai agent', 'onchain ai', 'on-chain ai',
  'decentralized ai', 'ai blockchain', 'ai web3',
  'ai defi', 'ai nft', 'ai dao',
  // Projects & Infrastructure
  'pagoda', 'fastnear', 'mintbase', 'ref finance',
  'burrow cash', 'meta pool', 'linear protocol',
  'sweat economy', 'sweatcoin',
  'hot wallet near', 'here wallet', 'meteor wallet', 'mynearwallet',
  'bitte wallet', 'near.ai', 'calimero', 'octopus network',
  'orderly network', 'spin fi', 'jumbo exchange',
  'paras.id', 'few and far', 'seatlab',
  'pikespeak', 'nearblocks', 'near explorer',
  'keypom', 'shard dog', 'learn near',
  'near social', 'near.social', 'bos.gg',
  'allstake', 'liq protocol',
];

function detectNearRelevance(text: string): boolean {
  const lower = text.toLowerCase();
  // Only match explicit NEAR ecosystem keywords (no loose "near" word matching)
  return NEAR_KEYWORDS.some((kw) => lower.includes(kw));
}

// ============================================================
// Relevance Scoring (ported from scorer.py)
// ============================================================

const HIGH_IMPACT_KEYWORDS: Record<string, number> = {
  'hack': 15, 'exploit': 15, 'breach': 12, 'stolen': 12,
  'listing': 10, 'delist': 12, 'sec': 12, 'lawsuit': 10,
  'settlement': 10, 'partnership': 8, 'acquisition': 10, 'merger': 10,
  'etf': 12, 'approval': 10, 'rejection': 10,
  'all-time high': 10, 'ath': 8, 'crash': 10, 'surge': 8,
  'plunge': 8, 'rally': 8, 'dump': 8, 'pump': 8,
  'airdrop': 10, 'fork': 10, 'upgrade': 8, 'mainnet': 8, 'launch': 8,
  'bankruptcy': 12, 'insolvent': 12, 'freeze': 10, 'halting': 10,
};

const MEDIUM_IMPACT_KEYWORDS: Record<string, number> = {
  'bitcoin': 5, 'ethereum': 5, 'defi': 4, 'nft': 4,
  'regulation': 6, 'institutional': 5, 'whale': 6,
  'binance': 4, 'coinbase': 4, 'stablecoin': 5, 'usdt': 4, 'usdc': 4,
  'layer 2': 4, 'rollup': 4, 'yield': 4, 'staking': 4,
  'validator': 4, 'governance': 4, 'proposal': 4, 'vote': 4,
};

const NEGATIVE_KEYWORDS: Record<string, number> = {
  'sponsored': -10, 'partner content': -10, 'advertisement': -15,
  'promotion': -5, 'giveaway': -5, 'free': -3, 'sign up': -3, 'discount': -5,
};

function scoreArticle(
  title: string,
  summary: string,
  sourceQuality: number,
  publishedAt: Date | null,
  nearRelevant: boolean = false,
): number {
  const text = `${title} ${summary}`.toLowerCase();
  let score = 0;

  // Base score from source quality (0-30)
  score += sourceQuality * 3;

  // NEAR relevance bonus (0-25)
  if (nearRelevant) score += 25;

  // Keyword scoring (0-50)
  let keywordScore = 0;
  for (const [kw, weight] of Object.entries(HIGH_IMPACT_KEYWORDS)) {
    if (text.includes(kw)) keywordScore += weight;
  }
  for (const [kw, weight] of Object.entries(MEDIUM_IMPACT_KEYWORDS)) {
    if (text.includes(kw)) keywordScore += weight;
  }
  for (const [kw, weight] of Object.entries(NEGATIVE_KEYWORDS)) {
    if (text.includes(kw)) keywordScore += weight;
  }
  keywordScore = Math.min(50, Math.max(0, keywordScore));
  score += keywordScore;

  // Recency bonus (0-20)
  if (publishedAt) {
    const ageMs = Date.now() - publishedAt.getTime();
    const hours = ageMs / (1000 * 60 * 60);
    if (hours < 1) score += 20;
    else if (hours < 4) score += 15;
    else if (hours < 12) score += 10;
    else if (hours < 24) score += 5;
    else if (hours < 72) score += 2;
  }

  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

// ============================================================
// HTML Cleaning
// ============================================================

function cleanHtml(text: string): string {
  if (!text) return '';
  // Decode common HTML entities
  let clean = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
  // Strip HTML tags
  clean = clean.replace(/<[^>]+>/g, '');
  // Normalize whitespace
  clean = clean.replace(/\s+/g, ' ').trim();
  return clean;
}

// ============================================================
// Deduplication (simplified title similarity)
// ============================================================

interface ParsedArticle {
  title: string;
  url: string;
  source: string;
  source_quality: number;
  published_at: string | null;
  summary: string | null;
  category: string;
  relevance_score: number;
  coins_mentioned: string[];
  near_relevant: boolean;
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

function deduplicateArticles(articles: ParsedArticle[]): ParsedArticle[] {
  const unique: ParsedArticle[] = [];
  const seenTitles: string[] = [];

  for (const article of articles) {
    const norm = normalizeTitle(article.title);
    // Check for substring overlap (simpler than SequenceMatcher, works well for RSS dedup)
    const isDuplicate = seenTitles.some((seen) => {
      if (norm === seen) return true;
      // Check if one title is a substring of the other (common in RSS)
      if (norm.length > 20 && seen.length > 20) {
        if (norm.includes(seen.substring(0, 30)) || seen.includes(norm.substring(0, 30))) {
          return true;
        }
      }
      return false;
    });

    if (!isDuplicate) {
      unique.push(article);
      seenTitles.push(norm);
    }
  }

  return unique;
}

// ============================================================
// Main Sync Function
// ============================================================

export async function syncNews(
  supabase: SupabaseClient,
): Promise<{ fetched: number; inserted: number; updated: number; pruned: number }> {
  const parser = new Parser({
    timeout: 8000,
    headers: { 'User-Agent': 'Voidspace/1.0 News Aggregator' },
  });

  // Fetch all feeds in parallel
  const feedResults = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return { source, items: feed.items || [] };
      } catch {
        return { source, items: [] };
      }
    }),
  );

  // Parse all articles
  const allArticles: ParsedArticle[] = [];

  for (const result of feedResults) {
    if (result.status !== 'fulfilled') continue;
    const { source, items } = result.value;

    for (const item of items) {
      const title = cleanHtml(item.title || '');
      const url = item.link || '';
      if (!title || !url) continue;

      let summary = cleanHtml(item.contentSnippet || item.content || item.summary || '');
      if (summary.length > 500) summary = summary.substring(0, 500) + '...';

      const fullText = `${title} ${summary}`;
      const publishedAt = item.isoDate ? new Date(item.isoDate) : null;
      const isNear = source.nearSource || detectNearRelevance(fullText);

      allArticles.push({
        title,
        url,
        source: source.name,
        source_quality: source.quality,
        published_at: publishedAt?.toISOString() || null,
        summary: summary || null,
        category: detectCategory(fullText, source.category),
        relevance_score: scoreArticle(title, summary, source.quality, publishedAt, isNear),
        coins_mentioned: detectCoins(fullText),
        near_relevant: isNear,
      });
    }
  }

  // Deduplicate
  const unique = deduplicateArticles(allArticles);

  // Upsert into Supabase (batch in chunks of 50)
  let inserted = 0;
  const updated = 0;
  const BATCH_SIZE = 50;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from('news_articles')
      .upsert(
        batch.map((a) => ({
          title: a.title,
          url: a.url,
          source: a.source,
          source_quality: a.source_quality,
          published_at: a.published_at,
          summary: a.summary,
          category: a.category,
          relevance_score: a.relevance_score,
          coins_mentioned: a.coins_mentioned,
          near_relevant: a.near_relevant,
          synced_at: new Date().toISOString(),
        })),
        { onConflict: 'url', ignoreDuplicates: false },
      )
      .select('id');

    if (!error && data) {
      inserted += data.length;
    }
  }

  // Prune articles older than 14 days
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { count: pruned } = await supabase
    .from('news_articles')
    .delete({ count: 'exact' })
    .lt('published_at', cutoff);

  return {
    fetched: allArticles.length,
    inserted,
    updated,
    pruned: pruned || 0,
  };
}

// ============================================================
// News-to-Opportunity Pipeline (Feature 6)
// ============================================================

export async function extractOpportunitiesFromNews(
  supabase: SupabaseClient,
): Promise<{ extracted: number }> {
  // Fetch recent NEAR-relevant news that hasn't been processed
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: nearNews } = await supabase
    .from('news_articles')
    .select('title, summary, category, url')
    .eq('near_relevant', true)
    .gte('published_at', oneDayAgo)
    .order('relevance_score', { ascending: false })
    .limit(10);

  if (!nearNews || nearNews.length === 0) {
    return { extracted: 0 };
  }

  // Format news for Claude
  const newsContext = nearNews
    .map((n, i) => `${i + 1}. [${n.category}] ${n.title}\n   ${n.summary || ''}`)
    .join('\n\n');

  // Call Claude to extract opportunities
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    console.warn('ANTHROPIC_API_KEY not set, skipping news-to-opportunity extraction');
    return { extracted: 0 };
  }

  const prompt = `Analyze these recent NEAR ecosystem news articles and identify 1-3 potential project opportunities (gaps) that builders could fill.

NEWS ARTICLES:
${newsContext}

For each opportunity, return JSON:
{
  "opportunities": [
    {
      "title": "Short opportunity title",
      "description": "2-3 sentence description of the gap and why it matters",
      "category_slug": "one of: ai-agents, privacy, intents, rwa, data-analytics, defi, dex-trading, gaming, nfts, daos, social, dev-tools, wallets, education, infrastructure",
      "reasoning": "Why this news creates an opportunity"
    }
  ]
}

Only return opportunities that are actionable and specific to the NEAR ecosystem. Return valid JSON only.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) return { extracted: 0 };

    const data = await response.json();
    let rawText = data.content[0].text.trim();
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }
    const result = JSON.parse(rawText);

    if (!result.opportunities?.length) return { extracted: 0 };

    // Match category slugs to category IDs
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug');

    if (!categories) return { extracted: 0 };

    const slugToId = new Map(categories.map((c: { id: string; slug: string }) => [c.slug, c.id]));
    let extracted = 0;

    for (const opp of result.opportunities) {
      const categoryId = slugToId.get(opp.category_slug);
      if (!categoryId) continue;

      const { error } = await supabase
        .from('opportunities')
        .upsert(
          {
            category_id: categoryId,
            title: `[News-Derived] ${opp.title}`,
            description: opp.description,
            reasoning: opp.reasoning,
            gap_score: 65, // Default moderate score for news-derived opportunities
            competition_level: 'low',
            difficulty: 'intermediate',
          },
          { onConflict: 'category_id,title' },
        );

      if (!error) extracted++;
    }

    return { extracted };
  } catch (error) {
    console.error('News-to-opportunity extraction failed:', error);
    return { extracted: 0 };
  }
}
