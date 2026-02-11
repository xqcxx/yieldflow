/**
 * Performance Dashboard Component
 */

import React, { useEffect, useState } from 'react';
import { metrics, analytics, type MetricData } from '../src';

interface PerformanceMetric {
  name: string;
  current: number;
  average: number;
  min: number;
  max: number;
  count: number;
}

export const PerformanceDashboard: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1m' | '5m' | '15m' | '1h'>('5m');

  useEffect(() => {
    const calculateMetrics = () => {
      const allMetrics = analytics.getMetrics();
      const timeRanges = {
        '1m': 60000,
        '5m': 300000,
        '15m': 900000,
        '1h': 3600000,
      };
      
      const cutoff = Date.now() - timeRanges[selectedTimeRange];
      const recentMetrics = allMetrics.filter(m => m.timestamp > cutoff);

      const grouped = recentMetrics.reduce((acc, metric) => {
        if (!acc[metric.name]) {
          acc[metric.name] = [];
        }
        acc[metric.name].push(metric);
        return acc;
      }, {} as Record<string, MetricData[]>);

      const calculated = Object.entries(grouped).map(([name, data]) => {
        const values = data.map(d => d.value);
        return {
          name,
          current: values[values.length - 1] || 0,
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length,
        };
      });

      setPerformanceData(calculated);
    };

    calculateMetrics();
    const interval = setInterval(calculateMetrics, 5000);

    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const formatDuration = (ms: number): string => {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        <div className="flex space-x-2">
          {(['1m', '5m', '15m', '1h'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                selectedTimeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Last {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceData.map((metric) => (
          <div key={metric.name} className="bg-white p-4 rounded shadow">
            <div className="text-gray-500 text-sm mb-2">{metric.name}</div>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {formatDuration(metric.current)}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-400">Average</div>
                <div className="font-semibold">{formatDuration(metric.average)}</div>
              </div>
              <div>
                <div className="text-gray-400">Count</div>
                <div className="font-semibold">{metric.count}</div>
              </div>
              <div>
                <div className="text-gray-400">Min</div>
                <div className="font-semibold text-green-600">{formatDuration(metric.min)}</div>
              </div>
              <div>
                <div className="text-gray-400">Max</div>
                <div className="font-semibold text-red-600">{formatDuration(metric.max)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {performanceData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No performance data available
        </div>
      )}
    </div>
  );
};
