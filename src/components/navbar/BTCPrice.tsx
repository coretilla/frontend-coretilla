"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useBTCPrice } from "@/contexts/BTCPriceContext";

interface BTCPriceProps {
  className?: string;
  showDropdown?: boolean;
}

export default function BTCPrice({ className = "", showDropdown = true }: BTCPriceProps) {
  const { priceData, isLoading, error, refreshPrice } = useBTCPrice();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatChange = (change: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(change));
  };

  // Loading state
  if (isLoading && !priceData) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Image src="/image/btcLogo.png" alt="Bitcoin" width={16} height={16} className="object-contain" />
        <div className="flex flex-col items-end">
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-3 w-12 bg-muted animate-pulse rounded mt-1" />
        </div>
      </div>
    );
  }

  // Error state fallback
  if (error && !priceData) {
    return (
      <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
        <AlertCircle className="h-4 w-4" />
        <div className="text-sm font-mono">BTC: —</div>
      </div>
    );
  }

  if (!priceData) return null;

  const isPositive = priceData.changePercent > 0;

  const priceDisplay = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/image/btcLogo.png" alt="Bitcoin" width={40} height={40} className="object-contain" />
      <div className="text-right">
        <div className="text-sm font-mono font-semibold">
          {formatPrice(priceData.price)}
        </div>
        <div className={`text-xs font-mono ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{priceData.changePercent.toFixed(2)}%
        </div>
      </div>
      {isLoading && <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );

  if (!showDropdown) {
    return priceDisplay;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 font-sans">
          {priceDisplay}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src="/image/btcLogo.png" alt="Bitcoin" width={40} height={40} className="object-contain" />
                  <span className="font-semibold font-sans">Bitcoin Price</span>
                  <Badge variant="secondary" className="text-xs">Live</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshPrice}
                  disabled={isLoading}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    API Error: Using cached data
                  </span>
                </div>
              )}

              {/* Main Price */}
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {formatPrice(priceData.price)}
                </div>
                <div className={`flex items-center justify-center gap-1 text-sm font-mono ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {isPositive ? '+' : '-'}{formatChange(priceData.change24h)}
                  </span>
                  <span>
                    ({isPositive ? '+' : ''}{priceData.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Data Source */}
              <div className="text-center space-y-2">
                <div className="text-xs text-muted-foreground font-sans">
                  Data from CoinGecko • Updates every 60s
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  Last updated: {priceData.lastUpdate}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground font-sans">24h Change</div>
                  <div className={`font-mono font-semibold text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : '-'}{formatChange(priceData.change24h)}
                  </div>
                </div>
              </div>

              {/* API Status */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
                <span>{error ? 'API Error' : 'Live Data'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}