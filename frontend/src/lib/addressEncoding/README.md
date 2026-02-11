# Stacks Address Encoding Module

## Overview

This module provides comprehensive functionality for encoding and decoding Stacks addresses for use with the Circle xReserve bridge. It includes proper c32 decoding, validation, batch operations, address book management, and React components.

## Structure

```
frontend/src/
├── lib/
│   ├── addressEncoding/
│   │   ├── index.ts           # Main exports
│   │   └── constants.ts       # Constants and configuration
│   ├── stacksAddressEncoder.ts   # Core encoding functions
│   ├── addressEncodingUtils.ts   # Batch operations
│   └── addressBook.ts            # Address book management
├── hooks/
│   └── addressEncoding/
│       ├── index.ts           # Hook exports
│       ├── useAddressValidation.ts
│       └── useAddressBook.ts
├── components/
│   └── addressEncoding/
│       ├── index.ts           # Component exports
│       ├── StacksAddressInput.tsx
│       ├── AddressBook.tsx
│       └── AddressEncodingDemo.tsx
└── lib/__tests__/
    ├── stacksAddressEncoder.test.ts
    ├── addressEncodingUtils.test.ts
    └── addressBook.test.ts
```

## Quick Start

### Basic Encoding

```typescript
import { encodeStacksAddressForXReserve, isValidStacksAddress } from './lib/stacksAddressEncoder';

const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

if (isValidStacksAddress(address)) {
  const bytes32 = encodeStacksAddressForXReserve(address);
  console.log(bytes32); // 0x1600000000000000000000000000000000000000000000000000000000000000
}
```

### Using React Components

```typescript
import { StacksAddressInput } from './components/addressEncoding';

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

### Using React Hooks

```typescript
import { useStacksAddressValidation } from './hooks/addressEncoding';

function MyComponent() {
  const { isValid, type, error, validate } = useStacksAddressValidation();
  
  const handleChange = (address: string) => {
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

### Address Book

```typescript
import { addressBook } from './lib/addressBook';

// Add an entry
const entry = addressBook.addEntry('My Wallet', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', {
  tags: ['personal'],
  notes: 'Main testnet wallet',
});

// Search entries
const results = addressBook.searchByName('my');

// Use React component
import { AddressBookComponent } from './components/addressEncoding';

<AddressBookComponent onSelect={(entry) => console.log(entry.address)} />
```

## API Reference

### Core Functions

#### `encodeStacksAddressForXReserve(address: string): `0x${string}``

Encodes a Stacks address to bytes32 format for xReserve bridge.

**Example:**
```typescript
const encoded = encodeStacksAddressForXReserve('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
// Returns: 0x1600000000000000000000000000000000000000000000000000000000000000
```

#### `decodeStacksAddressFromXReserve(bytes32: `0x${string}`): string`

Decodes a bytes32 back to a Stacks address (simplified implementation).

#### `parseStacksAddress(address: string): StacksAddress`

Parses a Stacks address into its components:
- `version`: number - Version byte
- `hash160`: Uint8Array - 20-byte hash160
- `type`: 'mainnet' | 'testnet'

#### `isValidStacksAddress(address: string): boolean`

Validates if a string is a valid Stacks address format.

#### `getStacksAddressType(address: string): 'mainnet' | 'testnet' | null`

Returns the network type of a Stacks address.

### Batch Utilities

#### `batchEncodeAddresses(addresses: string[]): BatchEncodingResult[]`

Encodes multiple addresses at once.

#### `batchValidateAddresses(addresses: string[]): BatchValidationResult[]`

Validates multiple addresses at once.

#### `formatAddressDisplay(address: string, chars?: number): string`

Formats address for display (e.g., `ST1PQH...TPGZGM`).

### Address Book

#### `AddressBookManager`

Class for managing saved addresses:
- `addEntry(name, address, options?)` - Add new entry
- `updateEntry(id, updates)` - Update existing entry
- `removeEntry(id)` - Remove entry
- `getAllEntries()` - Get all entries
- `searchByName(query)` - Search by name
- `filterByType(type)` - Filter by network type
- `filterByTag(tag)` - Filter by tag
- `exportToJSON()` - Export to JSON
- `importFromJSON(json)` - Import from JSON

## Constants

All constants are exported from `addressEncoding/constants.ts`:

- `C32_ALPHABET` - C32 alphabet string
- `ADDRESS_PREFIXES` - Mainnet ('SP') and Testnet ('ST') prefixes
- `ADDRESS_LENGTHS` - Various address length constants
- `XRESERVE_FORMAT` - Bytes32 format structure
- `ADDRESS_VERSIONS` - Version byte values
- `VALIDATION_PATTERNS` - Regex patterns for validation

## Testing

Run all tests:

```bash
cd frontend
npm test -- addressEncoding
```

Run specific test file:

```bash
npm test -- stacksAddressEncoder.test.ts
```

## Integration

See `docs/STACKS_ADDRESS_ENCODING.md` for detailed integration guide with examples.

## Architecture

### Address Format

Stacks addresses follow the c32 (Crockford Base32) encoding:

```
[Prefix:2][Version:1][Hash160:38 in c32] = 41 characters
   ST      P      QHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

### xReserve Encoding

For xReserve bridge, addresses are encoded as:

```
[Version:1][Hash160:20][Padding:11] = 32 bytes
```

## License

MIT
