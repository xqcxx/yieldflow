/**
 * Address Book
 * 
 * Store and manage frequently used Stacks addresses
 */

import { isValidStacksAddress, getStacksAddressType } from './stacksAddressEncoder';

const STORAGE_KEY = 'yieldflow-address-book';

export interface AddressBookEntry {
  id: string;
  name: string;
  address: string;
  type: 'mainnet' | 'testnet';
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  notes?: string;
}

export interface AddressBook {
  entries: AddressBookEntry[];
  version: number;
}

export class AddressBookManager {
  private entries: Map<string, AddressBookEntry> = new Map();
  private version = 1;

  constructor() {
    this.loadFromStorage();
  }

  addEntry(
    name: string,
    address: string,
    options?: { tags?: string[]; notes?: string }
  ): AddressBookEntry {
    if (!isValidStacksAddress(address)) {
      throw new Error('Invalid Stacks address');
    }

    const existing = this.findByAddress(address);
    if (existing) {
      throw new Error('Address already exists in address book');
    }

    const type = getStacksAddressType(address)!;
    const entry: AddressBookEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      address,
      type,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: options?.tags || [],
      notes: options?.notes,
    };

    this.entries.set(entry.id, entry);
    this.saveToStorage();

    return entry;
  }

  updateEntry(
    id: string,
    updates: Partial<Omit<AddressBookEntry, 'id' | 'createdAt' | 'type'>>
  ): AddressBookEntry {
    const entry = this.entries.get(id);
    if (!entry) {
      throw new Error('Entry not found');
    }

    if (updates.address && updates.address !== entry.address) {
      if (!isValidStacksAddress(updates.address)) {
        throw new Error('Invalid Stacks address');
      }
      // Type might change if address network changes
      const newType = getStacksAddressType(updates.address)!;
      (entry as AddressBookEntry).type = newType;
    }

    Object.assign(entry, updates, { updatedAt: Date.now() });
    this.saveToStorage();

    return entry;
  }

  removeEntry(id: string): void {
    if (!this.entries.has(id)) {
      throw new Error('Entry not found');
    }

    this.entries.delete(id);
    this.saveToStorage();
  }

  getEntry(id: string): AddressBookEntry | undefined {
    return this.entries.get(id);
  }

  getAllEntries(): AddressBookEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  findByAddress(address: string): AddressBookEntry | undefined {
    return Array.from(this.entries.values()).find(
      entry => entry.address.toLowerCase() === address.toLowerCase()
    );
  }

  searchByName(query: string): AddressBookEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllEntries().filter(entry =>
      entry.name.toLowerCase().includes(lowerQuery)
    );
  }

  filterByType(type: 'mainnet' | 'testnet'): AddressBookEntry[] {
    return this.getAllEntries().filter(entry => entry.type === type);
  }

  filterByTag(tag: string): AddressBookEntry[] {
    return this.getAllEntries().filter(entry =>
      entry.tags?.includes(tag)
    );
  }

  getAllTags(): string[] {
    const tags = new Set<string>();
    this.entries.forEach(entry => {
      entry.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  private saveToStorage(): void {
    try {
      const data: AddressBook = {
        entries: this.getAllEntries(),
        version: this.version,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save address book:', e);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: AddressBook = JSON.parse(stored);
        if (data.version === this.version) {
          data.entries.forEach(entry => {
            this.entries.set(entry.id, entry);
          });
        }
      }
    } catch (e) {
      console.error('Failed to load address book:', e);
    }
  }

  exportToJSON(): string {
    const data: AddressBook = {
      entries: this.getAllEntries(),
      version: this.version,
    };
    return JSON.stringify(data, null, 2);
  }

  importFromJSON(json: string): void {
    try {
      const data: AddressBook = JSON.parse(json);
      if (data.version !== this.version) {
        throw new Error('Incompatible version');
      }

      // Validate all entries
      data.entries.forEach(entry => {
        if (!isValidStacksAddress(entry.address)) {
          throw new Error(`Invalid address in import: ${entry.address}`);
        }
      });

      // Clear existing and import
      this.entries.clear();
      data.entries.forEach(entry => {
        this.entries.set(entry.id, entry);
      });

      this.saveToStorage();
    } catch (e) {
      throw new Error(`Import failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  clear(): void {
    this.entries.clear();
    this.saveToStorage();
  }
}

export const addressBook = new AddressBookManager();
