const API_BASE_URL = "https://core-backend-production-0965.up.railway.app";

interface NonceResponse {
  nonce: string;
  expires_at?: string;
}

interface SignInResponse {
  message: string;
  wallet_address: string;
  access_token: string;
}

export async function getNonce(walletAddress: string): Promise<NonceResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/nonce?walletAddress=${encodeURIComponent(
        walletAddress
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      return response.json();
    }

    if (response.status === 404 || response.status === 400) {
      const clientNonce = generateClientNonce();
      return {
        nonce: clientNonce,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      };
    }

    const errorText = await response.text();
    throw new Error(`Failed to get nonce (${response.status}): ${errorText}`);
  } catch (error) {
    const clientNonce = generateClientNonce();
    return {
      nonce: clientNonce,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
  }
}

function generateClientNonce(): string {
  const timestamp = Date.now().toString();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
}

export async function signInWithWallet(
  walletAddress: string,
  signature: string,
  nonce: string
): Promise<SignInResponse> {
  const requestBody = {
    wallet_address: walletAddress,
    signature: signature,
  };

  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed (${response.status}): ${errorText}`);
  }

  const result = await response.json();

  if (result.access_token) {
    localStorage.setItem("jwt_token", result.access_token);
    localStorage.setItem(
      "user_data",
      JSON.stringify({
        wallet_address: result.wallet_address,
        message: result.message,
      })
    );

    const storedToken = localStorage.getItem("jwt_token");
    console.log(
      "🔍 Verification - access_token stored:",
      storedToken ? storedToken.substring(0, 30) + "..." : "null"
    );
  } else {
    console.error("❌ No access_token in response:", result);
    console.error("❌ Response structure:", JSON.stringify(result, null, 2));
  }

  return result;
}

export function getStoredAuth(): { token: string | null; user: any } {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = localStorage.getItem("jwt_token");
  const userData = localStorage.getItem("user_data");

  return {
    token,
    user: userData ? JSON.parse(userData) : null,
  };
}

export function clearAuth(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_data");
  }
}

export function isAuthenticated(): boolean {
  const { token } = getStoredAuth();
  return !!token;
}

export async function testAccessToken(): Promise<void> {
  const { token } = getStoredAuth();

  if (!token) {
    console.log("❌ No access token found");
    return;
  }

  try {
    const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
    } else {
      const errorText = await userResponse.text();

      if (userResponse.status === 401) {
        return;
      } else if (userResponse.status === 404) {
        return;
      }
    }

    if (userResponse.ok) {
      const depositResponse = await fetch(`${API_BASE_URL}/payments/deposits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: 1,
          currency: "usd",
          description: "Test token validity",
        }),
      });
      if (depositResponse.status === 400) {
      } else if (depositResponse.status === 404) {
        console.log(
          "❌ User not found in payment system despite /users/me working"
        );
      } else {
      }

      const depositText = await depositResponse.text();
      console.log("💰 Deposit test response:", depositText);
    }
  } catch (error) {
    console.error("❌ Access token test failed:", error);
  }
}

export function decodeJWTPayload(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export function analyzeAccessToken(): void {
  const { token } = getStoredAuth();

  if (!token) {
    console.log("❌ No access token to analyze");
    return;
  }

  const payload = decodeJWTPayload(token);
  if (payload) {
    console.log("- Decoded payload:", payload);
    console.log(
      "- User ID/Subject:",
      payload.sub || payload.user_id || payload.userId
    );
    console.log(
      "- Wallet address in token:",
      payload.wallet_address || payload.address
    );
    console.log(
      "- Issued at:",
      payload.iat ? new Date(payload.iat * 1000) : "Not found"
    );
    console.log(
      "- Expires at:",
      payload.exp ? new Date(payload.exp * 1000) : "Not found"
    );
    console.log(
      "- Is expired:",
      payload.exp ? Date.now() > payload.exp * 1000 : "Unknown"
    );
  }
}
export const testJWTToken = testAccessToken;
