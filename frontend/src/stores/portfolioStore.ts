import { create } from 'zustand';
import { Strategy } from '../lib/strategies';

export interface PortfolioPosition {
  strategyId: string;
  amount: number;
  shares: number;
  depositedAt: number;
}

interface PortfolioState {
  positions: PortfolioPosition[];
  totalValue: number;
  totalApy: number;
  
  // Actions
  addPosition: (strategyId: string, amount: number) => void;
  removePosition: (strategyId: string, amount: number) => void;
  rebalance: (allocations: Record<string, number>) => void;
  calculateTotalValue: () => number;
  calculateWeightedApy: () => number;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  positions: [],
  totalValue: 0,
  totalApy: 0,

  addPosition: (strategyId, amount) => {
    const { positions } = get();
    const existingIndex = positions.findIndex(p => p.strategyId === strategyId);
    
    if (existingIndex >= 0) {
      const updated = [...positions];
      updated[existingIndex] = {
        ...updated[existingIndex],
        amount: updated[existingIndex].amount + amount,
      };
      set({ positions: updated });
    } else {
      set({
        positions: [
          ...positions,
          {
            strategyId,
            amount,
            shares: amount,
            depositedAt: Date.now(),
          },
        ],
      });
    }
  },

  removePosition: (strategyId, amount) => {
    const { positions } = get();
    const updated = positions.map(p => {
      if (p.strategyId === strategyId) {
        return { ...p, amount: p.amount - amount };
      }
      return p;
    }).filter(p => p.amount > 0);
    
    set({ positions: updated });
  },

  rebalance: (allocations) => {
    // Rebalancing logic would be implemented here
    console.log('Rebalancing portfolio with allocations:', allocations);
  },

  calculateTotalValue: () => {
    const { positions } = get();
    return positions.reduce((total, pos) => total + pos.amount, 0);
  },

  calculateWeightedApy: () => {
    const { positions } = get();
    const totalValue = get().calculateTotalValue();
    if (totalValue === 0) return 0;
    
    let weightedSum = 0;
    positions.forEach(pos => {
      const weight = pos.amount / totalValue;
      // Would get APY from strategy config
      weightedSum += weight * 12; // Mock APY
    });
    
    return weightedSum;
  },
}));
