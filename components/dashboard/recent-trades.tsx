'use client';

import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { Trade } from '@/lib/types';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/formatting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function RecentTrades() {
  const { data, isLoading } = useQuery({
    queryKey: ['recentTrades'],
    queryFn: async () => {
      try {
        const response = await apiClient.getTrades(1, 5);
        return response.data;
      } catch (err) {
        toast.error('Failed to load trades');
        throw err;
      }
    },
  });

  const trades = data?.data || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Trades</CardTitle>
        <Link href="/journal" className="text-sm text-blue-600 hover:text-blue-700">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
        ) : trades.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No trades yet. Start by creating your first trade entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-2 font-medium text-slate-600">Symbol</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600">Side</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600">Entry</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-600">P&L</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade: Trade) => (
                  <tr key={trade.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-2 font-medium text-slate-900">{trade.symbol}</td>
                    <td className="py-3 px-2">
                      <Badge variant={trade.side === 'BUY' ? 'default' : 'secondary'}>
                        {trade.side}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-slate-600">{formatDate(trade.entry_date)}</td>
                    <td className="py-3 px-2">
                      <Badge variant={trade.status === 'OPEN' ? 'outline' : 'secondary'}>
                        {trade.status}
                      </Badge>
                    </td>
                    <td className={`py-3 px-2 text-right font-semibold ${
                      trade.pnl && trade.pnl > 0
                        ? 'text-green-600'
                        : trade.pnl && trade.pnl < 0
                        ? 'text-red-600'
                        : 'text-slate-600'
                    }`}>
                      {trade.pnl ? (
                        <>
                          {formatCurrency(trade.pnl)}
                          {trade.pnl_percent && (
                            <span className="text-xs text-slate-500 ml-1">
                              ({formatPercentage(trade.pnl_percent)})
                            </span>
                          )}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
