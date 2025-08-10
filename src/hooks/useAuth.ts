import { useState, useEffect } from "react";
import { useSignMessage } from "wagmi";
import { useWallet } from "./useWallet";
import {
  signInWithWallet,
  getStoredAuth,
  clearAuth,
  getNonce,
} from "@/lib/auth";

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

  useEffect(() => {
    const checkAndRestoreAuth = async () => {
      const { token: storedToken, user: storedUser } = getStoredAuth();

      if (storedToken && storedUser) {
        try {
          const payload = JSON.parse(atob(storedToken.split(".")[1]));
          const isExpired = payload.exp && Date.now() >= payload.exp * 1000;

          if (isExpired) {
            console.log("⚠️ Token expired, clearing auth");
            clearAuth();
            setIsAuthenticated(false);
            return;
          }

          // Check if stored wallet address matches current connected wallet
          if (address && storedUser.wallet_address && 
              storedUser.wallet_address.toLowerCase() !== address.toLowerCase()) {
            console.log("⚠️ Different wallet connected, clearing auth and requiring new sign");
            clearAuth();
            setIsAuthenticated(false);
            return;
          }

          setToken(storedToken);
          setUser(storedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.log("❌ Invalid token format, clearing auth");
          clearAuth();
          setIsAuthenticated(false);
        }
      } else {
        console.log(
          "❌ No stored JWT authentication found - user needs to sign in"
        );
        setIsAuthenticated(false);
      }
    };

    checkAndRestoreAuth();
  }, [address]);

  useEffect(() => {
    if (!isConnected && isAuthenticated) {
      console.log("⚠️ Wallet disconnected but keeping authentication");
    } else if (isConnected && !isAuthenticated) {
      const { token: storedToken } = getStoredAuth();
      if (storedToken) {
        console.log("🔄 Wallet reconnected, checking stored auth...");
      }
    }
  }, [isConnected, isAuthenticated]);

  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp) {
        const expiryTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          console.log(
            "⚠️ Token expires soon, consider implementing refresh logic"
          );
        }

        const timeoutId = setTimeout(() => {
          console.log("⏰ Token expired, clearing auth");
          signOut();
        }, timeUntilExpiry);

        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      console.log("❌ Error parsing token for expiry check");
    }
  }, [token]);

  const signIn = async () => {
    if (!address || !isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // Step 1: Get fresh nonce from backend
      console.log("🔄 Getting fresh nonce for wallet:", address);
      const nonceData = await getNonce(address);
      console.log("✅ Fresh nonce obtained:", nonceData.nonce);
      console.log("⏰ Nonce timestamp:", new Date().toISOString());

      // Check if this is a fallback nonce (client-generated)
      const isFallbackNonce = nonceData.nonce.includes("-");

      // Step 2: Create a message to sign with nonce
      // Let's try different message formats to find the correct one
      const messageFormats = [
        nonceData.nonce, // Format 1: Just nonce
        `${address}:${nonceData.nonce}`, // Format 2: address:nonce
        `Please sign this message to authenticate.\nNonce: ${nonceData.nonce}`, // Format 3: Simple auth message
        `Login to app with nonce ${nonceData.nonce}`, // Format 4: Login message
        `I want to login\nNonce: ${nonceData.nonce}`, // Format 5: Want to login
      ];

      const message = messageFormats[0];

      const signature = await signMessageAsync({
        message,
      });

      console.log("🔐 Wallet signature obtained:", signature);
      console.log(
        "⏱️ Time between nonce and signature:",
        Date.now() - Date.parse(new Date().toISOString())
      );

      // Step 4: Authenticate with backend immediately (no delay)
      console.log("🚀 Attempting authentication...");
      const result = await signInWithWallet(
        address,
        signature,
        nonceData.nonce
      );

      console.log("✅ Authentication successful:", result);
      console.log(
        "🎯 Access Token for deposit API calls:",
        result.access_token
          ? `${result.access_token.substring(0, 30)}...`
          : "No access_token"
      );

      setToken(result.access_token); // Store access_token as token
      setUser({
        wallet_address: result.wallet_address,
        message: result.message,
      });
      setSignature(signature); // Keep signature for reference
      setIsAuthenticated(true);

      console.log(
        "🔑 Authentication complete - Access token ready for deposit API calls!"
      );
      console.log(
        "📝 Access token will be used in Authorization: Bearer header"
      );
    } catch (err) {
      console.error("❌ Authentication failed:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
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
