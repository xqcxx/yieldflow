import { useState, useEffect } from 'react';
import { BridgeStatus, getBridgeStatus, getBridgeExplorerUrl } from '../lib/bridgeStatus';

interface UseBridgeStatusOptions {
  stxTxId?: string;
  enabled?: boolean;
}

export function useBridgeStatus({ stxTxId, enabled = true }: UseBridgeStatusOptions) {
  const [status, setStatus] = useState<BridgeStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !stxTxId) {
      setStatus(null);
      return;
    }

    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const bridgeStatus = await getBridgeStatus(stxTxId);
        setStatus(bridgeStatus);
        setError(null);
      } catch (err) {
        setError('Failed to fetch bridge status');
        console.error('Bridge status error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    
    const interval = setInterval(fetchStatus, 10000);
    
    return () => clearInterval(interval);
  }, [stxTxId, enabled]);

  const explorerUrl = status ? getBridgeExplorerUrl(status) : '';

  return {
    status,
    isLoading,
    error,
    explorerUrl,
    refetch: () => stxTxId && getBridgeStatus(stxTxId).then(setStatus),
  };
}
