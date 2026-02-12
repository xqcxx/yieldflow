# YieldFlow - Cross-Chain Capital Optimizer

> **Tagline:** Don't let your stablecoins sleep. Zap from Ethereum directly into Stacks DeFi Yields.

Built for the **Programming USDCx on Stacks Builder Challenge** (January 19-25, 2026)

## Overview

YieldFlow is a cross-chain "Zap" protocol that aggregates the best yield opportunities on the Stacks network and makes them accessible to users on Ethereum with a single click. Instead of manually bridging, waiting, and then depositing into Stacks pools (3 transactions, 2 wallets), YieldFlow automates the entire `Bridge → Mint → Deposit` pipeline.

### The Problem

- **Capital Inefficiency:** Billions of USDC sit idle on Ethereum earning 0-2%. Stacks DeFi often offers higher APYs (8-18%), but the barrier to entry is high.
- **Complexity:** To farm yield on Stacks, an ETH user must: Bridge USDC → wait 20 mins → Switch Wallet → Approve Token → Deposit to Pool. This is too much friction.

### The Solution

**One-Click Zap Interface:**
1. User selects a strategy (e.g., "YieldFlow Mock Vault - 12% APY")
2. Enters amount of USDC on Ethereum (Sepolia testnet)
3. Clicks "Zap" and signs transactions
4. YieldFlow bridges funds via Circle xReserve
5. Once minted on Stacks, user finalizes deposit into the strategy
6. Funds start earning yield automatically

## Features

- ✅ **Dual Wallet Integration** - MetaMask (Ethereum) + Leather (Stacks)
- ✅ **Ethereum Mainnet Support** - Full production network support (not just testnet)
- ✅ **USDCx Bridging** - Powered by Circle's xReserve protocol
- ✅ **Mock Vault Contract** - Time-based yield simulation (12% APY)
- ✅ **Receipt Tokens** - SIP-010 compliant yf-receipt tokens
- ✅ **21 Passing Tests** - Comprehensive unit test coverage
- ✅ **Modern UI** - Built with React, TypeScript, and Tailwind CSS
- ✅ **Monitoring & Analytics** - Real-time metrics, error tracking, alerting, and health monitoring
- ✅ **Proper Address Encoding** - Correct c32 decoding for xReserve bridge integration

## Project Structure

```
yieldflow/
├── analytics/                  # Monitoring, analytics, and alerting
│   ├── src/                   # Core analytics services
│   │   ├── AnalyticsService.ts
│   │   ├── AlertManager.ts
│   │   ├── HealthMonitor.ts
│   │   └── ErrorTracker.ts
│   ├── components/            # Dashboard components
│   ├── hooks/                 # React hooks for monitoring
│   ├── tests/                 # Test suite
│   └── README.md
├── contracts/                  # Clarity smart contracts (Clarinet)
│   ├── contracts/
│   │   └── mock-vault.clar    # Main vault contract with yield simulation
│   ├── tests/
│   │   └── mock-vault.test.ts # 21 passing unit tests
│   └── Clarinet.toml
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── StacksWalletButton.tsx
│   │   │   ├── StrategyCard.tsx
│   │   │   └── ZapFlow.tsx   # Main zap interface
│   │   ├── stores/           # Zustand state management
│   │   ├── lib/              # Constants and utilities
│   │   └── App.tsx
│   └── package.json
├── idea.md                     # Original concept document
└── prd.md                      # Product requirements
```

## Tech Stack

### Smart Contracts
- **Clarity** - Stacks smart contract language
- **Clarinet** - Development environment and testing
- **USDCx** - Circle's xReserve-backed stablecoin

### Frontend
- **Vite** - Build tool and dev server
- **React 19** + **TypeScript** - UI framework
- **Tailwind CSS** - Styling
- **RainbowKit** - Ethereum wallet connection
- **wagmi** + **viem** - Ethereum interactions
- **@stacks/connect** - Stacks wallet connection
- **Zustand** - State management
- **TanStack Query** - Data fetching

### Address Encoding
- **C32 Decoder** - Proper Crockford Base32 decoding for Stacks addresses
- **xReserve Integration** - Correct bytes32 encoding for bridge operations
- **Address Book** - Save and manage frequently used addresses
- **Validation** - Real-time address validation with React hooks

## Getting Started

### Prerequisites

