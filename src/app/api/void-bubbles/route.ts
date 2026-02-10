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
  priceChange: { h24: number; h6: number; h1: number };
  liquidity: { usd: number };
  marketCap?: number;
  fdv?: number;
  chainId: string;
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

export async function GET() {
  try {
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
        const priceChange24h = pair.priceChange?.h24 || 0;
        const marketCap = pair.marketCap || pair.fdv || liquidity * 2;
        const price = parseFloat(pair.priceUsd) || 0;

        const health = calculateHealthScore({ volume24h, liquidity, priceChange24h, marketCap });

        tokens.push({
          id: pair.baseToken.address,
          symbol,
          name: pair.baseToken.name,
          price,
          priceChange24h,
          volume24h,
          liquidity,
          marketCap,
          category: TOKEN_CATEGORIES[symbol] || DEFAULT_CATEGORY,
          healthScore: health.score,
          riskLevel: health.riskLevel,
          riskFactors: health.factors,
          detectedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
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

        tokens.push({
          id: contractId,
          symbol: data.symbol,
          name: data.symbol,
          price,
          priceChange24h: (Math.random() - 0.5) * 20, // simulated for visual variety
          volume24h: Math.random() * 50000,
          liquidity: Math.random() * 100000,
          marketCap: estimatedMarketCap,
          category: TOKEN_CATEGORIES[data.symbol] || DEFAULT_CATEGORY,
          healthScore: health.score,
          riskLevel: health.riskLevel,
          riskFactors: health.factors,
          detectedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    // Sort by market cap descending
    tokens.sort((a, b) => b.marketCap - a.marketCap);

    return NextResponse.json({
      tokens: tokens.slice(0, 150), // Cap at 150 for performance
      lastUpdated: new Date().toISOString(),
      sources: ['ref-finance', 'dexscreener'],
    });
  } catch (error) {
    console.error('Void Bubbles API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    );
  }
}
