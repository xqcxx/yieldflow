import { useState, useEffect } from 'react';
import { usePublicClient, useEstimateGas } from 'wagmi';
import { formatGwei, type Address } from 'viem';

interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  totalCost: bigint;
  formattedGasPrice: string;
  formattedTotalCost: string;
  estimatedUSD: string;
  isLoading: boolean;
  error: string | null;
}

// Simplified ETH price (in production, fetch from API)
const ETH_PRICE_USD = 2400;

export function useGasEstimation(
  to: Address | undefined,
  data: `0x${string}` | undefined,
  value?: bigint
): GasEstimate {
  const [gasPrice, setGasPrice] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  const { data: gasLimit, error: gasLimitError } = useEstimateGas({
    to,
    data,
    value,
  });

  useEffect(() => {
    if (gasLimitError) {
      setError('Unable to estimate gas limit');
      console.error('Gas limit estimation error:', gasLimitError);
    }
  }, [gasLimitError]);

  useEffect(() => {
    const fetchGasPrice = async () => {
      if (!publicClient) return;
      
      setIsLoading(true);
      try {
        const price = await publicClient.getGasPrice();
        setGasPrice(price);
        setError(null);
      } catch (err) {
        setError('Failed to fetch gas price');
        console.error('Gas price fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGasPrice();
    // Update every 10s for real-time pricing
    const interval = setInterval(fetchGasPrice, 10000);
    
    return () => clearInterval(interval);
  }, [publicClient]);

  const totalCost = gasLimit && gasPrice ? gasLimit * gasPrice : 0n;
  const formattedGasPrice = gasPrice ? formatGwei(gasPrice) : '0';
  const formattedTotalCost = totalCost 
    ? (Number(totalCost) / 1e18).toFixed(6) 
    : '0';
  const estimatedUSD = totalCost 
    ? ((Number(totalCost) / 1e18) * ETH_PRICE_USD).toFixed(2)
    : '0';

  return {
    gasLimit: gasLimit || 0n,
    gasPrice,
    totalCost,
    formattedGasPrice,
    formattedTotalCost,
    estimatedUSD,
    isLoading,
    error,
  };
}
