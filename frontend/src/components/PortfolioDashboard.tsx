import { useAccount } from 'wagmi';
import { usePortfolio } from '../hooks/usePortfolio';
import { YieldChart } from './YieldChart';

export function PortfolioDashboard() {
  const { address } = useAccount();
  const { data, isLoading, error } = usePortfolio(address);

  if (!address) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
        <p className="text-slate-400">Connect your wallet to view portfolio</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-32 bg-slate-700 rounded"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
        <p className="text-red-400">{error || 'Failed to load portfolio'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-sm text-slate-400 mb-2">Total Value</h3>
          <p className="text-3xl font-bold">${data.totalValue.toFixed(2)}</p>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-sm text-slate-400 mb-2">Total Yield Earned</h3>
          <p className="text-3xl font-bold text-green-400">
            +${data.totalYieldEarned.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-sm text-slate-400 mb-2">Active Positions</h3>
          <p className="text-3xl font-bold">{data.positions.length}</p>
        </div>
      </div>

      {/* Historical Chart */}
      <YieldChart data={data.historicalYield} />

      {/* Positions Table */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold mb-4">Your Positions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700">
              <tr className="text-left text-sm text-slate-400">
                <th className="pb-3">Strategy</th>
                <th className="pb-3">Deposited</th>
                <th className="pb-3">Current Value</th>
                <th className="pb-3">Yield Earned</th>
                <th className="pb-3">APY</th>
              </tr>
            </thead>
            <tbody>
              {data.positions.map((position) => (
                <tr key={position.strategyId} className="border-b border-slate-700">
                  <td className="py-4">{position.strategyName}</td>
                  <td className="py-4 font-mono">${position.amount.toFixed(2)}</td>
                  <td className="py-4 font-mono">${position.currentValue.toFixed(2)}</td>
                  <td className="py-4 font-mono text-green-400">
                    +${position.yieldEarned.toFixed(2)}
                  </td>
                  <td className="py-4 font-mono">{position.apy.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
