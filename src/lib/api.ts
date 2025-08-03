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