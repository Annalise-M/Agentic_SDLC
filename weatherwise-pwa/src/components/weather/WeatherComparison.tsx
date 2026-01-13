/**
 * Weather Comparison Widget
 *
 * The core weather comparison feature wrapped as a widget.
 * Displays a carousel of WeatherCard components for each saved location.
 */

import { IoCloudSharp, IoLocationSharp } from 'react-icons/io5';
import { WeatherCard } from './WeatherCard';
import { useLocationStore } from '../../store/locations-store';
import { useGeolocation } from '../../lib/hooks/useGeolocation';
import type { WidgetProps } from '../../types/widgets';

export function WeatherComparison({ widget: _widget }: WidgetProps) {
  const { locations } = useLocationStore();
  const geolocation = useGeolocation();

  // Empty state - waiting for location
  if (locations.length === 0) {
    return (
      <div className="text-center py-24 animate-slide-up">
        {geolocation.loading ? (
          <div className="inline-flex flex-col items-center gap-4 px-8 py-12 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl shadow-blue-500/5">
            <div className="relative">
              <IoLocationSharp className="w-16 h-16 text-blue-500 animate-pulse" />
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Finding your location...
              </h3>
              <p className="text-gray-600">
                We'll show you local weather in a moment
              </p>
            </div>
          </div>
        ) : (
          <div className="inline-flex flex-col items-center gap-4 px-8 py-12 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
            <IoCloudSharp className="w-16 h-16 text-gray-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Ready to compare
              </h3>
              <p className="text-gray-500">
                Search for your first destination above
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Weather cards carousel
  return (
    <section
      aria-label="Weather comparison cards"
      className="carousel-container"
      tabIndex={0}
    >
      <div className="carousel-track" role="group">
        {locations.map((location, index) => (
          <div
            key={location}
            className="carousel-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <WeatherCard location={location} />
          </div>
        ))}
      </div>
      <div className="sr-only" aria-live="polite">
        Use arrow keys or swipe to navigate between {locations.length} weather
        cards
      </div>
    </section>
  );
}
