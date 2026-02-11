# Monitoring & Analytics Integration Guide

## Quick Start

### 1. Initialize Monitoring

```typescript
import { 
  metrics, 
  errorTracker, 
  healthMonitor, 
  networkMonitor,
  userAnalytics,
} from './analytics';

// Initialize all monitoring services
metrics.initialize();
errorTracker.initialize();
networkMonitor.initialize();
userAnalytics.startSession();
```

### 2. Use in React Components

```typescript
import { useAnalytics, useAlerts, useHealth } from './analytics';

function MyComponent() {
  const { events } = useAnalytics();
  const { alerts } = useAlerts();
  const { status } = useHealth();

  // Component logic
}
```

### 3. Track Custom Events

```typescript
import { analytics, userAnalytics } from './analytics';

// Track custom events
analytics.trackEvent('button_click', { buttonId: 'deposit' });

// Track user actions
userAnalytics.trackPageView('/dashboard');
userAnalytics.trackDeposit('mock-vault', 1000);
```

### 4. Add Dashboard

```typescript
import { MonitoringDashboard, AlertNotification } from './analytics';

function App() {
  return (
    <>
      <AlertNotification position="top-right" />
      <MonitoringDashboard />
    </>
  );
}
```

### 5. Configure Health Checks

```typescript
import { healthMonitor } from './analytics';

healthMonitor.addCheck({
  name: 'api-health',
  check: async () => {
    const response = await fetch('/api/health');
    return response.ok;
  },
  interval: 30000, // 30 seconds
  timeout: 5000,
});
```

### 6. Set Up Alerts

```typescript
import { alertManager, AlertSeverity } from './analytics';

alertManager.addRule({
  id: 'high-error-rate',
  name: 'High Error Rate',
  condition: (metrics) => metrics.errors > 10,
  severity: AlertSeverity.ERROR,
  cooldown: 300000, // 5 minutes
});
```

## Best Practices

1. **Initialize early** - Set up monitoring at app startup
2. **Use meaningful names** - Name events and metrics clearly
3. **Don't over-track** - Focus on key user actions and errors
4. **Handle cleanup** - Dispose monitors on app shutdown
5. **Review dashboards** - Check metrics regularly

## Available Components

- `MonitoringDashboard` - Full monitoring dashboard
- `PerformanceDashboard` - Performance metrics view
- `AlertNotification` - Floating alert notifications
- `MetricsChart` - Real-time metrics visualization

## Available Hooks

- `useAnalytics()` - Access analytics events and metrics
- `useAlerts()` - Access and manage alerts
- `useHealth()` - Access health check status
- `useErrors()` - Access tracked errors
- `usePerformance()` - Measure function performance
- `useSession()` - Track user sessions
