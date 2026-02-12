# Stacks Mainnet Deployment Guide

## Prerequisites
1. Stacks mainnet STX for gas fees
2. Contract code finalized and audited
3. Deployment wallet with sufficient balance
4. Clarinet configured for mainnet

## Deployment Checklist
- [ ] Verify contract code is final
- [ ] Ensure security audit is complete
- [ ] Configure mainnet deployment settings
- [ ] Generate deployment plan
- [ ] Test deployment on testnet first
- [ ] Prepare mainnet wallet
- [ ] Execute deployment
- [ ] Verify contract on explorer

## Contract Addresses
**To be deployed:**
- mock-vault.clar

## Configuration
Update `settings/Mainnet.toml` with your mnemonic and network settings.

## Post-Deployment
1. Update frontend constants with deployed addresses
2. Verify contract functionality
3. Monitor for any issues
4. Document deployed addresses
