/**
 * Affiliate link builders for travel booking services
 *
 * Generates properly formatted affiliate links for Skyscanner (flights)
 * and Booking.com (hotels) with default travel dates and affiliate tracking.
 */

import { affiliateConfig } from '../config/affiliate';
import { format, addDays } from 'date-fns';

/**
 * Build Skyscanner affiliate link for flights
 *
 * @param destinationCity - Destination city name (e.g., "Tokyo", "Paris")
 * @param originCity - Optional origin city name (if omitted, shows flexible search)
 * @returns Skyscanner affiliate URL with destination and default dates
 *
 * @example
 * buildSkyscannerLink('Tokyo')
 * // => "https://skyscanner.net/g/referrals/v1/flights/day-view?destination=Tokyo&outboundDate=2026-01-22&inboundDate=2026-01-29"
 */
export function buildSkyscannerLink(
  destinationCity: string,
  originCity?: string
): string {
  const baseUrl = affiliateConfig.skyscanner.baseUrl;
  const affiliateId = affiliateConfig.skyscanner.affiliateId;

  // Calculate default dates (7 days from now for outbound, 14 days from now for return)
  const today = new Date();
  const outboundDate = format(addDays(today, 7), 'yyyy-MM-dd');
  const inboundDate = format(addDays(today, 14), 'yyyy-MM-dd');

  const params = new URLSearchParams({
    destination: destinationCity,
    outboundDate,
    inboundDate,
  });

  // Add origin if provided
  if (originCity) {
    params.set('origin', originCity);
  }

  // Add affiliate ID if configured
  if (affiliateId) {
    params.set('mediaPartnerId', affiliateId);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Build Booking.com affiliate link for hotels
 *
 * @param cityName - City name for hotel search (e.g., "Tokyo", "New York")
 * @returns Booking.com affiliate URL with city and default dates
 *
 * @example
 * buildBookingLink('Tokyo')
 * // => "https://www.booking.com/searchresults.html?ss=Tokyo&checkin=2026-01-22&checkout=2026-01-29&group_adults=2&no_rooms=1"
 */
export function buildBookingLink(cityName: string): string {
  const baseUrl = affiliateConfig.booking.baseUrl;
  const affiliateId = affiliateConfig.booking.affiliateId;

  // Calculate default dates (check-in 7 days from now, check-out 14 days from now)
  const today = new Date();
  const checkin = format(addDays(today, 7), 'yyyy-MM-dd');
  const checkout = format(addDays(today, 14), 'yyyy-MM-dd');

  const params = new URLSearchParams({
    ss: cityName,
    checkin,
    checkout,
    group_adults: '2',
    no_rooms: '1',
  });

  // Add affiliate ID if configured
  if (affiliateId) {
    params.set('aid', affiliateId);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Extract city name from full location string
 *
 * @param location - Full location string (e.g., "Tokyo, Japan" or "New York, NY, USA")
 * @returns City name only (e.g., "Tokyo", "New York")
 *
 * @example
 * extractCityName('Tokyo, Japan')
 * // => "Tokyo"
 *
 * extractCityName('New York, NY, USA')
 * // => "New York"
 */
export function extractCityName(location: string): string {
  return location.split(',')[0].trim();
}
