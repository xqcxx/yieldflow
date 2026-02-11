/**
 * Address Book React Hook
 * 
 * React hook for managing address book state
 */

import { useState, useEffect, useCallback } from 'react';
import { addressBook, AddressBookEntry } from '../lib/addressBook';

export interface UseAddressBookOptions {
  filterType?: 'mainnet' | 'testnet';
  searchQuery?: string;
  tagFilter?: string;
}

export function useAddressBook(options: UseAddressBookOptions = {}) {
  const [entries, setEntries] = useState<AddressBookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      let filtered = addressBook.getAllEntries();

      if (options.filterType) {
        filtered = filtered.filter(e => e.type === options.filterType);
      }

      if (options.searchQuery) {
        filtered = addressBook.searchByName(options.searchQuery);
      }

      if (options.tagFilter) {
        filtered = filtered.filter(e => e.tags?.includes(options.tagFilter!));
      }

      setEntries(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setIsLoading(false);
    }
  }, [options.filterType, options.searchQuery, options.tagFilter]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const addEntry = useCallback(async (
    name: string,
    address: string,
    options?: { tags?: string[]; notes?: string }
  ): Promise<AddressBookEntry> => {
    setIsLoading(true);
    setError(null);

    try {
      const entry = addressBook.addEntry(name, address, options);
      loadEntries();
      return entry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add entry');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadEntries]);

  const updateEntry = useCallback(async (
    id: string,
    updates: Partial<Omit<AddressBookEntry, 'id' | 'createdAt' | 'type'>>
  ): Promise<AddressBookEntry> => {
    setIsLoading(true);
    setError(null);

    try {
      const entry = addressBook.updateEntry(id, updates);
      loadEntries();
      return entry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update entry');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadEntries]);

  const removeEntry = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      addressBook.removeEntry(id);
      loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove entry');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadEntries]);

  const findByAddress = useCallback((address: string): AddressBookEntry | undefined => {
    return addressBook.findByAddress(address);
  }, []);

  const searchByName = useCallback((query: string): AddressBookEntry[] => {
    return addressBook.searchByName(query);
  }, []);

  const getAllTags = useCallback((): string[] => {
    return addressBook.getAllTags();
  }, []);

  const importFromJSON = useCallback(async (json: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      addressBook.importFromJSON(json);
      loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadEntries]);

  const exportToJSON = useCallback((): string => {
    return addressBook.exportToJSON();
  }, []);

  return {
    entries,
    isLoading,
    error,
    loadEntries,
    addEntry,
    updateEntry,
    removeEntry,
    findByAddress,
    searchByName,
    getAllTags,
    importFromJSON,
    exportToJSON,
  };
}
