'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Flame } from 'lucide-react';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { cn } from '@/lib/utils';

export default function EnhancedGlobalMetrics() {
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formatLargeNumber } = useCurrency();

  useEffect(() => {
    async function fetchGlobalData() {
      try {
        const response = await fetch('/api/crypto/global');
        if (response.ok) {
          const data = await response.json();
          setGlobalData(data);
        }
      } catch (error) {
        console.error('Error fetching global data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGlobalData();
    const interval = setInterval(fetchGlobalData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !globalData) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Market Cap',
      value: globalData.total_market_cap || 2850000000000,
      change: globalData.market_cap_change_24h || 2.3,
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: '24h Volume',
      value: globalData.total_volume || 125000000000,
      change: globalData.volume_change_24h || -1.5,
      icon: Activity,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      label: 'BTC Dominance',
      value: globalData.btc_dominance || 48.5,
      change: globalData.btc_dominance_change || 0.8,
      icon: BarChart3,
      gradient: 'from-orange-500 to-red-500',
      isPercentage: true,
    },
    {
      label: 'Active Cryptos',
      value: globalData.active_cryptocurrencies || 13500,
      icon: Flame,
      gradient: 'from-green-500 to-emerald-500',
      isCount: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const hasChange = metric.change !== undefined;
        const isPositive = hasChange && metric.change >= 0;
        const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
        const bgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'p-2 rounded-lg bg-gradient-to-br',
                      metric.gradient
                    )}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {metric.label}
                    </span>
                  </div>
                  {hasChange && (
                    <div className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1',
                      bgColor,
                      changeColor
                    )}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {isPositive ? '+' : ''}{metric.change.toFixed(2)}%
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {metric.isPercentage
                      ? `${metric.value.toFixed(2)}%`
                      : metric.isCount
                      ? metric.value.toLocaleString()
                      : formatLargeNumber(metric.value)
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
