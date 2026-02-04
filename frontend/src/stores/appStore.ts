import { create } from 'zustand';

interface StacksWallet {
  address: string;
  network: 'mainnet' | 'testnet';
}

interface ZapState {
  ethTxHash?: string;
  stacksAddress?: string;
  amount?: string;
  status: 'idle' | 'depositing' | 'bridging' | 'ready' | 'finalizing' | 'complete' | 'error';
  error?: string;
}

interface AppState {
  stacksWallet: StacksWallet | null;
  zapState: ZapState;
  setStacksWallet: (wallet: StacksWallet | null) => void;
  setZapState: (state: Partial<ZapState>) => void;
  resetZap: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  stacksWallet: null,
  zapState: {
    status: 'idle',
  },
  setStacksWallet: (wallet) => set({ stacksWallet: wallet }),
  setZapState: (state) =>
    set((prev) => ({
      zapState: { ...prev.zapState, ...state },
    })),
  resetZap: () =>
    set({
      zapState: {
        status: 'idle',
      },
    }),
}));
