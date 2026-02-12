import { NextResponse } from 'next/server';
import { fetchTokenBySymbol, fetchTokenByAddress } from '@/lib/dexscreener';

export const dynamic = 'force-dynamic';

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
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
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
