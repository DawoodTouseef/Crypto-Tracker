import { NextResponse } from 'next/server';

// In-memory cache for API responses
const cache = new Map();
const CACHE_DURATION = 60000; // 60 seconds

// Helper function to fetch with caching
async function fetchWithCache(url, cacheKey) {
  const now = Date.now();
  const cached = cache.get(cacheKey);
  
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: now });
  
  return data;
}

export async function GET(request) {
  const { pathname, searchParams } = new URL(request.url);
  
  try {
    // Get crypto market data
    if (pathname.includes('/api/crypto/markets')) {
      const limit = searchParams.get('limit') || '50';
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
      
      const data = await fetchWithCache(url, `markets_${limit}`);
      
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      });
    }
    
    // Get 7-day chart data for a specific coin
    if (pathname.includes('/api/crypto/chart/')) {
      const coinId = pathname.split('/api/crypto/chart/')[1];
      
      if (!coinId) {
        return NextResponse.json(
          { error: 'Coin ID is required' },
          { status: 400 }
        );
      }
      
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`;
      
      const data = await fetchWithCache(url, `chart_${coinId}`);
      
      // Transform data for easier use
      const prices = data.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
      }));
      
      return NextResponse.json(prices, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      });
    }
    
    // Default response
    return NextResponse.json(
      { message: 'Crypto Price Tracker API' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
