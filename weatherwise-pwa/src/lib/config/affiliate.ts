/**
 * Affiliate program configuration
 *
 * Manages affiliate IDs and base URLs for external booking services.
 * Affiliate IDs are optional - links will work without them but won't track commissions.
 */

export const affiliateConfig = {
  skyscanner: {
    affiliateId: import.meta.env.VITE_SKYSCANNER_AFFILIATE_ID || '',
    baseUrl: 'https://skyscanner.net/g/referrals/v1/flights/day-view',
  },
  booking: {
    affiliateId: import.meta.env.VITE_BOOKING_AFFILIATE_ID || '',
    baseUrl: 'https://www.booking.com/searchresults.html',
  },
} as const;

/**
 * Check if Skyscanner affiliate tracking is enabled
 */
export function hasSkyscannerAffiliate(): boolean {
  return Boolean(affiliateConfig.skyscanner.affiliateId);
}

/**
 * Check if Booking.com affiliate tracking is enabled
 */
export function hasBookingAffiliate(): boolean {
  return Boolean(affiliateConfig.booking.affiliateId);
}
