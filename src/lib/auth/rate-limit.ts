const requests = new Map<string, number[]>();

/**
 * Simple in-memory sliding window rate limiter.
 * Returns whether the request is allowed and the remaining count.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = requests.get(key) || [];

  // Remove expired timestamps
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= limit) {
    requests.set(key, valid);
    return { allowed: false, remaining: 0 };
  }

  valid.push(now);
  requests.set(key, valid);

  // Periodic cleanup: remove stale keys
  if (Math.random() < 0.01) {
    requests.forEach((v: number[], k: string) => {
      const fresh = v.filter((t: number) => now - t < windowMs);
      if (fresh.length === 0) requests.delete(k);
      else requests.set(k, fresh);
    });
  }

  return { allowed: true, remaining: limit - valid.length };
}
