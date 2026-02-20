/* ─── /api/progress — Module Progress API ──────────────────────
 * GET:  Check if a specific module is completed for the user
 * POST: Mark a module as complete
 * Requires authenticated session (wallet connected).
 * ────────────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';

// GET — check if a specific module is completed
export async function GET(request: NextRequest) {
  const session = getAuthenticatedUser(request);
  if (!session) {
    return NextResponse.json({ completed: false });
  }

  const { searchParams } = new URL(request.url);
  const moduleSlug = searchParams.get('moduleSlug');
  if (!moduleSlug) {
    return NextResponse.json({ error: 'moduleSlug required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('user_module_progress')
    .select('id')
    .eq('user_id', session.userId)
    .eq('module_slug', moduleSlug)
    .single();

  return NextResponse.json({ completed: !!data });
}

// POST — mark a module as complete
export async function POST(request: NextRequest) {
  const session = getAuthenticatedUser(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { moduleSlug, track } = await request.json() as { moduleSlug: string; track: string };
    if (!moduleSlug || !track) {
      return NextResponse.json({ error: 'moduleSlug and track required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('user_module_progress')
      .upsert(
        { user_id: session.userId, module_slug: moduleSlug, track },
        { onConflict: 'user_id,module_slug', ignoreDuplicates: true }
      );

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Progress API] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
