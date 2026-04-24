// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

// Trade Types
export interface Trade {
  id: string;
  entry_date: string;
  entry_price: number;
  exit_date?: string;
  exit_price?: number;
  quantity: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  status: 'OPEN' | 'CLOSED';
  pnl?: number;
  pnl_percent?: number;
  notes?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTradeRequest {
  entry_date: string;
  entry_price: number;
  exit_date?: string;
  exit_price?: number;
  quantity: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  status: 'OPEN' | 'CLOSED';
  notes?: string;
}

export interface UpdateTradeRequest extends Partial<CreateTradeRequest> {}

// Analytics Types
export interface DailyStats {
  date: string;
  wins: number;
  losses: number;
  total_pnl: number;
  total_trades: number;
  win_rate: number;
}

export interface AnalyticsOverview {
  total_trades: number;
  open_trades: number;
  closed_trades: number;
  total_pnl: number;
  win_rate: number;
  average_win: number;
  average_loss: number;
  best_trade: number;
  worst_trade: number;
  profit_factor: number;
  daily_stats: DailyStats[];
  monthly_stats: DailyStats[];
}

// Settings Types
export interface Settings {
  currency: string;
  timezone: string;
  notifications_enabled: boolean;
  email_reports: boolean;
}

// Trade Form Types
export interface TradeFormData {
  symbol: string;
  side: 'BUY' | 'SELL';
  entry_date: Date;
  entry_price: number;
  quantity: number;
  exit_date?: Date;
  exit_price?: number;
  status: 'OPEN' | 'CLOSED';
  notes?: string;
  image?: File;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
