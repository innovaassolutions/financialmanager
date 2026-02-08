'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/format';

interface TokenTrackerProps {
  symbol: string;
  amount: number;
  label: string;
  apiSlug: string;
}

interface PriceData {
  price: number;
  percent_change_24h: number;
  last_updated: string;
}

export function TokenTracker({ symbol, amount, label, apiSlug }: TokenTrackerProps) {
  const [data, setData] = useState<PriceData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/token-price?slug=${encodeURIComponent(apiSlug)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [apiSlug]);

  const totalValue = data ? data.price * amount : 0;
  const changePositive = data ? data.percent_change_24h >= 0 : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{symbol} Token Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-12 animate-pulse rounded bg-muted" />
              <div className="h-12 animate-pulse rounded bg-muted" />
              <div className="h-12 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ) : error ? (
          <p className="text-sm text-muted-foreground">
            Unable to load token price. Please try again later.
          </p>
        ) : data ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tokens Held</p>
                <p className="font-medium">{amount.toLocaleString()} {symbol}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price per Token</p>
                <p className="font-medium">${data.price.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">24h Change</p>
                <p className={`font-medium ${changePositive ? 'text-green-600' : 'text-red-600'}`}>
                  {changePositive ? '+' : ''}{data.percent_change_24h.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
