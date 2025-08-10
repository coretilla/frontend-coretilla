export interface AuthRequiredProps {
  authError?: string | null;
  onSignIn: () => void;
  isAuthenticating: boolean;
}

export interface BalanceCardsProps {
  mBTCBalance: string;
  mUSDTBalance: string;
  collateralBalance: string;
  borrowedBalance: string;
}

export interface BorrowTabProps {
  borrowAmount: string;
  onBorrowAmountChange: (amount: string) => void;
  maxBorrowAmount: string;
  collateralBalance: string;
  isPending: boolean;
  isConfirming: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface DepositTabProps {
  collateralAmount: string;
  onCollateralAmountChange: (amount: string) => void;
  mBTCBalance: string;
  isPending: boolean;
  isConfirming: boolean;
  needsMBTCApproval: (amount: string) => boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface HealthMetricsProps {
  healthFactor: number;
  ltvRatio: number;
  maxLoanToValueRatio: any;
}

export interface RepayTabProps {
  repayAmount: string;
  onRepayAmountChange: (amount: string) => void;
  borrowedBalance: string;
  isPending: boolean;
  isConfirming: boolean;
  needsMUSDTApproval: (amount: string) => boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface HistoryItem {
  amount: string;
  btcAmount?: string;
  blockNumber: string;
  transactionHash: string;
}

export interface TransactionHistoryProps {
  isLoading: boolean;
  depositHistory: HistoryItem[];
  loanHistory: HistoryItem[];
}

export interface WithdrawTabProps {
  withdrawAmount: string;
  onWithdrawAmountChange: (amount: string) => void;
  collateralBalance: string;
  isPending: boolean;
  isConfirming: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export * from "./index";
