import React, { useState, useMemo } from 'react';
import { Strategy } from '../../lib/strategies';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { validateAllocation } from '../../lib/allocationUtils';

interface AllocationEditorProps {
  strategies: Strategy[];
  currentAllocation: Record<string, number>;
  onSave: (allocation: Record<string, number>) => void;
}

export function AllocationEditor({
  strategies,
  currentAllocation,
  onSave,
}: AllocationEditorProps) {
  const [allocation, setAllocation] = useState<Record<string, number>>(
    currentAllocation || {}
  );
  const [isValid, setIsValid] = useState(false);
  
  const total = useMemo(() => {
    return Object.values(allocation).reduce((sum, val) => sum + val, 0);
  }, [allocation]);
  
  const handleSliderChange = (strategyId: string, value: number) => {
    const newAllocation = { ...allocation, [strategyId]: value };
    setAllocation(newAllocation);
    setIsValid(validateAllocation(newAllocation));
  };
  
  const handleSave = () => {
    if (isValid) {
      onSave(allocation);
    }
  };
  
  return (
    <div className="allocation-editor">
      <h3>Portfolio Allocation</h3>
      
      {strategies.map(strategy => (
        <div key={strategy.id} className="allocation-row">
          <label>{strategy.name}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={allocation[strategy.id] || 0}
            onChange={(e) => handleSliderChange(strategy.id, Number(e.target.value))}
          />
          <span>{allocation[strategy.id] || 0}%</span>
        </div>
      ))}
      
      <div className="allocation-total">
        <span>Total:</span>
        <span className={total === 100 ? 'valid' : 'invalid'}>
          {total.toFixed(1)}%
        </span>
      </div>
      
      <button onClick={handleSave} disabled={!isValid}>
        Save Allocation
      </button>
    </div>
  );
}
