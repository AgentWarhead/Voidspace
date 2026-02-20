import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const body = await req.json();

  const { projectName, projectUrl, note, walletAddress } = body;

  if (!walletAddress || !params.id) {
    return NextResponse.json(
      { error: 'wallet address and void id required' },
      { status: 400 },
    );
  }

  // Rate limit: one flag per wallet per void
  const { data: existing } = await supabase
    .from('void_flags')
    .select('id')
    .eq('opportunity_id', params.id)
    .eq('flagged_by', walletAddress)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'already flagged' }, { status: 409 });
  }

  const { error } = await supabase.from('void_flags').insert({
    opportunity_id: params.id,
    flagged_by: walletAddress,
    project_name: projectName ?? null,
    project_url: projectUrl ?? null,
    note: note ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
