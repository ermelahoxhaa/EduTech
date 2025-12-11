import db from '../db.js';

export const getUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

export const getTeachers = (req, res) => {
  db.query("SELECT id, name, email FROM users WHERE role = 'teacher'", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

export const getStudents = (req, res) => {
  db.query("SELECT id, name, email FROM users WHERE role = 'student'", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

export const getUserById = (req, res) => {
  const { id } = req.params;
  
  db.query("SELECT id, name, email, role FROM users WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  });
};
