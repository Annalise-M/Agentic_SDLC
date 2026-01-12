import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildSkyscannerLink, buildBookingLink, extractCityName } from './affiliate-links';

describe('Affiliate Link Builders', () => {
  beforeEach(() => {
    // Mock the current date to January 15, 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('buildSkyscannerLink', () => {
    it('should build link with destination and default dates', () => {
      const link = buildSkyscannerLink('Tokyo');

      expect(link).toContain('skyscanner.net/g/referrals/v1/flights/day-view');
      expect(link).toContain('destination=Tokyo');
      expect(link).toContain('outboundDate=2026-01-22'); // 7 days from mock date
      expect(link).toContain('inboundDate=2026-01-29'); // 14 days from mock date
    });

    it('should include origin when provided', () => {
      const link = buildSkyscannerLink('Tokyo', 'New York');

      expect(link).toContain('origin=New+York');
      expect(link).toContain('destination=Tokyo');
    });

    it('should properly encode special characters in city names', () => {
      const link = buildSkyscannerLink('São Paulo');

      expect(link).toContain('S%C3%A3o+Paulo');
    });

    it('should handle multi-word city names', () => {
      const link = buildSkyscannerLink('New York', 'Los Angeles');

      expect(link).toContain('destination=New+York');
      expect(link).toContain('origin=Los+Angeles');
    });

    it('should not include affiliate ID when not configured', () => {
      const link = buildSkyscannerLink('Tokyo');

      // Should not include mediaPartnerId if not set in config
      expect(link).not.toContain('mediaPartnerId');
    });
  });

  describe('buildBookingLink', () => {
    it('should build link with city and default dates', () => {
      const link = buildBookingLink('Tokyo');

      expect(link).toContain('booking.com/searchresults.html');
      expect(link).toContain('ss=Tokyo');
      expect(link).toContain('checkin=2026-01-22'); // 7 days from mock date
      expect(link).toContain('checkout=2026-01-29'); // 14 days from mock date
    });

    it('should include default guest and room parameters', () => {
      const link = buildBookingLink('Paris');

      expect(link).toContain('group_adults=2');
      expect(link).toContain('no_rooms=1');
    });

    it('should properly encode special characters in city names', () => {
      const link = buildBookingLink('Zürich');

      expect(link).toContain('Z%C3%BCrich');
    });

    it('should handle multi-word city names', () => {
      const link = buildBookingLink('New York');

      expect(link).toContain('ss=New+York');
    });

    it('should not include affiliate ID when not configured', () => {
      const link = buildBookingLink('Tokyo');

      // Should not include aid if not set in config
      expect(link).not.toContain('aid=');
    });
  });

  describe('extractCityName', () => {
    it('should extract city from simple location string', () => {
      expect(extractCityName('Tokyo, Japan')).toBe('Tokyo');
      expect(extractCityName('Paris, France')).toBe('Paris');
      expect(extractCityName('Barcelona, Spain')).toBe('Barcelona');
    });

    it('should extract city from complex location string', () => {
      expect(extractCityName('New York, NY, USA')).toBe('New York');
      expect(extractCityName('Los Angeles, CA, USA')).toBe('Los Angeles');
    });

    it('should handle location without commas', () => {
      expect(extractCityName('London')).toBe('London');
      expect(extractCityName('Tokyo')).toBe('Tokyo');
    });

    it('should trim whitespace', () => {
      expect(extractCityName('  Tokyo  , Japan  ')).toBe('Tokyo');
      expect(extractCityName('Paris , France')).toBe('Paris');
    });

    it('should handle special characters', () => {
      expect(extractCityName('São Paulo, Brazil')).toBe('São Paulo');
      expect(extractCityName('Zürich, Switzerland')).toBe('Zürich');
    });
  });

  describe('Date calculations', () => {
    it('should calculate dates 7 and 14 days in future', () => {
      const flightLink = buildSkyscannerLink('Tokyo');
      const hotelLink = buildBookingLink('Tokyo');

      // Both should use same dates
      expect(flightLink).toContain('outboundDate=2026-01-22');
      expect(flightLink).toContain('inboundDate=2026-01-29');
      expect(hotelLink).toContain('checkin=2026-01-22');
      expect(hotelLink).toContain('checkout=2026-01-29');
    });

    it('should use correct date format (YYYY-MM-DD)', () => {
      const link = buildSkyscannerLink('Paris');

      // Check format with regex
      expect(link).toMatch(/outboundDate=\d{4}-\d{2}-\d{2}/);
      expect(link).toMatch(/inboundDate=\d{4}-\d{2}-\d{2}/);
    });
  });
});
