"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getUserData,
  parseUserBalance,
  getBtcPrice,
  swapUsdToBtc,
} from "@/app/api/api";
import type { SwapFormData } from "@/app/types/swap-types";
import { Balances } from "./types";

export function useSwap() {
  const [formData, setFormData] = useState<SwapFormData>({
    fromCurrency: "USD",
    amount: "",
  });
  const [btcPrice, setBtcPrice] = useState(47234.56);
  const [userBalance, setUserBalance] = useState(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const networkFee = 0.0001;
  const estimatedTime = "2-5 minutes";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserData();
        if (data) {
          setUserInfo(data);
          const balances = parseUserBalance(data);
          setUserBalance(balances.USD || 0);
        }
      } catch (e) {
        console.error(e);
      }
    };
    const fetchPrice = async () => {
      try {
        const data = await getBtcPrice();
        if (data?.success) setBtcPrice(parseFloat(data.data.price.toString()));
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserInfo();
    fetchPrice();
    const id = setInterval(fetchPrice, 30_000);
    return () => clearInterval(id);
  }, []);

  const currentBalances: Balances = useMemo(
    () => ({
      USD: userBalance,
      CORE: userInfo?.coreBalance || 0,
      CORE_USD: userInfo?.coreBalanceInUsd || 0,
      WBTC: userInfo?.wbtcBalance || 0,
      WBTC_USD: userInfo?.wbtcBalanceInUsd || 0,
    }),
    [userBalance, userInfo]
  );

  const btcAmount = useMemo(() => {
    const a = parseFloat(formData.amount || "0");
    if (!a || !btcPrice) return "0.00000000";
    return (a / btcPrice).toFixed(8);
  }, [formData.amount, btcPrice]);

  function validate() {
    if (!formData.amount) {
      toast.error("Please enter an amount");
      return false;
    }
    if (parseFloat(formData.amount) > userBalance) {
      toast.error("Insufficient balance");
      return false;
    }
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setShowConfirmation(true);
  };

  const handleConfirmSwap = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    try {
      const data = await swapUsdToBtc({ amount: parseFloat(formData.amount) });
      if (data?.success) {
        setUserBalance(data.data.remainingBalance);
        toast.success(
          "Swap completed successfully! Bitcoin has been added to your wallet."
        );
        setFormData({ fromCurrency: "USD", amount: "" });
      } else {
        throw new Error("Swap failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to process swap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // state
    formData,
    setFormData,
    btcPrice,
    btcAmount,
    currentBalances,
    isLoading,
    showConfirmation,
    setShowConfirmation,
    networkFee,
    estimatedTime,
    // actions
    handleSubmit,
    handleConfirmSwap,
  };
}
