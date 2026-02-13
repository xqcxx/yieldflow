import { mainnet, sepolia } from 'wagmi/chains';

export interface GasSettings {
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}

export async function estimateGasForMainnet(): Promise<GasSettings> {
  return {
    gasLimit: 21000n,
    maxFeePerGas: 100000000000n,
    maxPriorityFeePerGas: 2000000000n,
  };
}

export async function estimateGasForSepolia(): Promise<GasSettings> {
  return {
    gasLimit: 21000n,
    maxFeePerGas: 2000000000n,
    maxPriorityFeePerGas: 500000000n,
  };
}

export function getGasSettings(chainId: number): Promise<GasSettings> {
  if (chainId === mainnet.id) {
    return estimateGasForMainnet();
  }
  return estimateGasForSepolia();
}

export function getDefaultGasLimit(operation: 'transfer' | 'approve' | 'swap'): bigint {
  switch (operation) {
    case 'transfer':
      return 21000n;
    case 'approve':
      return 50000n;
    case 'swap':
      return 150000n;
    default:
      return 65000n;
  }
}
