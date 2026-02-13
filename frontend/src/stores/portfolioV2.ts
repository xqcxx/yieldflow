import { create } from 'zustand';

interface PortfolioStateV2 {
  allocations: Record<string, number>;
  addAllocation: (strategyId: string, amount: number) => void;
}

export const usePortfolioStoreV2 = create<PortfolioStateV2>((set) => ({
  allocations: {},
  addAllocation: (strategyId, amount) => set((state) => ({
    allocations: { ...state.allocations, [strategyId]: amount }
  })),
}));
