import { NextResponse } from 'next/server';
import { fetchNearTokens, type TokenData } from '@/lib/dexscreener';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export interface VoidBubbleToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  category: string;
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  detectedAt: string;
  // New fields for timeframe support
  priceChange1h: number;
  priceChange6h: number;
  dexScreenerUrl?: string;
  refFinanceUrl?: string;
  contractAddress: string;
  // Rich data from DexScreener
  imageUrl?: string;
  socials?: { url: string; type: string }[];
  websites?: { url: string; label: string }[];
  txns24h?: { buys: number; sells: number };
  txns1h?: { buys: number; sells: number };
  txns6h?: { buys: number; sells: number };
  volume1h?: number;
  volume6h?: number;
  dexId?: string;
  pairCreatedAt?: string;
  pairAddress?: string;
  quoteToken?: string;
  fdv?: number;
  priceChange5m?: number;
}

// Known NEAR token categories
const TOKEN_CATEGORIES: Record<string, string> = {
  'REF': 'DeFi', 'BRRR': 'DeFi', 'LINEAR': 'DeFi', 'STNEAR': 'DeFi',
  'NETH': 'DeFi', 'USN': 'Stablecoin', 'USDC': 'Stablecoin', 'USDt': 'Stablecoin',
  'USDC.e': 'Stablecoin', 'DAI': 'Stablecoin', 'wNEAR': 'Infrastructure',
  'NEAR': 'Infrastructure', 'AURORA': 'Infrastructure', 'SWEAT': 'Move-to-Earn',
  'PARAS': 'NFT', 'BLACKDRAGON': 'Meme', 'SHITZU': 'Meme', 'LONK': 'Meme',
  'NEKO': 'Meme', 'BEAN': 'Meme', 'FT': 'Meme', 'GEAR': 'Gaming',
  'HOT': 'Gaming', 'JUMP': 'DeFi', 'META': 'DeFi', 'PEM': 'DeFi',
  'INTEL': 'AI', 'NEARVIDIA': 'AI', 'TRUMP': 'Meme', 'PEPE': 'Meme',
  'DEGEN': 'Meme', 'CHAD': 'Meme',
};

const DEFAULT_CATEGORY = 'Other';

// AI Health Score calculation
function calculateHealthScore(token: {
  volume24h: number;
  liquidity: number;
  priceChange24h: number;
  marketCap: number;
}): { score: number; riskLevel: 'low' | 'medium' | 'high' | 'critical'; factors: string[] } {
  let score = 50;
  const factors: string[] = [];

  // Liquidity health (0-25 points)
  if (token.liquidity > 1_000_000) { score += 25; }
  else if (token.liquidity > 100_000) { score += 15; }
  else if (token.liquidity > 10_000) { score += 5; }
  else { score -= 15; factors.push('Very low liquidity'); }

  // Volume/liquidity ratio (0-20 points) — healthy is 0.1-2x
  const vlRatio = token.liquidity > 0 ? token.volume24h / token.liquidity : 0;
  if (vlRatio >= 0.1 && vlRatio <= 2) { score += 20; }
  else if (vlRatio > 2) { score += 5; factors.push('Unusually high volume'); }
  else if (vlRatio < 0.01 && token.liquidity > 0) { score -= 5; factors.push('Very low trading activity'); }

  // Price stability (0-15 points)
  const absChange = Math.abs(token.priceChange24h);
  if (absChange < 5) { score += 15; }
  else if (absChange < 15) { score += 10; }
  else if (absChange < 30) { score += 5; }
  else { score -= 10; factors.push(`Extreme volatility (${token.priceChange24h > 0 ? '+' : ''}${token.priceChange24h.toFixed(1)}%)`); }

  // Market cap health
  if (token.marketCap > 10_000_000) { score += 10; }
  else if (token.marketCap > 1_000_000) { score += 5; }
  else if (token.marketCap < 50_000) { factors.push('Micro-cap token'); }

  // Clamp
  score = Math.max(0, Math.min(100, score));

  const riskLevel: 'low' | 'medium' | 'high' | 'critical' =
    score >= 75 ? 'low' :
    score >= 50 ? 'medium' :
    score >= 25 ? 'high' : 'critical';

  if (factors.length === 0) factors.push('No significant risk factors detected');

  return { score, riskLevel, factors };
}

