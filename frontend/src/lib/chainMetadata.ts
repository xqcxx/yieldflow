import { mainnet, sepolia } from 'wagmi/chains';

export const CHAIN_METADATA = {
  [mainnet.id]: {
    chainId: `0x${mainnet.id.toString(16)}`,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://eth-mainnet.g.alchemy.com/v2'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [sepolia.id]: {
    chainId: `0x${sepolia.id.toString(16)}`,
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
} as const;

export type ChainId = keyof typeof CHAIN_METADATA;

export function getChainMetadata(chainId: number) {
  return CHAIN_METADATA[chainId as ChainId];
}

export async function addNetworkToWallet(chainId: number) {
  const metadata = getChainMetadata(chainId);
  if (!metadata) return false;

  try {
    await window.ethereum?.request({
      method: 'wallet_addEthereumChain',
      params: [metadata],
    });
    return true;
  } catch (error) {
    console.error('Failed to add network:', error);
    return false;
  }
}
