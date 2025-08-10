"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { getBtcPrice, getUserData, parseUserBalance } from "@/app/api/api";
import type { DCAData, SimulationResult } from "@/app/types/dca-types";
import type { UserBalance } from "@/app/types/api-types";

export function useDcaUi() {
  const { isConnected } = useWallet();
  const { isAuthenticated } = useAuth();

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
        const res = await getBtcPrice();
        if (res?.success && res.data?.price) {
          const newPrice = res.data.price;
          const old = currentBtcPrice;
          if (old !== 47000) setPriceChange(((newPrice - old) / old) * 100);
          setCurrentBtcPrice(newPrice);
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch current BTC price, using default");
      } finally {
        setIsLoadingPrice(false);
      }
    };
    fetchBtcPrice();
  }, [isConnected, isAuthenticated]);

  useEffect(() => {
    const run = async () => {
      if (!isConnected || !isAuthenticated) return;
      setIsLoadingBalance(true);
      try {
        const user = await getUserData();
        const balances = parseUserBalance(user);
        setUserBalance(balances);
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch user balance");
      } finally {
        setIsLoadingBalance(false);
      }
    };
    run();
  }, [isConnected, isAuthenticated]);

  const currencies = useMemo(
    () => [
      {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        balance: userBalance.USD || 0,
      },
    ],
    [userBalance]
  );
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

  const selectedCurrency = currencies.find(
    (c) => c.code === dcaData.fiatSource
  );

  function formatPrice(n: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  }
  function formatPriceChange(change: number | null) {
    if (change === null) return null;
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  }

  function generatePriceVariations(basePrice: number, months: number) {
    const prices: number[] = [];
    const yearlyGrowthRate = yearlyGrowthPrediction / 100;
    const targetFinal = basePrice * Math.pow(1 + yearlyGrowthRate, months / 12);
    for (let i = 0; i < months; i++) {
      const progress = (i + 1) / months;
      const baseProg = basePrice + (targetFinal - basePrice) * progress;
      const vol = (Math.random() - 0.5) * 0.2; // ±10%
      let p = baseProg + baseProg * vol;
      p = Math.max(basePrice * 0.8, p);
      p = Math.max(10000, Math.min(500000, p));
      prices.push(Math.round(p));
    }
    return prices;
  }

  function runDCASimulation(
    amount: number,
    frequency: string,
    duration: number
  ) {
    const fm = { daily: 30.44, weekly: 4.33, monthly: 1 } as const;
    const perMonth = fm[frequency as keyof typeof fm];
    const results: SimulationResult[] = [];
    let totalBtc = 0;
    let totalInvested = 0;
    const priceVariations = generatePriceVariations(currentBtcPrice, duration);
    for (let month = 1; month <= duration; month++) {
      const monthlyAmount = amount * perMonth;
      const btcPrice = priceVariations[month - 1] || currentBtcPrice;
      const btcPurchased = monthlyAmount / btcPrice;
      totalBtc += btcPurchased;
      totalInvested += monthlyAmount;
      const finalPrice =
        month === duration
          ? btcPrice
          : priceVariations[duration - 1] || btcPrice;
      const currentValue =
        month === duration ? totalBtc * finalPrice : totalBtc * btcPrice;
      results.push({
        month,
        btcPrice,
        amountInvested: monthlyAmount,
        btcPurchased,
        totalBtc,
        totalInvested,
        currentValue,
      });
    }
    if (results.length > 0 && yearlyGrowthPrediction > 0) {
      const last = results[results.length - 1];
      const minValue =
        last.totalInvested * (1 + (yearlyGrowthPrediction / 100) * 0.5);
      if (last.currentValue < minValue) {
        const adjustedFinal = minValue / last.totalBtc;
        last.currentValue = last.totalBtc * adjustedFinal;
      }
    }
    return results;
  }

  const projection = useMemo(() => {
    if (!dcaData.amount || !dcaData.frequency || !dcaData.duration) return null;
    const amount = parseFloat(dcaData.amount);
    const duration = parseInt(dcaData.duration);
    const sim = runDCASimulation(amount, dcaData.frequency, duration);
    const last = sim[sim.length - 1];
    const averageCost = last.totalInvested / last.totalBtc;
    return {
      totalInvested: last.totalInvested,
      totalBTC: last.totalBtc,
      averageCost,
      frequency: dcaData.frequency,
      duration,
      intervalAmount: amount,
      currentValue: last.currentValue,
      profitLoss: last.currentValue - last.totalInvested,
      profitLossPercentage:
        ((last.currentValue - last.totalInvested) / last.totalInvested) * 100,
    };
  }, [dcaData, currentBtcPrice, yearlyGrowthPrediction]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { fiatSource, amount, frequency, duration } = dcaData;
    if (!fiatSource || !amount || !frequency || !duration)
      return toast.error("Please fill in all required fields");
    const amt = parseFloat(amount);
    if (amt <= 0) return toast.error("Please enter a valid amount");
    const fm = { daily: 30.44, weekly: 4.33, monthly: 1 } as const;
    const dur = parseInt(duration);
    if (isCustomDuration && (dur < 1 || dur > 240))
      return toast.error("Duration must be between 1 and 240 months");
    const totalNeeded = amt * fm[frequency as keyof typeof fm] * dur;
    if (totalNeeded > (userBalance.USD || 0))
      return toast.error(
        `Insufficient USD balance. Need $${totalNeeded.toLocaleString()} but only have $${(
          userBalance.USD || 0
        ).toLocaleString()}`
      );
    setIsLoading(true);
    setTimeout(() => {
      const sim = runDCASimulation(amt, frequency, dur);
      setSimulationResults(sim);
      setIsLoading(false);
      toast.success("DCA simulation completed!");
    }, 1500);
  }

  return {
    dcaData,
    setDcaData,
    isLoading,
    simulationResults,
    currentBtcPrice,
    isLoadingPrice,
    priceChange,
    userBalance,
    isLoadingBalance,
    yearlyGrowthPrediction,
    setYearlyGrowthPrediction,
    customGrowth,
    setCustomGrowth,
    isCustomGrowth,
    setIsCustomGrowth,
    customDuration,
    setCustomDuration,
    isCustomDuration,
    setIsCustomDuration,
    currencies,
    frequencies,
    durations,
    selectedCurrency,
    formatPrice,
    formatPriceChange,
    projection,
    handleSubmit,
  };
}
