# Ethereum Mainnet Support

## Overview
This document outlines the complete Ethereum mainnet support implementation for YieldFlow protocol.

## Network Configuration

### Mainnet
- Chain ID: 1
- Network Name: Ethereum Mainnet
- Currency: ETH
- Block Time: ~12 seconds

### Testnet (Sepolia)
- Chain ID: 11155111
- Network Name: Sepolia
- Currency: ETH
- Block Time: ~12 seconds

## Contract Addresses

### Mainnet
| Token | Address |
|-------|---------|
| USDC | 0xA0b86a33E6441e0A421e56E4773C3C4b0Db7E5d0 |
| xReserve | 0x008888878f94C0d87defdf0B07f46B93C1934442 |

### Sepolia
| Token | Address |
|-------|---------|
| USDC | 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238 |
| xReserve | 0x008888878f94C0d87defdf0B07f46B93C1934442 |

## RPC Endpoints

### Public RPCs
- Alchemy: https://eth-mainnet.g.alchemy.com/v2/${API_KEY}
- Infura: https://mainnet.infura.io/v3/${API_KEY}
- Cloudflare: https://cloudflare-eth.com

### Authentication
Requires API key for Alchemy/Infura services.

## Block Explorers
- Etherscan: https://etherscan.io
- Etherscan (Sepolia): https://sepolia.etherscan.io

## Gas Configuration
- Gas Limit (ETH Transfer): 21000
- Gas Limit (ERC20 Transfer): 65000
- Gas Limit (Contract Interaction): 100000+

## Network Switches
Users can switch between mainnet and testnet via:
1. MetaMask network selector
2. In-app network toggle
3. URL parameter (?network=mainnet)
