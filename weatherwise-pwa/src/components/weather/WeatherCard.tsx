import { IoClose, IoWater, IoEye, IoSpeedometer, IoSunny, IoLocationSharp, IoStar, IoStarOutline } from 'react-icons/io5';
import { WiStrongWind } from 'react-icons/wi';
import { FaPlane, FaHotel } from 'react-icons/fa';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useWeather } from '../../lib/hooks/useWeather';
import { useLocationStore } from '../../store/locations-store';
import { getWeatherIconUrl } from '../../lib/api/weather';
import { getLocationImageAsync, getLocationGradient } from '../../lib/api/unsplash';
import { convertTemperature, getTemperatureSymbol } from '../../lib/utils/temperature';
import { buildSkyscannerLink, buildBookingLink } from '../../lib/utils/affiliate-links';
import { db } from '../../lib/db/indexed-db';
import type { WeatherDay } from '../../types/weather';
import styles from './WeatherCard.module.scss';

interface WeatherCardProps {
  location: string;
}

export function WeatherCard({ location }: WeatherCardProps) {
  console.log('✨ NEW SCSS WeatherCard rendering for:', location);
  const { data, isLoading, error } = useWeather(location);
  const { removeLocation, temperatureUnit, toggleOfflineLocation, isOfflineLocation, maxOfflineLocations, offlineLocations } = useLocationStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [locationImage, setLocationImage] = useState<string>('');
  const isOffline = isOfflineLocation(location);

  // Fetch location-specific landscape image (deterministic, no people)
  useEffect(() => {
    if (location && !locationImage) {
      console.log(`🏙️ Fetching landscape image for ${location}`);
      getLocationImageAsync(location, 1600, 1200).then(setLocationImage);
    }
  }, [location]); // Only fetch if location changes, prevent refetching

  // Cache weather data to IndexedDB when location is saved for offline
  useEffect(() => {
    if (data && isOffline) {
      db.cacheWeather(location, data).catch((err) => {
        console.error('Failed to cache weather data:', err);
      });
    }
  }, [data, isOffline, location]);

  // GSAP entrance animation
  useEffect(() => {
    if (cardRef.current && !isLoading && data) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }
  }, [data, isLoading]);

  // Handle offline toggle
  const handleOfflineToggle = () => {
    if (!isOffline && offlineLocations.length >= maxOfflineLocations) {
      alert(`You can only save ${maxOfflineLocations} locations for offline use.`);
      return;
    }

    toggleOfflineLocation(location);

    if (isOffline) {
      // Remove from IndexedDB when un-starring
      db.weatherCache.where('location').equals(location).delete().catch((err) => {
        console.error('Failed to remove cached weather:', err);
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingCard} role="status" aria-label={`Loading weather data for ${location}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSkeleton}></div>
          <div className={styles.loadingContent}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonTemp}></div>
            <div className={styles.skeletonMetrics}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.skeletonMetric}></div>
              ))}
            </div>
          </div>
        </div>
        <span className="sr-only">Loading weather data for {location}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorCard} role="alert" aria-live="polite">
        <div className={styles.errorHeader}>
          <h2 className={styles.errorTitle}>{location}</h2>
          <button
            onClick={() => removeLocation(location)}
            className={styles.removeButton}
            aria-label={`Remove ${location} from comparison`}
          >
            <IoClose size={20} />
          </button>
        </div>
        <div className={styles.errorContent}>
          <p className={styles.errorHeading}>Unable to load weather data</p>
          <p className={styles.errorMessage}>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const currentConditions = data.currentConditions || data.days[0];
  const forecast = data.days.slice(0, 7);
  const temp = convertTemperature(currentConditions.temp, temperatureUnit);
  const feelsLike = convertTemperature(currentConditions.feelslike, temperatureUnit);
  const tempSymbol = getTemperatureSymbol(temperatureUnit);

  // Clean up location display to avoid duplication
  const cityName = location.split(',')[0].trim();
  const fullAddress = data.resolvedAddress;

  // Remove city name from address if it starts with it to avoid repetition
  const cleanAddress = fullAddress.startsWith(cityName)
    ? fullAddress.substring(cityName.length).replace(/^,\s*/, '')
    : fullAddress;

  // Use fetched location image or gradient fallback
  const backgroundStyle = locationImage
    ? { backgroundImage: `url(${locationImage})` }
    : { background: getLocationGradient(location) };

  return (
    <article
      ref={cardRef}
      className={styles.weatherCard}
      aria-label={`Weather information for ${cityName}`}
    >
      <div className={styles.cardContainer}>
        {/* Left Side - Location Image */}
        <div className={styles.imagePanel} role="img" aria-label={`Background image of ${cityName}`}>
          <div
            className={styles.imageBackground}
            style={backgroundStyle}
            aria-hidden="true"
          />
          <div className={styles.imageOverlay} aria-hidden="true" />

          <header className={styles.locationInfo}>
            <div className={styles.locationHeader}>
              <IoLocationSharp className={styles.locationIcon} aria-hidden="true" />
              <div>
                <h2 className={styles.cityName}>
                  {cityName}
                </h2>
                {cleanAddress && (
                  <p className={styles.address}>{cleanAddress}</p>
                )}
              </div>
            </div>
            {isOffline && (
              <div className={styles.offlineBadge} role="status" aria-label="This location is saved for offline viewing">
                <IoStar size={12} aria-hidden="true" />
                <span>Saved for Offline</span>
              </div>
            )}
          </header>

          {/* Action Buttons */}
          <div className={styles.actionButtons} role="group" aria-label="Location actions">
            <button
              onClick={handleOfflineToggle}
              className={`${styles.actionButton} ${isOffline ? styles.offlineActive : ''}`}
              aria-label={isOffline ? `Remove ${cityName} from offline storage` : `Save ${cityName} for offline viewing`}
              aria-pressed={isOffline}
            >
              {isOffline ? <IoStar size={20} /> : <IoStarOutline size={20} />}
            </button>
            <button
              onClick={() => removeLocation(location)}
              className={styles.actionButton}
              aria-label={`Remove ${cityName} from weather comparison`}
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>

        {/* Right Side - Weather Details */}
        <div className={styles.detailsPanel}>
          <div className={styles.currentWeather}>
            {/* Temperature */}
            <div className={styles.temperatureSection}>
              <div>
                <div className={styles.temperatureMain} aria-label={`Current temperature ${temp} degrees ${temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}`}>
                  {temp}°
                  <span className="sr-only">{temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}</span>
                </div>
                <p className={styles.feelsLike}>
                  Feels like {feelsLike}{tempSymbol}
                </p>
              </div>
              <div className={styles.weatherIcon}>
                <img
                  src={getWeatherIconUrl(currentConditions.icon)}
                  alt={`Weather icon showing ${currentConditions.conditions}`}
                />
                <p className={styles.conditionText}>
                  {currentConditions.conditions}
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
              <MetricItem
                icon={<IoWater size={16} />}
                label="Humidity"
                value={`${Math.round(currentConditions.humidity)}%`}
              />
              <MetricItem
                icon={<WiStrongWind size={20} />}
                label="Wind"
                value={`${Math.round(currentConditions.windspeed)} km/h`}
              />
              <MetricItem
                icon={<IoSunny size={16} />}
                label="UV Index"
                value={Math.round(currentConditions.uvindex || 0)}
              />
              <MetricItem
                icon={<IoEye size={16} />}
                label="Visibility"
                value={`${Math.round(currentConditions.visibility)} km`}
              />
              <MetricItem
                icon={<IoSpeedometer size={16} />}
                label="Pressure"
                value={`${Math.round(currentConditions.pressure)} mb`}
              />
              <MetricItem
                icon={<IoWater size={16} />}
                label="Rain"
                value={`${Math.round(currentConditions.precipprob || 0)}%`}
              />
            </div>
          </div>

          {/* 7-Day Forecast */}
          <section className={styles.forecastSection} aria-labelledby="forecast-heading">
            <h3 id="forecast-heading" className={styles.forecastTitle}>
              7-Day Forecast
            </h3>
            <div className={styles.forecastList} role="list">
              {forecast.slice(0, 5).map((day: WeatherDay) => (
                <ForecastDay key={day.datetime} day={day} temperatureUnit={temperatureUnit} />
              ))}
            </div>
          </section>

          {/* Travel Booking Options */}
          <section className={styles.bookingActions} aria-label="Travel booking options">
            <h3 className="sr-only">Book Travel to {cityName}</h3>
            <div className={styles.bookingButtons}>
              <a
                href={buildSkyscannerLink(cityName)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bookingButton}
                aria-label={`Search flights to ${cityName} on Skyscanner`}
              >
                <FaPlane className={styles.bookingIcon} aria-hidden="true" />
                <span className={styles.bookingText}>
                  <span className={styles.bookingLabel}>Find Flights</span>
                  <span className={styles.bookingProvider}>via Skyscanner</span>
                </span>
              </a>
              <a
                href={buildBookingLink(cityName)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bookingButton}
                aria-label={`Search hotels in ${cityName} on Booking.com`}
              >
                <FaHotel className={styles.bookingIcon} aria-hidden="true" />
                <span className={styles.bookingText}>
                  <span className={styles.bookingLabel}>Find Hotels</span>
                  <span className={styles.bookingProvider}>via Booking.com</span>
                </span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function MetricItem({ icon, label, value }: MetricItemProps) {
  return (
    <div className={styles.metricItem} role="group" aria-label={`${label}: ${value}`}>
      <div className={styles.metricIcon} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.metricValue} aria-hidden="true">{value}</div>
      <div className={styles.metricLabel} aria-hidden="true">{label}</div>
      <span className="sr-only">{label}: {value}</span>
    </div>
  );
}

interface ForecastDayProps {
  day: WeatherDay;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

function ForecastDay({ day, temperatureUnit }: ForecastDayProps) {
  const date = new Date(day.datetime);
  const dayName = format(date, 'EEE');
  const fullDate = format(date, 'EEEE, MMMM d');
  const tempMax = convertTemperature(day.tempmax, temperatureUnit);
  const tempMin = convertTemperature(day.tempmin, temperatureUnit);
  const tempUnit = temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit';

  return (
    <div
      className={styles.forecastDay}
      role="listitem"
      aria-label={`${fullDate}: ${day.conditions}, high ${tempMax} degrees, low ${tempMin} degrees ${tempUnit}`}
    >
      <div className={styles.forecastLeft}>
        <div className={styles.dayName} aria-hidden="true">{dayName}</div>
        <img
          src={getWeatherIconUrl(day.icon)}
          alt=""
          className={styles.forecastIcon}
          aria-hidden="true"
        />
        <div className={styles.forecastCondition} aria-hidden="true">{day.conditions}</div>
      </div>
      <div className={styles.forecastTemps} aria-hidden="true">
        <span className={styles.tempMax}>{tempMax}°</span>
        <span className={styles.tempSeparator}>/</span>
        <span className={styles.tempMin}>{tempMin}°</span>
      </div>
    </div>
  );
}
