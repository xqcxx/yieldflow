import { useState, useEffect, useMemo } from 'react';
import { STRATEGIES } from '../lib/strategies';

export interface YieldDataPoint {
  timestamp: number;
  value: number;
  apy: number;
}

export interface PortfolioPosition {
  strategyId: string;
  strategyName: string;
  amount: number;
  currentValue: number;
  yieldEarned: number;
  apy: number;
  percentage: number;
}

export interface PortfolioData {
  totalValue: number;
  totalYieldEarned: number;
  positions: PortfolioPosition[];
  historicalYield: YieldDataPoint[];
  allocation: Record<string, number>;
  averageApy: number;
}

const fetchPortfolioData = async (address: string): Promise<PortfolioData> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const historicalYield: YieldDataPoint[] = [];
  const now = Date.now();
  for (let i = 30; i >= 0; i--) {
    const dayTimestamp = now - (i * 24 * 60 * 60 * 1000);
    const baseValue = 1000 + (30 - i) * 15;
    const variance = Math.random() * 20 - 10;
    historicalYield.push({
      timestamp: dayTimestamp,
      value: baseValue + variance,
      apy: 12 + (Math.random() * 4 - 2),
    });
  }
  
  const positions: PortfolioPosition[] = [
    {
      strategyId: 'mock-vault',
      strategyName: 'YieldFlow Mock Vault',
      amount: 1000,
      currentValue: 1045.25,
      yieldEarned: 45.25,
      apy: 12.5,
      percentage: 100,
    },
  ];

  const allocation: Record<string, number> = {
    'mock-vault': 100,
  };

  return {
    totalValue: 1045.25,
    totalYieldEarned: 45.25,
    positions,
    historicalYield,
    allocation,
    averageApy: 12.5,
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
    
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [address]);

  return {
    data,
    isLoading,
    error,
  };
}

export function useMultiStrategyPortfolio(address: string | undefined) {
  const { data, isLoading, error } = usePortfolio(address);
  
  const availableStrategies = useMemo(() => {
    return STRATEGIES.filter(s => s.isActive);
  }, []);

  const diversificationScore = useMemo(() => {
    if (!data || data.positions.length === 0) return 0;
    
    const numStrategies = data.positions.length;
    if (numStrategies === 1) return 100;
    
    // Simple diversification score
    const variance = data.positions.reduce((sum, pos) => {
      const deviation = pos.percentage - (100 / numStrategies);
      return sum + (deviation * deviation);
    }, 0) / numStrategies;
    
    return Math.max(0, 100 - variance);
  }, [data]);

  return {
    data,
    isLoading,
    error,
    availableStrategies,
    diversificationScore,
    positionCount: data?.positions.length || 0,
  };
}
