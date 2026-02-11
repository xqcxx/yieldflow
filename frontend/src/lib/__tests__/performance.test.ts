/**
 * Performance Optimization Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  encodeStacksAddressCached,
  isValidStacksAddressCached,
  batchEncodeWithCache,
  prewarmCache,
  getCacheStats,
  clearAddressCache,
  createDebouncedValidator,
  createMemoizedFormatter,
} from '../performance';

describe('Address Encoding Performance', () => {
  beforeEach(() => {
    clearAddressCache();
  });

  describe('encodeStacksAddressCached', () => {
    it('should cache encoded addresses', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      
      const encoded1 = encodeStacksAddressCached(address);
      const encoded2 = encodeStacksAddressCached(address);
      
      expect(encoded1).toBe(encoded2);
      expect(getCacheStats().encodeSize).toBe(1);
    });

    it('should return different results for different addresses', () => {
      const address1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const address2 = 'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      
      const encoded1 = encodeStacksAddressCached(address1);
      const encoded2 = encodeStacksAddressCached(address2);
      
      expect(encoded1).not.toBe(encoded2);
      expect(getCacheStats().encodeSize).toBe(2);
    });
  });

  describe('isValidStacksAddressCached', () => {
    it('should cache validation results', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      
      const valid1 = isValidStacksAddressCached(address);
      const valid2 = isValidStacksAddressCached(address);
      
      expect(valid1).toBe(true);
      expect(valid2).toBe(true);
      expect(getCacheStats().validationSize).toBe(1);
    });

    it('should cache invalid results', () => {
      const address = 'invalid';
      
      const valid1 = isValidStacksAddressCached(address);
      const valid2 = isValidStacksAddressCached(address);
      
      expect(valid1).toBe(false);
      expect(valid2).toBe(false);
      expect(getCacheStats().validationSize).toBe(1);
    });
  });

  describe('batchEncodeWithCache', () => {
    it('should encode multiple addresses', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      const results = batchEncodeWithCache(addresses);
      
      expect(results).toHaveLength(2);
      expect(results[0].encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(results[1].encoded).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(results[0].fromCache).toBe(false);
    });

    it('should use cache on second call', () => {
      const addresses = ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'];
      
      batchEncodeWithCache(addresses);
      const results = batchEncodeWithCache(addresses);
      
      expect(results[0].fromCache).toBe(true);
    });

    it('should handle invalid addresses', () => {
      const addresses = ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'invalid'];
      
      const results = batchEncodeWithCache(addresses);
      
      expect(results[0].error).toBeNull();
      expect(results[1].error).toBeTruthy();
      expect(results[1].encoded).toBeNull();
    });
  });

  describe('prewarmCache', () => {
    it('should prewarm cache with addresses', () => {
      const addresses = [
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      ];
      
      prewarmCache(addresses);
      const stats = getCacheStats();
      
      expect(stats.encodeSize).toBe(2);
      expect(stats.validationSize).toBe(2);
    });

    it('should handle invalid addresses', () => {
      const addresses = ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'invalid'];
      
      prewarmCache(addresses);
      const stats = getCacheStats();
      
      expect(stats.validationSize).toBe(2);
      expect(stats.encodeSize).toBe(1); // Only valid addresses are encoded
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      encodeStacksAddressCached('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      expect(getCacheStats().encodeSize).toBe(1);
      
      clearAddressCache();
      expect(getCacheStats().encodeSize).toBe(0);
      expect(getCacheStats().validationSize).toBe(0);
    });
  });

  describe('createDebouncedValidator', () => {
    it('should create a debounced validator', () => {
      const callback = (addr: string, valid: boolean) => {
        // Callback function
      };
      
      const validator = createDebouncedValidator(callback, 100);
      expect(typeof validator).toBe('function');
    });
  });

  describe('createMemoizedFormatter', () => {
    it('should format addresses consistently', () => {
      const formatter = createMemoizedFormatter(6);
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      
      const formatted1 = formatter(address);
      const formatted2 = formatter(address);
      
      expect(formatted1).toBe('ST1PQH...TPGZGM');
      expect(formatted1).toBe(formatted2);
    });

    it('should format different addresses', () => {
      const formatter = createMemoizedFormatter(6);
      const address1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const address2 = 'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      
      const formatted1 = formatter(address1);
      const formatted2 = formatter(address2);
      
      expect(formatted1).not.toBe(formatted2);
    });

    it('should return original for invalid addresses', () => {
      const formatter = createMemoizedFormatter(6);
      const invalid = 'invalid';
      
      const formatted = formatter(invalid);
      
      expect(formatted).toBe(invalid);
    });
  });
});
