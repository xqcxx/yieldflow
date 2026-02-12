import React, { useState, useEffect } from 'react';
import { useZapOut } from '../../hooks/useZapOut';
import { ZapOutQuote } from '../../lib/zapOut';

interface ZapOutFormProps {
  stxAddress: string;
  usdcxBalance: number;
  onSuccess?: () => void;
}

export function ZapOutForm({ stxAddress, usdcxBalance, onSuccess }: ZapOutFormProps) {
  const {
    address,
    isMainnet,
    quote,
    isLoading,
    error,
    result,
    fetchQuote,
    execute,
    reset,
  } = useZapOut();

  const [amount, setAmount] = useState<string>('');
  const [ethereumAddress, setEthereumAddress] = useState<string>(address || '');
  const [step, setStep] = useState<'input' | 'review' | 'processing' | 'complete'>('input');

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      fetchQuote(parseFloat(amount));
    }
  }, [amount]);

  useEffect(() => {
    if (result?.success && step === 'processing') {
      setStep('complete');
      onSuccess?.();
    }
  }, [result, onSuccess]);

  const handleMax = () => {
    setAmount(usdcxBalance.toString());
  };

  const handleReview = () => {
    if (!quote || !ethereumAddress) return;
    setStep('review');
  };

  const handleExecute = async () => {
    if (!quote || !ethereumAddress) return;
    
    await execute({
      stxAddress,
      ethereumRecipient: ethereumAddress,
      amount: parseFloat(amount),
      isMainnet,
    });
    
    setStep('processing');
  };

  const handleBack = () => {
    if (step === 'review') {
      setStep('input');
    } else if (step === 'processing') {
      setStep('review');
    } else if (step === 'complete') {
      reset();
      setStep('input');
      setAmount('');
    }
  };

  return (
    <div className="zap-out-form">
      <h2>Zap Out to Ethereum</h2>
      
      {step === 'input' && (
        <>
          <div className="form-group">
            <label>Amount (USDCx)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <button onClick={handleMax} className="max-button">
              Max: {usdcxBalance.toFixed(2)}
            </button>
          </div>
          
          <div className="form-group">
            <label>Ethereum Recipient</label>
            <input
              type="text"
              value={ethereumAddress}
              onChange={(e) => setEthereumAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>
          
          {quote && (
            <div className="quote-summary">
              <h4>Quote</h4>
              <p>Expected Output: {quote.expectedOutput.toFixed(2)} USDC</p>
              <p>Bridge Fee: {quote.bridgeFee.toFixed(2)} USDC</p>
              <p>Protocol Fee: {quote.protocolFee.toFixed(2)} USDC</p>
              <p>Estimated Time: {quote.estimatedTime} minutes</p>
            </div>
          )}
          
          <button
            onClick={handleReview}
            disabled={!quote || !ethereumAddress || parseFloat(amount) <= 0}
          >
            Review Zap Out
          </button>
        </>
      )}
      
      {step === 'review' && quote && (
        <>
          <h3>Review Zap Out</h3>
          <div className="review-details">
            <p><strong>From:</strong> {stxAddress}</p>
            <p><strong>To:</strong> {ethereumAddress}</p>
            <p><strong>Amount:</strong> {amount} USDCx</p>
            <p><strong>Expected Output:</strong> {quote.expectedOutput.toFixed(2)} USDC</p>
            <p><strong>Total Fees:</strong> {quote.totalFee.toFixed(2)} USDC</p>
          </div>
          
          <div className="warning-box">
            ⚠️ This will burn your USDCx on Stacks and bridge USDC to Ethereum
          </div>
          
          <button onClick={handleExecute} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Confirm Zap Out'}
          </button>
          <button onClick={handleBack} className="secondary">
            Back
          </button>
        </>
      )}
      
      {step === 'processing' && (
        <div className="processing-state">
          <h3>Processing Zap Out...</h3>
          <p>Please wait while your transaction is being processed.</p>
          <div className="spinner" />
        </div>
      )}
      
      {step === 'complete' && result?.success && (
        <div className="success-state">
          <h3>Zap Out Complete! 🎉</h3>
          <p><strong>Stacks Transaction:</strong> {result.stxTxId}</p>
          <p><strong>Ethereum Transaction:</strong> {result.ethTxHash}</p>
          <p>Your USDC has been bridged to Ethereum.</p>
          <button onClick={handleBack}>Make Another Zap Out</button>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
