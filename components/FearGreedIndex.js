'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const getFearGreedData = () => {
  // Mock Fear & Greed Index (0-100)
  // In production, fetch from Alternative.me API
  const value = 65; // Current value
  
  let label = 'Neutral';
  let color = 'text-gray-500';
  let bgColor = 'bg-gray-500';
  let Icon = Minus;
  
  if (value >= 75) {
    label = 'Extreme Greed';
    color = 'text-green-600';
    bgColor = 'bg-green-500';
    Icon = TrendingUp;
  } else if (value >= 55) {
    label = 'Greed';
    color = 'text-green-500';
    bgColor = 'bg-green-400';
    Icon = TrendingUp;
  } else if (value >= 45) {
    label = 'Neutral';
    color = 'text-gray-500';
    bgColor = 'bg-gray-400';
    Icon = Minus;
  } else if (value >= 25) {
    label = 'Fear';
    color = 'text-red-500';
    bgColor = 'bg-red-400';
    Icon = TrendingDown;
  } else {
    label = 'Extreme Fear';
    color = 'text-red-600';
    bgColor = 'bg-red-500';
    Icon = TrendingDown;
  }
  
  return { value, label, color, bgColor, Icon };
};

export default function FearGreedIndex() {
  const { value, label, color, bgColor, Icon } = getFearGreedData();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Fear & Greed Index</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{value}</p>
              <div className="flex items-center gap-2 mt-1">
                <Icon className={`h-4 w-4 ${color}`} />
                <p className={`text-sm font-semibold ${color}`}>{label}</p>
              </div>
            </div>
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(value / 100) * 251.2} 251.2`}
                  className={color}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Extreme Fear</span>
              <span>Extreme Greed</span>
            </div>
            <Progress value={value} className="h-2" />
          </div>
          
          <p className="text-xs text-muted-foreground">
            The Fear & Greed Index measures market sentiment on a scale of 0-100.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
