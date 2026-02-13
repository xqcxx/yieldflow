export function validateAllocation(allocations: Record<string, number>): boolean {
  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  return Math.abs(total - 100) < 0.01;
}
