import { useEffect, useState } from 'react';
import { IoCloudSharp, IoSparkles, IoInformationCircle, IoApps } from 'react-icons/io5';
import { LocationSearch } from './components/search/LocationSearch';
import { Dashboard } from './components/dashboard/Dashboard';
import { CreditsModal } from './components/common/CreditsModal';
import { WeatherCard } from './components/weather/WeatherCard';
import { useLocationStore } from './store/locations-store';
import { useUIStore } from './store/ui-store';
import { useGeolocation, reverseGeocode } from './lib/hooks/useGeolocation';
import { useActiveLocation } from './lib/hooks/useActiveLocation';

function App() {
  const { locations, addLocation, temperatureUnit, toggleTemperatureUnit } = useLocationStore();
  const activeLocation = useUIStore((state) => state.activeLocation);
  const geolocation = useGeolocation();
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

  // Track active location for context-aware widgets
  const { observeCard } = useActiveLocation({ locations });

  // Version check - if you see this in console, the new code has loaded!
  console.log('♿ Icon-only customize + collapsible forecast - Jan 14, 2026');

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
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2"
        style={{ background: 'var(--accent-cyan)', color: 'var(--text-primary)' }}
      >
        Skip to main content
      </a>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-96 opacity-5" style={{ background: 'radial-gradient(circle at 50% 0%, var(--accent-cyan), transparent 70%)' }}></div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="relative border-b" style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <p className="text-xs font-medium flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <IoSparkles className="w-3 h-3" style={{ color: 'var(--accent-yellow)' }} aria-hidden="true" />
              <span>
                <strong style={{ color: 'var(--text-primary)' }}>Demo Mode:</strong> Using sample data
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative" style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-light-default)'
      }}>
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <IoCloudSharp className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
              <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-dark-primary)' }}>
                WeatherWise
              </h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <LocationSearch />
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2 justify-end">
              {/* Temperature Unit Toggle - Pill Style */}
              <button
                onClick={toggleTemperatureUnit}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none hover:opacity-80"
                style={{
                  background: temperatureUnit === 'celsius' ? 'rgba(34, 211, 238, 0.15)' : '#f5f5f5',
                  border: '1px solid var(--border-light-default)',
                  color: 'var(--text-dark-primary)'
                }}
                aria-label={`Switch to ${temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
              >
                {temperatureUnit === 'celsius' ? '°C' : '°F'}
              </button>

              {/* Customize Button */}
              <button
                onClick={() => setIsMarketplaceOpen(true)}
                className="p-1.5 rounded-full hover:opacity-80 transition-all duration-200 focus:outline-none"
                style={{
                  background: 'rgba(34, 211, 238, 0.15)',
                  border: '1px solid var(--border-light-default)',
                  color: 'var(--text-dark-primary)'
                }}
                aria-label="Customize widgets"
                title="Customize Widgets"
              >
                <IoApps className="w-4 h-4" />
              </button>

              {/* Credits Button */}
              <button
                onClick={() => setIsCreditsOpen(true)}
                className="p-1.5 rounded-full transition-all duration-200 focus:outline-none hover:opacity-80"
                style={{
                  background: '#f5f5f5',
                  border: '1px solid var(--border-light-default)',
                  color: 'var(--text-dark-tertiary)'
                }}
                aria-label="View credits and attribution"
                title="Credits"
              >
                <IoInformationCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main id="main-content" className="h-[calc(100vh-88px)] overflow-hidden">
        <div className="h-full flex gap-5" style={{
          background: 'var(--bg-primary)',
          padding: '20px'
        }}>
          {/* Left Side - Weather Cards Vertical Carousel */}
          <div className="h-full flex flex-col" style={{
            width: 'fit-content',
            minWidth: '400px',
            maxWidth: '600px',
            flexShrink: 0
          }}>
            {/* Weather Cards - Full Viewport Scroll Snap */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                scrollSnapType: 'y mandatory',
                scrollBehavior: 'smooth',
                paddingRight: '8px'
              }}
            >
              {locations.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <IoCloudSharp className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: 'var(--text-tertiary)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Search for a location to get started
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {locations.map((location, index) => (
                    <div
                      key={location}
                      style={{
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                        minHeight: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: index === locations.length - 1 ? '0' : '20px'
                      }}
                    >
                      <WeatherCard
                        location={location}
                        onIntersect={observeCard}
                        isActive={activeLocation === location}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Right Side - Widget Dashboard */}
          <div className="flex-1 h-full flex flex-col">
            <Dashboard
              isMarketplaceOpen={isMarketplaceOpen}
              onMarketplaceClose={() => setIsMarketplaceOpen(false)}
            />
          </div>
        </div>
      </main>

      {/* Credits Modal */}
      <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />
    </div>
  );
}

export default App;
