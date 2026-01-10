import type { TemperatureUnit } from '../../store/locations-store';

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Convert temperature based on unit
 * API returns Celsius, so convert to Fahrenheit if needed
 */
export function convertTemperature(tempCelsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round(celsiusToFahrenheit(tempCelsius));
  }
  return Math.round(tempCelsius);
}

/**
 * Get temperature unit symbol
 */
export function getTemperatureSymbol(unit: TemperatureUnit): string {
  return unit === 'celsius' ? '°C' : '°F';
}
