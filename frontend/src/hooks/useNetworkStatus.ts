import { useAccount, useChainId, useNetwork } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export function useNetworkStatus() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { chain } = useNetwork();

  const isMainnet = chainId === mainnet.id;
  const isSepolia = chainId === sepolia.id;
  const isSupported = isMainnet || isSepolia;

  return {
    isConnected,
    chainId,
    chain,
    isMainnet,
    isSepolia,
    isSupported,
    networkName: isMainnet ? 'Ethereum Mainnet' : isSepolia ? 'Sepolia' : 'Unknown',
  };
}

export function useRequiredNetwork(requiredChainId: number = mainnet.id) {
  const { chainId, isConnected } = useAccount();
  const isCorrectNetwork = chainId === requiredChainId;

  return {
    isConnected,
    chainId,
    isCorrectNetwork,
    canInteract: isConnected && isCorrectNetwork,
  };
}
