export interface Strategy {
  id: string;
  name: string;
  description: string;
  apy: number;
  riskLevel: 'low' | 'medium' | 'high';
  tvl: number;
  contractAddress: string;
  isActive: boolean;
}

export const STRATEGIES: Strategy[] = [
  {
    id: 'mock-vault',
    name: 'YieldFlow Mock Vault',
    description: 'Conservative yield generation with 12% APY',
    apy: 12,
    riskLevel: 'low',
    tvl: 1000000,
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-vault',
    isActive: true,
  },
  {
    id: 'zest-protocol',
    name: 'Zest Protocol',
    description: 'High-yield Stacks DeFi strategy',
    apy: 15,
    riskLevel: 'medium',
    tvl: 500000,
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.zest',
    isActive: false,
  },
  {
    id: 'bitflow',
    name: 'Bitflow',
    description: 'Liquidity provision strategy',
    apy: 18,
    riskLevel: 'high',
    tvl: 250000,
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bitflow',
    isActive: false,
  },
];

export function getStrategyById(id: string): Strategy | undefined {
  return STRATEGIES.find((s) => s.id === id);
}

export function getActiveStrategies(): Strategy[] {
  return STRATEGIES.filter((s) => s.isActive);
}
