/**
 * Stacks Address Encoder
 * 
 * Properly encode Stacks addresses for xReserve bridge integration.
 * Stacks addresses are c32-encoded (Crockford Base32) and need conversion
 * to bytes32 format for Ethereum contract calls.
 */

import { bytesToHex, hexToBytes, isHex } from 'viem';

// C32 alphabet for Stacks addresses
const C32_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

// C32 character to value mapping
const C32_VALUES: Record<string, number> = {};
for (let i = 0; i < C32_ALPHABET.length; i++) {
  C32_VALUES[C32_ALPHABET[i]] = i;
}

export interface StacksAddress {
  version: number;
  hash160: Uint8Array; // 20 bytes
  type: 'mainnet' | 'testnet';
}

/**
 * Decode a c32-encoded string to bytes
 */
function c32Decode(input: string): Uint8Array {
  const result: number[] = [];
  let carry = 0;
  let bits = 0;

  for (let i = input.length - 1; i >= 0; i--) {
    const char = input[i];
    const value = C32_VALUES[char];
    
    if (value === undefined) {
      throw new Error(`Invalid c32 character: ${char}`);
    }

    carry = carry | (value << bits);
    bits += 5;

    while (bits >= 8) {
      result.unshift(carry & 0xff);
      carry = carry >> 8;
      bits -= 8;
    }
  }

  if (bits > 0) {
    result.unshift(carry & 0xff);
  }

  // Remove leading zero bytes
  while (result.length > 0 && result[0] === 0) {
    result.shift();
  }

  return new Uint8Array(result);
}

/**
 * Parse a Stacks address string into components
 */
export function parseStacksAddress(address: string): StacksAddress {
  if (!address || typeof address !== 'string') {
    throw new Error('Invalid address: must be a non-empty string');
  }

  // Check prefix
  let type: 'mainnet' | 'testnet';
  let versionChar: string;
  
  if (address.startsWith('SP')) {
    type = 'mainnet';
    versionChar = address[2];
  } else if (address.startsWith('ST')) {
    type = 'testnet';
    versionChar = address[2];
  } else {
    throw new Error('Invalid Stacks address: must start with SP (mainnet) or ST (testnet)');
  }

  // Parse version
  const version = C32_VALUES[versionChar];
  if (version === undefined) {
    throw new Error(`Invalid version character: ${versionChar}`);
  }

  // Decode the hash160 portion (remaining 38 characters)
  const c32Data = address.slice(3);
  if (c32Data.length !== 38) {
    throw new Error(`Invalid address length: expected 41 characters, got ${address.length}`);
  }

  const decoded = c32Decode(c32Data);
  
  // Hash160 should be 20 bytes
  if (decoded.length !== 20) {
    throw new Error(`Invalid decoded length: expected 20 bytes, got ${decoded.length}`);
  }

  return {
    version,
    hash160: decoded,
    type,
  };
}

/**
 * Encode Stacks address for xReserve (bytes32)
 * Format: [version:1][hash160:20][padding:11] = 32 bytes
 */
export function encodeStacksAddressForXReserve(address: string): `0x${string}` {
  const parsed = parseStacksAddress(address);
  
  // Create 32-byte buffer
  const buffer = new Uint8Array(32);
  
  // Byte 0: Version
  buffer[0] = parsed.version;
  
  // Bytes 1-20: Hash160
  buffer.set(parsed.hash160, 1);
  
  // Bytes 21-31: Padding (zeros)
  // Already initialized to 0

  return `0x${bytesToHex(buffer).slice(2)}` as `0x${string}`;
}

/**
 * Decode bytes32 back to Stacks address
 */
export function decodeStacksAddressFromXReserve(bytes32: `0x${string}`): string {
  if (!isHex(bytes32) || bytes32.length !== 66) {
    throw new Error('Invalid bytes32: must be 32 bytes hex string');
  }

  const bytes = hexToBytes(bytes32);
  
  // Byte 0: Version
  const version = bytes[0];
  
  // Bytes 1-20: Hash160
  const hash160 = bytes.slice(1, 21);
  
  // Reconstruct c32 address (simplified - full implementation would re-encode)
  // For now, return a placeholder that can be improved
  const type = version === 22 ? 'SP' : 'ST'; // Simplified version check
  
  // This is a simplified version - full c32 encoding is complex
  // In production, use @stacks/transactions for full encoding
  return `${type}${C32_ALPHABET[version]}${bytesToHex(hash160).slice(2)}`;
}

/**
 * Validate a Stacks address
 */
export function isValidStacksAddress(address: string): boolean {
  try {
    parseStacksAddress(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get address type (mainnet or testnet)
 */
export function getStacksAddressType(address: string): 'mainnet' | 'testnet' | null {
  try {
    const parsed = parseStacksAddress(address);
    return parsed.type;
  } catch {
    return null;
  }
}
