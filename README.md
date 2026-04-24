# Trade Journal - Complete Frontend Application

A professional trading journal application built with Next.js, TypeScript, and React. Track your trading performance with comprehensive analytics, trade management, and performance metrics.

## Features

### 🔐 Authentication
- Secure login with JWT-based authentication
- Persistent session management using localStorage
- Auto-logout on unauthorized (401) responses
- Protected routes with middleware

### 📊 Dashboard
- Real-time overview of trading performance
- Key metrics: Total trades, Win rate, P&L, Open/Closed trades
- Visual performance charts (P&L trends, Win/Loss distribution)
- Recent trades table with quick access
- Loading states with skeleton loaders

### 📝 Trading Journal
- Create, view, edit, and delete trade entries
- Trade form with validation:
  - Symbol, Side (Buy/Sell), Entry/Exit prices
  - Entry/Exit dates with date picker
  - Quantity, Status (Open/Closed), Notes
- Image uploads with drag-and-drop support
- Trade details modal with P&L calculations
- Pagination for large trade lists
- Table view with sorting capabilities

### 📈 Analytics
- Monthly performance analysis
- Daily P&L trends visualization
- Trade volume charts
- Key metrics:
  - Win rate percentage
  - Average win/loss
  - Best/Worst trades
  - Profit factor
  - Open/Closed trades breakdown

### ⚙️ Settings
- User profile information
- Preferences:
  - Currency selection (USD, EUR, GBP, JPY, CAD, AUD)
  - Timezone configuration (UTC, EST, CST, MST, PST, GMT, IST, JST)
- Notification preferences
- Email report settings
- Secure logout

### 🎨 UI/UX
- Clean, professional design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Dark-aware color scheme
- Interactive charts with Recharts
- Form validation with React Hook Form + Zod
- Toast notifications for user feedback
- Loading states and error handling

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Management**: React Hook Form + Zod
- **Data Fetching**: TanStack React Query
- **Charts**: Recharts
- **State Management**: Zustand
- **HTTP Client**: Axios
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Backend Integration
- RESTful API calls (configurable via environment variable)
- Production: `https://backend-tkiz.onrender.com/api`
- Development: `http://localhost:8080/api`
- JWT token-based authentication
- Image upload support
- Comprehensive error handling

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Backend server (production: `https://backend-tkiz.onrender.com` or local: `http://localhost:8080`)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file (already configured for production)
# .env.local is already set to use production backend

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000` and will connect to the production backend.

### Login Credentials
```
Username: rakesh
Password: ChangeMe@123
```

## Project Structure

```
/app
  ├── layout.tsx                 # Root layout with providers
  ├── layout/
  │   └── app-layout.tsx        # App layout with navbar/sidebar
  ├── providers.tsx             # TanStack Query + Toast setup
  ├── page.tsx                  # Root redirect page
  ├── (public)/
  │   └── login/page.tsx        # Login page
  ├── dashboard/page.tsx        # Dashboard page
  ├── journal/page.tsx          # Journal page
  ├── analytics/page.tsx        # Analytics page
  └── settings/page.tsx         # Settings page

/components
  ├── navbar.tsx                # Top navigation
  ├── sidebar.tsx               # Side navigation
  ├── dashboard/
  │   ├── dashboard-charts.tsx  # Dashboard visualizations
  │   └── recent-trades.tsx     # Recent trades table
  ├── journal/
  │   ├── trade-form.tsx        # Trade creation/edit form
  │   ├── image-upload.tsx      # Image upload with preview
  │   └── trade-details-modal.tsx # Trade details view
  └── ui/                       # shadcn/ui components

/lib
  ├── api-client.ts             # Axios HTTP client
  ├── store.ts                  # Zustand auth store
  ├── types.ts                  # TypeScript types
  ├── validations.ts            # Zod schemas
  ├── formatting.ts             # Utility functions
  └── utils.ts                  # Helper functions
```

## API Integration

The application connects to a backend API at `http://localhost:8080/api` with the following endpoints:

### Authentication
- `POST /auth/login` - User login

### Trades
- `GET /trades` - List trades (paginated)
- `GET /trades/:id` - Get trade details
- `POST /trades` - Create new trade
- `PUT /trades/:id` - Update trade
- `DELETE /trades/:id` - Delete trade

### Image Upload
- `POST /uploads/image` - Upload trade image

### Analytics
- `GET /analytics/overview` - Get analytics overview
- `GET /analytics/monthly` - Get monthly stats
- `GET /analytics/weekly` - Get weekly stats

### Settings
- `GET /settings` - Get user settings
- `PUT /settings` - Update user settings

## Features Breakdown

### Authentication Flow
1. User enters credentials on login page
2. API validation and JWT token generation
3. Token stored in localStorage
4. Token added to all subsequent API requests
5. Automatic logout on 401 responses

### Data Management
- TanStack React Query for caching and synchronization
- Automatic refetch on mutations
- Stale time: 5 minutes
- Cache time: 10 minutes

### Form Validation
- Client-side validation with Zod
- Server-side validation on API
- Real-time error messages
- Form state management with React Hook Form

### Image Handling
- Drag-and-drop upload
- File type validation (PNG, JPG, GIF)
- Size limit: 5MB
- Image preview before upload
- Base64 preview display

## Performance Optimizations

- Lazy loading with suspense boundaries
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Skeleton loaders for better UX
- Efficient API caching with React Query
- Optimized re-renders with proper key management

## Error Handling

- Global error boundary (future enhancement)
- API error handling with meaningful messages
- Form validation errors displayed inline
- Toast notifications for user feedback
- Automatic logout on authentication errors

## Security Features

- JWT token-based authentication
- HTTP-only cookie support (can be enabled)
- CORS handling via API proxy
- Input validation with Zod
- Protected routes with middleware
- Secure password requirements

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Production backend (default)
NEXT_PUBLIC_API_URL=https://backend-tkiz.onrender.com/api

# Or for local development
# NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

The API client in `/lib/api-client.ts` automatically uses this environment variable:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

## Deployment

### To Vercel
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel dashboard or CLI
vercel deploy
```

### Environment Variables for Production
Set in Vercel project settings:
```
NEXT_PUBLIC_API_URL=https://backend-tkiz.onrender.com/api
```

Note: Backend CORS is already configured to accept requests from `https://*.vercel.app`

## Development Tips

### Adding New Pages
1. Create page component in `/app`
2. Add navigation link in `/components/sidebar.tsx`
3. Page automatically protected by middleware if not in `(public)`

### Adding New API Endpoints
1. Add method to `/lib/api-client.ts`
2. Define types in `/lib/types.ts`
3. Use in components with React Query

### Styling
- Use Tailwind CSS classes
- Follow existing color scheme
- Use design tokens from `tailwind.config.ts`
- Mobile-first responsive design

## Troubleshooting

### API Connection Issues
- Verify backend is running at `http://localhost:8080`
- Check CORS headers in backend
- Verify JWT token format

### Authentication Issues
- Clear localStorage and try login again
- Check browser console for errors
- Verify backend returns correct token format

### Form Validation Issues
- Check Zod schema in `/lib/validations.ts`
- Verify form field names match schema
- Check error messages in form fields

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Export/Import trades
- [ ] Trade templates
- [ ] Multiple account support
- [ ] Advanced filtering and search
- [ ] Trade performance goals
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Advanced charting with TradingView
- [ ] Risk management tools

## License

MIT

## Support

For issues or questions, please refer to the documentation or contact support.
