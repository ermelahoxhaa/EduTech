exports.getUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
