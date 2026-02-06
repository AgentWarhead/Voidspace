/**
 * In-memory session revocation store with LRU eviction.
 * 
 * This is a simple implementation for demonstration. In a production
 * distributed system, consider using Redis or a database for persistence
 * across multiple instances.
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
 */
export function isRevoked(userId: string): boolean {
  return revocationStore.isRevoked(userId);
}

// Export for testing/monitoring
export { revocationStore };