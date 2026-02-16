import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, rotateSessionIfNeeded } from '@/lib/auth/verify-request';
import { createAdminClient } from '@/lib/supabase/admin';

// ── GET /api/sanctum/conversations/[id] — load full conversation with messages ──
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  // Load conversation (verify ownership)
  const { data: conv, error: convErr } = await supabase
    .from('sanctum_conversations')
    .select('*')
    .eq('id', id)
    .eq('user_id', auth.userId)
    .single();

  if (convErr || !conv) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Load messages
  const { data: messages, error: msgErr } = await supabase
    .from('sanctum_messages')
    .select('role, content, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  if (msgErr) {
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 });
  }

  const response = NextResponse.json({
    conversation: conv,
    messages: messages || [],
  });
  rotateSessionIfNeeded(response, auth.userId, auth.accountId, auth.shouldRotate);
  return response;
}

// ── DELETE /api/sanctum/conversations/[id] — delete a conversation ──
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  // Messages cascade-delete via FK
  const { error } = await supabase
    .from('sanctum_conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', auth.userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  rotateSessionIfNeeded(response, auth.userId, auth.accountId, auth.shouldRotate);
  return response;
}
