/* ─── /api/achievements — Achievement Sync API ──────────────
 * GET:  Fetch user's unlocked achievements + stats
 * POST: Sync achievements + stats from client
 * Requires authenticated session (wallet connected).
 * ────────────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { ACHIEVEMENT_MAP } from '@/lib/achievements';

// GET — load user's achievements + stats
export async function GET(request: NextRequest) {
  const session = getAuthenticatedUser(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Fetch unlocked achievements
  const { data: achievements } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', session.userId)
    .order('unlocked_at', { ascending: true });

  // Fetch stats
  const { data: statsRow } = await supabase
    .from('user_achievement_stats')
    .select('stats, updated_at')
    .eq('user_id', session.userId)
    .single();

  return NextResponse.json({
    achievements: achievements || [],
    stats: statsRow?.stats || {},
    featured: statsRow?.stats?.featured || [],
  });
}

// POST — sync achievements + stats from client
export async function POST(request: NextRequest) {
  const session = getAuthenticatedUser(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { newAchievements, stats, featured } = body as {
      newAchievements?: string[];
      stats?: Record<string, unknown>;
      featured?: string[];
    };

    const supabase = createAdminClient();

    // Upsert new achievements
    if (newAchievements && newAchievements.length > 0) {
      // Validate achievement IDs
      const validIds = newAchievements.filter(id => ACHIEVEMENT_MAP[id]);

      if (validIds.length > 0) {
        const rows = validIds.map(id => ({
          user_id: session.userId,
          achievement_id: id,
        }));

        await supabase
          .from('user_achievements')
          .upsert(rows, { onConflict: 'user_id,achievement_id', ignoreDuplicates: true });
      }

      // Calculate total achievement XP and update user's xp_points
      const { data: allAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', session.userId);

      if (allAchievements) {
        let totalXp = 0;
        for (const row of allAchievements) {
          const def = ACHIEVEMENT_MAP[row.achievement_id];
          if (def) totalXp += def.xp;
        }

        // Update base XP from stats too
        const s = stats || {};
        const activityXp =
          ((s.voidsExplored as number) || 0) * 10 +
          ((s.briefsGenerated as number) || 0) * 50 +
          ((s.sanctumMessages as number) || 0) * 5 +
          ((s.codeGenerations as number) || 0) * 25 +
          ((s.contractsDeployed as number) || 0) * 500 +
          ((s.modulesCompleted as number) || 0) * 75 +
          ((s.walletsAnalyzed as number) || 0) * 25;

        await supabase
          .from('users')
          .update({ xp_points: totalXp + activityXp })
          .eq('id', session.userId);
      }
    }

    // Upsert stats (merge with existing)
    if (stats || featured) {
      const statsPayload = { ...(stats || {}), ...(featured ? { featured } : {}) };

      await supabase
        .from('user_achievement_stats')
        .upsert(
          {
            user_id: session.userId,
            stats: statsPayload,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Achievements API] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
