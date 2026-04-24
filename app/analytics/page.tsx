'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { AnalyticsOverview } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/formatting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', selectedMonth],
    queryFn: async () => {
      try {
        const [year, month] = selectedMonth.split('-');
        const response = await apiClient.getMonthlyStats(parseInt(year), parseInt(month));
        return response.data;
      } catch (err) {
        toast.error('Failed to load analytics');
        throw err;
      }
    },
  });

  const stats = data as AnalyticsOverview | undefined;

  if (isLoading) {
    return (
      <div className="space-y-6 pt-20 px-6 pb-6">
        <div className="h-8 bg-slate-200 rounded w-40 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-20 px-6 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600">Detailed trading performance analysis</p>
        </div>
        <div className="w-48">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* Last 12 months */}
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const monthName = new Date(year, parseInt(month) - 1).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                });
                return (
                  <SelectItem key={`${year}-${month}`} value={`${year}-${month}`}>
                    {monthName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Trades"
          value={stats?.total_trades || 0}
          subtitle="trades in this period"
        />
        <MetricCard
          title="Win Rate"
          value={formatPercentage(stats?.win_rate || 0)}
          subtitle={`${Math.round(stats?.total_trades ? (stats.win_rate / 100) * stats.total_trades : 0)} winning trades`}
        />
        <MetricCard
          title="Total P&L"
          value={formatCurrency(stats?.total_pnl || 0)}
          subtitle="profit/loss"
          isPnL={true}
          pnlValue={stats?.total_pnl || 0}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DetailedMetricCard
          title="Average Win"
          value={formatCurrency(stats?.average_win || 0)}
        />
        <DetailedMetricCard
          title="Average Loss"
          value={formatCurrency(stats?.average_loss || 0)}
          isNegative
        />
        <DetailedMetricCard
          title="Best Trade"
          value={formatCurrency(stats?.best_trade || 0)}
        />
        <DetailedMetricCard
          title="Worst Trade"
          value={formatCurrency(stats?.worst_trade || 0)}
          isNegative
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Open Trades</span>
                <span className="text-2xl font-bold text-slate-900">{stats?.open_trades || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Closed Trades</span>
                <span className="text-2xl font-bold text-slate-900">{stats?.closed_trades || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Profit Factor</span>
                <span className="text-2xl font-bold text-slate-900">
                  {(stats?.profit_factor || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Win Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {formatPercentage(stats?.win_rate || 0)}
                  </span>
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: `${stats?.win_rate || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {stats?.daily_stats && stats.daily_stats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* P&L Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily P&L Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.daily_stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total_pnl"
                    stroke="#3b82f6"
                    dot={false}
                    name="Daily P&L"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trades Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Trade Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.daily_stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="wins" fill="#10b981" name="Wins" />
                  <Bar dataKey="losses" fill="#ef4444" name="Losses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  isPnL?: boolean;
  pnlValue?: number;
}

function MetricCard({ title, value, subtitle, isPnL, pnlValue }: MetricCardProps) {
  const getPnLColor = (val: number) => {
    if (val > 0) return 'text-green-600';
    if (val < 0) return 'text-red-600';
    return 'text-slate-900';
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${isPnL ? getPnLColor(pnlValue || 0) : 'text-slate-900'}`}>
          {value}
        </p>
        <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

interface DetailedMetricCardProps {
  title: string;
  value: string;
  isNegative?: boolean;
}

function DetailedMetricCard({ title, value, isNegative }: DetailedMetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-slate-600">{title}</p>
        <p className={`text-2xl font-bold mt-2 ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
