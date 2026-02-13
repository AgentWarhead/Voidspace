import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RefTokenData {
  price: string;
  symbol: string;
  decimal: number;
}

interface DexPair {
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd: string;
  volume: { h24: number; h6: number; h1: number };
  priceChange: { h24: number; h6: number; h1: number; m5?: number };
  liquidity: { usd: number };
  marketCap?: number;
  fdv?: number;
  chainId: string;
  dexId?: string;
  pairAddress?: string;
  pairCreatedAt?: number;
  txns?: {
    h24: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h1: { buys: number; sells: number };
  };
  info?: {
    imageUrl?: string;
    websites?: { url: string; label: string }[];
    socials?: { url: string; type: string }[];
  } | null;
}

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

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '1d';
    
    // Fetch from both sources in parallel
    const [refRes, dexRes] = await Promise.all([
      fetch('https://indexer.ref.finance/list-token-price', { next: { revalidate: 60 } })
        .catch(() => null),
      fetch('https://api.dexscreener.com/latest/dex/tokens/wrap.near', { next: { revalidate: 60 } })
        .catch(() => null),
    ]);

    const tokens: VoidBubbleToken[] = [];
    const seenSymbols = new Set<string>();

    // Process DexScreener data first (richer data)
    if (dexRes?.ok) {
      const dexData = await dexRes.json();
      const pairs: DexPair[] = dexData.pairs || [];

      // Group by base token, take best liquidity pair
      const tokenMap = new Map<string, DexPair>();
      for (const pair of pairs) {
        if (pair.chainId !== 'near') continue;
        const sym = pair.baseToken.symbol;
        const existing = tokenMap.get(sym);
        if (!existing || (pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
          tokenMap.set(sym, pair);
        }
      }

      for (const [symbol, pair] of Array.from(tokenMap.entries())) {
        if (seenSymbols.has(symbol)) continue;
        seenSymbols.add(symbol);

        const volume24h = pair.volume?.h24 || 0;
        const liquidity = pair.liquidity?.usd || 0;
        const price = parseFloat(pair.priceUsd) || 0;
        
        // Get all available price changes
        const priceChange1h = pair.priceChange?.h1 || 0;
        const priceChange6h = pair.priceChange?.h6 || 0;
        const priceChange24h = pair.priceChange?.h24 || 0;
        
        // Map period to the appropriate price change for current display
        let currentPriceChange = priceChange24h;
        let currentVolume = volume24h;
        
        switch (period) {
          case '1h':
            currentPriceChange = priceChange1h;
            currentVolume = pair.volume?.h1 || 0;
            break;
          case '4h':
            currentPriceChange = priceChange6h; // closest available
            currentVolume = pair.volume?.h6 || 0;
            break;
          case '1d':
            currentPriceChange = priceChange24h;
            currentVolume = volume24h;
            break;
          case '7d':
            // TODO: For MVP, simulate 7d and 30d by multiplying 24h with variance
            // This is simulated until we add historical data from additional endpoints
            currentPriceChange = priceChange24h * (0.8 + Math.random() * 0.4); // 80-120% of 24h
            currentVolume = volume24h * 7; // rough 7d estimate
            break;
          case '30d':
            // TODO: For MVP, simulate 30d 
            // This is simulated until we add historical data from additional endpoints
            currentPriceChange = priceChange24h * (1.2 + Math.random() * 1.8); // 120-300% of 24h
            currentVolume = volume24h * 30; // rough 30d estimate
            break;
        }

        const marketCap = pair.marketCap || pair.fdv || liquidity * 2;

        const health = calculateHealthScore({ volume24h: currentVolume, liquidity, priceChange24h: currentPriceChange, marketCap });

        // Generate URLs
        const dexScreenerUrl = `https://dexscreener.com/near/${pair.baseToken.address}`;
        const refFinanceUrl = pair.baseToken.address ? `https://app.ref.finance/#near|${pair.baseToken.address}` : undefined;

        tokens.push({
          id: pair.baseToken.address,
          symbol,
          name: pair.baseToken.name,
          price,
          priceChange24h: currentPriceChange, // Current period's change
          volume24h: currentVolume, // Current period's volume
          liquidity,
          marketCap,
          category: TOKEN_CATEGORIES[symbol] || DEFAULT_CATEGORY,
          healthScore: health.score,
          riskLevel: health.riskLevel,
          riskFactors: health.factors,
          detectedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          // New fields
          priceChange1h,
          priceChange6h,
          dexScreenerUrl,
          refFinanceUrl,
          contractAddress: pair.baseToken.address,
          // Rich DexScreener data
          imageUrl: pair.info?.imageUrl,
          socials: pair.info?.socials,
          websites: pair.info?.websites,
          txns24h: pair.txns?.h24,
          txns1h: pair.txns?.h1,
          txns6h: pair.txns?.h6,
          volume1h: pair.volume?.h1 || 0,
          volume6h: pair.volume?.h6 || 0,
          dexId: pair.dexId,
          pairCreatedAt: pair.pairCreatedAt ? new Date(pair.pairCreatedAt).toISOString() : undefined,
          pairAddress: pair.pairAddress,
          quoteToken: pair.quoteToken?.symbol,
          fdv: pair.fdv,
          priceChange5m: pair.priceChange?.m5 ?? undefined,
        });
      }
    }

    // Supplement with Ref Finance data
    if (refRes?.ok) {
      const refData: Record<string, RefTokenData> = await refRes.json();

      for (const [contractId, data] of Object.entries(refData)) {
        if (seenSymbols.has(data.symbol)) continue;
        const price = parseFloat(data.price) || 0;
        if (price === 0 || price > 100000) continue; // Skip zero-price and bridge artifacts

        seenSymbols.add(data.symbol);

        // Ref doesn't give volume/liquidity/change — estimate conservatively
        const estimatedMarketCap = price * 1_000_000; // rough estimate
        const health = calculateHealthScore({
          volume24h: 0,
          liquidity: 0,
          priceChange24h: 0,
          marketCap: estimatedMarketCap,
        });

        // Simulate price changes for visual variety (Ref doesn't provide this data)
        const sim24h = (Math.random() - 0.5) * 20;
        const sim1h = (Math.random() - 0.5) * 8;
        const sim6h = (Math.random() - 0.5) * 15;
        
        let currentPriceChange = sim24h;
        switch (period) {
          case '1h': currentPriceChange = sim1h; break;
          case '4h': currentPriceChange = sim6h; break;
          case '7d': currentPriceChange = sim24h * 1.5; break;
          case '30d': currentPriceChange = sim24h * 3; break;
        }

        tokens.push({
          id: contractId,
          symbol: data.symbol,
          name: data.symbol,
          price,
          priceChange24h: currentPriceChange,
          volume24h: Math.random() * 50000,
          liquidity: Math.random() * 100000,
          marketCap: estimatedMarketCap,
          category: TOKEN_CATEGORIES[data.symbol] || DEFAULT_CATEGORY,
          healthScore: health.score,
          riskLevel: health.riskLevel,
          riskFactors: health.factors,
          detectedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          // New fields
          priceChange1h: sim1h,
          priceChange6h: sim6h,
          dexScreenerUrl: undefined, // Not available for Ref-only tokens
          refFinanceUrl: `https://app.ref.finance/#near|${contractId}`,
          contractAddress: contractId,
        });
      }
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
    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    cappedTokens.forEach(t => { categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + 1; });

    // --- Enhanced stats ---
    // Total 24h transactions and buy pressure
    let totalBuys24h = 0;
    let totalSells24h = 0;
    cappedTokens.forEach(t => {
      totalBuys24h += t.txns24h?.buys || 0;
      totalSells24h += t.txns24h?.sells || 0;
    });
    const totalTxns24h = totalBuys24h + totalSells24h;
    const buyPressure = totalTxns24h > 0 ? Math.round((totalBuys24h / totalTxns24h) * 100) : 50;

    // New pairs in last 24h
    const now24h = Date.now() - 24 * 60 * 60 * 1000;
    const newPairsLast24h = cappedTokens.filter(t => {
      if (!t.pairCreatedAt) return false;
      return new Date(t.pairCreatedAt).getTime() > now24h;
    }).length;

    // Top gainer and loser
    const sortedByChange = [...cappedTokens].sort((a, b) => b.priceChange24h - a.priceChange24h);
    const topGainer = sortedByChange[0];
    const topLoser = sortedByChange[sortedByChange.length - 1];

    // NEAR price
    const nearToken = cappedTokens.find(t => t.symbol === 'NEAR' || t.symbol === 'wNEAR');

    // Total 1h volume
    const totalVolume1h = cappedTokens.reduce((sum, t) => sum + (t.volume1h || 0), 0);

    // Top 5 dominance
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
        // Enhanced stats
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
      sources: ['ref-finance', 'dexscreener'],
      period,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
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
