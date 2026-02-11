/**
 * Address Encoding Constants
 * 
 * Constants for Stacks address encoding
 */

// C32 alphabet used in Stacks addresses
export const C32_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

// C32 character to value mapping
export const C32_VALUES: Record<string, number> = {};
for (let i = 0; i < C32_ALPHABET.length; i++) {
  C32_VALUES[C32_ALPHABET[i]] = i;
}

// Address prefixes
export const ADDRESS_PREFIXES = {
  MAINNET: 'SP',
  TESTNET: 'ST',
} as const;

// Address lengths
export const ADDRESS_LENGTHS = {
  FULL: 41,        // Full address length
  HASH160_C32: 38, // Hash160 portion in c32
  HASH160_BYTES: 20, // Hash160 in bytes
} as const;

// xReserve encoding format
export const XRESERVE_FORMAT = {
  VERSION_BYTES: 1,
  HASH160_BYTES: 20,
  PADDING_BYTES: 11,
  TOTAL_BYTES: 32,
} as const;

// Version bytes for different address types
export const ADDRESS_VERSIONS = {
  // Mainnet
  P2PKH_MAINNET: 22, // 'P' in c32
  P2SH_MAINNET: 20,  // 'M' in c32
  
  // Testnet
  P2PKH_TESTNET: 26, // 'T' in c32
  P2SH_TESTNET: 21,  // 'N' in c32
} as const;

// Common test addresses for development
export const TEST_ADDRESSES = {
  TESTNET_VALID: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  MAINNET_VALID: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  TESTNET_ALTERNATE: 'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_PREFIX: 'Invalid Stacks address: must start with SP (mainnet) or ST (testnet)',
  INVALID_LENGTH: (expected: number, actual: number) => 
    `Invalid address length: expected ${expected} characters, got ${actual}`,
  INVALID_CHARACTER: (char: string) => `Invalid c32 character: ${char}`,
  INVALID_HASH160: (length: number) => 
    `Invalid decoded length: expected 20 bytes, got ${length}`,
  INVALID_BYTES32: 'Invalid bytes32: must be 32 bytes hex string (0x + 64 hex characters)',
  INVALID_HEX: 'Invalid hex string',
} as const;

// Validation regex patterns
export const VALIDATION_PATTERNS = {
  MAINNET: /^SP[0-9A-HJ-NP-Z]{38}$/,
  TESTNET: /^ST[0-9A-HJ-NP-Z]{38}$/,
  HEX: /^0x[0-9a-fA-F]{64}$/,
} as const;

// Address book constants
export const ADDRESS_BOOK_CONSTANTS = {
  STORAGE_KEY: 'yieldflow-address-book',
  VERSION: 1,
  MAX_NAME_LENGTH: 50,
  MAX_NOTES_LENGTH: 500,
  MAX_TAGS: 10,
} as const;
