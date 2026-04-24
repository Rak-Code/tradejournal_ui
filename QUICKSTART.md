# Trade Journal - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### Prerequisites
- Backend running at `http://localhost:8080`
- Node.js 18+ installed
- pnpm installed

### Step 1: Start the Development Server
```bash
cd /vercel/share/v0-project
pnpm dev
```

The application will be available at `http://localhost:3000`

### Step 2: Login
Open http://localhost:3000 and use these credentials:
```
Username: rakesh
Password: ChangeMe@123
```

### Step 3: Start Trading!
You're now logged in and can:
- 📊 View your **Dashboard** with performance overview
- 📝 Manage trades in the **Journal**
- 📈 Analyze performance in **Analytics**
- ⚙️ Configure settings in **Settings**

## 📚 Key Features

### Dashboard
- View key trading metrics
- See recent trades
- Check P&L and win rate
- Monitor open vs closed trades

### Journal
Click **"New Trade"** to:
- Enter trade details (symbol, side, price, quantity)
- Set entry and exit prices/dates
- Add notes and images
- Track trade P&L

Click on any trade row to:
- View full details
- Edit the trade
- Delete the trade

### Analytics
Select a month to view:
- Win/loss breakdown
- P&L trends
- Performance metrics
- Daily statistics

### Settings
Customize:
- Currency preference
- Timezone
- Notification settings
- Email preferences

## 🔌 Backend API Requirements

Your backend at `http://localhost:8080` should provide:

### 1. Authentication
```
POST /api/auth/login
Body: { username: string, password: string }
Response: { token: string, user: { id, username, email } }
```

### 2. Trades
```
GET /api/trades?page=1&per_page=10
POST /api/trades
PUT /api/trades/:id
DELETE /api/trades/:id
GET /api/trades/:id
```

### 3. Image Upload
```
POST /api/uploads/image
Body: FormData with 'file' field
Response: { image_url: string }
```

### 4. Analytics
```
GET /api/analytics/overview
GET /api/analytics/monthly?year=2024&month=1
GET /api/analytics/weekly?year=2024&week=1
```

### 5. Settings
```
GET /api/settings
PUT /api/settings
Body: { currency, timezone, notifications_enabled, email_reports }
```

## 🛠️ Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production build
pnpm start

# Type check
pnpm tsc --noEmit

# Check linting
pnpm lint
```

## 📁 Important Files

- `/app/layout.tsx` - Root layout
- `/app/providers.tsx` - Setup Query & Toast providers
- `/lib/api-client.ts` - API configuration
- `/lib/store.ts` - Auth state management
- `middleware.ts` - Route protection

## 🐛 Troubleshooting

### "Cannot connect to API"
- Check backend is running at `http://localhost:8080`
- Check CORS is enabled in backend
- Check network tab in browser DevTools

### "Login failed"
- Verify credentials: `rakesh` / `ChangeMe@123`
- Check backend auth endpoint is working
- Check error message in console

### "Images not uploading"
- Verify upload endpoint at `/api/uploads/image`
- Check file size < 5MB
- Check file type is image (PNG, JPG, GIF)

### "Charts not showing"
- Check analytics endpoints are responding
- Open browser console to see errors
- Verify data structure matches type definitions

## 📱 Mobile Access

The app is fully responsive:
- **Mobile**: Optimized single column layout
- **Tablet**: Two column layout
- **Desktop**: Full multi-column interface

Test on mobile by:
1. Opening DevTools (F12)
2. Clicking device toolbar icon
3. Selecting Mobile device

## 🔒 Security Notes

- Token stored in localStorage
- All API requests include JWT token
- Auto-logout on 401 responses
- CORS enabled for localhost

For production:
- Use HTTPS
- Store token in HTTP-only cookies
- Implement CSRF protection
- Add rate limiting

## 📊 Testing Workflows

### Complete Trade Flow
1. Dashboard → View empty state
2. Journal → Click "New Trade"
3. Fill form → Add symbol, side, price, quantity
4. Upload image → Drag & drop or click
5. Submit → See trade in list
6. Click trade → View details
7. Edit → Change values
8. Delete → Confirm deletion

### Analytics Flow
1. Create 5+ trades with different dates
2. Go to Analytics
3. Select different months
4. View trends and metrics

### Settings Flow
1. Go to Settings
2. Change currency (USD to EUR)
3. Change timezone
4. Toggle notifications
5. Click Save
6. Refresh page → Values persist

## 🎯 Next Steps

1. **Test the app** with your backend
2. **Customize styling** if needed (see Tailwind config)
3. **Add more features** as needed
4. **Deploy to production** (Vercel recommended)

## 💡 Tips

- All form inputs are validated before submission
- Images are preview-able before upload
- Charts auto-update when data changes
- Recent trades refresh on dashboard
- Settings changes are immediate

## 📞 Need Help?

1. Check **README.md** for full documentation
2. Check **IMPLEMENTATION_SUMMARY.md** for architecture
3. Check browser console for error messages
4. Check network tab to see API requests
5. Verify backend is responding with correct format

---

**Happy Trading! 📈**
