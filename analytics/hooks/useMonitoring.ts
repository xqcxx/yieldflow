/**
 * React Hooks for Monitoring
 */

import { useEffect, useState, useCallback } from 'react';
import { 
  analytics, 
  metrics, 
  errorTracker, 
  alertManager, 
  healthMonitor,
  userAnalytics,
  type Alert,
  type HealthCheck,
  type TrackedError,
} from '../src';

export function useAnalytics() {
  const [events, setEvents] = useState(analytics.getEvents());
  const [metrics, setMetrics] = useState(analytics.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(analytics.getEvents());
      setMetrics(analytics.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { events, metrics };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(alertManager.getAlerts());

  useEffect(() => {
    const unsubscribe = alertManager.addListener((alert) => {
      setAlerts(alertManager.getAlerts());
    });

    return unsubscribe;
  }, []);

  const acknowledge = useCallback((alertId: string) => {
    alertManager.acknowledgeAlert(alertId);
    setAlerts(alertManager.getAlerts());
  }, []);

  return { alerts, acknowledge };
}

export function useHealth() {
  const [checks, setChecks] = useState<HealthCheck[]>(healthMonitor.getAllResults());
  const [status, setStatus] = useState(healthMonitor.getHealthStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setChecks(healthMonitor.getAllResults());
      setStatus(healthMonitor.getHealthStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { checks, status };
}

export function useErrors() {
  const [errors, setErrors] = useState<TrackedError[]>(errorTracker.getErrors());

  useEffect(() => {
    const unsubscribe = errorTracker.addListener(() => {
      setErrors(errorTracker.getErrors());
    });

    return unsubscribe;
  }, []);

  return { errors };
}

export function usePerformance() {
  useEffect(() => {
    metrics.initialize();
    return () => metrics.dispose();
  }, []);

  const measure = useCallback(<T,>(name: string, fn: () => T): T => {
    return metrics.measure(name, fn);
  }, []);

  const measureAsync = useCallback(<T,>(name: string, fn: () => Promise<T>): Promise<T> => {
    return metrics.measureAsync(name, fn);
  }, []);

  return { measure, measureAsync };
}

export function useSession() {
  useEffect(() => {
    userAnalytics.startSession();
    return () => userAnalytics.endSession();
  }, []);

  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    userAnalytics.trackUserEvent(event, properties);
  }, []);

  const trackPageView = useCallback((page: string) => {
    userAnalytics.trackPageView(page);
  }, []);

  return { trackEvent, trackPageView };
}
