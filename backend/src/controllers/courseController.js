const db = require("../config/db");

exports.getCourses = (req, res) => {
  db.query("SELECT * FROM courses", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.addCourse = (req, res) => {
  const { title, description, teacher_id } = req.body;

  db.query(
    "INSERT INTO courses(title,description,teacher_id) VALUES(?,?,?)",
    [title, description, teacher_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
};
