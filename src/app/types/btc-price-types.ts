export interface BTCPriceData {
  price: number;
  change24h: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  lastUpdate: string;
}

export interface BTCPriceProps {
    className?: string;
    showDropdown?: boolean;
  }


export * from "./btc-price-types";