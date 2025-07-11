import { useAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import { btcPriceAtom, btcPriceLoadingAtom, btcPriceErrorAtom, BTCPriceData } from './atoms';

// Multiple API endpoints for fallback
const API_ENDPOINTS = [
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
  'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
  'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'
];

// Mock data for fallback
const MOCK_BTC_DATA: BTCPriceData = {
  price: 67500,
  changePercent: 2.34,
  lastUpdated: Date.now()
};

export const useBTCPrice = () => {
  const [priceData, setPriceData] = useAtom(btcPriceAtom);
  const [isLoading, setIsLoading] = useAtom(btcPriceLoadingAtom);
  const [error, setError] = useAtom(btcPriceErrorAtom);

  const fetchFromCoinGecko = async (): Promise<BTCPriceData> => {
    const response = await fetch(API_ENDPOINTS[0], {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.bitcoin) {
      return {
        price: data.bitcoin.usd,
        changePercent: data.bitcoin.usd_24h_change || 0,
        lastUpdated: Date.now(),
      };
    }
    
    throw new Error('Invalid CoinGecko response format');
  };

  const fetchFromCoinbase = async (): Promise<BTCPriceData> => {
    const response = await fetch(API_ENDPOINTS[1]);
    
    if (!response.ok) {
      throw new Error(`Coinbase API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.data?.rates?.USD) {
      return {
        price: parseFloat(data.data.rates.USD),
        changePercent: 0, // Coinbase doesn't provide 24h change in this endpoint
        lastUpdated: Date.now(),
      };
    }
    
    throw new Error('Invalid Coinbase response format');
  };

  const fetchFromBinance = async (): Promise<BTCPriceData> => {
    const response = await fetch(API_ENDPOINTS[2]);
    
    if (!response.ok) {
      throw new Error(`Binance API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.lastPrice && data.priceChangePercent) {
      return {
        price: parseFloat(data.lastPrice),
        changePercent: parseFloat(data.priceChangePercent),
        lastUpdated: Date.now(),
      };
    }
    
    throw new Error('Invalid Binance response format');
  };

  const fetchBTCPrice = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use internal API route to avoid CORS issues
      const response = await fetch('/api/btc-price', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.data) {
          setPriceData(result.data);
          
          // Set informational message for non-primary sources
          if (result.source !== 'coingecko') {
            setError(`Using ${result.source} data${result.source === 'mock' ? ' - APIs unavailable' : ''}`);
          }
          return;
        }
      }
      
      throw new Error('Internal API failed');
      
    } catch (err) {
      // Final fallback - use mock data
      setPriceData(MOCK_BTC_DATA);
      setError('API unavailable - using mock data');
    } finally {
      setIsLoading(false);
    }
  }, [setPriceData, setIsLoading, setError]);

  // Auto-refresh every 60 seconds (reduced frequency to avoid rate limits)
  useEffect(() => {
    // Fetch immediately on mount
    fetchBTCPrice();
    
    // Set up interval for auto-refresh
    const interval = setInterval(fetchBTCPrice, 60000);
    
    return () => clearInterval(interval);
  }, [fetchBTCPrice]);

  // Manual refresh function
  const refreshPrice = useCallback(() => {
    fetchBTCPrice();
  }, [fetchBTCPrice]);

  return {
    priceData,
    isLoading,
    error,
    refreshPrice,
  };
};