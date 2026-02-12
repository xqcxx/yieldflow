import React from 'react';
import { PortfolioPosition } from '../../hooks/usePortfolio';
import { Strategy } from '../../lib/strategies';

interface PortfolioChartProps {
  positions: PortfolioPosition[];
  strategies: Strategy[];
}

export function PortfolioChart({ positions, strategies }: PortfolioChartProps) {
  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  return (
    <div className="portfolio-chart">
      <svg viewBox="0 0 200 200">
        {positions.map((pos, index) => {
          const percentage = (pos.currentValue / totalValue) * 100;
          const offset = positions
            .slice(0, index)
            .reduce((sum, p) => sum + (p.currentValue / totalValue) * 100, 0);
          
          return (
            <circle
              key={pos.strategyId}
              cx="100"
              cy="100"
              r="80"
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth="40"
              strokeDasharray={`${percentage * 5.02} 502`}
              strokeDashoffset={-offset * 5.02}
            />
          );
        })}
      </svg>
      
      <div className="chart-legend">
        {positions.map((pos, index) => (
          <div key={pos.strategyId} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="legend-label">{pos.strategyName}</span>
            <span className="legend-value">{pos.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
