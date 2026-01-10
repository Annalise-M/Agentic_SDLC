import { useEffect, useState } from 'react';
import { IoCloudSharp, IoLocationSharp, IoSparkles } from 'react-icons/io5';
import { LocationSearch } from './components/search/LocationSearch';
import { WeatherCard } from './components/weather/WeatherCard';
import { BestTimeToVisit } from './components/weather/BestTimeToVisit';
import { useLocationStore } from './store/locations-store';
import { useGeolocation, reverseGeocode } from './lib/hooks/useGeolocation';

function App() {
  const { locations, addLocation, temperatureUnit, toggleTemperatureUnit } = useLocationStore();
  const geolocation = useGeolocation();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Version check - if you see this in console, the new code has loaded!
  console.log('🎨 Magazine layout version loaded - Jan 9, 2026 1:21 PM');

  const isDemoMode = !import.meta.env.VITE_VISUAL_CROSSING_API_KEY ||
                     import.meta.env.VITE_VISUAL_CROSSING_API_KEY === 'your_api_key_here';

  // Auto-detect user's location on first visit
  useEffect(() => {
    const hasAutoDetected = localStorage.getItem('auto-location-detected');

    if (
      !hasAutoDetected &&
      locations.length === 0 &&
      geolocation.latitude &&
      geolocation.longitude &&
      !geolocation.loading
    ) {
      setIsDetectingLocation(true);

      reverseGeocode(geolocation.latitude, geolocation.longitude)
        .then((locationName) => {
          addLocation(locationName);
          localStorage.setItem('auto-location-detected', 'true');
        })
        .catch((error) => {
          console.error('Failed to add current location:', error);
        })
        .finally(() => {
          setIsDetectingLocation(false);
        });
    }
  }, [geolocation, locations.length, addLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="relative bg-gradient-to-r from-amber-400 to-orange-400 border-b border-amber-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-white font-medium flex items-center gap-2">
              <IoSparkles className="w-4 h-4" />
              <span>
                <strong>Demo Mode:</strong> Using sample data. Get real weather at{' '}
                <a
                  href="https://www.visualcrossing.com/weather-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-100 transition-colors"
                >
                  visualcrossing.com
                </a>
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/60 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                <IoCloudSharp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  WeatherWise
                </h1>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  Smart travel planning starts here
                </p>
              </div>
            </div>

            {/* Temperature Unit Toggle */}
            <button
              onClick={toggleTemperatureUnit}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200"
              aria-label="Toggle temperature unit"
            >
              <span className="text-sm font-medium text-gray-700">
                {temperatureUnit === 'celsius' ? '°C' : '°F'}
              </span>
              <span className="text-xs text-gray-500">
                {temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Search */}
        <div className="mb-16 text-center animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Compare weather,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              plan smarter trips
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Side-by-side weather comparison for up to 5 destinations. Make confident decisions about where to go.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <LocationSearch />
            {locations.length > 0 && (
              <p className="text-sm text-gray-500 mt-4 font-medium">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
                  {locations.length} of 5 locations
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Weather Comparison Grid */}
        {locations.length === 0 ? (
          <div className="text-center py-24 animate-slide-up">
            {isDetectingLocation || geolocation.loading ? (
              <div className="inline-flex flex-col items-center gap-4 px-8 py-12 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl shadow-blue-500/5">
                <div className="relative">
                  <IoLocationSharp className="w-16 h-16 text-blue-500 animate-pulse" />
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Finding your location...
                  </h3>
                  <p className="text-gray-600">
                    We'll show you local weather in a moment
                  </p>
                </div>
              </div>
            ) : (
              <div className="inline-flex flex-col items-center gap-4 px-8 py-12 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
                <IoCloudSharp className="w-16 h-16 text-gray-300" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Ready to compare
                  </h3>
                  <p className="text-gray-500">
                    Search for your first destination above
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="carousel-container">
              <div className="carousel-track">
                {locations.map((location, index) => (
                  <div
                    key={location}
                    className="carousel-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <WeatherCard location={location} />
                  </div>
                ))}
              </div>
            </div>

            {/* Best Time to Visit Analysis */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Best Time to Visit
                </h2>
                <p className="text-gray-600">
                  Historical analysis to help you plan the perfect trip
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {locations.map((location) => (
                  <div key={location} className="animate-fade-in">
                    <BestTimeToVisit location={location} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tip Card */}
        {locations.length > 0 && locations.length < 2 && (
          <div className="mt-12 max-w-2xl mx-auto animate-fade-in">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-2 rounded-xl">
                  <IoSparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Add more locations
                  </h4>
                  <p className="text-sm text-gray-600">
                    Compare weather side-by-side to make the best decision for your trip
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-24 backdrop-blur-sm bg-white/40 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Weather data by{' '}
              <a
                href="https://www.visualcrossing.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Visual Crossing
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Built with ❤️ for travelers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
