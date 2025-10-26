'use client';

import { useCurrency } from '@/lib/hooks/useCurrency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Euro, IndianRupee, Banknote } from 'lucide-react';
import { useViewMode } from '@/lib/hooks/useViewMode';

const CURRENCY_INFO = [
  { value: 'USD', label: 'US Dollar', icon: DollarSign, flag: '🇺🇸' },
  { value: 'EUR', label: 'Euro', icon: Euro, flag: '🇪🇺' },
  { value: 'GBP', label: 'British Pound', icon: Banknote, flag: '🇬🇧' },
  { value: 'JPY', label: 'Japanese Yen', icon: Banknote, flag: '🇯🇵' },
  { value: 'INR', label: 'Indian Rupee', icon: IndianRupee, flag: '🇮🇳' },
  { value: 'AUD', label: 'Australian Dollar', icon: Banknote, flag: '🇦🇺' },
  { value: 'CAD', label: 'Canadian Dollar', icon: Banknote, flag: '🇨🇦' },
  { value: 'CHF', label: 'Swiss Franc', icon: Banknote, flag: '🇨🇭' },
];

export default function SettingsView() {
  const { currency, changeCurrency } = useCurrency();
  const { viewMode, toggleViewMode } = useViewMode();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Customize your dashboard preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* View Mode */}
          <div className="space-y-2">
            <Label>Card View Mode</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Compact View</p>
                <p className="text-sm text-muted-foreground">
                  Show more coins with condensed information
                </p>
              </div>
              <Switch
                checked={viewMode === 'compact'}
                onCheckedChange={toggleViewMode}
              />
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label>Preferred Currency</Label>
            <Select value={currency} onValueChange={changeCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_INFO.map((curr) => {
                  const Icon = curr.icon;
                  return (
                    <SelectItem key={curr.value} value={curr.value}>
                      <div className="flex items-center gap-2">
                        <span>{curr.flag}</span>
                        <Icon className="h-4 w-4" />
                        {curr.label} ({curr.value})
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              All prices will be displayed in {currency}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium">2.5.0 - Enterprise Edition</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Data Source</span>
            <span className="font-medium">CoinGecko API</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Auto Refresh</span>
            <span className="font-medium">Every 60 seconds</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Features</span>
            <span className="font-medium">35+ Enhancements</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
