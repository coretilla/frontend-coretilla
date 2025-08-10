"use client";
import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { DollarSign, TrendingUp, Bitcoin } from "lucide-react";
import {
  getUserData,
  parseUserBalance,
  getBtcPrice,
} from "@/app/api/api";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { formatToken } from "@/hooks/useFormatToken";
import { UserBalance, BtcPriceResponse } from "@/app/types/api-types";
import { AssetCard } from "./AssetCard";
import { WalletNotConnected } from "./WalletNotConnected";
import { AuthenticationRequired } from "./AuthenticationRequired";
import { PortfolioHeader } from "./PortfolioHeader";
import { QuickActions } from "./QuickActions";


export default function DashboardPage() {
  const {
    isAuthenticated,
    signIn,
    isAuthenticating,
    error: authError,
  } = useAuth();
  const { isConnected } = useWallet();
  const [selectedPeriod, setSelectedPeriod] = useState("7D");
  const [balanceData, setBalanceData] = useState<UserBalance>({ USD: 0 });
  const [apiData, setApiData] = useState<any>(null);
  const [btcPriceData, setBtcPriceData] = useState<BtcPriceResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [userData, btcPrice] = await Promise.all([
        getUserData(),
        getBtcPrice(),
      ]);

      const balances = parseUserBalance(userData);
      setBalanceData(balances);
      setApiData(userData);
      setBtcPriceData(btcPrice);

      console.log("✅ Dashboard data loaded:", {
        userData,
        btcPriceResponse: btcPrice,
        btcPriceValue: btcPrice.data?.price,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  const wbtcBalance = apiData?.wbtcBalance || 0;
  const coreBalance = apiData?.coreBalance || 0;
  const wbtcBalanceInUsd = apiData?.wbtcBalanceInUsd || 0;
  const coreBalanceInUsd = apiData?.coreBalanceInUsd || 0;
  const totalAssetInUsd = apiData?.totalAssetInUsd || 0;
  const corePrice = coreBalance > 0 ? coreBalanceInUsd / coreBalance : 1.2;
  const btcPrice = btcPriceData?.data?.price || 0;

  const balances = {
    fiat: {
      USD: {
        amount: balanceData.USD?.toFixed(2) || "0.00",
        change: { value: 0, percentage: 0, period: "7D" },
      },
    },
    crypto: {
      BTC: {
        amount: formatToken(wbtcBalance),
        change: { value: 0, percentage: 0, period: "7D" },
        price: btcPrice,
        usdValue: wbtcBalanceInUsd,
      },
      CORE: {
        amount: formatToken(coreBalance),
        change: { value: 0, percentage: 0, period: "7D" },
        price: corePrice,
        usdValue: coreBalanceInUsd,
      },
    },
  };

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
    All: [
      { day: "Jan", value: 0 },
      { day: "Feb", value: 0 },
      { day: "Mar", value: 0 },
      { day: "Apr", value: 0 },
      { day: "May", value: 0 },
      { day: "Jun", value: 0 },
      { day: "Jul", value: 0 },
    ],
  };

  const totalPortfolioValue = totalAssetInUsd;
  const totalChange = { value: 0, percentage: 0 };

  if (!isConnected) {
    return <WalletNotConnected />;
  }

  if (!isAuthenticated) {
    return (
      <AuthenticationRequired
        authError={authError}
        onSignIn={signIn}
        isAuthenticating={isAuthenticating}
      />
    );
  }

  return (
    <PageWrapper
      title="Portfolio Dashboard"
      subtitle="Track your fiat and crypto balances with detailed analytics"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-6xl mx-auto">
        <PortfolioHeader
          totalPortfolioValue={totalPortfolioValue}
          totalChange={totalChange}
          isLoading={isLoading}
          onRefresh={fetchUserData}
          chartData={chartData}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <AssetCard
            title="US Dollar Balance"
            icon={<DollarSign className="h-4 w-4" />}
            amountText={`$${balances.fiat.USD.amount}`}
            usdValueText="Available balance"
            delay={0.1}
          />

          <AssetCard
            title="Bitcoin"
            logoSrc="/image/btcLogo.png"
            icon={<Bitcoin className="h-4 w-4" />}
            amountText={balances.crypto.BTC.amount}
            usdValueText={`$${balances.crypto.BTC.usdValue.toLocaleString()}`}
            priceText={
              balances.crypto.BTC.price > 0
                ? `$${Math.floor(
                    balances.crypto.BTC.price
                  ).toLocaleString()}/BTC`
                : "Loading..."
            }
            priceTooltip="Spot price (approx.)"
            delay={0.2}
          />

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

        <QuickActions />
      </div>
    </PageWrapper>
  );
}
