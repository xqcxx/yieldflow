## Threat Model

### Threat Actors

#### 1. External Attacker
**Capabilities:**
- Can call any public function
- Can observe blockchain state
- Cannot modify contract code

**Threats:**
- Attempt to drain funds
- Manipulate yield calculations
- Bypass access controls

**Mitigations:**
- Access control on admin functions
- Balance checks on withdrawals
- No external call vulnerabilities

#### 2. Malicious User
**Capabilities:**
- Can deposit and withdraw funds
- Can attempt to game the system

**Threats:**
- Rapid deposit/withdraw to exploit yield
- Attempt to withdraw more than deposited

**Mitigations:**
- Yield calculated based on block height
- Receipt token tracking
- Balance validation

#### 3. Contract Owner
**Capabilities:**
- Can pause/unpause vault
- Can update vault metadata

**Threats:**
- Rug pull (not possible - no fund custody)
- Pause denial of service

**Mitigations:**
- Limited admin powers
- No ability to withdraw user funds
- Transparent operations via events

### Attack Vectors

#### 1. Integer Overflow
**Risk:** Low  
**Status:** Mitigated  
Clarity prevents overflow at runtime.

#### 2. Reentrancy
**Risk:** None  
**Status:** N/A  
Clarity doesn't support reentrant calls.

#### 3. Access Control Bypass
**Risk:** Low  
**Status:** Mitigated  
All admin functions check tx-sender.

#### 4. DoS
**Risk:** Low  
**Status:** Mitigated  
No unbounded loops or expensive operations.
