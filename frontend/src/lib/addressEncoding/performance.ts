/**
 * Address Encoding Performance Optimizations
 * 
 * Cached and optimized encoding functions for high-frequency operations
 */

import { 
  encodeStacksAddressForXReserve,
  decodeStacksAddressFromXReserve,
  isValidStacksAddress,
  type StacksAddress,
} from './stacksAddressEncoder';

type AddressCache = Map<string, `0x${string}`>;
type ValidationCache = Map<string, boolean>;

class AddressEncodingCache {
  private encodeCache: AddressCache = new Map();
  private validationCache: ValidationCache = new Map();
  private readonly maxSize = 1000;

  getEncoded(address: string): `0x${string}` | undefined {
    return this.encodeCache.get(address);
  }

  setEncoded(address: string, encoded: `0x${string}`): void {
    this.ensureSize(this.encodeCache);
    this.encodeCache.set(address, encoded);
  }

  getValidation(address: string): boolean | undefined {
    return this.validationCache.get(address);
  }

  setValidation(address: string, isValid: boolean): void {
    this.ensureSize(this.validationCache);
    this.validationCache.set(address, isValid);
  }

  private ensureSize(cache: Map<string, any>): void {
    if (cache.size >= this.maxSize) {
      // Remove oldest 10% of entries
      const entriesToRemove = Math.floor(this.maxSize * 0.1);
      const keys = Array.from(cache.keys()).slice(0, entriesToRemove);
      keys.forEach(key => cache.delete(key));
    }
  }

  clear(): void {
    this.encodeCache.clear();
    this.validationCache.clear();
  }

  getStats(): { encodeSize: number; validationSize: number } {
    return {
      encodeSize: this.encodeCache.size,
      validationSize: this.validationCache.size,
    };
  }
}

const cache = new AddressEncodingCache();

/**
 * Cached version of encodeStacksAddressForXReserve
 * Uses LRU cache for frequently encoded addresses
 */
export function encodeStacksAddressCached(address: string): `0x${string}` {
  const cached = cache.getEncoded(address);
  if (cached) return cached;

  const encoded = encodeStacksAddressForXReserve(address);
  cache.setEncoded(address, encoded);
  return encoded;
}

/**
 * Cached version of isValidStacksAddress
 * Uses LRU cache for frequently validated addresses
 */
export function isValidStacksAddressCached(address: string): boolean {
  const cached = cache.getValidation(address);
  if (cached !== undefined) return cached;

  const isValid = isValidStacksAddress(address);
  cache.setValidation(address, isValid);
  return isValid;
}

/**
 * Optimized batch encoding with caching
 */
export function batchEncodeWithCache(addresses: string[]): Array<{
  address: string;
  encoded: `0x${string}` | null;
  fromCache: boolean;
  error: string | null;
}> {
  return addresses.map(address => {
    const cached = cache.getEncoded(address);
    if (cached) {
      return {
        address,
        encoded: cached,
        fromCache: true,
        error: null,
      };
    }

    try {
      const encoded = encodeStacksAddressForXReserve(address);
      cache.setEncoded(address, encoded);
      return {
        address,
        encoded,
        fromCache: false,
        error: null,
      };
    } catch (err) {
      return {
        address,
        encoded: null,
        fromCache: false,
        error: err instanceof Error ? err.message : 'Encoding failed',
      };
    }
  });
}

/**
 * Pre-warm cache with common addresses
 */
export function prewarmCache(addresses: string[]): void {
  addresses.forEach(address => {
    if (isValidStacksAddress(address)) {
      try {
        const encoded = encodeStacksAddressForXReserve(address);
        cache.setEncoded(address, encoded);
        cache.setValidation(address, true);
      } catch {
        cache.setValidation(address, false);
      }
    } else {
      cache.setValidation(address, false);
    }
  });
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { encodeSize: number; validationSize: number } {
  return cache.getStats();
}

/**
 * Clear all caches
 */
export function clearAddressCache(): void {
  cache.clear();
}

/**
 * Debounced validation for high-frequency input
 */
export function createDebouncedValidator(
  callback: (address: string, isValid: boolean) => void,
  delay = 300
): (address: string) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (address: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const isValid = isValidStacksAddressCached(address);
      callback(address, isValid);
    }, delay);
  };
}

/**
 * Memoized address formatter
 */
export function createMemoizedFormatter(
  chars: number = 6
): (address: string) => string {
  const memo = new Map<string, string>();

  return (address: string): string => {
    const key = `${address}-${chars}`;
    if (memo.has(key)) return memo.get(key)!;

    if (!isValidStacksAddress(address)) {
      memo.set(key, address);
      return address;
    }

    const formatted = `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
    memo.set(key, formatted);
    return formatted;
  };
}
