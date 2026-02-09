import { useState, useEffect } from 'react';

export type BridgeStatus = 'idle' | 'pending' | 'confirming' | 'completed' | 'failed';

interface BridgeStatusData {
  status: BridgeStatus;
  confirmations: number;
  estimatedTime: number | null;
  txHash: string | null;
}

// Simulated bridge status API (in production, integrate with Circle xReserve API)
const checkBridgeStatus = async (depositTxHash: string): Promise<Partial<BridgeStatusData>> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate progressive status
  const elapsed = Date.now() % 300000; // 5 minute cycle
  
  if (elapsed < 30000) {
    return { status: 'pending', confirmations: 0, estimatedTime: 270 };
  } else if (elapsed < 150000) {
    return { status: 'confirming', confirmations: Math.floor(elapsed / 10000), estimatedTime: 150 };
  } else {
    return { status: 'completed', confirmations: 12, estimatedTime: 0 };
  }
};

export function useBridgeStatusPolling(depositTxHash: string | null) {
  const [status, setStatus] = useState<BridgeStatus>('idle');
  const [confirmations, setConfirmations] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!depositTxHash) {
      setStatus('idle');
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    let cancelled = false;

    const poll = async () => {
      while (!cancelled) {
        try {
          const statusData = await checkBridgeStatus(depositTxHash);
          
          if (statusData.status) setStatus(statusData.status);
          if (statusData.confirmations !== undefined) setConfirmations(statusData.confirmations);
          if (statusData.estimatedTime !== undefined) setEstimatedTime(statusData.estimatedTime);

          if (statusData.status === 'completed' || statusData.status === 'failed') {
            break;
          }

          await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10s
        } catch (error) {
          console.error('Bridge polling error:', error);
          await new Promise(resolve => setTimeout(resolve, 15000)); // Retry after 15s
        }
      }
      setIsPolling(false);
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [depositTxHash]);

  return {
    status,
    confirmations,
    estimatedTime,
    isPolling,
  };
}
