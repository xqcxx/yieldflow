export interface Strategy {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const STRATEGIES_V2: Strategy[] = [
  { id: 'mock-vault', name: 'YieldFlow Vault', apy: 12, tvl: 1000000, riskLevel: 'low' },
  { id: 'zest', name: 'Zest Protocol', apy: 15.5, tvl: 500000, riskLevel: 'medium' },
  { id: 'bitflow', name: 'Bitflow', apy: 18.2, tvl: 250000, riskLevel: 'high' },
  { id: 'velar', name: 'Velar', apy: 16.8, tvl: 350000, riskLevel: 'medium' },
];
