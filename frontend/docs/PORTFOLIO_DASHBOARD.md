# Portfolio Dashboard with Historical Yield Tracking

## Overview
Comprehensive portfolio dashboard displaying user positions, total value, yield earned, and historical performance visualization.

## Components

### usePortfolio Hook
Located in `src/hooks/usePortfolio.ts`

**Features:**
- Fetches user portfolio data by address
- Tracks multiple positions across strategies
- Calculates total value and yield
- Generates 30-day historical data
- Auto-refresh every 30 seconds

**Returns:**
```typescript
{
  data: {
    totalValue: number;
    totalYieldEarned: number;
    positions: Position[];
    historicalYield: YieldDataPoint[];
  };
  isLoading: boolean;
  error: string | null;
}
```

### YieldChart Component
Located in `src/components/YieldChart.tsx`

**Features:**
- SVG-based line chart
- Gradient fill for visual appeal
- Shows 30-day historical performance
- Displays min/max values
- Responsive design

### PortfolioDashboard Component
Located in `src/components/PortfolioDashboard.tsx`

**Features:**
- Summary cards (Total Value, Yield, Positions)
- Historical yield chart visualization
- Positions table with details:
  - Strategy name
  - Amount deposited
  - Current value
  - Yield earned
  - Current APY
- Loading states
- Error handling
- Wallet connection check

## Dashboard Sections

### 1. Summary Cards
- **Total Value**: Sum of all position values
- **Total Yield Earned**: Cumulative yield across all positions
- **Active Positions**: Number of active strategies

### 2. Historical Chart
- 30-day performance visualization
- Green gradient fill
- Min/max value indicators
- Time axis labels

### 3. Positions Table
- Detailed breakdown per strategy
- Real-time value updates
- Yield calculation
- Current APY display

## Data Flow

1. User connects wallet
2. Hook fetches portfolio data by address
3. Dashboard renders summary + chart + table
4. Auto-refreshes every 30 seconds
5. Updates on new deposits/withdrawals

## Production Integration

Replace simulated data with blockchain queries:
```typescript
// Query Stacks blockchain for user positions
const positions = await fetchStacksPositions(address);

// Calculate current values from smart contracts
const values = await getContractBalances(positions);

// Fetch historical data from indexer
const historical = await getHistoricalYield(address, 30);
```

## Metrics Tracked

- **Total Value**: Current portfolio value in USD
- **Yield Earned**: Total interest/rewards accumulated
- **APY**: Current annual percentage yield
- **Historical Performance**: Daily value snapshots

## Future Enhancements
- Export to CSV/PDF
- Multiple timeframes (7d, 30d, 90d, 1y)
- Profit/loss breakdown
- Tax reporting integration
- Portfolio rebalancing suggestions
- Risk metrics and scores
