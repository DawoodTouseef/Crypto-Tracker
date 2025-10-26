'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Github,
  Twitter,
  Globe,
  FileText,
  AlertCircle,
  Calendar,
  Activity,
  Users,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { useTheme } from 'next-themes';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import { cn } from '@/lib/utils';

export default function CoinDetailPage() {
  const params = useParams();
  const router = useRouter();
  const coinId = params.id;
  
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMockData, setIsMockData] = useState(false);
  const [timeRange, setTimeRange] = useState('7');
  const { formatPrice, formatLargeNumber } = useCurrency();
  const { theme } = useTheme();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchCoinDetails() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/crypto/coin/${coinId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch coin details');
        }
        
        const data = await response.json();
        setCoinData(data);
        setIsMockData(data.isMockData || false);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching coin details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (coinId) {
      fetchCoinDetails();
    }
  }, [coinId]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch(`/api/crypto/chart/${coinId}`);
        
        if (response.ok) {
          const data = await response.json();
          setChartData(data);
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    }

    if (coinId) {
      fetchChartData();
    }
  }, [coinId, timeRange]);

  const getChartConfig = () => {
    if (!chartData || chartData.length === 0) return null;

    const isDark = theme === 'dark';
    const prices = chartData.map(item => item.price);
    const isPositive = prices[prices.length - 1] >= prices[0];

    return {
      data: {
        labels: chartData.map((_, i) => i),
        datasets: [
          {
            data: prices,
            borderColor: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
            backgroundColor: isPositive
              ? 'rgba(34, 197, 94, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            fill: true,
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: isDark ? '#fff' : '#000',
            bodyColor: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#374151' : '#e5e7eb',
            borderWidth: 1,
            callbacks: {
              label: (context) => formatPrice(context.parsed.y),
            },
          },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        elements: {
          point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
        },
      },
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-7xl">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-3/4 mb-4" />
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !coinData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Error loading coin details</p>
                  <p className="text-sm">{error || 'Coin not found'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const marketData = coinData.market_data || {};
  const currentPrice = marketData.current_price?.usd || 0;
  const priceChange24h = marketData.price_change_percentage_24h || 0;
  const isPositive = priceChange24h >= 0;
  const inWatchlist = mounted && isInWatchlist(coinId);

  const chartConfig = getChartConfig();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl p-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {isMockData && (
          <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              ⚠️ Live data temporarily unavailable. Showing cached mock data.
            </AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={coinData.image?.large || coinData.image}
                alt={coinData.name}
                className="h-16 w-16 rounded-full"
              />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{coinData.name}</h1>
                  <Badge variant="secondary" className="text-sm">
                    {coinData.symbol?.toUpperCase()}
                  </Badge>
                  {marketData.market_cap_rank && (
                    <Badge variant="outline">Rank #{marketData.market_cap_rank}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-3xl font-bold">
                    {formatPrice(currentPrice)}
                  </p>
                  <div
                    className={cn(
                      'flex items-center gap-1 px-3 py-1 rounded-full',
                      isPositive ? 'bg-green-500/10' : 'bg-red-500/10'
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={cn(
                        'font-semibold',
                        isPositive ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {isPositive ? '+' : ''}{priceChange24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {mounted && (
              <Button
                variant={inWatchlist ? 'default' : 'outline'}
                onClick={() => toggleWatchlist(coinId)}
                className="w-full md:w-auto"
              >
                <Star
                  className={cn(
                    'h-4 w-4 mr-2',
                    inWatchlist && 'fill-current'
                  )}
                />
                {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Price Chart</CardTitle>
                    <Tabs value={timeRange} onValueChange={setTimeRange}>
                      <TabsList>
                        <TabsTrigger value="1">24H</TabsTrigger>
                        <TabsTrigger value="7">7D</TabsTrigger>
                        <TabsTrigger value="30">30D</TabsTrigger>
                        <TabsTrigger value="365">1Y</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {chartConfig ? (
                      <Line data={chartConfig.data} options={chartConfig.options} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <Activity className="h-8 w-8 mr-2" />
                        Loading chart data...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {coinData.description?.en && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>About {coinData.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: coinData.description.en.split('. ').slice(0, 3).join('. ') + '.',
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {coinData.links?.homepage?.[0] && (
                      <a
                        href={coinData.links.homepage[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="text-sm font-medium">Website</span>
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    )}
                    {coinData.links?.repos_url?.github?.[0] && (
                      <a
                        href={coinData.links.repos_url.github[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span className="text-sm font-medium">GitHub</span>
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    )}
                    {coinData.links?.blockchain_site?.[0] && (
                      <a
                        href={coinData.links.blockchain_site[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                      >
                        <Activity className="h-4 w-4" />
                        <span className="text-sm font-medium">Explorer</span>
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    )}
                    {coinData.links?.whitepaper && (
                      <a
                        href={coinData.links.whitepaper}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">Whitepaper</span>
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Market Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Market Cap</span>
                    <span className="font-semibold">
                      {formatLargeNumber(marketData.market_cap?.usd || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">24h Volume</span>
                    <span className="font-semibold">
                      {formatLargeNumber(marketData.total_volume?.usd || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">24h High</span>
                    <span className="font-semibold">
                      {formatPrice(marketData.high_24h?.usd || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">24h Low</span>
                    <span className="font-semibold">
                      {formatPrice(marketData.low_24h?.usd || 0)}
                    </span>
                  </div>
                  {marketData.circulating_supply && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Circulating Supply</span>
                      <span className="font-semibold">
                        {marketData.circulating_supply.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {marketData.max_supply && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Supply</span>
                      <span className="font-semibold">
                        {marketData.max_supply.toLocaleString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marketData.ath?.usd && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">All-Time High</span>
                        <span className="font-semibold">{formatPrice(marketData.ath.usd)}</span>
                      </div>
                      {marketData.ath_date?.usd && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(marketData.ath_date.usd).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                  {marketData.atl?.usd && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">All-Time Low</span>
                        <span className="font-semibold">{formatPrice(marketData.atl.usd)}</span>
                      </div>
                      {marketData.atl_date?.usd && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(marketData.atl_date.usd).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                  {marketData.price_change_percentage_7d !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">7d Change</span>
                      <span
                        className={cn(
                          'font-semibold',
                          marketData.price_change_percentage_7d >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        )}
                      >
                        {marketData.price_change_percentage_7d >= 0 ? '+' : ''}
                        {marketData.price_change_percentage_7d.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {marketData.price_change_percentage_30d !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">30d Change</span>
                      <span
                        className={cn(
                          'font-semibold',
                          marketData.price_change_percentage_30d >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        )}
                      >
                        {marketData.price_change_percentage_30d >= 0 ? '+' : ''}
                        {marketData.price_change_percentage_30d.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {marketData.price_change_percentage_1y !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">1y Change</span>
                      <span
                        className={cn(
                          'font-semibold',
                          marketData.price_change_percentage_1y >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        )}
                      >
                        {marketData.price_change_percentage_1y >= 0 ? '+' : ''}
                        {marketData.price_change_percentage_1y.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {marketData.roi && (
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">ROI</span>
                        <span className="font-semibold text-green-500">
                          {marketData.roi.times?.toFixed(2)}x
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {marketData.roi.percentage?.toFixed(2)}% return
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {(coinData.community_data || coinData.developer_data) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Community & Development</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {coinData.community_data?.twitter_followers && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Twitter</span>
                        </div>
                        <span className="font-semibold">
                          {coinData.community_data.twitter_followers.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {coinData.community_data?.reddit_subscribers && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Reddit</span>
                        </div>
                        <span className="font-semibold">
                          {coinData.community_data.reddit_subscribers.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {coinData.developer_data?.stars && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">GitHub Stars</span>
                        </div>
                        <span className="font-semibold">
                          {coinData.developer_data.stars.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {coinData.developer_data?.forks && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">GitHub Forks</span>
                        </div>
                        <span className="font-semibold">
                          {coinData.developer_data.forks.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
