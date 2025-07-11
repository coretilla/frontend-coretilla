"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BalanceCard from "@/components/balance-card";
import PageWrapper from "@/components/layout/PageWrapper";
import { DollarSign, TrendingUp, Zap, BarChart3, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7D");

  // Mock balance data
  const balances = {
    fiat: {
      USD: { amount: "0.00", change: { value: 0, percentage: 0, period: "7D" } },
      IDR: { amount: "0", change: { value: 0, percentage: 0, period: "7D" } },
      EUR: { amount: "0.00", change: { value: 0, percentage: 0, period: "7D" } },
    },
    crypto: {
      BTC: { amount: "0.00000000", change: { value: 0, percentage: 0, period: "7D" } },
      lstBTC: { amount: "0.00000000", change: { value: 0, percentage: 0, period: "7D" } },
      istBTC: { amount: "0.00000000", change: { value: 0, percentage: 0, period: "7D" } },
    },
    mockAssets: {
      mockUSDT: { amount: "0.00", change: { value: 0, percentage: 0, period: "7D" } },
      mockETH: { amount: "0.00000000", change: { value: 0, percentage: 0, period: "7D" } },
    }
  };

  // Mock chart data
  const chartData = {
    "7D": [
      { day: "Mon", value: 0 },
      { day: "Tue", value: 0 },
      { day: "Wed", value: 0 },
      { day: "Thu", value: 0 },
      { day: "Fri", value: 0 },
      { day: "Sat", value: 0 },
      { day: "Sun", value: 0 },
    ],
    "1M": [
      { day: "Week 1", value: 0 },
      { day: "Week 2", value: 0 },
      { day: "Week 3", value: 0 },
      { day: "Week 4", value: 0 },
    ],
    "All": [
      { day: "Jan", value: 0 },
      { day: "Feb", value: 0 },
      { day: "Mar", value: 0 },
      { day: "Apr", value: 0 },
      { day: "May", value: 0 },
      { day: "Jun", value: 0 },
      { day: "Jul", value: 0 },
    ],
  };

  const totalPortfolioValue = 0; // USD
  const totalChange = { value: 0, percentage: 0 };

  return (
    <PageWrapper 
      title="Portfolio Dashboard"
      subtitle="Track your fiat and crypto balances with detailed analytics"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-6xl mx-auto">

        {/* Total Portfolio Value */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-bold font-mono text-foreground">
                  ${totalPortfolioValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-mono">${totalChange.value.toFixed(2)}</span>
                  <span>({totalChange.percentage}%)</span>
                  <span className="text-muted-foreground">7D</span>
                </div>
              </div>
              <div className="flex gap-2">
                {["7D", "1M", "All"].map((period) => (
                  <Badge
                    key={period}
                    variant={selectedPeriod === period ? "default" : "secondary"}
                    className="cursor-pointer font-sans"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mock Chart */}
            <div className="h-48 bg-muted rounded-lg flex items-end justify-center gap-2 p-4">
              {chartData[selectedPeriod as keyof typeof chartData].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="bg-primary rounded-t-sm w-8 transition-all duration-300"
                    style={{ height: `${(item.value / 10000) * 100}%` }}
                  />
                  <div className="text-xs text-muted-foreground font-sans">{item.day}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Balance Categories */}
        <Tabs defaultValue="fiat" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fiat" className="font-sans">Fiat Currency</TabsTrigger>
            <TabsTrigger value="crypto" className="font-sans">Crypto Assets</TabsTrigger>
            <TabsTrigger value="mock" className="font-sans">Mock Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="fiat" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BalanceCard
                title="US Dollar"
                amount={balances.fiat.USD.amount}
                symbol="$"
                change={balances.fiat.USD.change}
                icon={<DollarSign className="h-5 w-5 text-green-600" />}
              />
              <BalanceCard
                title="Indonesian Rupiah"
                amount={balances.fiat.IDR.amount}
                symbol="Rp"
                change={balances.fiat.IDR.change}
                icon={<DollarSign className="h-5 w-5 text-green-600" />}
              />
              <BalanceCard
                title="Euro"
                amount={balances.fiat.EUR.amount}
                symbol="€"
                change={balances.fiat.EUR.change}
                icon={<DollarSign className="h-5 w-5 text-green-600" />}
              />
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BalanceCard
                title="Bitcoin"
                amount={balances.crypto.BTC.amount}
                symbol=""
                change={balances.crypto.BTC.change}
                icon={<Image src="/image/btcLogo.png" alt="Bitcoin" width={20} height={20} className="object-contain" />}
              />
              <BalanceCard
                title="Liquid Staking BTC"
                amount={balances.crypto.lstBTC.amount}
                symbol=""
                change={balances.crypto.lstBTC.change}
                icon={<TrendingUp className="h-5 w-5 text-primary" />}
              />
              <BalanceCard
                title="Interest BTC"
                amount={balances.crypto.istBTC.amount}
                symbol=""
                change={balances.crypto.istBTC.change}
                icon={<Zap className="h-5 w-5 text-green-500" />}
              />
            </div>
          </TabsContent>

          <TabsContent value="mock" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BalanceCard
                title="Mock USDT"
                amount={balances.mockAssets.mockUSDT.amount}
                symbol="$"
                change={balances.mockAssets.mockUSDT.change}
                icon={<DollarSign className="h-5 w-5 text-green-600" />}
              />
              <BalanceCard
                title="Mock Ethereum"
                amount={balances.mockAssets.mockETH.amount}
                symbol=""
                change={balances.mockAssets.mockETH.change}
                icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sans">Quick Actions</CardTitle>
            <CardDescription className="font-sans">
              Manage your portfolio with these quick actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/deposit" className="p-4 border rounded-lg hover:border-primary transition-colors text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-medium font-sans">Deposit</div>
                <div className="text-sm text-muted-foreground font-sans">Add funds</div>
              </Link>
              <Link href="/swap" className="p-4 border rounded-lg hover:border-primary transition-colors text-center">
                <Image src="/image/btcLogo.png" alt="Bitcoin" width={32} height={32} className="object-contain mx-auto mb-2" />
                <div className="font-medium font-sans">Swap</div>
                <div className="text-sm text-muted-foreground font-sans">Trade assets</div>
              </Link>
              <Link href="/stake" className="p-4 border rounded-lg hover:border-primary transition-colors text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-medium font-sans">Stake</div>
                <div className="text-sm text-muted-foreground font-sans">Earn rewards</div>
              </Link>
              <Link href="/dca" className="p-4 border rounded-lg hover:border-primary transition-colors text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-medium font-sans">DCA</div>
                <div className="text-sm text-muted-foreground font-sans">Auto invest</div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}