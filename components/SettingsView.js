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
import { DollarSign, Euro, IndianRupee } from 'lucide-react';

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar', icon: DollarSign },
  { value: 'EUR', label: 'Euro', icon: Euro },
  { value: 'INR', label: 'Indian Rupee', icon: IndianRupee },
];

export default function SettingsView() {
  const { currency, changeCurrency } = useCurrency();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Customize your dashboard preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Currency Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Currency</Label>
            <Select value={currency} onValueChange={changeCurrency}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => {
                  const Icon = curr.icon;
                  return (
                    <SelectItem key={curr.value} value={curr.value}>
                      <div className="flex items-center gap-2">
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
            <span className="font-medium">2.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Data Source</span>
            <span className="font-medium">CoinGecko API</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Auto Refresh</span>
            <span className="font-medium">Every 60 seconds</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
