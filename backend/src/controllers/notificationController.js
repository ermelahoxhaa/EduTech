const db = require("../config/db");

exports.createNotification = (req, res) => {
  const { title, message, audience } = req.body;

  db.query(
    "INSERT INTO notifications(title,message,audience) VALUES(?,?,?)",
    [title, message, audience],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
};

exports.getNotifications = (req, res) => {
  db.query("SELECT * FROM notifications ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
