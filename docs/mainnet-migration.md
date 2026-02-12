## Ethereum Mainnet Migration Guide

### Prerequisites
1. Ensure you have mainnet ETH for gas fees
2. Update your wallet to support Ethereum Mainnet
3. Verify contract addresses are correct

### Migration Steps

1. **Update Environment Variables**
   ```bash
   VITE_ETHEREUM_NETWORK=mainnet
   ```

2. **Switch Network in UI**
   - Use the network selector in the header
   - Or manually switch via MetaMask

3. **Verify Contract Addresses**
   - USDC: 0xA0b86a33E6441e0A421e56E4773C3C4b0Db7E5d0
   - xReserve: 0x008888878f94C0d87defdf0B07f46B93C1934442

### Security Considerations

- Mainnet transactions are irreversible
- Test thoroughly on testnet first
- Start with small amounts
- Monitor gas prices

### Rollback Plan

If issues arise, switch back to Sepolia:
```typescript
await switchToSepolia();
```
