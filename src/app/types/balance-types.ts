export interface BalanceCardProps {
  title: string;
  amount: string;
  symbol: string;
  change?: {
    value: number;
    percentage: number;
    period: string;
  };
  icon?: React.ReactNode;
  className?: string;
}


export * from "./balance-types";