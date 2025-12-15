import db from '../db.js';

class NotificationStore {
  async getAllNotifications() {
    const [rows] = await db.query('SELECT * FROM notifications ORDER BY created_at DESC');
    return rows;
  }

  async getNotificationById(id) {
    const [rows] = await db.query('SELECT * FROM notifications WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async createNotification(notificationData) {
    const { title, message, audience } = notificationData;
    const [result] = await db.query(
      'INSERT INTO notifications (title, message, audience) VALUES (?, ?, ?)',
      [title, message, audience]
    );
    return result.insertId;
  }

  async updateNotification(id, notificationData) {
    const { title, message, audience } = notificationData;
    const [result] = await db.query(
      'UPDATE notifications SET title = ?, message = ?, audience = ? WHERE id = ?',
      [title, message, audience, id]
    );
    return result.affectedRows > 0;
  }

  async deleteNotification(id) {
    const [result] = await db.query('DELETE FROM notifications WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new NotificationStore();

