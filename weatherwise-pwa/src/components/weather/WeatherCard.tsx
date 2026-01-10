import { IoClose, IoWater, IoEye, IoSpeedometer, IoSunny, IoLocationSharp } from 'react-icons/io5';
import { WiStrongWind } from 'react-icons/wi';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useWeather } from '../../lib/hooks/useWeather';
import { useLocationStore } from '../../store/locations-store';
import { getWeatherIconUrl } from '../../lib/api/weather';
import { getLocationImageAsync, getLocationGradient } from '../../lib/api/unsplash';
import { convertTemperature, getTemperatureSymbol } from '../../lib/utils/temperature';
import type { WeatherDay } from '../../types/weather';
import styles from './WeatherCard.module.scss';

interface WeatherCardProps {
  location: string;
}

export function WeatherCard({ location }: WeatherCardProps) {
  console.log('✨ NEW SCSS WeatherCard rendering for:', location);
  const { data, isLoading, error } = useWeather(location);
  const { removeLocation, temperatureUnit } = useLocationStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [locationImage, setLocationImage] = useState<string>('');

  // Fetch location-specific landscape image (deterministic, no people)
  useEffect(() => {
    if (location && !locationImage) {
      console.log(`🏙️ Fetching landscape image for ${location}`);
      getLocationImageAsync(location, 1600, 1200).then(setLocationImage);
    }
  }, [location]); // Only fetch if location changes, prevent refetching

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

  if (isLoading) {
    return (
      <div className={styles.loadingCard}>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorCard}>
        <div className={styles.errorHeader}>
          <h2 className={styles.errorTitle}>{location}</h2>
          <button
            onClick={() => removeLocation(location)}
            className={styles.removeButton}
            aria-label="Remove location"
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
    <div ref={cardRef} className={styles.weatherCard}>
      <div className={styles.cardContainer}>
        {/* Left Side - Location Image */}
        <div className={styles.imagePanel}>
          <div
            className={styles.imageBackground}
            style={backgroundStyle}
          />
          <div className={styles.imageOverlay} />

          <div className={styles.locationInfo}>
            <div className={styles.locationHeader}>
              <IoLocationSharp className={styles.locationIcon} />
              <div>
                <h2 className={styles.cityName}>
                  {cityName}
                </h2>
                {cleanAddress && (
                  <p className={styles.address}>{cleanAddress}</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => removeLocation(location)}
            className={styles.removeButton}
            aria-label="Remove location"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Right Side - Weather Details */}
        <div className={styles.detailsPanel}>
          <div className={styles.currentWeather}>
            {/* Temperature */}
            <div className={styles.temperatureSection}>
              <div>
                <div className={styles.temperatureMain}>
                  {temp}°
                </div>
                <p className={styles.feelsLike}>
                  Feels like {feelsLike}{tempSymbol}
                </p>
              </div>
              <div className={styles.weatherIcon}>
                <img
                  src={getWeatherIconUrl(currentConditions.icon)}
                  alt={currentConditions.conditions}
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
          <div className={styles.forecastSection}>
            <h3 className={styles.forecastTitle}>
              7-Day Forecast
            </h3>
            <div className={styles.forecastList}>
              {forecast.slice(0, 5).map((day: WeatherDay) => (
                <ForecastDay key={day.datetime} day={day} temperatureUnit={temperatureUnit} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function MetricItem({ icon, label, value }: MetricItemProps) {
  return (
    <div className={styles.metricItem}>
      <div className={styles.metricIcon}>
        {icon}
      </div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
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
  const tempMax = convertTemperature(day.tempmax, temperatureUnit);
  const tempMin = convertTemperature(day.tempmin, temperatureUnit);

  return (
    <div className={styles.forecastDay}>
      <div className={styles.forecastLeft}>
        <div className={styles.dayName}>{dayName}</div>
        <img
          src={getWeatherIconUrl(day.icon)}
          alt={day.conditions}
          className={styles.forecastIcon}
        />
        <div className={styles.forecastCondition}>{day.conditions}</div>
      </div>
      <div className={styles.forecastTemps}>
        <span className={styles.tempMax}>{tempMax}°</span>
        <span className={styles.tempSeparator}>/</span>
        <span className={styles.tempMin}>{tempMin}°</span>
      </div>
    </div>
  );
}
