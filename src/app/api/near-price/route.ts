import { NextResponse } from 'next/server';

export interface NearPriceData {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
}

// Cache the response for 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const response = await fetch(
      'https://api.dexscreener.com/latest/dex/tokens/wrap.near',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`DexScreener API returned ${response.status}`);
    }

    const data = await response.json();
    const pairs = data?.pairs;

    if (!Array.isArray(pairs) || pairs.length === 0) {
      throw new Error('No pairs found for wNEAR on DexScreener');
    }

    // Find the wNEAR/USDC or wNEAR/USDT pair with highest liquidity
    const stablePairs = pairs.filter((p: Record<string, unknown>) => {
      const quoteSymbol = (p?.quoteToken as Record<string, unknown>)?.symbol as string | undefined;
      const baseSymbol = (p?.baseToken as Record<string, unknown>)?.symbol as string | undefined;
      const isNearBase = baseSymbol === 'wNEAR' || baseSymbol === 'NEAR';
      const isStableQuote = quoteSymbol === 'USDC' || quoteSymbol === 'USDt' || quoteSymbol === 'USDC.e' || quoteSymbol === 'USDT';
      return isNearBase && isStableQuote && (p?.chainId === 'near');
    });

    // If no stable pairs found, fall back to any wNEAR pair on NEAR chain
    const candidatePairs = stablePairs.length > 0
      ? stablePairs
      : pairs.filter((p: Record<string, unknown>) => {
          const baseSymbol = (p?.baseToken as Record<string, unknown>)?.symbol as string | undefined;
          return (baseSymbol === 'wNEAR' || baseSymbol === 'NEAR') && p?.chainId === 'near';
        });

    if (candidatePairs.length === 0) {
      throw new Error('No suitable wNEAR pairs found');
    }

    // Sort by liquidity descending, pick the best
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    candidatePairs.sort((a: any, b: any) => {
      const liqA = a?.liquidity?.usd ?? 0;
      const liqB = b?.liquidity?.usd ?? 0;
      return liqB - liqA;
    });

    const bestPair = candidatePairs[0];

    const price = parseFloat(bestPair?.priceUsd) || 0;
    const change24h = bestPair?.priceChange?.h24 ?? 0;
    const volume24h = bestPair?.volume?.h24 ?? 0;
    const marketCap = bestPair?.marketCap ?? bestPair?.fdv ?? 0;

    const priceData: NearPriceData = {
      price,
      change24h,
      marketCap,
      volume24h,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(priceData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching NEAR price:', error);

    // Return a fallback response on error
    return NextResponse.json(
      {
        price: 0,
        change24h: 0,
        marketCap: 0,
        volume24h: 0,
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
