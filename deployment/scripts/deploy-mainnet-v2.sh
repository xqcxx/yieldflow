#!/bin/bash
# Stacks Mainnet Deployment Script

set -e

echo "🚀 Starting Stacks Mainnet Deployment"

# Check environment
if [ -z "$STACKS_DEPLOY_MNEMONIC" ]; then
    echo "❌ Error: STACKS_DEPLOY_MNEMONIC not set"
    exit 1
fi

# Step 1: Syntax check
echo "📝 Checking contract syntax..."
cd contracts
clarinet check --mainnet

# Step 2: Generate deployment
echo "📋 Generating deployment plan..."
clarinet deployments generate --mainnet --cost-mode medium

# Step 3: Show plan
echo "📊 Deployment plan:"
cat deployments/mainnet.toml

# Step 4: Confirm
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi

# Step 5: Deploy
echo "⚡ Deploying contracts..."
clarinet deployments apply --mainnet

echo "✅ Deployment complete!"
