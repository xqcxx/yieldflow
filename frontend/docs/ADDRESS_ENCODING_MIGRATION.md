# Migration Guide: Stacks Address Encoding

## Overview

This guide helps you migrate from the old naive address encoding implementation to the new proper c32 decoding implementation.

## Breaking Changes

### Before (Old Implementation)

```typescript
// OLD - Incorrect approach
const stacksAddressBytes = `0x${stacksWallet.address
  .split('')
  .map(c => c.charCodeAt(0).toString(16))
  .join('')
  .padEnd(64, '0')}`;
```

**Problems:**
- Converts each character to its hex representation
- Doesn't properly decode c32 encoding
- Loses important address structure
- May cause bridge failures

### After (New Implementation)

```typescript
// NEW - Correct approach
import { encodeStacksAddressForXReserve } from './lib/stacksAddressEncoder';

const stacksAddressBytes = encodeStacksAddressForXReserve(stacksWallet.address);
```

**Benefits:**
- Properly decodes c32 encoding
- Extracts version byte and hash160
- Correct bytes32 format for xReserve
- Validated and tested

## Migration Steps

### 1. Update Imports

```typescript
// Old - No imports needed

// New
import { 
  encodeStacksAddressForXReserve,
  isValidStacksAddress 
} from './lib/stacksAddressEncoder';
```

### 2. Replace Encoding Code

Find all instances of the old encoding pattern:

```bash
grep -r "split('').map(c => c.charCodeAt" frontend/src/
```

Replace each occurrence:

```typescript
// Before
const stacksAddressBytes = `0x${address
  .split('')
  .map(c => c.charCodeAt(0).toString(16))
  .join('')
  .padEnd(64, '0')}`;

// After
const stacksAddressBytes = encodeStacksAddressForXReserve(address);
```

### 3. Add Validation (Optional but Recommended)

```typescript
// Before
const stacksAddressBytes = `0x${address.split('').map(...)}`;

// After
if (!isValidStacksAddress(address)) {
  throw new Error('Invalid Stacks address');
}
const stacksAddressBytes = encodeStacksAddressForXReserve(address);
```

### 4. Update ZapFlow Component

The `ZapFlow.tsx` component has already been updated. If you have customizations:

```typescript
// Add import at top
import { encodeStacksAddressForXReserve } from '../lib/stacksAddressEncoder';

// Replace in depositData useMemo
const stacksAddressBytes = encodeStacksAddressForXReserve(stacksWallet.address);

// Replace in handleDeposit
const stacksAddressBytes = encodeStacksAddressForXReserve(stacksWallet.address);
```

### 5. Test Your Changes

1. Run unit tests:
```bash
cd frontend
npm test -- stacksAddressEncoder
```

2. Test with valid addresses:
```typescript
const testAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const encoded = encodeStacksAddressForXReserve(testAddress);
console.log(encoded); // Should be 66 characters (0x + 64 hex)
```

3. Test with invalid addresses:
```typescript
const invalidAddress = 'invalid';
try {
  encodeStacksAddressForXReserve(invalidAddress);
} catch (e) {
  console.log('Correctly throws error');
}
```

## Common Issues

### Issue: "Invalid Stacks address" error

**Cause:** Address doesn't match expected format

**Solution:** 
- Ensure address starts with 'ST' (testnet) or 'SP' (mainnet)
- Check address length is 41 characters
- Verify no extra spaces or special characters

### Issue: Different encoding results

**Cause:** Old and new implementations produce different outputs

**Solution:**
- This is expected - the new implementation is correct
- Update any tests that check for specific encoded values
- Re-test bridge transactions with new encoding

### Issue: TypeScript errors

**Cause:** Missing imports or type definitions

**Solution:**
```typescript
// Ensure proper imports
import { 
  encodeStacksAddressForXReserve,
  type StacksAddress 
} from './lib/stacksAddressEncoder';
```

## Testing Migration

### Unit Tests

```bash
# Run all address encoding tests
npm test -- stacksAddressEncoder.test.ts
npm test -- addressEncodingUtils.test.ts
npm test -- addressBook.test.ts
```

### Integration Tests

1. Test the demo page:
```bash
npm run dev
# Navigate to /address-encoding-demo
```

2. Test in actual ZapFlow:
- Connect wallet
- Enter amount
- Check that deposit transaction uses correct encoding

### Manual Testing Checklist

- [ ] Valid testnet address encodes correctly
- [ ] Valid mainnet address encodes correctly
- [ ] Invalid address throws appropriate error
- [ ] ZapFlow deposit works with new encoding
- [ ] Gas estimation works with new encoding

## Rollback Plan

If issues arise:

1. Revert the specific commits:
```bash
git revert <commit-hash>
```

2. Or checkout the previous version of modified files:
```bash
git checkout HEAD~1 -- frontend/src/components/ZapFlow.tsx
```

3. Rebuild and redeploy:
```bash
npm run build
```

## Support

For issues or questions:
1. Check the documentation in `docs/STACKS_ADDRESS_ENCODING.md`
2. Review test files for usage examples
3. Check the demo component at `components/AddressEncodingDemo.tsx`

## References

- [Stacks c32 Library](https://github.com/hirosystems/stacks.js/tree/main/packages/c32)
- [Circle xReserve Documentation](https://developers.circle.com/xreserve)
- [Crockford Base32 Specification](https://www.crockford.com/base32.html)
