# WeatherWise PWA - Quick Start Guide

## Get Started in 3 Minutes

### Step 1: Get Your API Key (2 minutes)

1. Visit: https://www.visualcrossing.com/weather-api
2. Click "Sign Up" (top right)
3. Create free account (email + password)
4. After login, go to "Account" tab
5. Copy your API Key

### Step 2: Configure Environment (30 seconds)

```bash
# In the weatherwise-pwa directory
cp .env.example .env
```

Edit `.env` file and paste your API key:
```
VITE_VISUAL_CROSSING_API_KEY=YOUR_KEY_HERE
```

### Step 3: Run the App (30 seconds)

```bash
npm run dev
```

Browser should open automatically at `http://localhost:3000`

## Quick Test Checklist

Test these features in order:

1. **Search**: Click search bar → See popular destinations
2. **Add Location**: Select "Tokyo, Japan" → Weather card appears
3. **Add Second**: Search "Paris, France" → Second card appears side-by-side
4. **View Data**: Check temperature, humidity, wind, 7-day forecast
5. **Add More**: Add "Bali, Indonesia" → Third card in grid
6. **Remove**: Click X on any card → Card disappears
7. **Refresh**: Reload page → Locations persist
8. **Responsive**: Resize window → Layout adjusts

## Expected Behavior

**Working:**
- Search shows 12 popular destinations
- Typing filters suggestions
- Weather cards show current conditions + 7-day forecast
- Temperature in Celsius
- Weather icons display
- Up to 5 locations can be added
- Locations persist in localStorage

**Loading States:**
- Skeleton loader while fetching data (2-3 seconds)

**Error Handling:**
- Invalid location shows error message
- Missing API key shows helpful error with link

## Troubleshooting

**"API key not configured" error:**
- Check `.env` file exists
- Key starts with `VITE_` (required)
- Restart dev server: `Ctrl+C` then `npm run dev`

**Weather not loading:**
- Open DevTools Console (F12)
- Check Network tab for failed requests
- Verify API key is correct at visualcrossing.com

**Blank page:**
- Check Console for errors
- Run `npm install` if dependencies missing
- Clear browser cache

## What's Included

### Components
- **LocationSearch** - Autocomplete search with popular destinations
- **WeatherCard** - Displays current weather + 7-day forecast

### Features
- Real Visual Crossing API integration
- Zustand state management with localStorage
- React Query caching (30 min)
- Responsive Tailwind CSS design
- TypeScript for type safety

### Data Shown
- Current temperature & feels like
- Weather conditions & icon
- Humidity, wind speed, precipitation
- UV index, visibility, pressure
- 7-day forecast with min/max temps

## Next Steps

Once basic flow is working:

1. Try different locations (cities, countries, landmarks)
2. Check responsive design (mobile view)
3. Test localStorage persistence
4. Review code structure in `/src`
5. Check README.md for full documentation

## Production Build

```bash
npm run build
# Output in dist/ folder
```

Deploy to Vercel, Netlify, or any static host.

## Need Help?

- Full docs: See `README.md`
- API docs: https://www.visualcrossing.com/resources/documentation/weather-api/
- Visual Crossing support: https://www.visualcrossing.com/weather-services-support

## Phase 1 Complete!

You now have a working MVP with:
- Multi-location weather comparison
- Real-time weather data
- 7-day forecasts
- Responsive design
- State persistence

Ready for Phase 2: Historical data, best time to visit, and recommendations!
