import db from '../db.js';

export const getNotifications = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM notifications ORDER BY created_at DESC");
    res.json(results);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM notifications WHERE id = ?", [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(results[0]);
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
    const [result] = await db.query(
      "INSERT INTO notifications (title, message, audience) VALUES (?, ?, ?)",
      [title, message, audience]
    );
    const [newNotification] = await db.query(
      "SELECT * FROM notifications WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json(newNotification[0]);
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
    const [result] = await db.query(
      "UPDATE notifications SET title = ?, message = ?, audience = ? WHERE id = ?",
      [title, message, audience, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const [updatedNotification] = await db.query(
      "SELECT * FROM notifications WHERE id = ?",
      [id]
    );
    
    res.json(updatedNotification[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM notifications WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};