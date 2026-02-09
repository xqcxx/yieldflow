import { useState, useMemo } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import { openContractCall } from '@stacks/connect';
import { Pc, Cl } from '@stacks/transactions';
import { useAppStore } from '../stores/appStore';
import { useToast } from '../contexts/ToastContext';
import { useGasEstimation } from '../hooks/useGasEstimation';
import { useUSDCBalance } from '../hooks/useUSDCBalance';
import { GasFeeDisplay } from './GasFeeDisplay';
import { BalanceDisplay } from './BalanceDisplay';
import {
  SEPOLIA_USDC,
  SEPOLIA_XRESERVE,
  STACKS_MOCK_VAULT,
  ERC20_ABI,
  XRESERVE_ABI,
} from '../lib/constants';

interface ZapFlowProps {
  strategyName: string;
  onClose: () => void;
}

export function ZapFlow({ strategyName, onClose }: ZapFlowProps) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'approve' | 'deposit' | 'bridge' | 'finalize'>('input');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { address: ethAddress } = useAccount();
  const { stacksWallet, setZapState } = useAppStore();
  const { writeContract } = useWriteContract();
  const toast = useToast();
  const { balance, formattedBalance, isLoading: balanceLoading, error: balanceError } = useUSDCBalance();

  // Prepare approval transaction data for gas estimation
  const approvalData = useMemo(() => {
    if (!amount) return undefined;
    try {
      const amountWei = parseUnits(amount, 6);
      return encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [SEPOLIA_XRESERVE, amountWei],
      });
    } catch {
      return undefined;
    }
  }, [amount]);

  const approvalGas = useGasEstimation(
    step === 'input' && amount ? SEPOLIA_USDC : undefined,
    approvalData
  );

  // Prepare deposit transaction data for gas estimation
  const depositData = useMemo(() => {
    if (!amount || !stacksWallet) return undefined;
    try {
      const amountWei = parseUnits(amount, 6);
      const stacksAddressBytes = `0x${stacksWallet.address.split('').map(c => c.charCodeAt(0).toString(16)).join('').padEnd(64, '0')}`;
      return encodeFunctionData({
        abi: XRESERVE_ABI,
        functionName: 'depositForBurn',
        args: [amountWei, stacksAddressBytes as `0x${string}`],
      });
    } catch {
      return undefined;
    }
  }, [amount, stacksWallet]);

  const depositGas = useGasEstimation(
    step === 'approve' && amount ? SEPOLIA_XRESERVE : undefined,
    depositData
  );

  const handleApprove = async () => {
    if (!amount || !ethAddress) return;
    
    // Check if user has sufficient balance
    const amountWei = parseUnits(amount, 6);
    if (amountWei > balance) {
      const insufficientMsg = `Insufficient balance. You have ${formattedBalance} USDC but need ${amount} USDC`;
      setError(insufficientMsg);
      toast.showError(insufficientMsg);
      return;
    }
    
    try {
      setError(null);
      setStep('approve');
      const loadingToast = toast.showLoading('Approving USDC...');
      
      writeContract({
        address: SEPOLIA_USDC,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [SEPOLIA_XRESERVE, amountWei],
      });
      
      toast.dismissToast(loadingToast);
      toast.showSuccess('USDC approval successful!');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Approval failed';
      console.error('Approval failed:', error);
      setError(errorMsg);
      setZapState({ status: 'error', error: errorMsg });
      toast.showError(errorMsg);
      setStep('input');
    }
  };

  const handleDeposit = async () => {
    if (!amount || !ethAddress || !stacksWallet) return;
    
    try {
      setError(null);
      setStep('deposit');
      setZapState({ status: 'depositing' });
      const loadingToast = toast.showLoading('Depositing to bridge...');
      
      const amountWei = parseUnits(amount, 6);
      
      // Convert Stacks address to bytes32 for xReserve
      // This is a simplified version - in production you'd need proper encoding
      const stacksAddressBytes = `0x${stacksWallet.address.split('').map(c => c.charCodeAt(0).toString(16)).join('').padEnd(64, '0')}`;
      
      writeContract({
        address: SEPOLIA_XRESERVE,
        abi: XRESERVE_ABI,
        functionName: 'depositForBurn',
        args: [amountWei, stacksAddressBytes as `0x${string}`],
      });
      
      toast.dismissToast(loadingToast);
      toast.showSuccess('Deposit initiated! Bridging to Stacks...');
      setStep('bridge');
      setZapState({ 
        status: 'bridging',
        amount,
        stacksAddress: stacksWallet.address,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Deposit failed';
      console.error('Deposit failed:', error);
      setError(errorMsg);
      setZapState({ status: 'error', error: errorMsg });
      toast.showError(errorMsg);
      setStep('approve');
    }
  };

  const handleFinalize = async () => {
    if (!stacksWallet || !amount) return;
    
    try {
      setError(null);
      setStep('finalize');
      setZapState({ status: 'finalizing' });
      const loadingToast = toast.showLoading('Finalizing deposit on Stacks...');
      
      const amountMicroUnits = BigInt(parseFloat(amount) * 1_000_000);
      
      // Post-condition: ensure USDCx transfer
      const postConditions = [
        Pc.principal(stacksWallet.address)
          .willSendEq(Number(amountMicroUnits))
          .ft('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx', 'usdcx'),
      ];
      
      await openContractCall({
        network: 'testnet',
        contractAddress: STACKS_MOCK_VAULT.split('.')[0],
        contractName: STACKS_MOCK_VAULT.split('.')[1],
        functionName: 'deposit',
        functionArgs: [Cl.uint(amountMicroUnits)],
        postConditions,
        onFinish: (data: any) => {
          console.log('Stacks tx:', data.txId);
          setTxHash(data.txId);
          setZapState({ status: 'complete' });
          toast.dismissToast(loadingToast);
          toast.showTransactionSuccess(
            data.txId,
            'https://explorer.hiro.so/txid/'
          );
        },
        onCancel: () => {
          const cancelMsg = 'Transaction cancelled by user';
          setError(cancelMsg);
          setZapState({ status: 'error', error: cancelMsg });
          toast.dismissToast(loadingToast);
          toast.showError(cancelMsg);
          setStep('bridge');
        },
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to finalize deposit';
      console.error('Finalize failed:', error);
      setError(errorMsg);
      setZapState({ status: 'error', error: errorMsg });
      toast.showError(errorMsg);
      setStep('bridge');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Zap to {strategyName}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {['Input', 'Approve', 'Bridge', 'Finalize'].map((label, idx) => (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  ['input', 'approve', 'bridge', 'finalize'].indexOf(step) >= idx
                    ? 'bg-blue-500'
                    : 'bg-slate-600'
                }`}
              >
                {idx + 1}
              </div>
              <div className="text-xs mt-1 text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Input Amount */}
        {step === 'input' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Amount (USDC)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="text-sm text-slate-400">
              <p>• Connected: {ethAddress?.slice(0, 6)}...{ethAddress?.slice(-4)}</p>
              <p>• Stacks: {stacksWallet?.address.slice(0, 6)}...{stacksWallet?.address.slice(-4)}</p>
            </div>

            <BalanceDisplay 
              balance={formattedBalance}
              isLoading={balanceLoading}
              error={balanceError}
            />

            {amount && (
              <GasFeeDisplay
                gasPrice={approvalGas.formattedGasPrice}
                totalCost={approvalGas.formattedTotalCost}
                estimatedUSD={approvalGas.estimatedUSD}
                isLoading={approvalGas.isLoading}
                error={approvalGas.error}
              />
            )}

            <button
              onClick={handleApprove}
              disabled={!amount || !ethAddress || !stacksWallet}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              Start Zap
            </button>
          </div>
        )}

        {/* Approve Step */}
        {step === 'approve' && (
          <div className="space-y-4">
            <p className="text-slate-300">Approve USDC spending on Ethereum...</p>
            
            <GasFeeDisplay
              gasPrice={depositGas.formattedGasPrice}
              totalCost={depositGas.formattedTotalCost}
              estimatedUSD={depositGas.estimatedUSD}
              isLoading={depositGas.isLoading}
              error={depositGas.error}
            />
            
            <button
              onClick={handleDeposit}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Next: Deposit to Bridge
            </button>
          </div>
        )}

        {/* Bridge Step */}
        {step === 'bridge' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-300">Bridging to Stacks...</p>
              <p className="text-sm text-slate-400 mt-2">
                This may take 5-20 minutes. Circle is attesting your deposit.
              </p>
            </div>
            <button
              onClick={handleFinalize}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              USDCx Arrived - Finalize Deposit
            </button>
          </div>
        )}

        {/* Finalize Step */}
        {step === 'finalize' && (
          <div className="text-center space-y-4">
            <div className="text-green-400 text-4xl mb-2">✓</div>
            <p className="text-xl font-bold">Zap Complete!</p>
            <p className="text-slate-400">
              Your funds are now earning {strategyName} yield on Stacks.
            </p>
            {txHash && (
              <div className="text-xs text-slate-500 break-all">
                <p className="mb-1">Transaction Hash:</p>
                <a 
                  href={`https://explorer.hiro.so/txid/${txHash}?chain=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {txHash}
                </a>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              View Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
