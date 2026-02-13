# Mainnet vs Testnet Comparison

## Feature Comparison

| Feature | Mainnet | Testnet |
|---------|---------|---------|
| Real Money | Yes | No |
| Network ID | 1 | 11155111 |
| Gas Cost | Real ETH | Free (faucet) |
| Transaction Speed | ~12s | ~12s |
| Contract Deployment | Paid | Free |
| Explorer | etherscan.io | sepolia.etherscan.io |

## When to Use What

### Use Testnet When:
- Developing new features
- Testing integrations
- Learning the platform
- Debugging issues

### Use Mainnet When:
- Running in production
- Accepting real user funds
- Testing with real value
- Final pre-launch verification

## Switching Networks

### Via MetaMask
1. Click network dropdown
2. Select network
3. Confirm switch

### Via App
1. Click network indicator
2. Select desired network
3. App updates automatically

## Configuration

```typescript
// Environment variables
VITE_ETHEREUM_NETWORK=mainnet  // or 'sepolia'
```

## Best Practices

1. Always test on testnet first
2. Verify contract addresses match network
3. Keep testnet and mainnet wallets separate
4. Use small amounts initially on mainnet
