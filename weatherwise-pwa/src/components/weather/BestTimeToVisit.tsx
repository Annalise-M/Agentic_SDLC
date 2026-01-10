import { useHistoricalWeather } from '../../lib/hooks/useHistoricalWeather';
import { calculateBestTimeToVisit, getBestMonths } from '../../lib/services/best-time-calculator';
import { IoCalendar, IoThermometer, IoWater, IoTrendingUp } from 'react-icons/io5';

interface BestTimeToVisitProps {
  location: string;
}

export function BestTimeToVisit({ location }: BestTimeToVisitProps) {
  const { data, isLoading, error } = useHistoricalWeather(location);

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const monthlyStats = calculateBestTimeToVisit(data.days);
  const bestMonths = getBestMonths(monthlyStats);

  if (bestMonths.length === 0) {
    return null;
  }

  const cityName = location.split(',')[0].trim();

  return (
    <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <IoCalendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Best Time to Visit</h3>
            <p className="text-sm text-blue-100">{cityName}</p>
          </div>
        </div>
      </div>

      {/* Best Months */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bestMonths.map((month, index) => (
            <div
              key={month.month}
              className="relative bg-white rounded-xl p-4 border-2 border-blue-200/50 hover:border-blue-400/50 transition-all duration-200 group"
            >
              {/* Ranking Badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                #{index + 1}
              </div>

              {/* Month Name */}
              <div className="flex items-center gap-2 mb-3">
                <IoTrendingUp className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-bold text-gray-900">{month.monthName}</h4>
              </div>

              {/* Score */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-blue-600">{month.score}</span>
                  <span className="text-sm text-gray-500">/100 score</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${month.score}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <IoThermometer className="w-4 h-4" />
                    <span>Avg Temp</span>
                  </div>
                  <span className="font-semibold text-gray-900">{Math.round(month.avgTemp)}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <IoWater className="w-4 h-4" />
                    <span>Rain Chance</span>
                  </div>
                  <span className="font-semibold text-gray-900">{month.avgPrecipProb}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Chart */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Monthly Comparison</h4>
          <div className="flex items-end justify-between gap-1 h-32">
            {monthlyStats.map((month) => (
              <div
                key={month.month}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                title={`${month.monthName}: ${month.score}/100`}
              >
                <div className="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-indigo-700"
                     style={{ height: `${month.score}%` }}
                />
                <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  {month.monthName.substring(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Based on 3 years of historical weather data. Scores consider temperature, precipitation, humidity, and wind conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
