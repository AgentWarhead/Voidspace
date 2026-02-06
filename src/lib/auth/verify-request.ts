import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken, createSessionToken, SESSION_MAX_AGE } from './session';

interface AuthResult {
  userId: string;
  accountId: string;
  shouldRotate: boolean;
}

/**
 * Extracts and verifies the authenticated user from the session cookie.
 * Returns { userId, accountId, shouldRotate } if valid, or null if not authenticated.
 */
export function getAuthenticatedUser(request: NextRequest): AuthResult | null {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Helper to set a new session token if rotation is needed.
 * Call this when shouldRotate is true to refresh the user's session.
 */
export function rotateSessionIfNeeded(
  response: NextResponse, 
  userId: string, 
  accountId: string, 
  shouldRotate: boolean
): void {
  if (shouldRotate) {
    const newToken = createSessionToken(userId, accountId);
    response.cookies.set(SESSION_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
  }
}
