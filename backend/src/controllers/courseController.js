import db from "../db.js";

export const getCourses = async (req, res) => {
  try {
    const query = `
      SELECT c.*, u.name AS teacher_name
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCourseById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM courses WHERE id = ?",
    [id]
  );
  return rows[0];
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, teacher_id } = req.body;

    if (!title || !teacher_id) {
      return res.status(400).json({ error: "Title and teacher ID are required" });
    }

    const [result] = await db.query(
      "INSERT INTO courses (title, description, teacher_id) VALUES (?, ?, ?)",
      [title, description, teacher_id]
    );

    const newCourse = await getCourseById(result.insertId);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, teacher_id } = req.body;

    const [result] = await db.query(
      "UPDATE courses SET title = ?, description = ?, teacher_id = ? WHERE id = ?",
      [title, description, teacher_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = await getCourseById(id);
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM courses WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email
       FROM users u
       JOIN course_enrollments ce ON u.id = ce.student_id
       WHERE ce.course_id = ? AND u.role = 'student'`,
      [courseId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const [existing] = await db.query(
      "SELECT 1 FROM course_enrollments WHERE course_id = ? AND student_id = ?",
      [courseId, studentId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Student already enrolled" });
    }

    await db.query(
      "INSERT INTO course_enrollments (course_id, student_id) VALUES (?, ?)",
      [courseId, studentId]
    );

    res.status(201).json({ message: "Student enrolled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const unenrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const [result] = await db.query(
      "DELETE FROM course_enrollments WHERE course_id = ? AND student_id = ?",
      [courseId, studentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.json({ message: "Student unenrolled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
