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
import { WeatherCard } from '../weather/WeatherCard';
import { useActiveLocation } from '../../lib/hooks/useActiveLocation';
import { IoCloudSharp } from 'react-icons/io5';
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
  const enabledWidgets = getEnabledWidgets().filter(w => w.type !== 'weather-comparison'); // Exclude weather cards from widget list
  const [expandedWidget, setExpandedWidget] = useState<Widget | null>(null);

  // Track active location for context-aware widgets
  const { observeCard } = useActiveLocation({ locations });

  return (
    <>
      {/* Empty State */}
      {locations.length === 0 ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '28rem', padding: '1rem' }}>
            <IoCloudSharp
              style={{
                width: '4rem',
                height: '4rem',
                margin: '0 auto 1rem',
                opacity: 0.2,
                color: 'var(--text-tertiary)'
              }}
            />
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: 'var(--text-dark-primary)'
            }}>
              Welcome to WeatherWise
            </h3>
            <p style={{
              fontSize: '0.875rem',
              marginBottom: '1rem',
              color: 'var(--text-dark-secondary)'
            }}>
              Search for a location to get started with weather data and dashboard widgets.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--text-dark-tertiary)'
            }}>
              <span>Try searching for</span>
              <code style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                background: 'var(--bg-elevated)',
                color: 'var(--accent-cyan)'
              }}>
                Tokyo
              </code>
              <span>or</span>
              <code style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                background: 'var(--bg-elevated)',
                color: 'var(--accent-cyan)'
              }}>
                New York
              </code>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Weather Cards Section - Simple vertical stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '48px' }}>
            {locations.map((location) => (
              <div key={`weather-${location}`}>
                <WeatherCard
                  location={location}
                  onIntersect={observeCard}
                  isActive={activeLocation === location}
                />
              </div>
            ))}
          </div>

          {/* Widgets Section - Clean CSS Grid */}
          {enabledWidgets.length > 0 && (
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
        </>
      )}

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
    </>
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
