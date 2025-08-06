import { useState, useEffect, useCallback } from 'react';
import { parseEther, formatEther } from 'viem';
import { useReadContract } from 'wagmi';
import { CONTRACTS, STAKING_VAULT_ABI } from '@/lib/contracts/abi';

export function useYearlyRewards(amount: string) {
  const [yearlyRewards, setYearlyRewards] = useState('0');

  // Convert amount to wei for contract call
  const amountWei = amount && amount !== '0' ? parseEther(amount) : 0n;

  // Call calculateYearlyRewards from contract
  const { data: contractRewards, refetch } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: 'calculateYearlyRewards',
    args: amountWei > 0n ? [amountWei] : undefined,
    query: {
      enabled: amountWei > 0n, // Only call when amount > 0
    },
  });

  // Update yearly rewards when contract data changes
  useEffect(() => {
    if (contractRewards) {
      const formatted = formatEther(contractRewards as bigint);
      setYearlyRewards(formatted);
    } else if (!amount || amount === '0') {
      setYearlyRewards('0');
    }
  }, [contractRewards, amount]);

  const calculateYearlyRewards = useCallback((newAmount: string) => {
    if (!newAmount || newAmount === '0') {
      setYearlyRewards('0');
      return '0';
    }
    
    // For immediate response, we'll use the current cached value
    // The useReadContract will update automatically when amount changes
    return yearlyRewards;
  }, [yearlyRewards]);

  return {
    yearlyRewards,
    calculateYearlyRewards,
    refetch,
  };
}