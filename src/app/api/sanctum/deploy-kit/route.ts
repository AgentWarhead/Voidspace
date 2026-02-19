import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// POST /api/sanctum/deploy-kit — store contract code temporarily, return kit ID
export async function POST(request: NextRequest) {
  try {
    const { code, contractName, category } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing contract code' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('deploy_kits')
      .insert({
        code,
        contract_name: contractName || 'my-contract',
        category: category || null,
        // expires_at: 24h from now
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('deploy-kit insert error:', error);
      return NextResponse.json({ error: 'Failed to store kit' }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error('deploy-kit POST error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET /api/sanctum/deploy-kit?id=<uuid> — return raw Rust code for Gitpod startup script
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('deploy_kits')
    .select('code, expires_at')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Kit not found' }, { status: 404 });
  }

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Kit expired' }, { status: 410 });
  }

  // Return raw Rust code so Gitpod can curl it directly into src/lib.rs
  return new NextResponse(data.code, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
