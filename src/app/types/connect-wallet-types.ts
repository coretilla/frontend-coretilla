import { ReactNode } from "react";
export interface ConnectWalletProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export interface WalletProviderProps {
  children: ReactNode;
}

export interface WalletState {
    isConnected: boolean;
    isConnecting: boolean;
    isReconnecting: boolean;
    address?: string;
    smartAccountAddress?: string;
    chainId?: number;
    connector?: any;
    balance?: {
      decimals: number;
      formatted: string;
      symbol: string;
      value: bigint;
    };
    connect: () => void;
    disconnect: () => void;
    openModal: () => void;
    saveSession: () => void;
    clearSession: () => void;
    hasStoredSession: boolean;
  }

export * from "./connect-wallet-types";
