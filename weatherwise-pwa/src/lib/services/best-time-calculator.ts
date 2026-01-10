interface MonthlyStats {
  month: number;
  monthName: string;
  avgTemp: number;
  avgTempMax: number;
  avgTempMin: number;
  avgPrecip: number;
  avgPrecipProb: number;
  avgHumidity: number;
  avgWindSpeed: number;
  score: number; // 0-100, higher is better
  ranking: number;
}

interface HistoricalDataPoint {
  date: string;
  tempmax: number;
  tempmin: number;
  temp: number;
  precip: number;
  precipprob: number;
  humidity: number;
  windspeed: number;
  conditions: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Calculate the best time to visit based on historical weather data
 * Analyzes temperature, precipitation, humidity, and wind patterns
 */
export function calculateBestTimeToVisit(historicalData: HistoricalDataPoint[]): MonthlyStats[] {
  if (!historicalData || historicalData.length === 0) {
    return [];
  }

  // Group data by month
  const monthlyData: { [key: number]: HistoricalDataPoint[] } = {};

  historicalData.forEach((day) => {
    const month = new Date(day.date).getMonth(); // 0-11
    if (!monthlyData[month]) {
      monthlyData[month] = [];
    }
    monthlyData[month].push(day);
  });

  // Calculate statistics for each month
  const monthlyStats: MonthlyStats[] = Object.keys(monthlyData).map((monthKey) => {
    const month = parseInt(monthKey);
    const days = monthlyData[month];
    const numDays = days.length;

    // Calculate averages
    const avgTemp = days.reduce((sum, d) => sum + d.temp, 0) / numDays;
    const avgTempMax = days.reduce((sum, d) => sum + d.tempmax, 0) / numDays;
    const avgTempMin = days.reduce((sum, d) => sum + d.tempmin, 0) / numDays;
    const avgPrecip = days.reduce((sum, d) => sum + d.precip, 0) / numDays;
    const avgPrecipProb = days.reduce((sum, d) => sum + d.precipprob, 0) / numDays;
    const avgHumidity = days.reduce((sum, d) => sum + d.humidity, 0) / numDays;
    const avgWindSpeed = days.reduce((sum, d) => sum + d.windspeed, 0) / numDays;

    // Calculate comfort score (0-100)
    const score = calculateComfortScore({
      avgTemp,
      avgPrecipProb,
      avgHumidity,
      avgWindSpeed,
      tempRange: avgTempMax - avgTempMin,
    });

    return {
      month,
      monthName: MONTH_NAMES[month],
      avgTemp: Math.round(avgTemp * 10) / 10,
      avgTempMax: Math.round(avgTempMax * 10) / 10,
      avgTempMin: Math.round(avgTempMin * 10) / 10,
      avgPrecip: Math.round(avgPrecip * 10) / 10,
      avgPrecipProb: Math.round(avgPrecipProb),
      avgHumidity: Math.round(avgHumidity),
      avgWindSpeed: Math.round(avgWindSpeed * 10) / 10,
      score: Math.round(score),
      ranking: 0, // Will be set after sorting
    };
  });

  // Sort by score and assign rankings
  monthlyStats.sort((a, b) => b.score - a.score);
  monthlyStats.forEach((stat, index) => {
    stat.ranking = index + 1;
  });

  return monthlyStats;
}

/**
 * Calculate a comfort score based on various weather factors
 * Higher score = better weather for travel
 */
function calculateComfortScore(params: {
  avgTemp: number;
  avgPrecipProb: number;
  avgHumidity: number;
  avgWindSpeed: number;
  tempRange: number;
}): number {
  const { avgTemp, avgPrecipProb, avgHumidity, avgWindSpeed, tempRange } = params;

  let score = 100;

  // Temperature score (ideal: 18-25°C)
  if (avgTemp < 15) {
    score -= (15 - avgTemp) * 2; // Penalize cold
  } else if (avgTemp > 28) {
    score -= (avgTemp - 28) * 2; // Penalize heat
  } else if (avgTemp >= 18 && avgTemp <= 25) {
    score += 10; // Bonus for ideal temp
  }

  // Precipitation probability (lower is better)
  score -= avgPrecipProb * 0.5; // Max penalty: -50 for 100% rain

  // Humidity (ideal: 40-60%)
  if (avgHumidity > 70) {
    score -= (avgHumidity - 70) * 0.5; // Penalize high humidity
  } else if (avgHumidity < 40) {
    score -= (40 - avgHumidity) * 0.3; // Slight penalty for low humidity
  }

  // Wind speed (ideal: < 20 km/h)
  if (avgWindSpeed > 25) {
    score -= (avgWindSpeed - 25) * 0.5; // Penalize strong winds
  }

  // Temperature range (smaller is better for consistent weather)
  if (tempRange > 15) {
    score -= (tempRange - 15) * 0.3; // Penalize large temperature swings
  }

  // Ensure score stays within 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get the top 3 best months to visit
 */
export function getBestMonths(monthlyStats: MonthlyStats[]): MonthlyStats[] {
  return monthlyStats.slice(0, 3);
}

/**
 * Get a human-readable description of the best time to visit
 */
export function getBestTimeDescription(monthlyStats: MonthlyStats[]): string {
  if (monthlyStats.length === 0) {
    return 'No data available';
  }

  const bestMonths = getBestMonths(monthlyStats);
  const monthNames = bestMonths.map(m => m.monthName).join(', ');

  return `Best time to visit: ${monthNames}`;
}
