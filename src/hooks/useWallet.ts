"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { useCallback, useEffect, useState } from 'react'

export interface WalletState {
  // Connection state
  isConnected: boolean
  isConnecting: boolean
  isReconnecting: boolean
  
  // Account info
  address?: string
  chainId?: number
  connector?: any
  
  // Balance
  balance?: {
    decimals: number
    formatted: string
    symbol: string
    value: bigint
  }
  
  // Methods
  connect: () => void
  disconnect: () => void
  openModal: () => void
  
  // Session management
  saveSession: () => void
  clearSession: () => void
  hasStoredSession: boolean
}

const WALLET_SESSION_KEY = 'bitcoin-neobank-wallet-session'

export function useWallet(): WalletState {
  const { address, isConnected, isConnecting, isReconnecting, chainId, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()
  const [hasStoredSession, setHasStoredSession] = useState(false)
  
  // Get balance for the connected address
  const { data: balance } = useBalance({
    address: address,
  })

  // Check for stored session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem(WALLET_SESSION_KEY)
      setHasStoredSession(!!storedSession)
    }
  }, [])

  // Save session when connected
  useEffect(() => {
    if (isConnected && address) {
      saveSession()
    }
  }, [isConnected, address])

  const saveSession = useCallback(() => {
    if (typeof window !== 'undefined' && address) {
      const sessionData = {
        address,
        chainId,
        timestamp: Date.now(),
        connectorId: connector?.id
      }
      localStorage.setItem(WALLET_SESSION_KEY, JSON.stringify(sessionData))
      setHasStoredSession(true)
    }
  }, [address, chainId, connector])

  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(WALLET_SESSION_KEY)
      setHasStoredSession(false)
    }
  }, [])

  const handleConnect = useCallback(() => {
    open()
  }, [open])

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
      clearSession()
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }, [disconnect, clearSession])

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return {
    // Connection state
    isConnected,
    isConnecting,
    isReconnecting,
    
    // Account info
    address,
    chainId,
    connector,
    
    // Balance
    balance,
    
    // Methods
    connect: handleConnect,
    disconnect: handleDisconnect,
    openModal: open,
    
    // Session management
    saveSession,
    clearSession,
    hasStoredSession
  }
}