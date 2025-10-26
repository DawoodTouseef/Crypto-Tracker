'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import { cn } from '@/lib/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function CryptoCardCompact({ crypto, onClick }) {
  const { formatPrice, formatLargeNumber, currency } = useCurrency();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [priceGlow, setPriceGlow] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setPriceGlow(true);
    const timer = setTimeout(() => setPriceGlow(false), 1000);
    return () => clearTimeout(timer);
  }, [crypto.current_price]);

  const isPositive = crypto.price_change_percentage_24h >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const bgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';
  const glowColor = isPositive ? 'shadow-green-500/30' : 'shadow-red-500/30';
  const inWatchlist = mounted && isInWatchlist(crypto.id);

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    toggleWatchlist(crypto.id);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          {/* Coin Info */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="h-8 w-8 rounded-full flex-shrink-0"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect width="32" height="32" fill="%23ddd"/%3E%3C/svg%3E';
              }}
            />
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{crypto.name}</p>
              <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
            </div>
          </div>

          {/* Price & Change */}
          <div className="text-right flex-shrink-0">
            <p
              className={cn(
                'font-bold text-sm transition-all duration-300',
                priceGlow && `shadow-md ${glowColor}`
              )}
            >
              {mounted ? formatPrice(crypto.current_price) : `$${crypto.current_price?.toLocaleString()}`}
            </p>
            <div className="flex items-center gap-1 justify-end mt-0.5">
              <div className={`px-1.5 py-0.5 rounded text-xs font-semibold ${bgColor} ${changeColor}`}>
                {isPositive ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Star */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0"
              onClick={handleWatchlistToggle}
            >
              <Star
                className={cn(
                  'h-3.5 w-3.5 transition-colors',
                  inWatchlist
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground hover:text-yellow-400'
                )}
              />
            </Button>
          )}
        </div>

        {/* Market Cap & Volume */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t text-xs">
          <div>
            <p className="text-muted-foreground">MCap</p>
            <p className="font-semibold">{formatLargeNumber(crypto.market_cap)}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Vol 24h</p>
            <p className="font-semibold">{formatLargeNumber(crypto.total_volume)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
