export interface AllocationSlider {
  strategyId: string;
  value: number;
  onChange: (value: number) => void;
}

export interface RebalancePlan {
  fromStrategy: string;
  toStrategy: string;
  amount: number;
}

export function calculateRebalance(
  currentAllocations: Record<string, number>,
  targetAllocations: Record<string, number>,
  totalValue: number
): RebalancePlan[] {
  const plans: RebalancePlan[] = [];
  
  Object.keys(targetAllocations).forEach(strategyId => {
    const current = currentAllocations[strategyId] || 0;
    const target = targetAllocations[strategyId];
    const diff = target - current;
    
    if (Math.abs(diff) > 1) { // 1% threshold
      const targetStrategy = Object.keys(targetAllocations).find(
        sId => (currentAllocations[sId] || 0) > targetAllocations[sId]
      );
      
      if (targetStrategy && diff > 0) {
        plans.push({
          fromStrategy: targetStrategy,
          toStrategy: strategyId,
          amount: (diff / 100) * totalValue,
        });
      }
    }
  });
  
  return plans;
}

export function validateAllocation(allocations: Record<string, number>): boolean {
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  return Math.abs(total - 100) < 0.01;
}

export function normalizeAllocations(allocations: Record<string, number>): Record<string, number> {
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  if (total === 0) return allocations;
  
  const normalized: Record<string, number> = {};
  Object.keys(allocations).forEach(key => {
    normalized[key] = (allocations[key] / total) * 100;
  });
  
  return normalized;
}
