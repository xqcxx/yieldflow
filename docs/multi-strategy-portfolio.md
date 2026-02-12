## Multi-Strategy Portfolio Feature

### Overview
The multi-strategy portfolio feature allows users to allocate their funds across multiple yield strategies, enabling better diversification and risk management.

### Features
- **Multiple Strategies:** Support for multiple DeFi strategies
- **Allocation Control:** Set custom percentage allocations
- **Automatic Rebalancing:** Rebalance portfolio to target allocations
- **Diversification Tracking:** Monitor diversification score
- **Yield Optimization:** Optimize for highest yield strategies

### Supported Strategies
1. **YieldFlow Mock Vault** (Low Risk, 12% APY)
2. **Zest Protocol** (Medium Risk, 15% APY)
3. **Bitflow** (High Risk, 18% APY)

### Usage

1. **View Available Strategies**
   Navigate to the Portfolio page to see all available strategies.

2. **Set Allocations**
   Use the Allocation Editor to set your desired percentages for each strategy.

3. **Rebalance Portfolio**
   Click "Rebalance" to adjust your current holdings to match your target allocation.

4. **Monitor Performance**
   Track your portfolio performance across all strategies.

### API Reference

#### Hooks
- `usePortfolio()` - Fetch portfolio data
- `useMultiStrategyPortfolio()` - Enhanced portfolio with multi-strategy support

#### Components
- `<AllocationEditor />` - Set strategy allocations
- `<PortfolioChart />` - Visualize allocation
- `<PortfolioSummary />` - View portfolio metrics

#### Utilities
- `calculateRebalance()` - Calculate rebalancing plan
- `validateAllocation()` - Validate allocation totals
- `normalizeAllocations()` - Normalize allocation percentages
