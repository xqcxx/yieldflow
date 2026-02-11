/**
 * Address Encoding Utilities
 * 
 * Batch operations and helper functions for Stacks address encoding
 */

import { 
  encodeStacksAddressForXReserve, 
  decodeStacksAddressFromXReserve,
  isValidStacksAddress,
  getStacksAddressType,
  parseStacksAddress,
} from './stacksAddressEncoder';

export interface BatchEncodingResult {
  address: string;
  encoded: `0x${string}` | null;
  error: string | null;
}

export interface BatchDecodingResult {
  bytes32: `0x${string}`;
  address: string | null;
  error: string | null;
}

export interface BatchValidationResult {
  address: string;
  isValid: boolean;
  type: 'mainnet' | 'testnet' | null;
  error: string | null;
}

/**
 * Encode multiple Stacks addresses to bytes32 format
 */
export function batchEncodeAddresses(addresses: string[]): BatchEncodingResult[] {
  return addresses.map(address => {
    try {
      if (!isValidStacksAddress(address)) {
        return {
          address,
          encoded: null,
          error: 'Invalid Stacks address',
        };
      }

      const encoded = encodeStacksAddressForXReserve(address);
      return {
        address,
        encoded,
        error: null,
      };
    } catch (err) {
      return {
        address,
        encoded: null,
        error: err instanceof Error ? err.message : 'Encoding failed',
      };
    }
  });
}

/**
 * Decode multiple bytes32 values to Stacks addresses
 */
export function batchDecodeAddresses(bytes32Array: `0x${string}`[]): BatchDecodingResult[] {
  return bytes32Array.map(bytes32 => {
    try {
      const address = decodeStacksAddressFromXReserve(bytes32);
      return {
        bytes32,
        address,
        error: null,
      };
    } catch (err) {
      return {
        bytes32,
        address: null,
        error: err instanceof Error ? err.message : 'Decoding failed',
      };
    }
  });
}

/**
 * Validate multiple Stacks addresses
 */
export function batchValidateAddresses(addresses: string[]): BatchValidationResult[] {
  return addresses.map(address => {
    try {
      const isValid = isValidStacksAddress(address);
      const type = isValid ? getStacksAddressType(address) : null;

      return {
        address,
        isValid,
        type,
        error: isValid ? null : 'Invalid Stacks address',
      };
    } catch (err) {
      return {
        address,
        isValid: false,
        type: null,
        error: err instanceof Error ? err.message : 'Validation failed',
      };
    }
  });
}

/**
 * Filter addresses by network type
 */
export function filterAddressesByNetwork(
  addresses: string[],
  network: 'mainnet' | 'testnet'
): string[] {
  return addresses.filter(address => {
    const type = getStacksAddressType(address);
    return type === network;
  });
}

/**
 * Sort addresses by network (mainnet first, then testnet)
 */
export function sortAddressesByNetwork(addresses: string[]): string[] {
  return addresses.sort((a, b) => {
    const typeA = getStacksAddressType(a);
    const typeB = getStacksAddressType(b);
    
    if (typeA === 'mainnet' && typeB !== 'mainnet') return -1;
    if (typeA !== 'mainnet' && typeB === 'mainnet') return 1;
    return 0;
  });
}

/**
 * Get unique addresses from a list
 */
export function getUniqueAddresses(addresses: string[]): string[] {
  return Array.from(new Set(addresses));
}

/**
 * Check if all addresses in a list are valid
 */
export function areAllAddressesValid(addresses: string[]): boolean {
  return addresses.every(address => isValidStacksAddress(address));
}

/**
 * Check if all addresses are from the same network
 */
export function areAddressesSameNetwork(addresses: string[]): boolean {
  if (addresses.length === 0) return true;
  
  const firstType = getStacksAddressType(addresses[0]);
  return addresses.every(address => getStacksAddressType(address) === firstType);
}

/**
 * Format address for display (shorten middle)
 */
export function formatAddressDisplay(address: string, chars: number = 6): string {
  if (!isValidStacksAddress(address)) return address;
  if (address.length <= chars * 2 + 3) return address;
  
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Parse address details
 */
export interface AddressDetails {
  address: string;
  type: 'mainnet' | 'testnet';
  version: number;
  versionChar: string;
  hash160Hex: string;
}

export function getAddressDetails(address: string): AddressDetails {
  const parsed = parseStacksAddress(address);
  
  return {
    address,
    type: parsed.type,
    version: parsed.version,
    versionChar: address[2],
    hash160Hex: Array.from(parsed.hash160)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''),
  };
}

/**
 * Compare two addresses for equality
 */
export function areAddressesEqual(addr1: string, addr2: string): boolean {
  return addr1.toLowerCase() === addr2.toLowerCase();
}
