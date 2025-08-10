export interface CreateDepositRequest {
  amount: number;
  currency: string;
  description: string;
}

export interface CreateDepositResponse {
  deposit_id: number;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ConfirmDepositRequest {
  payment_intent_id: string;
  payment_method_id: string;
}

export interface ConfirmDepositResponse {
  success: boolean;
  deposit_id: number;
  new_balance: number;
  transaction_id: number;
}

export interface UserBalance {
  USD?: number;
  IDR?: number;
  EUR?: number;
  [key: string]: number | undefined;
}

export interface UserMeResponse {
  id: number;
  name?: string;
  wallet_address: string;
  balance?: UserBalance | number;
  balances?: UserBalance;
  usd_balance?: number;
  idr_balance?: number;
  eur_balance?: number;
  coreBalance?: number;
  wbtcBalance?: number;
  wbtcBalanceInUsd?: number;
  coreBalanceInUsd?: number;
  totalAssetInUsd?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BtcPriceResponse {
  success: boolean;
  data: {
    symbol: string;
    price: number;
    currency: string;
    timestamp: string;
  };
}

export  interface SwapRequest {
  amount: number;
}

export interface SwapResponse {
  success: boolean;
  message: string;
  data: {
    transactionHash: string;
    btcAmount: number;
    btcPrice: number;
    usdAmount: number;
    remainingBalance: number;
  };
}

export * from "./api-types";
