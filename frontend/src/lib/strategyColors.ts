export function getStrategyRiskColor(risk: 'low' | 'medium' | 'high'): string {
  switch (risk) {
    case 'low': return 'green';
    case 'medium': return 'yellow';
    case 'high': return 'red';
  }
}
