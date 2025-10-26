'use client';

import { useState, useEffect } from 'react';

const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  INR: 83.12,
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  INR: '₹',
};

export function useCurrency() {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    // Load saved currency from localStorage
    const saved = localStorage.getItem('preferred_currency');
    if (saved && CURRENCY_RATES[saved]) {
      setCurrency(saved);
    }
  }, []);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferred_currency', newCurrency);
  };

  const convertPrice = (priceInUSD) => {
    return priceInUSD * CURRENCY_RATES[currency];
  };

  const formatPrice = (priceInUSD) => {
    const converted = convertPrice(priceInUSD);
    const symbol = CURRENCY_SYMBOLS[currency];
    return `${symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return {
    currency,
    changeCurrency,
    convertPrice,
    formatPrice,
    currencySymbol: CURRENCY_SYMBOLS[currency],
  };
}
