'use client';

import { AnalyticsOverview } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardChartsProps {
  data?: AnalyticsOverview;
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  // Prepare P&L data for line chart
  const pnlData = data?.daily_stats?.slice(-30) || [];

  // Prepare win/loss data for bar chart
  const winLossData = data?.daily_stats?.slice(-7) || [];

  // Prepare pie chart data
  const pieData = [
    { name: 'Wins', value: data?.total_trades ? Math.round((data.win_rate / 100) * data.total_trades) : 0 },
    { name: 'Losses', value: data?.total_trades ? Math.round(((100 - data.win_rate) / 100) * data.total_trades) : 0 },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <>
      {/* P&L Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>P&L Over Time (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pnlData}>
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

      {/* Win/Loss Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Win/Loss Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Stats Bar Chart */}
      {winLossData.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Last 7 Days - Trades & P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={winLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_trades" fill="#3b82f6" name="Total Trades" />
                <Bar dataKey="wins" fill="#10b981" name="Wins" />
                <Bar dataKey="losses" fill="#ef4444" name="Losses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
}
