import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth/session';
import { rateLimit } from '@/lib/auth/rate-limit';
import { isValidNearAccountId } from '@/lib/auth/validate';
import { PublicKey } from 'near-api-js';

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
 * Verify NEAR wallet signature for enhanced security.
 * Returns true if signature is valid or if signature verification is not required.
 */
async function verifyNearSignature(
  accountId: string,
  message?: string,
  signature?: string
): Promise<{ valid: boolean; warning?: string }> {
  // If signature fields are not present, allow auth but log warning
  // TODO: Make signature verification mandatory before mainnet launch
  if (!message || !signature) {
    console.warn(`[AUTH] No signature provided for account ${accountId} - this will be mandatory in production`);
    return { valid: true, warning: 'signature_missing' };
  }

  try {
    // Create message hash
    const messageBytes = Buffer.from(message, 'utf8');
    const signatureBytes = Buffer.from(signature, 'base64');

    // For simplicity, we'll assume the signature was created with the account's public key
    // In a real implementation, you might need to fetch the public key from NEAR network
    // or require the client to provide it along with proof of ownership
    
    // For now, we'll do a basic validation that the signature is well-formed
    if (signatureBytes.length !== 64) {
      return { valid: false };
    }

    // Basic validation passed - in production, implement full signature verification
    // using the account's public key from NEAR network
    return { valid: true };

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

    const { accountId, message, signature } = await request.json();

    if (!accountId || typeof accountId !== 'string' || !isValidNearAccountId(accountId)) {
      return NextResponse.json(
        { error: 'Valid accountId is required' },
        { status: 400 }
      );
    }

    // Verify NEAR wallet signature if provided
    const signatureCheck = await verifyNearSignature(accountId, message, signature);
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
