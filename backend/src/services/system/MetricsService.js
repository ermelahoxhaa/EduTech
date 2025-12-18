import TokenManager from './TokenManager.js';
import SystemClock from './SystemClock.js';
import LoggingService from './LoggingService.js';

class MetricsService {
  constructor() {
    this.tokenManager = TokenManager;
    this.clock = SystemClock;
    this.logger = LoggingService;
    this.metrics = {
      events: [],
      usage: {}
    };
  }

  async recordEvent(eventName, metadata = {}) {
    if (!eventName) {
      throw new Error('Event name is required');
    }

    const event = {
      name: eventName,
      timestamp: this.clock.isoString(),
      ...metadata
    };

    this.metrics.events.push(event);

    if (this.metrics.events.length > 1000) {
      this.metrics.events.shift();
    }

    this.logger.logInfo('Event recorded', event);
  }

  async trackUsage(userId, action) {
    if (!userId || !action) {
      throw new Error('User ID and action are required');
    }

    if (!this.metrics.usage[userId]) {
      this.metrics.usage[userId] = {
        actions: [],
        lastActivity: null
      };
    }

    this.metrics.usage[userId].actions.push({
      action,
      timestamp: this.clock.isoString()
    });

    this.metrics.usage[userId].lastActivity = this.clock.isoString();

    if (this.metrics.usage[userId].actions.length > 100) {
      this.metrics.usage[userId].actions.shift();
    }

    this.logger.logDebug('Usage tracked', { userId, action });
  }

  getUserMetrics(userId) {
    return this.metrics.usage[userId] || {
      actions: [],
      lastActivity: null
    };
  }

  getEvents(limit = 100) {
    return this.metrics.events.slice(-limit);
  }
}

export default new MetricsService();

