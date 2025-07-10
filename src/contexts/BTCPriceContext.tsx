"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BTCPriceData {
  price: number;
  change24h: number;
  changePercent: number;
  lastUpdate: string;
}

interface BTCPriceContextType {
  priceData: BTCPriceData | null;
  isLoading: boolean;
  error: string | null;
  refreshPrice: () => Promise<void>;
}

const BTCPriceContext = createContext<BTCPriceContextType | undefined>(undefined);

interface BTCPriceProviderProps {
  children: ReactNode;
}

export function BTCPriceProvider({ children }: BTCPriceProviderProps) {
  const [priceData, setPriceData] = useState<BTCPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBTCPrice = async () => {
    try {
      setError(null);
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const bitcoinData = data.bitcoin;
      if (!bitcoinData) {
        throw new Error('Invalid API response structure');
      }

      const newPriceData: BTCPriceData = {
        price: bitcoinData.usd,
        change24h: (bitcoinData.usd * bitcoinData.usd_24h_change) / 100,
        changePercent: bitcoinData.usd_24h_change,
        lastUpdate: new Date().toLocaleTimeString(),
      };

      setPriceData(newPriceData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch BTC price';
      setError(errorMessage);
      console.error('Error fetching BTC price:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBTCPrice();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchBTCPrice, 60000);

    return () => clearInterval(interval);
  }, []);

  const refreshPrice = async () => {
    setIsLoading(true);
    await fetchBTCPrice();
  };

  return (
    <BTCPriceContext.Provider value={{ priceData, isLoading, error, refreshPrice }}>
      {children}
    </BTCPriceContext.Provider>
  );
}

export function useBTCPrice() {
  const context = useContext(BTCPriceContext);
  if (context === undefined) {
    throw new Error('useBTCPrice must be used within a BTCPriceProvider');
  }
  return context;
}