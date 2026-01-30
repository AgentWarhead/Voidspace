import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json();

    if (!accountId || typeof accountId !== 'string') {
      return NextResponse.json(
        { error: 'accountId is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Try to find existing user
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('near_account_id', accountId)
      .single();

    if (existing) {
      return NextResponse.json({ user: existing });
    }

    // Create new user with free tier
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        near_account_id: accountId,
        tier: 'shade',
        xp_points: 0,
        badges: [],
      })
      .select()
      .single();

    if (error) {
      // Handle race condition: another request created the user between SELECT and INSERT
      if (error.code === '23505') {
        const { data: raceUser } = await supabase
          .from('users')
          .select('*')
          .eq('near_account_id', accountId)
          .single();
        if (raceUser) {
          return NextResponse.json({ user: raceUser });
        }
      }
      console.error('Failed to create user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: newUser });
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
