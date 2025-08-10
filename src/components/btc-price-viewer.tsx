"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import Image from "next/image";

interface BTCPriceData {
  price: number;
  change24h: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  lastUpdate: string;
}

export default function BTCPriceViewer() {
  const [priceData, setPriceData] = useState<BTCPriceData>({
    price: 47234.56,
    change24h: 2891.23,
    changePercent: 6.52,
    high24h: 48150.0,
    low24h: 45200.0,
    volume: 28.5,
    lastUpdate: new Date().toLocaleTimeString(),
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData((prev) => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 500,
        change24h: prev.change24h + (Math.random() - 0.5) * 100,
        changePercent: prev.changePercent + (Math.random() - 0.5) * 0.5,
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshPrice = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setPriceData((prev) => ({
        ...prev,
        price: 47234.56 + (Math.random() - 0.5) * 2000,
        change24h: 2891.23 + (Math.random() - 0.5) * 1000,
        changePercent: 6.52 + (Math.random() - 0.5) * 2,
        lastUpdate: new Date().toLocaleTimeString(),
      }));
      setIsLoading(false);
    }, 1000);
  };

  const isPositive = priceData.change24h > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 font-sans">
          <div className="flex items-center gap-2">
            <Image
              src="/image/btcLogo.png"
              alt="Bitcoin"
              width={16}
              height={16}
              className="object-contain"
            />
            <div className="text-right">
              <div className="text-sm font-mono font-semibold">
                ${priceData.price.toLocaleString()}
              </div>
              <div
                className={`text-xs font-mono ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}
                {priceData.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/image/btcLogo.png"
                    alt="Bitcoin"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span className="font-semibold font-sans">Bitcoin Price</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshPrice}
                  disabled={isLoading}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-foreground">
                  ${priceData.price.toLocaleString()}
                </div>
                <div
                  className={`flex items-center justify-center gap-1 text-sm font-mono ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}$
                    {Math.abs(priceData.change24h).toFixed(2)}
                  </span>
                  <span>
                    ({isPositive ? "+" : ""}
                    {priceData.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground font-sans">
                    24h High
                  </div>
                  <div className="font-mono font-semibold">
                    ${priceData.high24h.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground font-sans">
                    24h Low
                  </div>
                  <div className="font-mono font-semibold">
                    ${priceData.low24h.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-sans">
                    24h Volume:
                  </span>
                  <span className="font-mono font-semibold">
                    {priceData.volume.toFixed(1)}B
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-sans">
                    Last Update:
                  </span>
                  <span className="font-mono">{priceData.lastUpdate}</span>
                </div>
              </div>

              <div className="h-16 bg-muted rounded-lg flex items-end justify-center gap-1 p-2">
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 rounded-t-sm ${
                      isPositive ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                      opacity: 0.3 + (i / 24) * 0.7,
                    }}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground text-center font-sans">
                24h price movement
              </div>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
