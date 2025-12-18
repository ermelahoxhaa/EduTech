import DataAccessLayer from '../../dataAccess/DataAccessLayer.js';
import SystemClock from './SystemClock.js';
import LoggingService from './LoggingService.js';

class NotificationService {
  constructor() {
    this.clock = SystemClock;
    this.logger = LoggingService;
  }

  async sendNotification(toUserId, message, title = 'Notification', audience = 'all') {
    if (!toUserId || !message) {
      throw new Error('User ID and message are required');
    }

    try {
      const notificationData = {
        title,
        message,
        audience
      };

      const notificationId = await DataAccessLayer.createNotification(notificationData);
      
      this.logger.logInfo('Notification sent', {
        notificationId,
        toUserId,
        title
      });

      return notificationId;
    } catch (error) {
      this.logger.logError('Failed to send notification', {
        toUserId,
        error: error.message
      });
      throw error;
    }
  }

  async markAsRead(notificationId) {
    if (!notificationId) {
      throw new Error('Notification ID is required');
    }

    try {

      this.logger.logInfo('Notification marked as read', { notificationId });
      return true;
    } catch (error) {
      this.logger.logError('Failed to mark notification as read', {
        notificationId,
        error: error.message
      });
      throw error;
    }
  }
}

export default new NotificationService();

