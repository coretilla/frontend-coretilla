type Currency = { code: string; name: string; symbol: string; rate: number };
export type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  symbol: string;
  amount: string;
  btcAmount: string;
  networkFee: number;
  estimatedTime: string;
  onConfirm: () => void;
};

export type Props2 = {
  currencies: Currency[];
  selectedCurrency: Currency;
  currentBalance: number;
  formData: { fromCurrency: string; amount: string };
  setFormData: (d: any) => void;
  btcAmount: string;
  networkFee: number;
  estimatedTime: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export type Balances = {
  USD: number;
  CORE: number;
  CORE_USD: number;
  WBTC: number;
  WBTC_USD: number;
};

export * from "./index";
