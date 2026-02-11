/**
 * Metrics Collector - Performance and operational metrics
 */

import { analytics } from './AnalyticsService';

export interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
}

export class MetricsCollector {
  private static instance: MetricsCollector;
  private performanceObserver?: PerformanceObserver;

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  initialize(): void {
    this.setupPerformanceObserver();
    this.collectNavigationTiming();
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      this.performanceObserver.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    analytics.trackMetric('performance', entry.duration, {
      name: entry.name,
      type: entry.entryType,
    });
  }

  private collectNavigationTiming(): void {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        analytics.trackMetric('page_load', navigation.loadEventEnd - navigation.startTime);
        analytics.trackMetric('dom_ready', navigation.domContentLoadedEventEnd - navigation.startTime);
      }
    }
  }

  measure(name: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    analytics.trackMetric(name, duration);
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    analytics.trackMetric(name, duration);
    return result;
  }

  dispose(): void {
    this.performanceObserver?.disconnect();
  }
}

export const metrics = MetricsCollector.getInstance();
