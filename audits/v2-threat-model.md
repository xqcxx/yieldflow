# Threat Model Analysis

## Actors

### 1. Regular User
**Description:** Regular protocol user depositing/withdrawing
**Capabilities:**
- Deposit USDCx
- Withdraw funds
- View portfolio

**Threats:**
- Front-running (low risk)
- Slippage loss (medium risk)

### 2. Admin/Operator
**Description:** Protocol administrator
**Capabilities:**
- Pause/unpause vault
- Update parameters
- Collect fees

**Threats:**
- Rug pull (mitigated - no direct fund access)
- Parameter manipulation (timelock needed)

### 3. External Attacker
**Description:** Malicious external actor
**Capabilities:**
- Call public functions
- Manipulate transactions
- Exploit vulnerabilities

**Threats:**
- Smart contract exploits
- Reentrancy attacks
- Flash loan attacks

## Attack Vectors

### Vector 1: Smart Contract Exploitation
- **Risk Level:** Low
- **Mitigation:** Code review, testing
- **Status:** ✅ Secured

### Vector 2: Front-End Attacks
- **Risk Level:** Medium
- **Mitigation:** Input validation, CSP
- **Status:** ✅ Protected

### Vector 3: Bridge Exploitation
- **Risk Level:** High
- **Mitigation:** Multi-sig, monitoring
- **Status:** ✅ Monitored

### Vector 4: Social Engineering
- **Risk Level:** Medium
- **Mitigation:** User education
- **Status:** ✅ Warning systems in place
