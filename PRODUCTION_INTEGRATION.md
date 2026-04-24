# Production Backend Integration Guide

## ✅ Integration Complete

The frontend has been configured to connect to the production backend at:
```
https://backend-tkiz.onrender.com
```

## 🔧 Configuration Changes

### 1. Environment Variables
Created `.env.local` with production API URL:
```env
NEXT_PUBLIC_API_URL=https://backend-tkiz.onrender.com/api
```

### 2. API Client Update
Updated `lib/api-client.ts` to use environment variable:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

### 3. CORS Configuration
Backend already configured to accept requests from:
- `http://localhost:3000` (local development)
- `http://localhost:5173` (Vite dev server)
- `https://*.vercel.app` (Vercel deployments)

## 🚀 Quick Start

### Local Development with Production Backend
```bash
cd frontend
pnpm install
pnpm dev
```

The app will run at `http://localhost:3000` and connect to production backend.

### Login Credentials
```
Username: rakesh
Password: ChangeMe@123
```

## 🧪 Verification Checklist

### Backend Health Check
```bash
curl https://backend-tkiz.onrender.com/api/health
```
Expected response: `200 OK`

### Test Authentication
1. Open `http://localhost:3000`
2. Login with credentials above
3. Verify redirect to dashboard
4. Check browser console for any errors

### Test API Endpoints

#### 1. Login
```bash
curl -X POST https://backend-tkiz.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"rakesh","password":"ChangeMe@123"}'
```

#### 2. Get Trades (with token)
```bash
curl https://backend-tkiz.onrender.com/api/trades \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. Analytics Overview
```bash
curl https://backend-tkiz.onrender.com/api/analytics/overview \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📋 Feature Testing

### Dashboard
- [ ] View total trades count
- [ ] Check win rate percentage
- [ ] Verify P&L calculations
- [ ] View recent trades table
- [ ] Check charts render correctly

### Journal
- [ ] Create new trade
- [ ] Upload trade image
- [ ] Edit existing trade
- [ ] Delete trade
- [ ] View trade details modal
- [ ] Pagination works

### Analytics
- [ ] Select different months
- [ ] View P&L trends chart
- [ ] Check win/loss distribution
- [ ] Verify metrics calculations

### Settings
- [ ] Update currency preference
- [ ] Change timezone
- [ ] Toggle notifications
- [ ] Save settings
- [ ] Verify persistence

## 🔍 Troubleshooting

### CORS Errors
If you see CORS errors in console:
1. Check backend CORS configuration includes your frontend URL
2. Verify `cors.allowed.origins` in backend `application.properties`
3. Add your deployment URL if deploying to custom domain

### Authentication Issues
If login fails:
1. Check network tab for 401/403 errors
2. Verify credentials are correct
3. Check backend logs for authentication errors
4. Clear localStorage and try again

### API Connection Issues
If API calls fail:
1. Verify backend is running: `curl https://backend-tkiz.onrender.com/api/health`
2. Check network tab for failed requests
3. Verify `.env.local` has correct URL
4. Restart dev server after changing env vars

### Image Upload Issues
If image uploads fail:
1. Check file size < 10MB (backend limit)
2. Verify ImageKit configuration in backend
3. Check network tab for upload errors
4. Verify multipart/form-data content type

## 🌐 Deployment Options

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Configure production backend"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Vercel will auto-detect Next.js

3. **Set Environment Variables**
In Vercel project settings, add:
```
NEXT_PUBLIC_API_URL=https://backend-tkiz.onrender.com/api
```

4. **Deploy**
- Vercel will automatically deploy
- Your app will be live at `https://your-app.vercel.app`

### Deploy to Netlify

1. **Build the app**
```bash
pnpm build
```

2. **Deploy**
```bash
netlify deploy --prod
```

3. **Set Environment Variables**
In Netlify dashboard:
```
NEXT_PUBLIC_API_URL=https://backend-tkiz.onrender.com/api
```

## 📊 Backend API Endpoints

All endpoints are prefixed with `/api`

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration (if enabled)

### Trades
- `GET /trades?page=1&per_page=10` - List trades (paginated)
- `GET /trades/:id` - Get trade details
- `POST /trades` - Create new trade
- `PUT /trades/:id` - Update trade
- `DELETE /trades/:id` - Delete trade

### Image Upload
- `POST /uploads/image` - Upload trade image (multipart/form-data)

### Analytics
- `GET /analytics/overview` - Get analytics overview
- `GET /analytics/monthly?year=2024&month=1` - Monthly stats
- `GET /analytics/weekly?year=2024&week=1` - Weekly stats

### Settings
- `GET /settings` - Get user settings
- `PUT /settings` - Update user settings

### Health Check
- `GET /health` - Backend health status (public endpoint)

## 🔐 Security Notes

### Production Checklist
- [x] HTTPS enabled on backend
- [x] JWT authentication configured
- [x] CORS properly configured
- [x] Environment variables secured
- [ ] Rate limiting (recommended)
- [ ] API key rotation policy
- [ ] Monitoring and logging

### Best Practices
1. Never commit `.env.local` to git
2. Use different credentials for production
3. Rotate JWT secret regularly
4. Monitor API usage
5. Set up error tracking (Sentry, etc.)

## 📈 Performance Optimization

### Current Setup
- React Query caching (5 min stale time)
- Image optimization with Next.js
- Code splitting with dynamic imports
- Lazy loading components

### Recommendations
1. Enable CDN for static assets
2. Implement service worker for offline support
3. Add Redis caching on backend
4. Use image CDN (ImageKit already configured)
5. Enable gzip compression

## 🐛 Known Issues

### Render Free Tier Limitations
- Backend may sleep after 15 min inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading to paid tier for production

### Workarounds
- Backend has keep-alive health check configured
- Frontend shows loading states during slow requests
- Consider implementing retry logic for failed requests

## 📞 Support

### Backend Issues
- Check backend logs on Render dashboard
- Verify MongoDB connection
- Check ImageKit configuration

### Frontend Issues
- Check browser console for errors
- Verify network requests in DevTools
- Check React Query DevTools (if enabled)

## 🎯 Next Steps

1. **Test all features** with production backend
2. **Deploy frontend** to Vercel/Netlify
3. **Update CORS** to include production frontend URL
4. **Set up monitoring** (Sentry, LogRocket, etc.)
5. **Configure analytics** (Google Analytics, Plausible, etc.)
6. **Add error tracking**
7. **Set up CI/CD pipeline**

## ✨ Success Criteria

- [ ] Login works with production backend
- [ ] All CRUD operations on trades work
- [ ] Image uploads work correctly
- [ ] Analytics data displays properly
- [ ] Settings persist correctly
- [ ] No CORS errors in console
- [ ] All API calls return expected data
- [ ] Frontend deployed and accessible
- [ ] Performance is acceptable (<3s load time)
- [ ] Mobile responsive works correctly

---

**Integration Status**: ✅ Complete and Ready for Testing
**Backend URL**: https://backend-tkiz.onrender.com
**Last Updated**: 2026-04-25
