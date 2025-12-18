import AuthenticationService from './AuthenticationService.js';
import NotificationService from './NotificationService.js';
import FileStorageService from './FileStorageService.js';
import EmailService from './EmailService.js';
import LoggingService from './LoggingService.js';
import MetricsService from './MetricsService.js';
import SystemClock from './SystemClock.js';
import ConfigManager from './ConfigManager.js';
import TokenManager from './TokenManager.js';

class ServiceFactory {
  constructor() {
    
    this._authenticationService = null;
    this._notificationService = null;
    this._fileStorageService = null;
    this._emailService = null;
    this._loggingService = null;
    this._metricsService = null;
    this._systemClock = null;
    this._configManager = null;
    this._tokenManager = null;
  }

  getAuthenticationService() {
    if (!this._authenticationService) {
      this._authenticationService = AuthenticationService;
    }
    return this._authenticationService;
  }

  getNotificationService() {
    if (!this._notificationService) {
      this._notificationService = NotificationService;
    }
    return this._notificationService;
  }

  getFileStorageService() {
    if (!this._fileStorageService) {
      this._fileStorageService = FileStorageService;
    }
    return this._fileStorageService;
  }

  getEmailService() {
    if (!this._emailService) {
      this._emailService = EmailService;
    }
    return this._emailService;
  }

  getLoggingService() {
    if (!this._loggingService) {
      this._loggingService = LoggingService;
    }
    return this._loggingService;
  }

  getMetricsService() {
    if (!this._metricsService) {
      this._metricsService = MetricsService;
    }
    return this._metricsService;
  }

  getSystemClock() {
    if (!this._systemClock) {
      this._systemClock = SystemClock;
    }
    return this._systemClock;
  }

  getConfigManager() {
    if (!this._configManager) {
      this._configManager = ConfigManager;
    }
    return this._configManager;
  }

  getTokenManager() {
    if (!this._tokenManager) {
      this._tokenManager = TokenManager;
    }
    return this._tokenManager;
  }
}

export default new ServiceFactory();

