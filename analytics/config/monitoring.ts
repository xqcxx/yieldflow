/**
 * Monitoring Configuration
 */

import { AlertSeverity } from '../src/AlertManager';
import { HealthStatus } from '../src/HealthMonitor';

export interface MonitoringConfig {
  enabled: boolean;
  sampleRate: number;
  bufferSize: number;
  flushInterval: number;
  endpoints?: {
    analytics?: string;
    errors?: string;
    metrics?: string;
  };
  alerts?: {
    enabled: boolean;
    rules: Array<{
      name: string;
      condition: string;
      severity: AlertSeverity;
      cooldown: number;
    }>;
  };
  healthChecks?: {
    enabled: boolean;
    checks: Array<{
      name: string;
      interval: number;
      timeout: number;
    }>;
  };
}

export const defaultConfig: MonitoringConfig = {
  enabled: true,
  sampleRate: 1.0,
  bufferSize: 1000,
  flushInterval: 30000,
  endpoints: {
    analytics: '/api/analytics',
    errors: '/api/errors',
    metrics: '/api/metrics',
  },
  alerts: {
    enabled: true,
    rules: [
      {
        name: 'High Error Rate',
        condition: 'errors > 10',
        severity: AlertSeverity.ERROR,
        cooldown: 300000,
      },
      {
        name: 'Slow Response Time',
        condition: 'responseTime > 5000',
        severity: AlertSeverity.WARNING,
        cooldown: 60000,
      },
    ],
  },
  healthChecks: {
    enabled: true,
    checks: [
      {
        name: 'API Health',
        interval: 30000,
        timeout: 5000,
      },
      {
        name: 'Database Health',
        interval: 60000,
        timeout: 10000,
      },
    ],
  },
};

export function loadConfig(): MonitoringConfig {
  try {
    const stored = localStorage.getItem('monitoring-config');
    if (stored) {
      return { ...defaultConfig, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load monitoring config:', e);
  }
  return defaultConfig;
}

export function saveConfig(config: MonitoringConfig): void {
  try {
    localStorage.setItem('monitoring-config', JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save monitoring config:', e);
  }
}
