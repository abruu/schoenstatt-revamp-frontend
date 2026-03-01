# Railway Deployment Setup for PDF Generation

## Required Environment Variables

Add these environment variables in your Railway project settings:

```bash
# Node Environment
NODE_ENV=production

# Puppeteer Configuration
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Your existing environment variables
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=your_sender_email
NEXT_PUBLIC_STRAPI_URL=your_strapi_url
NEXT_LOGO_PATH=your_logo_url
TURNSTILE_SECRET_KEY=your_turnstile_secret
```

## Required Dependencies

Make sure your `package.json` includes:

```json
{
  "dependencies": {
    "@sparticuz/chromium-min": "^143.0.4",
    "puppeteer-core": "^24.37.5"
  }
}
```

## Installation Steps

1. **Install the chromium-min package:**

   ```bash
   npm install @sparticuz/chromium-min
   ```

2. **Set Railway environment variables:**
   - Go to your Railway project dashboard
   - Navigate to Variables tab
   - Add `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
   - Ensure `NODE_ENV=production` is set

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Fix PDF generation for Railway deployment"
   git push
   ```

## How It Works

- **Development**: Uses local Chrome/Chromium installation
- **Production (Railway)**: Uses `@sparticuz/chromium-min` which is optimized for serverless environments
- The code automatically detects the environment via `NODE_ENV`
- Chromium binaries are extracted to `/tmp` directory on Railway

## Troubleshooting

If PDF generation still fails:

1. **Check Railway logs** for specific error messages:

   ```bash
   railway logs
   ```

2. **Common issues:**
   - Missing `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` variable
   - Insufficient memory (upgrade Railway plan if needed)
   - Missing `@sparticuz/chromium-min` package

3. **Memory requirements:**
   - Minimum: 512MB RAM
   - Recommended: 1GB+ RAM for reliable PDF generation

## Testing Locally

To test production-like behavior locally:

```bash
NODE_ENV=production npm run build
NODE_ENV=production npm start
```
