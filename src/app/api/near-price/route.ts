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
      'https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }

    const data = await response.json();
    const near = data.near;

    if (!near) {
      throw new Error('NEAR data not found in response');
    }

    const priceData: NearPriceData = {
      price: near.usd || 0,
      change24h: near.usd_24h_change || 0,
      marketCap: near.usd_market_cap || 0,
      volume24h: near.usd_24h_vol || 0,
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
