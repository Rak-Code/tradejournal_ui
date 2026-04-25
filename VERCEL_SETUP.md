# Vercel Deployment Setup

## Environment Variables

You MUST set this environment variable in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variable:

```
Name: NEXT_PUBLIC_API_URL
Value: https://backend-tkiz.onrender.com/api
```

4. Make sure to add it for all environments (Production, Preview, Development)
5. Redeploy your application after adding the environment variable

## Verification

After deployment, the frontend should make requests to:
- `https://backend-tkiz.onrender.com/api/auth/login`
- `https://backend-tkiz.onrender.com/api/health`
- etc.

NOT to:
- ~~`https://backend-tkiz.onrender.com/auth/login`~~ (missing /api)

## CORS Configuration

The backend is already configured to accept requests from:
- `https://tradejournal-ui.vercel.app`
- `https://*.vercel.app` (for preview deployments)
- `http://localhost:3000` (local development)
- `http://localhost:5173` (local development)
