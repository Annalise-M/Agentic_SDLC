import { describe, it, expect } from 'vitest';
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  convertTemperature,
  getTemperatureSymbol,
} from './temperature';

describe('Temperature Utilities', () => {
  describe('celsiusToFahrenheit', () => {
    it('should convert 0°C to 32°F', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
    });

    it('should convert 100°C to 212°F', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
    });

    it('should convert -40°C to -40°F', () => {
      expect(celsiusToFahrenheit(-40)).toBe(-40);
    });

    it('should convert 25°C to 77°F', () => {
      expect(celsiusToFahrenheit(25)).toBe(77);
    });

    it('should handle negative temperatures', () => {
      expect(celsiusToFahrenheit(-10)).toBe(14);
    });

    it('should handle decimal values', () => {
      expect(celsiusToFahrenheit(20.5)).toBeCloseTo(68.9, 1);
    });
  });

  describe('fahrenheitToCelsius', () => {
    it('should convert 32°F to 0°C', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });

    it('should convert 212°F to 100°C', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });

    it('should convert -40°F to -40°C', () => {
      expect(fahrenheitToCelsius(-40)).toBe(-40);
    });

    it('should convert 77°F to 25°C', () => {
      expect(fahrenheitToCelsius(77)).toBe(25);
    });

    it('should handle negative temperatures', () => {
      expect(fahrenheitToCelsius(14)).toBe(-10);
    });

    it('should handle decimal values', () => {
      expect(fahrenheitToCelsius(68.9)).toBeCloseTo(20.5, 1);
    });
  });

  describe('convertTemperature', () => {
    it('should return rounded Celsius when unit is celsius', () => {
      expect(convertTemperature(25.7, 'celsius')).toBe(26);
      expect(convertTemperature(25.3, 'celsius')).toBe(25);
    });

    it('should convert and round to Fahrenheit when unit is fahrenheit', () => {
      expect(convertTemperature(0, 'fahrenheit')).toBe(32);
      expect(convertTemperature(25, 'fahrenheit')).toBe(77);
      expect(convertTemperature(100, 'fahrenheit')).toBe(212);
    });

    it('should handle negative temperatures', () => {
      expect(convertTemperature(-10, 'celsius')).toBe(-10);
      expect(convertTemperature(-10, 'fahrenheit')).toBe(14);
    });

    it('should round decimal values appropriately', () => {
      expect(convertTemperature(20.4, 'celsius')).toBe(20);
      expect(convertTemperature(20.6, 'celsius')).toBe(21);
      expect(convertTemperature(20.5, 'fahrenheit')).toBe(69);
    });
  });

  describe('getTemperatureSymbol', () => {
    it('should return °C for celsius', () => {
      expect(getTemperatureSymbol('celsius')).toBe('°C');
    });

    it('should return °F for fahrenheit', () => {
      expect(getTemperatureSymbol('fahrenheit')).toBe('°F');
    });
  });

  describe('conversion accuracy', () => {
    it('should maintain accuracy through round-trip conversion (C -> F -> C)', () => {
      const originalCelsius = 25;
      const fahrenheit = celsiusToFahrenheit(originalCelsius);
      const backToCelsius = fahrenheitToCelsius(fahrenheit);
      expect(backToCelsius).toBeCloseTo(originalCelsius, 10);
    });

    it('should maintain accuracy through round-trip conversion (F -> C -> F)', () => {
      const originalFahrenheit = 77;
      const celsius = fahrenheitToCelsius(originalFahrenheit);
      const backToFahrenheit = celsiusToFahrenheit(celsius);
      expect(backToFahrenheit).toBeCloseTo(originalFahrenheit, 10);
    });
  });
});
