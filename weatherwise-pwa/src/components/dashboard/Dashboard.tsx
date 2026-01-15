/**
 * Main Dashboard Component
 *
 * Renders the user's customized widget dashboard.
 * Shows enabled widgets in their configured layout.
 */

import { useState } from 'react';
import { useWidgetStore } from '../../store/widget-store';
import { useUIStore } from '../../store/ui-store';
import { WidgetContainer, WidgetWrapper } from './WidgetContainer';
import { WidgetRenderer } from './WidgetRenderer';
import { WidgetMarketplace } from './WidgetMarketplace';
import { ExpandedWidgetModal } from './ExpandedWidgetModal';
import { IoSparkles, IoLocationSharp } from 'react-icons/io5';
import { useLocationStore } from '../../store/locations-store';
import type { Widget } from '../../types/widgets';

interface DashboardProps {
  isMarketplaceOpen: boolean;
  onMarketplaceClose: () => void;
}

export function Dashboard({ isMarketplaceOpen, onMarketplaceClose }: DashboardProps) {
  const { getEnabledWidgets } = useWidgetStore();
  const { locations } = useLocationStore();
  const activeLocation = useUIStore((state) => state.activeLocation);
  const enabledWidgets = getEnabledWidgets().filter(w => w.type !== 'weather-comparison'); // Exclude weather cards
  const [expandedWidget, setExpandedWidget] = useState<Widget | null>(null);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Active Location Indicator */}
      {activeLocation && locations.length > 0 && (
        <div
          className="flex items-center gap-2 px-4 py-3 mb-3 rounded-lg transition-all duration-300"
          style={{
            background: 'rgba(34, 211, 238, 0.1)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
          }}
          role="status"
          aria-live="polite"
          aria-label={`Showing data for ${activeLocation.split(',')[0]}`}
        >
          <IoLocationSharp
            size={16}
            style={{ color: 'var(--accent-cyan)', flexShrink: 0 }}
            aria-hidden="true"
          />
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            Showing: <strong>{activeLocation.split(',')[0]}</strong>
          </span>
        </div>
      )}

      {/* Widgets Grid - Scrollable, no header */}
      <div className="flex-1 overflow-y-auto" style={{ paddingRight: '8px' }}>
        {locations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <IoSparkles className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent-cyan)', opacity: 0.4 }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Welcome to WeatherWise
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Add your first location using the search bar on the left to see weather data and unlock the dashboard widgets.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span>Try searching for</span>
                <code className="px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--accent-cyan)' }}>
                  Tokyo
                </code>
                <span>or</span>
                <code className="px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--accent-cyan)' }}>
                  New York
                </code>
              </div>
            </div>
          </div>
        ) : (
          <WidgetContainer>
            {enabledWidgets.map((widget) => (
              <WidgetWrapper
                key={widget.id}
                widget={widget}
                onExpand={() => setExpandedWidget(widget)}
              >
                <WidgetRenderer widget={widget} />
              </WidgetWrapper>
            ))}
          </WidgetContainer>
        )}
      </div>

      {/* Widget Marketplace Modal */}
      <WidgetMarketplace
        isOpen={isMarketplaceOpen}
        onClose={onMarketplaceClose}
      />

      {/* Expanded Widget Modal */}
      {expandedWidget && (
        <ExpandedWidgetModal
          isOpen={!!expandedWidget}
          onClose={() => setExpandedWidget(null)}
          title={getWidgetTitle(expandedWidget)}
        >
          <WidgetRenderer widget={expandedWidget} isExpanded />
        </ExpandedWidgetModal>
      )}
    </div>
  );
}

// Helper to get widget display name
function getWidgetTitle(widget: Widget): string {
  const titles: Record<string, string> = {
    'weather-comparison': 'Weather Comparison',
    'temperature-trend': 'Temperature Trends',
    'weather-metrics': 'Weather Metrics',
    'flight-search': 'Flight Search',
    'hotel-search': 'Hotel Search',
    'packing-list': 'Smart Packing List',
    'trip-calendar': 'Trip Calendar',
    'duolingo-progress': 'Language Progress',
    'budget-tracker': 'Trip Budget',
    'currency-converter': 'Currency Converter',
  };

  return titles[widget.type] || 'Widget Details';
}
