export {
  // Core services
  AnalyticsService,
  analytics,
  MetricsCollector,
  metrics,
  ErrorTracker,
  errorTracker,
  AlertManager,
  alertManager,
  AlertSeverity,
  HealthMonitor,
  healthMonitor,
  HealthStatus,
  UserAnalytics,
  userAnalytics,
  ReportGenerator,
  reportGenerator,
  
  // Types
  type AnalyticsEvent,
  type MetricData,
  type PerformanceMetrics,
  type ErrorContext,
  type TrackedError,
  type Alert,
  type AlertRule,
  type HealthCheck,
  type HealthCheckConfig,
  type UserSession,
  type UserProfile,
  type DailyReport,
} from './src';

export {
  // Components
  MonitoringDashboard,
  AlertNotification,
  PerformanceDashboard,
  MetricsChart,
} from './components';

export {
  // Hooks
  useAnalytics,
  useAlerts,
  useHealth,
  useErrors,
  usePerformance,
  useSession,
} from './hooks/useMonitoring';

export {
  // Utils
  analyticsStorage,
  logger,
  LogLevel,
  networkMonitor,
} from './utils';

export {
  // Config
  loadConfig,
  saveConfig,
  defaultConfig,
  type MonitoringConfig,
} from './config';
