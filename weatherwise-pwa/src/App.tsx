import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { IoCloudSharp, IoSparkles, IoInformationCircle, IoApps } from 'react-icons/io5';
import { LocationSearch } from './components/search/LocationSearch';
import { Dashboard } from './components/dashboard/Dashboard';
import { CreditsModal } from './components/common/CreditsModal';
import { ApiUsageStats } from './components/common/ApiUsageStats';
import { useLocationStore } from './store/locations-store';
import { useGeolocation, reverseGeocode } from './lib/hooks/useGeolocation';
import styles from './App.module.scss';

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

function App() {
  const { locations, addLocation, temperatureUnit, toggleTemperatureUnit } = useLocationStore();
  const geolocation = useGeolocation();
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const isAutoDetecting = useRef(false);
  const mainRef = useRef<HTMLElement>(null);

  // Version check - if you see this in console, the new code has loaded!
  console.log('♿ Icon-only customize + collapsible forecast - Jan 14, 2026');

  const isDemoMode = !import.meta.env.VITE_VISUAL_CROSSING_API_KEY ||
                     import.meta.env.VITE_VISUAL_CROSSING_API_KEY === 'your_api_key_here';

  // Disabled GSAP scroll snap - was causing layout bouncing issues
  // Can be re-enabled later with proper grid integration
  // useEffect(() => {
  //   if (!mainRef.current) return;
  //   const main = mainRef.current;
  //   let scrollTimeout: ReturnType<typeof setTimeout>;
  //   const handleScroll = () => {
  //     clearTimeout(scrollTimeout);
  //     scrollTimeout = setTimeout(() => {
  //       const scrollTop = main.scrollTop;
  //       const viewportHeight = main.clientHeight;
  //       const currentSection = Math.round(scrollTop / viewportHeight);
  //       const targetScrollTop = currentSection * viewportHeight;
  //       gsap.to(main, {
  //         scrollTo: { y: targetScrollTop },
  //         duration: 0.5,
  //         ease: 'power2.out',
  //       });
  //     }, 150);
  //   };
  //   main.addEventListener('scroll', handleScroll);
  //   return () => {
  //     main.removeEventListener('scroll', handleScroll);
  //     clearTimeout(scrollTimeout);
  //   };
  // }, []);

  // Auto-detect user's location when no locations exist
  useEffect(() => {
    // Only auto-detect if:
    // 1. No locations currently exist
    // 2. Geolocation is available and loaded
    // 3. User hasn't explicitly denied geolocation (handled by useGeolocation hook)
    // 4. Not already in the process of auto-detecting (prevents race conditions)
    if (
      locations.length === 0 &&
      geolocation.latitude &&
      geolocation.longitude &&
      !geolocation.loading &&
      !isAutoDetecting.current
    ) {
      isAutoDetecting.current = true;
      console.log('📍 Starting auto-detection...');

      reverseGeocode(geolocation.latitude, geolocation.longitude)
        .then((locationName) => {
          console.log('📍 Auto-detected location:', locationName);
          addLocation(locationName);
          isAutoDetecting.current = false;
        })
        .catch((error) => {
          console.error('Failed to add current location:', error);
          isAutoDetecting.current = false;
        });
    }
  }, [geolocation, locations.length, addLocation]);

  return (
    <div className={styles.app}>
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className={styles.skipToContent}>
        Skip to main content
      </a>

      {/* Subtle background gradient */}
      <div className={styles.backgroundGradient} aria-hidden="true">
        <div className={styles.gradientOverlay}></div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className={styles.demoModeBanner}>
          <div className={styles.bannerContent}>
            <p className={styles.bannerText}>
              <IoSparkles className={styles.icon} aria-hidden="true" />
              <span>
                <strong>Demo Mode:</strong> Using sample data
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerGrid}>
            {/* Left: Logo */}
            <div className={styles.logo}>
              <IoCloudSharp className={styles.logoIcon} aria-hidden="true" />
              <h1 className={styles.logoText}>WeatherWise</h1>
            </div>

            {/* Center: Search Bar */}
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <LocationSearch />
              </div>
            </div>

            {/* Right: Controls */}
            <div className={styles.controls}>
              {/* Temperature Unit Toggle */}
              <button
                onClick={toggleTemperatureUnit}
                className={`${styles.controlButton} ${styles.temperatureToggle} ${
                  temperatureUnit === 'celsius' ? styles.celsius : ''
                }`}
                aria-label={`Switch to ${temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
              >
                {temperatureUnit === 'celsius' ? '°C' : '°F'}
              </button>

              {/* Customize Button */}
              <button
                onClick={() => setIsMarketplaceOpen(true)}
                className={`${styles.controlButton} ${styles.customizeButton}`}
                aria-label="Customize widgets"
                title="Customize Widgets"
              >
                <IoApps className={styles.icon} />
              </button>

              {/* Credits Button */}
              <button
                onClick={() => setIsCreditsOpen(true)}
                className={`${styles.controlButton} ${styles.creditsButton}`}
                aria-label="View credits and attribution"
                title="Credits"
              >
                <IoInformationCircle className={styles.icon} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Snap Scroll Grid */}
      <main id="main-content" className={styles.main} ref={mainRef}>
        <div className={styles.mainContainer}>
          <div className={styles.mainInner}>
            <Dashboard
              isMarketplaceOpen={isMarketplaceOpen}
              onMarketplaceClose={() => setIsMarketplaceOpen(false)}
            />
          </div>
        </div>
      </main>

      {/* Credits Modal */}
      <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />

      {/* API Usage Stats (bottom-right corner) */}
      <ApiUsageStats />
    </div>
  );
}

export default App;
