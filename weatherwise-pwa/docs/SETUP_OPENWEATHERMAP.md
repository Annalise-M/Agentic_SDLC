# OpenWeatherMap API Setup Guide

**Quick Start**: Get more accurate weather data in 5 minutes!

---

## Step 1: Sign Up for OpenWeatherMap (Free)

1. Visit **https://openweathermap.org/api**
2. Click **"Sign Up"** (top-right corner)
3. Create your account:
   - Username
   - Email
   - Password
   - Agree to terms

4. **Verify your email** (check spam folder if needed)

---

## Step 2: Get Your API Key

1. Log in to https://home.openweathermap.org
2. Click **"API keys"** tab
3. You'll see a **default API key** already created
4. **Copy the API key** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Important Notes:
- ⏰ New API keys take **~10 minutes to activate**
- 🔑 Keep your API key private (don't commit to git)
- ✅ Free tier: **1,000 calls/day** (plenty for personal use)

---

## Step 3: Configure WeatherWise

1. Open your `.env` file in the project root:
   ```bash
   cd weatherwise-pwa
   code .env  # or nano .env
   ```

2. Replace the placeholder with your actual API key:
   ```bash
   # BEFORE
   VITE_OPENWEATHERMAP_API_KEY=your_api_key_here

   # AFTER (example)
   VITE_OPENWEATHERMAP_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

3. Save the file

---

## Step 4: Restart the Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

---

## Step 5: Verify It's Working

### Check Browser Console

Look for these logs:
```
🌤️ Using OpenWeatherMap (primary)
🌍 Geocoding location: Tokyo, Japan
☀️ Fetching weather data from OpenWeatherMap...
✅ Cached: weather-tokyo (TTL: 30min)
📊 API Calls Today: 2/1000 (Total: 2)
```

### Check Usage Stats

Look in the **bottom-right corner** of your app:
- Should show: `2/1000` (or similar)
- Color: Blue/cyan (healthy)

### Check Weather Data

- Weather cards should load successfully
- Temperature and conditions should be accurate
- Icons should display correctly

---

## Troubleshooting

### "Invalid API key" Error

**Likely Cause**: API key hasn't activated yet (takes ~10 minutes)

**Solutions**:
1. Wait 10-15 minutes after creating your account
2. Verify your email address
3. Check API key is active at https://home.openweathermap.org/api_keys
4. Make sure you copied the entire key (no spaces)

### "API rate limit exceeded"

**Likely Cause**: You've made 1,000+ calls today

**Solutions**:
1. Check usage stats in bottom-right corner
2. Clear cache: Open browser console and run:
   ```javascript
   localStorage.clear()
   ```
3. Wait until tomorrow (limit resets at midnight)
4. Consider upgrading to paid tier if needed

### Weather data not loading

**Solutions**:
1. Check browser console for errors
2. Verify `.env` file has the API key
3. Restart dev server after changing `.env`
4. Check internet connection
5. Try a different location name

### Still using Visual Crossing

**Check**:
1. `.env` has `VITE_OPENWEATHERMAP_API_KEY` set
2. API key is not `your_api_key_here`
3. Dev server was restarted after adding key
4. Browser console shows "Using OpenWeatherMap"

---

## Understanding Free Tier Limits

### What You Get (Free)

| Feature | Limit |
|---------|-------|
| **Calls per day** | 1,000 |
| **Calls per minute** | 60 |
| **Data sources** | 82,000+ sensors |
| **Current weather** | ✅ Included |
| **7-day forecast** | ✅ Included |
| **Hourly forecast** | ✅ 48 hours |
| **Historical data** | ❌ Not included |

### Will You Hit the Limit?

**Typical usage**: **20-50 calls/day**

With our caching strategy:
- Initial load: 10 calls (5 locations × 2 calls each)
- Each refresh: 5 calls (geocoding cached for 24h)
- Weather cached for 30 minutes

**Example Day**:
```
Morning:   10 calls (initial load)
Lunch:      5 calls (refresh after 30min)
Evening:    5 calls (refresh after 30min)
Total:     20 calls (2% of daily limit)
```

You'd need to refresh **200 times per day** to hit the limit! ✅

---

## Monitoring Your Usage

### Real-Time Stats (Bottom-Right Corner)

Expand the widget to see:
- **Daily calls**: 23/1,000
- **Total calls**: 156
- **Progress bar**: Visual usage indicator
- **Warnings**:
  - 🟠 Orange at 80% (800 calls)
  - 🔴 Red at 95% (950 calls)

### Usage Resets

- **Daily limit**: Resets at midnight UTC
- **Monthly tracking**: For upgrade planning

---

## When to Upgrade

Consider upgrading if:
- ✅ You exceed 800 calls/day regularly
- ✅ You need hourly forecasts
- ✅ You want historical weather data
- ✅ You're building a commercial app

### Paid Tiers

| Tier | Calls/Day | Cost/Month |
|------|-----------|------------|
| **Startup** | ~40,000 | $40 |
| **Developer** | ~100,000 | $110 |
| **Professional** | Custom | Contact sales |

---

## API Key Security

### ✅ Do's

- ✅ Store in `.env` file (not tracked by git)
- ✅ Use environment variables
- ✅ Keep it private
- ✅ Regenerate if exposed

### ❌ Don'ts

- ❌ Commit `.env` to git
- ❌ Share publicly on GitHub
- ❌ Hardcode in source files
- ❌ Share with others

---

## Getting Help

### Official Resources

- [API Documentation](https://openweathermap.org/api/one-call-3)
- [FAQ](https://openweathermap.org/faq)
- [Support](https://home.openweathermap.org/questions)

### WeatherWise Specific

- Check [OPENWEATHERMAP_MIGRATION.md](./OPENWEATHERMAP_MIGRATION.md) for technical details
- See console logs for debugging info
- Monitor usage stats in app

---

## Next Steps

1. ✅ Get your API key (done!)
2. ✅ Configure `.env` file (done!)
3. ✅ Restart server (done!)
4. 🎉 Enjoy more accurate weather data!

**That's it!** You're now using OpenWeatherMap with aggressive caching to stay well within the free tier limits.
