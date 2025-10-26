import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// In-memory cache for API responses
const cache = new Map();
const CACHE_DURATION = 300000; // 5 minutes (extended to reduce API calls)

// Load mock data
async function loadMockData() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'mockCrypto.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error loading mock data:', error);
    return null;
  }
}

// Load mock coin details
async function loadMockCoinDetails() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'mockCoinDetails.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error loading mock coin details:', error);
    return null;
  }
}

// Demo/fallback data for when API is rate-limited
const DEMO_DATA = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 67234.50,
    market_cap: 1324567890123,
    total_volume: 28456789012,
    price_change_percentage_24h: 2.45,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3456.78,
    market_cap: 415678901234,
    total_volume: 15678901234,
    price_change_percentage_24h: 1.23,
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 589.45,
    market_cap: 87654321098,
    total_volume: 1234567890,
    price_change_percentage_24h: -0.85,
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 145.67,
    market_cap: 65432109876,
    total_volume: 2345678901,
    price_change_percentage_24h: 5.67,
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    current_price: 0.5234,
    market_cap: 28765432109,
    total_volume: 987654321,
    price_change_percentage_24h: -1.23,
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.4567,
    market_cap: 16234567890,
    total_volume: 456789012,
    price_change_percentage_24h: 3.45,
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.0834,
    market_cap: 12098765432,
    total_volume: 678901234,
    price_change_percentage_24h: 8.90,
  },
  {
    id: 'tron',
    symbol: 'trx',
    name: 'TRON',
    image: 'https://coin-images.coingecko.com/coins/images/1094/large/tron-logo.png',
    current_price: 0.1234,
    market_cap: 10876543210,
    total_volume: 345678901,
    price_change_percentage_24h: -2.34,
  },
  {
    id: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    image: 'https://coin-images.coingecko.com/coins/images/12171/large/polkadot.png',
    current_price: 7.89,
    market_cap: 9876543210,
    total_volume: 234567890,
    price_change_percentage_24h: 1.56,
  },
  {
    id: 'polygon',
    symbol: 'matic',
    name: 'Polygon',
    image: 'https://coin-images.coingecko.com/coins/images/4713/large/polygon.png',
    current_price: 0.8765,
    market_cap: 8234567890,
    total_volume: 456789012,
    price_change_percentage_24h: -3.21,
  },
];

// Helper function to fetch with caching and retry logic
async function fetchWithCache(url, cacheKey, limit = 50) {
  const now = Date.now();
  const cached = cache.get(cacheKey);
  
  // Return cached data if available and fresh
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${cacheKey}`);
    return cached.data;
  }
  
  // Try to fetch from API
  try {
    console.log(`Fetching from API: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      // If rate limited or error, return stale cache if available
      if (cached) {
        console.warn(`API error (${response.status}), using stale cache for ${cacheKey}`);
        return cached.data;
      }
      
      // If no cache and API fails, use demo data
      if (response.status === 429) {
        console.warn('Rate limited, using demo data');
        return DEMO_DATA.slice(0, parseInt(limit));
      }
      
      throw new Error(`API request failed: ${response.statusText} (${response.status})`);
    }
    
    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: now });
    
    return data;
  } catch (error) {
    // If network error and we have stale cache, use it
    if (cached) {
      console.warn(`Network error, using stale cache for ${cacheKey}`);
      return cached.data;
    }
    
    // Last resort: use demo data
    console.warn('Using demo data due to error:', error.message);
    return DEMO_DATA.slice(0, parseInt(limit));
  }
}

