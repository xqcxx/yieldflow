export interface Strategy {
  id: string;
  name: string;
  apy: number;
  tvl: string;
  description: string;
  contract: string;
  disabled?: boolean;
  apySource?: string;
}

export function getAPYSourceInfo(strategyId: string): string {
  const sources: Record<string, string> = {
    'mock-vault': 'Simulated yield calculation',
    'zest-lending': 'Zest Protocol API',
    'bitflow-lp': 'Bitflow DEX analytics',
  };
  
  return sources[strategyId] || 'Unknown source';
}
