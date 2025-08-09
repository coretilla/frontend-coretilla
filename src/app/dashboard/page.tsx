"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BalanceCard from "@/components/balance-card";
import PageWrapper from "@/components/layout/PageWrapper";
import { DollarSign, TrendingUp, Zap, BarChart3, Calendar, RefreshCw, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserData, parseUserBalance, UserBalance, getBtcPrice, BtcPriceResponse } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function AssetCard({
  title,
  icon,
  logoSrc,
  amountText,
  usdValueText,
  priceText,
  priceTooltip,
  delay = 0.1,
}: {
  title: string;
  icon?: React.ReactNode;
  logoSrc?: string;
  amountText: string;
  usdValueText?: string;
  priceText?: string;
  priceTooltip?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-all hover:border-primary/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-sans flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </span>
            {title}
          </CardTitle>
          {logoSrc && (
            <Image
              src={logoSrc}
              alt={title}
              width={28}
              height={28}
              className="object-contain"
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono tracking-tight">
            {amountText}
          </div>

          {(usdValueText || priceText) && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground font-sans">
                {usdValueText ?? "\u00A0"}
              </p>

              {priceText ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground font-mono cursor-help">
                        {priceText}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      {priceTooltip ?? "Latest price"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-xs text-muted-foreground font-mono">&nbsp;</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { isAuthenticated, signIn, isAuthenticating, error: authError } = useAuth();
  const { isConnected } = useWallet();
  const [selectedPeriod, setSelectedPeriod] = useState("7D");
  const [balanceData, setBalanceData] = useState<UserBalance>({ USD: 0 });
  const [apiData, setApiData] = useState<any>(null);
  const [btcPriceData, setBtcPriceData] = useState<BtcPriceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data from API
  const fetchUserData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      // Fetch user data and BTC price in parallel
      const [userData, btcPrice] = await Promise.all([
        getUserData(),
        getBtcPrice()
      ]);
      
      const balances = parseUserBalance(userData);
      setBalanceData(balances);
      setApiData(userData);
      setBtcPriceData(btcPrice);
      
      console.log('✅ Dashboard data loaded:', { 
        userData, 
        btcPriceResponse: btcPrice,
        btcPriceValue: btcPrice.data?.price 
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  // Calculate derived values
  const wbtcBalance = apiData?.wbtcBalance || 0;
  const coreBalance = apiData?.coreBalance || 0;
  const wbtcBalanceInUsd = apiData?.wbtcBalanceInUsd || 0;
  const coreBalanceInUsd = apiData?.coreBalanceInUsd || 0;
  const totalAssetInUsd = apiData?.totalAssetInUsd || 0;
  const corePrice = coreBalance > 0 ? coreBalanceInUsd / coreBalance : 1.2; // fallback price
  const btcPrice = btcPriceData?.data?.price || 0; // Get BTC price from API

  // Balance data structure
  const balances = {
    fiat: {
      USD: { 
        amount: balanceData.USD?.toFixed(2) || "0.00", 
        change: { value: 0, percentage: 0, period: "7D" } 
      },
    },
    crypto: {
      BTC: { 
        amount: wbtcBalance.toFixed(8), 
        change: { value: 0, percentage: 0, period: "7D" },
        price: btcPrice,
        usdValue: wbtcBalanceInUsd
      },
      CORE: { 
        amount: coreBalance.toFixed(2), 
        change: { value: 0, percentage: 0, period: "7D" },
        price: corePrice,
        usdValue: coreBalanceInUsd
      },
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

  const totalPortfolioValue = totalAssetInUsd; // USD from API
  const totalChange = { value: 0, percentage: 0 };

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return (
      <PageWrapper 
        title="Portfolio Dashboard"
        subtitle="Connect your wallet to view your portfolio analytics."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Connect Wallet Required</CardTitle>
              <CardDescription className="font-sans">
                Please connect your wallet to access your portfolio dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ConnectWallet 
                variant="default" 
                size="lg" 
                className="w-full max-w-sm mx-auto" 
              />
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  You need to connect your wallet first to view your portfolio.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  // Show loading or auth required state
  if (!isAuthenticated) {
    return (
      <PageWrapper 
        title="Portfolio Dashboard"
        subtitle="Please sign in to view your portfolio"
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Authentication Required</CardTitle>
              <CardDescription className="font-sans">
                Please sign in with your wallet to view your portfolio dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="font-sans text-red-600">
                    {authError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={signIn}
                disabled={isAuthenticating}
                className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold"
              >
                {isAuthenticating ? "Signing in..." : "Sign in with Wallet"}
              </Button>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  You'll be asked to sign a message with your wallet to authenticate.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

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
            <div className="flex items-center justify-between">
              <CardTitle className="font-sans flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Total Portfolio Value
              </CardTitle>
              <Button
                onClick={fetchUserData}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="font-sans"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-bold font-mono text-foreground">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-8 w-8 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    `$${totalPortfolioValue.toLocaleString()}`
                  )}
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

        {/* Combined Asset Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {/* USD */}
          <AssetCard
            title="US Dollar Balance"
            icon={<DollarSign className="h-4 w-4" />}
            amountText={`$${balances.fiat.USD.amount}`}
            usdValueText="Available balance"
            delay={0.1}
          />

          {/* BTC */}
          <AssetCard
            title="Bitcoin"
            logoSrc="/image/btcLogo.png"
            icon={<Bitcoin className="h-4 w-4" />}
            amountText={balances.crypto.BTC.amount}
            usdValueText={`$${balances.crypto.BTC.usdValue.toLocaleString()}`}
            priceText={
              balances.crypto.BTC.price > 0
                ? `$${Math.floor(balances.crypto.BTC.price).toLocaleString()}/BTC`
                : "Loading..."
            }
            priceTooltip="Spot price (approx.)"
            delay={0.2}
          />

          {/* CORE */}
          <AssetCard
            title="Core Balance"
            logoSrc="/image/coreDaoLogo.png"
            icon={<TrendingUp className="h-4 w-4" />}
            amountText={balances.crypto.CORE.amount}
            usdValueText={`$${balances.crypto.CORE.usdValue.toLocaleString()}`}
            priceText={`$${balances.crypto.CORE.price.toFixed(2)}/CORE`}
            priceTooltip="Estimated price"
            delay={0.3}
          />
        </div>

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
                <div className="text-sm text-muted-foreground font-sans">DCA Simulation</div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}