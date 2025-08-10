import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  CONTRACTS,
  MBTC_ABI,
  MUSDT_ABI,
  LENDING_POOL_ABI,
} from "@/lib/contracts/abi";
import { useAccount } from "wagmi";
import { useMemo, useCallback } from "react";

export function useLending() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: mBTCBalance, refetch: refetchMBTCBalance } = useReadContract({
    address: CONTRACTS.MBTC,
    abi: MBTC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: mUSDTBalance, refetch: refetchMUSDTBalance } = useReadContract({
    address: CONTRACTS.MUSDT,
    abi: MUSDT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: mBTCAllowance, refetch: refetchMBTCAllowance } =
    useReadContract({
      address: CONTRACTS.MBTC,
      abi: MBTC_ABI,
      functionName: "allowance",
      args: address ? [address, CONTRACTS.LENDING_POOL] : undefined,
    });

  const { data: mUSDTAllowance, refetch: refetchMUSDTAllowance } =
    useReadContract({
      address: CONTRACTS.MUSDT,
      abi: MUSDT_ABI,
      functionName: "allowance",
      args: address ? [address, CONTRACTS.LENDING_POOL] : undefined,
    });

  const { data: collateralBalance, refetch: refetchCollateralBalance } =
    useReadContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: "collateralBalancesBTC",
      args: address ? [address] : undefined,
    });

  const { data: borrowedBalance, refetch: refetchBorrowedBalance } =
    useReadContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: "borrowedBalancesUSDT",
      args: address ? [address] : undefined,
    });

  const { data: healthFactor, refetch: refetchHealthFactor } = useReadContract({
    address: CONTRACTS.LENDING_POOL,
    abi: LENDING_POOL_ABI,
    functionName: "getAccountHealth",
    args: address ? [address] : undefined,
  });

  const { data: loanToValueRatio } = useReadContract({
    address: CONTRACTS.LENDING_POOL,
    abi: LENDING_POOL_ABI,
    functionName: "loanToValueRatioPercent",
  });

  const { data: btcPriceInUSDT } = useReadContract({
    address: CONTRACTS.LENDING_POOL,
    abi: LENDING_POOL_ABI,
    functionName: "btcPriceInUSDT",
  });

  const approveMBTC = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    writeContract({
      address: CONTRACTS.MBTC,
      abi: MBTC_ABI,
      functionName: "approve",
      args: [CONTRACTS.LENDING_POOL, amountWei],
    });
  };

  const approveMUSDT = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    writeContract({
      address: CONTRACTS.MUSDT,
      abi: MUSDT_ABI,
      functionName: "approve",
      args: [CONTRACTS.LENDING_POOL, amountWei],
    });
  };

  const depositCollateral = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: "depositCollateral",
      args: [amountWei],
    });
  };

  const borrowUSDT = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: "borrowUSDT",
      args: [amountWei],
    });
  };

  const withdrawCollateral = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: "withdrawCollateral",
      args: [amountWei],
    });
  };

  const repayUSDT = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: "repayUSDT",
      args: [amountWei],
    });
  };

  const needsMBTCApproval = useMemo(() => {
    return (amount: string) => {
      if (!mBTCAllowance || !amount) return true;

      try {
        const amountWei = parseEther(amount);
        return mBTCAllowance < amountWei;
      } catch {
        return true;
      }
    };
  }, [mBTCAllowance]);

  const needsMUSDTApproval = useMemo(() => {
    return (amount: string) => {
      if (!mUSDTAllowance || !amount) return true;

      try {
        const amountWei = parseEther(amount);
        return mUSDTAllowance < amountWei;
      } catch {
        return true;
      }
    };
  }, [mUSDTAllowance]);

  const maxBorrowAmount = useMemo(() => {
    if (!collateralBalance || !btcPriceInUSDT || !loanToValueRatio) return "0";

    try {
      const collateralValue =
        Number(formatEther(collateralBalance)) *
        Number(formatEther(btcPriceInUSDT));
      const maxBorrow = (collateralValue * Number(loanToValueRatio)) / 100;
      return maxBorrow.toString();
    } catch {
      return "0";
    }
  }, [collateralBalance, btcPriceInUSDT, loanToValueRatio]);

  const fundPool = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: "fundPool",
      args: [amountWei],
    });
  };

  const mintMUSDT = async (to: any, amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    writeContract({
      address: CONTRACTS.MUSDT,
      abi: MUSDT_ABI,
      functionName: "mint",
      args: [to, amountWei],
    });
  };

  const formattedData = useMemo(
    () => ({
      mBTCBalance: mBTCBalance ? formatEther(mBTCBalance) : "0",
      mUSDTBalance: mUSDTBalance ? formatEther(mUSDTBalance) : "0",
      mBTCAllowance: mBTCAllowance ? formatEther(mBTCAllowance) : "0",
      mUSDTAllowance: mUSDTAllowance ? formatEther(mUSDTAllowance) : "0",
      collateralBalance: collateralBalance
        ? formatEther(collateralBalance)
        : "0",
      borrowedBalance: borrowedBalance ? formatEther(borrowedBalance) : "0",
      healthFactor: healthFactor ? Number(formatEther(healthFactor)) : 0,
      loanToValueRatio: loanToValueRatio ? Number(loanToValueRatio) : 0,
      btcPriceInUSDT: btcPriceInUSDT ? formatEther(btcPriceInUSDT) : "0",
      maxBorrowAmount,
    }),
    [
      mBTCBalance,
      mUSDTBalance,
      mBTCAllowance,
      mUSDTAllowance,
      collateralBalance,
      borrowedBalance,
      healthFactor,
      loanToValueRatio,
      btcPriceInUSDT,
      maxBorrowAmount,
    ]
  );

  const refetchAll = useCallback(() => {
    refetchMBTCBalance();
    refetchMUSDTBalance();
    refetchMBTCAllowance();
    refetchMUSDTAllowance();
    refetchCollateralBalance();
    refetchBorrowedBalance();
    refetchHealthFactor();
  }, [
    refetchMBTCBalance,
    refetchMUSDTBalance,
    refetchMBTCAllowance,
    refetchMUSDTAllowance,
    refetchCollateralBalance,
    refetchBorrowedBalance,
    refetchHealthFactor,
  ]);

  return {
    approveMBTC,
    approveMUSDT,
    depositCollateral,
    borrowUSDT,
    withdrawCollateral,
    repayUSDT,
    needsMBTCApproval,
    needsMUSDTApproval,
    refetchAll,
    fundPool,
    mintMUSDT,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    ...formattedData,
  };
}
