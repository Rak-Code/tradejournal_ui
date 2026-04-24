export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${(value).toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getPnLColor(value: number | undefined): string {
  if (!value) return 'text-gray-600';
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
}

export function getPnLBgColor(value: number | undefined): string {
  if (!value) return 'bg-gray-50';
  if (value > 0) return 'bg-green-50';
  if (value < 0) return 'bg-red-50';
  return 'bg-gray-50';
}

export function getTradeStatusColor(status: 'OPEN' | 'CLOSED'): string {
  return status === 'OPEN' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700';
}

export function getSideColor(side: 'BUY' | 'SELL'): string {
  return side === 'BUY' ? 'text-green-600' : 'text-red-600';
}

export function getSideBgColor(side: 'BUY' | 'SELL'): string {
  return side === 'BUY' ? 'bg-green-50' : 'bg-red-50';
}
