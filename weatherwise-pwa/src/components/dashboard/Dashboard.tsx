/**
 * Main Dashboard Component
 *
 * Renders the user's customized widget dashboard.
 * Shows enabled widgets in their configured layout.
 */

import { useState } from 'react';
import { useWidgetStore } from '../../store/widget-store';
import { WidgetContainer, WidgetWrapper } from './WidgetContainer';
import { WidgetRenderer } from './WidgetRenderer';
import { WidgetMarketplace } from './WidgetMarketplace';
import { IoSparkles, IoApps } from 'react-icons/io5';
import { useLocationStore } from '../../store/locations-store';

export function Dashboard() {
  const { getEnabledWidgets } = useWidgetStore();
  const { locations } = useLocationStore();
  const enabledWidgets = getEnabledWidgets();
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

  return (
    <>
      {/* Widget Controls */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsMarketplaceOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open widget marketplace"
        >
          <IoApps className="w-5 h-5" />
          <span className="font-medium">Customize Widgets</span>
        </button>
      </div>

      <WidgetContainer>
        {enabledWidgets.map((widget) => (
          <WidgetWrapper key={widget.id} widget={widget}>
            <WidgetRenderer widget={widget} />
          </WidgetWrapper>
        ))}
      </WidgetContainer>

      {/* Tip Card - Show when user has added locations but only one */}
      {locations.length > 0 && locations.length < 2 && (
        <div className="mt-12 max-w-2xl mx-auto animate-fade-in">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 p-2 rounded-xl">
                <IoSparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Add more locations
                </h4>
                <p className="text-sm text-gray-600">
                  Compare weather side-by-side to make the best decision for
                  your trip
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widget Marketplace Modal */}
      <WidgetMarketplace
        isOpen={isMarketplaceOpen}
        onClose={() => setIsMarketplaceOpen(false)}
      />
    </>
  );
}
