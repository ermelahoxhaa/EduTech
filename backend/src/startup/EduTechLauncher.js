import Configurer from './Configurer.js';
import LoggingService from '../services/system/LoggingService.js';

class EduTechLauncher {
  constructor() {
    this.configurer = Configurer;
    this.logger = LoggingService;
  }

  async launch() {
    try {
      this.logger.logInfo('EduTech Launcher starting...');

      const config = await this.configurer.loadSettings();

      await this.configurer.initializeComponents();

      await this.configurer.restoreState();

      this.logger.logInfo('EduTech Launcher completed successfully');
      
      return config;
    } catch (error) {
      this.logger.logError('EduTech Launcher failed', { error: error.message });
      throw error;
    }
  }

  async checkLocalSettings() {
    try {
      const config = await this.configurer.loadSettings();
      return config;
    } catch (error) {
      this.logger.logError('Failed to check local settings', { error: error.message });
      throw error;
    }
  }
}

export default new EduTechLauncher();

