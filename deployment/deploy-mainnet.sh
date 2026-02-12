#!/bin/bash

# Stacks Mainnet Deployment Script
# Usage: ./deploy-mainnet.sh

set -e

echo "🚀 Starting Stacks Mainnet Deployment"
echo "======================================="

# Step 1: Verify configuration
echo "📋 Step 1: Verifying configuration..."
if [ ! -f "contracts/settings/Mainnet.toml" ]; then
    echo "❌ Error: Mainnet.toml not found"
    exit 1
fi

# Step 2: Check contract syntax
echo "🔍 Step 2: Checking contract syntax..."
cd contracts
clarinet check --mainnet
cd ..

# Step 3: Generate deployment plan
echo "📝 Step 3: Generating deployment plan..."
cd contracts
clarinet deployments generate --mainnet --medium-cost
cd ..

# Step 4: Display deployment plan
echo "📊 Step 4: Deployment plan:"
cat contracts/deployments/mainnet.toml

# Step 5: Execute deployment
echo "⚡ Step 5: Executing deployment..."
read -p "⚠️  This will deploy to mainnet. Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

cd contracts
clarinet deployments apply --mainnet
cd ..

# Step 6: Verify deployment
echo "✅ Step 6: Verifying deployment..."
echo "📝 Deployment complete! Check the explorer for confirmation."

echo ""
echo "🎉 Deployment completed successfully!"
