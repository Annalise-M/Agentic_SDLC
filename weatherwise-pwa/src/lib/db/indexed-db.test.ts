import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WeatherWiseDB } from './indexed-db';

describe('IndexedDB - WeatherWiseDB', () => {
  let db: WeatherWiseDB;

  beforeEach(async () => {
    // Create a fresh database instance for each test
    db = new WeatherWiseDB();
    await db.open();
    // Clear all data
    await db.weatherCache.clear();
    await db.imageCache.clear();
  });

  afterEach(async () => {
    // Clean up
    await db.delete();
    await db.close();
  });

  describe('Weather Caching', () => {
    it('should cache weather data for a location', async () => {
      const testData = {
        temp: 25,
        conditions: 'Sunny',
        humidity: 60,
      };

      const id = await db.cacheWeather('Tokyo', testData);
      expect(id).toBeTypeOf('number');

      const cached = await db.weatherCache.get(id);
      expect(cached).toBeDefined();
      expect(cached?.location).toBe('Tokyo');
      expect(cached?.data).toEqual(testData);
    });

    it('should retrieve cached weather data', async () => {
      const testData = {
        temp: 25,
        conditions: 'Sunny',
      };

      await db.cacheWeather('Tokyo', testData);
      const result = await db.getWeather('Tokyo');

      expect(result).toEqual(testData);
    });

    it('should return null for non-existent location', async () => {
      const result = await db.getWeather('NonExistent');
      expect(result).toBeNull();
    });

    it('should replace old cache when caching same location again', async () => {
      const oldData = { temp: 20 };
      const newData = { temp: 25 };

      await db.cacheWeather('Tokyo', oldData);
      await db.cacheWeather('Tokyo', newData);

      const result = await db.getWeather('Tokyo');
      expect(result).toEqual(newData);

      // Verify only one entry exists
      const count = await db.weatherCache.where('location').equals('Tokyo').count();
      expect(count).toBe(1);
    });

    it('should include timestamp when caching', async () => {
      const testData = { temp: 25 };
      const beforeTime = Date.now();

      await db.cacheWeather('Tokyo', testData);

      const cached = await db.weatherCache.where('location').equals('Tokyo').first();
      expect(cached?.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(cached?.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('should expire old cache based on maxAge', async () => {
      const testData = { temp: 25 };

      await db.cacheWeather('Tokyo', testData);

      // Manually set timestamp to 2 hours ago
      const cached = await db.weatherCache.where('location').equals('Tokyo').first();
      if (cached) {
        await db.weatherCache.update(cached.id!, {
          timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
        });
      }

      // Default maxAge is 30 minutes (1800000ms)
      const result = await db.getWeather('Tokyo');
      expect(result).toBeNull();

      // Verify cache was deleted
      const count = await db.weatherCache.where('location').equals('Tokyo').count();
      expect(count).toBe(0);
    });

    it('should respect custom maxAge parameter', async () => {
      const testData = { temp: 25 };

      await db.cacheWeather('Tokyo', testData);

      // Set timestamp to 10 minutes ago
      const cached = await db.weatherCache.where('location').equals('Tokyo').first();
      if (cached) {
        await db.weatherCache.update(cached.id!, {
          timestamp: Date.now() - (10 * 60 * 1000), // 10 minutes ago
        });
      }

      // With maxAge of 5 minutes, cache should be expired
      const result1 = await db.getWeather('Tokyo', 5 * 60 * 1000);
      expect(result1).toBeNull();

      // Re-cache
      await db.cacheWeather('Tokyo', testData);

      // Set timestamp to 10 minutes ago again
      const cached2 = await db.weatherCache.where('location').equals('Tokyo').first();
      if (cached2) {
        await db.weatherCache.update(cached2.id!, {
          timestamp: Date.now() - (10 * 60 * 1000),
        });
      }

      // With maxAge of 20 minutes, cache should still be valid
      const result2 = await db.getWeather('Tokyo', 20 * 60 * 1000);
      expect(result2).toEqual(testData);
    });
  });

  describe('Image Caching', () => {
    it('should cache image URL for a location', async () => {
      const imageUrl = 'https://example.com/tokyo.jpg';

      const id = await db.cacheImage('Tokyo', imageUrl);
      expect(id).toBeTypeOf('number');

      const cached = await db.imageCache.get(id);
      expect(cached).toBeDefined();
      expect(cached?.location).toBe('Tokyo');
      expect(cached?.imageUrl).toBe(imageUrl);
    });

    it('should retrieve cached image URL', async () => {
      const imageUrl = 'https://example.com/tokyo.jpg';

      await db.cacheImage('Tokyo', imageUrl);
      const result = await db.getImage('Tokyo');

      expect(result).toBe(imageUrl);
    });

    it('should return null for non-existent location image', async () => {
      const result = await db.getImage('NonExistent');
      expect(result).toBeNull();
    });

    it('should replace old image cache when caching same location again', async () => {
      const oldUrl = 'https://example.com/old.jpg';
      const newUrl = 'https://example.com/new.jpg';

      await db.cacheImage('Tokyo', oldUrl);
      await db.cacheImage('Tokyo', newUrl);

      const result = await db.getImage('Tokyo');
      expect(result).toBe(newUrl);

      // Verify only one entry exists
      const count = await db.imageCache.where('location').equals('Tokyo').count();
      expect(count).toBe(1);
    });
  });

  describe('Clear Expired Cache', () => {
    it('should clear expired weather cache entries', async () => {
      const oldData = { temp: 20 };
      const newData = { temp: 25 };

      // Add old entry
      await db.cacheWeather('OldLocation', oldData);
      const oldEntry = await db.weatherCache.where('location').equals('OldLocation').first();
      if (oldEntry) {
        await db.weatherCache.update(oldEntry.id!, {
          timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        });
      }

      // Add new entry
      await db.cacheWeather('NewLocation', newData);

      // Clear expired cache (default 24 hours)
      await db.clearExpiredCache();

      const oldResult = await db.weatherCache.where('location').equals('OldLocation').first();
      const newResult = await db.weatherCache.where('location').equals('NewLocation').first();

      expect(oldResult).toBeUndefined();
      expect(newResult).toBeDefined();
    });

    it('should clear expired image cache entries', async () => {
      const oldUrl = 'https://example.com/old.jpg';
      const newUrl = 'https://example.com/new.jpg';

      // Add old entry
      await db.cacheImage('OldLocation', oldUrl);
      const oldEntry = await db.imageCache.where('location').equals('OldLocation').first();
      if (oldEntry) {
        await db.imageCache.update(oldEntry.id!, {
          timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        });
      }

      // Add new entry
      await db.cacheImage('NewLocation', newUrl);

      // Clear expired cache
      await db.clearExpiredCache();

      const oldResult = await db.imageCache.where('location').equals('OldLocation').first();
      const newResult = await db.imageCache.where('location').equals('NewLocation').first();

      expect(oldResult).toBeUndefined();
      expect(newResult).toBeDefined();
    });

    it('should respect custom maxAge for clearing cache', async () => {
      const testData = { temp: 25 };

      await db.cacheWeather('Tokyo', testData);

      // Set timestamp to 10 hours ago
      const entry = await db.weatherCache.where('location').equals('Tokyo').first();
      if (entry) {
        await db.weatherCache.update(entry.id!, {
          timestamp: Date.now() - (10 * 60 * 60 * 1000), // 10 hours ago
        });
      }

      // Clear cache older than 5 hours
      await db.clearExpiredCache(5 * 60 * 60 * 1000);

      const result = await db.weatherCache.where('location').equals('Tokyo').first();
      expect(result).toBeUndefined();
    });
  });

  describe('Multiple Locations', () => {
    it('should handle multiple cached locations independently', async () => {
      const tokyoData = { temp: 25, location: 'Tokyo' };
      const parisData = { temp: 15, location: 'Paris' };
      const nyData = { temp: 20, location: 'New York' };

      await db.cacheWeather('Tokyo', tokyoData);
      await db.cacheWeather('Paris', parisData);
      await db.cacheWeather('New York', nyData);

      const tokyo = await db.getWeather('Tokyo');
      const paris = await db.getWeather('Paris');
      const ny = await db.getWeather('New York');

      expect(tokyo).toEqual(tokyoData);
      expect(paris).toEqual(parisData);
      expect(ny).toEqual(nyData);
    });

    it('should handle multiple cached images independently', async () => {
      await db.cacheImage('Tokyo', 'https://example.com/tokyo.jpg');
      await db.cacheImage('Paris', 'https://example.com/paris.jpg');
      await db.cacheImage('New York', 'https://example.com/ny.jpg');

      const tokyo = await db.getImage('Tokyo');
      const paris = await db.getImage('Paris');
      const ny = await db.getImage('New York');

      expect(tokyo).toBe('https://example.com/tokyo.jpg');
      expect(paris).toBe('https://example.com/paris.jpg');
      expect(ny).toBe('https://example.com/ny.jpg');
    });
  });
});
