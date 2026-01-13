import { useEffect } from 'react';
import { IoCloudSharp, IoSparkles } from 'react-icons/io5';
import { LocationSearch } from './components/search/LocationSearch';
import { Dashboard } from './components/dashboard/Dashboard';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { useLocationStore } from './store/locations-store';
import { useGeolocation, reverseGeocode } from './lib/hooks/useGeolocation';

function App() {
  const { locations, addLocation, temperatureUnit, toggleTemperatureUnit } = useLocationStore();
  const geolocation = useGeolocation();

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
      reverseGeocode(geolocation.latitude, geolocation.longitude)
        .then((locationName) => {
          addLocation(locationName);
          localStorage.setItem('auto-location-detected', 'true');
        })
        .catch((error) => {
          console.error('Failed to add current location:', error);
        });
    }
  }, [geolocation, locations.length, addLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
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
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20" aria-hidden="true">
                <IoCloudSharp className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  WeatherWise
                </div>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  Smart travel planning starts here
                </p>
              </div>
            </div>

            {/* Temperature Unit Toggle */}
            <button
              onClick={toggleTemperatureUnit}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Switch to ${temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
              aria-pressed="false"
            >
              <span className="text-sm font-medium text-gray-700" aria-hidden="true">
                {temperatureUnit === 'celsius' ? '°C' : '°F'}
              </span>
              <span className="text-xs text-gray-500" aria-hidden="true">
                {temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Search */}
        <section className="mb-16 text-center animate-fade-in" aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Compare weather,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              plan smarter trips
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Side-by-side weather comparison for up to 5 destinations. Make confident decisions about where to go.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <LocationSearch />
            {locations.length > 0 && (
              <p className="text-sm text-gray-500 mt-4 font-medium" role="status" aria-live="polite">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
                  {locations.length} of 5 locations
                </span>
              </p>
            )}
          </div>
        </section>

        {/* Widget Dashboard */}
        <Dashboard />
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

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}

export default App;
