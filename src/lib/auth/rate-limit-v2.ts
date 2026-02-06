interface RateLimitEntry {
  count: number;
  resetTime: number;
  createdAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
}

interface RateLimiter {
  check(key: string): RateLimitResult;
}

class RateLimitManager {
  private store = new Map<string, RateLimitEntry>();
  private maxEntries = 10000;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(
    private name: string,
    private limit: number,
    private windowMs: number
  ) {
    this.startCleanup();
  }

  private startCleanup(): void {
    // Cleanup every 60 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    Array.from(this.store.entries()).forEach(([key, entry]) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.store.delete(key));
  }

  private evictOldest(): void {
    if (this.store.size >= this.maxEntries) {
      let oldestKey = '';
      let oldestTime = Date.now();

      Array.from(this.store.entries()).forEach(([key, entry]) => {
        if (entry.createdAt < oldestTime) {
          oldestTime = entry.createdAt;
          oldestKey = key;
        }
      });

      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }
  }

  check(key: string): RateLimitResult {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // New or expired entry
      this.evictOldest();
      
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.windowMs,
        createdAt: now
      };
      
      this.store.set(key, newEntry);
      
      return {
        allowed: true,
        remaining: this.limit - 1
      };
    }

    // Existing entry within window
    if (entry.count >= this.limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      };
    }

    entry.count++;
    this.store.set(key, entry);

    return {
      allowed: true,
      remaining: this.limit - entry.count
    };
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

export function createRateLimiter(
  name: string, 
  limit: number, 
  windowMs: number
): RateLimiter {
  const manager = new RateLimitManager(name, limit, windowMs);
  
  return {
    check: (key: string) => manager.check(key)
  };
}

// Default instance for backwards compatibility
const defaultLimiter = createRateLimiter('default', 60, 60000); // 60 requests per minute

export default defaultLimiter;
export type { RateLimitResult, RateLimiter };