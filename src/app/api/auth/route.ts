import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth/session';
import { rateLimit } from '@/lib/auth/rate-limit';
import { isValidNearAccountId } from '@/lib/auth/validate';
import * as nacl from 'tweetnacl';

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

/**
 * Verify NEAR wallet signature using ed25519 cryptographic verification.
 * Requires message, signature, and publicKey for proper authentication.
 */
async function verifyNearSignature(
  accountId: string,
  message: string,
  signature: string,
  publicKey: string
): Promise<{ valid: boolean }> {
  try {
    // Validate expected message format
    const expectedMessageStart = `Sign in to Voidspace\nAccount: ${accountId}\nNonce:`;
    if (!message.startsWith(expectedMessageStart)) {
      console.warn(`[AUTH] Invalid message format for account ${accountId}`);
      return { valid: false };
    }

    // Convert inputs to byte arrays
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signature, 'base64');
    const publicKeyBytes = Buffer.from(publicKey, 'base64');

    // Verify signature using tweetnacl's ed25519 verification
    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!isValid) {
      console.warn(`[AUTH] Invalid signature for account ${accountId}`);
    }

    return { valid: isValid };

  } catch (error) {
    console.error('[AUTH] Signature verification error:', error);
    return { valid: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, 10, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { accountId, message, signature, publicKey } = await request.json();

    if (!accountId || typeof accountId !== 'string' || !isValidNearAccountId(accountId)) {
      return NextResponse.json(
        { error: 'Valid accountId is required' },
        { status: 400 }
      );
    }

    // Require signature verification - all fields must be provided
    if (!message || !signature || !publicKey) {
      return NextResponse.json(
        { error: 'message, signature, and publicKey are required for authentication' },
        { status: 401 }
      );
    }

    // Verify NEAR wallet signature
    const signatureCheck = await verifyNearSignature(accountId, message, signature, publicKey);
    if (!signatureCheck.valid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
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
      // Handle race condition: another request created the user between SELECT and INSERT
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
      console.error('Failed to create user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
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
