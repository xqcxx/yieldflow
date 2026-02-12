import { useState, useEffect } from 'react';
import { getZapOutQuote, executeZapOut, ZapOutConfig, ZapOutQuote } from '../lib/zapOut';
import { useAccount, useChainId } from 'wagmi';

export function useZapOut() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [quote, setQuote] = useState<ZapOutQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    stxTxId?: string;
    ethTxHash?: string;
  } | null>(null);

  const isMainnet = chainId === 1;

  const fetchQuote = async (amount: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const zapOutQuote = await getZapOutQuote(amount, isMainnet);
      setQuote(zapOutQuote);
    } catch (err) {
      setError('Failed to fetch quote');
      console.error('Quote error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const execute = async (config: ZapOutConfig) => {
    try {
      setIsLoading(true);
      setError(null);
      const executionResult = await executeZapOut(config);
      setResult(executionResult);
      return executionResult;
    } catch (err) {
      const errorMsg = 'Failed to execute Zap Out';
      setError(errorMsg);
      console.error('Execute error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setQuote(null);
    setError(null);
    setResult(null);
  };

  return {
    address,
    isMainnet,
    quote,
    isLoading,
    error,
    result,
    fetchQuote,
    execute,
    reset,
  };
}
