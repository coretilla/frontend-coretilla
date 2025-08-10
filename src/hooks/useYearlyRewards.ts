import { useState, useEffect, useCallback } from "react";
import { parseEther, formatEther } from "viem";
import { useReadContract } from "wagmi";
import { CONTRACTS, STAKING_VAULT_ABI } from "@/lib/contracts/abi";

export function useYearlyRewards(amount: string) {
  const [yearlyRewards, setYearlyRewards] = useState("0");

  const amountWei = amount && amount !== "0" ? parseEther(amount) : BigInt(0);

  const { data: contractRewards, refetch } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: "calculateYearlyRewards",
    args: amountWei > BigInt(0) ? [amountWei] : undefined,
    query: {
      enabled: amountWei > BigInt(0),
    },
  });

  useEffect(() => {
    if (contractRewards) {
      const formatted = formatEther(contractRewards as bigint);
      setYearlyRewards(formatted);
    } else if (!amount || amount === "0") {
      setYearlyRewards("0");
    }
  }, [contractRewards, amount]);

  const calculateYearlyRewards = useCallback(
    (newAmount: string) => {
      if (!newAmount || newAmount === "0") {
        setYearlyRewards("0");
        return "0";
      }
      return yearlyRewards;
    },
    [yearlyRewards]
  );

  return {
    yearlyRewards,
    calculateYearlyRewards,
    refetch,
  };
}
