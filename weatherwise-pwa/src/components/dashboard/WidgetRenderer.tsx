/**
 * Widget Renderer
 *
 * Maps widget types to their actual component implementations.
 * This is the bridge between the widget store and the UI.
 */

import type { Widget } from '../../types/widgets';
import { FlightSearchWidget } from '../widgets/FlightSearchWidget';
import { HotelSearchWidget } from '../widgets/HotelSearchWidget';
import { WeatherComparison } from '../weather/WeatherComparison';

interface WidgetRendererProps {
  widget: Widget;
}

/**
 * Renders the appropriate widget component based on widget type
 */
export function WidgetRenderer({ widget }: WidgetRendererProps) {
  switch (widget.type) {
    case 'weather-comparison':
      return <WeatherComparison widget={widget} />;

    case 'flight-search':
      return <FlightSearchWidget widget={widget} />;

    case 'hotel-search':
      return <HotelSearchWidget widget={widget} />;

    case 'packing-list':
      return <ComingSoonWidget widget={widget} name="Smart Packing List" />;

    case 'trip-calendar':
      return <ComingSoonWidget widget={widget} name="Trip Calendar" />;

    case 'duolingo-progress':
      return <ComingSoonWidget widget={widget} name="Language Progress" />;

    case 'budget-tracker':
      return <ComingSoonWidget widget={widget} name="Trip Budget" />;

    case 'currency-converter':
      return <ComingSoonWidget widget={widget} name="Currency Converter" />;

    default:
      return <div>Unknown widget type: {widget.type}</div>;
  }
}

/**
 * Placeholder for widgets that haven't been implemented yet
 */
function ComingSoonWidget({ widget: _widget, name }: { widget: Widget; name: string }) {
  return (
    <div
      style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚧</div>
      <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{name}</h3>
      <p style={{ fontSize: '0.875rem', margin: 0 }}>Coming soon!</p>
    </div>
  );
}
