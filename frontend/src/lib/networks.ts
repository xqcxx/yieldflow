import { mainnet, sepolia } from 'wagmi/chains';

export interface NetworkInfo {
  id: number;
  name: string;
  isTestnet: boolean;
  explorer: string;
  rpcUrl: string;
}

export const NETWORKS: Record<number, NetworkInfo> = {
  [mainnet.id]: {
    id: mainnet.id,
    name: 'Ethereum Mainnet',
    isTestnet: false,
    explorer: 'https://etherscan.io',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2',
  },
  [sepolia.id]: {
    id: sepolia.id,
    name: 'Sepolia Testnet',
    isTestnet: true,
    explorer: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2',
  },
};

export function getNetworkInfo(chainId: number): NetworkInfo | undefined {
  return NETWORKS[chainId];
}

export function getNetworkList(): NetworkInfo[] {
  return Object.values(NETWORKS);
}

export function isNetworkSupported(chainId: number): boolean {
  return chainId in NETWORKS;
}
