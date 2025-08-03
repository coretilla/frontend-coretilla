const API_BASE_URL = 'https://core-backend-production-0965.up.railway.app';

interface CreateDepositRequest {
  amount: number;
  currency: string;
  description: string;
}

interface CreateDepositResponse {
  deposit_id: number;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

interface ConfirmDepositRequest {
  payment_intent_id: string;
  payment_method_id: string;
}

interface ConfirmDepositResponse {
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
  wallet_address: string;
  balance?: UserBalance | number; // Support both object and number format
  balances?: UserBalance;
  // Support different field names
  usd_balance?: number;
  idr_balance?: number;
  eur_balance?: number;
}

import { getStoredAuth } from './auth';

function getAuthToken(): string | null {
  const { token } = getStoredAuth();
  console.log('🔑 Getting access_token for API call:', token ? `${token.substring(0, 30)}...` : 'null');
  return token;
}

export async function createDeposit(data: CreateDepositRequest): Promise<CreateDepositResponse> {
  console.log('🔄 Creating deposit with access_token Bearer auth:', data);
  
  const token = getAuthToken(); // Get access_token from /auth/signin
  if (!token) {
    console.error('❌ No access_token found in localStorage');
    throw new Error('Authentication required. Please login first.');
  }
  
  const requestHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Using access_token with Bearer prefix
  };

  console.log('🔑 Using access_token:', token.substring(0, 40) + '...');
  console.log('🔑 Full access_token for debugging:', token);
  
  const requestBody = {
    amount: data.amount,
    currency: data.currency,
    description: data.description,
  };
  
  console.log('📡 Deposit API Request (Access Token Bearer Auth):');
  console.log('- URL:', `${API_BASE_URL}/payments/deposits`);
  console.log('- Headers:', requestHeaders);
  console.log('- Body:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch(`${API_BASE_URL}/payments/deposits`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(requestBody),
  });

  console.log('📡 API Response status:', response.status);
  console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API Error response:', errorText);
    throw new Error(`Failed to create deposit (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('✅ API Success response:', result);
  return result;
}

export async function confirmDeposit(data: ConfirmDepositRequest): Promise<ConfirmDepositResponse> {
  console.log('🔄 Confirming deposit with access_token Bearer auth:', data);

  const token = getAuthToken();
  if (!token) {
    console.error('❌ No access_token found in localStorage');
    throw new Error('Authentication required. Please login first.');
  }

  const requestBody = {
    payment_intent_id: data.payment_intent_id,
    payment_method_id: data.payment_method_id,
  };

  const response = await fetch(`${API_BASE_URL}/payments/deposits/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Using access_token with Bearer prefix
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Confirm API Error response:', errorText);
    throw new Error(`Failed to confirm deposit (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function getUserData(): Promise<UserMeResponse> {
  console.log('👤 Fetching user data from /users/me...');
  
  const token = getAuthToken();
  if (!token) {
    console.error('❌ No access_token found in localStorage');
    throw new Error('Authentication required. Please login first.');
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('👤 /users/me response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ /users/me API Error response:', errorText);
    throw new Error(`Failed to fetch user data (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('✅ User data response:', result);
  return result;
}

export function parseUserBalance(userData: UserMeResponse): UserBalance {
  console.log('💰 Parsing user balance from userData:', userData);
  console.log('💰 userData.balance type:', typeof userData.balance);
  console.log('💰 userData.balance value:', userData.balance);
  
  // Try different possible balance formats
  let balances: UserBalance = {};
  
  if (userData.balance && typeof userData.balance === 'object' && !Array.isArray(userData.balance)) {
    // Format 1: { balance: { USD: 100, IDR: 150000, EUR: 85 } }
    balances = userData.balance as UserBalance;
    console.log('💰 ✅ Using balance object field:', balances);
  } else if (userData.balance && typeof userData.balance === 'number') {
    // Format 2: { balance: 1000 } - single number, assume USD
    balances = {
      USD: userData.balance,
      IDR: 0,
      EUR: 0,
    };
    console.log('💰 ✅ Using balance number field as USD:', balances);
    console.log('💰 ✅ Converted balance:', userData.balance, '→ USD:', balances.USD);
  } else if (userData.balances) {
    // Format 3: { balances: { USD: 100, IDR: 150000, EUR: 85 } }
    balances = userData.balances;
    console.log('💰 ✅ Using balances field:', balances);
  } else if (userData.usd_balance !== undefined || userData.idr_balance !== undefined || userData.eur_balance !== undefined) {
    // Format 4: { usd_balance: 100, idr_balance: 150000, eur_balance: 85 }
    balances = {
      USD: userData.usd_balance || 0,
      IDR: userData.idr_balance || 0,
      EUR: userData.eur_balance || 0,
    };
    console.log('💰 ✅ Using individual balance fields:', balances);
  } else {
    console.warn('⚠️ No balance found in userData, using defaults');
    balances = { USD: 0, IDR: 0, EUR: 0 };
  }
  
  // Ensure all currencies have default values
  const finalBalances: UserBalance = {
    USD: Number(balances.USD) || 0,
    IDR: Number(balances.IDR) || 0,
    EUR: Number(balances.EUR) || 0,
  };
  
  console.log('💰 ✅ Final parsed balances:', finalBalances);
  return finalBalances;
}