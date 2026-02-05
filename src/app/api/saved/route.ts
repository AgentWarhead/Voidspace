import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { rateLimit } from '@/lib/auth/rate-limit';
import { isValidUUID } from '@/lib/auth/validate';
import { canSaveOpportunity } from '@/lib/tiers';
import type { TierName } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`saved:${ip}`, 30, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = auth.userId;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('saved_opportunities')
      .select('*, opportunity:opportunities(*, category:categories(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: data || [] });
  } catch (err) {
    console.error('Saved GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`saved:${ip}`, 30, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = auth.userId;

    const { opportunityId } = await request.json();
    if (!opportunityId || !isValidUUID(opportunityId)) {
      return NextResponse.json(
        { error: 'Valid opportunityId is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get user tier
    const { data: user } = await supabase
      .from('users')
      .select('tier')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Count existing saved
    const { count } = await supabase
      .from('saved_opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (!canSaveOpportunity(user.tier as TierName, count || 0)) {
      return NextResponse.json(
        { error: 'Save limit reached for your tier' },
        { status: 403 }
      );
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_opportunities')
      .select('id')
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId)
      .single();

    if (existing) {
      return NextResponse.json({ saved: existing });
    }

    const { data, error } = await supabase
      .from('saved_opportunities')
      .insert({
        user_id: userId,
        opportunity_id: opportunityId,
        status: 'saved',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: data });
  } catch (err) {
    console.error('Saved POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`saved:${ip}`, 60, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = auth.userId;

    const { opportunityId, status, notes, progress, health } = await request.json();
    if (!opportunityId || !isValidUUID(opportunityId)) {
      return NextResponse.json(
        { error: 'Valid opportunityId is required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['saved', 'researching', 'building', 'shipped', 'paused'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Validate health if provided
    const validHealth = ['green', 'yellow', 'red'];
    if (health && !validHealth.includes(health)) {
      return NextResponse.json({ error: 'Invalid health' }, { status: 400 });
    }

    // Validate progress if provided
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return NextResponse.json({ error: 'Progress must be 0-100' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // Build update object
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (progress !== undefined) updates.progress = progress;
    if (health) updates.health = health;

    const { data, error } = await supabase
      .from('saved_opportunities')
      .update(updates)
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId)
      .select('*, opportunity:opportunities(*, category:categories(*))')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: data });
  } catch (err) {
    console.error('Saved PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`saved:${ip}`, 30, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = auth.userId;

    const { opportunityId } = await request.json();
    if (!opportunityId || !isValidUUID(opportunityId)) {
      return NextResponse.json(
        { error: 'Valid opportunityId is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Saved DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
