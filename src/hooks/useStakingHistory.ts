import { useState, useEffect, useCallback } from 'react';
import { getStakeHistory, StakeHistoryItem } from '@/lib/api';

export function useStakingHistory() {
  const [history, setHistory] = useState<StakeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getStakeHistory();
      
      if (result.success) {
        setHistory(result.data);
        console.log('📊 Staking history loaded:', result.data.length, 'items');
      } else {
        throw new Error('Failed to fetch staking history');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ Error fetching staking history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}