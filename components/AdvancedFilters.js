'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';

export default function AdvancedFilters({ onFilterChange, onReset }) {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    marketCapMin: '',
    marketCapMax: '',
    volumeMin: '',
    change24hMin: '',
    change24hMax: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleReset = () => {
    const emptyFilters = {
      priceMin: '',
      priceMax: '',
      marketCapMin: '',
      marketCapMax: '',
      volumeMin: '',
      change24hMin: '',
      change24hMax: '',
    };
    setFilters(emptyFilters);
    if (onReset) {
      onReset();
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4"
      >
        <Filter className="h-4 w-4 mr-2" />
        Advanced Filters
        {activeFiltersCount > 0 && (
          <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filter Cryptocurrencies</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <X className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Price Range (USD)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    />
                  </div>
                </div>

                {/* Market Cap Range */}
                <div className="space-y-2">
                  <Label>Market Cap (USD)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.marketCapMin}
                      onChange={(e) => handleFilterChange('marketCapMin', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.marketCapMax}
                      onChange={(e) => handleFilterChange('marketCapMax', e.target.value)}
                    />
                  </div>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <Label>24h Volume (Min)</Label>
                  <Input
                    type="number"
                    placeholder="Minimum volume"
                    value={filters.volumeMin}
                    onChange={(e) => handleFilterChange('volumeMin', e.target.value)}
                  />
                </div>

                {/* 24h Change Range */}
                <div className="space-y-2">
                  <Label>24h Change (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min %"
                      value={filters.change24hMin}
                      onChange={(e) => handleFilterChange('change24hMin', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max %"
                      value={filters.change24hMax}
                      onChange={(e) => handleFilterChange('change24hMax', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
