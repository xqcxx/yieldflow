/**
 * Address Encoding Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  batchEncodeAddresses,
  batchDecodeAddresses,
  batchValidateAddresses,
  filterAddressesByNetwork,
  sortAddressesByNetwork,
  getUniqueAddresses,
  areAllAddressesValid,
  areAddressesSameNetwork,
  formatAddressDisplay,
  getAddressDetails,
  areAddressesEqual,
} from '../addressEncodingUtils';

describe('AddressEncodingUtils', () => {
  describe('batchEncodeAddresses', () => {
    it('should encode multiple valid addresses', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      const results = batchEncodeAddresses(addresses);
      
      expect(results).toHaveLength(2);
      expect(results[0].encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(results[1].encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(results[0].error).toBeNull();
      expect(results[1].error).toBeNull();
    });

    it('should handle invalid addresses', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'invalid-address',
      ];
      
      const results = batchEncodeAddresses(addresses);
      
      expect(results[0].error).toBeNull();
      expect(results[1].error).toBe('Invalid Stacks address');
      expect(results[1].encoded).toBeNull();
    });
  });

  describe('batchDecodeAddresses', () => {
    it('should decode multiple bytes32 values', () => {
      const encoded = [
        '0x1600000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
      ];
      
      const results = batchDecodeAddresses(encoded);
      
      expect(results).toHaveLength(1);
      expect(results[0].error).toBeNull();
    });

    it('should handle invalid bytes32', () => {
      const encoded = ['0x1234' as `0x${string}`];
      
      const results = batchDecodeAddresses(encoded);
      
      expect(results[0].error).toBeTruthy();
      expect(results[0].address).toBeNull();
    });
  });

  describe('batchValidateAddresses', () => {
    it('should validate multiple addresses', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'invalid',
        'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      const results = batchValidateAddresses(addresses);
      
      expect(results[0].isValid).toBe(true);
      expect(results[0].type).toBe('testnet');
      expect(results[1].isValid).toBe(false);
      expect(results[2].isValid).toBe(true);
      expect(results[2].type).toBe('mainnet');
    });
  });

  describe('filterAddressesByNetwork', () => {
    it('should filter by testnet', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      const filtered = filterAddressesByNetwork(addresses, 'testnet');
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(addr => addr.startsWith('ST'))).toBe(true);
    });
  });

  describe('sortAddressesByNetwork', () => {
    it('should sort mainnet addresses first', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      const sorted = sortAddressesByNetwork(addresses);
      
      expect(sorted[0].startsWith('SP')).toBe(true);
    });
  });

  describe('getUniqueAddresses', () => {
    it('should remove duplicates', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      const unique = getUniqueAddresses(addresses);
      
      expect(unique).toHaveLength(2);
    });
  });

  describe('areAllAddressesValid', () => {
    it('should return true for all valid', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      expect(areAllAddressesValid(addresses)).toBe(true);
    });

    it('should return false if any invalid', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'invalid',
      ];
      
      expect(areAllAddressesValid(addresses)).toBe(false);
    });
  });

  describe('areAddressesSameNetwork', () => {
    it('should return true for same network', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      expect(areAddressesSameNetwork(addresses)).toBe(true);
    });

    it('should return false for mixed networks', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      expect(areAddressesSameNetwork(addresses)).toBe(false);
    });
  });

  describe('formatAddressDisplay', () => {
    it('should format valid address', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const formatted = formatAddressDisplay(address, 6);
      
      expect(formatted).toBe('ST1PQH...TPGZGM');
    });

    it('should return original for invalid', () => {
      const address = 'invalid';
      const formatted = formatAddressDisplay(address);
      
      expect(formatted).toBe('invalid');
    });
  });

  describe('getAddressDetails', () => {
    it('should return address details', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const details = getAddressDetails(address);
      
      expect(details.address).toBe(address);
      expect(details.type).toBe('testnet');
      expect(details.versionChar).toBe('P');
      expect(details.hash160Hex).toHaveLength(40);
    });
  });

  describe('areAddressesEqual', () => {
    it('should compare addresses case-insensitively', () => {
      const addr1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const addr2 = 'st1pqhqkv0rjxzfy1dgx8mnsnyve3vgzjsrtpgzgm';
      
      expect(areAddressesEqual(addr1, addr2)).toBe(true);
    });
  });
});
