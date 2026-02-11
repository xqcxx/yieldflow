/**
 * Alert Manager - Handle alerting and notifications
 */

import { analytics } from './AnalyticsService';

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: number;
  acknowledged: boolean;
  source: string;
  metadata?: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: any) => boolean;
  severity: AlertSeverity;
  cooldown: number;
  lastTriggered?: number;
}

export class AlertManager {
  private alerts: Alert[] = [];
  private rules: AlertRule[] = [];
  private listeners: ((alert: Alert) => void)[] = [];
  private readonly maxAlerts = 100;

  addRule(rule: AlertRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  evaluateRules(metrics: any): void {
    const now = Date.now();
    
    for (const rule of this.rules) {
      if (rule.lastTriggered && now - rule.lastTriggered < rule.cooldown) {
        continue;
      }

      if (rule.condition(metrics)) {
        this.triggerAlert(rule, metrics);
        rule.lastTriggered = now;
      }
    }
  }

  private triggerAlert(rule: AlertRule, context: any): void {
    const alert: Alert = {
      id: `${rule.id}-${Date.now()}`,
      title: rule.name,
      message: `Alert triggered for rule: ${rule.name}`,
      severity: rule.severity,
      timestamp: Date.now(),
      acknowledged: false,
      source: rule.id,
      metadata: context,
    };

    this.alerts.unshift(alert);
    this.trimAlerts();
    this.notifyListeners(alert);

    analytics.trackEvent('alert_triggered', {
      ruleId: rule.id,
      severity: rule.severity,
    });
  }

  createCustomAlert(title: string, message: string, severity: AlertSeverity, source: string): Alert {
    const alert: Alert = {
      id: `custom-${Date.now()}`,
      title,
      message,
      severity,
      timestamp: Date.now(),
      acknowledged: false,
      source,
    };

    this.alerts.unshift(alert);
    this.trimAlerts();
    this.notifyListeners(alert);

    return alert;
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      analytics.trackEvent('alert_acknowledged', { alertId });
    }
  }

  private trimAlerts(): void {
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(0, this.maxAlerts);
    }
  }

  addListener(listener: (alert: Alert) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(alert: Alert): void {
    this.listeners.forEach(listener => listener(alert));
  }

  getAlerts(severity?: AlertSeverity): Alert[] {
    if (severity) {
      return this.alerts.filter(a => a.severity === severity);
    }
    return [...this.alerts];
  }

  getUnacknowledgedAlerts(): Alert[] {
    return this.alerts.filter(a => !a.acknowledged);
  }

  clearAlerts(): void {
    this.alerts = [];
  }
}

export const alertManager = new AlertManager();
