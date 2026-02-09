import { BridgeStatus } from '../hooks/useBridgeStatusPolling';

interface BridgeStatusDisplayProps {
  status: BridgeStatus;
  confirmations: number;
  estimatedTime: number | null;
}

export function BridgeStatusDisplay({ 
  status, 
  confirmations, 
  estimatedTime 
}: BridgeStatusDisplayProps) {
  const formatTime = (seconds: number | null): string => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { icon: '⏳', text: 'Waiting for attestation...', color: 'text-yellow-400' };
      case 'confirming':
        return { icon: '🔄', text: 'Confirming on Stacks...', color: 'text-blue-400' };
      case 'completed':
        return { icon: '✅', text: 'USDCx arrived!', color: 'text-green-400' };
      case 'failed':
        return { icon: '❌', text: 'Bridge failed', color: 'text-red-400' };
      default:
        return { icon: '⏸️', text: 'Idle', color: 'text-slate-400' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{statusInfo.icon}</span>
        <span className={`text-lg font-medium ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      </div>
      
      {(status === 'pending' || status === 'confirming') && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Confirmations:</span>
            <span className="text-white font-mono">{confirmations}/12</span>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(confirmations / 12) * 100}%` }}
            />
          </div>
          
          {estimatedTime !== null && (
            <div className="flex justify-between">
              <span className="text-slate-400">Est. Time:</span>
              <span className="text-white">{formatTime(estimatedTime)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
