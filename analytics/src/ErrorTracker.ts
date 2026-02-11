/**
 * Error Tracker - Capture and report errors
 */

import { analytics } from './AnalyticsService';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface TrackedError {
  message: string;
  stack?: string;
  context: ErrorContext;
  timestamp: number;
  count: number;
}

export class ErrorTracker {
  private errors: Map<string, TrackedError> = new Map();
  private errorListeners: ((error: TrackedError) => void)[] = [];

  initialize(): void {
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers(): void {
    window.addEventListener('error', (event) => {
      this.track(event.error || new Error(event.message), {
        component: 'global',
        action: 'window.onerror',
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      this.track(error, {
        component: 'global',
        action: 'unhandledrejection',
      });
    });
  }

  track(error: Error, context: ErrorContext = {}): void {
    const key = `${error.message}:${context.component}:${context.action}`;
    const existing = this.errors.get(key);

    if (existing) {
      existing.count++;
      existing.timestamp = Date.now();
    } else {
      const trackedError: TrackedError = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: Date.now(),
        count: 1,
      };
      this.errors.set(key, trackedError);
      this.notifyListeners(trackedError);
    }

    analytics.trackEvent('error', {
      message: error.message,
      component: context.component,
      action: context.action,
    });
  }

  addListener(listener: (error: TrackedError) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(error: TrackedError): void {
    this.errorListeners.forEach(listener => listener(error));
  }

  getErrors(): TrackedError[] {
    return Array.from(this.errors.values());
  }

  clear(): void {
    this.errors.clear();
  }
}

export const errorTracker = new ErrorTracker();
