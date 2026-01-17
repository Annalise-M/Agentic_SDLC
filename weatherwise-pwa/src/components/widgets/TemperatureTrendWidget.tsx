/**
 * Temperature Trend Widget
 *
 * Displays a dynamic line chart showing temperature trends over 7 days
 * with smooth animations and interactive tooltips.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { IoTrendingUp } from 'react-icons/io5';
import { useLocationStore } from '../../store/locations-store';
import { useUIStore } from '../../store/ui-store';
import { useWeather } from '../../lib/hooks/useWeather';
import { convertTemperature } from '../../lib/utils/temperature';
import styles from './TemperatureTrendWidget.module.scss';

export function TemperatureTrendWidget() {
  const { locations, temperatureUnit } = useLocationStore();
  const activeLocation = useUIStore((state) => state.activeLocation);
  const targetLocation = activeLocation || locations[0]; // Active location with fallback
  const { data } = useWeather(targetLocation || '');
  const containerRef = useRef<HTMLDivElement>(null);

  console.log('📊 TemperatureTrendWidget rendering for:', targetLocation);

  // GSAP entrance animation
  useEffect(() => {
    if (containerRef.current && data) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [data]);

  if (!data || !targetLocation) {
    return (
      <div className={styles.widgetEmpty}>
        <p className={styles.emptyText}>Add a location to see temperature trends</p>
      </div>
    );
  }

  // Transform weather data for chart
  const chartData = data.days.slice(0, 7).map((day) => ({
    date: format(new Date(day.datetime), 'MMM d'),
    temp: convertTemperature(day.temp, temperatureUnit),
    high: convertTemperature(day.tempmax, temperatureUnit),
    low: convertTemperature(day.tempmin, temperatureUnit),
  }));

  const tempSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <div ref={containerRef} className={styles.trendWidget}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <IoTrendingUp size={16} style={{ color: 'var(--accent-cyan)' }} />
          Temperature Trend
        </h3>
        <p className={styles.widgetSubtitle}>{targetLocation.split(',')[0]}</p>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.4}/>
                <stop offset="50%" stopColor="var(--accent-purple)" stopOpacity={0.2}/>
                <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="var(--text-tertiary)"
              style={{ fontSize: '0.75rem' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              style={{ fontSize: '0.75rem' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: 'var(--shadow-lg)',
              }}
              labelStyle={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '600' }}
              itemStyle={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}
              formatter={(value: number | undefined) => value !== undefined ? [`${value}${tempSymbol}`, ''] : ['', '']}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="var(--accent-cyan)"
              strokeWidth={2}
              fill="url(#tempGradient)"
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="high"
              stroke="var(--accent-pink)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="low"
              stroke="var(--accent-purple)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: 'var(--accent-cyan)' }} />
          <span>Avg</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: 'var(--accent-pink)' }} />
          <span>High</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: 'var(--accent-purple)' }} />
          <span>Low</span>
        </div>
      </div>
    </div>
  );
}
