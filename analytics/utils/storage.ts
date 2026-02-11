/**
 * Analytics Storage - Persistent storage for analytics data
 */

import { AnalyticsEvent, MetricData } from '../src/AnalyticsService';

const ANALYTICS_KEY = 'yieldflow-analytics';
const METRICS_KEY = 'yieldflow-metrics';

export interface StoredAnalytics {
  version: number;
  events: AnalyticsEvent[];
  metrics: MetricData[];
  timestamp: number;
}

export class AnalyticsStorage {
  private version = 1;

  save(events: AnalyticsEvent[], metrics: MetricData[]): void {
    try {
      const data: StoredAnalytics = {
        version: this.version,
        events,
        metrics,
        timestamp: Date.now(),
      };
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save analytics:', e);
    }
  }

  load(): { events: AnalyticsEvent[]; metrics: MetricData[] } | null {
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (stored) {
        const data: StoredAnalytics = JSON.parse(stored);
        if (data.version === this.version) {
          return { events: data.events, metrics: data.metrics };
        }
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    }
    return null;
  }

  clear(): void {
    localStorage.removeItem(ANALYTICS_KEY);
    localStorage.removeItem(METRICS_KEY);
  }

  exportToJSON(): string {
    const stored = this.load();
    if (stored) {
      return JSON.stringify(stored, null, 2);
    }
    return '{}';
  }

  importFromJSON(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (data.events && data.metrics) {
        this.save(data.events, data.metrics);
        return true;
      }
    } catch (e) {
      console.error('Failed to import analytics:', e);
    }
    return false;
  }
}

export const analyticsStorage = new AnalyticsStorage();
