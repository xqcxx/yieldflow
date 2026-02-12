import { useAccount, useChainId } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export function useNetworkCheck() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  
  const isMainnet = chainId === mainnet.id;
  const isSupported = chainId === 1 || chainId === 11155111;
  
  return {
    isConnected,
    chainId,
    isMainnet,
    isSupported,
    networkName: isMainnet ? 'Ethereum Mainnet' : chainId === 11155111 ? 'Sepolia' : 'Unknown',
  };
}
