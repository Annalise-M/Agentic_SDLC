/**
 * Compact Weather Card
 *
 * Streamlined card for vertical carousel sidebar
 */

import { IoClose, IoStar, IoStarOutline, IoWater, IoEye } from 'react-icons/io5';
import { WiStrongWind } from 'react-icons/wi';
import { useWeather } from '../../lib/hooks/useWeather';
import { useLocationStore } from '../../store/locations-store';
import { convertTemperature, getTemperatureSymbol } from '../../lib/utils/temperature';
import { getWeatherIconUrl } from '../../lib/api/weather';
import styles from './CompactWeatherCard.module.scss';

interface CompactWeatherCardProps {
  location: string;
}

export function CompactWeatherCard({ location }: CompactWeatherCardProps) {
  const { data, isLoading, error } = useWeather(location);
  const { removeLocation, temperatureUnit, toggleOfflineLocation, isOfflineLocation } = useLocationStore();
  const isOffline = isOfflineLocation(location);

  if (isLoading) {
    return (
      <div className={styles.card} style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)'
      }}>
        <div className="animate-pulse">
          <div className="h-24" style={{ background: 'var(--bg-elevated)' }}></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const currentConditions = data.currentConditions || data.days[0];
  const temp = convertTemperature(currentConditions.temp, temperatureUnit);
  const feelsLike = convertTemperature(currentConditions.feelslike, temperatureUnit);
  const tempSymbol = getTemperatureSymbol(temperatureUnit);
  const cityName = location.split(',')[0].trim();
  const region = location.split(',').slice(1).join(',').trim();

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.location}>
          <h3 className={styles.cityName}>{cityName}</h3>
          {region && <p className={styles.region}>{region}</p>}
        </div>
        <div className={styles.actions}>
          <button
            onClick={() => toggleOfflineLocation(location)}
            className={styles.actionBtn}
            aria-label={isOffline ? 'Remove from offline' : 'Save for offline'}
          >
            {isOffline ? <IoStar /> : <IoStarOutline />}
          </button>
          <button
            onClick={() => removeLocation(location)}
            className={styles.actionBtn}
            aria-label="Remove location"
          >
            <IoClose />
          </button>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className={styles.mainWeather}>
        <div className={styles.tempSection}>
          <div className={styles.temp}>{temp}°</div>
          <div className={styles.feelsLike}>Feels like {feelsLike}{tempSymbol}</div>
        </div>
        <div className={styles.iconSection}>
          <img
            src={getWeatherIconUrl(currentConditions.icon)}
            alt={currentConditions.conditions}
            className={styles.weatherIcon}
          />
          <p className={styles.conditions}>{currentConditions.conditions}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <IoWater className={styles.metricIcon} />
          <span className={styles.metricValue}>{Math.round(currentConditions.humidity)}%</span>
        </div>
        <div className={styles.metric}>
          <WiStrongWind className={styles.metricIcon} />
          <span className={styles.metricValue}>{Math.round(currentConditions.windspeed)} km/h</span>
        </div>
        <div className={styles.metric}>
          <IoEye className={styles.metricIcon} />
          <span className={styles.metricValue}>{Math.round(currentConditions.visibility)} km</span>
        </div>
      </div>
    </div>
  );
}
