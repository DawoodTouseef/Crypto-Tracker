'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Flame, Star } from 'lucide-react';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { cn } from '@/lib/utils';

export default function TrendingCoins() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { formatPrice, formatLargeNumber } = useCurrency();

  useEffect(() => {
    async function fetchTrending() {
      try {
        const response = await fetch('/api/crypto/trending');
        if (response.ok) {
          const data = await response.json();
          setTrending(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (trending.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-card to-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
            Trending Now
            <Badge variant="secondary" className="ml-auto">
              Hot 🔥
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trending.slice(0, 7).map((coin, index) => {
              const isPositive = (coin.price_change_percentage_24h || 0) >= 0;
              const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

              return (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => router.push(`/coin/${coin.id}`)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm font-bold text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="h-6 w-6 rounded-full"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24"%3E%3Crect width="24" height="24" fill="%23ddd"/%3E%3C/svg%3E';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {coin.name}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {formatPrice(coin.current_price)}
                    </p>
                    {coin.price_change_percentage_24h !== undefined && (
                      <div className="flex items-center gap-1 justify-end">
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={cn('text-xs font-semibold', changeColor)}>
                          {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
