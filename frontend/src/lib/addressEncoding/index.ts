/**
 * Stacks Address Encoding Module
 * 
 * Export all address encoding functionality
 */

// Core encoding functions
export {
  parseStacksAddress,
  encodeStacksAddressForXReserve,
  decodeStacksAddressFromXReserve,
  isValidStacksAddress,
  getStacksAddressType,
  type StacksAddress,
} from '../stacksAddressEncoder';

// Batch utilities
export {
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
  type BatchEncodingResult,
  type BatchDecodingResult,
  type BatchValidationResult,
  type AddressDetails,
} from '../addressEncodingUtils';

// Address book
export {
  AddressBookManager,
  addressBook,
  type AddressBookEntry,
  type AddressBook,
} from '../addressBook';

// Performance optimizations
export {
  encodeStacksAddressCached,
  isValidStacksAddressCached,
  batchEncodeWithCache,
  prewarmCache,
  getCacheStats,
  clearAddressCache,
  createDebouncedValidator,
  createMemoizedFormatter,
} from './performance';

// Constants
export {
  C32_ALPHABET,
  C32_VALUES,
  ADDRESS_PREFIXES,
  ADDRESS_LENGTHS,
  XRESERVE_FORMAT,
  ADDRESS_VERSIONS,
  TEST_ADDRESSES,
  ERROR_MESSAGES,
  VALIDATION_PATTERNS,
  ADDRESS_BOOK_CONSTANTS,
} from './constants';
