import { YieldDataPoint } from '../hooks/usePortfolio';

interface YieldChartProps {
  data: YieldDataPoint[];
}

export function YieldChart({ data }: YieldChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-800 rounded-lg">
        <p className="text-slate-400">No yield data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">Historical Yield (30 Days)</h3>
      
      <svg viewBox="0 0 100 100" className="w-full h-48" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <polyline
          points={`0,100 ${points} 100,100`}
          fill="url(#gradient)"
        />
        
        <polyline
          points={points}
          fill="none"
          stroke="#10b981"
          strokeWidth="0.5"
        />
      </svg>
      
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>30d ago</span>
        <span>Today</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <p className="text-slate-400">Lowest</p>
          <p className="font-mono font-bold text-white">${minValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-400">Highest</p>
          <p className="font-mono font-bold text-white">${maxValue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
