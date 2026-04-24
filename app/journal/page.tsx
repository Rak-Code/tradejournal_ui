'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { Trade } from '@/lib/types';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/formatting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradeForm } from '@/components/journal/trade-form';
import { TradeDetailsModal } from '@/components/journal/trade-details-modal';
import { Plus } from 'lucide-react';

export default function JournalPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['trades', page],
    queryFn: async () => {
      try {
        const response = await apiClient.getTrades(page, 10);
        return response.data;
      } catch (err) {
        toast.error('Failed to load trades');
        throw err;
      }
    },
  });

  const trades = data?.data || [];
  const totalPages = data?.total_pages || 1;

  return (
    <div className="space-y-6 pt-20 px-6 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Trading Journal</h1>
          <p className="text-slate-600">Manage and track your trades</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Trade
        </Button>
      </div>

      {/* Trade Form Modal */}
      {showForm && (
        <TradeForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            refetch();
          }}
        />
      )}

      {/* Trade Details Modal */}
      {selectedTrade && (
        <TradeDetailsModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onSuccess={() => {
            setSelectedTrade(null);
            refetch();
          }}
        />
      )}

      {/* Trades Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-200 rounded animate-pulse" />
              ))}
            </div>
          ) : trades.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="mb-4">No trades yet</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Trade
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Symbol</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Side</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Entry Date</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Entry Price</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Quantity</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Exit Date</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Exit Price</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-600">P&L</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade: Trade) => (
                    <tr
                      key={trade.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => setSelectedTrade(trade)}
                    >
                      <td className="py-3 px-2 font-medium text-slate-900">{trade.symbol}</td>
                      <td className="py-3 px-2">
                        <Badge variant={trade.side === 'BUY' ? 'default' : 'secondary'}>
                          {trade.side}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {formatDate(trade.entry_date)}
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-600">
                        ${trade.entry_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-slate-600">{trade.quantity}</td>
                      <td className="py-3 px-2 text-slate-600">
                        {trade.exit_date ? formatDate(trade.exit_date) : '-'}
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-600">
                        {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : '-'}
                      </td>
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
                      <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTrade(trade)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(Math.min(totalPages, page + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
