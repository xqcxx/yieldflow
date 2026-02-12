## Static Analysis Results

### Tool: Custom Clarity Analyzer
**Date:** February 2026  
**Contract:** mock-vault.clar

### Analysis Summary
- **Total Lines:** 296
- **Functions:** 15 (6 public, 9 read-only)
- **Data Maps:** 1
- **Data Vars:** 5
- **Fungible Tokens:** 1

### Function Analysis

#### Public Functions (6)
1. **deposit** ✅ Safe
   - Input validation: Yes
   - Access control: Vault pause check
   - Reentrancy: N/A (Clarity)

2. **withdraw** ✅ Safe
   - Input validation: Yes
   - Balance check: Yes
   - Reentrancy: N/A (Clarity)

3. **withdraw-with-yield** ✅ Safe
   - Full withdrawal logic: Correct
   - Balance calculation: Verified

4. **pause** ✅ Safe
   - Admin only: Yes
   - State change: Atomic

5. **unpause** ✅ Safe
   - Admin only: Yes
   - State change: Atomic

6. **set-vault-name/symbol** ✅ Safe
   - Admin only: Yes
   - String bounds: Verified

#### Read-Only Functions (9)
All read-only functions are safe with no side effects.

### Data Access Patterns
- **deposits map:** Read/Write in deposit, withdraw
- **total-deposits:** Increment/Decrement operations
- **paused:** Boolean flag

### Arithmetic Operations
- All arithmetic uses safe patterns
- Clarity's native overflow protection
- Division performed after multiplication (precision loss acceptable)
