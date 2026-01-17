/**
 * OpenWeatherMap API Integration
 *
 * Frugal implementation with aggressive caching to stay within free tier (1,000 calls/day).
 * Uses One Call API 3.0 to get current + 7-day forecast in a single call.
 */

import axios from 'axios';
import type { WeatherData, WeatherDay, WeatherConditions } from '../../types/weather';
import { weatherCache } from './cache-manager';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

// Cache TTL settings (in milliseconds)
const CACHE_TTL = {
  CURRENT_WEATHER: 30 * 60 * 1000,  // 30 minutes
  FORECAST: 60 * 60 * 1000,          // 1 hour
  GEOCODE: 24 * 60 * 60 * 1000,      // 24 hours
};

// Request deduplication: Track pending requests to prevent duplicate calls
const pendingRequests = new Map<string, Promise<any>>();

// Usage tracking
interface UsageStats {
  totalCalls: number;
  lastReset: number;
  callsToday: number;
}

const USAGE_KEY = 'weatherwise-api-usage';

function getUsageStats(): UsageStats {
  try {
    const stored = localStorage.getItem(USAGE_KEY);
    if (stored) {
      const stats: UsageStats = JSON.parse(stored);
      // Reset daily counter if it's a new day
      const lastResetDate = new Date(stats.lastReset).toDateString();
      const today = new Date().toDateString();
      if (lastResetDate !== today) {
        stats.callsToday = 0;
        stats.lastReset = Date.now();
      }
      return stats;
    }
  } catch (error) {
    console.warn('Failed to read usage stats:', error);
  }

  return {
    totalCalls: 0,
    lastReset: Date.now(),
    callsToday: 0,
  };
}

function incrementUsage(): void {
  const stats = getUsageStats();
  stats.totalCalls++;
  stats.callsToday++;
  localStorage.setItem(USAGE_KEY, JSON.stringify(stats));

  // Warn if approaching daily limit
  if (stats.callsToday >= 800) {
    console.warn(`⚠️ API Usage: ${stats.callsToday}/1000 calls today (80% limit reached)`);
  } else if (stats.callsToday >= 950) {
    console.error(`🚨 API Usage: ${stats.callsToday}/1000 calls today (95% limit reached)`);
  }

  console.log(`📊 API Calls Today: ${stats.callsToday}/1000 (Total: ${stats.totalCalls})`);
}

export function getApiUsage(): UsageStats {
  return getUsageStats();
}

/**
 * Geocode location name to coordinates
 * Cached for 24 hours since location coordinates don't change
 */
async function geocodeLocation(location: string): Promise<{ lat: number; lon: number }> {
  const cacheKey = `geocode-${location.toLowerCase()}`;

  // Check cache first
  const cached = weatherCache.get<{ lat: number; lon: number }>(cacheKey);
  if (cached) {
    return cached;
  }

  // Check for pending request (deduplication)
  const pendingKey = `geocode-pending-${location.toLowerCase()}`;
  if (pendingRequests.has(pendingKey)) {
    console.log('🔄 Deduplicating geocode request:', location);
    return pendingRequests.get(pendingKey)!;
  }

  // Make API call
  const promise = (async () => {
    try {
      console.log('🌍 Geocoding location:', location);
      const response = await axios.get(GEO_URL, {
        params: {
          q: location,
          limit: 1,
          appid: API_KEY,
        },
      });

      incrementUsage();

      if (!response.data || response.data.length === 0) {
        throw new Error(`Location not found: ${location}`);
      }

      const result = {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
      };

      // Cache for 24 hours
      weatherCache.set(cacheKey, result, CACHE_TTL.GEOCODE);

      return result;
    } finally {
      pendingRequests.delete(pendingKey);
    }
  })();

  pendingRequests.set(pendingKey, promise);
  return promise;
}

/**
 * Transform OpenWeatherMap data to our WeatherData interface
 */
