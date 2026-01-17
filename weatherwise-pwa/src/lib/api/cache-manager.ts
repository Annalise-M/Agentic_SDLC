/**
 * Cache Manager
 *
 * Aggressive caching strategy to minimize API calls and stay within free tier limits.
 * Implements multi-layer caching: in-memory + localStorage with TTL.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class CacheManager {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private storagePrefix = 'weatherwise-cache-';

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    // Try memory cache first (fastest)
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      console.log(`💾 Cache HIT (memory): ${key}`);
      return memoryEntry.data as T;
    }

    // Try localStorage cache (slower but persists)
    try {
      const storageKey = this.storagePrefix + key;
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const entry: CacheEntry<T> = JSON.parse(cached);
        if (!this.isExpired(entry)) {
          console.log(`💾 Cache HIT (storage): ${key}`);
          // Populate memory cache for faster subsequent access
          this.memoryCache.set(key, entry);
          return entry.data;
        } else {
          // Remove expired entry
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    console.log(`❌ Cache MISS: ${key}`);
    return null;
  }

  /**
   * Store data in both memory and localStorage caches
   */
  set<T>(key: string, data: T, ttl: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Store in memory cache
    this.memoryCache.set(key, entry);

    // Store in localStorage
    try {
      const storageKey = this.storagePrefix + key;
      localStorage.setItem(storageKey, JSON.stringify(entry));
      console.log(`✅ Cached: ${key} (TTL: ${ttl / 1000 / 60}min)`);
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.memoryCache.clear();

    // Clear localStorage entries with our prefix
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('🗑️ Cache cleared');
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  /**
   * Remove expired entries from localStorage
   */
  cleanup(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry<any> = JSON.parse(cached);
            if (this.isExpired(entry)) {
              keysToRemove.push(key);
            }
          }
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      if (keysToRemove.length > 0) {
        console.log(`🧹 Cleaned up ${keysToRemove.length} expired cache entries`);
      }
    } catch (error) {
      console.warn('Cache cleanup error:', error);
    }
  }
}

// Global cache instance
export const weatherCache = new CacheManager();

// Cleanup expired entries on app load
weatherCache.cleanup();