- Node.js 18+
- Clarinet 3.13+
- MetaMask wallet (for Sepolia testnet)
- Leather wallet (for Stacks testnet)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd yieldflow
   ```

2. **Install contract dependencies**
   ```bash
   cd contracts
   npm install
   ```

3. **Run contract tests**
   ```bash
   npm test
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Smart Contract Details

### Mock Vault (`mock-vault.clar`)

**Key Functions:**
- `deposit(amount: uint)` - Deposit USDCx and mint receipt tokens
- `withdraw(amount: uint)` - Burn receipts and withdraw USDCx
- `get-balance-with-yield(user: principal)` - Get balance including accrued yield
- `get-estimated-yield(user: principal)` - Get current yield earned

**Yield Calculation:**
- APY: 12% annual
- Formula: `(principal * blocks * 228) / 100000000`
- Blocks are approximately 10 minutes each on Stacks

**Test Coverage:**
```
✓ 21 tests passing
  - Deployment and initialization
  - Deposit functionality
  - Withdrawal functionality
  - Yield simulation
  - Error handling
  - Read-only functions
```

## Contract Addresses

### Sepolia Testnet (Ethereum)
- **USDC:** `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- **xReserve:** `0x008888878f94C0d87defdf0B07f46B93C1934442`

### Stacks Testnet
- **USDCx:** `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx`
- **Mock Vault:** `(to be deployed)`

## Usage Flow

1. **Connect Wallets**
   - Click "Connect Wallet" for MetaMask (Sepolia)
   - Click "Connect Stacks Wallet" for Leather (Testnet)

2. **Select Strategy**
   - Browse available strategies on the homepage
   - Click on "YieldFlow Mock Vault" to start

3. **Execute Zap**
   - Enter USDC amount
   - Approve USDC spending (Ethereum tx)
   - Deposit to xReserve (Ethereum tx)
   - Wait for bridge (~5-20 minutes)
   - Finalize deposit (Stacks tx)

4. **Track Yield**
   - View your position in the Portfolio
   - Watch yield accrue over time based on block height

## Development

### Testing Smart Contracts

```bash
cd contracts
clarinet check        # Syntax check
npm test             # Run unit tests
clarinet console     # Interactive REPL
```

### Deploying to Testnet

1. **Configure deployment**
   ```bash
   cd contracts
   # Edit settings/Testnet.toml with your mnemonic
   clarinet deployments generate --testnet --medium-cost
   ```

2. **Deploy**
   ```bash
   clarinet deployments apply --testnet
   ```

3. **Update frontend constants**
   ```typescript
   // frontend/src/lib/constants.ts
   export const STACKS_MOCK_VAULT = 'YOUR_ADDRESS.mock-vault';
   ```

### Frontend Development

```bash
cd frontend
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

## Limitations & Future Improvements

### Current Limitations
- Mock vault simulates yield (no real DeFi integration)
- No withdrawal flow from Stacks back to Ethereum
- Manual bridge status checking (user clicks "USDCx Arrived")
- Limited to Sepolia and Stacks testnet

### Future Enhancements
1. **Real DeFi Integration** - Connect to Zest Protocol, Bitflow, etc.
2. **Automated Bridge Tracking** - Poll for USDCx arrival automatically
3. **Zap Out** - Reverse flow from Stacks → Ethereum
4. **Multi-Strategy Portfolio** - Deposit into multiple vaults
5. **Performance Dashboard** - Historical yield charts and analytics
6. **Mainnet Deployment** - Launch on production networks
7. **Additional Chains** - Support more CCTP-compatible networks

## Revenue Model

- **Performance Fee:** 5% of all yield harvested
- **Zapping Fee:** 0.1% convenience fee on entry

## Security Considerations

- ⚠️ **This is a hackathon project** - Not audited for production use
- USDCx transfers rely on user post-conditions for safety
- Mock vault is for demonstration only
- Always test with small amounts first

## Resources

- [Circle xReserve Docs](https://developers.circle.com/xreserve)
- [Stacks USDCx Guide](https://docs.stacks.co/more-guides/bridging-usdcx)
- [Clarity Language](https://docs.stacks.co/clarity)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [@stacks/connect](https://github.com/hirosystems/stacks.js)

## License

MIT

## Acknowledgments

- Built for Programming USDCx on Stacks Builder Challenge
- Powered by Circle's xReserve protocol
- Stacks Labs for infrastructure and documentation
- Hiro for developer tools

---

**Built with ❤️ for the Stacks ecosystem**
