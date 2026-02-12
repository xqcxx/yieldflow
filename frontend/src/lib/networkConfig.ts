import { mainnet, sepolia } from 'wagmi/chains';

export interface NetworkConfig {
  name: string;
  chainId: number;
  isTestnet: boolean;
  usdcAddress: string;
  xReserveAddress: string;
  blockExplorer: string;
  rpcUrl: string;
}

export const NETWORKS: Record<number, NetworkConfig> = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    chainId: mainnet.id,
    isTestnet: false,
    usdcAddress: '0xA0b86a33E6441e0A421e56E4773C3C4b0Db7E5d0',
    xReserveAddress: '0x008888878f94C0d87defdf0B07f46B93C1934442',
    blockExplorer: 'https://etherscan.io',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2',
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    chainId: sepolia.id,
    isTestnet: true,
    usdcAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    xReserveAddress: '0x008888878f94C0d87defdf0B07f46B93C1934442',
    blockExplorer: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2',
  },
};

export function getNetworkConfig(chainId: number): NetworkConfig | undefined {
  return NETWORKS[chainId];
}

export function getSupportedChainIds(): number[] {
  return Object.keys(NETWORKS).map(Number);
}
