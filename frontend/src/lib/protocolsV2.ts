export interface DeFiProtocol {
  id: string;
  name: string;
  apy: number;
  website: string;
}

export const PROTOCOLS_V2: DeFiProtocol[] = [
  { id: 'zest', name: 'Zest Protocol', apy: 15.5, website: 'https://zestprotocol.com' },
  { id: 'bitflow', name: 'Bitflow', apy: 18.2, website: 'https://bitflow.io' },
  { id: 'velar', name: 'Velar', apy: 16.8, website: 'https://velar.finance' },
];
