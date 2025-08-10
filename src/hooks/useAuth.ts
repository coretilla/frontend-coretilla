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
  signature: string | null;
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

          if (
            address &&
            storedUser.wallet_address &&
            storedUser.wallet_address.toLowerCase() !== address.toLowerCase()
          ) {
            console.log(
              "⚠️ Different wallet connected, clearing auth and requiring new sign"
            );
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
      const nonceData = await getNonce(address);
      const messageFormats = [
        nonceData.nonce,
        `${address}:${nonceData.nonce}`,
        `Please sign this message to authenticate.\nNonce: ${nonceData.nonce}`,
        `Login to app with nonce ${nonceData.nonce}`,
        `I want to login\nNonce: ${nonceData.nonce}`,
      ];

      const message = messageFormats[0];

      const signature = await signMessageAsync({
        message,
      });

      const result = await signInWithWallet(
        address,
        signature,
        nonceData.nonce
      );

      setToken(result.access_token);
      setUser({
        wallet_address: result.wallet_address,
        message: result.message,
      });
      setSignature(signature);
      setIsAuthenticated(true);
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
