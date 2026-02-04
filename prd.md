# Product Requirements Document (PRD): YieldFlow

| Project | YieldFlow |
| :--- | :--- |
| **Type** | Cross-Chain Yield Aggregator |
| **Core Tech** | Circle xReserve, Clarity Contracts |
| **Status** | **Approved for Hackathon** |

---

## 1. Product Overview
YieldFlow enables users to move capital from Ethereum directly into Stacks yield bearing vaults.

## 2. User Personas
1.  **The Yield Farmer:** Loves APY. Holds funds on Eth/L2s. Willing to try new chains for returns.

---

## 3. Functional Requirements (FR)

### Module 1: Strategy Explorer
| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Vault List** | Display available Strategies. <br>Ex: "Zest Lending (USDCx)", "Bitflow LP (STX-USDCx)". | P0 |
| **FR-02** | **APY Simulation** | Display mocked APY data (e.g., "Current APY: 12.5%"). | P1 |

### Module 2: The "Zap" (Cross-Chain Logic)
| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-03** | **Zap In (Step 1)** | User inputs USDC Amount on Eth. Calls `depositForBurn`. | P0 |
| **FR-04** | **Zap In (Step 2)** | UI detects arrival of USDCx on Stacks. Prompts user to "Finalize Deposit". | P0 |
| **FR-05** | **Mock Vault Interaction** | User signs Stacks Transaction: `contract-call? 'mock-zest-vault 'deposit (u1000)`. | P0 |

### Module 3: Portfolio
| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-06** | **Position Tracking** | Show "Total Value Locked" across all chains. | P1 |
| **FR-07** | **Withdraw (Zap Out)** | Allow user to withdraw from Vault -> Bridge back to Ethereum (USDC). | P2 |

---

## 4. Hackathon "Smoke & Mirrors" Strategy
To make this buildable in 5 days:
1.  **Don't integrate real Zest/Bitflow contracts** (complex, maybe broken on testnet).
2.  **Write a Simple Clarity Contract** called `mock-strategy`.
    *   Function: `deposit(amount)`.
    *   Function: `get-balance(user)`.
    *   Logic: It just holds the tokens and mints a receipt token.
3.  **The Demo:** Show the user moving money from MetaMask (Eth) -> "Investing" -> Seeing their balance grow on the YieldFlow dashboard.
