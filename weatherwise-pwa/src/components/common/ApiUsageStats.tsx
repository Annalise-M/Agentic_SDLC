/**
 * API Usage Statistics Component
 *
 * Displays current API usage to help stay within free tier limits.
 * Shows daily calls, total calls, and warnings when approaching limits.
 */

import { useState, useEffect } from 'react';
import { IoStatsChart, IoWarning } from 'react-icons/io5';
import { getApiUsage } from '../../lib/api/openweathermap';

export function ApiUsageStats() {
  const [usage, setUsage] = useState({ callsToday: 0, totalCalls: 0, lastReset: Date.now() });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Update usage stats
    const updateUsage = () => {
      setUsage(getApiUsage());
    };

    updateUsage();
    const interval = setInterval(updateUsage, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const dailyLimit = 1000;
  const percentage = (usage.callsToday / dailyLimit) * 100;
  const isWarning = percentage >= 80;
  const isCritical = percentage >= 95;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Compact button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all hover:scale-105"
          style={{
            background: isCritical
              ? 'rgba(239, 68, 68, 0.9)'
              : isWarning
              ? 'rgba(251, 191, 36, 0.9)'
              : 'rgba(34, 211, 238, 0.9)',
            color: 'white',
            backdropFilter: 'blur(8px)',
          }}
          aria-label="View API usage statistics"
        >
          {isCritical || isWarning ? (
            <IoWarning size={16} />
          ) : (
            <IoStatsChart size={16} />
          )}
          <span className="text-xs font-semibold">
            {usage.callsToday}/{dailyLimit}
          </span>
        </button>
      )}

      {/* Expanded panel */}
      {isExpanded && (
        <div
          className="rounded-lg shadow-xl p-4 min-w-[280px]"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-light-default)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-sm font-bold flex items-center gap-2"
              style={{ color: 'var(--text-dark-primary)' }}
            >
              <IoStatsChart size={16} />
              API Usage
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs hover:opacity-70"
              style={{ color: 'var(--text-dark-secondary)' }}
            >
              ✕
            </button>
          </div>

          {/* Daily usage */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs" style={{ color: 'var(--text-dark-secondary)' }}>
                Today
              </span>
              <span
                className="text-xs font-semibold"
                style={{
                  color: isCritical
                    ? '#ef4444'
                    : isWarning
                    ? '#f59e0b'
                    : 'var(--accent-cyan)',
                }}
              >
                {usage.callsToday} / {dailyLimit}
              </span>
            </div>
            {/* Progress bar */}
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(0, 0, 0, 0.1)' }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  background: isCritical
                    ? '#ef4444'
                    : isWarning
                    ? '#f59e0b'
                    : 'var(--accent-cyan)',
                }}
              />
            </div>
          </div>

          {/* Total calls */}
          <div className="flex justify-between items-center text-xs mb-3">
            <span style={{ color: 'var(--text-dark-secondary)' }}>Total calls</span>
            <span
              className="font-semibold"
              style={{ color: 'var(--text-dark-primary)' }}
            >
              {usage.totalCalls.toLocaleString()}
            </span>
          </div>

          {/* Warning message */}
          {isWarning && (
            <div
              className="text-xs p-2 rounded"
              style={{
                background: isCritical
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(251, 191, 36, 0.1)',
                color: isCritical ? '#ef4444' : '#f59e0b',
                border: `1px solid ${isCritical ? '#ef4444' : '#f59e0b'}33`,
              }}
            >
              <IoWarning size={12} className="inline mr-1" />
              {isCritical
                ? 'Approaching daily limit! Consider upgrading.'
                : 'High usage detected. Monitor closely.'}
            </div>
          )}

          {/* Info */}
          <div
            className="text-xs mt-3 pt-3"
            style={{
              borderTop: '1px solid var(--border-light-subtle)',
              color: 'var(--text-dark-tertiary)',
            }}
          >
            Free tier limit resets daily at midnight
          </div>
        </div>
      )}
    </div>
  );
}
