
const db = require('../db'); 


exports.getNotifications = (req, res) => {
  const sql = "SELECT * FROM notifications ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    res.json(results);
  });
};


exports.createNotification = (req, res) => {
  const { title, message, audience } = req.body;

  if (!title || !message || !audience) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO notifications (title, message, audience) VALUES (?, ?, ?)";
  db.query(sql, [title, message, audience], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    res.status(201).json({ id: result.insertId, title, message, audience });
  });
};


exports.deleteNotification = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM notifications WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    res.json({ message: "Notification deleted" });
  });
};
