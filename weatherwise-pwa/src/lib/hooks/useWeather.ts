import { useQuery } from '@tanstack/react-query';
import { fetchCurrentAndForecast } from '../api/weather';
import type { WeatherData } from '../../types/weather';

export interface UseWeatherOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * React Query hook for fetching weather data
 * @param location - Location to fetch weather for
 * @param options - Query options
 */
export function useWeather(location: string, options: UseWeatherOptions = {}) {
  const {
    enabled = true,
    staleTime = 30 * 60 * 1000, // 30 minutes
    cacheTime = 60 * 60 * 1000, // 1 hour
  } = options;

  return useQuery<WeatherData, Error>({
    queryKey: ['weather', location],
    queryFn: () => fetchCurrentAndForecast(location),
    enabled: enabled && Boolean(location),
    staleTime,
    gcTime: cacheTime,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
