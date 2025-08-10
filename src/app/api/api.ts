import {
  CreateDepositRequest,
  CreateDepositResponse,
  ConfirmDepositRequest,
  ConfirmDepositResponse,
  UserBalance,
  UserMeResponse,
  BtcPriceResponse,
  SwapRequest,
  SwapResponse,
} from "@/app/types/api-types";

const API_BASE_URL = "https://core-backend-production-0965.up.railway.app";

import { getStoredAuth } from "../../lib/auth";

function getAuthToken(): string | null {
  const { token } = getStoredAuth();
  localStorage.setItem("authToken", token || "");
  return token;
}

export async function createDeposit(
  data: CreateDepositRequest
): Promise<CreateDepositResponse> {
  const token = getAuthToken();
  if (!token) {
    console.error("❌ No access_token found in localStorage");
    throw new Error("Authentication required. Please login first.");
  }

  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const requestBody = {
    amount: data.amount,
    currency: data.currency,
    description: data.description,
  };

  const response = await fetch(`${API_BASE_URL}/payments/deposits`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ API Error response:", errorText);
    throw new Error(
      `Failed to create deposit (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();
  return result;
}

export async function confirmDeposit(
  data: ConfirmDepositRequest
): Promise<ConfirmDepositResponse> {
  const token = getAuthToken();
  if (!token) {
    console.error("❌ No access_token found in localStorage");
    throw new Error("Authentication required. Please login first.");
  }

  const requestBody = {
    payment_intent_id: data.payment_intent_id,
    payment_method_id: data.payment_method_id,
  };

  const response = await fetch(`${API_BASE_URL}/payments/deposits/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Confirm API Error response:", errorText);
    throw new Error(
      `Failed to confirm deposit (${response.status}): ${errorText}`
    );
  }

  return response.json();
}

export async function getUserData(): Promise<UserMeResponse> {
  const token = getAuthToken();
  if (!token) {
    console.error("❌ No access_token found in localStorage");
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ /users/me API Error response:", errorText);
    throw new Error(
      `Failed to fetch user data (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();
  return result;
}

export function parseUserBalance(userData: UserMeResponse): UserBalance {
  let balances: UserBalance = {};

  if (
    userData.balance &&
    typeof userData.balance === "object" &&
    !Array.isArray(userData.balance)
  ) {
    balances = userData.balance as UserBalance;
  } else if (userData.balance && typeof userData.balance === "number") {
    balances = {
      USD: userData.balance,
      IDR: 0,
      EUR: 0,
    };
  } else if (userData.balances) {
    balances = userData.balances;
    console.log("💰 ✅ Using balances field:", balances);
  } else if (
    userData.usd_balance !== undefined ||
    userData.idr_balance !== undefined ||
    userData.eur_balance !== undefined
  ) {
    balances = {
      USD: userData.usd_balance || 0,
      IDR: userData.idr_balance || 0,
      EUR: userData.eur_balance || 0,
    };
  } else {
    console.warn("⚠️ No balance found in userData, using defaults");
    balances = { USD: 0, IDR: 0, EUR: 0 };
  }

  const finalBalances: UserBalance = {
    USD: Number(balances.USD) || 0,
    IDR: Number(balances.IDR) || 0,
    EUR: Number(balances.EUR) || 0,
  };

  return finalBalances;
}

export async function getBtcPrice(): Promise<BtcPriceResponse> {
  const token = getAuthToken();
  if (!token) {
    console.error("❌ No access_token found in localStorage");
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_BASE_URL}/finance/btc-price`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ /finance/btc-price API Error response:", errorText);
    throw new Error(
      `Failed to fetch BTC price (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();
  return result;
}

export async function swapUsdToBtc(data: SwapRequest): Promise<SwapResponse> {
  const token = getAuthToken();
  if (!token) {
    console.error("❌ No access_token found in localStorage");
    throw new Error("Authentication required. Please login first.");
  }

  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const requestBody = {
    amount: data.amount,
  };

  const response = await fetch(`${API_BASE_URL}/finance/swap`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Swap API Error response:", errorText);
    throw new Error(
      `Failed to swap USD to BTC (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();
  return result;
}

export interface StakeHistoryItem {
  transactionHash: string;
  blockNumber: string;
  amount: string;
}

export interface StakeHistoryResponse {
  success: boolean;
  data: StakeHistoryItem[];
}

export interface LendingHistoryResponse {
  success: boolean;
  data: StakeHistoryItem[];
}

export async function getStakeHistory(): Promise<StakeHistoryResponse> {
  const token = getAuthToken();
  if (!token) {
    console.error("❌ No access_token found in localStorage");
    throw new Error("Authentication required. Please login first.");
  }

  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}/finance/stake-history`, {
    method: "GET",
    headers: requestHeaders,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Stake History API Error response:", errorText);
    if (response.status === 500) {
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message === "Staking vault address not configured") {
          throw new Error(
            "Backend configuration error: Staking vault address not configured. Please contact support."
          );
        }
      } catch (parseError) {}
    }

    throw new Error(
      `Failed to fetch stake history (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();
  return result;
}

export async function getLendingHistory(): Promise<LendingHistoryResponse> {
  const token = getAuthToken();
  if (!token) {
    console.error("❌ No access_token found in localStorage");
    throw new Error("Authentication required. Please login first.");
  }

  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(
    `${API_BASE_URL}/finance/collateral-deposit-history`,
    {
      method: "GET",
      headers: requestHeaders,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Lending History API Error response:", errorText);

    if (response.status === 500) {
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message === "Lending vault address not configured") {
          throw new Error(
            "Backend configuration error: Staking vault address not configured. Please contact support."
          );
        }
      } catch (parseError) {}
    }

    throw new Error(
      `Failed to fetch stake history (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();
  return result;
}

export async function getLoanHistory(): Promise<LendingHistoryResponse> {
  const token = getAuthToken();
  if (!token) {
    console.error("❌ No access_token found in localStorage");
    throw new Error("Authentication required. Please login first.");
  }

  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log(
    "🔑 Using access_token for loan history:",
    token.substring(0, 40) + "..."
  );

  const response = await fetch(`${API_BASE_URL}/finance/loan-history`, {
    method: "GET",
    headers: requestHeaders,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ loan History API Error response:", errorText);

    if (response.status === 500) {
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message === "Loan vault address not configured") {
          throw new Error(
            "Backend configuration error: Staking vault address not configured. Please contact support."
          );
        }
      } catch (parseError) {}
    }

    throw new Error(
      `Failed to fetch loan history (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();
  return result;
}
