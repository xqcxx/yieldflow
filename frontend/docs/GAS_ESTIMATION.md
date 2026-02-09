# Gas Estimation and Fee Display

## Overview
This feature provides real-time gas price estimation for Ethereum transactions in the zap flow, helping users make informed decisions about transaction costs.

## Components

### useGasEstimation Hook
Located in `src/hooks/useGasEstimation.ts`

**Features:**
- Real-time gas price fetching (updates every 10 seconds)
- Gas limit estimation for transactions
- Total cost calculation in ETH
- USD conversion (based on ETH price)
- Error handling for estimation failures

**Usage:**
```tsx
const gasEstimate = useGasEstimation(
  contractAddress,
  encodedFunctionData
);

// Access values
gasEstimate.formattedGasPrice // "25.5" (in Gwei)
gasEstimate.formattedTotalCost // "0.000532" (in ETH)
gasEstimate.estimatedUSD // "1.28" (in USD)
```

### GasFeeDisplay Component
Located in `src/components/GasFeeDisplay.tsx`

**Features:**
- Visual gas price indicator (Low/Medium/High)
- Displays both ETH and USD costs
- Loading states with skeleton UI
- Error states with warning messages

**Props:**
- `gasPrice`: Formatted gas price in Gwei
- `totalCost`: Total cost in ETH
- `estimatedUSD`: Estimated cost in USD
- `isLoading`: Loading state
- `error`: Error message if estimation fails

## Gas Price Indicators
- **Low**: < 20 Gwei (Green)
- **Medium**: 20-50 Gwei (Yellow)
- **High**: > 50 Gwei (Red)

## Integration
Gas estimation is integrated into the ZapFlow component for both:
1. USDC approval transaction
2. Bridge deposit transaction

Users see gas estimates before confirming transactions, providing transparency and helping them optimize transaction timing.

## Notes
- ETH price is currently hardcoded at $2,400 USD
- In production, integrate with a price oracle or API (e.g., CoinGecko)
- Gas prices update automatically every 10 seconds
- Estimations are based on current network conditions
