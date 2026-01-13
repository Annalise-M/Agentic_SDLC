/**
 * Widget Catalog
 *
 * Defines all available widgets with their metadata.
 * This is the "marketplace" of widgets users can add to their dashboard.
 */

import type { WidgetMetadata } from '../../types/widgets';

/**
 * Complete catalog of available widgets
 */
export const WIDGET_CATALOG: WidgetMetadata[] = [
  // Core weather widget (always enabled, not in marketplace)
  {
    id: 'weather-main',
    type: 'weather-comparison',
    name: 'Weather Comparison',
    description: 'Compare weather across multiple travel destinations',
    icon: '🌤️',
    category: 'weather',
    requiresAuth: false,
  },

  // Booking widgets
  {
    id: 'flights',
    type: 'flight-search',
    name: 'Flight Finder',
    description: 'Search for flights to your destinations with Skyscanner',
    icon: '✈️',
    category: 'booking',
    requiresAuth: false,
  },
  {
    id: 'hotels',
    type: 'hotel-search',
    name: 'Hotel Search',
    description: 'Find and book hotels with Booking.com',
    icon: '🏨',
    category: 'booking',
    requiresAuth: false,
  },

  // Planning widgets
  {
    id: 'packing',
    type: 'packing-list',
    name: 'Smart Packing List',
    description: 'Get weather-based packing recommendations for your trip',
    icon: '🎒',
    category: 'planning',
    requiresAuth: false,
  },
  {
    id: 'calendar',
    type: 'trip-calendar',
    name: 'Trip Calendar',
    description: 'Track your travel dates and countdown to departure',
    icon: '📅',
    category: 'planning',
    requiresAuth: false,
  },

  // Learning widgets
  {
    id: 'duolingo',
    type: 'duolingo-progress',
    name: 'Language Progress',
    description: 'Track your Duolingo language learning for your destination',
    icon: '🦉',
    category: 'learning',
    requiresAuth: true,
    authProvider: 'duolingo',
    isPremium: true,
  },

  // Finance widgets
  {
    id: 'budget',
    type: 'budget-tracker',
    name: 'Trip Budget',
    description: 'Estimate and track your travel expenses',
    icon: '💰',
    category: 'finance',
    requiresAuth: false,
  },
  {
    id: 'currency',
    type: 'currency-converter',
    name: 'Currency Converter',
    description: 'Real-time exchange rates for your destinations',
    icon: '💱',
    category: 'finance',
    requiresAuth: false,
  },
];

/**
 * Get widget metadata by type
 */
export function getWidgetMetadata(type: string): WidgetMetadata | undefined {
  return WIDGET_CATALOG.find((w) => w.type === type);
}

/**
 * Get widgets by category
 */
export function getWidgetsByCategory(category: string): WidgetMetadata[] {
  return WIDGET_CATALOG.filter((w) => w.category === category);
}

/**
 * Get all widget categories
 */
export function getWidgetCategories(): string[] {
  return Array.from(new Set(WIDGET_CATALOG.map((w) => w.category)));
}

/**
 * Get free widgets only
 */
export function getFreeWidgets(): WidgetMetadata[] {
  return WIDGET_CATALOG.filter((w) => !w.isPremium);
}

/**
 * Get premium widgets only
 */
export function getPremiumWidgets(): WidgetMetadata[] {
  return WIDGET_CATALOG.filter((w) => w.isPremium);
}

/**
 * Get widgets that require authentication
 */
export function getAuthWidgets(): WidgetMetadata[] {
  return WIDGET_CATALOG.filter((w) => w.requiresAuth);
}
