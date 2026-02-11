/**
 * Network Monitor - Track API calls and network performance
 */

import { analytics } from '../src/AnalyticsService';
import { metrics } from '../src/MetricsCollector';

export interface NetworkRequest {
  url: string;
  method: string;
  status?: number;
  duration?: number;
  error?: string;
  timestamp: number;
}

export class NetworkMonitor {
  private requests: NetworkRequest[] = [];
  private maxRequests = 100;
  private originalFetch?: typeof fetch;

  initialize(): void {
    this.interceptFetch();
  }

  private interceptFetch(): void {
    if (typeof window === 'undefined') return;

    this.originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options] = args;
      const startTime = performance.now();
      
      const request: NetworkRequest = {
        url: url.toString(),
        method: options?.method || 'GET',
        timestamp: Date.now(),
      };

      try {
        const response = await this.originalFetch!(...args);
        request.status = response.status;
        request.duration = performance.now() - startTime;
        
        this.trackRequest(request);
        
        return response;
      } catch (error) {
        request.error = error instanceof Error ? error.message : 'Unknown error';
        request.duration = performance.now() - startTime;
        
        this.trackRequest(request);
        
        throw error;
      }
    };
  }

  private trackRequest(request: NetworkRequest): void {
    this.requests.push(request);
    
    if (this.requests.length > this.maxRequests) {
      this.requests = this.requests.slice(-this.maxRequests);
    }

    analytics.trackEvent('api_request', {
      url: request.url,
      method: request.method,
      status: request.status,
      duration: request.duration,
      error: request.error,
    });

    if (request.duration) {
      metrics.trackMetric('api_response_time', request.duration, {
        method: request.method,
        status: request.status?.toString() || 'unknown',
      });
    }
  }

  getRequests(): NetworkRequest[] {
    return [...this.requests];
  }

  getStats(): {
    total: number;
    success: number;
    error: number;
    avgDuration: number;
  } {
    const total = this.requests.length;
    const success = this.requests.filter(r => r.status && r.status < 400).length;
    const error = total - success;
    const durations = this.requests.filter(r => r.duration).map(r => r.duration!);
    const avgDuration = durations.length > 0 
      ? durations.reduce((a, b) => a + b, 0) / durations.length 
      : 0;

    return { total, success, error, avgDuration };
  }

  dispose(): void {
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
      this.originalFetch = undefined;
    }
  }
}

export const networkMonitor = new NetworkMonitor();
