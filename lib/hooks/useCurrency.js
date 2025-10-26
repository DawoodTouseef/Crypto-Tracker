'use client';

import { useState, useEffect } from 'react';

const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  INR: 83.12,
  GBP: 0.79,
  JPY: 149.50,
  AUD: 1.52,
  CAD: 1.35,
  CHF: 0.88,
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'Fr',
};

export function useCurrency() {
  const [currency, setCurrency] = useState('USD');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('preferred_currency');
    if (saved && CURRENCY_RATES[saved]) {
      setCurrency(saved);
    }
  }, []);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    if (mounted) {
      localStorage.setItem('preferred_currency', newCurrency);
    }
  };

  const convertPrice = (priceInUSD) => {
    return priceInUSD * CURRENCY_RATES[currency];
  };

  const formatPrice = (priceInUSD, decimals = 2) => {
    const converted = convertPrice(priceInUSD);
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (converted < 0.01) {
      return `${symbol}${converted.toFixed(6)}`;
    }
    
    return `${symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  const formatLargeNumber = (num) => {
    const converted = convertPrice(num);
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (converted >= 1e12) return `${symbol}${(converted / 1e12).toFixed(2)}T`;
    if (converted >= 1e9) return `${symbol}${(converted / 1e9).toFixed(2)}B`;
    if (converted >= 1e6) return `${symbol}${(converted / 1e6).toFixed(2)}M`;
    if (converted >= 1e3) return `${symbol}${(converted / 1e3).toFixed(2)}K`;
    return `${symbol}${converted.toFixed(2)}`;
  };

  return {
    currency,
    changeCurrency,
    convertPrice,
    formatPrice,
    formatLargeNumber,
    currencySymbol: CURRENCY_SYMBOLS[currency],
    availableCurrencies: Object.keys(CURRENCY_RATES),
  };
}
