interface StrategyCardProps {
  name: string;
  apy: number;
  tvl: string;
  description: string;
  disabled?: boolean;
  onSelect: () => void;
}

export function StrategyCard({
  name,
  apy,
  tvl,
  description,
  disabled = false,
  onSelect,
}: StrategyCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border transition-all ${
        disabled
          ? 'border-slate-700 bg-slate-800/50 opacity-60'
          : 'border-slate-600 bg-slate-800 hover:border-blue-500 cursor-pointer'
      }`}
      onClick={disabled ? undefined : onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold">{name}</h3>
        {disabled && (
          <span className="px-2 py-1 text-xs bg-slate-700 rounded">
            Coming Soon
          </span>
        )}
      </div>
      
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      
      <div className="flex gap-6">
        <div>
          <div className="text-2xl font-bold text-green-400">{apy}%</div>
          <div className="text-xs text-slate-400">APY</div>
        </div>
        <div>
          <div className="text-2xl font-bold">${tvl}</div>
          <div className="text-xs text-slate-400">TVL</div>
        </div>
      </div>
    </div>
  );
}
