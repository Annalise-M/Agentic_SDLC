import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface LocationState {
  locations: string[];
  addLocation: (location: string) => void;
  removeLocation: (location: string) => void;
  clearLocations: () => void;
  maxLocations: number;
  temperatureUnit: TemperatureUnit;
  toggleTemperatureUnit: () => void;
}

/**
 * Zustand store for managing selected locations
 * Persists to localStorage for user convenience
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      locations: [],
      maxLocations: 5,
      temperatureUnit: 'celsius',

      addLocation: (location: string) =>
        set((state) => {
          // Prevent duplicates
          if (state.locations.includes(location)) {
            return state;
          }

          // Limit to maxLocations
          if (state.locations.length >= state.maxLocations) {
            return state;
          }

          return {
            locations: [...state.locations, location],
          };
        }),

      removeLocation: (location: string) =>
        set((state) => ({
          locations: state.locations.filter((loc) => loc !== location),
        })),

      clearLocations: () => set({ locations: [] }),

      toggleTemperatureUnit: () =>
        set((state) => ({
          temperatureUnit: state.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius',
        })),
    }),
    {
      name: 'weatherwise-locations',
    }
  )
);
