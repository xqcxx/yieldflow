# Stacks Address Encoding

## Overview

This module provides proper encoding and decoding of Stacks addresses for use with the Circle xReserve bridge. Stacks addresses use c32 encoding (Crockford Base32) and need to be converted to bytes32 format for Ethereum smart contract calls.

## Problem

The original implementation used a naive approach to encode Stacks addresses:

```typescript
// OLD - Incorrect approach
const stacksAddressBytes = `0x${stacksWallet.address
  .split('')
  .map(c => c.charCodeAt(0).toString(16))
  .join('')
  .padEnd(64, '0')}`;
```

This approach simply converts each character to its hex representation, which doesn't properly encode the c32 data and loses important address information.

## Solution

The new implementation properly decodes the c32-encoded address and extracts the version byte and hash160:

```typescript
// NEW - Correct approach
const stacksAddressBytes = encodeStacksAddressForXReserve(stacksWallet.address);
// Returns: 0x160000... (32 bytes: version + hash160 + padding)
```

## Stacks Address Format

Stacks addresses follow this format:
- **Mainnet**: Starts with `SP` (e.g., `SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`)
- **Testnet**: Starts with `ST` (e.g., `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`)
- **Length**: Always 41 characters
- **Encoding**: c32 (Crockford Base32)

### Structure

```
[Prefix:2][Version:1][Hash160:38 in c32]
   SP      P      QHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

## xReserve Encoding Format

For xReserve bridge integration, Stacks addresses must be encoded as bytes32:

```
[Version:1 byte][Hash160:20 bytes][Padding:11 bytes] = 32 bytes
```

## Usage

### Basic Encoding

```typescript
import { encodeStacksAddressForXReserve } from './lib/stacksAddressEncoder';

const stacksAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const bytes32 = encodeStacksAddressForXReserve(stacksAddress);
// Result: 0x160000... (32 bytes)
```

### Validation

```typescript
import { isValidStacksAddress, getStacksAddressType } from './lib/stacksAddressEncoder';

if (isValidStacksAddress(address)) {
  const type = getStacksAddressType(address);
  console.log(`Valid ${type} address`);
}
```

### React Hook

```typescript
import { useStacksAddressValidation } from './hooks/useAddressValidation';

function MyComponent() {
  const { isValid, type, error, validate } = useStacksAddressValidation();
  
  const handleAddressChange = (address: string) => {
    validate(address);
  };
  
  return (
    <div>
      {isValid && <span>Valid {type} address</span>}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

### Input Component

```typescript
import { StacksAddressInput } from './components/StacksAddressInput';

function MyForm() {
  const [address, setAddress] = useState('');
  
  return (
    <StacksAddressInput
      value={address}
      onChange={(value, isValid) => setAddress(value)}
      label="Recipient Address"
    />
  );
}
```

## API Reference

### Functions

#### `parseStacksAddress(address: string): StacksAddress`

Parses a Stacks address string into its components.

**Returns:**
- `version`: number - Version byte
- `hash160`: Uint8Array - 20-byte hash160
- `type`: 'mainnet' | 'testnet'

#### `encodeStacksAddressForXReserve(address: string): `0x${string}``

Encodes a Stacks address to bytes32 format for xReserve.

**Returns:** 32-byte hex string (0x + 64 hex characters)

#### `decodeStacksAddressFromXReserve(bytes32: `0x${string}`): string`

Decodes a bytes32 back to a Stacks address (simplified implementation).

#### `isValidStacksAddress(address: string): boolean`

Validates if a string is a valid Stacks address.

#### `getStacksAddressType(address: string): 'mainnet' | 'testnet' | null`

Returns the network type of a Stacks address.

## Testing

Run the test suite:

```bash
cd frontend
npm test -- stacksAddressEncoder.test.ts
```

## References

- [Stacks c32 Library](https://github.com/hirosystems/stacks.js/tree/main/packages/c32)
- [Circle xReserve Documentation](https://developers.circle.com/xreserve)
- [Crockford Base32](https://www.crockford.com/base32.html)