# Bridge Status Polling

## Overview
Automated polling system to monitor Circle xReserve bridge transactions and detect USDCx arrival on Stacks.

## Components

### useBridgeStatusPolling Hook
Located in `src/hooks/useBridgeStatusPolling.ts`

**Features:**
- Automatic status polling every 10 seconds
- Confirmation tracking (0-12 confirmations)
- Estimated time remaining
- Error recovery with retry logic
- Auto-stop when completed/failed

**Statuses:**
- `idle`: No active bridge transaction
- `pending`: Waiting for Circle attestation
- `confirming`: Accumulating confirmations
- `completed`: USDCx arrived on Stacks
- `failed`: Bridge transaction failed

### BridgeStatusDisplay Component
Located in `src/components/BridgeStatusDisplay.tsx`

**Features:**
- Status icon and text
- Progress bar (0-12 confirmations)
- Estimated time countdown
- Color-coded status indicators

## Usage

```tsx
const { status, confirmations, estimatedTime, isPolling } = 
  useBridgeStatusPolling(depositTxHash);

<BridgeStatusDisplay
  status={status}
  confirmations={confirmations}
  estimatedTime={estimatedTime}
/>
```

## Integration with ZapFlow

During the bridge step:
1. User deposits USDC to xReserve
2. Polling starts automatically
3. Status updates every 10 seconds
4. Progress bar shows confirmations
5. Auto-enables finalize button when complete

## Polling Behavior

- **Interval**: 10 seconds
- **Retry on Error**: 15 seconds
- **Auto-stop**: On completed/failed status
- **Cleanup**: Cancels polling on unmount

## Production Integration

Replace simulated API with Circle xReserve:
```typescript
const checkBridgeStatus = async (txHash: string) => {
  const response = await fetch(
    `https://iris-api.circle.com/attestations/${txHash}`
  );
  return response.json();
};
```

## Future Enhancements
- Push notifications when complete
- Mobile app alerts
- Email notifications
- Webhook integration
- Failed transaction analysis
