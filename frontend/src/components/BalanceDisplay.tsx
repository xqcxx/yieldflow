interface BalanceDisplayProps {
  balance: string;
  isLoading: boolean;
  error: Error | null;
}

export function BalanceDisplay({ balance, isLoading, error }: BalanceDisplayProps) {
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-600 rounded-lg p-3 text-sm">
        <p className="text-red-400">Failed to load balance</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">Your USDC Balance</span>
        <span className="text-lg font-mono font-bold text-white">
          {parseFloat(balance).toFixed(2)} USDC
        </span>
      </div>
    </div>
  );
}
