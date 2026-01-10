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
 * Reverse geocode coordinates to location name using OpenStreetMap Nominatim (more accurate)
 * Falls back to Visual Crossing if needed
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  console.log(`📍 Reverse geocoding coordinates: ${latitude}, ${longitude}`);

  // Try OpenStreetMap Nominatim first (free, no API key needed, more accurate)
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
      {
        headers: {
          'User-Agent': 'WeatherWise PWA (contact: weatherwise@example.com)'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.address) {
        // Extract city, state, country
        const { city, town, village, state, country } = data.address;
        const locationName = city || town || village || state || country || 'Unknown Location';
        console.log(`📍 Resolved to: ${locationName}`);
        return locationName;
      }
    }
  } catch (error) {
    console.warn('OpenStreetMap Nominatim failed, trying Visual Crossing:', error);
  }

  // Fallback to Visual Crossing
  const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_API_KEY;
  const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

  try {
    const response = await fetch(
      `${BASE_URL}/${latitude},${longitude}?key=${API_KEY}&include=current&contentType=json`
    );

    if (!response.ok) {
      throw new Error('Failed to reverse geocode with Visual Crossing');
    }

    const data = await response.json();
    const resolved = data.resolvedAddress || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    console.log(`📍 Visual Crossing resolved to: ${resolved}`);
    return resolved;
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}
