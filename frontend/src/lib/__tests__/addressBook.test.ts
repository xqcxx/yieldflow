/**
 * Address Book Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AddressBookManager, addressBook } from '../addressBook';

describe('AddressBookManager', () => {
  let manager: AddressBookManager;

  beforeEach(() => {
    manager = new AddressBookManager();
    manager.clear();
  });

  describe('addEntry', () => {
    it('should add a valid testnet address', () => {
      const entry = manager.addEntry('My Testnet', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      
      expect(entry.name).toBe('My Testnet');
      expect(entry.type).toBe('testnet');
      expect(entry.id).toBeTruthy();
    });

    it('should add a valid mainnet address', () => {
      const entry = manager.addEntry('My Mainnet', 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      
      expect(entry.type).toBe('mainnet');
    });

    it('should throw for invalid address', () => {
      expect(() => manager.addEntry('Invalid', 'not-an-address'))
        .toThrow('Invalid Stacks address');
    });

    it('should throw for duplicate address', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      manager.addEntry('First', address);
      
      expect(() => manager.addEntry('Second', address))
        .toThrow('already exists');
    });

    it('should store tags and notes', () => {
      const entry = manager.addEntry('Tagged', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', {
        tags: ['personal', 'test'],
        notes: 'My test address',
      });
      
      expect(entry.tags).toEqual(['personal', 'test']);
      expect(entry.notes).toBe('My test address');
    });
  });

  describe('updateEntry', () => {
    it('should update entry name', () => {
      const entry = manager.addEntry('Old Name', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      const updated = manager.updateEntry(entry.id, { name: 'New Name' });
      
      expect(updated.name).toBe('New Name');
    });

    it('should throw for non-existent entry', () => {
      expect(() => manager.updateEntry('non-existent', { name: 'Test' }))
        .toThrow('Entry not found');
    });

    it('should update address and detect type change', () => {
      const entry = manager.addEntry('Test', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      expect(entry.type).toBe('testnet');
      
      const updated = manager.updateEntry(entry.id, {
        address: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      
      expect(updated.type).toBe('mainnet');
    });
  });

  describe('removeEntry', () => {
    it('should remove entry', () => {
      const entry = manager.addEntry('To Remove', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      manager.removeEntry(entry.id);
      
      expect(manager.getEntry(entry.id)).toBeUndefined();
    });

    it('should throw for non-existent entry', () => {
      expect(() => manager.removeEntry('non-existent'))
        .toThrow('Entry not found');
    });
  });

  describe('findByAddress', () => {
    it('should find entry by address', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const entry = manager.addEntry('Find Me', address);
      
      const found = manager.findByAddress(address);
      expect(found?.id).toBe(entry.id);
    });

    it('should be case-insensitive', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      manager.addEntry('Find Me', address);
      
      const found = manager.findByAddress(address.toLowerCase());
      expect(found).toBeTruthy();
    });
  });

  describe('searchByName', () => {
    it('should search by name', () => {
      manager.addEntry('Alice Wallet', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      manager.addEntry('Bob Wallet', 'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      
      const results = manager.searchByName('alice');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Alice Wallet');
    });

    it('should be case-insensitive', () => {
      manager.addEntry('Alice Wallet', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      
      const results = manager.searchByName('ALICE');
      expect(results).toHaveLength(1);
    });
  });

  describe('filterByType', () => {
    it('should filter by testnet', () => {
      manager.addEntry('Testnet 1', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      manager.addEntry('Mainnet 1', 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      manager.addEntry('Testnet 2', 'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      
      const testnet = manager.filterByType('testnet');
      expect(testnet).toHaveLength(2);
    });
  });

  describe('filterByTag', () => {
    it('should filter by tag', () => {
      manager.addEntry('Personal', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', {
        tags: ['personal'],
      });
      manager.addEntry('Exchange', 'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', {
        tags: ['exchange'],
      });
      
      const personal = manager.filterByTag('personal');
      expect(personal).toHaveLength(1);
      expect(personal[0].name).toBe('Personal');
    });
  });

  describe('getAllTags', () => {
    it('should return unique tags', () => {
      manager.addEntry('Entry 1', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', {
        tags: ['personal', 'test'],
      });
      manager.addEntry('Entry 2', 'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', {
        tags: ['personal', 'exchange'],
      });
      
      const tags = manager.getAllTags();
      expect(tags).toContain('personal');
      expect(tags).toContain('test');
      expect(tags).toContain('exchange');
      expect(tags).toHaveLength(3);
    });
  });

  describe('export/import', () => {
    it('should export to JSON', () => {
      manager.addEntry('Export Me', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      const json = manager.exportToJSON();
      
      expect(json).toContain('Export Me');
      expect(JSON.parse(json).version).toBe(1);
    });

    it('should import from JSON', () => {
      const data = {
        version: 1,
        entries: [{
          id: 'test-id',
          name: 'Imported',
          address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          type: 'testnet',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }],
      };
      
      manager.importFromJSON(JSON.stringify(data));
      const entries = manager.getAllEntries();
      
      expect(entries).toHaveLength(1);
      expect(entries[0].name).toBe('Imported');
    });

    it('should throw for invalid import', () => {
      expect(() => manager.importFromJSON('invalid'))
        .toThrow('Import failed');
    });
  });
});
