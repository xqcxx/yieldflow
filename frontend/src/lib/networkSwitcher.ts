import { switchChain } from '@wagmi/core';
import { mainnet, sepolia } from 'wagmi/chains';

export async function switchToMainnet() {
  try {
    await switchChain({ chainId: mainnet.id });
    return true;
  } catch (error) {
    console.error('Failed to switch to mainnet:', error);
    return false;
  }
}

export async function switchToSepolia() {
  try {
    await switchChain({ chainId: sepolia.id });
    return true;
  } catch (error) {
    console.error('Failed to switch to Sepolia:', error);
    return false;
  }
}

export function getChainName(chainId: number): string {
  switch (chainId) {
    case mainnet.id:
      return 'Ethereum Mainnet';
    case sepolia.id:
      return 'Sepolia Testnet';
    default:
      return 'Unknown Network';
  }
}

export function isMainnet(chainId: number): boolean {
  return chainId === mainnet.id;
}

export function isSepolia(chainId: number): boolean {
  return chainId === sepolia.id;
}
