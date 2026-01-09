// Mock weather data for demo mode
export const MOCK_WEATHER_DATA: Record<string, any> = {
  'Tokyo': {
    resolvedAddress: 'Tokyo, Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    currentConditions: {
      datetime: '2026-01-08T15:30:00',
      temp: 8,
      feelslike: 6,
      humidity: 65,
      windspeed: 12,
      conditions: 'Partly cloudy',
      icon: 'partly-cloudy-day',
      precipprob: 10,
      uvindex: 3,
      visibility: 10,
      pressure: 1015
    },
    days: [
      {
        datetime: '2026-01-08',
        tempmax: 12,
        tempmin: 5,
        temp: 8,
        humidity: 65,
        windspeed: 12,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 10,
        uvindex: 3
      },
      {
        datetime: '2026-01-09',
        tempmax: 14,
        tempmin: 6,
        temp: 10,
        humidity: 60,
        windspeed: 10,
        conditions: 'Clear',
        icon: 'clear-day',
        precipprob: 5,
        uvindex: 4
      },
      {
        datetime: '2026-01-10',
        tempmax: 13,
        tempmin: 7,
        temp: 10,
        humidity: 70,
        windspeed: 15,
        conditions: 'Rain',
        icon: 'rain',
        precipprob: 80,
        uvindex: 2
      },
      {
        datetime: '2026-01-11',
        tempmax: 11,
        tempmin: 6,
        temp: 9,
        humidity: 75,
        windspeed: 18,
        conditions: 'Overcast',
        icon: 'cloudy',
        precipprob: 40,
        uvindex: 2
      },
      {
        datetime: '2026-01-12',
        tempmax: 13,
        tempmin: 7,
        temp: 10,
        humidity: 68,
        windspeed: 11,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 20,
        uvindex: 3
      },
      {
        datetime: '2026-01-13',
        tempmax: 15,
        tempmin: 8,
        temp: 12,
        humidity: 62,
        windspeed: 9,
        conditions: 'Clear',
        icon: 'clear-day',
        precipprob: 10,
        uvindex: 4
      },
      {
        datetime: '2026-01-14',
        tempmax: 14,
        tempmin: 7,
        temp: 11,
        humidity: 65,
        windspeed: 13,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 15,
        uvindex: 3
      }
    ]
  },
  'Paris': {
    resolvedAddress: 'Paris, France',
    latitude: 48.8566,
    longitude: 2.3522,
    currentConditions: {
      datetime: '2026-01-08T09:30:00',
      temp: 4,
      feelslike: 1,
      humidity: 80,
      windspeed: 20,
      conditions: 'Rain',
      icon: 'rain',
      precipprob: 85,
      uvindex: 1,
      visibility: 8,
      pressure: 1008
    },
    days: [
      {
        datetime: '2026-01-08',
        tempmax: 6,
        tempmin: 2,
        temp: 4,
        humidity: 80,
        windspeed: 20,
        conditions: 'Rain',
        icon: 'rain',
        precipprob: 85,
        uvindex: 1
      },
      {
        datetime: '2026-01-09',
        tempmax: 5,
        tempmin: 1,
        temp: 3,
        humidity: 85,
        windspeed: 22,
        conditions: 'Rain',
        icon: 'rain',
        precipprob: 90,
        uvindex: 1
      },
      {
        datetime: '2026-01-10',
        tempmax: 7,
        tempmin: 3,
        temp: 5,
        humidity: 75,
        windspeed: 15,
        conditions: 'Overcast',
        icon: 'cloudy',
        precipprob: 60,
        uvindex: 2
      },
      {
        datetime: '2026-01-11',
        tempmax: 8,
        tempmin: 4,
        temp: 6,
        humidity: 70,
        windspeed: 12,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 30,
        uvindex: 2
      },
      {
        datetime: '2026-01-12',
        tempmax: 9,
        tempmin: 5,
        temp: 7,
        humidity: 68,
        windspeed: 10,
        conditions: 'Clear',
        icon: 'clear-day',
        precipprob: 10,
        uvindex: 3
      },
      {
        datetime: '2026-01-13',
        tempmax: 10,
        tempmin: 6,
        temp: 8,
        humidity: 65,
        windspeed: 11,
        conditions: 'Clear',
        icon: 'clear-day',
        precipprob: 5,
        uvindex: 3
      },
      {
        datetime: '2026-01-14',
        tempmax: 8,
        tempmin: 4,
        temp: 6,
        humidity: 72,
        windspeed: 14,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 25,
        uvindex: 2
      }
    ]
  },
  'Bali': {
    resolvedAddress: 'Bali, Indonesia',
    latitude: -8.3405,
    longitude: 115.0920,
    currentConditions: {
      datetime: '2026-01-08T16:30:00',
      temp: 30,
      feelslike: 34,
      humidity: 75,
      windspeed: 8,
      conditions: 'Partly cloudy',
      icon: 'partly-cloudy-day',
      precipprob: 40,
      uvindex: 8,
      visibility: 10,
      pressure: 1012
    },
    days: [
      {
        datetime: '2026-01-08',
        tempmax: 32,
        tempmin: 26,
        temp: 30,
        humidity: 75,
        windspeed: 8,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 40,
        uvindex: 8
      },
      {
        datetime: '2026-01-09',
        tempmax: 31,
        tempmin: 25,
        temp: 29,
        humidity: 78,
        windspeed: 10,
        conditions: 'Rain',
        icon: 'rain',
        precipprob: 70,
        uvindex: 6
      },
      {
        datetime: '2026-01-10',
        tempmax: 32,
        tempmin: 26,
        temp: 30,
        humidity: 72,
        windspeed: 9,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 35,
        uvindex: 9
      },
      {
        datetime: '2026-01-11',
        tempmax: 33,
        tempmin: 27,
        temp: 31,
        humidity: 70,
        windspeed: 7,
        conditions: 'Clear',
        icon: 'clear-day',
        precipprob: 20,
        uvindex: 10
      },
      {
        datetime: '2026-01-12',
        tempmax: 32,
        tempmin: 26,
        temp: 30,
        humidity: 73,
        windspeed: 8,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 45,
        uvindex: 8
      },
      {
        datetime: '2026-01-13',
        tempmax: 31,
        tempmin: 25,
        temp: 29,
        humidity: 76,
        windspeed: 11,
        conditions: 'Rain',
        icon: 'rain',
        precipprob: 65,
        uvindex: 7
      },
      {
        datetime: '2026-01-14',
        tempmax: 32,
        tempmin: 26,
        temp: 30,
        humidity: 74,
        windspeed: 9,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 40,
        uvindex: 8
      }
    ]
  },
  'New York': {
    resolvedAddress: 'New York, NY, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    currentConditions: {
      datetime: '2026-01-08T03:30:00',
      temp: -2,
      feelslike: -8,
      humidity: 60,
      windspeed: 25,
      conditions: 'Snow',
      icon: 'snow',
      precipprob: 75,
      uvindex: 0,
      visibility: 5,
      pressure: 1020
    },
    days: [
      {
        datetime: '2026-01-08',
        tempmax: 1,
        tempmin: -4,
        temp: -2,
        humidity: 60,
        windspeed: 25,
        conditions: 'Snow',
        icon: 'snow',
        precipprob: 75,
        uvindex: 2
      },
      {
        datetime: '2026-01-09',
        tempmax: -1,
        tempmin: -6,
        temp: -4,
        humidity: 55,
        windspeed: 30,
        conditions: 'Clear',
        icon: 'clear-day',
        precipprob: 5,
        uvindex: 2
      },
      {
        datetime: '2026-01-10',
        tempmax: 2,
        tempmin: -3,
        temp: 0,
        humidity: 50,
        windspeed: 20,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 10,
        uvindex: 2
      },
      {
        datetime: '2026-01-11',
        tempmax: 4,
        tempmin: -1,
        temp: 2,
        humidity: 52,
        windspeed: 18,
        conditions: 'Overcast',
        icon: 'cloudy',
        precipprob: 30,
        uvindex: 2
      },
      {
        datetime: '2026-01-12',
        tempmax: 3,
        tempmin: -2,
        temp: 1,
        humidity: 65,
        windspeed: 22,
        conditions: 'Snow',
        icon: 'snow',
        precipprob: 60,
        uvindex: 1
      },
      {
        datetime: '2026-01-13',
        tempmax: 1,
        tempmin: -4,
        temp: -1,
        humidity: 58,
        windspeed: 24,
        conditions: 'Clear',
        icon: 'clear-day',
        precipprob: 10,
        uvindex: 2
      },
      {
        datetime: '2026-01-14',
        tempmax: 3,
        tempmin: -2,
        temp: 1,
        humidity: 54,
        windspeed: 19,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
        precipprob: 15,
        uvindex: 2
      }
    ]
  }
};

export const getMockWeatherData = (location: string) => {
  // Try to find exact match first
  if (MOCK_WEATHER_DATA[location]) {
    return MOCK_WEATHER_DATA[location];
  }

  // Try case-insensitive match
  const locationKey = Object.keys(MOCK_WEATHER_DATA).find(
    key => key.toLowerCase() === location.toLowerCase()
  );

  if (locationKey) {
    return MOCK_WEATHER_DATA[locationKey];
  }

  // Return Tokyo as default
  return MOCK_WEATHER_DATA['Tokyo'];
};
