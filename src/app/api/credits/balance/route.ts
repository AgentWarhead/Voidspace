// ============================================================
// Credit Balance API
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getBalance } from '@/lib/credits';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const balance = await getBalance(userId);
    return NextResponse.json(balance);
  } catch (error) {
    console.error('[Credits Balance] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
