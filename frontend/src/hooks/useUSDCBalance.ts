import { useReadContract, useAccount } from 'wagmi';
import { formatUnits, type Address } from 'viem';
import { SEPOLIA_USDC, ERC20_ABI } from '../lib/constants';

export function useUSDCBalance() {
  const { address } = useAccount();

  const { data: balance, isLoading, error, refetch } = useReadContract({
    address: SEPOLIA_USDC as Address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  const formattedBalance = balance ? formatUnits(balance, 6) : '0';
  const rawBalance = balance || 0n;

  return {
    balance: rawBalance,
    formattedBalance,
    isLoading,
    error,
    refetch,
    hasBalance: rawBalance > 0n,
  };
}
