'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Search, TrendingUp, TrendingDown, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import CryptoCard from '@/components/CryptoCard';

export default function App() {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [limit, setLimit] = useState('50');
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch crypto data
  const fetchCryptos = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      
      const response = await fetch(`/api/crypto/markets?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }
      
      const data = await response.json();
      setCryptos(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cryptos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  // Initial fetch
  useEffect(() => {
    fetchCryptos();
  }, [fetchCryptos]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptos(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchCryptos]);

  // Filter and sort cryptos
  useEffect(() => {
    let result = [...cryptos];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price') {
        return b.current_price - a.current_price;
      } else if (sortBy === 'change') {
        return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
      } else {
        return b.market_cap - a.market_cap;
      }
    });

    setFilteredCryptos(result);
  }, [cryptos, searchQuery, sortBy]);

  // Manual refresh with debounce
  const handleManualRefresh = () => {
    if (!refreshing && !loading) {
      fetchCryptos(true);
    }
  };

  // Loading skeletons
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Crypto Price Tracker</h1>
                <p className="text-sm text-muted-foreground">Real-time cryptocurrency dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {lastRefresh && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
              {mounted && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market_cap">Market Cap</SelectItem>
              <SelectItem value="price">Price (High to Low)</SelectItem>
              <SelectItem value="change">24h Change</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="20">Top 20</SelectItem>
              <SelectItem value="50">Top 50</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-destructive">
                <TrendingDown className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Error loading data</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Crypto Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${sortBy}-${searchQuery}-${limit}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredCryptos.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No cryptocurrencies found</p>
                </div>
              ) : (
                filteredCryptos.map((crypto, index) => (
                  <motion.div
                    key={crypto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <CryptoCard crypto={crypto} />
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Data provided by CoinGecko API • Auto-refreshes every 60 seconds</p>
        </div>
      </footer>
    </div>
  );
}
