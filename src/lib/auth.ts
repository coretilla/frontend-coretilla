import { useWallet } from '@/hooks/useWallet';

const API_BASE_URL = 'https://core-backend-production-0965.up.railway.app';

interface NonceResponse {
  nonce: string;
  expires_at?: string; // Optional since actual response only has nonce
}

interface SignInRequest {
  wallet_address: string; // signin endpoint expects wallet_address
  signature: string;
}

interface SignInResponse {
  message: string;
  wallet_address: string;
  access_token: string;
}

export async function getNonce(walletAddress: string): Promise<NonceResponse> {
  try {
    // Use GET method for nonce endpoint with walletAddress query parameter (not wallet_address)
    const response = await fetch(`${API_BASE_URL}/auth/nonce?walletAddress=${encodeURIComponent(walletAddress)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json();
    }

    // If endpoint doesn't exist (404) or has issues, fallback to client-side nonce
    if (response.status === 404 || response.status === 400) {
      console.log('⚠️ Nonce endpoint not available, generating client-side nonce');
      const clientNonce = generateClientNonce();
      return {
        nonce: clientNonce,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      };
    }

    const errorText = await response.text();
    throw new Error(`Failed to get nonce (${response.status}): ${errorText}`);
  } catch (error) {
    // If network error or API unavailable, generate client-side nonce
    console.log('⚠️ Nonce API unavailable, generating client-side nonce');
    const clientNonce = generateClientNonce();
    return {
      nonce: clientNonce,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
    };
  }
}

function generateClientNonce(): string {
  // Generate a random nonce - combination of timestamp and random string
  const timestamp = Date.now().toString();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
}

export async function signInWithWallet(walletAddress: string, signature: string, nonce: string): Promise<SignInResponse> {
  const requestBody = {
    wallet_address: walletAddress,
    signature: signature,
  };
  
  console.log('🔄 Signing in with wallet:');
  console.log('📍 Wallet Address:', walletAddress);
  console.log('📍 Signature:', signature);
  console.log('📍 Nonce (for reference):', nonce);
  console.log('📍 Request Body:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('✅ SignIn response:', result);
  console.log('🔍 SignIn response keys:', Object.keys(result));
  console.log('🔍 Access token field exists:', 'access_token' in result);
  console.log('🔍 Access token value:', result.access_token);
  
  // Store access_token as JWT token in localStorage
  if (result.access_token) {
    console.log('💾 Storing access_token as JWT token:', result.access_token.substring(0, 30) + '...');
    localStorage.setItem('jwt_token', result.access_token);
    localStorage.setItem('user_data', JSON.stringify({
      wallet_address: result.wallet_address,
      message: result.message
    }));
    console.log('✅ Access token stored successfully');
    
    // Verify storage immediately
    const storedToken = localStorage.getItem('jwt_token');
    console.log('🔍 Verification - access_token stored:', storedToken ? storedToken.substring(0, 30) + '...' : 'null');
  } else {
    console.error('❌ No access_token in response:', result);
    console.error('❌ Response structure:', JSON.stringify(result, null, 2));
  }
  
  return result;
}

export function getStoredAuth(): { token: string | null; user: any } {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  
  const token = localStorage.getItem('jwt_token');
  const userData = localStorage.getItem('user_data');
  
  console.log('🔍 Getting stored auth:');
  console.log('- Raw token from localStorage:', token);
  console.log('- Raw user data from localStorage:', userData);
  
  return {
    token,
    user: userData ? JSON.parse(userData) : null,
  };
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }
}

export function isAuthenticated(): boolean {
  const { token } = getStoredAuth();
  return !!token;
}

// Debug function to test access token validity with /users/me
export async function testAccessToken(): Promise<void> {
  const { token } = getStoredAuth();
  
  if (!token) {
    console.log('❌ No access token found');
    return;
  }
  
  console.log('🧪 Testing access token validity with /users/me...');
  console.log('🔑 Access Token:', `${token.substring(0, 50)}...`);
  console.log('🔑 Full Access Token:', token);
  
  try {
    // First test: Check /users/me endpoint
    console.log('👤 Testing /users/me endpoint...');
    const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('👤 /users/me response status:', userResponse.status);
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User found in system:', userData);
      console.log('👤 User ID:', userData.id || userData.user_id);
      console.log('👤 Wallet:', userData.wallet_address || userData.address);
    } else {
      const errorText = await userResponse.text();
      console.log('❌ /users/me failed:', errorText);
      
      if (userResponse.status === 401) {
        console.log('❌ Access token is invalid or expired');
        return;
      } else if (userResponse.status === 404) {
        console.log('❌ User not found - need to register user first');
        return;
      }
    }
    
    // Second test: Try deposit endpoint (only if /users/me succeeds)
    if (userResponse.ok) {
      console.log('💰 Testing /payments/deposits endpoint...');
      const depositResponse = await fetch(`${API_BASE_URL}/payments/deposits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: 1,
          currency: 'usd', 
          description: 'Test token validity'
        }),
      });
      
      console.log('💰 /payments/deposits response status:', depositResponse.status);
      
      if (depositResponse.status === 400) {
        console.log('✅ Deposit endpoint accessible (400 is expected for test data)');
      } else if (depositResponse.status === 404) {
        console.log('❌ User not found in payment system despite /users/me working');
      } else {
        console.log('✅ Deposit endpoint response:', depositResponse.status);
      }
      
      const depositText = await depositResponse.text();
      console.log('💰 Deposit test response:', depositText);
    }
    
  } catch (error) {
    console.error('❌ Access token test failed:', error);
  }
}

// Function to decode JWT token payload (for debugging)
export function decodeJWTPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Debug function to analyze current access token
export function analyzeAccessToken(): void {
  const { token } = getStoredAuth();
  
  if (!token) {
    console.log('❌ No access token to analyze');
    return;
  }
  
  console.log('🔍 Access Token Analysis:');
  console.log('- Raw token:', token);
  console.log('- Token length:', token.length);
  console.log('- Token parts:', token.split('.').length);
  
  const payload = decodeJWTPayload(token);
  if (payload) {
    console.log('- Decoded payload:', payload);
    console.log('- User ID/Subject:', payload.sub || payload.user_id || payload.userId);
    console.log('- Wallet address in token:', payload.wallet_address || payload.address);
    console.log('- Issued at:', payload.iat ? new Date(payload.iat * 1000) : 'Not found');
    console.log('- Expires at:', payload.exp ? new Date(payload.exp * 1000) : 'Not found');
    console.log('- Is expired:', payload.exp ? Date.now() > payload.exp * 1000 : 'Unknown');
  }
}

// Legacy alias for backward compatibility
export const testJWTToken = testAccessToken;