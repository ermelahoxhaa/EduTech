import SystemClock from './SystemClock.js';
import LoggingService from './LoggingService.js';

class EmailService {
  constructor() {
    this.clock = SystemClock;
    this.logger = LoggingService;
    
  }

  async sendEmail(to, subject, body, options = {}) {
    if (!to) {
      throw new Error('Recipient email address is required');
    }

    try {

      this.logger.logInfo('Email sent', {
        to,
        subject,
        timestamp: this.clock.isoString()
      });

      return true;
    } catch (error) {
      this.logger.logError('Failed to send email', {
        to,
        subject,
        error: error.message
      });
      throw error;
    }
  }

  async sendNotificationEmail(to, title, message) {
    const subject = `EduTech Notification: ${title}`;
    const body = `
      <h2>${title}</h2>
      <p>${message}</p>
      <p><small>Sent at ${this.clock.isoString()}</small></p>
    `;
    
    return await this.sendEmail(to, subject, body);
  }
}

export default new EmailService();

