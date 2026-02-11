/**
 * Stacks Address Input Component
 * 
 * Validated input field for Stacks addresses with visual feedback
 */

import React, { useState } from 'react';
import { useLiveAddressValidation } from '../hooks/useAddressValidation';

interface StacksAddressInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  debounceMs?: number;
  className?: string;
}

export const StacksAddressInput: React.FC<StacksAddressInputProps> = ({
  value,
  onChange,
  placeholder = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  label = 'Stacks Address',
  required = false,
  disabled = false,
  debounceMs = 300,
  className = '',
}) => {
  const { isValid, type, error, isChecking } = useLiveAddressValidation(value, debounceMs);
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, isValid && newValue.length > 0);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const getInputStyles = () => {
    if (!touched && !value) {
      return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }
    if (isChecking) {
      return 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500';
    }
    if (isValid) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    }
    return 'border-red-500 focus:border-red-500 focus:ring-red-500';
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return (
        <svg className="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    if (isValid) {
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 20 20" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (error && touched) {
      return (
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 20 20" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    return null;
  };

  const getNetworkBadge = () => {
    if (!isValid || !type) return null;
    
    const colors = type === 'mainnet' 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-orange-100 text-orange-800 border-orange-200';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}>
        {type === 'mainnet' ? 'Mainnet' : 'Testnet'}
      </span>
    );
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            block w-full pr-10 sm:text-sm rounded-md shadow-sm
            transition-colors duration-200
            ${getInputStyles()}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {getStatusIcon()}
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between">
        <div className="flex-1">
          {error && touched && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {isValid && !error && (
            <p className="text-sm text-green-600">Valid Stacks address</p>
          )}
        </div>
        
        <div className="ml-2">
          {getNetworkBadge()}
        </div>
      </div>

      <p className="mt-1 text-xs text-gray-500">
        Enter a valid Stacks address (starts with SP for mainnet or ST for testnet)
      </p>
    </div>
  );
};
