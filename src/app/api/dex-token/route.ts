import { NextResponse } from 'next/server';
import { fetchTokenBySymbol, fetchTokenByAddress } from '@/lib/dexscreener';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const address = searchParams.get('address');

    if (!symbol && !address) {
      return NextResponse.json(
        { error: 'Missing required parameter: symbol or address' },
        { status: 400 }
      );
    }

    let token = null;

    if (address) {
      token = await fetchTokenByAddress(address);
    } else if (symbol) {
      token = await fetchTokenBySymbol(symbol);
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found on NEAR DEXes' },
        { status: 404 }
      );
    }

    return NextResponse.json({ token }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('dex-token API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    );
  }
}
