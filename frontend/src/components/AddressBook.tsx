/**
 * Address Book Component
 * 
 * UI for managing saved Stacks addresses
 */

import React, { useState, useEffect } from 'react';
import { addressBook, AddressBookEntry } from '../lib/addressBook';
import { formatAddressDisplay, getStacksAddressType } from '../lib/stacksAddressEncoder';

interface AddressBookProps {
  onSelect?: (entry: AddressBookEntry) => void;
  filterType?: 'mainnet' | 'testnet';
}

export const AddressBookComponent: React.FC<AddressBookProps> = ({
  onSelect,
  filterType,
}) => {
  const [entries, setEntries] = useState<AddressBookEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AddressBookEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, [filterType]);

  const loadEntries = () => {
    let filtered = addressBook.getAllEntries();
    
    if (filterType) {
      filtered = filtered.filter(e => e.type === filterType);
    }
    
    if (searchQuery) {
      filtered = addressBook.searchByName(searchQuery);
    }
    
    if (selectedTag) {
      filtered = filtered.filter(e => e.tags?.includes(selectedTag));
    }
    
    setEntries(filtered);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      addressBook.removeEntry(id);
      loadEntries();
    }
  };

  const allTags = addressBook.getAllTags();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Address Book</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Address
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={loadEntries}
          className="flex-1 px-3 py-2 border rounded"
        />
        <select
          value={selectedTag}
          onChange={(e) => {
            setSelectedTag(e.target.value);
            loadEntries();
          }}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No addresses saved</p>
        ) : (
          entries.map(entry => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{entry.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    entry.type === 'mainnet'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {entry.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600 font-mono mt-1">
                  {formatAddressDisplay(entry.address, 8)}
                </div>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                {onSelect && (
                  <button
                    onClick={() => onSelect(entry)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Select
                  </button>
                )}
                <button
                  onClick={() => setEditingEntry(entry)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddEditModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            loadEntries();
          }}
        />
      )}

      {editingEntry && (
        <AddEditModal
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
          onSave={() => {
            setEditingEntry(null);
            loadEntries();
          }}
        />
      )}
    </div>
  );
};

interface AddEditModalProps {
  entry?: AddressBookEntry;
  onClose: () => void;
  onSave: () => void;
}

const AddEditModal: React.FC<AddEditModalProps> = ({ entry, onClose, onSave }) => {
  const [name, setName] = useState(entry?.name || '');
  const [address, setAddress] = useState(entry?.address || '');
  const [tags, setTags] = useState(entry?.tags?.join(', ') || '');
  const [notes, setNotes] = useState(entry?.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

      if (entry) {
        addressBook.updateEntry(entry.id, {
          name,
          address,
          tags: tagArray,
          notes: notes || undefined,
        });
      } else {
        addressBook.addEntry(name, address, {
          tags: tagArray,
          notes: notes || undefined,
        });
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {entry ? 'Edit Address' : 'Add New Address'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
              className="w-full px-3 py-2 border rounded font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="personal, exchange, vault"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {entry ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
