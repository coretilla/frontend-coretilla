import { DepositFormData } from "@/app/types/deposit-types";
import { UserBalance } from "@/app/types/api-types";
import { Transaction } from "@/app/types/deposit-types";

export interface AuthRequiredProps {
  authError?: string | null;
  onSignIn: () => void;
  isAuthenticating: boolean;
}
export interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: DepositFormData;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
}

export interface CurrentBalanceProps {
  balance: UserBalance;
  isLoading: boolean;
  onRefresh: () => void;
}

export interface DepositFormCardProps {
  formData: DepositFormData;
  onFormDataChange: (data: DepositFormData) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  onRefresh: () => void;
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}
export interface TransactionItemProps {
  transaction: Transaction;
  index: number;
}

export * from "./index";
