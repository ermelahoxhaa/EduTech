
class ConfigManager {
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }
    ConfigManager.instance = this;
    
    this.config = {
      logLevel: process.env.LOG_LEVEL || 'info',
      logFile: process.env.LOG_FILE || 'logs/app.log',
      maxFileSize: process.env.MAX_FILE_SIZE || '10MB',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  get(key, defaultValue = null) {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  set(key, value) {
    this.config[key] = value;
  }

  getAll() {
    return { ...this.config };
  }
}

export default new ConfigManager();

