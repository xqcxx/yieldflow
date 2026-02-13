import { mainnet, sepolia } from 'wagmi/chains';

export const CONTRACT_ADDRESSES = {
  [mainnet.id]: {
    usdc: '0xA0b86a33E6441e0A421e56E4773C3C4b0Db7E5d0',
    xReserve: '0x008888878f94C0d87defdf0B07f46B93C1934442',
    xReserveBurn: '0x008888878f94C0d87defdf0B07f46B93C1934443',
  },
  [sepolia.id]: {
    usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    xReserve: '0x008888878f94C0d87defdf0B07f46B93C1934442',
    xReserveBurn: '0x008888878f94C0d87defdf0B07f46B93C1934443',
  },
} as const;

export type ChainId = keyof typeof CONTRACT_ADDRESSES;

export function getContractAddresses(chainId: number) {
  return CONTRACT_ADDRESSES[chainId as ChainId];
}

export function getUSDCAddress(chainId: number): string {
  return getContractAddresses(chainId)?.usdc || '';
}

export function getXReserveAddress(chainId: number): string {
  return getContractAddresses(chainId)?.xReserve || '';
}
