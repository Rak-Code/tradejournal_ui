import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const tradeFormSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').toUpperCase(),
  side: z.enum(['BUY', 'SELL']),
  entry_date: z.date(),
  entry_price: z.coerce.number().positive('Entry price must be positive'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  exit_date: z.date().optional(),
  exit_price: z.coerce.number().positive('Exit price must be positive').optional(),
  status: z.enum(['OPEN', 'CLOSED']),
  notes: z.string().optional(),
});

export type TradeFormInput = z.infer<typeof tradeFormSchema>;

export const settingsSchema = z.object({
  currency: z.string(),
  timezone: z.string(),
  notifications_enabled: z.boolean(),
  email_reports: z.boolean(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
