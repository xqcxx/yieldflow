/**
 * Address Validation Hook
 * 
 * React hook for validating Stacks addresses with error handling
 */

import { useState, useCallback, useEffect } from 'react';
import { isValidStacksAddress, getStacksAddressType, parseStacksAddress } from '../lib/stacksAddressEncoder';

export interface AddressValidationResult {
  isValid: boolean;
  type: 'mainnet' | 'testnet' | null;
  error: string | null;
  isChecking: boolean;
}

export function useStacksAddressValidation() {
  const [result, setResult] = useState<AddressValidationResult>({
    isValid: false,
    type: null,
    error: null,
    isChecking: false,
  });

  const validate = useCallback((address: string): AddressValidationResult => {
    if (!address) {
      return {
        isValid: false,
        type: null,
        error: null,
        isChecking: false,
      };
    }

    setResult(prev => ({ ...prev, isChecking: true }));

    try {
      const isValid = isValidStacksAddress(address);
      
      if (!isValid) {
        return {
          isValid: false,
          type: null,
          error: 'Invalid Stacks address format',
          isChecking: false,
        };
      }

      const type = getStacksAddressType(address);
      
      // Parse to get additional details
      const parsed = parseStacksAddress(address);

      return {
        isValid: true,
        type,
        error: null,
        isChecking: false,
      };
    } catch (err) {
      return {
        isValid: false,
        type: null,
        error: err instanceof Error ? err.message : 'Validation failed',
        isChecking: false,
      };
    }
  }, []);

  const validateAsync = useCallback(async (address: string): Promise<AddressValidationResult> => {
    return new Promise((resolve) => {
      // Simulate async validation (for future API integration)
      setTimeout(() => {
        resolve(validate(address));
      }, 100);
    });
  }, [validate]);

  const reset = useCallback(() => {
    setResult({
      isValid: false,
      type: null,
      error: null,
      isChecking: false,
    });
  }, []);

  return {
    ...result,
    validate,
    validateAsync,
    reset,
    setResult,
  };
}

export function useLiveAddressValidation(address: string, debounceMs = 300) {
  const validation = useStacksAddressValidation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (address) {
        validation.validate(address);
      } else {
        validation.reset();
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [address, debounceMs, validation]);

  return validation;
}
