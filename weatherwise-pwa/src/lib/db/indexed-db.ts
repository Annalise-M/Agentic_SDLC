import Dexie, { type Table } from 'dexie';

// Weather data interface for offline storage
export interface CachedWeatherData {
  id?: number;
  location: string;
  data: any; // Weather API response
  timestamp: number; // Unix timestamp when cached
}

// Cached image interface
export interface CachedImage {
  id?: number;
  location: string;
  imageUrl: string;
  timestamp: number;
}

/**
 * IndexedDB database for offline caching
 * Stores weather data and location images for offline access
 */
export class WeatherWiseDB extends Dexie {
  weatherCache!: Table<CachedWeatherData, number>;
  imageCache!: Table<CachedImage, number>;

  constructor() {
    super('WeatherWiseDB');

    // Define database schema
    this.version(1).stores({
      weatherCache: '++id, location, timestamp',
      imageCache: '++id, location, timestamp',
    });
  }

  /**
   * Cache weather data for a location
   */
  async cacheWeather(location: string, data: any): Promise<number> {
    // Remove old cache for this location
    await this.weatherCache.where('location').equals(location).delete();

    // Add new cache
    return await this.weatherCache.add({
      location,
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Get cached weather data for a location
   * Returns null if not found or cache is older than maxAge (ms)
   */
  async getWeather(location: string, maxAge: number = 1800000): Promise<any | null> {
    const cached = await this.weatherCache.where('location').equals(location).first();

    if (!cached) {
      return null;
    }

    // Check if cache is still valid
    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      // Cache expired, delete it
      await this.weatherCache.delete(cached.id!);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache location image URL
   */
  async cacheImage(location: string, imageUrl: string): Promise<number> {
    // Remove old cache for this location
    await this.imageCache.where('location').equals(location).delete();

    // Add new cache
    return await this.imageCache.add({
      location,
      imageUrl,
      timestamp: Date.now(),
    });
  }

  /**
   * Get cached image URL for a location
   */
  async getImage(location: string): Promise<string | null> {
    const cached = await this.imageCache.where('location').equals(location).first();
    return cached ? cached.imageUrl : null;
  }

  /**
   * Clear all expired cache entries
   */
  async clearExpiredCache(maxAge: number = 86400000): Promise<void> {
    const cutoff = Date.now() - maxAge;

    await this.weatherCache.where('timestamp').below(cutoff).delete();
    await this.imageCache.where('timestamp').below(cutoff).delete();
  }
}

// Create singleton instance
export const db = new WeatherWiseDB();

// Clear expired cache on load (older than 24 hours)
db.clearExpiredCache().catch((err) => {
  console.warn('Failed to clear expired cache:', err);
});
