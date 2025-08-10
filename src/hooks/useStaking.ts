import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACTS, MBTC_ABI, STAKING_VAULT_ABI } from "@/lib/contracts/abi";
import { useAccount } from "wagmi";
import { useMemo, useCallback } from "react";

export function useStaking() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: mBTCBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.MBTC,
    abi: MBTC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.MBTC,
    abi: MBTC_ABI,
    functionName: "allowance",
    args: address ? [address, CONTRACTS.STAKING_VAULT] : undefined,
  });

  const { data: apy } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: "APY",
  });

  const { data: cooldownPeriod } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: "COOLDOWN_PERIOD",
  });

  const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: "getUserInfo",
    args: address ? [address] : undefined,
  });

  const { data: pendingRewards, refetch: refetchPendingRewards } =
    useReadContract({
      address: CONTRACTS.STAKING_VAULT,
      abi: STAKING_VAULT_ABI,
      functionName: "getPendingRewards",
      args: address ? [address] : undefined,
    });

  const approve = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    try {
      writeContract({
        address: CONTRACTS.MBTC,
        abi: MBTC_ABI,
        functionName: "approve",
        args: [CONTRACTS.STAKING_VAULT, amountWei],
      });
    } catch (error: any) {
      console.error("❌ Approve transaction failed:", error);
      if (
        error?.message?.includes("insufficient funds") ||
        error?.message?.includes("insufficient balance")
      ) {
        throw new Error(
          "Insufficient CORE balance for transaction fees. Smart wallets need CORE for gas fees."
        );
      }
      throw error;
    }
  };

  const stake = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    try {
      writeContract({
        address: CONTRACTS.STAKING_VAULT,
        abi: STAKING_VAULT_ABI,
        functionName: "stake",
        args: [amountWei],
      });
    } catch (error: any) {
      console.error("❌ Stake transaction failed:", error);
      if (
        error?.message?.includes("insufficient funds") ||
        error?.message?.includes("insufficient balance")
      ) {
        throw new Error(
          "Insufficient CORE balance for transaction fees. Smart wallets need CORE for gas fees."
        );
      }
      throw error;
    }
  };

  const startCooldown = async () => {
    if (!address) throw new Error("Wallet not connected");

    writeContract({
      address: CONTRACTS.STAKING_VAULT,
      abi: STAKING_VAULT_ABI,
      functionName: "startCooldown",
    });
  };

  const unstake = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const amountWei = parseEther(amount);

    writeContract({
      address: CONTRACTS.STAKING_VAULT,
      abi: STAKING_VAULT_ABI,
      functionName: "unstake",
      args: [amountWei],
    });
  };

  const claimRewards = async () => {
    if (!address) throw new Error("Wallet not connected");

    writeContract({
      address: CONTRACTS.STAKING_VAULT,
      abi: STAKING_VAULT_ABI,
      functionName: "claimRewards",
    });
  };

  const needsApproval = useMemo(() => {
    return (amount: string) => {
      if (!allowance || !amount) return true;

      try {
        const amountWei = parseEther(amount);
        return allowance < amountWei;
      } catch {
        return true;
      }
    };
  }, [allowance]);

  const formattedData = useMemo(
    () => ({
      mBTCBalance: mBTCBalance ? formatEther(mBTCBalance) : "0",
      allowance: allowance ? formatEther(allowance) : "0",
      apy: apy ? Number(apy) / 100 : 0,
      cooldownPeriod: cooldownPeriod ? Number(cooldownPeriod) : 0,
      stakedAmount: userInfo ? formatEther(userInfo[0]) : "0",
      pendingRewards: pendingRewards ? formatEther(pendingRewards) : "0",
      canUnstake: userInfo ? userInfo[2] : false,
      cooldownEnd: userInfo ? Number(userInfo[3]) : 0,
      unstakeWindowEnd: userInfo ? Number(userInfo[4]) : 0,
    }),
    [mBTCBalance, allowance, apy, cooldownPeriod, userInfo, pendingRewards]
  );

  const refetchAll = useCallback(() => {
    refetchBalance();
    refetchAllowance();
    refetchUserInfo();
    refetchPendingRewards();
  }, [
    refetchBalance,
    refetchAllowance,
    refetchUserInfo,
    refetchPendingRewards,
  ]);

  return {
    approve,
    stake,
    startCooldown,
    unstake,
    claimRewards,
    needsApproval,
    refetchAll,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    ...formattedData,
  };
}
