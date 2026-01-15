/**
 * Widget Store
 *
 * Manages dashboard widgets - enabling, disabling, reordering, and configuring.
 * Persists to localStorage so user's dashboard layout is saved.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Widget, WidgetType, WidgetConfig, DashboardConfig } from '../types/widgets';

interface WidgetStore extends DashboardConfig {
  // Widget management
  addWidget: (type: WidgetType, config?: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  enableWidget: (id: string) => void;
  disableWidget: (id: string) => void;
  toggleWidget: (id: string) => void;

  // Widget configuration
  updateWidgetConfig: (id: string, config: Partial<WidgetConfig>) => void;
  setWidgetConnected: (id: string, connected: boolean) => void;

  // Layout management
  reorderWidgets: (widgetIds: string[]) => void;
  setLayout: (layout: DashboardConfig['layout']) => void;
  setGridColumns: (columns: number) => void;

  // Utility
  getWidget: (id: string) => Widget | undefined;
  getEnabledWidgets: () => Widget[];
  resetToDefault: () => void;
}

/**
 * Default widgets configuration
 * Weather comparison is always enabled, others start disabled
 */
const DEFAULT_WIDGETS: Widget[] = [
  {
    id: 'weather-main',
    type: 'weather-comparison',
    enabled: true,
    position: 0,
    config: {},
  },
  {
    id: 'temp-trend',
    type: 'temperature-trend',
    enabled: true,
    position: 1,
    config: {},
  },
  {
    id: 'metrics',
    type: 'weather-metrics',
    enabled: true,
    position: 2,
    config: {},
  },
  {
    id: 'flights',
    type: 'flight-search',
    enabled: false,
    position: 3,
    config: {},
  },
  {
    id: 'hotels',
    type: 'hotel-search',
    enabled: false,
    position: 4,
    config: {},
  },
  {
    id: 'packing',
    type: 'packing-list',
    enabled: false,
    position: 5,
    config: {},
  },
];

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      widgets: DEFAULT_WIDGETS,
      layout: 'grid',
      gridColumns: 2,

      // Add a new widget
      addWidget: (type, config = {}) => {
        const existingWidget = get().widgets.find((w) => w.type === type);
        if (existingWidget) {
          // Widget already exists, just enable it
          set((state) => ({
            widgets: state.widgets.map((w) =>
              w.type === type ? { ...w, enabled: true } : w
            ),
          }));
          return;
        }

        // Create new widget
        const newWidget: Widget = {
          id: `${type}-${Date.now()}`,
          type,
          enabled: true,
          position: get().widgets.length,
          config,
          updatedAt: Date.now(),
        };

        set((state) => ({
          widgets: [...state.widgets, newWidget],
        }));
      },

      // Remove widget completely
      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        }));
      },

      // Enable a widget
      enableWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, enabled: true, updatedAt: Date.now() } : w
          ),
        }));
      },

      // Disable a widget
      disableWidget: (id) => {
        const widget = get().getWidget(id);
        // Prevent disabling the core weather widget
        if (widget?.type === 'weather-comparison') {
          console.warn('Cannot disable core weather widget');
          return;
        }

        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, enabled: false, updatedAt: Date.now() } : w
          ),
        }));
      },

      // Toggle widget on/off
      toggleWidget: (id) => {
        const widget = get().getWidget(id);
        if (!widget) return;

        if (widget.enabled) {
          get().disableWidget(id);
        } else {
          get().enableWidget(id);
        }
      },

      // Update widget configuration
      updateWidgetConfig: (id, config) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id
              ? {
                  ...w,
                  config: { ...w.config, ...config },
                  updatedAt: Date.now(),
                }
              : w
          ),
        }));
      },

      // Mark widget as connected (for OAuth widgets)
      setWidgetConnected: (id, connected) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, connected, updatedAt: Date.now() } : w
          ),
        }));
      },

      // Reorder widgets by array of IDs
      reorderWidgets: (widgetIds) => {
        set((state) => ({
          widgets: state.widgets.map((w) => ({
            ...w,
            position: widgetIds.indexOf(w.id),
          })),
        }));
      },

      // Change dashboard layout
      setLayout: (layout) => {
        set({ layout });
      },

      // Set grid columns
      setGridColumns: (columns) => {
        set({ gridColumns: columns });
      },

      // Get specific widget
      getWidget: (id) => {
        return get().widgets.find((w) => w.id === id);
      },

      // Get all enabled widgets, sorted by position
      getEnabledWidgets: () => {
        return get()
          .widgets.filter((w) => w.enabled)
          .sort((a, b) => a.position - b.position);
      },

      // Reset to default configuration
      resetToDefault: () => {
        set({
          widgets: DEFAULT_WIDGETS,
          layout: 'grid',
          gridColumns: 2,
        });
      },
    }),
    {
      name: 'weatherwise-widgets',
      version: 1,
    }
  )
);
