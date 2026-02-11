/**
 * Logger - Structured logging for debugging and monitoring
 */

import { analytics } from '../src/AnalyticsService';
import { errorTracker } from '../src/ErrorTracker';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private entries: LogEntry[] = [];
  private maxEntries = 1000;

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (level < this.level) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      error,
    };

    this.entries.push(entry);
    this.trimEntries();

    // Log to console
    const consoleMethod = this.getConsoleMethod(level);
    if (error) {
      console[consoleMethod](`[${LogLevel[level]}]`, message, error, context);
    } else {
      console[consoleMethod](`[${LogLevel[level]}]`, message, context);
    }

    // Track in analytics
    analytics.trackEvent('log', {
      level: LogLevel[level],
      message,
      hasError: !!error,
    });

    // Track errors separately
    if (error && level === LogLevel.ERROR) {
      errorTracker.track(error, { component: 'Logger', action: message });
    }
  }

  private getConsoleMethod(level: LogLevel): 'debug' | 'info' | 'warn' | 'error' {
    switch (level) {
      case LogLevel.DEBUG: return 'debug';
      case LogLevel.INFO: return 'info';
      case LogLevel.WARN: return 'warn';
      case LogLevel.ERROR: return 'error';
      default: return 'log';
    }
  }

  private trimEntries(): void {
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
  }

  getEntries(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.entries.filter(e => e.level >= level);
    }
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }

  export(): string {
    return JSON.stringify(this.entries, null, 2);
  }
}

export const logger = new Logger();
