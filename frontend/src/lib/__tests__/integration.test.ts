/**
 * Address Encoding Integration Tests
 * 
 * End-to-end tests for the complete encoding pipeline
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  encodeStacksAddressForXReserve,
  isValidStacksAddress,
  parseStacksAddress,
} from '../stacksAddressEncoder';
import {
  batchEncodeAddresses,
  formatAddressDisplay,
} from '../addressEncodingUtils';
import { addressBook } from '../addressBook';
import {
  encodeStacksAddressCached,
  clearAddressCache,
} from '../addressEncoding/performance';
import { TEST_ADDRESSES, ADDRESS_PREFIXES } from '../addressEncoding/constants';

describe('Address Encoding Integration', () => {
  beforeEach(() => {
    addressBook.clear();
    clearAddressCache();
  });

  describe('Complete Encoding Pipeline', () => {
    it('should encode testnet address correctly', () => {
      const address = TEST_ADDRESSES.TESTNET_VALID;
      
      // Step 1: Validate
      expect(isValidStacksAddress(address)).toBe(true);
      
      // Step 2: Parse
      const parsed = parseStacksAddress(address);
      expect(parsed.type).toBe('testnet');
      expect(parsed.hash160.length).toBe(20);
      
      // Step 3: Encode
      const encoded = encodeStacksAddressForXReserve(address);
      expect(encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
      
      // Step 4: Verify structure
      const version = parseInt(encoded.slice(2, 4), 16);
      expect(version).toBe(parsed.version);
    });

    it('should encode mainnet address correctly', () => {
      const address = TEST_ADDRESSES.MAINNET_VALID;
      
      const parsed = parseStacksAddress(address);
      expect(parsed.type).toBe('mainnet');
      
      const encoded = encodeStacksAddressForXReserve(address);
      expect(encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
    });

    it('should handle batch encoding workflow', () => {
      const addresses = [
        TEST_ADDRESSES.TESTNET_VALID,
        TEST_ADDRESSES.MAINNET_VALID,
        TEST_ADDRESSES.TESTNET_ALTERNATE,
      ];
      
      // Validate all
      addresses.forEach(addr => {
        expect(isValidStacksAddress(addr)).toBe(true);
      });
      
      // Batch encode
      const results = batchEncodeAddresses(addresses);
      expect(results).toHaveLength(3);
      
      results.forEach(result => {
        expect(result.error).toBeNull();
        expect(result.encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
      });
    });

    it('should integrate with address book', () => {
      const address = TEST_ADDRESSES.TESTNET_VALID;
      
      // Add to address book
      const entry = addressBook.addEntry('Test Entry', address, {
        tags: ['test', 'integration'],
        notes: 'Integration test address',
      });
      
      // Retrieve and encode
      const retrieved = addressBook.findByAddress(address);
      expect(retrieved).toBeTruthy();
      
      const encoded = encodeStacksAddressForXReserve(retrieved!.address);
      expect(encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
      
      // Verify entry details
      expect(entry.tags).toContain('test');
      expect(entry.notes).toBe('Integration test address');
    });

    it('should use cache after first encoding', () => {
      const address = TEST_ADDRESSES.TESTNET_VALID;
      
      // First encode - not cached
      const encoded1 = encodeStacksAddressCached(address);
      
      // Second encode - should use cache
      const encoded2 = encodeStacksAddressCached(address);
      
      expect(encoded1).toBe(encoded2);
    });

    it('should format addresses for display', () => {
      const address = TEST_ADDRESSES.TESTNET_VALID;
      const formatted = formatAddressDisplay(address, 6);
      
      expect(formatted).toBe('ST1PQH...TPGZGM');
      expect(formatted.length).toBeLessThan(address.length);
    });
  });

  describe('xReserve Bridge Simulation', () => {
    it('should simulate complete bridge flow', () => {
      // Step 1: User enters Stacks address
      const userAddress = TEST_ADDRESSES.TESTNET_VALID;
      
      // Step 2: Validate address
      expect(isValidStacksAddress(userAddress)).toBe(true);
      
      // Step 3: Check network type
      const type = userAddress.startsWith(ADDRESS_PREFIXES.TESTNET) 
        ? 'testnet' 
        : 'mainnet';
      expect(type).toBe('testnet');
      
      // Step 4: Parse address details
      const parsed = parseStacksAddress(userAddress);
      expect(parsed.version).toBeGreaterThan(0);
      expect(parsed.hash160.length).toBe(20);
      
      // Step 5: Encode for xReserve
      const bytes32 = encodeStacksAddressForXReserve(userAddress);
      expect(bytes32.length).toBe(66); // 0x + 64 hex chars
      
      // Step 6: Verify format
      // [version:1][hash160:20][padding:11] = 32 bytes
      const versionByte = bytes32.slice(0, 4);
      const hash160Hex = bytes32.slice(4, 44);
      const padding = bytes32.slice(44, 66);
      
      expect(versionByte).toBeTruthy();
      expect(hash160Hex.length).toBe(40); // 20 bytes = 40 hex chars
      expect(padding).toBeTruthy();
    });

    it('should handle multiple bridge operations', () => {
      const operations = [
        { name: 'User A', address: TEST_ADDRESSES.TESTNET_VALID },
        { name: 'User B', address: TEST_ADDRESSES.TESTNET_ALTERNATE },
      ];
      
      const results = operations.map(op => {
        // Validate
        const isValid = isValidStacksAddress(op.address);
        
        // Encode
        const encoded = isValid 
          ? encodeStacksAddressForXReserve(op.address)
          : null;
        
        return {
          ...op,
          isValid,
          encoded,
        };
      });
      
      results.forEach(result => {
        expect(result.isValid).toBe(true);
        expect(result.encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid address gracefully', () => {
      const invalidAddresses = [
        'invalid',
        '',
        'SX1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZ',
      ];
      
      invalidAddresses.forEach(addr => {
        expect(isValidStacksAddress(addr)).toBe(false);
      });
      
      const batchResults = batchEncodeAddresses(invalidAddresses);
      batchResults.forEach(result => {
        expect(result.error).toBeTruthy();
        expect(result.encoded).toBeNull();
      });
    });

    it('should recover from partial failures', () => {
      const mixedAddresses = [
        TEST_ADDRESSES.TESTNET_VALID,
        'invalid',
        TEST_ADDRESSES.MAINNET_VALID,
      ];
      
      const results = batchEncodeAddresses(mixedAddresses);
      
      expect(results[0].error).toBeNull();
      expect(results[0].encoded).toBeTruthy();
      
      expect(results[1].error).toBeTruthy();
      expect(results[1].encoded).toBeNull();
      
      expect(results[2].error).toBeNull();
      expect(results[2].encoded).toBeTruthy();
    });
  });

  describe('Data Consistency', () => {
    it('should produce consistent encoding results', () => {
      const address = TEST_ADDRESSES.TESTNET_VALID;
      
      const encoded1 = encodeStacksAddressForXReserve(address);
      const encoded2 = encodeStacksAddressForXReserve(address);
      const encoded3 = encodeStacksAddressCached(address);
      
      expect(encoded1).toBe(encoded2);
      expect(encoded2).toBe(encoded3);
    });

    it('should maintain data integrity through parse/encode cycle', () => {
      const originalAddress = TEST_ADDRESSES.TESTNET_VALID;
      
      const parsed = parseStacksAddress(originalAddress);
      const encoded = encodeStacksAddressForXReserve(originalAddress);
      
      // Verify version byte matches
      const encodedVersion = parseInt(encoded.slice(2, 4), 16);
      expect(encodedVersion).toBe(parsed.version);
      
      // Verify type matches prefix
      const expectedPrefix = parsed.type === 'mainnet' 
        ? ADDRESS_PREFIXES.MAINNET 
        : ADDRESS_PREFIXES.TESTNET;
      expect(originalAddress.startsWith(expectedPrefix)).toBe(true);
    });
  });
});
