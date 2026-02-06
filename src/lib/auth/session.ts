import { createHmac, timingSafeEqual } from 'crypto';
import { isRevoked } from './session-store';

export const SESSION_COOKIE_NAME = 'vs_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

interface SessionData {
  userId: string;
  accountId: string;
  issuedAt: number;
}

interface StructuredToken {
  v: number; // version
  d: SessionData; // data
  s: string; // signature
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  if (secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long for security');
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Creates a structured, HMAC-signed session token containing userId, accountId, and timestamp.
 */
export function createSessionToken(userId: string, accountId: string): string {
  const sessionData: SessionData = {
    userId,
    accountId,
    issuedAt: Date.now()
  };

  const dataJson = JSON.stringify(sessionData);
  const signature = sign(dataJson);
  
  const token: StructuredToken = {
    v: 1,
    d: sessionData,
    s: signature
  };

  return Buffer.from(JSON.stringify(token)).toString('base64url');
}

interface VerifyResult {
  userId: string;
  accountId: string;
  shouldRotate: boolean;
}

/**
 * Verifies a structured session token with revocation check and rotation detection.
 * Returns the parsed user info if valid, or null if invalid/expired/revoked.
 */
export function verifySessionToken(token: string): VerifyResult | null {
  try {
    // Decode structured token
    const tokenJson = Buffer.from(token, 'base64url').toString();
    const structuredToken: StructuredToken = JSON.parse(tokenJson);
    
    // Validate structure
    if (!structuredToken.v || !structuredToken.d || !structuredToken.s) {
      return null;
    }

    const { userId, accountId, issuedAt } = structuredToken.d;
    if (!userId || !accountId || typeof issuedAt !== 'number') {
      return null;
    }

    // Verify signature using constant-time comparison
    const dataJson = JSON.stringify(structuredToken.d);
    const expectedSignature = sign(dataJson);
    if (!safeEqual(structuredToken.s, expectedSignature)) {
      return null;
    }

    // Check expiry
    const tokenAge = Date.now() - issuedAt;
    if (tokenAge < 0 || tokenAge > SESSION_MAX_AGE * 1000) {
      return null;
    }

    // Check revocation
    if (isRevoked(userId)) {
      return null;
    }

    // Check if token should be rotated (>50% through its lifetime)
    const rotationThreshold = (SESSION_MAX_AGE * 1000) * 0.5;
    const shouldRotate = tokenAge > rotationThreshold;

    return {
      userId,
      accountId,
      shouldRotate
    };

  } catch {
    // Invalid token format
    return null;
  }
}

export { SESSION_MAX_AGE };
