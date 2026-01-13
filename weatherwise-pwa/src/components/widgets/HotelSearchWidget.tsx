/**
 * Hotel Search Widget
 *
 * Booking.com hotel search integration as a modular widget.
 * Allows users to search for hotels in their selected destinations.
 */

import { useState } from 'react';
import { FaHotel } from 'react-icons/fa';
import { useLocationStore } from '../../store/locations-store';
import { buildBookingLink } from '../../lib/utils/affiliate-links';
import type { WidgetProps } from '../../types/widgets';
import styles from './BookingWidgets.module.scss';

export function HotelSearchWidget({ widget: _widget }: WidgetProps) {
  const { locations } = useLocationStore();
  const [selectedDestination, setSelectedDestination] = useState<string>(
    locations[0] || ''
  );

  const handleSearch = () => {
    if (!selectedDestination) return;
    const cityName = selectedDestination.split(',')[0].trim();
    const url = buildBookingLink(cityName);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (locations.length === 0) {
    return (
      <div className={styles.widgetEmpty}>
        <FaHotel className={styles.emptyIcon} />
        <p className={styles.emptyText}>
          Add destinations to search for hotels
        </p>
      </div>
    );
  }

  return (
    <div className={styles.bookingWidget}>
      <div className={styles.widgetHeader}>
        <FaHotel className={styles.widgetIcon} />
        <h3 className={styles.widgetTitle}>Find Hotels</h3>
      </div>

      <div className={styles.widgetBody}>
        <label htmlFor="hotel-destination-select" className={styles.selectLabel}>
          In:
        </label>
        <select
          id="hotel-destination-select"
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
          Search Hotels →
        </button>

        <p className={styles.provider}>via Booking.com</p>
      </div>
    </div>
  );
}
