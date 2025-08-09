import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACTS, MBTC_ABI, MUSDT_ABI, LENDING_POOL_ABI } from '@/lib/contracts/abi';
import { useAccount } from 'wagmi';
import { useMemo, useCallback } from 'react';

export function useLending() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read mBTC balance
  const { data: mBTCBalance, refetch: refetchMBTCBalance } = useReadContract({
    address: CONTRACTS.MBTC,
    abi: MBTC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read mUSDT balance
  const { data: mUSDTBalance, refetch: refetchMUSDTBalance } = useReadContract({
    address: CONTRACTS.MUSDT,
    abi: MUSDT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read mBTC allowance for lending pool
  const { data: mBTCAllowance, refetch: refetchMBTCAllowance } = useReadContract({
    address: CONTRACTS.MBTC,
    abi: MBTC_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.LENDING_POOL] : undefined,
  });

  // Read mUSDT allowance for lending pool
  const { data: mUSDTAllowance, refetch: refetchMUSDTAllowance } = useReadContract({
    address: CONTRACTS.MUSDT,
    abi: MUSDT_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.LENDING_POOL] : undefined,
  });

  // Read collateral balance from lending pool
  const { data: collateralBalance, refetch: refetchCollateralBalance } = useReadContract({
    address: CONTRACTS.LENDING_POOL,
    abi: LENDING_POOL_ABI,
    functionName: 'collateralBalancesBTC',
    args: address ? [address] : undefined,
  });

  // Read borrowed balance from lending pool
  const { data: borrowedBalance, refetch: refetchBorrowedBalance } = useReadContract({
    address: CONTRACTS.LENDING_POOL,
    abi: LENDING_POOL_ABI,
    functionName: 'borrowedBalancesUSDT',
    args: address ? [address] : undefined,
  });

  // Read health factor
  const { data: healthFactor, refetch: refetchHealthFactor } = useReadContract({
    address: CONTRACTS.LENDING_POOL,
    abi: LENDING_POOL_ABI,
    functionName: 'getAccountHealth',
    args: address ? [address] : undefined,
  });

  // Read loan to value ratio
  const { data: loanToValueRatio } = useReadContract({
    address: CONTRACTS.LENDING_POOL,
    abi: LENDING_POOL_ABI,
    functionName: 'loanToValueRatioPercent',
  });

  // Read BTC price in USDT
  const { data: btcPriceInUSDT } = useReadContract({
    address: CONTRACTS.LENDING_POOL,
    abi: LENDING_POOL_ABI,
    functionName: 'btcPriceInUSDT',
  });

  // Approve mBTC for lending pool
  const approveMBTC = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    writeContract({
      address: CONTRACTS.MBTC,
      abi: MBTC_ABI,
      functionName: 'approve',
      args: [CONTRACTS.LENDING_POOL, amountWei],
    });
  };

  // Approve mUSDT for lending pool
  const approveMUSDT = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    writeContract({
      address: CONTRACTS.MUSDT,
      abi: MUSDT_ABI,
      functionName: 'approve',
      args: [CONTRACTS.LENDING_POOL, amountWei],
    });
  };

  // Deposit collateral (mBTC)
  const depositCollateral = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: 'depositCollateral',
      args: [amountWei],
    });
  };

  // Borrow USDT
  const borrowUSDT = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: 'borrowUSDT',
      args: [amountWei],
    });
  };

  // Withdraw collateral
  const withdrawCollateral = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: 'withdrawCollateral',
      args: [amountWei],
    });
  };

  // Repay USDT
  const repayUSDT = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: 'repayUSDT',
      args: [amountWei],
    });
  };

  // Check if mBTC amount needs approval
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

  // Check if mUSDT amount needs approval
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

  // Calculate max borrow amount based on collateral and LTV
  const maxBorrowAmount = useMemo(() => {
    if (!collateralBalance || !btcPriceInUSDT || !loanToValueRatio) return '0';
    
    try {
      const collateralValue = Number(formatEther(collateralBalance)) * Number(formatEther(btcPriceInUSDT));
      const maxBorrow = (collateralValue * Number(loanToValueRatio)) / 100;
      return maxBorrow.toString();
    } catch {
      return '0';
    }
  }, [collateralBalance, btcPriceInUSDT, loanToValueRatio]);

  const fundPool = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    writeContract({
      address: CONTRACTS.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: 'fundPool',
      args: [amountWei],
    });
  };

  // Mint mUSDT
  const mintMUSDT = async (to: any, amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const amountWei = parseEther(amount);
    
    writeContract({
      address: CONTRACTS.MUSDT,
      abi: MUSDT_ABI,
      functionName: 'mint',
      args: [to, amountWei],
    });
  };

  // Formatted values
  const formattedData = useMemo(() => ({
    mBTCBalance: mBTCBalance ? formatEther(mBTCBalance) : '0',
    mUSDTBalance: mUSDTBalance ? formatEther(mUSDTBalance) : '0',
    mBTCAllowance: mBTCAllowance ? formatEther(mBTCAllowance) : '0',
    mUSDTAllowance: mUSDTAllowance ? formatEther(mUSDTAllowance) : '0',
    collateralBalance: collateralBalance ? formatEther(collateralBalance) : '0',
    borrowedBalance: borrowedBalance ? formatEther(borrowedBalance) : '0',
    healthFactor: healthFactor ? Number(formatEther(healthFactor)) : 0,
    loanToValueRatio: loanToValueRatio ? Number(loanToValueRatio) : 0,
    btcPriceInUSDT: btcPriceInUSDT ? formatEther(btcPriceInUSDT) : '0',
    maxBorrowAmount,
  }), [
    mBTCBalance, 
    mUSDTBalance, 
    mBTCAllowance, 
    mUSDTAllowance, 
    collateralBalance, 
    borrowedBalance, 
    healthFactor, 
    loanToValueRatio, 
    btcPriceInUSDT,
    maxBorrowAmount
  ]);

  // Refetch all data
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
    // Actions
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

    // State
    isPending,
    isConfirming,
    isConfirmed,
    hash,

    // Data
    ...formattedData,
  };
}