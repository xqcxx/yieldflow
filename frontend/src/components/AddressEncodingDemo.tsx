/**
 * Address Encoding Demo Page
 * 
 * Interactive demo showcasing address encoding features
 */

import React, { useState } from 'react';
import { StacksAddressInput } from './StacksAddressInput';
import { AddressBookComponent } from './AddressBook';
import { 
  encodeStacksAddressForXReserve, 
  decodeStacksAddressFromXReserve,
  isValidStacksAddress,
  getStacksAddressType,
  parseStacksAddress,
} from '../lib/stacksAddressEncoder';
import { formatAddressDisplay } from '../lib/addressEncodingUtils';

export const AddressEncodingDemo: React.FC = () => {
  const [address, setAddress] = useState('');
  const [encoded, setEncoded] = useState<`0x${string}` | null>(null);
  const [activeTab, setActiveTab] = useState<'encoder' | 'addressBook'>('encoder');

  const handleEncode = () => {
    if (isValidStacksAddress(address)) {
      const result = encodeStacksAddressForXReserve(address);
      setEncoded(result);
    }
  };

  const handleAddressChange = (value: string, isValid: boolean) => {
    setAddress(value);
    if (isValid) {
      const result = encodeStacksAddressForXReserve(value);
      setEncoded(result);
    } else {
      setEncoded(null);
    }
  };

  const parsed = address && isValidStacksAddress(address) 
    ? parseStacksAddress(address)
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Stacks Address Encoding Demo</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('encoder')}
          className={`px-4 py-2 rounded ${
            activeTab === 'encoder'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Address Encoder
        </button>
        <button
          onClick={() => setActiveTab('addressBook')}
          className={`px-4 py-2 rounded ${
            activeTab === 'addressBook'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Address Book
        </button>
      </div>

      {activeTab === 'encoder' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Encode Stacks Address</h2>
            
            <StacksAddressInput
              value={address}
              onChange={handleAddressChange}
              label="Stacks Address"
              placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
            />
          </div>

          {parsed && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Parsed Address Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Network Type</label>
                  <p className="font-medium capitalize">{parsed.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Version</label>
                  <p className="font-medium">{parsed.version} (0x{parsed.version.toString(16)})</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Hash160 (Hex)</label>
                  <p className="font-mono text-sm break-all">
                    {Array.from(parsed.hash160).map(b => b.toString(16).padStart(2, '0')).join('')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {encoded && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">xReserve Encoded (bytes32)</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Encoded Address</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 bg-gray-100 p-3 rounded font-mono text-sm break-all">
                      {encoded}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(encoded)}
                      className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded">
                    <label className="text-blue-600 font-medium">Version (1 byte)</label>
                    <p className="font-mono">{encoded.slice(0, 4)}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <label className="text-green-600 font-medium">Hash160 (20 bytes)</label>
                    <p className="font-mono text-xs break-all">{encoded.slice(4, 44)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <label className="text-gray-600 font-medium">Padding (11 bytes)</label>
                    <p className="font-mono text-xs">{encoded.slice(44, 66)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">How it works</h3>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>Stacks addresses use c32 encoding (Crockford Base32)</li>
              <li>The address is decoded to extract the version byte and hash160</li>
              <li>For xReserve, we encode as: [version:1][hash160:20][padding:11] = 32 bytes</li>
              <li>This ensures the bridge can correctly route funds to the Stacks address</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'addressBook' && (
        <AddressBookComponent />
      )}
    </div>
  );
};
