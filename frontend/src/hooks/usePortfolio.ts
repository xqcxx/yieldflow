import { useState, useEffect } from 'react';

export interface YieldDataPoint {
  timestamp: number;
  value: number;
  apy: number;
}

export interface PortfolioData {
  totalValue: number;
  totalYieldEarned: number;
  positions: Array<{
    strategyId: string;
    strategyName: string;
    amount: number;
    currentValue: number;
    yieldEarned: number;
    apy: number;
  }>;
  historicalYield: YieldDataPoint[];
}

// Simulated portfolio data fetching
const fetchPortfolioData = async (address: string): Promise<PortfolioData> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate simulated historical yield data (last 30 days)
  const historicalYield: YieldDataPoint[] = [];
  const now = Date.now();
  for (let i = 30; i >= 0; i--) {
    const dayTimestamp = now - (i * 24 * 60 * 60 * 1000);
    const baseValue = 1000 + (30 - i) * 15; // Growing value
    const variance = Math.random() * 20 - 10;
    historicalYield.push({
      timestamp: dayTimestamp,
      value: baseValue + variance,
      apy: 12 + (Math.random() * 4 - 2),
    });
  }
  
  return {
    totalValue: 1450.50,
    totalYieldEarned: 45.25,
    positions: [
      {
        strategyId: 'mock-vault',
        strategyName: 'YieldFlow Mock Vault',
        amount: 1000,
        currentValue: 1045.25,
        yieldEarned: 45.25,
        apy: 12.5,
      },
    ],
    historicalYield,
  };
};

export function usePortfolio(address: string | undefined) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const portfolioData = await fetchPortfolioData(address);
        setData(portfolioData);
        setError(null);
      } catch (err) {
        setError('Failed to load portfolio');
        console.error('Portfolio fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [address]);

  return {
    data,
    isLoading,
    error,
  };
}
