export interface BridgeStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stxTxId?: string;
  ethTxHash?: string;
  amount: number;
  recipient: string;
  timestamp: number;
  lastUpdated: number;
}

export async function getBridgeStatus(
  stxTxId: string
): Promise<BridgeStatus> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    status: 'processing',
    stxTxId,
    amount: 100,
    recipient: '0x...',
    timestamp: Date.now(),
    lastUpdated: Date.now(),
  };
}

export function getBridgeExplorerUrl(status: BridgeStatus): string {
  if (status.ethTxHash) {
    return `https://etherscan.io/tx/${status.ethTxHash}`;
  }
  if (status.stxTxId) {
    return `https://explorer.stacks.co/txid/${status.stxTxId}`;
  }
  return '';
}
