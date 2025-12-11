import db from "../db.js";

export const getCourses = (req, res) => {
  const query = `
    SELECT c.*, u.name as teacher_name 
    FROM courses c
    LEFT JOIN users u ON c.teacher_id = u.id
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getCourseById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM courses WHERE id = ?', [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, teacher_id } = req.body;
    
    if (!title || !teacher_id) {
      return res.status(400).json({ error: 'Title and teacher ID are required' });
    }

    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO courses (title, description, teacher_id) VALUES (?, ?, ?)',
        [title, description, teacher_id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    const newCourse = await getCourseById(result.insertId);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, teacher_id } = req.body;

    if (!title || !teacher_id) {
      return res.status(400).json({ error: 'Title and teacher ID are required' });
    }

    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE courses SET title = ?, description = ?, teacher_id = ? WHERE id = ?',
        [title, description, teacher_id, id],
        (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 0) {
            return reject(new Error('Course not found'));
          }
          resolve();
        }
      );
    });

    const updatedCourse = await getCourseById(id);
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCourse = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM courses WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  });
};

export const getCourseEnrollments = (req, res) => {
  const { courseId } = req.params;
  
  const query = `
    SELECT u.id, u.name, u.email 
    FROM users u
    JOIN course_enrollments ce ON u.id = ce.student_id
    WHERE ce.course_id = ? AND u.role = 'student'
  `;
  
  db.query(query, [courseId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const enrollStudent = (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body;
  
  db.query(
    'SELECT * FROM course_enrollments WHERE course_id = ? AND student_id = ?',
    [courseId, studentId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) {
        return res.status(400).json({ error: 'Student is already enrolled in this course' });
      }
      
      db.query(
        'INSERT INTO course_enrollments (course_id, student_id) VALUES (?, ?)',
        [courseId, studentId],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: 'Student enrolled successfully' });
        }
      );
    }
  );
};

export const unenrollStudent = (req, res) => {
  const { courseId, studentId } = req.params;
  
  db.query(
    'DELETE FROM course_enrollments WHERE course_id = ? AND student_id = ?',
    [courseId, studentId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }
      res.json({ message: 'Student unenrolled successfully' });
    }
  );
};
