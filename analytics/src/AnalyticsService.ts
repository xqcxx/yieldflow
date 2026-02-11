/**
 * Analytics Service - Core analytics collection and reporting
 */

export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface MetricData {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: number;
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private metrics: MetricData[] = [];
  private readonly maxBufferSize = 1000;

  trackEvent(name: string, properties: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };
    
    this.events.push(event);
    this.trimBuffer();
  }

  trackMetric(name: string, value: number, labels?: Record<string, string>): void {
    const metric: MetricData = {
      name,
      value,
      labels,
      timestamp: Date.now(),
    };
    
    this.metrics.push(metric);
    this.trimBuffer();
  }

  private trimBuffer(): void {
    if (this.events.length > this.maxBufferSize) {
      this.events = this.events.slice(-this.maxBufferSize);
    }
    if (this.metrics.length > this.maxBufferSize) {
      this.metrics = this.metrics.slice(-this.maxBufferSize);
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getMetrics(): MetricData[] {
    return [...this.metrics];
  }

  clear(): void {
    this.events = [];
    this.metrics = [];
  }
}

export const analytics = new AnalyticsService();
