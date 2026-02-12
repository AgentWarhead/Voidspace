// ============================================================
// Credit Transactions API
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getTransactions } from '@/lib/credits';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const limit = Number(request.nextUrl.searchParams.get('limit') || '50');
  const offset = Number(request.nextUrl.searchParams.get('offset') || '0');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const result = await getTransactions(userId, limit, offset);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Credits Transactions] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
