/**
 * Destination-Themed Color Palettes
 *
 * Dynamic color themes based on destination type for vibrant, context-aware design.
 */

import { getLocationGradient } from '../api/unsplash';

export type DestinationTheme = {
  gradient: string;
  accent: string;
  text: string;
};

/**
 * Curated destination themes for common location types
 */
export const DESTINATION_THEMES: Record<string, DestinationTheme> = {
  tropical: {
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)',
    accent: '#22d3ee',
    text: '#ffffff',
  },
  desert: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
    accent: '#fbbf24',
    text: '#ffffff',
  },
  arctic: {
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
    accent: '#0ea5e9',
    text: '#0c4a6e',
  },
  urban: {
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)',
    accent: '#94a3b8',
    text: '#ffffff',
  },
  forest: {
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
    accent: '#4ade80',
    text: '#ffffff',
  },
  mountain: {
    gradient: 'linear-gradient(135deg, #78716c 0%, #57534e 50%, #44403c 100%)',
    accent: '#a8a29e',
    text: '#ffffff',
  },
};

/**
 * Intelligently detect destination theme based on location name
 */
export function getDestinationTheme(location: string): DestinationTheme {
  const lower = location.toLowerCase();

  // Tropical/Beach destinations
  if (
    lower.includes('beach') ||
    lower.includes('miami') ||
    lower.includes('hawaii') ||
    lower.includes('bahamas') ||
    lower.includes('caribbean') ||
    lower.includes('fiji') ||
    lower.includes('maldives') ||
    lower.includes('bali')
  ) {
    return DESTINATION_THEMES.tropical;
  }

  // Desert destinations
  if (
    lower.includes('desert') ||
    lower.includes('dubai') ||
    lower.includes('las vegas') ||
    lower.includes('vegas') ||
    lower.includes('phoenix') ||
    lower.includes('sahara') ||
    lower.includes('arizona')
  ) {
    return DESTINATION_THEMES.desert;
  }

  // Arctic/Cold destinations
  if (
    lower.includes('iceland') ||
    lower.includes('norway') ||
    lower.includes('alaska') ||
    lower.includes('greenland') ||
    lower.includes('finland') ||
    lower.includes('sweden')
  ) {
    return DESTINATION_THEMES.arctic;
  }

  // Urban/City destinations
  if (
    lower.includes('tokyo') ||
    lower.includes('new york') ||
    lower.includes('london') ||
    lower.includes('paris') ||
    lower.includes('singapore') ||
    lower.includes('hong kong') ||
    lower.includes('chicago') ||
    lower.includes('seoul')
  ) {
    return DESTINATION_THEMES.urban;
  }

  // Forest/Nature destinations
  if (
    lower.includes('forest') ||
    lower.includes('seattle') ||
    lower.includes('portland') ||
    lower.includes('rainforest') ||
    lower.includes('jungle') ||
    lower.includes('amazon')
  ) {
    return DESTINATION_THEMES.forest;
  }

  // Mountain destinations
  if (
    lower.includes('mountain') ||
    lower.includes('alps') ||
    lower.includes('denver') ||
    lower.includes('aspen') ||
    lower.includes('himalaya')
  ) {
    return DESTINATION_THEMES.mountain;
  }

  // Fallback to existing gradient generation
  return {
    gradient: getLocationGradient(location),
    accent: '#22d3ee',
    text: '#ffffff',
  };
}
