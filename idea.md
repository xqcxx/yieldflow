# YieldFlow: The Cross-Chain Capital optimizer

> **Tagline:** Don't let your stablecoins sleep. Zap from Ethereum directly into Stacks DeFi Yields.

## 1. Executive Summary
**YieldFlow** is a cross-chain "Zap" protocol. It aggregates the best yield opportunities on the Stacks network (e.g., Zest Protocol, Bitflow) and makes them accessible to users on Ethereum with a single click.

Instead of the user manually bridging, claiming, and then depositing into a Stacks pool (3 transactions, 2 wallets), YieldFlow automates the `Bridge -> Mint -> Deposit` pipeline.

## 2. The Problem
*   **Capital Efficiency:** Billions of USDC sit idle on Ethereum earning 0-2%. Stacks DeFi often offers higher APYs due to incentive programs, but the barrier to entry is high.
*   **Complexity:** To farm yield on Stacks, an Eth user needs to: Bridge USDC -> wait 20 mins -> Switch Wallet -> Approve Token -> Deposit to Pool. This is too much work.

## 3. The Solution
A "One-Click Zap" Interface.
*   **User:** Selects "Strategy: Stacks Zest Lending (8% APY)".
*   **Action:** Enters 1000 USDC (on Ethereum). Clicks "Zap".
*   **YieldFlow:** Bridges the funds via Circle xReserve. Once minted on Stacks, the user (via the UI) signs the final deposit into the Strategy.

## 4. Technical Innovation (The "Zap")
*   **Intents:** We treat the cross-chain action as an "Intent." The user initiates the intent on Ethereum.
*   **Optimistic UI:** We track the bridge progress and notify the user exactly when they need to switch networks to finalize the deposit.

## 5. Revenue Model
*   **Performance Fee:** 5% of all yield harvested.
*   **Zapping Fee:** 0.1% convenience fee on entry.

## 6. Technical Stack
*   **Frontend:** Vite + React + TanStack Query.
*   **Simulation:** Since Stacks mainnet DeFi protocols might not be fully live on Nakamoto Testnet, we will deploy **Mock Strategy Contracts** (Clarity) that accept USDCx and emit "Yield Tokens" to demonstrate the architecture.
