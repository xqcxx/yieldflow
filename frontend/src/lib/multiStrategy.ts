export interface MultiStrategyState {
  allocations: Record<string, number>;
  selectedStrategies: string[];
  rebalanceEnabled: boolean;
}

export const MULTI_STRATEGY_DEFAULT: MultiStrategyState = {
  allocations: {
    'mock-vault': 100,
  },
  selectedStrategies: ['mock-vault'],
  rebalanceEnabled: false,
};

export function calculateExpectedYield(
  allocations: Record<string, number>,
  strategies: { id: string; apy: number }[]
): number {
  let totalApy = 0;
  
  Object.entries(allocations).forEach(([strategyId, percentage]) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      totalApy += (percentage / 100) * strategy.apy;
    }
  });
  
  return totalApy;
}

export function getRiskScore(
  allocations: Record<string, number>,
  strategies: { id: string; riskLevel: 'low' | 'medium' | 'high' }[]
): number {
  const weights = { low: 1, medium: 2, high: 3 };
  let weightedSum = 0;
  
  Object.entries(allocations).forEach(([strategyId, percentage]) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      weightedSum += (percentage / 100) * weights[strategy.riskLevel];
    }
  });
  
  return weightedSum;
}
