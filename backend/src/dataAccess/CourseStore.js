import db from '../db.js';

class CourseStore {
  async getAllCourses() {
    const [rows] = await db.query(`
      SELECT c.*, u.name AS teacher_name
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
    `);
    return rows;
  }

  async getCourseById(id) {
    const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async createCourse(courseData) {
    const { title, description, teacher_id } = courseData;
    const [result] = await db.query(
      'INSERT INTO courses (title, description, teacher_id) VALUES (?, ?, ?)',
      [title, description, teacher_id]
    );
    return result.insertId;
  }

  async updateCourse(id, courseData) {
    const { title, description, teacher_id } = courseData;
    const [result] = await db.query(
      'UPDATE courses SET title = ?, description = ?, teacher_id = ? WHERE id = ?',
      [title, description, teacher_id, id]
    );
    return result.affectedRows > 0;
  }

  async deleteCourse(id) {
    const [result] = await db.query('DELETE FROM courses WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  async getCourseEnrollments(courseId) {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email
       FROM users u
       JOIN course_enrollments ce ON u.id = ce.student_id
       WHERE ce.course_id = ? AND u.role = 'student'`,
      [courseId]
    );
    return rows;
  }

  async enrollStudent(courseId, studentId) {
    const [existing] = await db.query(
      'SELECT 1 FROM course_enrollments WHERE course_id = ? AND student_id = ?',
      [courseId, studentId]
    );
    
    if (existing.length > 0) {
      return false; // Already enrolled
    }

    await db.query(
      'INSERT INTO course_enrollments (course_id, student_id) VALUES (?, ?)',
      [courseId, studentId]
    );
    return true;
  }

  async unenrollStudent(courseId, studentId) {
    const [result] = await db.query(
      'DELETE FROM course_enrollments WHERE course_id = ? AND student_id = ?',
      [courseId, studentId]
    );
    return result.affectedRows > 0;
  }
}

export default new CourseStore();

