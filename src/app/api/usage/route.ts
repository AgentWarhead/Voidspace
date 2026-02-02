import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { rateLimit } from '@/lib/auth/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`usage:${ip}`, 30, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = auth.userId;

    const supabase = createAdminClient();

    // Monthly brief count
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { count: briefsThisMonth } = await supabase
      .from('usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', 'brief_generated')
      .gte('created_at', monthStart.toISOString());

    // Daily preview count
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);

    const { count: previewsToday } = await supabase
      .from('usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', 'brief_preview')
      .gte('created_at', dayStart.toISOString());

    // Saved count
    const { count: savedCount } = await supabase
      .from('saved_opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return NextResponse.json({
      briefsThisMonth: briefsThisMonth || 0,
      previewsToday: previewsToday || 0,
      savedCount: savedCount || 0,
    });
  } catch (err) {
    console.error('Usage error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
