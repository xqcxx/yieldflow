interface APYDisplayProps {
  apy: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function APYDisplay({ apy, isLoading, error, lastUpdated }: APYDisplayProps) {
  if (error) {
    return (
      <div className="text-2xl font-bold text-slate-400">
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

  return (
    <div>
      <div className="text-2xl font-bold text-green-400">
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
