# Wallet Balance Checks

## Overview
This feature implements comprehensive wallet balance validation to ensure users have sufficient USDC before initiating transactions.

## Components

### useUSDCBalance Hook
Located in `src/hooks/useUSDCBalance.ts`

**Features:**
- Real-time USDC balance fetching
- Auto-refresh every 5 seconds
- Formatted balance display
- Raw balance for calculations
- Boolean flag for balance availability

**Usage:**
```tsx
const { 
  balance,           // Raw balance in wei
  formattedBalance,  // Formatted balance (e.g., "100.50")
  isLoading,
  error,
  refetch,          // Manual refresh function
  hasBalance        // Boolean: balance > 0
} = useUSDCBalance();
```

### BalanceDisplay Component
Located in `src/components/BalanceDisplay.tsx`

**Features:**
- Clean balance visualization
- Loading skeleton state
- Error state with warning
- Formatted to 2 decimal places

## Validations

### 1. Minimum Amount
- Minimum transaction: 0.01 USDC
- Prevents dust transactions
- Shows error toast if violated

### 2. Insufficient Balance
- Checks amount against wallet balance
- Visual warning when amount exceeds balance
- Button disabled when insufficient
- Error toast on submission attempt

### 3. Real-time Checks
- Balance updates every 5 seconds
- Immediate validation as user types
- Auto-refresh after transactions

## User Experience Features

### MAX Button
- One-click auto-fill with available balance
- Located in amount input field
- Helps prevent input errors

### Visual Indicators
- **Balance Display**: Shows current USDC balance
- **Warning Banner**: Yellow warning when amount > balance
- **Button State**: Disabled with "Insufficient Balance" text
- **Error Messages**: Clear, actionable error toasts

### Auto-Refresh
- Balance refreshes automatically after:
  - Approval transactions (2s delay)
  - Deposit transactions (2s delay)
- Ensures UI stays in sync with blockchain state

## Integration
Balance checks are integrated into the ZapFlow component at the input step:
1. Display current balance
2. Validate amount as user types
3. Show warnings if needed
4. Prevent submission if insufficient
5. Refresh after successful transactions

## Technical Details
- Uses wagmi's `useReadContract` hook
- Reads from ERC20 `balanceOf` function
- USDC has 6 decimals (handled automatically)
- Balance stored as BigInt for precision
- Formatted using viem's `formatUnits`
