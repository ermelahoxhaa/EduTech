import SystemClock from './SystemClock.js';
import ConfigManager from './ConfigManager.js';
import fs from 'fs';
import path from 'path';

class LoggingService {
  constructor() {
    this.config = ConfigManager;
    this.clock = SystemClock;
    this.logDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  logInfo(message, metadata = {}) {
    this._writeLog('INFO', message, metadata);
  }

  logError(error, metadata = {}) {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;
    this._writeLog('ERROR', errorMessage, { ...metadata, stack: errorStack });
  }

  logWarning(message, metadata = {}) {
    this._writeLog('WARNING', message, metadata);
  }

  logDebug(message, metadata = {}) {
    if (this.config.get('logLevel') === 'debug') {
      this._writeLog('DEBUG', message, metadata);
    }
  }

  _writeLog(level, message, metadata = {}) {
    const timestamp = this.clock.isoString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...metadata
    };

    const logString = `[${timestamp}] [${level}] ${message}`;
    if (level === 'ERROR') {
      console.error(logString, metadata);
    } else {
      console.log(logString, Object.keys(metadata).length > 0 ? metadata : '');
    }

  }
}

export default new LoggingService();

