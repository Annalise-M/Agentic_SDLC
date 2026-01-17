/**
 * Weather Metrics Widget
 *
 * Displays animated gauge/progress indicators for key weather metrics
 * like humidity, UV index, wind speed, and visibility.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { IoWater, IoEye, IoSunny, IoSpeedometer } from 'react-icons/io5';
import { WiStrongWind } from 'react-icons/wi';
import { useLocationStore } from '../../store/locations-store';
import { useUIStore } from '../../store/ui-store';
import { useWeather } from '../../lib/hooks/useWeather';
import styles from './WeatherMetricsWidget.module.scss';

interface MetricData {
  label: string;
  value: number;
  max: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

export function WeatherMetricsWidget() {
  const { locations } = useLocationStore();
  const activeLocation = useUIStore((state) => state.activeLocation);
  const targetLocation = activeLocation || locations[0]; // Active location with fallback
  const { data } = useWeather(targetLocation || '');
  const containerRef = useRef<HTMLDivElement>(null);

  console.log('📊 WeatherMetricsWidget rendering for:', targetLocation);

  // GSAP entrance animation
  useEffect(() => {
    if (containerRef.current && data) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [data]);

  if (!data || !targetLocation) {
    return (
      <div className={styles.widgetEmpty}>
        <p className={styles.emptyText}>Add a location to see metrics</p>
      </div>
    );
  }

  const currentConditions = data.currentConditions || data.days[0];

  const metrics: MetricData[] = [
    {
      label: 'Humidity',
      value: Math.round(currentConditions.humidity),
      max: 100,
      unit: '%',
      icon: <IoWater size={20} />,
      color: 'var(--accent-cyan)',
    },
    {
      label: 'UV Index',
      value: Math.round(currentConditions.uvindex || 0),
      max: 11,
      unit: '',
      icon: <IoSunny size={20} />,
      color: 'var(--accent-yellow)',
    },
    {
      label: 'Wind',
      value: Math.min(Math.round(currentConditions.windspeed), 100),
      max: 100,
      unit: 'km/h',
      icon: <WiStrongWind size={24} />,
      color: 'var(--accent-purple)',
    },
    {
      label: 'Visibility',
      value: Math.min(Math.round(currentConditions.visibility), 20),
      max: 20,
      unit: 'km',
      icon: <IoEye size={20} />,
      color: 'var(--accent-pink)',
    },
  ];

  return (
    <div ref={containerRef} className={styles.metricsWidget}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <IoSpeedometer size={16} style={{ color: 'var(--accent-purple)' }} />
          Current Conditions
        </h3>
        <p className={styles.widgetSubtitle}>{targetLocation.split(',')[0]}</p>
      </div>

      <div className={styles.metricsGrid}>
        {metrics.map((metric) => (
          <MetricGauge key={metric.label} metric={metric} />
        ))}
      </div>
    </div>
  );
}

interface MetricGaugeProps {
  metric: MetricData;
}

function MetricGauge({ metric }: MetricGaugeProps) {
  const gaugeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      const percentage = (metric.value / metric.max) * 100;
      const circumference = 2 * Math.PI * 45; // radius = 45
      const offset = circumference - (percentage / 100) * circumference;

      // Animate the stroke with GSAP
      gsap.fromTo(
        progressRef.current,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: offset,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.1,
        }
      );

      // Animate the entire gauge entrance
      gsap.fromTo(
        gaugeRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.4)',
          delay: 0.15,
        }
      );
    }
  }, [metric.value, metric.max]);

  const percentage = (metric.value / metric.max) * 100;
  const circumference = 2 * Math.PI * 45;

  return (
    <div ref={gaugeRef} className={styles.metricGauge}>
      <div className={styles.gaugeCircle}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--border-default)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            ref={progressRef}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={metric.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>

        <div className={styles.gaugeCenter}>
          <div className={styles.gaugeIcon} style={{ color: metric.color }}>
            {metric.icon}
          </div>
          <div className={styles.gaugeValue}>
            {metric.value}
            {metric.unit && <span className={styles.gaugeUnit}>{metric.unit}</span>}
          </div>
        </div>
      </div>

      <div className={styles.gaugeLabel}>{metric.label}</div>
      <div className={styles.gaugePercentage}>{Math.round(percentage)}%</div>
    </div>
  );
}
