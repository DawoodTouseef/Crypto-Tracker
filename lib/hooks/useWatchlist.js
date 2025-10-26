'use client';

import { useState, useEffect } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    // Load watchlist from localStorage
    const saved = localStorage.getItem('crypto_watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading watchlist:', e);
      }
    }
  }, []);

  const addToWatchlist = (coinId) => {
    setWatchlist((prev) => {
      if (!prev.includes(coinId)) {
        const updated = [...prev, coinId];
        localStorage.setItem('crypto_watchlist', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const removeFromWatchlist = (coinId) => {
    setWatchlist((prev) => {
      const updated = prev.filter((id) => id !== coinId);
      localStorage.setItem('crypto_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWatchlist = (coinId) => {
    return watchlist.includes(coinId);
  };

  const toggleWatchlist = (coinId) => {
    if (isInWatchlist(coinId)) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };
}
