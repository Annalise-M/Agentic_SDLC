import { describe, it, expect, beforeEach } from 'vitest';
import { useLocationStore } from './locations-store';

describe('LocationStore', () => {
  // Reset store before each test
  beforeEach(() => {
    const store = useLocationStore.getState();
    store.clearLocations();
    // Reset to default state
    useLocationStore.setState({
      locations: [],
      offlineLocations: [],
      temperatureUnit: 'celsius',
    });
    // Clear localStorage
    localStorage.clear();
  });

  describe('Location Management', () => {
    it('should start with empty locations array', () => {
      const { locations } = useLocationStore.getState();
      expect(locations).toEqual([]);
    });

    it('should add a location', () => {
      const { addLocation } = useLocationStore.getState();
      addLocation('Tokyo');

      const { locations } = useLocationStore.getState();
      expect(locations).toEqual(['Tokyo']);
    });

    it('should add multiple locations', () => {
      const { addLocation } = useLocationStore.getState();
      addLocation('Tokyo');
      addLocation('Paris');
      addLocation('New York');

      const { locations } = useLocationStore.getState();
      expect(locations).toEqual(['Tokyo', 'Paris', 'New York']);
    });

    it('should not add duplicate locations', () => {
      const { addLocation } = useLocationStore.getState();
      addLocation('Tokyo');
      addLocation('Tokyo');

      const { locations } = useLocationStore.getState();
      expect(locations).toEqual(['Tokyo']);
    });

    it('should enforce maximum 5 locations', () => {
      const { addLocation } = useLocationStore.getState();
      addLocation('Location 1');
      addLocation('Location 2');
      addLocation('Location 3');
      addLocation('Location 4');
      addLocation('Location 5');
      addLocation('Location 6'); // Should not be added

      const { locations } = useLocationStore.getState();
      expect(locations).toHaveLength(5);
      expect(locations).not.toContain('Location 6');
    });

    it('should remove a location', () => {
      const { addLocation, removeLocation } = useLocationStore.getState();
      addLocation('Tokyo');
      addLocation('Paris');
      removeLocation('Tokyo');

      const { locations } = useLocationStore.getState();
      expect(locations).toEqual(['Paris']);
    });

    it('should clear all locations', () => {
      const { addLocation, clearLocations } = useLocationStore.getState();
      addLocation('Tokyo');
      addLocation('Paris');
      clearLocations();

      const { locations } = useLocationStore.getState();
      expect(locations).toEqual([]);
    });

    it('should have correct maxLocations value', () => {
      const { maxLocations } = useLocationStore.getState();
      expect(maxLocations).toBe(5);
    });
  });

  describe('Offline Location Management', () => {
    it('should start with empty offline locations array', () => {
      const { offlineLocations } = useLocationStore.getState();
      expect(offlineLocations).toEqual([]);
    });

    it('should add location to offline', () => {
      const { toggleOfflineLocation } = useLocationStore.getState();
      toggleOfflineLocation('Tokyo');

      const { offlineLocations } = useLocationStore.getState();
      expect(offlineLocations).toEqual(['Tokyo']);
    });

    it('should remove location from offline when toggled again', () => {
      const { toggleOfflineLocation } = useLocationStore.getState();
      toggleOfflineLocation('Tokyo');
      toggleOfflineLocation('Tokyo');

      const { offlineLocations } = useLocationStore.getState();
      expect(offlineLocations).toEqual([]);
    });

    it('should enforce maximum 3 offline locations', () => {
      const { toggleOfflineLocation } = useLocationStore.getState();
      toggleOfflineLocation('Location 1');
      toggleOfflineLocation('Location 2');
      toggleOfflineLocation('Location 3');
      toggleOfflineLocation('Location 4'); // Should not be added

      const { offlineLocations } = useLocationStore.getState();
      expect(offlineLocations).toHaveLength(3);
      expect(offlineLocations).not.toContain('Location 4');
    });

    it('should correctly identify offline locations', () => {
      const { toggleOfflineLocation, isOfflineLocation } = useLocationStore.getState();
      toggleOfflineLocation('Tokyo');

      expect(isOfflineLocation('Tokyo')).toBe(true);
      expect(isOfflineLocation('Paris')).toBe(false);
    });

    it('should have correct maxOfflineLocations value', () => {
      const { maxOfflineLocations } = useLocationStore.getState();
      expect(maxOfflineLocations).toBe(3);
    });

    it('should remove offline location when main location is removed', () => {
      const { addLocation, toggleOfflineLocation, removeLocation } = useLocationStore.getState();

      // Add location and make it offline
      addLocation('Tokyo');
      toggleOfflineLocation('Tokyo');

      // Remove the location
      removeLocation('Tokyo');

      const { offlineLocations } = useLocationStore.getState();
      expect(offlineLocations).not.toContain('Tokyo');
    });

    it('should clear offline locations when clearing all locations', () => {
      const { addLocation, toggleOfflineLocation, clearLocations } = useLocationStore.getState();

      addLocation('Tokyo');
      addLocation('Paris');
      toggleOfflineLocation('Tokyo');
      toggleOfflineLocation('Paris');

      clearLocations();

      const { offlineLocations } = useLocationStore.getState();
      expect(offlineLocations).toEqual([]);
    });
  });

  describe('Temperature Unit Management', () => {
    it('should start with celsius as default', () => {
      const { temperatureUnit } = useLocationStore.getState();
      expect(temperatureUnit).toBe('celsius');
    });

    it('should toggle from celsius to fahrenheit', () => {
      const { toggleTemperatureUnit } = useLocationStore.getState();
      toggleTemperatureUnit();

      const { temperatureUnit } = useLocationStore.getState();
      expect(temperatureUnit).toBe('fahrenheit');
    });

    it('should toggle from fahrenheit back to celsius', () => {
      const { toggleTemperatureUnit } = useLocationStore.getState();
      toggleTemperatureUnit(); // celsius -> fahrenheit
      toggleTemperatureUnit(); // fahrenheit -> celsius

      const { temperatureUnit } = useLocationStore.getState();
      expect(temperatureUnit).toBe('celsius');
    });

    it('should toggle multiple times correctly', () => {
      const { toggleTemperatureUnit } = useLocationStore.getState();

      toggleTemperatureUnit(); // celsius -> fahrenheit
      expect(useLocationStore.getState().temperatureUnit).toBe('fahrenheit');

      toggleTemperatureUnit(); // fahrenheit -> celsius
      expect(useLocationStore.getState().temperatureUnit).toBe('celsius');

      toggleTemperatureUnit(); // celsius -> fahrenheit
      expect(useLocationStore.getState().temperatureUnit).toBe('fahrenheit');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex workflow: add, star, remove', () => {
      const { addLocation, toggleOfflineLocation, removeLocation, isOfflineLocation } = useLocationStore.getState();

      // Add locations
      addLocation('Tokyo');
      addLocation('Paris');
      addLocation('New York');

      // Star some locations
      toggleOfflineLocation('Tokyo');
      toggleOfflineLocation('Paris');

      expect(isOfflineLocation('Tokyo')).toBe(true);
      expect(isOfflineLocation('Paris')).toBe(true);
      expect(isOfflineLocation('New York')).toBe(false);

      // Remove a starred location
      removeLocation('Tokyo');

      const { locations, offlineLocations } = useLocationStore.getState();
      expect(locations).toEqual(['Paris', 'New York']);
      expect(offlineLocations).toEqual(['Paris']);
    });

    it('should maintain state consistency across operations', () => {
      const { addLocation, toggleOfflineLocation, toggleTemperatureUnit } = useLocationStore.getState();

      addLocation('Tokyo');
      toggleOfflineLocation('Tokyo');
      toggleTemperatureUnit();

      const state = useLocationStore.getState();
      expect(state.locations).toEqual(['Tokyo']);
      expect(state.offlineLocations).toEqual(['Tokyo']);
      expect(state.temperatureUnit).toBe('fahrenheit');
    });
  });
});
