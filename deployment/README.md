# Deployment Scripts

## Quick Deploy
```bash
./deployment/scripts/deploy-mainnet-v2.sh
```

## Manual Deploy
```bash
cd contracts
clarinet check --mainnet
clarinet deployments generate --mainnet
clarinet deployments apply --mainnet
```

## Verify Deployment
```bash
clarinet console --mainnet
```
