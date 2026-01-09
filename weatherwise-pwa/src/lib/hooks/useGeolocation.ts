import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    // Check if user has already denied/granted permission
    const hasAskedBefore = localStorage.getItem('geolocation-asked');

    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      });
      return;
    }

    // Don't ask again if user previously denied
    if (hasAskedBefore === 'denied') {
      setState({
        latitude: null,
        longitude: null,
        error: null,
        loading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
        localStorage.setItem('geolocation-asked', 'granted');
      },
      (error) => {
        setState({
          latitude: null,
          longitude: null,
          error: error.message,
          loading: false,
        });
        localStorage.setItem('geolocation-asked', 'denied');
      }
    );
  }, []);

  return state;
}

/**
 * Reverse geocode coordinates to location name using Visual Crossing API
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_API_KEY;
  const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

  try {
    const response = await fetch(
      `${BASE_URL}/${latitude},${longitude}?key=${API_KEY}&include=current&contentType=json`
    );

    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }

    const data = await response.json();
    return data.resolvedAddress || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }
}
