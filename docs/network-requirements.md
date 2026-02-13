# Network Requirements

## Supported Networks

### Ethereum
- **Mainnet** (Chain ID: 1)
- **Sepolia** (Chain ID: 11155111)

### Stacks
- **Mainnet**
- **Testnet**

## Connection Requirements

### For Users
1. MetaMask or compatible wallet installed
2. Connected to supported Ethereum network
3. Sufficient ETH balance for gas fees
4. Leather wallet for Stacks operations

### For Developers
1. API keys for Alchemy or Infura
2. WalletConnect project ID
3. Environment variables configured

## Environment Setup

```
VITE_ALCHEMY_API_KEY=your_alchemy_key
VITE_INFURA_API_KEY=your_infura_key
VITE_WC_PROJECT_ID=your_wc_project_id
```

## Testing

### Testnet Usage
- Use Sepolia for Ethereum testing
- Use Stacks Testnet for smart contract testing
- Get testnet ETH from faucets

### Mainnet Preparation
1. Test thoroughly on testnet
2. Configure mainnet RPC endpoints
3. Prepare wallet with mainnet ETH
4. Verify contract addresses
