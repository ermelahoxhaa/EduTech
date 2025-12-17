import DataAccessLayer from '../dataAccess/DataAccessLayer.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await DataAccessLayer.getNotifications();
    res.json(notifications);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};


export const getStudentNotifications = async (req, res) => {
  try {
    const notifications = await DataAccessLayer.getNotifications();
    const studentNotifications = notifications.filter(
      n => n.audience === 'all' || n.audience === 'students'
    );
    res.json(studentNotifications);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const notification = await DataAccessLayer.getNotification(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const createNotification = async (req, res) => {
  const { title, message, audience } = req.body;

  if (!title || !message || !audience) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const notificationId = await DataAccessLayer.createNotification({ title, message, audience });
    const newNotification = await DataAccessLayer.getNotification(notificationId);
    res.status(201).json(newNotification);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { title, message, audience } = req.body;

  if (!title || !message || !audience) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updated = await DataAccessLayer.updateNotification(id, { title, message, audience });
    
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const updatedNotification = await DataAccessLayer.getNotification(id);
    res.json(updatedNotification);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await DataAccessLayer.deleteNotification(id);
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};