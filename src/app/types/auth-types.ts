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

export interface NonceResponse {
  nonce: string;
  expires_at?: string;
}
export interface SignInResponse {
  message: string;
  wallet_address: string;
  access_token: string;
}

export * from "./auth-types";
