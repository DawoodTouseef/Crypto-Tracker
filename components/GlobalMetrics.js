'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { useCurrency } from '@/lib/hooks/useCurrency';

export default function GlobalMetrics({ data }) {
  const { formatLargeNumber } = useCurrency();

  if (!data) return null;

  const metrics = [
    {
      label: 'Total Market Cap',
      value: data.total_market_cap || 2850000000000,
      icon: DollarSign,
      change: data.market_cap_change_24h || 2.3,
    },
    {
      label: '24h Volume',
      value: data.total_volume || 125000000000,
      icon: Activity,
      change: data.volume_change_24h || -1.5,
    },
    {
      label: 'BTC Dominance',
      value: data.btc_dominance || 48.5,
      icon: TrendingUp,
      isPercentage: true,
      change: data.btc_dominance_change_24h || 0.8,
    },
    {
      label: 'ETH Dominance',
      value: data.eth_dominance || 17.2,
      icon: TrendingDown,
      isPercentage: true,
      change: data.eth_dominance_change_24h || -0.3,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = metric.change >= 0;
        const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
        const bgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {metric.label}
                    </span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${changeColor}`}>
                    {isPositive ? '+' : ''}{metric.change.toFixed(2)}%
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">
                    {metric.isPercentage 
                      ? `${metric.value.toFixed(2)}%`
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
