import { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from './session';

/**
 * Extracts and verifies the authenticated user from the session cookie.
 * Returns { userId, accountId } if valid, or null if not authenticated.
 */
export function getAuthenticatedUser(request: NextRequest): { userId: string; accountId: string } | null {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
