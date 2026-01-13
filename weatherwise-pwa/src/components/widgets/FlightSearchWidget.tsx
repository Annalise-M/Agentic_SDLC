/**
 * Flight Search Widget
 *
 * Skyscanner flight search integration as a modular widget.
 * Allows users to search for flights to their selected destinations.
 */

import { useState } from 'react';
import { FaPlane } from 'react-icons/fa';
import { useLocationStore } from '../../store/locations-store';
import { buildSkyscannerLink } from '../../lib/utils/affiliate-links';
import type { WidgetProps } from '../../types/widgets';
import styles from './BookingWidgets.module.scss';

export function FlightSearchWidget({ widget: _widget }: WidgetProps) {
  const { locations } = useLocationStore();
  const [selectedDestination, setSelectedDestination] = useState<string>(
    locations[0] || ''
  );

  const handleSearch = () => {
    if (!selectedDestination) return;
    const cityName = selectedDestination.split(',')[0].trim();
    const url = buildSkyscannerLink(cityName);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (locations.length === 0) {
    return (
      <div className={styles.widgetEmpty}>
        <FaPlane className={styles.emptyIcon} />
        <p className={styles.emptyText}>
          Add destinations to search for flights
        </p>
      </div>
    );
  }

  return (
    <div className={styles.bookingWidget}>
      <div className={styles.widgetHeader}>
        <FaPlane className={styles.widgetIcon} />
        <h3 className={styles.widgetTitle}>Find Flights</h3>
      </div>

      <div className={styles.widgetBody}>
        <label htmlFor="destination-select" className={styles.selectLabel}>
          To:
        </label>
        <select
          id="destination-select"
          className={styles.destinationSelect}
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <button
          className={styles.searchButton}
          onClick={handleSearch}
          disabled={!selectedDestination}
        >
          Search Flights →
        </button>

        <p className={styles.provider}>via Skyscanner</p>
      </div>
    </div>
  );
}
