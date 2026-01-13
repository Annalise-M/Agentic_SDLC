/**
 * Widget System Types
 *
 * Defines the types for the modular widget/plugin dashboard system.
 * Widgets can be enabled/disabled, reordered, and configured by users.
 */

/**
 * Widget category for organization in the marketplace
 */
export type WidgetCategory =
  | 'weather'      // Core weather features
  | 'booking'      // Flight, hotel, car rental
  | 'learning'     // Language learning (Duolingo, etc.)
  | 'planning'     // Packing lists, itineraries
  | 'finance'      // Currency, budgets
  | 'social';      // Travel photos, check-ins

/**
 * Widget types available in the system
 */
export type WidgetType =
  | 'weather-comparison'   // Core weather cards (always enabled)
  | 'flight-search'        // Skyscanner flight finder
  | 'hotel-search'         // Booking.com hotel finder
  | 'packing-list'         // Weather-based packing suggestions
  | 'trip-calendar'        // Travel date tracker
  | 'duolingo-progress'    // Duolingo language learning stats
  | 'budget-tracker'       // Trip budget estimator
  | 'currency-converter';  // Exchange rates

/**
 * Widget configuration interface
 */
export interface Widget {
  /** Unique identifier */
  id: string;

  /** Widget type */
  type: WidgetType;

  /** Whether widget is currently enabled/visible */
  enabled: boolean;

  /** Position in dashboard (lower = higher up) */
  position: number;

  /** Widget-specific configuration */
  config: WidgetConfig;

  /** Whether user has connected required accounts */
  connected?: boolean;

  /** Last updated timestamp */
  updatedAt?: number;
}

/**
 * Widget-specific configuration options
 */
export interface WidgetConfig {
  /** Display preferences */
  display?: {
    size?: 'small' | 'medium' | 'large';
    showTitle?: boolean;
  };

  /** OAuth tokens for third-party integrations */
  auth?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };

  /** Custom settings per widget type */
  settings?: Record<string, any>;
}

/**
 * Widget metadata for marketplace catalog
 */
export interface WidgetMetadata {
  id: string;
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  category: WidgetCategory;

  /** Whether OAuth connection is required */
  requiresAuth: boolean;

  /** OAuth provider name if required */
  authProvider?: 'duolingo' | 'google' | 'airbnb' | 'tripit';

  /** Is this a premium/paid widget? */
  isPremium?: boolean;

  /** Preview image URL */
  previewImage?: string;
}

/**
 * Dashboard layout configuration
 */
export interface DashboardConfig {
  /** List of widgets */
  widgets: Widget[];

  /** Layout style */
  layout: 'grid' | 'sidebar' | 'minimal';

  /** Grid columns (for grid layout) */
  gridColumns?: number;
}

/**
 * Widget component props interface
 */
export interface WidgetProps {
  widget: Widget;
  onConfigure?: () => void;
  onRemove?: () => void;
}
