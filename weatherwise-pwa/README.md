# WeatherWise PWA

A sleek, magazine-style Progressive Web App for comparing weather across multiple travel destinations. Built with React, TypeScript, Vite, SCSS, and GSAP.

## ✨ Features

### Core Weather Features
- **Multi-Location Weather Comparison**: Compare weather conditions for up to 5 locations side-by-side
- **7-Day Forecast**: View detailed weather forecasts for the next week
- **Current Conditions**: Real-time weather data including temperature, humidity, wind speed, UV index, visibility, and pressure
- **Visual Weather Icons**: Beautiful weather icons from Visual Crossing API

### Design & UX
- **Magazine-Style Layout**: Premium horizontal card design with location images
- **Location Background Images**: Real cityscape/landscape photos from Pexels API (no people, landscape-only)
- **Smooth GSAP Animations**: Professional entrance animations and micro-interactions
- **Auto-Location Detection**: Automatically detects and adds user's current location on first visit
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Persistent State**: Selected locations are saved in localStorage

### Performance
- **Smart Caching**: Weather data is cached for 30 minutes to reduce API calls
- **Demo Mode**: Fallback to mock data when API keys are not configured

## 🛠️ Tech Stack

### Core
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7.3
- **Styling**: SCSS Modules (CSS-in-JS alternative)
- **Animations**: GSAP (GreenSock Animation Platform)
- **State Management**: Zustand (with localStorage persistence)
- **Data Fetching**: TanStack Query v5 (React Query)
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: lucide-react

### APIs
- **Weather**: Visual Crossing Weather API (1000 records/day free tier)
- **Images**: Pexels API (free tier with attribution)
- **Geolocation**: Browser Geolocation API + Visual Crossing reverse geocoding

## 📁 Project Structure

```
weatherwise-pwa/
├── src/
│   ├── components/
│   │   ├── search/
│   │   │   └── LocationSearch.tsx           # Location search with autocomplete
│   │   └── weather/
│   │       ├── WeatherCard.tsx              # Magazine-style weather card
│   │       └── WeatherCard.module.scss      # SCSS styling
│   ├── lib/
│   │   ├── api/
│   │   │   ├── weather.ts                   # Visual Crossing API client
│   │   │   └── unsplash.ts                  # Pexels image API client
│   │   ├── data/
│   │   │   └── mock-weather.ts              # Demo mode fallback data
│   │   └── hooks/
│   │       ├── useWeather.ts                # React Query hook for weather
│   │       └── useGeolocation.ts            # Auto-location detection hook
│   ├── store/
│   │   └── locations-store.ts               # Zustand store for locations
│   ├── types/
│   │   └── weather.ts                       # TypeScript interfaces
│   ├── App.tsx                              # Main application component
│   ├── main.tsx                             # Application entry point
│   └── index.css                            # Global styles
├── .env                                     # Environment variables (not committed)
├── .env.example                             # Example environment variables
└── package.json
```

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### 2. Clone and Install

```bash
cd weatherwise-pwa
npm install
```

### 3. Get API Keys

#### Visual Crossing Weather API (Required)
1. Go to [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api)
2. Sign up for a free account (1000 records/day free tier)
3. Copy your API key

