import { mainnet, sepolia } from 'wagmi/chains';

export const CHAIN_CONFIG = {
  [mainnet.id]: {
    id: mainnet.id,
    name: mainnet.name,
    network: 'mainnet',
    nativeCurrency: mainnet.nativeCurrency,
    rpcUrls: {
      default: { http: mainnet.rpcUrls.default.http },
      public: { http: mainnet.rpcUrls.public.http },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://etherscan.io' },
    },
  },
  [sepolia.id]: {
    id: sepolia.id,
    name: sepolia.name,
    network: 'sepolia',
    nativeCurrency: sepolia.nativeCurrency,
    rpcUrls: {
      default: { http: sepolia.rpcUrls.default.http },
      public: { http: sepolia.rpcUrls.public.http },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
  },
} as const;

export const SUPPORTED_CHAINS = [mainnet.id, sepolia.id] as const;

export type ChainId = typeof SUPPORTED_CHAINS[number];

export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAINS.includes(chainId as ChainId);
}

export function getChainById(chainId: number) {
  return CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];
}
