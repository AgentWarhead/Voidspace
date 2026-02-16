/**
 * In-memory session revocation store with LRU eviction.
 * 
 * ⚠️ LIMITATION: This only works within a single serverless invocation.
 * Vercel serverless functions have no shared memory between instances,
 * so revocation won't persist across different function executions.
 * 
 * Future: Replace with Supabase-based revocation using a `revoked_at` column
 * in the users table for true distributed session revocation.
 */

interface RevocationEntry {
  userId: string;
  revokedAt: number;
}

class LRURevocationStore {
  private store = new Map<string, RevocationEntry>();
  private readonly maxSize = 10000;

  /**
   * Revoke all sessions for a given user ID.
   */
  revokeSession(userId: string): void {
    this.evictIfNeeded();
    this.store.set(userId, {
      userId,
      revokedAt: Date.now()
    });
  }

  /**
   * Check if a user's sessions are revoked.
   * Returns true if the user's sessions should be considered invalid.
   */
  isRevoked(userId: string): boolean {
    const entry = this.store.get(userId);
    if (!entry) {
      return false;
    }

    // Move to end for LRU (accessing makes it "recently used")
    this.store.delete(userId);
    this.store.set(userId, entry);
    
    return true;
  }

  /**
   * Clean up old entries and enforce size limit.
   */
  private evictIfNeeded(): void {
    // Remove entries older than 7 days (SESSION_MAX_AGE)
    const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const toDelete: string[] = [];
    
    for (const [userId, entry] of Array.from(this.store.entries())) {
      if (entry.revokedAt < cutoff) {
        toDelete.push(userId);
      }
    }
    
    toDelete.forEach(userId => this.store.delete(userId));

    // If still over capacity, remove oldest entries (LRU)
    while (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }
  }

  /**
   * Get current store size (for debugging/monitoring).
   */
  size(): number {
    return this.store.size;
  }

  /**
   * Clear all revoked sessions (for testing).
   */
  clear(): void {
    this.store.clear();
  }
}

// Global singleton instance
const revocationStore = new LRURevocationStore();

/**
 * Revoke all sessions for a given user ID.
 */
export function revokeSession(userId: string): void {
  revocationStore.revokeSession(userId);
}

/**
 * Check if a user's sessions are revoked.
 * 
 * ⚠️ CURRENTLY DISABLED: Always returns false due to serverless limitations.
 * Real revocation checking will be implemented in verifySessionToken() using
 * a Supabase `revoked_at` timestamp check.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isRevoked(_userId: string): boolean {
  // Revocation check — will use Supabase in verifySessionToken()
  return false; // Disabled - no shared memory in serverless
}

// Export for testing/monitoring
export { revocationStore };