# WeatherWise PWA - Testing Guide

## Pre-Testing Setup

### 1. Environment Configuration

**Verify .env file exists:**
```bash
cat .env
```

Should show:
```
VITE_VISUAL_CROSSING_API_KEY=your_actual_key
```

**If not configured:**
1. Get API key from https://www.visualcrossing.com/weather-api
2. Run: `cp .env.example .env`
3. Edit `.env` and paste your key
4. Restart dev server

### 2. Start Development Server

```bash
npm run dev
```

Expected output:
```
VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Browser should auto-open to http://localhost:3000

## Test Suite 1: Basic Functionality

### Test 1.1: Initial Load

**Steps:**
1. Open http://localhost:3000
2. Observe the page

**Expected Results:**
- ✅ Header displays "WeatherWise" with cloud icon
- ✅ Subtitle: "Compare weather across multiple destinations..."
- ✅ Search bar visible with placeholder text
- ✅ Empty state shows "No locations selected yet"
- ✅ Cloud icon and helpful message displayed
- ✅ Footer shows "Weather data provided by Visual Crossing"

**Pass Criteria:** All elements render correctly

---

### Test 1.2: Search Dropdown

**Steps:**
1. Click on the search input field
2. Observe the dropdown

**Expected Results:**
- ✅ Dropdown appears below search bar
- ✅ "Popular Destinations" header shown
- ✅ 12 locations listed:
  - Tokyo, Japan
  - Paris, France
  - New York, USA
  - London, UK
  - Bali, Indonesia
  - Maldives
  - Barcelona, Spain
  - Dubai, UAE
  - Sydney, Australia
  - Rome, Italy
  - Bangkok, Thailand
  - Singapore
- ✅ Each item has a map pin icon
- ✅ Hovering highlights items in blue

**Pass Criteria:** Dropdown shows all popular destinations

---

### Test 1.3: Search Filtering

**Steps:**
1. Click search bar
2. Type "tok"
3. Observe filtered results

**Expected Results:**
- ✅ Only "Tokyo, Japan" appears in dropdown
- ✅ Other locations hidden
- ✅ Typing "par" shows only "Paris, France" and "Barcelona, Spain"

**Pass Criteria:** Filtering works case-insensitive

---

### Test 1.4: Add First Location

**Steps:**
1. Click search bar
2. Click "Tokyo, Japan"
3. Wait 2-3 seconds

**Expected Results:**
- ✅ Search input clears
- ✅ Dropdown closes
- ✅ Weather card appears
- ✅ Loading skeleton shows during fetch
- ✅ Card displays:
  - "Tokyo, Japan" as title
  - Resolved address (e.g., "Tokyo, Tokyo, Japan")
  - Current temperature (large, e.g., "15°C")
  - Feels like temperature
  - Weather icon
  - Conditions (e.g., "Partly cloudy")
  - 6 metrics grid (humidity, wind, precipitation, UV, visibility, pressure)
  - 7-day forecast section
- ✅ Counter shows "1 of 5 locations selected"
- ✅ X button appears in top-right of card

**Pass Criteria:** Weather card loads with real data

---

### Test 1.5: API Error Handling

**Steps:**
1. Temporarily edit `.env` to set invalid API key
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Add a location
4. Observe error

**Expected Results:**
- ✅ Card shows red error box
- ✅ Error message: "Invalid API key. Please check your VITE_VISUAL_CROSSING_API_KEY."
- ✅ X button still works to remove card

**Steps to Fix:**
1. Restore valid API key in `.env`
2. Restart server

**Pass Criteria:** Clear error message shown

---

## Test Suite 2: Multi-Location Comparison

### Test 2.1: Add Second Location

**Steps:**
1. Ensure Tokyo is already added
2. Search and add "Paris, France"

**Expected Results:**
- ✅ Second weather card appears
- ✅ Two cards display side-by-side (desktop) or stacked (mobile)
- ✅ Counter shows "2 of 5 locations selected"
- ✅ Each card shows different weather data
- ✅ Tip message disappears (only shown for 1 location)

**Pass Criteria:** Two cards visible with different data

---

### Test 2.2: Add Third Location

**Steps:**
1. Add "Bali, Indonesia"

**Expected Results:**
- ✅ Third card appears
- ✅ Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile
- ✅ Counter shows "3 of 5 locations selected"
- ✅ All cards have equal width

**Pass Criteria:** Three cards in responsive grid

---

### Test 2.3: Add Fourth and Fifth Locations

**Steps:**
1. Add "London, UK"
2. Add "Sydney, Australia"

**Expected Results:**
- ✅ Fourth and fifth cards appear
- ✅ Counter shows "5 of 5 locations selected"
- ✅ Search input disabled with message: "Maximum 5 locations reached"
- ✅ Search input grayed out

**Pass Criteria:** Maximum limit enforced

---

### Test 2.4: Try Adding Sixth Location

**Steps:**
1. Try to click search bar

**Expected Results:**
- ✅ Search bar is disabled (can't click)
- ✅ Placeholder shows max reached message
- ✅ No dropdown appears

**Pass Criteria:** Cannot add more than 5 locations

---

### Test 2.5: Remove Location

**Steps:**
1. Click X button on Tokyo weather card

**Expected Results:**
- ✅ Tokyo card disappears immediately
- ✅ Remaining cards shift position
- ✅ Counter updates to "4 of 5 locations selected"
- ✅ Search bar re-enabled

**Pass Criteria:** Location removal works

---

## Test Suite 3: Weather Data Verification

### Test 3.1: Current Conditions

**Steps:**
1. Add any location
2. Examine current weather section

**Expected Results:**
- ✅ Temperature shown as whole number with °C
- ✅ Feels like temperature shown
- ✅ Weather icon matches conditions
- ✅ Conditions text descriptive (e.g., "Partly cloudy", "Rain, Overcast")

**Pass Criteria:** Data is logical and complete

---

### Test 3.2: Weather Metrics

**Steps:**
1. Check the 6 metrics grid

**Expected Results:**
- ✅ Humidity: 0-100%
- ✅ Wind: km/h value
- ✅ Precipitation: 0-100%
- ✅ UV Index: 0-11 (whole number)
- ✅ Visibility: km value
- ✅ Pressure: mb value
- ✅ Each metric has icon and label
- ✅ Values are reasonable (not NaN or null)

**Pass Criteria:** All metrics display valid data

---

### Test 3.3: 7-Day Forecast

**Steps:**
1. Scroll to forecast section
2. Examine all 7 days

**Expected Results:**
- ✅ Exactly 7 days shown
- ✅ Each row shows:
  - Day name (e.g., "Mon")
  - Date (e.g., "Jan 8")
  - Weather icon
  - Conditions text
  - Max temperature
  - Min temperature
- ✅ Dates are sequential
- ✅ Max temp > Min temp
- ✅ Icons match conditions

**Pass Criteria:** Forecast shows logical progression

---

## Test Suite 4: UI/UX Features

### Test 4.1: Loading State

**Steps:**
1. Clear localStorage: Open DevTools > Application > Local Storage > Clear
2. Add a location
3. Observe loading state

**Expected Results:**
- ✅ Skeleton loader appears immediately
- ✅ Shimmer animation visible
- ✅ Matches card layout (header, temp area, metrics, forecast)
- ✅ Lasts 1-3 seconds
- ✅ Smoothly transitions to real data

**Pass Criteria:** Loading state is visible and smooth

---

### Test 4.2: Empty State

**Steps:**
1. Remove all locations
2. Observe empty state

**Expected Results:**
- ✅ Large cloud icon centered
- ✅ "No locations selected yet" heading
- ✅ "Search for a location above..." subtext
- ✅ Empty state centered vertically

**Pass Criteria:** Empty state is clear and helpful

---

### Test 4.3: Hover States

**Steps:**
1. Hover over various interactive elements

**Expected Results:**
- ✅ Search suggestions highlight on hover
- ✅ X buttons change color on hover
- ✅ Weather cards get shadow on hover
- ✅ Footer link underlines on hover

**Pass Criteria:** Visual feedback on all interactive elements

---

### Test 4.4: Responsive Design - Desktop

**Steps:**
1. Set browser width to 1440px (desktop)
2. Add 3 locations

**Expected Results:**
- ✅ Header full width with padding
- ✅ Content max-width with margins
- ✅ 3 cards in 3-column grid
- ✅ Search bar reasonable width (not full screen)

**Pass Criteria:** Desktop layout looks balanced

---

### Test 4.5: Responsive Design - Tablet

**Steps:**
1. Set browser width to 768px
2. Add 3 locations

**Expected Results:**
- ✅ Cards display in 2-column grid
- ✅ Third card wraps to next row
- ✅ Header stacks appropriately
- ✅ Search bar full width

**Pass Criteria:** Tablet layout is usable

---

### Test 4.6: Responsive Design - Mobile

**Steps:**
1. Set browser width to 375px (iPhone)
2. Add 2 locations

**Expected Results:**
- ✅ Cards stack vertically (1 column)
- ✅ All content fits within viewport
- ✅ No horizontal scroll
- ✅ Text sizes readable
- ✅ Touch targets large enough (buttons, X icons)

**Pass Criteria:** Mobile layout is fully functional

---

## Test Suite 5: Persistence and State

### Test 5.1: LocalStorage Persistence

**Steps:**
1. Add 3 locations (Tokyo, Paris, Bali)
2. Open DevTools > Application > Local Storage
3. Find `weatherwise-locations` key
4. Verify content

**Expected Results:**
- ✅ Key `weatherwise-locations` exists
- ✅ Value contains JSON with `state.locations` array
- ✅ Array contains ["Tokyo, Japan", "Paris, France", "Bali, Indonesia"]

**Pass Criteria:** Locations stored in localStorage

---

### Test 5.2: Page Refresh Persistence

**Steps:**
1. Add 3 locations
2. Refresh page (Cmd+R / Ctrl+R)
3. Observe

**Expected Results:**
- ✅ Page reloads
- ✅ Same 3 locations appear
- ✅ Weather data re-fetches
- ✅ Loading states show during fetch
- ✅ Counter shows correct count

**Pass Criteria:** State persists after refresh

---

### Test 5.3: React Query Cache

**Steps:**
1. Add Tokyo
2. Wait for data to load
3. Remove Tokyo (click X)
4. Immediately add Tokyo again

**Expected Results:**
- ✅ Second load is instant (no loading state)
- ✅ Data appears immediately from cache
- ✅ No new API request (check Network tab)

**Pass Criteria:** Data cached for 30 minutes

---

### Test 5.4: Cache Invalidation

**Steps:**
1. Add location and wait for load
2. Wait 31 minutes (or manually expire cache in DevTools)
3. Remove and re-add location

**Expected Results:**
- ✅ Loading state appears again
- ✅ New API request made
- ✅ Fresh data loaded

**Pass Criteria:** Cache expires after 30 minutes

---

## Test Suite 6: Error Scenarios

### Test 6.1: Invalid Location

**Steps:**
1. Type "asdfghjkl" in search
2. Press Enter

**Expected Results:**
- ✅ Location added to list
- ✅ Weather card attempts to load
- ✅ Error message: "Location not found: asdfghjkl"
- ✅ Card shows error state in red box
- ✅ X button still works

**Pass Criteria:** Graceful error handling

---

### Test 6.2: Network Error

**Steps:**
1. Open DevTools > Network tab
2. Set throttling to "Offline"
3. Add a new location

**Expected Results:**
- ✅ Loading state appears
- ✅ Eventually shows error
- ✅ Error message about network failure
- ✅ Can remove card

**Steps to Fix:**
1. Set throttling back to "No throttling"

**Pass Criteria:** Network errors handled

---

### Test 6.3: Rate Limit (Theoretical)

**Note:** Hard to test without hitting actual limit

**Steps:**
1. Add/remove locations repeatedly (50+ times in 1 hour)

**Expected Results:**
- ✅ If rate limit hit: Error message "API rate limit exceeded"
- ✅ Cached locations still work
- ✅ No app crash

**Pass Criteria:** Rate limit errors handled gracefully

---

## Test Suite 7: Accessibility

### Test 7.1: Keyboard Navigation

**Steps:**
1. Use Tab key to navigate page
2. Try all interactive elements

**Expected Results:**
- ✅ Search input focusable
- ✅ Dropdown items focusable
- ✅ Enter key adds location
- ✅ X buttons focusable and clickable with Enter
- ✅ Footer link focusable

**Pass Criteria:** All actions possible with keyboard

---

### Test 7.2: Screen Reader (Optional)

**Steps:**
1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate page

**Expected Results:**
- ✅ Headings announced
- ✅ Button purposes clear
- ✅ Weather data readable
- ✅ Aria labels present

**Pass Criteria:** Content is accessible

---

## Test Suite 8: Performance

### Test 8.1: Initial Load Speed

**Steps:**
1. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
2. Observe load time

**Expected Results:**
- ✅ Page renders in <1 second
- ✅ Interactive in <2 seconds
- ✅ No layout shifts

**Pass Criteria:** Fast initial load

---

### Test 8.2: Weather Data Fetch Speed

**Steps:**
1. Add location and time the fetch

**Expected Results:**
- ✅ API response in 1-3 seconds
- ✅ No blocking of UI
- ✅ Multiple locations load in parallel

**Pass Criteria:** Responsive during data fetch

---

### Test 8.3: Memory Usage

**Steps:**
1. Open DevTools > Memory
2. Add/remove locations 10 times
3. Check memory graph

**Expected Results:**
- ✅ No continuous upward trend (memory leak)
- ✅ Memory stabilizes

**Pass Criteria:** No memory leaks

---

## Test Suite 9: Browser Compatibility

### Test 9.1: Chrome/Edge

**Expected:** ✅ All tests pass

### Test 9.2: Firefox

**Expected:** ✅ All tests pass

### Test 9.3: Safari

**Expected:** ✅ All tests pass

---

## Test Suite 10: Production Build

### Test 10.1: Build Success

**Steps:**
```bash
npm run build
```

**Expected Results:**
- ✅ Build completes without errors
- ✅ `dist/` folder created
- ✅ Files include: index.html, assets/*.js, assets/*.css
- ✅ Bundle size reasonable (<500KB)

**Pass Criteria:** Clean build

---

### Test 10.2: Preview Build

**Steps:**
```bash
npm run preview
```

**Expected Results:**
- ✅ Preview server starts
- ✅ All functionality works in production build
- ✅ No console errors

**Pass Criteria:** Production build works

---

## Summary Report Template

```markdown
# WeatherWise Testing Report
Date: [Date]
Tester: [Name]

