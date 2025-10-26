'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function CryptoCard({ crypto }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch 7-day chart data
  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch(`/api/crypto/chart/${crypto.id}`);
        if (response.ok) {
          const data = await response.json();
          setChartData(data);
        }
      } catch (error) {
        console.error(`Error fetching chart for ${crypto.id}:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, [crypto.id]);

  const isPositive = crypto.price_change_percentage_24h >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const bgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  // Chart configuration
  const getChartOptions = () => {
    const isDark = theme === 'dark';
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: isDark ? '#fff' : '#000',
          bodyColor: isDark ? '#fff' : '#000',
          borderColor: isDark ? '#374151' : '#e5e7eb',
          borderWidth: 1,
          callbacks: {
            label: (context) => `$${context.parsed.y.toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
        },
        line: {
          tension: 0.4,
        },
      },
    };
  };

  const getChartData = () => {
    if (!chartData || chartData.length === 0) return null;

    return {
      labels: chartData.map((_, i) => i),
      datasets: [
        {
          data: chartData.map((item) => item.price),
          borderColor: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
          backgroundColor: isPositive
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(239, 68, 68, 0.1)',
          fill: true,
          borderWidth: 2,
        },
      ],
    };
  };

  const chartConfig = getChartData();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="h-10 w-10 rounded-full"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23ddd"/%3E%3C/svg%3E';
              }}
            />
            <div>
              <CardTitle className="text-lg font-bold">{crypto.name}</CardTitle>
              <p className="text-sm text-muted-foreground uppercase">
                {crypto.symbol}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${bgColor}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-semibold ${changeColor}`}>
              {crypto.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price */}
        <div>
          <p className="text-3xl font-bold">
            ${crypto.current_price?.toLocaleString()}
          </p>
        </div>

        {/* Chart */}
        <div className="h-32 w-full">
          {loading ? (
            <div className="h-full w-full bg-muted/50 animate-pulse rounded" />
          ) : chartConfig && mounted ? (
            <Line data={chartConfig} options={getChartOptions()} />
          ) : (
            <div className="h-full w-full bg-muted/50 rounded flex items-center justify-center text-xs text-muted-foreground">
              No chart data
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
            <p className="text-sm font-semibold">
              {formatNumber(crypto.market_cap)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
            <p className="text-sm font-semibold">
              {formatNumber(crypto.total_volume)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
