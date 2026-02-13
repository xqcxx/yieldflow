# Stacks Mainnet Deployment Guide v2

## Overview
Complete guide for deploying YieldFlow smart contracts to Stacks mainnet.

## Prerequisites
- [ ] Stacks mainnet wallet with STX
- [ ] Contract code finalized
- [ ] Security audit complete
- [ ] Testnet deployment verified

## Step 1: Configure Deployment
```bash
cd contracts
cp settings/Mainnet.toml.example settings/Mainnet.toml
# Edit with your mnemonic
```

## Step 2: Generate Deployment Plan
```bash
clarinet deployments generate --mainnet
```

## Step 3: Review Plan
- Contract addresses
- Transaction costs
- Deployment order

## Step 4: Execute Deployment
```bash
clarinet deployments apply --mainnet
```

## Step 5: Verify
- Check explorer
- Run tests
- Update frontend

## Troubleshooting
- Connection issues
- Insufficient funds
- Contract errors