#### Pexels API (Optional - for real location photos)
1. Go to [Pexels API](https://www.pexels.com/api/)
2. Click "Get Started" and sign up (free, no credit card)
3. Copy your API key from the dashboard

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```
   VITE_VISUAL_CROSSING_API_KEY=your_visual_crossing_key_here
   VITE_PEXELS_API_KEY=your_pexels_key_here  # Optional
   ```

### 5. Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 🧪 Testing the Application

### End-to-End Testing Flow

1. **Auto-Location Detection**
   - On first visit, browser will request location permission
   - If granted, your current location will be automatically added
   - Location name is resolved via reverse geocoding

2. **Search for Locations**
   - Click on the search bar
   - Type a city name (e.g., "Barcelona", "Tokyo", "Paris")
   - Select from suggestions
   - Magazine-style weather card appears with:
     - Real location photo (cityscape/landscape)
     - Current temperature (large editorial typography)
     - Weather icon and conditions
     - Key metrics (humidity, wind, UV, etc.)
     - 5-day forecast preview

3. **Compare Multiple Locations**
   - Add up to 5 locations total
   - Cards stack vertically with staggered entrance animations
   - Each location gets a unique, consistent image

4. **Remove Locations**
   - Click the X button on any card
   - Smooth GSAP exit animation
   - Location removed from localStorage

5. **Test Persistence**
   - Refresh the page
   - Your locations should persist

### Features to Verify

- [x] Auto-location detection on first visit
- [x] Location search with suggestions
- [x] Real weather data from Visual Crossing API
- [x] Magazine-style horizontal card layout
- [x] Location background images from Pexels
- [x] Smooth GSAP entrance animations
- [x] Current temperature and conditions
- [x] 7 key weather metrics displayed
- [x] 5-day forecast in card
- [x] Maximum 5 locations enforced
- [x] Remove button works with animation
- [x] Locations persist in localStorage
- [x] Loading skeleton while fetching
- [x] Demo mode fallback when no API keys

## 📊 API Usage and Rate Limits

### Visual Crossing API Free Tier
- **Limit**: 1000 records per day
- **Usage**: Each location lookup uses ~2-3 records
- **Capacity**: ~40 active users per hour with caching
- **Caching**: 30-minute cache in React Query

### Pexels API Free Tier
- **Limit**: Unlimited searches, attribution required
- **Usage**: 1 request per location (cached in browser)
- **Features**: Landscape-only images, no people in focus
- **Selection**: Deterministic - same location = same image

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment.

## 🌐 Deployment

The app can be deployed to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use GitHub Actions workflow
- Any static hosting service

**Important**: Set environment variables in your hosting platform:
- `VITE_VISUAL_CROSSING_API_KEY` (required)
- `VITE_PEXELS_API_KEY` (optional)

## 🔧 Troubleshooting

### API Keys Not Working
- Check that your `.env` file has the correct keys
- Verify keys start with `VITE_` (required for Vite)
- Restart the dev server after changing `.env`

### Weather Data Not Loading
- Open browser DevTools Console for error messages
- Check Network tab for API requests
- Verify API key at Visual Crossing dashboard
- Check if you've exceeded rate limit (1000 records/day)

### Images Not Showing
- Check browser console for Pexels API errors
- Verify `VITE_PEXELS_API_KEY` is set correctly
- If no key provided, app falls back to Lorem Picsum

### Auto-Location Not Working
- Grant browser location permission when prompted
- Check browser console for geolocation errors
- Clear localStorage key `auto-location-detected` to retry

## 📋 Development Phases

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Vite + React + TypeScript setup
- [x] Visual Crossing Weather API integration
- [x] Location search with autocomplete
- [x] Demo mode fallback
- [x] Zustand state management
- [x] Auto-location detection
- [x] **Magazine-style SCSS layout**
- [x] **GSAP animations**
- [x] **Pexels location images**

### 🚧 Phase 2: Historical Data & Best Time to Visit
- [ ] Historical weather API endpoint
- [ ] Best time calculator (3-5 years analysis)
- [ ] Visual charts showing optimal months

### 📅 Phase 3: Smart Recommendations
- [ ] Packing list generator (weather-based)
- [ ] Activity suggestions (weather-appropriate)

### 📱 Phase 4: PWA Features
- [ ] Service worker setup
- [ ] Offline caching with IndexedDB
- [ ] Install prompt
- [ ] App manifest

### 💰 Phase 5: Monetization
- [ ] Flight affiliate (Skyscanner)
- [ ] Hotel booking (Booking.com)
- [ ] Travel insurance
- [ ] Language learning with progress tracking

### 🚀 Phase 6: Polish & Deploy
- [ ] Testing
- [ ] SEO optimization
- [ ] Production deployment

## 🎨 Design Philosophy

WeatherWise follows a **sleek online magazine aesthetic**:
- Large, editorial typography (SF Pro Display font stack)
- Premium horizontal card layouts
- Professional photography (landscape-only, no people)
- Smooth, polished GSAP animations
- Clean color palette with subtle gradients
- Generous whitespace and breathing room

## 🤝 Contributing

This is a learning project demonstrating modern React patterns, SCSS modules, and GSAP animations. Feel free to fork and experiment!

## 📄 License

MIT

## 🙏 Credits

- Weather data: [Visual Crossing Weather API](https://www.visualcrossing.com/)
- Location photos: [Pexels](https://www.pexels.com/)
- Icons: [Lucide React](https://lucide.dev/)
- Animations: [GSAP](https://greensock.com/gsap/)
- Built with [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- Built with ❤️ for travelers

---

**🎨 Magazine layout version loaded - Jan 9, 2026**
