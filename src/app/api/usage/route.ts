import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

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
