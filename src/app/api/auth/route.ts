import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth/session';
import { rateLimit } from '@/lib/auth/rate-limit';
import { isValidNearAccountId } from '@/lib/auth/validate';
import { verifySignature } from '@/lib/auth/verify-nep413';

function respondWithSession(user: { id: string }, accountId: string) {
  const token = createSessionToken(user.id, accountId);
  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, 10, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { accountId, message, signature, publicKey, nonce, recipient } = await request.json();

    if (!accountId || typeof accountId !== 'string' || !isValidNearAccountId(accountId)) {
      return NextResponse.json(
        { error: 'Valid accountId is required' },
        { status: 400 }
      );
    }

    // Require NEP-413 signature verification
    if (!message || !signature || !publicKey || !nonce || !recipient) {
      return NextResponse.json(
        { error: 'NEP-413 signed message required (message, signature, publicKey, nonce, recipient)' },
        { status: 401 }
      );
    }

    // Validate recipient matches our domain
    if (recipient !== 'voidspace.io') {
      return NextResponse.json(
        { error: 'Invalid recipient' },
        { status: 401 }
      );
    }

    // Verify NEP-413 signature using wallet-selector's built-in verifier
    const nonceBuffer = Buffer.from(nonce, 'base64');
    const isValid = verifySignature({
      publicKey,
      signature,
      message,
      nonce: nonceBuffer,
      recipient,
    });

    if (!isValid) {
      console.warn(`[AUTH] Invalid NEP-413 signature for account ${accountId}`);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // Try to find existing user
    const { data: existing, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('near_account_id', accountId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = "no rows found" (expected for new users)
      console.error('[AUTH] Supabase SELECT error:', JSON.stringify(selectError));
      return NextResponse.json(
        { error: 'Database error', detail: selectError.message, code: selectError.code },
        { status: 500 }
      );
    }

    if (existing) {
      return respondWithSession(existing, accountId);
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
      // Handle race condition
      if (error.code === '23505') {
        const { data: raceUser } = await supabase
          .from('users')
          .select('*')
          .eq('near_account_id', accountId)
          .single();
        if (raceUser) {
          return respondWithSession(raceUser, accountId);
        }
      }
      console.error('Failed to create user:', JSON.stringify(error));
      return NextResponse.json(
        { error: 'Failed to create user', detail: error.message, code: error.code },
        { status: 500 }
      );
    }

    return respondWithSession(newUser, accountId);
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
