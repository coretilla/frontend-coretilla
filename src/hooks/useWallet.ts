"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useConnectorClient,
} from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useCallback, useEffect, useState } from "react";
import { WalletState } from "@/app/types/connect-wallet-types";

const WALLET_SESSION_KEY = "bitcoin-neobank-wallet-session";

export function useWallet(): WalletState {
  const {
    address,
    isConnected,
    isConnecting,
    isReconnecting,
    chainId,
    connector,
  } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const [hasStoredSession, setHasStoredSession] = useState(false);
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    string | undefined
  >();

  const { data: connectorClient } = useConnectorClient();

  const { data: balance } = useBalance({
    address: address,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSession = localStorage.getItem(WALLET_SESSION_KEY);
      setHasStoredSession(!!storedSession);
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      saveSession();
    }
  }, [isConnected, address]);

  useEffect(() => {
    const getSmartAccountAddress = async () => {
      if (isConnected && connectorClient && connector) {
        try {
          const isSmartWallet =
            connector.name?.toLowerCase().includes("smart") ||
            connector.name?.toLowerCase().includes("social") ||
            connector.id?.includes("coinbaseWallet") ||
            connector.id?.includes("w3mEmail");

          if (isSmartWallet && connectorClient) {
            const client = connectorClient as any;

            if (client.getAccountAddress) {
              const smartAddr = await client.getAccountAddress();
              setSmartAccountAddress(smartAddr);
              console.log("🔍 Smart Account Address found:", smartAddr);
            } else if (client.getCounterFactualAddress) {
              const smartAddr = await client.getCounterFactualAddress();
              setSmartAccountAddress(smartAddr);
              console.log("🔍 CounterFactual Address found:", smartAddr);
            } else if (client.account?.address) {
              const smartAddr = client.account.address;
              setSmartAccountAddress(smartAddr);
              console.log("🔍 Account Address found:", smartAddr);
            } else {
              console.log(
                "📍 Using EOA address for non-smart wallet:",
                address
              );
              setSmartAccountAddress(address);
            }
          } else {
            setSmartAccountAddress(address);
          }
        } catch (error) {
          console.error("Error getting smart account address:", error);
          setSmartAccountAddress(address);
        }
      }
    };

    getSmartAccountAddress();
  }, [isConnected, connectorClient, connector, address]);

  const saveSession = useCallback(() => {
    if (typeof window !== "undefined" && address) {
      const sessionData = {
        address,
        chainId,
        timestamp: Date.now(),
        connectorId: connector?.id,
      };
      localStorage.setItem(WALLET_SESSION_KEY, JSON.stringify(sessionData));
      setHasStoredSession(true);
    }
  }, [address, chainId, connector]);

  const clearSession = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(WALLET_SESSION_KEY);
      setHasStoredSession(false);
    }
  }, []);

  const handleConnect = useCallback(() => {
    open();
  }, [open]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      clearSession();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }, [disconnect, clearSession]);

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return {
    isConnected,
    isConnecting,
    isReconnecting,
    address,
    smartAccountAddress,
    chainId,
    connector,
    balance,
    connect: handleConnect,
    disconnect: handleDisconnect,
    openModal: open,
    saveSession,
    clearSession,
    hasStoredSession,
  };
}
