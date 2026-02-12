import React from 'react';
import { ZapOutQuote } from '../../lib/zapOut';

interface ZapOutQuoteDisplayProps {
  quote: ZapOutQuote;
  amount: number;
}

export function ZapOutQuoteDisplay({ quote, amount }: ZapOutQuoteDisplayProps) {
  const feeBreakdown = [
    { label: 'Bridge Fee (0.1%)', value: quote.bridgeFee },
    { label: 'Protocol Fee (0.5%)', value: quote.protocolFee },
  ];

  return (
    <div className="quote-display">
      <h4>Zap Out Quote</h4>
      
      <div className="quote-main">
        <div className="quote-row">
          <span>You Send</span>
          <span className="value">{amount.toFixed(2)} USDCx</span>
        </div>
        
        <div className="quote-arrow">↓</div>
        
        <div className="quote-row">
          <span>You Receive</span>
          <span className="value highlight">
            {quote.expectedOutput.toFixed(2)} USDC
          </span>
        </div>
      </div>
      
      <div className="quote-details">
        <h5>Fee Breakdown</h5>
        {feeBreakdown.map((fee) => (
          <div key={fee.label} className="fee-row">
            <span>{fee.label}</span>
            <span>{fee.value.toFixed(4)} USDC</span>
          </div>
        ))}
        <div className="fee-row total">
          <span>Total Fees</span>
          <span>{quote.totalFee.toFixed(4)} USDC</span>
        </div>
      </div>
      
      <div className="quote-meta">
        <div className="meta-row">
          <span>Minimum Received</span>
          <span>{quote.minimumOutput.toFixed(2)} USDC</span>
        </div>
        <div className="meta-row">
          <span>Estimated Time</span>
          <span>~{quote.estimatedTime} minutes</span>
        </div>
      </div>
    </div>
  );
}
