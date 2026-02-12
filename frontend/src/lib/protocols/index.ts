import { ZestConfig, getZestConfig } from './zest';
import { BitflowConfig, getBitflowConfig } from './bitflow';
import { VelarConfig, getVelarConfig } from './velar';

export type ProtocolType = 'zest' | 'bitflow' | 'velar';

export interface ProtocolConfig {
  id: ProtocolType;
  name: string;
  description: string;
  apy: number;
  tvl: number;
  riskLevel: 'low' | 'medium' | 'high';
  website: string;
  docs: string;
  getConfig: (isMainnet: boolean) => ZestConfig | BitflowConfig | VelarConfig;
}

export const PROTOCOLS: ProtocolConfig[] = [
  {
    id: 'zest',
    name: 'Zest Protocol',
    description: 'High-yield lending protocol on Stacks',
    apy: 15.5,
    tvl: 500000,
    riskLevel: 'medium',
    website: 'https://zestprotocol.com',
    docs: 'https://docs.zestprotocol.com',
    getConfig: getZestConfig,
  },
  {
    id: 'bitflow',
    name: 'Bitflow',
    description: 'Decentralized liquidity marketplace',
    apy: 18.2,
    tvl: 250000,
    riskLevel: 'high',
    website: 'https://bitflow.io',
    docs: 'https://docs.bitflow.io',
    getConfig: getBitflowConfig,
  },
  {
    id: 'velar',
    name: 'Velar',
    description: 'Multi-chain DeFi aggregator',
    apy: 16.8,
    tvl: 350000,
    riskLevel: 'medium',
    website: 'https://velar.finance',
    docs: 'https://docs.velar.finance',
    getConfig: getVelarConfig,
  },
];

export function getProtocolById(id: ProtocolType): ProtocolConfig | undefined {
  return PROTOCOLS.find(p => p.id === id);
}

export function getAllProtocols(): ProtocolConfig[] {
  return PROTOCOLS;
}

export function getProtocolsByRisk(riskLevel: 'low' | 'medium' | 'high'): ProtocolConfig[] {
  return PROTOCOLS.filter(p => p.riskLevel === riskLevel);
}

export function sortByApy(protocols: ProtocolConfig[]): ProtocolConfig[] {
  return [...protocols].sort((a, b) => b.apy - a.apy);
}
