# Dynamic APY Calculation

## Overview
Implements real-time APY calculation and display for yield strategies, simulating integration with actual DeFi protocol rates.

## Components

### useDynamicAPY Hook
Located in `src/hooks/useDynamicAPY.ts`

**Features:**
- Real-time APY fetching from protocols
- Auto-refresh every 30 seconds
- Time-based variance simulation
- Error handling with fallback
- Last update timestamp tracking

**Returns:**
- `apy`: Current APY rate
- `isLoading`: Loading state
- `error`: Error message if fetch fails
- `lastUpdated`: Timestamp of last successful fetch

### APYDisplay Component
Located in `src/components/APYDisplay.tsx`

**Features:**
- Color-coded display based on APY tier:
  - 🟢 Green (≥15%): Excellent rates
  - 🟢 Emerald (≥10%): Good rates
  - 🟡 Yellow (≥5%): Moderate rates
  - 🟠 Orange (<5%): Low rates
- Loading skeleton animation
- Error state with placeholder
- Update timestamp (shows for 2 minutes)

## Integration

### In StrategyCard
Each strategy card now fetches and displays dynamic APY:
```tsx
const { apy, isLoading, error, lastUpdated } = useDynamicAPY(strategyId);
```

### Update Frequency
- APY refreshes every 30 seconds
- Timestamp shown for 2 minutes after update
- Automatic retry on errors

## Simulated Data
Current implementation uses simulated data with realistic variance:
- Base APY from strategy configuration
- Time-based variance (hourly sine wave)
- Random market variance (±1.5%)

## Production Integration
To connect to real protocols:
1. Replace `fetchProtocolAPY` function
2. Add API endpoints for:
   - Zest Protocol lending rates
   - Bitflow DEX pool APYs
   - Other Stacks DeFi protocols
3. Implement error recovery
4. Add rate limiting

## Future Enhancements
- Historical APY tracking
- APY trend indicators (↑↓)
- Protocol health scores
- Risk-adjusted returns
- Comparative APY analysis
