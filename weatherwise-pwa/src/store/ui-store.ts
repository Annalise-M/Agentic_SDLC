/**
 * UI Store
 *
 * Manages ephemeral UI state (not persisted to localStorage).
 * - Active location for context-aware widgets
 * - Modal states
 * - Other session-only UI preferences
 */

import { create } from 'zustand';

export interface UIState {
  // Active location that widgets should display data for
  activeLocation: string | null;
  setActiveLocation: (location: string | null) => void;
}

/**
 * Zustand store for managing ephemeral UI state
 * Does NOT persist to localStorage - resets on page load
 */
export const useUIStore = create<UIState>()((set) => ({
  activeLocation: null,
  setActiveLocation: (location) => set({ activeLocation: location }),
}));
