/**
 * Custom hook to track the currently visible weather card
 * Uses IntersectionObserver for performance and accuracy
 */

import { useEffect, useRef, useCallback } from 'react';
import { useUIStore } from '../../store/ui-store';

interface UseActiveLocationOptions {
  locations: string[];
  threshold?: number; // Percentage of visibility to consider "active" (0-1)
}

export function useActiveLocation({
  locations,
  threshold = 0.5, // 50% visible = active
}: UseActiveLocationOptions) {
  const setActiveLocation = useUIStore((state) => state.setActiveLocation);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Initialize active location to first location
  useEffect(() => {
    if (locations.length > 0 && !useUIStore.getState().activeLocation) {
      setActiveLocation(locations[0]);
      console.log('🎯 Initial active location:', locations[0]);
    }
  }, [locations, setActiveLocation]);

  // Create IntersectionObserver
  useEffect(() => {
    // Create observer with threshold
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry with highest intersection ratio
        let maxRatio = 0;
        let mostVisibleLocation: string | null = null;

        entries.forEach((entry) => {
          const location = entry.target.getAttribute('data-location');
          if (!location) return;

          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleLocation = location;
          }
        });

        // Update active location if we found a visible card
        if (mostVisibleLocation && maxRatio >= threshold) {
          const currentActive = useUIStore.getState().activeLocation;
          if (currentActive !== mostVisibleLocation) {
            console.log('🎯 Active location changed:', mostVisibleLocation, `(${Math.round(maxRatio * 100)}% visible)`);
            setActiveLocation(mostVisibleLocation);
          }
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for smooth tracking
        rootMargin: '-10% 0px', // Slight margin to avoid edge cases
      }
    );

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      observedElementsRef.current.clear();
    };
  }, [threshold, setActiveLocation]);

  // Callback to register/observe a card element
  const observeCard = useCallback((element: HTMLElement | null, location: string) => {
    if (!element || !observerRef.current) return;

    // Add data attribute for identification
    element.setAttribute('data-location', location);

    // Unobserve previous element for this location if exists
    const previousElement = observedElementsRef.current.get(location);
    if (previousElement && observerRef.current) {
      observerRef.current.unobserve(previousElement);
    }

    // Observe new element
    observerRef.current.observe(element);
    observedElementsRef.current.set(location, element);

    console.log('👁️ Observing weather card:', location);
  }, []);

  return {
    observeCard,
  };
}
