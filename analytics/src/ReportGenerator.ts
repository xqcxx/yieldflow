/**
 * Report Generator - Generate analytics and monitoring reports
 */

import { analytics, AnalyticsEvent, MetricData } from './AnalyticsService';
import { TrackedError } from './ErrorTracker';
import { Alert } from './AlertManager';
import { HealthCheck } from './HealthMonitor';

export interface DailyReport {
  date: string;
  events: {
    total: number;
    byName: Record<string, number>;
  };
  metrics: {
    total: number;
    averages: Record<string, number>;
  };
  errors: {
    total: number;
    unique: number;
    byComponent: Record<string, number>;
  };
  alerts: {
    total: number;
    bySeverity: Record<string, number>;
  };
  health: {
    checks: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

export class ReportGenerator {
  generateDailyReport(
    events: AnalyticsEvent[],
    metrics: MetricData[],
    errors: TrackedError[],
    alerts: Alert[],
    healthChecks: HealthCheck[]
  ): DailyReport {
    const date = new Date().toISOString().split('T')[0];

    return {
      date,
      events: this.aggregateEvents(events),
      metrics: this.aggregateMetrics(metrics),
      errors: this.aggregateErrors(errors),
      alerts: this.aggregateAlerts(alerts),
      health: this.aggregateHealth(healthChecks),
    };
  }

  private aggregateEvents(events: AnalyticsEvent[]): DailyReport['events'] {
    const byName: Record<string, number> = {};
    
    for (const event of events) {
      byName[event.name] = (byName[event.name] || 0) + 1;
    }

    return {
      total: events.length,
      byName,
    };
  }

  private aggregateMetrics(metrics: MetricData[]): DailyReport['metrics'] {
    const byName: Record<string, number[]> = {};
    
    for (const metric of metrics) {
      if (!byName[metric.name]) {
        byName[metric.name] = [];
      }
      byName[metric.name].push(metric.value);
    }

    const averages: Record<string, number> = {};
    for (const [name, values] of Object.entries(byName)) {
      averages[name] = values.reduce((a, b) => a + b, 0) / values.length;
    }

    return {
      total: metrics.length,
      averages,
    };
  }

  private aggregateErrors(errors: TrackedError[]): DailyReport['errors'] {
    const byComponent: Record<string, number> = {};
    let totalCount = 0;
    
    for (const error of errors) {
      totalCount += error.count;
      const component = error.context.component || 'unknown';
      byComponent[component] = (byComponent[component] || 0) + error.count;
    }

    return {
      total: totalCount,
      unique: errors.length,
      byComponent,
    };
  }

  private aggregateAlerts(alerts: Alert[]): DailyReport['alerts'] {
    const bySeverity: Record<string, number> = {};
    
    for (const alert of alerts) {
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
    }

    return {
      total: alerts.length,
      bySeverity,
    };
  }

  private aggregateHealth(checks: HealthCheck[]): DailyReport['health'] {
    let healthy = 0;
    let degraded = 0;
    let unhealthy = 0;

    for (const check of checks) {
      switch (check.status) {
        case 'healthy':
          healthy++;
          break;
        case 'degraded':
          degraded++;
          break;
        case 'unhealthy':
          unhealthy++;
          break;
      }
    }

    return {
      checks: checks.length,
      healthy,
      degraded,
      unhealthy,
    };
  }

  exportReport(report: DailyReport, format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      return this.toCSV(report);
    }
    return JSON.stringify(report, null, 2);
  }

  private toCSV(report: DailyReport): string {
    const lines = [
      `Date,${report.date}`,
      '',
      'Events Summary',
      `Total Events,${report.events.total}`,
      '',
      'Metrics Summary',
      `Total Metrics,${report.metrics.total}`,
      '',
      'Errors Summary',
      `Total Errors,${report.errors.total}`,
      `Unique Errors,${report.errors.unique}`,
      '',
      'Health Summary',
      `Total Checks,${report.health.checks}`,
      `Healthy,${report.health.healthy}`,
      `Degraded,${report.health.degraded}`,
      `Unhealthy,${report.health.unhealthy}`,
    ];

    return lines.join('\n');
  }
}

export const reportGenerator = new ReportGenerator();
