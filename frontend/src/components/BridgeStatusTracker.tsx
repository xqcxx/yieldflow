import React from 'react';
import { BridgeStatus } from '../../lib/bridgeStatus';

interface BridgeStatusTrackerProps {
  status: BridgeStatus | null;
  explorerUrl?: string;
  onRetry?: () => void;
}

export function BridgeStatusTracker({ status, explorerUrl, onRetry }: BridgeStatusTrackerProps) {
  if (!status) {
    return <div className="bridge-tracker loading">Waiting for status...</div>;
  }

  const statusMessages = {
    pending: 'Transaction pending...',
    processing: 'Processing bridge...',
    completed: 'Bridge completed!',
    failed: 'Bridge failed',
  };

  const statusColors = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
  };

  return (
    <div className="bridge-tracker">
      <div className="tracker-header">
        <span className={`status-badge ${statusColors[status.status]}`}>
          {statusMessages[status.status]}
        </span>
      </div>
      
      <div className="tracker-details">
        <div className="detail-row">
          <span>Amount</span>
          <span>{status.amount} USDC</span>
        </div>
        
        {status.stxTxId && (
          <div className="detail-row">
            <span>Stacks Tx</span>
            <span className="tx-hash">{status.stxTxId.slice(0, 8)}...{status.stxTxId.slice(-6)}</span>
          </div>
        )}
        
        {status.ethTxHash && (
          <div className="detail-row">
            <span>Ethereum Tx</span>
            <span className="tx-hash">{status.ethTxHash.slice(0, 8)}...{status.ethTxHash.slice(-6)}</span>
          </div>
        )}
        
        <div className="detail-row">
          <span>Recipient</span>
          <span>{status.recipient.slice(0, 6)}...{status.recipient.slice(-4)}</span>
        </div>
      </div>
      
      {explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="explorer-link">
          View on Explorer →
        </a>
      )}
      
      {status.status === 'failed' && onRetry && (
        <button onClick={onRetry} className="retry-button">
          Retry
        </button>
      )}
    </div>
  );
}
