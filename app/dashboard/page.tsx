'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { AnalyticsOverview } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/formatting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCharts } from '@/components/dashboard/dashboard-charts';
import { RecentTrades } from '@/components/dashboard/recent-trades';
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsOverview'],
    queryFn: async () => {
      try {
        const response = await apiClient.getAnalyticsOverview();
        return response.data as AnalyticsOverview;
      } catch (err: any) {
        toast.error('Failed to load analytics data');
        throw err;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 pt-20 px-6 pb-6">
        <div className="h-8 bg-slate-200 rounded w-40 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 px-6 pb-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          Failed to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-20 px-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Your trading performance overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Trades"
          value={data?.total_trades || 0}
          icon={<TrendingUpIcon className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard
          title="Open Trades"
          value={data?.open_trades || 0}
          icon={<ArrowUpIcon className="h-5 w-5" />}
          color="orange"
        />
        <StatsCard
          title="Closed Trades"
          value={data?.closed_trades || 0}
          icon={<ArrowDownIcon className="h-5 w-5" />}
          color="slate"
        />
        <StatsCard
          title="Total P&L"
          value={formatCurrency(data?.total_pnl || 0)}
          icon={<TrendingUpIcon className="h-5 w-5" />}
          isPnL={true}
          pnlValue={data?.total_pnl || 0}
          color="green"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Win Rate"
          value={formatPercentage(data?.win_rate || 0)}
          description={`${data?.win_rate || 0}% of trades are profitable`}
        />
        <MetricCard
          title="Average Win"
          value={formatCurrency(data?.average_win || 0)}
          description="Average profit per winning trade"
        />
        <MetricCard
          title="Profit Factor"
          value={(data?.profit_factor || 0).toFixed(2)}
          description="Total gains / Total losses"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts data={data} />
      </div>

      {/* Recent Trades */}
      <RecentTrades />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  isPnL?: boolean;
  pnlValue?: number;
}

function StatsCard({ title, value, icon, isPnL, pnlValue }: StatsCardProps) {
  const getPnLColor = (val: number) => {
    if (val > 0) return 'text-green-600';
    if (val < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className={`text-2xl font-bold mt-2 ${isPnL ? getPnLColor(pnlValue || 0) : 'text-slate-900'}`}>
              {value}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
}

function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
