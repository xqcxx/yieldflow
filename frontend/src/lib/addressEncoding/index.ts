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
} from './stacksAddressEncoder';

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
} from './addressEncodingUtils';

// Address book
export {
  AddressBookManager,
  addressBook,
  type AddressBookEntry,
  type AddressBook,
} from './addressBook';
