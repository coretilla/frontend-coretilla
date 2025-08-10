import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACTS, MBTC_ABI, STAKING_VAULT_ABI } from '@/lib/contracts/abi';
import { useAccount } from 'wagmi';
import { useMemo, useCallback } from 'react';

export function useStaking() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read mBTC balance
  const { data: mBTCBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.MBTC,
    abi: MBTC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read mBTC allowance for staking vault
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.MBTC,
    abi: MBTC_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.STAKING_VAULT] : undefined,
  });

  // Read APY
  const { data: apy } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: 'APY',
  });

  // Read cooldown period
  const { data: cooldownPeriod } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: 'COOLDOWN_PERIOD',
  });

  // Read user info
  const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
  });

  // Read pending rewards
  const { data: pendingRewards, refetch: refetchPendingRewards } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
  });


  // Approve mBTC for staking
  const approve = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    try {
      writeContract({
        address: CONTRACTS.MBTC,
        abi: MBTC_ABI,
        functionName: 'approve',
        args: [CONTRACTS.STAKING_VAULT, amountWei],
        // Remove fixed gas limit to let wallet estimate properly for smart accounts
      });
    } catch (error: any) {
      console.error('❌ Approve transaction failed:', error);
      // Add more specific error handling for smart wallets
      if (error?.message?.includes('insufficient funds') || 
          error?.message?.includes('insufficient balance')) {
        throw new Error('Insufficient CORE balance for transaction fees. Smart wallets need CORE for gas fees.');
      }
      throw error;
    }
  };

  // Stake mBTC
  const stake = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    try {
      writeContract({
        address: CONTRACTS.STAKING_VAULT,
        abi: STAKING_VAULT_ABI,
        functionName: 'stake',
        args: [amountWei],
        // Remove fixed gas limit to let wallet estimate properly for smart accounts
      });
    } catch (error: any) {
      console.error('❌ Stake transaction failed:', error);
      if (error?.message?.includes('insufficient funds') || 
          error?.message?.includes('insufficient balance')) {
        throw new Error('Insufficient CORE balance for transaction fees. Smart wallets need CORE for gas fees.');
      }
      throw error;
    }
  };

  // Start cooldown for unstaking
  const startCooldown = async () => {
    if (!address) throw new Error('Wallet not connected');
    
    writeContract({
      address: CONTRACTS.STAKING_VAULT,
      abi: STAKING_VAULT_ABI,
      functionName: 'startCooldown',
    });
  };

  // Unstake mBTC
  const unstake = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    writeContract({
      address: CONTRACTS.STAKING_VAULT,
      abi: STAKING_VAULT_ABI,
      functionName: 'unstake',
      args: [amountWei],
    });
  };

  // Claim rewards
  const claimRewards = async () => {
    if (!address) throw new Error('Wallet not connected');
    
    writeContract({
      address: CONTRACTS.STAKING_VAULT,
      abi: STAKING_VAULT_ABI,
      functionName: 'claimRewards',
    });
  };

  // Check if amount needs approval
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

  // Formatted values
  const formattedData = useMemo(() => ({
    mBTCBalance: mBTCBalance ? formatEther(mBTCBalance) : '0',
    allowance: allowance ? formatEther(allowance) : '0',
    apy: apy ? Number(apy) / 100 : 0, // Convert to percentage
    cooldownPeriod: cooldownPeriod ? Number(cooldownPeriod) : 0,
    stakedAmount: userInfo ? formatEther(userInfo[0]) : '0',
    pendingRewards: pendingRewards ? formatEther(pendingRewards) : '0',
    canUnstake: userInfo ? userInfo[2] : false,
    cooldownEnd: userInfo ? Number(userInfo[3]) : 0,
    unstakeWindowEnd: userInfo ? Number(userInfo[4]) : 0,
  }), [mBTCBalance, allowance, apy, cooldownPeriod, userInfo, pendingRewards]);

  // Refetch all data
  const refetchAll = useCallback(() => {
    refetchBalance();
    refetchAllowance();
    refetchUserInfo();
    refetchPendingRewards();
  }, [refetchBalance, refetchAllowance, refetchUserInfo, refetchPendingRewards]);

  return {
    // Actions
    approve,
    stake,
    startCooldown,
    unstake,
    claimRewards,
    needsApproval,
    refetchAll,

    // State
    isPending,
    isConfirming,
    isConfirmed,
    hash,

    // Data
    ...formattedData,
  };
}