export async function GET(request) {
  const { pathname, searchParams } = new URL(request.url);
  
  try {
    // Get crypto market data
    if (pathname.includes('/api/crypto/markets')) {
      const limit = searchParams.get('limit') || '50';
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
      
      try {
        const data = await fetchWithCache(url, `markets_${limit}`, limit);
        
        return NextResponse.json({ 
          data, 
          isLiveData: true,
          timestamp: new Date().toISOString()
        }, {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          },
        });
      } catch (error) {
        // Fallback to mock data
        console.warn('API failed, loading mock data:', error.message);
        const mockData = await loadMockData();
        
        if (mockData && mockData.coins) {
          const limitNum = parseInt(limit);
          return NextResponse.json({ 
            data: mockData.coins.slice(0, limitNum),
            isLiveData: false,
            isMockData: true,
            message: 'Live data temporarily unavailable. Showing mock data.',
            timestamp: new Date().toISOString()
          }, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
            },
          });
        }
        
        throw error;
      }
    }
    
    // Get crypto news
    if (pathname.includes('/api/crypto/news')) {
      const mockData = await loadMockData();
      
      if (mockData && mockData.news) {
        return NextResponse.json({ 
          data: mockData.news,
          timestamp: new Date().toISOString()
        }, {
          headers: {
            'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120',
          },
        });
      }
      
      return NextResponse.json({ data: [] });
    }
    
    // Get detailed coin information
    if (pathname.includes('/api/crypto/coin/')) {
      const coinId = pathname.split('/api/crypto/coin/')[1]?.split('?')[0];
      
      if (!coinId) {
        return NextResponse.json(
          { error: 'Coin ID is required' },
          { status: 400 }
        );
      }
      
      try {
        const cached = cache.get(`coin_${coinId}`);
        const now = Date.now();
        
        if (cached && now - cached.timestamp < CACHE_DURATION) {
          return NextResponse.json({ 
            ...cached.data,
            isLiveData: true
          }, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
            },
          });
        }
        
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=true&developer_data=true`;
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          cache.set(`coin_${coinId}`, { data, timestamp: now });
          
          return NextResponse.json({ 
            ...data,
            isLiveData: true
          }, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
            },
          });
        } else {
          // Fallback to mock data
          const mockDetails = await loadMockCoinDetails();
          if (mockDetails && mockDetails[coinId]) {
            return NextResponse.json({ 
              ...mockDetails[coinId],
              isLiveData: false,
              isMockData: true,
              message: 'Live data temporarily unavailable. Showing cached mock data.'
            }, {
              headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
              },
            });
          }
          
          throw new Error('Coin not found');
        }
      } catch (error) {
        console.error(`Error fetching coin details for ${coinId}:`, error);
        
        // Try mock data as last resort
        const mockDetails = await loadMockCoinDetails();
        if (mockDetails && mockDetails[coinId]) {
          return NextResponse.json({ 
            ...mockDetails[coinId],
            isLiveData: false,
            isMockData: true,
            message: 'Live data temporarily unavailable. Showing cached mock data.'
          }, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
            },
          });
        }
        
        return NextResponse.json(
          { error: 'Coin details not found' },
          { status: 404 }
        );
      }
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
      
      // Generate demo chart data if rate limited
      const generateDemoChartData = () => {
        const data = [];
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        const basePrice = Math.random() * 100 + 50;
        
        for (let i = 6; i >= 0; i--) {
          data.push({
            timestamp: now - i * dayMs,
            price: basePrice * (1 + (Math.random() - 0.5) * 0.1),
          });
        }
        return data;
      };
      
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`;
      
      try {
        const cached = cache.get(`chart_${coinId}`);
        const now = Date.now();
        
        if (cached && now - cached.timestamp < CACHE_DURATION) {
          return NextResponse.json(cached.data, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
            },
          });
        }
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const prices = data.prices.map(([timestamp, price]) => ({
            timestamp,
            price,
          }));
          
          cache.set(`chart_${coinId}`, { data: prices, timestamp: now });
          
          return NextResponse.json(prices, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
            },
          });
        } else {
          // Use demo data for charts
          const demoData = generateDemoChartData();
          return NextResponse.json(demoData, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
            },
          });
        }
      } catch (error) {
        // Return demo chart data on error
        const demoData = generateDemoChartData();
        return NextResponse.json(demoData, {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          },
        });
      }
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
