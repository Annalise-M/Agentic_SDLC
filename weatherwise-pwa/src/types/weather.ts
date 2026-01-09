// Weather data types for Visual Crossing API
// API Documentation: https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/

export interface WeatherConditions {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  precip: number;
  precipprob: number;
  preciptype: string[] | null;
  snow: number;
  snowdepth: number;
  windgust: number;
  windspeed: number;
  winddir: number;
  pressure: number;
  cloudcover: number;
  visibility: number;
  solarradiation: number;
  solarenergy: number;
  uvindex: number;
  conditions: string;
  description: string;
  icon: string;
  sunrise?: string;
  sunset?: string;
  moonphase?: number;
}

export interface WeatherDay extends WeatherConditions {
  tempmax: number;
  tempmin: number;
  hours?: WeatherConditions[];
}

export interface WeatherData {
  queryCost: number;
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  days: WeatherDay[];
  currentConditions?: WeatherConditions;
}

export interface LocationWeather {
  location: string;
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

export interface WeatherMetric {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
}
