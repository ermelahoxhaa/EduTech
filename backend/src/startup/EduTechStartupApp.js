import EduTechLauncher from './EduTechLauncher.js';
import LoggingService from '../services/system/LoggingService.js';

class EduTechStartupApp {
  constructor() {
    this.launcher = EduTechLauncher;
    this.logger = LoggingService;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) {
      this.logger.logWarning('Application already initialized');
      return;
    }

    try {
      this.logger.logInfo('EduTech Startup App initializing...');

      await this.launcher.launch();

      this.initialized = true;
      this.logger.logInfo('EduTech Startup App initialized successfully');
    } catch (error) {
      this.logger.logError('EduTech Startup App initialization failed', {
        error: error.message
      });
      throw error;
    }
  }

  isInitialized() {
    return this.initialized;
  }
}

export default new EduTechStartupApp();

