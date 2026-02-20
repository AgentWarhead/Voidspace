import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, rotateSessionIfNeeded } from '@/lib/auth/verify-request';
import { createAdminClient } from '@/lib/supabase/admin';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';

// ── GET /api/sanctum/conversations — list user's conversations ──
export async function GET(request: NextRequest) {
  const auth = getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check tier — free users don't get server-side history browsing
  const supabase = createAdminClient();
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', auth.userId)
    .single();
  const userTier: SanctumTier = (sub?.tier as SanctumTier) || 'shade';

  if (userTier === 'shade') {
    return NextResponse.json({
      conversations: [],
      message: 'Cloud conversation history requires a paid subscription.',
      tier: userTier,
    });
  }

  const { data: conversations, error } = await supabase
    .from('sanctum_conversations')
    .select('id, title, category, persona, mode, message_count, last_message_at, created_at, updated_at')
    .eq('user_id', auth.userId)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: 'Failed to load conversations' }, { status: 500 });
  }

  const response = NextResponse.json({ conversations: conversations || [] });
  rotateSessionIfNeeded(response, auth.userId, auth.accountId, auth.shouldRotate);
  return response;
}

// ── POST /api/sanctum/conversations — create or update conversation + save messages ──
// NOTE: All authenticated users can save (POST). The tier gate only applies to GET (history list).
// Free/shade tier users get a single active session backed up to cloud — they just can't browse history.
export async function POST(request: NextRequest) {
  const auth = getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    const body = await request.json();
    const { conversationId, title, category, persona, mode, messages, contractCode } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    let convId = conversationId;

    // Create conversation if new
    if (!convId) {
      const insertData: Record<string, unknown> = {
        user_id: auth.userId,
        title: title || 'Untitled Session',
        category: category || null,
        persona: persona || 'shade',
        mode: mode || 'learn',
        message_count: messages.length,
        last_message_at: new Date().toISOString(),
      };
      // Persist contract code if provided
      if (contractCode !== undefined && contractCode !== null) {
        insertData.contract_code = contractCode;
      }

      const { data: conv, error: convErr } = await supabase
        .from('sanctum_conversations')
        .insert(insertData)
        .select('id')
        .single();

      if (convErr || !conv) {
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
      }
      convId = conv.id;
    } else {
      // Update existing conversation metadata + contract code
      const updateData: Record<string, unknown> = {
        message_count: messages.length,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (contractCode !== undefined && contractCode !== null) {
        updateData.contract_code = contractCode;
      }

      await supabase
        .from('sanctum_conversations')
        .update(updateData)
        .eq('id', convId)
        .eq('user_id', auth.userId);
    }

    // Upsert messages — delete old ones and insert fresh batch
    // This is simpler than diffing and handles message edits/regeneration
    await supabase
      .from('sanctum_messages')
      .delete()
      .eq('conversation_id', convId);

    const messageRows = messages.map((m: { role: string; content: string }, i: number) => ({
      conversation_id: convId,
      role: m.role,
      content: m.content,
      created_at: new Date(Date.now() + i).toISOString(), // preserve order
    }));

    const { error: msgErr } = await supabase
      .from('sanctum_messages')
      .insert(messageRows);

    if (msgErr) {
      return NextResponse.json({ error: 'Failed to save messages' }, { status: 500 });
    }

    const response = NextResponse.json({ conversationId: convId, saved: messages.length });
    rotateSessionIfNeeded(response, auth.userId, auth.accountId, auth.shouldRotate);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
