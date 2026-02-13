export function calculateTotalApy(allocations: Record<string, number>, strategies: {id: string, apy: number}[]): number {
  let total = 0;
  Object.entries(allocations).forEach(([id, pct]) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) total += (pct / 100) * strategy.apy;
  });
  return total;
}
