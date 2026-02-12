import React, { useState } from 'react';
import { useProtocols } from '../../hooks/useProtocols';
import { ProtocolCard } from './ProtocolCard';
import { ProtocolConfig } from '../../lib/protocols';

interface ProtocolListProps {
  onSelect: (protocol: ProtocolConfig) => void;
  selectedProtocol?: ProtocolConfig;
}

export function ProtocolList({ onSelect, selectedProtocol }: ProtocolListProps) {
  const { protocols, isLoading, error } = useProtocols(false);
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'apy' | 'tvl'>('apy');

  if (isLoading) {
    return <div className="loading">Loading protocols...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const filteredProtocols = protocols
    .filter(p => filter === 'all' || p.protocol.riskLevel === filter)
    .sort((a, b) => {
      if (sortBy === 'apy') return b.apy - a.apy;
      return b.tvl - a.tvl;
    });

  return (
    <div className="protocol-list">
      <div className="list-header">
        <h2>DeFi Protocols</h2>
        
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
          
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="apy">Sort by APY</option>
            <option value="tvl">Sort by TVL</option>
          </select>
        </div>
      </div>
      
      <div className="protocol-grid">
        {filteredProtocols.map(({ protocol, apy, tvl }) => (
          <ProtocolCard
            key={protocol.id}
            protocol={protocol}
            apy={apy}
            tvl={tvl}
            onSelect={onSelect}
            isSelected={selectedProtocol?.id === protocol.id}
          />
        ))}
      </div>
    </div>
  );
}
