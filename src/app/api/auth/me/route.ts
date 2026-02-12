import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET /api/auth/me — Check if current session is valid and return user data.
 * Used by WalletContext to restore sessions without re-signing.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      // Invalid/expired token — clear the cookie
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.set(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    // Fetch user from Supabase
    const supabase = createAdminClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