function tokenDataToVoidBubble(t: TokenData, period: string): VoidBubbleToken {
  // Map period to the appropriate price change for current display.
  // Only 1h, 6h, and 24h data are real (sourced from DexScreener).
  // For 7d/30d there is no real historical source — fall back to 24h data.
  let currentPriceChange = t.priceChange24h;
  let currentVolume = t.volume24h;

  switch (period) {
    case '1h':
      currentPriceChange = t.priceChange1h;
      currentVolume = t.volume1h;
      break;
    case '4h':
      currentPriceChange = t.priceChange6h; // closest available
      currentVolume = t.volume6h;
      break;
    case '1d':
    case '7d':  // No real 7d source — show 24h data
    case '30d': // No real 30d source — show 24h data
    default:
      currentPriceChange = t.priceChange24h;
      currentVolume = t.volume24h;
      break;
  }

  const health = calculateHealthScore({
    volume24h: currentVolume,
    liquidity: t.liquidity,
    priceChange24h: currentPriceChange,
    marketCap: t.marketCap,
  });

  return {
    id: t.contractAddress,
    symbol: t.symbol,
    name: t.name,
    price: t.price,
    priceChange24h: currentPriceChange,
    volume24h: currentVolume,
    liquidity: t.liquidity,
    marketCap: t.marketCap,
    category: TOKEN_CATEGORIES[t.symbol] || DEFAULT_CATEGORY,
    healthScore: health.score,
    riskLevel: health.riskLevel,
    riskFactors: health.factors,
    detectedAt: new Date().toISOString(),
    priceChange1h: t.priceChange1h,
    priceChange6h: t.priceChange6h,
    dexScreenerUrl: t.dexScreenerUrl,
    refFinanceUrl: t.refFinanceUrl,
    contractAddress: t.contractAddress,
    imageUrl: t.imageUrl,
    socials: t.socials,
    websites: t.websites,
    txns24h: t.txns24h,
    txns1h: t.txns1h,
    txns6h: t.txns6h,
    volume1h: t.volume1h,
    volume6h: t.volume6h,
    dexId: t.dexId,
    pairCreatedAt: t.pairCreatedAt,
    pairAddress: t.pairAddress,
    quoteToken: undefined, // Not available from shared lib (optional field)
    fdv: t.fdv,
    priceChange5m: t.priceChange5m,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '1d';

    // Fetch real market data from DexScreener (via shared cached lib)
    const dexTokens = await fetchNearTokens().catch(() => [] as TokenData[]);

    const tokens: VoidBubbleToken[] = [];
    const seenSymbols = new Set<string>();

    // Process DexScreener data — only real data, no fallback fabrication
    for (const t of dexTokens) {
      if (seenSymbols.has(t.symbol)) continue;
      seenSymbols.add(t.symbol);
      tokens.push(tokenDataToVoidBubble(t, period));
    }

    // Sort by market cap descending
    tokens.sort((a, b) => b.marketCap - a.marketCap);

    // Aggregate stats for header
    const cappedTokens = tokens.slice(0, 150);
    const totalMarketCap = cappedTokens.reduce((sum, t) => sum + t.marketCap, 0);
    const totalVolume24h = cappedTokens.reduce((sum, t) => sum + t.volume24h, 0);
    const totalLiquidity = cappedTokens.reduce((sum, t) => sum + t.liquidity, 0);
    const gainersCount = cappedTokens.filter(t => t.priceChange24h > 0).length;
    const losersCount = cappedTokens.filter(t => t.priceChange24h < 0).length;
    const avgHealthScore = Math.round(cappedTokens.reduce((sum, t) => sum + t.healthScore, 0) / cappedTokens.length);
    const categoryBreakdown: Record<string, number> = {};
    cappedTokens.forEach(t => { categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + 1; });

    // Enhanced stats
    let totalBuys24h = 0;
    let totalSells24h = 0;
    cappedTokens.forEach(t => {
      totalBuys24h += t.txns24h?.buys || 0;
      totalSells24h += t.txns24h?.sells || 0;
    });
    const totalTxns24h = totalBuys24h + totalSells24h;
    const buyPressure = totalTxns24h > 0 ? Math.round((totalBuys24h / totalTxns24h) * 100) : 50;

    const now24h = Date.now() - 24 * 60 * 60 * 1000;
    const newPairsLast24h = cappedTokens.filter(t => {
      if (!t.pairCreatedAt) return false;
      return new Date(t.pairCreatedAt).getTime() > now24h;
    }).length;

    const sortedByChange = [...cappedTokens].sort((a, b) => b.priceChange24h - a.priceChange24h);
    const topGainer = sortedByChange[0];
    const topLoser = sortedByChange[sortedByChange.length - 1];

    const nearToken = cappedTokens.find(t => t.symbol === 'NEAR' || t.symbol === 'wNEAR');

    const totalVolume1h = cappedTokens.reduce((sum, t) => sum + (t.volume1h || 0), 0);

    const top5Mcap = cappedTokens.slice(0, 5).reduce((sum, t) => sum + t.marketCap, 0);
    const dominanceTop5 = totalMarketCap > 0 ? Math.round((top5Mcap / totalMarketCap) * 100) : 0;

    return NextResponse.json({
      tokens: cappedTokens,
      stats: {
        totalTokens: cappedTokens.length,
        totalMarketCap,
        totalVolume24h,
        totalLiquidity,
        gainersCount,
        losersCount,
        avgHealthScore,
        categoryBreakdown,
        totalTxns24h,
        buyPressure,
        newPairsLast24h,
        topGainerSymbol: topGainer?.symbol || null,
        topGainerChange: topGainer?.priceChange24h || 0,
        topLoserSymbol: topLoser?.symbol || null,
        topLoserChange: topLoser?.priceChange24h || 0,
        nearPrice: nearToken?.price || null,
        nearPriceChange24h: nearToken?.priceChange24h || null,
        totalVolume1h,
        dominanceTop5,
      },
      lastUpdated: new Date().toISOString(),
      sources: ['dexscreener'],
      period,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Void Bubbles API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    );
  }
}
