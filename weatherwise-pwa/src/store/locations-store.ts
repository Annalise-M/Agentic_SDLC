import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface LocationState {
  locations: string[];
  offlineLocations: string[]; // Locations saved for offline access
  addLocation: (location: string) => void;
  removeLocation: (location: string) => void;
  clearLocations: () => void;
  toggleOfflineLocation: (location: string) => void;
  isOfflineLocation: (location: string) => boolean;
  maxLocations: number;
  maxOfflineLocations: number;
  temperatureUnit: TemperatureUnit;
  toggleTemperatureUnit: () => void;
}

/**
 * Zustand store for managing selected locations
 * Persists to localStorage for user convenience
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: [],
      offlineLocations: [],
      maxLocations: 5,
      maxOfflineLocations: 3,
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
          // Also remove from offline locations if it was saved
          offlineLocations: state.offlineLocations.filter((loc) => loc !== location),
        })),

      clearLocations: () => set({ locations: [], offlineLocations: [] }),

      toggleOfflineLocation: (location: string) =>
        set((state) => {
          const isCurrentlyOffline = state.offlineLocations.includes(location);

          if (isCurrentlyOffline) {
            // Remove from offline
            return {
              offlineLocations: state.offlineLocations.filter((loc) => loc !== location),
            };
          } else {
            // Add to offline (check limit)
            if (state.offlineLocations.length >= state.maxOfflineLocations) {
              console.warn(`Maximum ${state.maxOfflineLocations} offline locations allowed`);
              return state;
            }

            return {
              offlineLocations: [...state.offlineLocations, location],
            };
          }
        }),

      isOfflineLocation: (location: string) => {
        return get().offlineLocations.includes(location);
      },

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
