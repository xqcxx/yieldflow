# Toast Notification System

## Overview
This application uses `react-hot-toast` to provide user feedback for transactions and important events throughout the zap flow.

## Usage

### Import the hook
```tsx
import { useToast } from '../contexts/ToastContext';
```

### Available Methods

#### showSuccess
Display a success notification.
```tsx
toast.showSuccess('Operation completed successfully!');
```

#### showError
Display an error notification with extended duration.
```tsx
toast.showError('Transaction failed. Please try again.');
```

#### showLoading
Display a loading notification and return its ID for dismissal.
```tsx
const loadingToast = toast.showLoading('Processing transaction...');
// Later dismiss it
toast.dismissToast(loadingToast);
```

#### showTransactionSuccess
Display a success notification with a clickable link to view the transaction.
```tsx
toast.showTransactionSuccess(txHash, 'https://explorer.hiro.so/txid/');
```

#### showTransactionPending
Display a pending notification for transactions awaiting confirmation.
```tsx
toast.showTransactionPending('Waiting for confirmation...');
```

## Styling
All toasts are styled to match the dark theme of the application with appropriate colors:
- Success: Green (#059669)
- Error: Red (#dc2626)
- Loading: Blue (#2563eb)
- Pending: Orange (#f59e0b)

## Integration
The ToastProvider wraps the entire App component in `App.tsx` to make toast notifications available throughout the application.
