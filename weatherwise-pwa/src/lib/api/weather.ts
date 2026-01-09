import axios from 'axios';
import type { WeatherData } from '../../types/weather';
import { getMockWeatherData } from '../data/mock-weather';

const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_API_KEY;
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

// Demo mode flag
const DEMO_MODE = !API_KEY || API_KEY === 'your_api_key_here';

export interface FetchWeatherParams {
  location: string;
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string;   // Format: YYYY-MM-DD
  include?: 'current' | 'days' | 'hours' | 'alerts' | 'events' | 'obs' | 'remote' | 'fcst' | 'stats';
}

/**
 * Fetch weather data from Visual Crossing API
 * @param params - Location and optional date range
 * @returns Weather data for the specified location
 */
export async function fetchWeather(params: FetchWeatherParams): Promise<WeatherData> {
  const { location, startDate, endDate, include = 'current' } = params;

  // Demo mode: return mock data
  if (DEMO_MODE) {
    console.log('🎭 Demo mode: Using mock weather data for', location);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockWeatherData(location);
  }

  try {
    // Build URL based on parameters
    let url = `${BASE_URL}/${encodeURIComponent(location)}`;

    if (startDate && endDate) {
      url += `/${startDate}/${endDate}`;
    } else if (startDate) {
      url += `/${startDate}`;
    }

    const response = await axios.get<WeatherData>(url, {
      params: {
        key: API_KEY,
        unitGroup: 'metric', // Use metric units (Celsius, km/h, etc.)
        include,
        contentType: 'json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your VITE_VISUAL_CROSSING_API_KEY.');
      } else if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 400) {
        throw new Error(`Location not found: ${location}`);
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
    throw error;
  }
}

/**
 * Fetch current weather and 7-day forecast for a location
 */
export async function fetchCurrentAndForecast(location: string): Promise<WeatherData> {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 7);

  return fetchWeather({
    location,
    startDate: formatDate(today),
    endDate: formatDate(endDate),
    include: 'current',
  });
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get weather icon URL from icon code
 */
export function getWeatherIconUrl(icon: string): string {
  return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${icon}.png`;
}
