/**
 * In-Memory Permission & Validation Cache Service
 * 
 * Provides high-speed (nanosecond) RAM caching for user channel permissions
 * to prevent repeated database round-trips on every chat message.
 */

class PermissionCacheService {
  constructor() {
    // Map: 'userId:channelId' -> { allowed: boolean, serverId: string, expiresAt: number }
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;

    // Default TTL: 10 minutes
    this.defaultTTL = 10 * 60 * 1000;

    // Periodic GC every 5 minutes to prevent memory leaks from inactive sessions
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000);

    // unref so timer doesn't prevent Node process from graceful shutdown
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  _getKey(userId, channelId) {
    return `${userId}:${channelId}`;
  }

  /**
   * Check if user is cached as allowed to post in channel
   * @returns {boolean|null} true/false if valid in cache, null if cache miss / expired
   */
  hasAccess(userId, channelId) {
    if (!userId || !channelId) return null;

    const key = this._getKey(userId, channelId);
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check expiry
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.allowed;
  }

  /**
   * Store verified permission in RAM
   */
  setAccess(userId, channelId, serverId, allowed = true, ttlMs = this.defaultTTL) {
    if (!userId || !channelId) return;

    const key = this._getKey(userId, channelId);
    this.cache.set(key, {
      allowed: Boolean(allowed),
      serverId: serverId || null,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Invalidate specific user+channel permission (e.g. on channel leave)
   */
  invalidateUserChannel(userId, channelId) {
    if (!userId || !channelId) return;
    this.cache.delete(this._getKey(userId, channelId));
  }

  /**
   * Invalidate all channel permissions for a user (e.g. on socket disconnect)
   */
  invalidateUser(userId) {
    if (!userId) return;
    const prefix = `${userId}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Invalidate permissions when user is kicked/removed from a specific server
   */
  invalidateServerUser(serverId, userId) {
    if (!serverId || !userId) return;
    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith(`${userId}:`) && entry.serverId === serverId) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Invalidate all cached permissions for a deleted channel
   */
  invalidateChannel(channelId) {
    if (!channelId) return;
    for (const [key] of this.cache.entries()) {
      if (key.endsWith(`:${channelId}`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Garbage collect expired entries
   */
  cleanupExpired() {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.log(`[PermissionCache] GC cleaned ${cleaned} expired cache entries.`);
    }
  }

  /**
   * Performance stats for diagnostics
   */
  getStats() {
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRatio: this.hits + this.misses > 0 
        ? `${((this.hits / (this.hits + this.misses)) * 100).toFixed(1)}%` 
        : '0%',
    };
  }
}

// Export singleton instance
export const permissionCache = new PermissionCacheService();
export default permissionCache;

