export interface ZapOutHistoryItem {
  id: string;
  timestamp: number;
  amount: number;
  recipient: string;
  stxTxId: string;
  ethTxHash?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const STORAGE_KEY = 'zapout_history';

export function getZapOutHistory(): ZapOutHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addZapOutToHistory(item: ZapOutHistoryItem): void {
  const history = getZapOutHistory();
  const newHistory = [item, ...history].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export function updateZapOutHistory(
  id: string,
  updates: Partial<ZapOutHistoryItem>
): void {
  const history = getZapOutHistory();
  const updated = history.map(item =>
    item.id === id ? { ...item, ...updates } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearZapOutHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
