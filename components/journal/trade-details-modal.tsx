'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { Trade } from '@/lib/types';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/formatting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradeForm } from './trade-form';
import { X, Edit, Trash2 } from 'lucide-react';

interface TradeDetailsModalProps {
  trade: Trade;
  onClose: () => void;
  onSuccess: () => void;
}

export function TradeDetailsModal({ trade, onClose, onSuccess }: TradeDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trade?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.deleteTrade(trade.id);
      toast.success('Trade deleted successfully');
      onClose();
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete trade';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <TradeForm
        initialData={trade}
        onClose={() => setIsEditing(false)}
        onSuccess={() => {
          setIsEditing(false);
          onSuccess();
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle>{trade.symbol}</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                {formatDate(trade.entry_date)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Trade Image */}
          {trade.image_url && (
            <div className="w-full">
              <img
                src={trade.image_url}
                alt="Trade"
                className="w-full h-64 object-cover rounded-lg border border-slate-200"
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600">Side</p>
              <Badge variant={trade.side === 'BUY' ? 'default' : 'secondary'} className="mt-2">
                {trade.side}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <Badge variant={trade.status === 'OPEN' ? 'outline' : 'secondary'} className="mt-2">
                {trade.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-slate-600">Quantity</p>
              <p className="font-semibold mt-2">{trade.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Entry Price</p>
              <p className="font-semibold mt-2">${trade.entry_price.toFixed(2)}</p>
            </div>
          </div>

          {/* Entry Details */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Entry Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Date</p>
                <p className="font-medium text-slate-900">{formatDate(trade.entry_date)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Price</p>
                <p className="font-medium text-slate-900">
                  ${trade.entry_price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Exit Details (if closed) */}
          {trade.status === 'CLOSED' && trade.exit_date && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Exit Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Date</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(trade.exit_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Price</p>
                  <p className="font-medium text-slate-900">
                    ${trade.exit_price?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* P&L Summary */}
          {trade.pnl !== undefined && (
            <div className={`rounded-lg p-4 ${
              trade.pnl > 0
                ? 'bg-green-50 border border-green-200'
                : trade.pnl < 0
                ? 'bg-red-50 border border-red-200'
                : 'bg-slate-50 border border-slate-200'
            }`}>
              <h3 className="font-semibold text-slate-900 mb-3">P&L Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Total P&L</p>
                  <p className={`text-xl font-bold ${
                    trade.pnl > 0
                      ? 'text-green-600'
                      : trade.pnl < 0
                      ? 'text-red-600'
                      : 'text-slate-900'
                  }`}>
                    {formatCurrency(trade.pnl)}
                  </p>
                </div>
                {trade.pnl_percent !== undefined && (
                  <div>
                    <p className="text-sm text-slate-600">Percentage</p>
                    <p className={`text-xl font-bold ${
                      trade.pnl_percent > 0
                        ? 'text-green-600'
                        : trade.pnl_percent < 0
                        ? 'text-red-600'
                        : 'text-slate-900'
                    }`}>
                      {formatPercentage(trade.pnl_percent)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {trade.notes && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
              <p className="text-slate-700">{trade.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
