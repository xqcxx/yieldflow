import { createContext, useContext, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showLoading: (message: string) => string;
  dismissToast: (toastId: string) => void;
  showTransactionSuccess: (txHash: string, explorerUrl: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    });
  };

  const showLoading = (message: string): string => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
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
            href={`${explorerUrl}${txHash}`}
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
          background: '#10b981',
          color: '#fff',
        },
      }
    );
  };

  return (
    <ToastContext.Provider
      value={{
        showSuccess,
        showError,
        showLoading,
        dismissToast,
        showTransactionSuccess,
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
