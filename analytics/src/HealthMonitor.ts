/**
 * Health Monitor - System health checks and monitoring
 */

import { analytics } from './AnalyticsService';
import { alertManager, AlertSeverity } from './AlertManager';

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
}

export interface HealthCheck {
  name: string;
  status: HealthStatus;
  responseTime: number;
  lastChecked: number;
  message?: string;
  metadata?: Record<string, any>;
}

export interface HealthCheckConfig {
  name: string;
  check: () => Promise<boolean> | boolean;
  interval: number;
  timeout: number;
}

export class HealthMonitor {
  private checks: Map<string, HealthCheckConfig> = new Map();
  private results: Map<string, HealthCheck> = new Map();
  private intervals: Map<string, number> = new Map();

  addCheck(config: HealthCheckConfig): void {
    this.checks.set(config.name, config);
    this.runCheck(config);
    this.scheduleCheck(config);
  }

  removeCheck(name: string): void {
    const intervalId = this.intervals.get(name);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(name);
    }
    this.checks.delete(name);
    this.results.delete(name);
  }

  private scheduleCheck(config: HealthCheckConfig): void {
    const intervalId = window.setInterval(() => {
      this.runCheck(config);
    }, config.interval);
    this.intervals.set(config.name, intervalId);
  }

  private async runCheck(config: HealthCheckConfig): Promise<void> {
    const start = performance.now();
    let status = HealthStatus.HEALTHY;
    let message: string | undefined;

    try {
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), config.timeout);
      });

      const result = await Promise.race([config.check(), timeoutPromise]);
      
      if (!result) {
        status = HealthStatus.UNHEALTHY;
        message = 'Health check returned false';
      }
    } catch (error) {
      status = HealthStatus.UNHEALTHY;
      message = error instanceof Error ? error.message : 'Unknown error';
    }

    const responseTime = performance.now() - start;

    const healthCheck: HealthCheck = {
      name: config.name,
      status,
      responseTime,
      lastChecked: Date.now(),
      message,
    };

    this.results.set(config.name, healthCheck);

    analytics.trackMetric('health_check_duration', responseTime, { check: config.name });
    analytics.trackEvent('health_check', {
      name: config.name,
      status,
      responseTime,
    });

    if (status === HealthStatus.UNHEALTHY) {
      alertManager.createCustomAlert(
        `Health Check Failed: ${config.name}`,
        message || 'Service is unhealthy',
        AlertSeverity.ERROR,
        'health_monitor'
      );
    }
  }

  getHealthStatus(): HealthStatus {
    const results = Array.from(this.results.values());
    if (results.length === 0) return HealthStatus.HEALTHY;

    const hasUnhealthy = results.some(r => r.status === HealthStatus.UNHEALTHY);
    const hasDegraded = results.some(r => r.status === HealthStatus.DEGRADED);

    if (hasUnhealthy) return HealthStatus.UNHEALTHY;
    if (hasDegraded) return HealthStatus.DEGRADED;
    return HealthStatus.HEALTHY;
  }

  getCheckResult(name: string): HealthCheck | undefined {
    return this.results.get(name);
  }

  getAllResults(): HealthCheck[] {
    return Array.from(this.results.values());
  }

  dispose(): void {
    for (const intervalId of this.intervals.values()) {
      clearInterval(intervalId);
    }
    this.intervals.clear();
  }
}

export const healthMonitor = new HealthMonitor();
