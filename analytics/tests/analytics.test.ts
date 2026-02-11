/**
 * Analytics module test suite
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  AnalyticsService, 
  AlertManager, 
  AlertSeverity,
  HealthMonitor,
  HealthStatus,
  ErrorTracker,
} from '../src';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
  });

  it('should track events', () => {
    service.trackEvent('test_event', { foo: 'bar' });
    const events = service.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('test_event');
  });

  it('should track metrics', () => {
    service.trackMetric('response_time', 100);
    const metrics = service.getMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0].value).toBe(100);
  });

  it('should respect buffer size limit', () => {
    for (let i = 0; i < 1100; i++) {
      service.trackEvent(`event_${i}`);
    }
    expect(service.getEvents().length).toBeLessThanOrEqual(1000);
  });
});

describe('AlertManager', () => {
  let manager: AlertManager;

  beforeEach(() => {
    manager = new AlertManager();
  });

  it('should create custom alerts', () => {
    const alert = manager.createCustomAlert('Test', 'Test message', AlertSeverity.INFO, 'test');
    expect(alert.title).toBe('Test');
    expect(alert.severity).toBe(AlertSeverity.INFO);
  });

  it('should acknowledge alerts', () => {
    const alert = manager.createCustomAlert('Test', 'Test', AlertSeverity.INFO, 'test');
    expect(alert.acknowledged).toBe(false);
    manager.acknowledgeAlert(alert.id);
    const alerts = manager.getAlerts();
    expect(alerts[0].acknowledged).toBe(true);
  });

  it('should filter unacknowledged alerts', () => {
    manager.createCustomAlert('Test1', 'Test', AlertSeverity.INFO, 'test');
    manager.createCustomAlert('Test2', 'Test', AlertSeverity.INFO, 'test');
    expect(manager.getUnacknowledgedAlerts()).toHaveLength(2);
  });
});

describe('HealthMonitor', () => {
  let monitor: HealthMonitor;

  beforeEach(() => {
    monitor = new HealthMonitor();
  });

  it('should add health checks', () => {
    monitor.addCheck({
      name: 'test-check',
      check: () => true,
      interval: 1000,
      timeout: 500,
    });
    expect(monitor.getAllResults()).toHaveLength(0);
  });

  it('should calculate overall health status', () => {
    expect(monitor.getHealthStatus()).toBe(HealthStatus.HEALTHY);
  });
});

describe('ErrorTracker', () => {
  let tracker: ErrorTracker;

  beforeEach(() => {
    tracker = new ErrorTracker();
  });

  it('should track errors', () => {
    const error = new Error('Test error');
    tracker.track(error, { component: 'Test' });
    expect(tracker.getErrors()).toHaveLength(1);
  });

  it('should count duplicate errors', () => {
    const error = new Error('Same error');
    tracker.track(error, { component: 'Test' });
    tracker.track(error, { component: 'Test' });
    expect(tracker.getErrors()[0].count).toBe(2);
  });
});
