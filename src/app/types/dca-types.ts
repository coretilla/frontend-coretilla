export interface DCAData {
  fiatSource: string;
  amount: string;
  frequency: string;
  duration: string;
}

export interface SimulationResult {
  month: number;
  btcPrice: number;
  amountInvested: number;
  btcPurchased: number;
  totalBtc: number;
  totalInvested: number;
  currentValue: number;
}

export * from "./dca-types";
