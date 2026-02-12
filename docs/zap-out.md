## Zap Out Feature

### Overview
The Zap Out feature allows users to withdraw their USDCx from Stacks back to Ethereum, completing the full cross-chain cycle.

### How It Works

1. **Initiate Zap Out**
   - User selects amount of USDCx to withdraw
   - Enters Ethereum recipient address
   - System calculates quote

2. **Review Quote**
   - View expected output after fees
   - See fee breakdown (bridge + protocol)
   - Check estimated completion time

3. **Execute Transaction**
   - Confirm on Stacks (burn USDCx)
   - Bridge to Ethereum
   - Receive USDC on Ethereum

### Fees
- **Bridge Fee:** 0.1%
- **Protocol Fee:** 0.5%
- **Total Fee:** 0.6%

### Estimated Time
- **Stacks Burn:** ~1 minute
- **Bridge Finality:** ~15-20 minutes
- **Total:** ~20 minutes

### Supported Networks
- **From:** Stacks Testnet / Mainnet
- **To:** Ethereum Sepolia / Mainnet

### API Reference

#### Hook: useZapOut
```typescript
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
```

#### Functions
- `getZapOutQuote(amount, isMainnet)` - Get quote for withdrawal
- `executeZapOut(config)` - Execute withdrawal

### Security Considerations
- Recipient address is validated
- Slippage protection on minimum output
- Transaction receipts are verified
