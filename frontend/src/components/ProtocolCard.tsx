import React from 'react';
import { ProtocolConfig } from '../../lib/protocols';

interface ProtocolCardProps {
  protocol: ProtocolConfig;
  apy: number;
  tvl: number;
  onSelect: (protocol: ProtocolConfig) => void;
  isSelected: boolean;
}

export function ProtocolCard({
  protocol,
  apy,
  tvl,
  onSelect,
  isSelected,
}: ProtocolCardProps) {
  const riskColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  return (
    <div
      className={`protocol-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(protocol)}
    >
      <div className="protocol-header">
        <h3>{protocol.name}</h3>
        <span className={`risk-badge ${riskColors[protocol.riskLevel]}`}>
          {protocol.riskLevel.toUpperCase()}
        </span>
      </div>
      
      <p className="protocol-description">{protocol.description}</p>
      
      <div className="protocol-stats">
        <div className="stat">
          <span className="stat-label">APY</span>
          <span className="stat-value">{apy.toFixed(1)}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">TVL</span>
          <span className="stat-value">${(tvl / 1000).toFixed(0)}K</span>
        </div>
      </div>
      
      <div className="protocol-links">
        <a href={protocol.website} target="_blank" rel="noopener noreferrer">
          Website
        </a>
        <a href={protocol.docs} target="_blank" rel="noopener noreferrer">
          Docs
        </a>
      </div>
    </div>
  );
}
