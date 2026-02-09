import { useState, useEffect } from 'react';

interface APYData {
  apy: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Simulated protocol APY fetching (in production, fetch from actual DeFi protocols)
const fetchProtocolAPY = async (protocolId: string): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock APY data with some variance
  const baseAPYs: Record<string, number> = {
    'mock-vault': 12.0,
    'zest-lending': 8.5,
    'bitflow-lp': 18.2,
  };
  
  const variance = (Math.random() - 0.5) * 2; // +/- 1%
  return (baseAPYs[protocolId] || 0) + variance;
};

export function useDynamicAPY(protocolId: string): APYData {
  const [apy, setApy] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAPY = async () => {
      try {
        setIsLoading(true);
        const fetchedAPY = await fetchProtocolAPY(protocolId);
        setApy(fetchedAPY);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError('Failed to fetch APY');
        console.error('APY fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAPY();
    
    // Refresh APY every 60 seconds
    const interval = setInterval(fetchAPY, 60000);
    
    return () => clearInterval(interval);
  }, [protocolId]);

  return {
    apy,
    isLoading,
    error,
    lastUpdated,
  };
}
