import { createContext, useContext, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showLoading: (message: string) => string;
  dismissToast: (toastId: string) => void;
  showTransactionSuccess: (txHash: string, explorerUrl: string) => void;
  showTransactionPending: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#059669',
        color: '#fff',
        border: '1px solid #10b981',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#dc2626',
        color: '#fff',
        border: '1px solid #ef4444',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    });
  };

  const showLoading = (message: string): string => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#2563eb',
        color: '#fff',
        border: '1px solid #3b82f6',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
  };

  const showTransactionSuccess = (txHash: string, explorerUrl: string) => {
    toast.success(
      (t) => (
        <div>
          <p className="font-medium mb-1">Transaction Confirmed!</p>
          <a
            href={`${explorerUrl}${txHash}?chain=testnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline hover:opacity-80"
          >
            View on Explorer
          </a>
        </div>
      ),
      {
        duration: 6000,
        position: 'top-right',
        style: {
          background: '#059669',
          color: '#fff',
          border: '1px solid #10b981',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
      }
    );
  };

  const showTransactionPending = (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '⏳',
      style: {
        background: '#f59e0b',
        color: '#fff',
        border: '1px solid #fbbf24',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  return (
    <ToastContext.Provider
      value={{
        showSuccess,
        showError,
        showLoading,
        dismissToast,
        showTransactionSuccess,
        showTransactionPending,
      }}
    >
      <Toaster />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
