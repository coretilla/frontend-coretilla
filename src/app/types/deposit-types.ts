export interface DepositFormData {
  currency: string;
  amount: string;
  paymentMethod: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  description: string;
  createdAt: string;
}

export interface TransactionResponse {
  success?: boolean;
  data?: Transaction[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export * from "./deposit-types";
