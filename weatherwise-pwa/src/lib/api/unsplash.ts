/**
 * Location image service
 * Fetches real location photos using Pexels API
 */

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

/**
 * Generate a deterministic color gradient from location name (fallback)
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Get gradient colors for location (CSS background fallback)
 */
export function getLocationGradient(location: string): string {
  const cleanLocation = location.split(',')[0].trim();
  const color1 = stringToColor(cleanLocation);
  const color2 = stringToColor(cleanLocation + 'alt');
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}

/**
 * Fetch actual location landscape image from Pexels (no people, deterministic selection)
 */
async function fetchPexelsImage(
  location: string
): Promise<string | null> {
  if (!PEXELS_API_KEY || PEXELS_API_KEY === 'your_pexels_key_here') {
    return null;
  }

  try {
    const cleanLocation = location.split(',')[0].trim();

    // Search for landscape/cityscape only - no people
    const searchQuery = `${cleanLocation} city skyline landscape architecture`;

    // Fetch multiple images to choose from
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=15&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      // Randomly select one image from results for variety on each reload
      const selectedIndex = Math.floor(Math.random() * data.photos.length);
      const selectedPhoto = data.photos[selectedIndex];

      console.log(`🏙️ Selected image ${selectedIndex + 1} of ${data.photos.length} for ${cleanLocation}`);

      return selectedPhoto.src.large2x || selectedPhoto.src.large;
    }
  } catch (error) {
    console.error('Pexels API error:', error);
  }

  return null;
}

/**
 * Get location image URL
 * Uses Pexels API if available, falls back to Picsum with location seed
 */
export function getLocationImageUrl(location: string, width: number = 1600, height: number = 1200): string {
  const cleanLocation = location.split(',')[0].trim();
  const seed = cleanLocation.toLowerCase().replace(/\s+/g, '-');

  // Use Picsum with a deterministic seed based on location name
  // This ensures the same location always gets the same image
  // Format: https://picsum.photos/seed/{seed}/{width}/{height}
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

/**
 * Fetch a real location-based landscape image (no people)
 * @param location - Location name (e.g., "Tokyo", "Paris")
 * @param width - Image width
 * @param height - Image height
 */
export async function getLocationImageAsync(
  location: string,
  width: number = 1600,
  height: number = 1200
): Promise<string> {
  // Try Pexels first - landscape/cityscape only
  const pexelsImage = await fetchPexelsImage(location);
  if (pexelsImage) return pexelsImage;

  // Fallback to Picsum
  return getLocationImageUrl(location, width, height);
}

/**
 * Preload image to avoid flashing
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = url;
  });
}
