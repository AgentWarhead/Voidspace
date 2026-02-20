import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateOpportunities } from '@/lib/sync/opportunities';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  // Auth — same SYNC_API_KEY
  const expectedKey = process.env.SYNC_API_KEY;
  if (!expectedKey) {
    return NextResponse.json({ error: 'SYNC_API_KEY not configured' }, { status: 500 });
  }
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
  let authorized = false;
  try {
    authorized =
      token.length === expectedKey.length &&
      timingSafeEqual(Buffer.from(token), Buffer.from(expectedKey));
  } catch {
    authorized = false;
  }
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const start = Date.now();

  try {
    const result = await generateOpportunities(supabase);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    return NextResponse.json({
      success: true,
      created: result.created,
      updated: result.updated,
      elapsed: `${elapsed}s`,
      ...(result.error ? { warning: result.error } : {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    usage: 'POST /api/sync/voids -H "Authorization: Bearer SYNC_API_KEY"',
    description: 'Regenerate voids only — skips full ecosystem sync',
  });
}
