"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, TrendingUp, Clock, DollarSign, Repeat } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getBtcPrice, getUserData, parseUserBalance } from "@/lib/api";
import { formatToken } from "@/hooks/useFormatToken";
import { DCAData, SimulationResult } from "../types/dca-types";
import { UserBalance } from "../types/api-types";

export default function DCAPage() {
  const { isConnected } = useWallet();
  const {
    isAuthenticated,
    signIn,
    isAuthenticating,
    error: authError,
  } = useAuth();

  const [dcaData, setDcaData] = useState<DCAData>({
    fiatSource: "",
    amount: "",
    frequency: "",
    duration: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [simulationResults, setSimulationResults] = useState<
    SimulationResult[]
  >([]);
  const [currentBtcPrice, setCurrentBtcPrice] = useState(47000);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [userBalance, setUserBalance] = useState<UserBalance>({ USD: 0 });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [yearlyGrowthPrediction, setYearlyGrowthPrediction] = useState(25);
  const [customGrowth, setCustomGrowth] = useState("");
  const [isCustomGrowth, setIsCustomGrowth] = useState(false);
  const [customDuration, setCustomDuration] = useState("");
  const [isCustomDuration, setIsCustomDuration] = useState(false);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      if (!isConnected || !isAuthenticated) return;

      setIsLoadingPrice(true);
      try {
        const priceResponse = await getBtcPrice();
        if (priceResponse.success && priceResponse.data.price) {
          const newPrice = priceResponse.data.price;
          const oldPrice = currentBtcPrice;

          if (oldPrice !== 47000) {
            const change = ((newPrice - oldPrice) / oldPrice) * 100;
            setPriceChange(change);
          }

          setCurrentBtcPrice(newPrice);
          // toast.success(`BTC price updated: ${formatPrice(newPrice)}`);
        }
      } catch (error) {
        console.error("Failed to fetch BTC price:", error);
        toast.error("Failed to fetch current BTC price, using default");
      } finally {
        setIsLoadingPrice(false);
      }
    };

    fetchBtcPrice();
  }, [isConnected, isAuthenticated]);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (!isConnected || !isAuthenticated) return;

      setIsLoadingBalance(true);
      try {
        const userData = await getUserData();
        const balances = parseUserBalance(userData);
        setUserBalance(balances);
        console.log("User balance loaded:", balances);
      } catch (error) {
        console.error("Failed to fetch user balance:", error);
        toast.error("Failed to fetch user balance");
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchUserBalance();
  }, [isConnected, isAuthenticated]);

  const generatePriceVariations = (basePrice: number, months: number) => {
    const prices = [];
    const yearlyGrowthRate = yearlyGrowthPrediction / 100;
    const targetFinalPrice =
      basePrice * Math.pow(1 + yearlyGrowthRate, months / 12);

    for (let i = 0; i < months; i++) {
      const progressRatio = (i + 1) / months;
      const baseProgressivePrice =
        basePrice + (targetFinalPrice - basePrice) * progressRatio;

      const volatility = (Math.random() - 0.5) * 0.2;
      const volatilityAmount = baseProgressivePrice * volatility;

      let monthPrice = baseProgressivePrice + volatilityAmount;

      monthPrice = Math.max(basePrice * 0.8, monthPrice);

      monthPrice = Math.max(10000, Math.min(500000, monthPrice));
      prices.push(Math.round(monthPrice));
    }

    return prices;
  };

  const currencies = [
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      balance: userBalance.USD || 0,
    },
  ];

  const frequencies = [
    { value: "daily", name: "Daily", description: "Every day" },
    { value: "weekly", name: "Weekly", description: "Every week" },
    { value: "monthly", name: "Monthly", description: "Every month" },
  ];

  const durations = [
    { value: "3", name: "3 Months" },
    { value: "6", name: "6 Months" },
    { value: "12", name: "12 Months" },
    { value: "24", name: "24 Months" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPriceChange = (change: number | null) => {
    if (change === null) return null;
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  const runDCASimulation = (
    amount: number,
    frequency: string,
    duration: number
  ) => {
    const frequencyMultiplier = {
      daily: 30.44,
      weekly: 4.33,
      monthly: 1,
    };

    const purchasesPerMonth =
      frequencyMultiplier[frequency as keyof typeof frequencyMultiplier];
    const results: SimulationResult[] = [];
    let totalBtc = 0;
    let totalInvested = 0;

    const priceVariations = generatePriceVariations(currentBtcPrice, duration);

    for (let month = 1; month <= duration; month++) {
      const monthlyAmount = amount * purchasesPerMonth;
      const btcPrice = priceVariations[month - 1] || currentBtcPrice;
      const btcPurchased = monthlyAmount / btcPrice;

      totalBtc += btcPurchased;
      totalInvested += monthlyAmount;

      const finalPrice =
        month === duration
          ? btcPrice
          : priceVariations[duration - 1] || btcPrice;
      const currentValue = totalBtc * finalPrice;

      results.push({
        month,
        btcPrice,
        amountInvested: monthlyAmount,
        btcPurchased,
        totalBtc,
        totalInvested,
        currentValue: month === duration ? currentValue : totalBtc * btcPrice,
      });
    }

    if (results.length > 0 && yearlyGrowthPrediction > 0) {
      const finalResult = results[results.length - 1];
      const expectedMinimumValue =
        finalResult.totalInvested * (1 + (yearlyGrowthPrediction / 100) * 0.5);

      if (finalResult.currentValue < expectedMinimumValue) {
        const adjustedFinalPrice = expectedMinimumValue / finalResult.totalBtc;
        finalResult.currentValue = finalResult.totalBtc * adjustedFinalPrice;
      }
    }

    return results;
  };

  const calculateProjection = () => {
    if (!dcaData.amount || !dcaData.frequency || !dcaData.duration) return null;

    const amount = parseFloat(dcaData.amount);
    const duration = parseInt(dcaData.duration);

    const simulation = runDCASimulation(amount, dcaData.frequency, duration);
    const lastResult = simulation[simulation.length - 1];
    const averageCost = lastResult.totalInvested / lastResult.totalBtc;

    return {
      totalInvested: lastResult.totalInvested,
      totalBTC: lastResult.totalBtc,
      averageCost,
      frequency: dcaData.frequency,
      duration: duration,
      intervalAmount: amount,
      currentValue: lastResult.currentValue,
      profitLoss: lastResult.currentValue - lastResult.totalInvested,
      profitLossPercentage:
        ((lastResult.currentValue - lastResult.totalInvested) /
          lastResult.totalInvested) *
        100,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !dcaData.fiatSource ||
      !dcaData.amount ||
      !dcaData.frequency ||
      !dcaData.duration
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(dcaData.amount);
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const frequencyMultiplier = {
      daily: 30.44,
      weekly: 4.33,
      monthly: 1,
    };
    const duration = parseInt(dcaData.duration);

    if (isCustomDuration && (duration < 1 || duration > 240)) {
      toast.error("Duration must be between 1 and 240 months");
      return;
    }

    const totalNeeded =
      amount *
      frequencyMultiplier[
        dcaData.frequency as keyof typeof frequencyMultiplier
      ] *
      duration;

    if (totalNeeded > (userBalance.USD || 0)) {
      toast.error(
        `Insufficient USD balance. Need $${totalNeeded.toLocaleString()} but only have $${(
          userBalance.USD || 0
        ).toLocaleString()}`
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const simulation = runDCASimulation(
        amount,
        dcaData.frequency,
        parseInt(dcaData.duration)
      );
      setSimulationResults(simulation);
      setIsLoading(false);
      toast.success("DCA simulation completed!");
    }, 1500);
  };

  const selectedCurrency = currencies.find(
    (c) => c.code === dcaData.fiatSource
  );
  const projection = calculateProjection();

  if (!isConnected) {
    return (
      <PageWrapper
        title="DCA BTC Simulation"
        subtitle="Connect your wallet to simulate Bitcoin dollar-cost averaging."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">
                Connect Wallet Required
              </CardTitle>
              <CardDescription className="font-sans">
                Please connect your wallet to access the DCA simulation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ConnectWallet
                variant="default"
                size="lg"
                className="w-full max-w-sm mx-auto"
              />
              <Alert className="mt-4">
                <DollarSign className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  You need to connect your wallet first to run the DCA
                  simulation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageWrapper
        title="DCA BTC Simulation"
        subtitle="Sign in with your wallet to run Bitcoin dollar-cost averaging simulation."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">
                Authentication Required
              </CardTitle>
              <CardDescription className="font-sans">
                Please sign in with your wallet to access the DCA simulation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <Alert>
                  <DollarSign className="h-4 w-4" />
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
                <DollarSign className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  You'll be asked to sign a message with your wallet to
                  authenticate.
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
      title="DCA BTC Simulation"
      subtitle="Simulate Bitcoin dollar-cost averaging with historical price data"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              DCA Bitcoin Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-semibold font-sans mb-1">
                  Simulate Strategy
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  Test Bitcoin purchases with realistic price data
                </div>
              </div>
              <div className="text-center p-4">
                <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-semibold font-sans mb-1">
                  Analyze Results
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  See detailed breakdown of your investment
                </div>
              </div>
              <div className="text-center p-4">
                <Repeat className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-semibold font-sans mb-1">
                  Compare Scenarios
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  Try different amounts and frequencies
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <Image
                src="/image/btcLogo.png"
                alt="Bitcoin"
                width={20}
                height={20}
                className="object-contain"
              />
              Current BTC Price & Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 shadow-sm">
                {isLoadingPrice ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-sm text-orange-700 font-sans">
                      Loading price...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-3xl font-bold text-orange-600 font-mono">
                        {formatPrice(currentBtcPrice)}
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    {priceChange !== null && (
                      <div
                        className={`text-sm font-semibold ${
                          priceChange >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatPriceChange(priceChange)}
                      </div>
                    )}
                    <div className="text-sm text-orange-700 font-sans font-medium">
                      Live BTC Price
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-sm">
                {isLoadingBalance ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-sm text-green-700 font-sans">
                      Loading balance...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-600 font-mono">
                      ${(userBalance.USD || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-700 font-sans font-medium">
                      Available USD Balance
                    </div>
                    <div className="text-xs text-green-600 font-sans">
                      Ready for DCA investment
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans">
              Understanding Your DCA Analysis
            </CardTitle>
            <CardDescription className="font-sans">
              We provide two different calculations to help you understand
              potential outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-green-800">
                    📊 Expected Returns Preview
                  </span>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                    Quick Estimate
                  </span>
                </div>
                <div className="text-xs text-green-700 space-y-1">
                  <div>
                    • <strong>Instant calculation</strong> as you type
                  </div>
                  <div>
                    • <strong>Perfect growth assumption</strong> (smooth curve)
                  </div>
                  <div>
                    • <strong>No market volatility</strong> included
                  </div>
                  <div>
                    • <strong>Best-case scenario</strong> estimation
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-blue-800">
                    🎯 Investment Projection
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                    Realistic Simulation
                  </span>
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>
                    • <strong>Detailed simulation</strong> after running DCA
                  </div>
                  <div>
                    • <strong>Includes market volatility</strong> (±10% swings)
                  </div>
                  <div>
                    • <strong>Month-by-month analysis</strong> with real
                    variations
                  </div>
                  <div>
                    • <strong>Real-world scenario</strong> simulation
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-800 mb-1">
                💡 Which one to trust?
              </div>
              <div className="text-xs text-gray-600">
                Use <strong>Expected Returns Preview</strong> for quick planning
                and <strong>Investment Projection</strong> for realistic
                expectations. The projection will usually be different due to
                market volatility effects on your DCA timing.
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">
                DCA Strategy & Growth Prediction
              </CardTitle>
              <CardDescription className="font-sans">
                Configure your DCA parameters and BTC growth expectations for
                instant return preview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-sans font-medium">Fiat Source</Label>
                  <Select
                    value={dcaData.fiatSource}
                    onValueChange={(value) =>
                      setDcaData({ ...dcaData, fiatSource: value })
                    }
                  >
                    <SelectTrigger className="font-sans">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem
                          key={currency.code}
                          value={currency.code}
                          className="font-sans"
                        >
                          {currency.symbol} {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCurrency && (
                    <div className="text-sm text-muted-foreground font-sans">
                      Available: {selectedCurrency.symbol}
                      {selectedCurrency.balance.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-medium">
                    Amount per Purchase
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
                      {selectedCurrency?.symbol || "$"}
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={dcaData.amount}
                      onChange={(e) =>
                        setDcaData({ ...dcaData, amount: e.target.value })
                      }
                      className="pl-8 font-mono"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-medium">Frequency</Label>
                  <Select
                    value={dcaData.frequency}
                    onValueChange={(value) =>
                      setDcaData({ ...dcaData, frequency: value })
                    }
                  >
                    <SelectTrigger className="font-sans cursor-pointer">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem
                          key={freq.value}
                          value={freq.value}
                          className="font-sans cursor-pointer"
                        >
                          {freq.name} - {freq.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-medium">Duration</Label>
                  <div className="grid grid-cols-2 gap-2 ">
                    {durations.map((duration) => (
                      <Button
                        key={duration.value}
                        type="button"
                        variant={
                          !isCustomDuration &&
                          dcaData.duration === duration.value
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className={`font-sans text-xs cursor-pointer ${
                          !isCustomDuration &&
                          dcaData.duration === duration.value
                            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            : "hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                        }`}
                        onClick={() => {
                          setDcaData({ ...dcaData, duration: duration.value });
                          setIsCustomDuration(false);
                          setCustomDuration("");
                        }}
                      >
                        {duration.name}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={isCustomDuration ? "default" : "outline"}
                        size="sm"
                        className={`font-sans text-xs cursor-pointer ${
                          isCustomDuration
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "hover:bg-blue-50 hover:border-blue-300"
                        }`}
                        onClick={() => {
                          setIsCustomDuration(true);
                          if (customDuration) {
                            setDcaData({
                              ...dcaData,
                              duration: customDuration,
                            });
                          }
                        }}
                      >
                        Custom
                      </Button>

                      {isCustomDuration && (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            type="number"
                            placeholder="e.g. 18"
                            value={customDuration}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              setCustomDuration(inputValue);

                              const value = parseInt(inputValue);
                              if (!isNaN(value) && value >= 1 && value <= 240) {
                                setDcaData({
                                  ...dcaData,
                                  duration: inputValue,
                                });
                              } else if (inputValue === "") {
                                setDcaData({ ...dcaData, duration: "12" });
                              }
                            }}
                            onFocus={() => setIsCustomDuration(true)}
                            className="text-xs h-8 w-20 font-mono"
                            min="1"
                            max="240"
                            step="1"
                            title="Enter custom duration in months (1-240)"
                          />
                          <span className="text-xs text-muted-foreground font-sans">
                            months
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-sans">
                    Selected: {dcaData.duration} month
                    {parseInt(dcaData.duration) !== 1 ? "s" : ""}{" "}
                    {isCustomDuration && "(Custom)"}
                    {isCustomDuration &&
                      customDuration &&
                      parseInt(customDuration) > 60 && (
                        <div className="text-blue-600 mt-1">
                          💡 Long-term strategy! That's{" "}
                          {Math.round((parseInt(customDuration) / 12) * 10) /
                            10}{" "}
                          years of DCA.
                        </div>
                      )}
                    {isCustomDuration &&
                      customDuration &&
                      parseInt(customDuration) < 3 &&
                      parseInt(customDuration) >= 1 && (
                        <div className="text-orange-600 mt-1">
                          ⚠️ Very short duration. Consider longer periods for
                          better DCA benefits.
                        </div>
                      )}
                    {isCustomDuration &&
                      customDuration &&
                      parseInt(customDuration) > 120 && (
                        <div className="text-orange-600 mt-1">
                          ⚠️ Very long duration (
                          {Math.round(parseInt(customDuration) / 12)} years).
                          Simulation may be less accurate for distant futures.
                        </div>
                      )}
                    {isCustomDuration &&
                      customDuration &&
                      (parseInt(customDuration) < 1 ||
                        parseInt(customDuration) > 240) && (
                        <div className="text-red-600 mt-1">
                          ❌ Duration must be between 1 and 240 months (20
                          years).
                        </div>
                      )}
                    {isCustomDuration && !customDuration && (
                      <div className="text-blue-600 mt-1">
                        💡 Examples: 6 months, 18 months, 36 months (3 years),
                        60 months (5 years)
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-medium">
                    BTC Growth Prediction
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 15, 25, 50, 75, 100].map((growth) => (
                      <Button
                        key={growth}
                        type="button"
                        variant={
                          !isCustomGrowth && yearlyGrowthPrediction === growth
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className={`font-sans text-xs cursor-pointer ${
                          !isCustomGrowth && yearlyGrowthPrediction === growth
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "hover:bg-orange-50 hover:border-orange-300"
                        }`}
                        onClick={() => {
                          setYearlyGrowthPrediction(growth);
                          setIsCustomGrowth(false);
                          setCustomGrowth("");
                        }}
                      >
                        {growth}%
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={isCustomGrowth ? "default" : "outline"}
                        size="sm"
                        className={`font-sans text-xs cursor-pointer  ${
                          isCustomGrowth
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "hover:bg-orange-50 hover:border-orange-300"
                        }`}
                        onClick={() => {
                          setIsCustomGrowth(true);
                          if (customGrowth) {
                            setYearlyGrowthPrediction(parseFloat(customGrowth));
                          }
                        }}
                      >
                        Custom
                      </Button>

                      {isCustomGrowth && (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            type="number"
                            placeholder="e.g. 37.5"
                            value={customGrowth}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              setCustomGrowth(inputValue);

                              const value = parseFloat(inputValue);
                              if (
                                !isNaN(value) &&
                                value >= 0 &&
                                value <= 1000
                              ) {
                                setYearlyGrowthPrediction(value);
                              } else if (inputValue === "") {
                                setYearlyGrowthPrediction(25);
                              }
                            }}
                            onFocus={() => setIsCustomGrowth(true)}
                            className="text-xs h-8 w-28 font-mono"
                            min="0"
                            max="1000"
                            step="0.1"
                            title="Enter your custom BTC growth prediction (0-1000%)"
                          />
                          <span className="text-xs text-muted-foreground font-sans">
                            % annually
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-sans">
                    Selected: {yearlyGrowthPrediction}% annual BTC growth{" "}
                    {isCustomGrowth && "(Custom)"}
                    {isCustomGrowth &&
                      customGrowth &&
                      parseFloat(customGrowth) > 200 && (
                        <div className="text-orange-600 mt-1">
                          ⚠️ Very aggressive prediction! Consider more
                          conservative estimates.
                        </div>
                      )}
                    {isCustomGrowth &&
                      customGrowth &&
                      parseFloat(customGrowth) < 0 && (
                        <div className="text-red-600 mt-1">
                          ❌ Negative growth not supported in this simulation.
                        </div>
                      )}
                    {isCustomGrowth && !customGrowth && (
                      <div className="text-blue-600 mt-1">
                        💡 Examples: 12.5% (conservative), 35% (moderate), 87%
                        (aggressive)
                      </div>
                    )}
                  </div>
                </div>

                {dcaData.amount && dcaData.frequency && dcaData.duration && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-green-800 font-sans">
                        Expected Returns Preview
                      </div>
                      <div className="text-xs text-green-600 font-sans bg-green-100 px-2 py-1 rounded">
                        📊 Theoretical Estimate
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-green-700">Total Investment:</div>
                        <div className="font-mono font-bold text-green-900">
                          $
                          {(
                            parseFloat(dcaData.amount) *
                            (dcaData.frequency === "daily"
                              ? 30.44
                              : dcaData.frequency === "weekly"
                              ? 4.33
                              : 1) *
                            parseInt(dcaData.duration)
                          ).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-green-700">Expected Value:</div>
                        <div className="font-mono font-bold text-green-900">
                          $
                          {(() => {
                            const totalInvestment =
                              parseFloat(dcaData.amount) *
                              (dcaData.frequency === "daily"
                                ? 30.44
                                : dcaData.frequency === "weekly"
                                ? 4.33
                                : 1) *
                              parseInt(dcaData.duration);

                            const durationInYears =
                              parseInt(dcaData.duration) / 12;
                            const finalPrice =
                              currentBtcPrice *
                              Math.pow(
                                1 + yearlyGrowthPrediction / 100,
                                durationInYears
                              );
                            const avgPurchasePrice =
                              currentBtcPrice *
                              Math.sqrt(
                                Math.pow(
                                  1 + yearlyGrowthPrediction / 100,
                                  durationInYears
                                )
                              );
                            const totalBtc = totalInvestment / avgPurchasePrice;
                            const finalValue = totalBtc * finalPrice;

                            return finalValue.toLocaleString();
                          })()}
                        </div>
                      </div>
                      <div>
                        <div className="text-green-700">Potential Profit:</div>
                        <div className="font-mono font-bold text-emerald-600">
                          +$
                          {(() => {
                            const totalInvestment =
                              parseFloat(dcaData.amount) *
                              (dcaData.frequency === "daily"
                                ? 30.44
                                : dcaData.frequency === "weekly"
                                ? 4.33
                                : 1) *
                              parseInt(dcaData.duration);

                            const durationInYears =
                              parseInt(dcaData.duration) / 12;
                            const finalPrice =
                              currentBtcPrice *
                              Math.pow(
                                1 + yearlyGrowthPrediction / 100,
                                durationInYears
                              );
                            const avgPurchasePrice =
                              currentBtcPrice *
                              Math.sqrt(
                                Math.pow(
                                  1 + yearlyGrowthPrediction / 100,
                                  durationInYears
                                )
                              );
                            const totalBtc = totalInvestment / avgPurchasePrice;
                            const finalValue = totalBtc * finalPrice;
                            const profit = Math.max(
                              0,
                              finalValue - totalInvestment
                            );

                            return profit.toLocaleString();
                          })()}
                        </div>
                      </div>
                      <div>
                        <div className="text-green-700">ROI:</div>
                        <div className="font-mono font-bold text-emerald-600">
                          +
                          {(() => {
                            const totalInvestment =
                              parseFloat(dcaData.amount) *
                              (dcaData.frequency === "daily"
                                ? 30.44
                                : dcaData.frequency === "weekly"
                                ? 4.33
                                : 1) *
                              parseInt(dcaData.duration);

                            const durationInYears =
                              parseInt(dcaData.duration) / 12;
                            const finalPrice =
                              currentBtcPrice *
                              Math.pow(
                                1 + yearlyGrowthPrediction / 100,
                                durationInYears
                              );
                            const avgPurchasePrice =
                              currentBtcPrice *
                              Math.sqrt(
                                Math.pow(
                                  1 + yearlyGrowthPrediction / 100,
                                  durationInYears
                                )
                              );
                            const totalBtc = totalInvestment / avgPurchasePrice;
                            const finalValue = totalBtc * finalPrice;
                            const roi = Math.max(
                              0,
                              ((finalValue - totalInvestment) /
                                totalInvestment) *
                                100
                            );

                            return roi.toFixed(1);
                          })()}
                          %
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-700 font-sans">
                      <div className="font-medium mb-1">
                        📋 About This Preview:
                      </div>
                      <div className="space-y-1">
                        <div>
                          • <strong>Theoretical calculation</strong> assuming
                          perfect {yearlyGrowthPrediction}% annual growth
                        </div>
                        <div>
                          • <strong>Uses geometric mean</strong> for average
                          purchase price estimation
                        </div>
                        <div>
                          • <strong>No market volatility</strong> - smooth
                          growth assumption
                        </div>
                        <div>
                          • <strong>Starting price:</strong>{" "}
                          {formatPrice(currentBtcPrice)} (live API price)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Running Simulation..." : "Run DCA Simulation"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans flex items-center gap-2">
                <Image
                  src="/image/btcLogo.png"
                  alt="Bitcoin"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                Investment Projection
                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-normal">
                  🎯 Realistic Simulation
                </div>
              </CardTitle>
              <CardDescription className="font-sans">
                Detailed projection with {yearlyGrowthPrediction}% growth trend
                + market volatility simulation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projection ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-foreground font-mono">
                        {selectedCurrency?.symbol}
                        {projection.totalInvested.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Total Invested
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-orange-500 font-mono">
                        {formatToken(projection.totalBTC)}
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Total BTC
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div
                        className={`text-lg font-bold font-mono ${
                          projection.profitLoss >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedCurrency?.symbol}
                        {Math.abs(projection.profitLoss).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        {projection.profitLoss >= 0 ? "Profit" : "Loss"}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div
                        className={`text-lg font-bold font-mono ${
                          projection.profitLossPercentage >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {projection.profitLossPercentage >= 0 ? "+" : ""}
                        {projection.profitLossPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Return
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">
                        Purchase Amount:
                      </span>
                      <span className="font-mono font-semibold">
                        {selectedCurrency?.symbol}
                        {projection.intervalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">
                        Frequency:
                      </span>
                      <Badge variant="secondary" className="font-sans">
                        {projection.frequency.charAt(0).toUpperCase() +
                          projection.frequency.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">
                        Duration:
                      </span>
                      <span className="font-sans font-semibold">
                        {projection.duration} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">
                        Average Cost:
                      </span>
                      <span className="font-mono font-semibold">
                        {formatPrice(projection.averageCost)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="text-sm font-medium font-sans">
                      Projected BTC Holdings
                    </div>
                    <div className="h-32 bg-muted rounded-lg flex items-end justify-center gap-1 p-2">
                      {Array.from({ length: 12 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-primary rounded-t-sm flex-1 transition-all duration-300"
                          style={{
                            height: `${((i + 1) / 12) * 100}%`,
                            maxHeight: "100%",
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground font-sans text-center">
                      BTC accumulation over {projection.duration} months
                    </div>
                  </div>

                  <Separator />

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-800 font-sans mb-2">
                      🤔 Why are results different from Expected Returns
                      Preview?
                    </div>
                    <div className="text-xs text-blue-700 font-sans space-y-1">
                      <div>
                        •{" "}
                        <strong>
                          This projection includes realistic market volatility
                        </strong>{" "}
                        (±10% monthly swings)
                      </div>
                      <div>
                        • <strong>Uses month-by-month price simulation</strong>{" "}
                        instead of perfect growth curve
                      </div>
                      <div>
                        • <strong>Accounts for DCA timing effects</strong>{" "}
                        during price fluctuations
                      </div>
                      <div>
                        •{" "}
                        <strong>More accurate for real-world scenarios</strong>{" "}
                        with market ups and downs
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-muted-foreground font-sans">
                    Fill in the form to see your investment projection
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {simulationResults.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-sans">
                Month-by-Month Simulation
              </CardTitle>
              <CardDescription className="font-sans">
                Detailed breakdown with {yearlyGrowthPrediction}% annual BTC
                growth prediction + market volatility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-sans font-medium">
                        Month
                      </th>
                      <th className="text-right p-2 font-sans font-medium">
                        BTC Price
                      </th>
                      <th className="text-right p-2 font-sans font-medium">
                        Invested
                      </th>
                      <th className="text-right p-2 font-sans font-medium">
                        BTC Bought
                      </th>
                      <th className="text-right p-2 font-sans font-medium">
                        Total BTC
                      </th>
                      <th className="text-right p-2 font-sans font-medium">
                        Portfolio Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationResults.map((result) => (
                      <tr
                        key={result.month}
                        className="border-b border-muted hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-2 font-sans font-medium">
                          {result.month}
                        </td>
                        <td className="text-right p-2 font-mono font-semibold">
                          {formatPrice(result.btcPrice)}
                        </td>
                        <td className="text-right p-2 font-mono">
                          {selectedCurrency?.symbol}
                          {result.amountInvested.toLocaleString()}
                        </td>
                        <td className="text-right p-2 font-mono text-orange-500 font-medium">
                          {formatToken(result.btcPurchased)}
                        </td>
                        <td className="text-right p-2 font-mono font-semibold text-blue-600">
                          {formatToken(result.totalBtc)}
                        </td>
                        <td className="text-right p-2 font-mono font-bold text-green-600">
                          {selectedCurrency?.symbol}
                          {result.currentValue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-lg font-bold text-primary font-mono">
                    {formatPrice(
                      simulationResults.reduce(
                        (acc, r) => acc + r.totalInvested,
                        0
                      ) /
                        simulationResults.length /
                        simulationResults[simulationResults.length - 1].totalBtc
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">
                    Average Cost per BTC
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-lg font-bold text-blue-600 font-mono">
                    {formatPrice(
                      Math.min(...simulationResults.map((r) => r.btcPrice))
                    )}{" "}
                    -{" "}
                    {formatPrice(
                      Math.max(...simulationResults.map((r) => r.btcPrice))
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">
                    BTC Price Range
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-lg font-bold text-purple-600 font-mono">
                    {(
                      (simulationResults[simulationResults.length - 1]
                        .currentValue /
                        simulationResults[simulationResults.length - 1]
                          .totalInvested -
                        1) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">
                    Total Return
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 font-sans mb-2">
                  Growth Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-blue-700 font-medium">
                      Predicted Growth:
                    </div>
                    <div className="text-blue-900 font-mono">
                      {yearlyGrowthPrediction}% annually
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-700 font-medium">
                      Expected Final Price:
                    </div>
                    <div className="text-blue-900 font-mono">
                      {formatPrice(
                        currentBtcPrice *
                          Math.pow(
                            1 + yearlyGrowthPrediction / 100,
                            simulationResults.length / 12
                          )
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-700 font-medium">
                      Volatility Impact:
                    </div>
                    <div className="text-blue-900 font-mono">±15% monthly</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-blue-600">
                  * Simulation includes realistic market volatility on top of
                  the predicted growth trend
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sans">About This Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium font-sans">
                      Growth-Based Projections
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Uses live BTC price with customizable annual growth
                      predictions (5%-100%)
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium font-sans">
                      Risk-Free Testing
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Test your DCA strategy without using real money
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium font-sans">
                      Detailed Analytics
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      See month-by-month breakdown of your simulation
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium font-sans">
                      Multiple Growth Scenarios
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Test conservative (5%) to aggressive (100%) BTC growth
                      scenarios
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
