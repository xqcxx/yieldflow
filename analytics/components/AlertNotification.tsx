/**
 * Alert Notification Component
 */

import React, { useEffect, useState } from 'react';
import { alertManager, Alert, AlertSeverity } from '../src';

interface AlertNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxAlerts?: number;
}

export const AlertNotification: React.FC<AlertNotificationProps> = ({
  position = 'top-right',
  maxAlerts = 5,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const unsubscribe = alertManager.addListener((alert) => {
      setAlerts(alertManager.getUnacknowledgedAlerts().slice(0, maxAlerts));
    });

    return unsubscribe;
  }, [maxAlerts]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const getSeverityStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return 'bg-red-600 text-white border-red-800';
      case AlertSeverity.ERROR:
        return 'bg-red-500 text-white border-red-700';
      case AlertSeverity.WARNING:
        return 'bg-yellow-500 text-black border-yellow-600';
      case AlertSeverity.INFO:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  const getIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
      case AlertSeverity.ERROR:
        return '⚠️';
      case AlertSeverity.WARNING:
        return '⚡';
      case AlertSeverity.INFO:
        return 'ℹ️';
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 space-y-2`}>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg shadow-lg border max-w-md animate-slide-in ${getSeverityStyles(alert.severity)}`}
          role="alert"
        >
          <div className="flex items-start space-x-3">
            <span className="text-xl">{getIcon(alert.severity)}</span>
            <div className="flex-1">
              <h4 className="font-semibold">{alert.title}</h4>
              <p className="text-sm opacity-90">{alert.message}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => alertManager.acknowledgeAlert(alert.id)}
              className="text-sm opacity-75 hover:opacity-100"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
