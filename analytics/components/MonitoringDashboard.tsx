/**
 * Monitoring Dashboard Component
 */

import React, { useEffect, useState } from 'react';
import { 
  analytics, 
  alertManager, 
  AlertSeverity, 
  healthMonitor, 
  HealthStatus,
  errorTracker,
  userAnalytics,
} from '../src';

interface DashboardStats {
  totalEvents: number;
  totalErrors: number;
  activeAlerts: number;
  healthStatus: HealthStatus;
}

export const MonitoringDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalErrors: 0,
    activeAlerts: 0,
    healthStatus: HealthStatus.HEALTHY,
  });

  const [selectedTab, setSelectedTab] = useState<'overview' | 'alerts' | 'errors' | 'health'>('overview');

  useEffect(() => {
    const updateStats = () => {
      setStats({
        totalEvents: analytics.getEvents().length,
        totalErrors: errorTracker.getErrors().reduce((sum, e) => sum + e.count, 0),
        activeAlerts: alertManager.getUnacknowledgedAlerts().length,
        healthStatus: healthMonitor.getHealthStatus(),
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY: return 'text-green-500';
      case HealthStatus.DEGRADED: return 'text-yellow-500';
      case HealthStatus.UNHEALTHY: return 'text-red-500';
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Monitoring Dashboard</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm">Total Events</div>
          <div className="text-2xl font-bold">{stats.totalEvents}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm">Total Errors</div>
          <div className="text-2xl font-bold text-red-500">{stats.totalErrors}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm">Active Alerts</div>
          <div className="text-2xl font-bold text-orange-500">{stats.activeAlerts}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm">Health Status</div>
          <div className={`text-2xl font-bold capitalize ${getHealthColor(stats.healthStatus)}`}>
            {stats.healthStatus}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        {(['overview', 'alerts', 'errors', 'health'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded capitalize ${
              selectedTab === tab 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        {selectedTab === 'overview' && <OverviewTab />}
        {selectedTab === 'alerts' && <AlertsTab />}
        {selectedTab === 'errors' && <ErrorsTab />}
        {selectedTab === 'health' && <HealthTab />}
      </div>
    </div>
  );
};

const OverviewTab: React.FC = () => {
  const events = analytics.getEvents().slice(-10);
  const recentMetrics = analytics.getMetrics().slice(-10);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Events</h3>
      <div className="space-y-2">
        {events.map((event, i) => (
          <div key={i} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
            <span>{event.name}</span>
            <span className="text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-4">Recent Metrics</h3>
      <div className="space-y-2">
        {recentMetrics.map((metric, i) => (
          <div key={i} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
            <span>{metric.name}</span>
            <span className="font-mono">{metric.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlertsTab: React.FC = () => {
  const [alerts, setAlerts] = useState(alertManager.getAlerts());

  const acknowledgeAlert = (alertId: string) => {
    alertManager.acknowledgeAlert(alertId);
    setAlerts(alertManager.getAlerts());
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className={`p-3 rounded border-l-4 ${
            alert.severity === AlertSeverity.CRITICAL ? 'border-red-500 bg-red-50' :
            alert.severity === AlertSeverity.ERROR ? 'border-orange-500 bg-orange-50' :
            alert.severity === AlertSeverity.WARNING ? 'border-yellow-500 bg-yellow-50' :
            'border-blue-500 bg-blue-50'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{alert.title}</div>
              <div className="text-sm text-gray-600">{alert.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(alert.timestamp).toLocaleString()}
              </div>
            </div>
            {!alert.acknowledged && (
              <button
                onClick={() => acknowledgeAlert(alert.id)}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                Acknowledge
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ErrorsTab: React.FC = () => {
  const errors = errorTracker.getErrors();

  return (
    <div className="space-y-2">
      {errors.map((error, i) => (
        <div key={i} className="p-3 bg-red-50 rounded border-l-4 border-red-500">
          <div className="font-semibold text-red-700">{error.message}</div>
          <div className="text-sm text-gray-600">
            Component: {error.context.component || 'unknown'}
          </div>
          <div className="text-sm text-gray-600">
            Count: {error.count}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Last: {new Date(error.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

const HealthTab: React.FC = () => {
  const checks = healthMonitor.getAllResults();

  return (
    <div className="space-y-2">
      {checks.map((check) => (
        <div 
          key={check.name} 
          className={`p-3 rounded border-l-4 ${
            check.status === HealthStatus.HEALTHY ? 'border-green-500 bg-green-50' :
            check.status === HealthStatus.DEGRADED ? 'border-yellow-500 bg-yellow-50' :
            'border-red-500 bg-red-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="font-semibold">{check.name}</div>
            <div className={`text-sm capitalize ${
              check.status === HealthStatus.HEALTHY ? 'text-green-600' :
              check.status === HealthStatus.DEGRADED ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {check.status}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Response Time: {check.responseTime.toFixed(2)}ms
          </div>
          {check.message && (
            <div className="text-sm text-gray-500">{check.message}</div>
          )}
        </div>
      ))}
    </div>
  );
};
