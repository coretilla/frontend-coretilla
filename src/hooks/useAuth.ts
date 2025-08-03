import { useState, useEffect } from 'react';
import { useSignMessage } from 'wagmi';
import { useWallet } from './useWallet';
import { signInWithWallet, getStoredAuth, clearAuth, getNonce } from '@/lib/auth';

export interface AuthState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  token: string | null;
  user: any;
  signature: string | null; // Store signature for API calls
  signIn: () => Promise<void>;
  signOut: () => void;
  error: string | null;
}

export function useAuth(): AuthState {
  const { address, isConnected } = useWallet();
  const { signMessageAsync } = useSignMessage();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check stored auth on mount
  useEffect(() => {
    const { token: storedToken, user: storedUser } = getStoredAuth();
    console.log('🔄 Checking stored auth on mount:');
    console.log('- storedToken:', storedToken ? `${storedToken.substring(0, 30)}...` : 'null');
    console.log('- storedUser:', storedUser);
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setIsAuthenticated(true);
      console.log('✅ JWT authentication restored from localStorage');
      console.log('🔑 JWT token ready for deposit API calls');
    } else {
      console.log('❌ No stored JWT authentication found - user needs to sign in');
    }
  }, []);

  // Clear auth if wallet disconnected
  useEffect(() => {
    if (!isConnected && isAuthenticated) {
      signOut();
    }
  }, [isConnected, isAuthenticated]);

  const signIn = async () => {
    if (!address || !isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // Step 1: Get fresh nonce from backend
      console.log('🔄 Getting fresh nonce for wallet:', address);
      const nonceData = await getNonce(address);
      console.log('✅ Fresh nonce obtained:', nonceData.nonce);
      console.log('⏰ Nonce timestamp:', new Date().toISOString());
      
      // Check if this is a fallback nonce (client-generated)
      const isFallbackNonce = nonceData.nonce.includes('-');

      // Step 2: Create a message to sign with nonce
      // Let's try different message formats to find the correct one
      const messageFormats = [
        nonceData.nonce, // Format 1: Just nonce
        `${address}:${nonceData.nonce}`, // Format 2: address:nonce  
        `Please sign this message to authenticate.\nNonce: ${nonceData.nonce}`, // Format 3: Simple auth message
        `Login to app with nonce ${nonceData.nonce}`, // Format 4: Login message
        `I want to login\nNonce: ${nonceData.nonce}`, // Format 5: Want to login
      ];
      
      const message = messageFormats[0]; // Try first format
      
      console.log('📝 Message formats available:', messageFormats);
      console.log('📝 Using message format:', message);
      console.log('📝 Wallet address:', address);
      console.log('📝 Nonce:', nonceData.nonce);

      // Step 3: Request signature from wallet
      const signature = await signMessageAsync({
        message,
      });

      console.log('🔐 Wallet signature obtained:', signature);
      console.log('⏱️ Time between nonce and signature:', Date.now() - Date.parse(new Date().toISOString()));

      // Step 4: Authenticate with backend immediately (no delay)
      console.log('🚀 Attempting authentication...');
      const result = await signInWithWallet(address, signature, nonceData.nonce);
      
      console.log('✅ Authentication successful:', result);
      console.log('🎯 Access Token for deposit API calls:', result.access_token ? `${result.access_token.substring(0, 30)}...` : 'No access_token');

      setToken(result.access_token); // Store access_token as token
      setUser({ 
        wallet_address: result.wallet_address,
        message: result.message 
      });
      setSignature(signature); // Keep signature for reference
      setIsAuthenticated(true);
      
      console.log('🔑 Authentication complete - Access token ready for deposit API calls!');
      console.log('📝 Access token will be used in Authorization: Bearer header');
      
    } catch (err) {
      console.error('❌ Authentication failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = () => {
    clearAuth();
    setToken(null);
    setUser(null);
    setSignature(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return {
    isAuthenticated,
    isAuthenticating,
    token,
    user,
    signature,
    signIn,
    signOut,
    error,
  };
}