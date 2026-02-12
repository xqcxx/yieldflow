import React from 'react';
import { PortfolioPosition } from '../../hooks/usePortfolio';

interface PortfolioSummaryProps {
  totalValue: number;
  totalYieldEarned: number;
  averageApy: number;
  positionCount: number;
  diversificationScore: number;
}

export function PortfolioSummary({
  totalValue,
  totalYieldEarned,
  averageApy,
  positionCount,
  diversificationScore,
}: PortfolioSummaryProps) {
  return (
    <div className="portfolio-summary">
      <div className="summary-card">
        <h4>Total Value</h4>
        <p className="value">${totalValue.toFixed(2)}</p>
      </div>
      
      <div className="summary-card">
        <h4>Total Yield Earned</h4>
        <p className="value positive">+${totalYieldEarned.toFixed(2)}</p>
      </div>
      
      <div className="summary-card">
        <h4>Average APY</h4>
        <p className="value">{averageApy.toFixed(1)}%</p>
      </div>
      
      <div className="summary-card">
        <h4>Strategies</h4>
        <p className="value">{positionCount}</p>
      </div>
      
      <div className="summary-card">
        <h4>Diversification</h4>
        <p className="value">{diversificationScore.toFixed(0)}/100</p>
      </div>
    </div>
  );
}
