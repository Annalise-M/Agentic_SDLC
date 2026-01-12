# Deploying WeatherWise PWA to Netlify

This guide will help you deploy your WeatherWise PWA to Netlify.

## Prerequisites

- A Netlify account (sign up at https://app.netlify.com/signup)
- Your Visual Crossing Weather API key
- (Optional) Pexels API key for location images
- Git repository pushed to GitHub/GitLab/Bitbucket

## Method 1: Deploy via Netlify UI (Recommended)

### Step 1: Push Your Code to Git

```bash
# If not already a git repo, initialize it
cd weatherwise-pwa
git add .
git commit -m "feat: add affiliate integration and prepare for deployment"
git push origin main
```

### Step 2: Connect to Netlify

1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your WeatherWise PWA repository

### Step 3: Configure Build Settings

Netlify should auto-detect the settings from `netlify.toml`, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### Step 4: Set Environment Variables

Before deploying, add your environment variables:

1. In Netlify, go to **Site settings** → **Environment variables**
2. Click **"Add a variable"** and add:

**Required:**
- Key: `VITE_VISUAL_CROSSING_API_KEY`
- Value: Your Visual Crossing API key
- Scopes: Check all deploy contexts (Production, Deploy Previews, Branch deploys)

**Optional (but recommended):**
- Key: `VITE_PEXELS_API_KEY`
- Value: Your Pexels API key

**Affiliate IDs (add when you have them):**
- Key: `VITE_SKYSCANNER_AFFILIATE_ID`
- Value: Your Skyscanner affiliate ID

- Key: `VITE_BOOKING_AFFILIATE_ID`
- Value: Your Booking.com affiliate ID

### Step 5: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (1-2 minutes)
3. Your site will be live at a random Netlify subdomain (e.g., `random-name-123.netlify.app`)

### Step 6: Set Up Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your DNS
4. Netlify will automatically provision an SSL certificate

---

## Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

This will open a browser window to authorize the CLI.

### Step 3: Initialize Netlify Site

```bash
cd weatherwise-pwa
netlify init
```

Follow the prompts:
- **Create & configure a new site**
- Choose your team
- Enter a site name (or leave blank for random name)
- Build command: `npm run build`
- Directory to deploy: `dist`
- Netlify functions folder: (leave blank)

### Step 4: Set Environment Variables

```bash
# Required
netlify env:set VITE_VISUAL_CROSSING_API_KEY "your_api_key_here"

# Optional
netlify env:set VITE_PEXELS_API_KEY "your_pexels_key_here"

# Affiliate IDs (when you have them)
netlify env:set VITE_SKYSCANNER_AFFILIATE_ID "your_skyscanner_id"
netlify env:set VITE_BOOKING_AFFILIATE_ID "your_booking_id"
```

### Step 5: Deploy

```bash
# Deploy to production
netlify deploy --prod
```

Or for a draft deployment first:

```bash
# Deploy preview
netlify deploy

# If preview looks good, deploy to production
netlify deploy --prod
```

---

## Method 3: Drag & Drop Deploy (Quick Test)

For a quick test deployment without Git:

1. Build locally:
   ```bash
   npm run build
   ```

2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder onto the page
4. Your site will be deployed instantly

**Note**: This method doesn't support environment variables easily. Use for testing only.

---

## Verifying Your Deployment

After deployment, verify:

1. **Homepage loads**: Visit your Netlify URL
2. **Auto-location works**: Grant location permission
3. **Search works**: Add a city (Tokyo, Paris, etc.)
4. **Weather data loads**: Check that current conditions and forecast appear
5. **Images load**: Verify location background images display
6. **Affiliate links work**: Scroll to bottom of weather cards, click "Find Flights" and "Find Hotels"
7. **PWA installable**: Check for install prompt or use DevTools → Application → Manifest
8. **Offline works**: Star a location, turn off network, reload page

---

## Continuous Deployment

Once connected to Git, Netlify will automatically deploy on every push to your main branch:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
# Netlify automatically builds and deploys
```

---

## Troubleshooting

### Build Fails

Check the deploy log in Netlify. Common issues:
- Missing environment variables
- Node version mismatch (should be 18+)
- npm dependencies not installing

### Weather Data Not Loading

- Verify `VITE_VISUAL_CROSSING_API_KEY` is set correctly
- Check browser console for API errors
- Verify API key is valid at Visual Crossing dashboard

### Images Not Showing

- If no `VITE_PEXELS_API_KEY` is set, app will use Picsum Photos fallback (generic images)
- Add Pexels key for real location photos

### Affiliate Links Don't Track

- Affiliate IDs are optional - links work without them
- Get approved by Skyscanner and Booking.com first
- Add IDs via environment variables when approved

---

## Next Steps After Deployment

1. **Get your live URL** (e.g., `https://weatherwise.netlify.app`)
2. **Apply for affiliate programs** with your live website:
   - Skyscanner: https://impact.com/ad-campaign/skyscanner.com/
   - Booking.com: https://admin.booking.com/partner/registration
3. **Add affiliate IDs** to Netlify environment variables when approved
4. **Test affiliate tracking** by clicking through and verifying parameters in URLs
5. **Monitor analytics** in Netlify dashboard
6. **Set up custom domain** for professional appearance

---

## Estimated Timeline

- **Deploy to Netlify**: 5-10 minutes
- **Skyscanner approval**: 1-3 business days
- **Booking.com approval**: 2-5 business days

Once approved, add your affiliate IDs to environment variables and redeploy (or they'll auto-deploy on next push).

---

## Support

- Netlify Documentation: https://docs.netlify.com/
- Netlify Support: https://www.netlify.com/support/
- Visual Crossing API: https://www.visualcrossing.com/weather-api
