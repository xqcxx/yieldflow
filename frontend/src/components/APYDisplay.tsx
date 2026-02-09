interface APYDisplayProps {
  apy: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function APYDisplay({ apy, isLoading, error, lastUpdated }: APYDisplayProps) {
  if (error) {
    return (
      <div className="text-2xl font-bold text-slate-400" title="Failed to load APY">
        ---%
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-24"></div>
      </div>
    );
  }

  const timeSinceUpdate = lastUpdated 
    ? Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
    : null;

  // Determine color based on APY value
  const getAPYColor = (value: number) => {
    if (value >= 15) return 'text-green-400';
    if (value >= 10) return 'text-emerald-400';
    if (value >= 5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div>
      <div className={`text-2xl font-bold ${getAPYColor(apy)}`}>
        {apy.toFixed(2)}%
      </div>
      {timeSinceUpdate !== null && timeSinceUpdate < 120 && (
        <div className="text-xs text-slate-500 mt-1">
          Updated {timeSinceUpdate}s ago
        </div>
      )}
    </div>
  );
}
