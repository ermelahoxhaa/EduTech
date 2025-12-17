import db, { promisePool } from '../db.js';

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
    const connection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();
      
      await connection.execute('DELETE FROM course_enrollments WHERE course_id = ?', [id]);
      
      try {
        await connection.execute('DELETE FROM assignments WHERE course_id = ?', [id]);
      } catch (err) {
        if (err.code !== 'ER_NO_SUCH_TABLE') {
          throw err;
        }
      }
      
      const [result] = await connection.execute('DELETE FROM courses WHERE id = ?', [id]);
      
      if (result.affectedRows > 0) {
        await connection.commit();
        connection.release();
        return true;
      } else {
        await connection.rollback();
        connection.release();
        return false;
      }
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
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
      return false; 
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

  
  async getStudentCourses(studentId) {
    const [rows] = await db.query(
      `SELECT c.*, u.name AS teacher_name
       FROM courses c
       JOIN course_enrollments ce ON c.id = ce.course_id
       LEFT JOIN users u ON c.teacher_id = u.id
       WHERE ce.student_id = ?`,
      [studentId]
    );
    return rows;
  }

  async getTeacherCourses(teacherId) {
    const [rows] = await db.query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM course_enrollments WHERE course_id = c.id) AS student_count
       FROM courses c
       WHERE c.teacher_id = ?`,
      [teacherId]
    );
    return rows;
  }
}

export default new CourseStore();

