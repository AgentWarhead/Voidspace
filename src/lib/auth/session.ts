import { createHmac } from 'crypto';

export const SESSION_COOKIE_NAME = 'vs_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

/**
 * Creates an HMAC-signed session token containing userId, accountId, and timestamp.
 */
export function createSessionToken(userId: string, accountId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${userId}:${accountId}:${timestamp}`;
  const signature = sign(payload);
  return `${payload}:${signature}`;
}

/**
 * Verifies an HMAC-signed session token.
 * Returns the parsed user info if valid, or null if invalid/expired.
 */
export function verifySessionToken(token: string): { userId: string; accountId: string } | null {
  const parts = token.split(':');
  if (parts.length !== 4) return null;

  const [userId, accountId, timestamp, signature] = parts;
  if (!userId || !accountId || !timestamp || !signature) return null;

  // Verify signature
  const payload = `${userId}:${accountId}:${timestamp}`;
  const expectedSignature = sign(payload);
  if (signature !== expectedSignature) return null;

  // Check expiry
  const tokenAge = Date.now() - parseInt(timestamp, 10);
  if (isNaN(tokenAge) || tokenAge > SESSION_MAX_AGE * 1000) return null;

  return { userId, accountId };
}

export { SESSION_MAX_AGE };
