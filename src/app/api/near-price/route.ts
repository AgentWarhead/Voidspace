import { NextResponse } from 'next/server';
import { fetchNearTokens } from '@/lib/dexscreener';

export interface NearPriceData {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
}

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const tokens = await fetchNearTokens();

    // Find the wNEAR or NEAR token (highest liquidity pair is already selected by the shared lib)
    const nearToken = tokens.find(
      (t) => t.symbol === 'wNEAR' || t.symbol === 'NEAR'
    );

    if (!nearToken) {
      throw new Error('No suitable wNEAR/NEAR token found');
    }

    const priceData: NearPriceData = {
      price: nearToken.price,
      change24h: nearToken.priceChange24h,
      marketCap: nearToken.marketCap,
      volume24h: nearToken.volume24h,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(priceData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching NEAR price:', error);

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