function transformOWMToWeatherData(
  owmData: any,
  location: string,
  address: string
): WeatherData {
  // Transform daily forecast
  const days: WeatherDay[] = owmData.daily.slice(0, 8).map((day: any) => ({
    datetime: new Date(day.dt * 1000).toISOString().split('T')[0],
    datetimeEpoch: day.dt,
    temp: day.temp.day,
    tempmax: day.temp.max,
    tempmin: day.temp.min,
    feelslike: day.feels_like.day,
    humidity: day.humidity,
    precip: (day.rain || 0) + (day.snow || 0),
    precipprob: day.pop * 100, // Convert 0-1 to 0-100
    preciptype: day.rain ? ['rain'] : day.snow ? ['snow'] : null,
    snow: day.snow || 0,
    snowdepth: 0, // OWM doesn't provide this
    windgust: day.wind_gust || day.wind_speed,
    windspeed: day.wind_speed,
    winddir: day.wind_deg,
    pressure: day.pressure,
    cloudcover: day.clouds,
    visibility: 10000, // OWM doesn't provide daily visibility
    solarradiation: 0, // Not provided by OWM
    solarenergy: 0, // Not provided by OWM
    uvindex: day.uvi,
    conditions: day.weather[0].main,
    description: day.weather[0].description,
    icon: day.weather[0].icon,
    sunrise: new Date(day.sunrise * 1000).toISOString(),
    sunset: new Date(day.sunset * 1000).toISOString(),
    moonphase: day.moon_phase,
  }));

  // Transform current conditions
  const current: WeatherConditions = {
    datetime: new Date(owmData.current.dt * 1000).toISOString(),
    datetimeEpoch: owmData.current.dt,
    temp: owmData.current.temp,
    feelslike: owmData.current.feels_like,
    humidity: owmData.current.humidity,
    precip: 0, // Current precip not directly available
    precipprob: 0,
    preciptype: null,
    snow: 0,
    snowdepth: 0,
    windgust: owmData.current.wind_gust || owmData.current.wind_speed,
    windspeed: owmData.current.wind_speed,
    winddir: owmData.current.wind_deg,
    pressure: owmData.current.pressure,
    cloudcover: owmData.current.clouds,
    visibility: owmData.current.visibility,
    solarradiation: 0,
    solarenergy: 0,
    uvindex: owmData.current.uvi,
    conditions: owmData.current.weather[0].main,
    description: owmData.current.weather[0].description,
    icon: owmData.current.weather[0].icon,
    sunrise: new Date(owmData.current.sunrise * 1000).toISOString(),
    sunset: new Date(owmData.current.sunset * 1000).toISOString(),
  };

  return {
    queryCost: 1,
    latitude: owmData.lat,
    longitude: owmData.lon,
    resolvedAddress: address,
    address: location,
    timezone: owmData.timezone,
    tzoffset: owmData.timezone_offset / 3600,
    days,
    currentConditions: current,
  };
}

/**
 * Fetch weather data from OpenWeatherMap
 * Uses aggressive caching to minimize API calls
 */
export async function fetchWeatherOWM(location: string): Promise<WeatherData> {
  console.log('🌦️ Fetching weather for:', location);

  // Check cache first (30-minute TTL)
  const cacheKey = `weather-${location.toLowerCase()}`;
  const cached = weatherCache.get<WeatherData>(cacheKey);
  if (cached) {
    return cached;
  }

  // Check for pending request (deduplication)
  const pendingKey = `weather-pending-${location.toLowerCase()}`;
  if (pendingRequests.has(pendingKey)) {
    console.log('🔄 Deduplicating weather request:', location);
    return pendingRequests.get(pendingKey)!;
  }

  // Make API calls
  const promise = (async () => {
    try {
      // Step 1: Geocode location (cached for 24 hours)
      const coords = await geocodeLocation(location);

      // Step 2: Fetch weather data using One Call API
      console.log('☀️ Fetching weather data from OpenWeatherMap...');
      const response = await axios.get(BASE_URL, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: API_KEY,
          units: 'metric',
          exclude: 'minutely,hourly,alerts', // Exclude unnecessary data to reduce payload
        },
      });

      incrementUsage();

      // Transform to our data structure
      const weatherData = transformOWMToWeatherData(
        response.data,
        location,
        `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}`
      );

      // Cache for 30 minutes
      weatherCache.set(cacheKey, weatherData, CACHE_TTL.CURRENT_WEATHER);

      return weatherData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid OpenWeatherMap API key. Please check your VITE_OPENWEATHERMAP_API_KEY.');
        } else if (error.response?.status === 429) {
          throw new Error('API rate limit exceeded. Using cached data if available.');
        } else if (error.response?.status === 404) {
          throw new Error(`Location not found: ${location}`);
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
      }
      throw error;
    } finally {
      pendingRequests.delete(pendingKey);
    }
  })();

  pendingRequests.set(pendingKey, promise);
  return promise;
}

/**
 * Get weather icon URL from OpenWeatherMap icon code
 */
export function getWeatherIconUrlOWM(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

/**
 * Clear all weather caches
 */
export function clearWeatherCache(): void {
  weatherCache.clear();
  console.log('🗑️ Weather cache cleared');
}
