import { useQuery } from '@tanstack/react-query';

interface HistoricalDataPoint {
  date: string;
  tempmax: number;
  tempmin: number;
  temp: number;
  precip: number;
  precipprob: number;
  humidity: number;
  windspeed: number;
  conditions: string;
}

interface HistoricalWeatherData {
  address: string;
  days: HistoricalDataPoint[];
}

/**
 * Fetch historical weather data for a location
 * Gets data from the past 3 years to calculate best time to visit
 */
async function fetchHistoricalWeather(location: string): Promise<HistoricalWeatherData> {
  const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_API_KEY;
  const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

  // Get data from the past 3 years
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear - 3}-01-01`;
  const endDate = `${currentYear - 1}-12-31`;

  const url = `${BASE_URL}/${encodeURIComponent(location)}/${startDate}/${endDate}?key=${API_KEY}&unitGroup=metric&include=days&elements=datetime,tempmax,tempmin,temp,precip,precipprob,humidity,windspeed,conditions`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch historical weather data: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Hook to fetch historical weather data with caching
 */
export function useHistoricalWeather(location: string) {
  return useQuery({
    queryKey: ['historical-weather', location],
    queryFn: () => fetchHistoricalWeather(location),
    staleTime: 1000 * 60 * 60 * 24 * 7, // Cache for 7 days (historical data doesn't change)
    enabled: !!location,
  });
}
