interface RateLimiterConfig {
  limit: number;
  windowMs: number;
  maxMapSize?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime?: number;
}

interface StrictRateLimitResult extends RateLimitResult {
  headers: {
    'Retry-After'?: string;
    'X-RateLimit-Limit': string;
    'X-RateLimit-Remaining': string;
    'X-RateLimit-Reset'?: string;
  };
}

class RateLimiter {
  private requests = new Map<string, number[]>();
  private lastCleanup = Date.now();
  private readonly config: Required<RateLimiterConfig>;

  constructor(config: RateLimiterConfig) {
    this.config = {
      maxMapSize: 10000,
      ...config,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    
    // Only run cleanup every 60 seconds
    if (now - this.lastCleanup < 60000) return;
    
    this.lastCleanup = now;
    
    // Remove stale entries
    const entries = Array.from(this.requests.entries());
    for (const [key, timestamps] of entries) {
      const valid = timestamps.filter((t: number) => now - t < this.config.windowMs);
      if (valid.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, valid);
      }
    }

    // If still over limit, remove oldest entries (FIFO)
    if (this.requests.size > this.config.maxMapSize) {
      const keyEntries = Array.from(this.requests.keys());
      const toDelete = keyEntries.slice(0, this.requests.size - this.config.maxMapSize);
      toDelete.forEach(key => this.requests.delete(key));
    }
  }

  rateLimit(key: string): RateLimitResult {
    this.cleanup();

    const now = Date.now();
    const timestamps = this.requests.get(key) || [];

    // Remove expired timestamps
    const valid = timestamps.filter((t: number) => now - t < this.config.windowMs);

    if (valid.length >= this.config.limit) {
      this.requests.set(key, valid);
      return {
        allowed: false,
        remaining: 0,
        resetTime: Math.min(...valid) + this.config.windowMs,
      };
    }

    // Enforce map size limit before adding new entry
    if (!this.requests.has(key) && this.requests.size >= this.config.maxMapSize) {
      // Remove oldest entry
      const firstKey = this.requests.keys().next().value;
      if (firstKey) this.requests.delete(firstKey);
    }

    valid.push(now);
    this.requests.set(key, valid);

    return {
      allowed: true,
      remaining: this.config.limit - valid.length,
      resetTime: now + this.config.windowMs,
    };
  }

  rateLimitStrict(key: string): StrictRateLimitResult {
    const result = this.rateLimit(key);
    
    const headers: StrictRateLimitResult['headers'] = {
      'X-RateLimit-Limit': this.config.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
    };

    if (result.resetTime) {
      headers['X-RateLimit-Reset'] = Math.ceil(result.resetTime / 1000).toString();
    }

    if (!result.allowed && result.resetTime) {
      const retryAfterSeconds = Math.ceil((result.resetTime - Date.now()) / 1000);
      headers['Retry-After'] = Math.max(1, retryAfterSeconds).toString();
    }

    return {
      ...result,
      headers,
    };
  }
}

// Legacy function for backwards compatibility
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const limiter = new RateLimiter({ limit, windowMs });
  const result = limiter.rateLimit(key);
  return {
    allowed: result.allowed,
    remaining: result.remaining,
  };
}

// Strict rate limiter with proper HTTP headers
export function rateLimitStrict(
  key: string,
  limit: number,
  windowMs: number
): StrictRateLimitResult {
  const limiter = new RateLimiter({ limit, windowMs });
  return limiter.rateLimitStrict(key);
}

// Factory function to create named limiters
export function createRateLimiter(config: RateLimiterConfig): RateLimiter {
  return new RateLimiter(config);
}

// Export the RateLimiter class for advanced usage
export { RateLimiter };
export type { RateLimiterConfig, RateLimitResult, StrictRateLimitResult };