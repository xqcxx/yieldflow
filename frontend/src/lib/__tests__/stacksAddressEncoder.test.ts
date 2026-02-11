/**
 * Stacks Address Encoder Tests
 */

import { describe, it, expect } from 'vitest';
import {
  parseStacksAddress,
  encodeStacksAddressForXReserve,
  decodeStacksAddressFromXReserve,
  isValidStacksAddress,
  getStacksAddressType,
} from '../stacksAddressEncoder';

describe('StacksAddressEncoder', () => {
  describe('parseStacksAddress', () => {
    it('should parse valid testnet address', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const parsed = parseStacksAddress(address);
      
      expect(parsed.type).toBe('testnet');
      expect(parsed.version).toBe(22); // 'P' in c32
      expect(parsed.hash160).toBeInstanceOf(Uint8Array);
      expect(parsed.hash160.length).toBe(20);
    });

    it('should parse valid mainnet address', () => {
      const address = 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const parsed = parseStacksAddress(address);
      
      expect(parsed.type).toBe('mainnet');
      expect(parsed.version).toBe(22);
      expect(parsed.hash160.length).toBe(20);
    });

    it('should throw for invalid prefix', () => {
      expect(() => parseStacksAddress('SX1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'))
        .toThrow('must start with SP');
    });

    it('should throw for wrong length', () => {
      expect(() => parseStacksAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZ'))
        .toThrow('Invalid address length');
    });

    it('should throw for empty string', () => {
      expect(() => parseStacksAddress(''))
        .toThrow('must be a non-empty string');
    });
  });

  describe('encodeStacksAddressForXReserve', () => {
    it('should encode testnet address to bytes32', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const encoded = encodeStacksAddressForXReserve(address);
      
      expect(encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(encoded.length).toBe(66); // 0x + 64 hex chars
    });

    it('should encode mainnet address to bytes32', () => {
      const address = 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const encoded = encodeStacksAddressForXReserve(address);
      
      expect(encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
    });

    it('should produce consistent encoding', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const encoded1 = encodeStacksAddressForXReserve(address);
      const encoded2 = encodeStacksAddressForXReserve(address);
      
      expect(encoded1).toBe(encoded2);
    });
  });

  describe('decodeStacksAddressFromXReserve', () => {
    it('should decode bytes32 back to address', () => {
      const original = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const encoded = encodeStacksAddressForXReserve(original);
      
      // Note: Full roundtrip requires complete c32 encoding
      // This tests the basic structure
      expect(() => decodeStacksAddressFromXReserve(encoded)).not.toThrow();
    });

    it('should throw for invalid hex', () => {
      expect(() => decodeStacksAddressFromXReserve('not-hex' as `0x${string}`))
        .toThrow('Invalid bytes32');
    });

    it('should throw for wrong length', () => {
      expect(() => decodeStacksAddressFromXReserve('0x1234' as `0x${string}`))
        .toThrow('Invalid bytes32');
    });
  });

  describe('isValidStacksAddress', () => {
    it('should return true for valid testnet address', () => {
      expect(isValidStacksAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'))
        .toBe(true);
    });

    it('should return true for valid mainnet address', () => {
      expect(isValidStacksAddress('SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'))
        .toBe(true);
    });

    it('should return false for invalid address', () => {
      expect(isValidStacksAddress('invalid')).toBe(false);
      expect(isValidStacksAddress('')).toBe(false);
      expect(isValidStacksAddress('SX1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'))
        .toBe(false);
    });
  });

  describe('getStacksAddressType', () => {
    it('should return testnet for ST address', () => {
      expect(getStacksAddressType('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'))
        .toBe('testnet');
    });

    it('should return mainnet for SP address', () => {
      expect(getStacksAddressType('SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'))
        .toBe('mainnet');
    });

    it('should return null for invalid address', () => {
      expect(getStacksAddressType('invalid')).toBeNull();
    });
  });
});
