'use client';

import { useState, useEffect } from 'react';

export function useViewMode() {
  const [viewMode, setViewMode] = useState('expanded'); // 'expanded' or 'compact'
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('view_mode');
    if (saved) {
      setViewMode(saved);
    }
  }, []);

  const toggleViewMode = () => {
    const newMode = viewMode === 'expanded' ? 'compact' : 'expanded';
    setViewMode(newMode);
    if (mounted) {
      localStorage.setItem('view_mode', newMode);
    }
  };

  const setMode = (mode) => {
    setViewMode(mode);
    if (mounted) {
      localStorage.setItem('view_mode', mode);
    }
  };

  return {
    viewMode,
    isCompact: viewMode === 'compact',
    isExpanded: viewMode === 'expanded',
    toggleViewMode,
    setMode,
  };
}