## Test Results

| Suite | Tests | Passed | Failed | Notes |
|-------|-------|--------|--------|-------|
| Basic Functionality | 5 | X | X | ... |
| Multi-Location | 5 | X | X | ... |
| Weather Data | 3 | X | X | ... |
| UI/UX | 6 | X | X | ... |
| Persistence | 4 | X | X | ... |
| Error Scenarios | 3 | X | X | ... |
| Accessibility | 2 | X | X | ... |
| Performance | 3 | X | X | ... |
| Browser Compat | 3 | X | X | ... |
| Production Build | 2 | X | X | ... |

## Overall Status: PASS / FAIL

## Critical Issues: [List any blockers]

## Minor Issues: [List any non-blockers]

## Recommendations: [Improvements]
```

---

## Quick Smoke Test (5 Minutes)

For rapid verification:

1. ✅ App loads
2. ✅ Search shows destinations
3. ✅ Add Tokyo → weather loads
4. ✅ Add Paris → second card appears
5. ✅ Remove Tokyo → card disappears
6. ✅ Refresh → Paris persists
7. ✅ Responsive on mobile
8. ✅ No console errors

If all pass: **Ready for demo!**

---

## Testing Tools

- **Browser**: Chrome DevTools (F12)
- **Network**: Throttling to test slow connections
- **Responsive**: Device toolbar (Cmd+Shift+M)
- **LocalStorage**: Application > Local Storage
- **Console**: Check for errors/warnings

## Next Steps After Testing

1. Document any bugs in GitHub Issues
2. Create user acceptance testing plan
3. Get feedback from 3-5 users
4. Iterate based on feedback
5. Prepare for Phase 2 implementation

---

**Happy Testing!** 🧪
