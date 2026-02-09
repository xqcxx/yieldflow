interface GasFeeDisplayProps {
  gasPrice: string;
  totalCost: string;
  estimatedUSD?: string;
  isLoading: boolean;
  error: string | null;
}

function getGasPriceIndicator(gasPrice: number): { label: string; color: string } {
  if (gasPrice < 20) return { label: 'Low', color: 'text-green-400' };
  if (gasPrice < 50) return { label: 'Medium', color: 'text-yellow-400' };
  return { label: 'High', color: 'text-red-400' };
}

export function GasFeeDisplay({ 
  gasPrice, 
  totalCost,
  estimatedUSD = '0',
  isLoading, 
  error 
}: GasFeeDisplayProps) {
  if (error) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3 text-sm">
        <p className="text-yellow-400">⚠️ Gas estimation unavailable</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
      <h4 className="text-sm font-medium text-slate-300 mb-2">
        ⛽ Estimated Gas Fee
      </h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-slate-500 text-xs">Gas Price</p>
          <p className="text-slate-200 font-mono">{gasPrice} Gwei</p>
          <p className={`text-xs font-medium ${getGasPriceIndicator(parseFloat(gasPrice)).color}`}>
            {getGasPriceIndicator(parseFloat(gasPrice)).label}
          </p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Total Cost</p>
          <p className="text-slate-200 font-mono">{totalCost} ETH</p>
          <p className="text-xs text-slate-400">≈ ${estimatedUSD}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Updates every 10 seconds
      </p>
    </div>
  );
}
