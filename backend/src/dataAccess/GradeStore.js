import db from '../db.js';

class GradeStore {
  async getGradesByStudentAndCourse(studentId, courseId) {
    const [rows] = await db.query(
      `SELECT g.assignment_id, g.score, g.feedback, a.title as assignment_title, a.max_score
       FROM grades g
       JOIN assignments a ON g.assignment_id = a.id
       WHERE g.student_id = ? AND a.course_id = ?`,
      [studentId, courseId]
    );
    return rows;
  }

  async getGradesByAssignment(assignmentId) {
    const [rows] = await db.query(
      `SELECT g.*, u.name AS student_name, u.email AS student_email
       FROM grades g
       LEFT JOIN users u ON g.student_id = u.id
       WHERE g.assignment_id = ?`,
      [assignmentId]
    );
    return rows;
  }

  async getGradeById(id) {
    const [rows] = await db.query('SELECT * FROM grades WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async createGrade(gradeData) {
    const { assignment_id, student_id, score, feedback } = gradeData;
    
    const [existing] = await db.query(
      'SELECT id FROM grades WHERE assignment_id = ? AND student_id = ?',
      [assignment_id, student_id]
    );
    
    if (existing.length > 0) {
      const [result] = await db.query(
        'UPDATE grades SET score = ?, feedback = ?, graded_at = CURRENT_TIMESTAMP WHERE assignment_id = ? AND student_id = ?',
        [score, feedback, assignment_id, student_id]
      );
      return existing[0].id;
    } else {
      const [result] = await db.query(
        'INSERT INTO grades (assignment_id, student_id, score, feedback) VALUES (?, ?, ?, ?)',
        [assignment_id, student_id, score, feedback]
      );
      return result.insertId;
    }
  }

  async updateGrade(id, gradeData) {
    const { score, feedback } = gradeData;
    const [result] = await db.query(
      'UPDATE grades SET score = ?, feedback = ?, graded_at = CURRENT_TIMESTAMP WHERE id = ?',
      [score, feedback, id]
    );
    return result.affectedRows > 0;
  }

  async deleteGrade(id) {
    const [result] = await db.query('DELETE FROM grades WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new GradeStore();

