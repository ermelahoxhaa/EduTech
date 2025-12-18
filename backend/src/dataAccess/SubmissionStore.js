import db from '../db.js';

class SubmissionStore {
  async getAllSubmissions() {
    const [rows] = await db.query('SELECT * FROM submissions');
    return rows;
  }

  async getSubmissionById(id) {
    const [rows] = await db.query('SELECT * FROM submissions WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async getSubmissionByAssignmentAndStudent(assignmentId, studentId) {
    const [rows] = await db.query(
      'SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?',
      [assignmentId, studentId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async getSubmissionsByAssignment(assignmentId) {
    const [rows] = await db.query(
      'SELECT s.*, u.name AS student_name, u.email AS student_email FROM submissions s LEFT JOIN users u ON s.student_id = u.id WHERE s.assignment_id = ?',
      [assignmentId]
    );
    return rows;
  }

  async getSubmissionsByStudent(studentId) {
    const [rows] = await db.query(
      'SELECT s.*, a.title AS assignment_title, a.course_id FROM submissions s LEFT JOIN assignments a ON s.assignment_id = a.id WHERE s.student_id = ?',
      [studentId]
    );
    return rows;
  }

  async createSubmission(submissionData) {
    const { assignment_id, student_id, submission_url } = submissionData;
    
    const existing = await this.getSubmissionByAssignmentAndStudent(assignment_id, student_id);
    
    if (existing) {
      const [result] = await db.query(
        'UPDATE submissions SET submission_url = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?',
        [submission_url, existing.id]
      );
      return existing.id;
    } else {
      const [result] = await db.query(
        'INSERT INTO submissions (assignment_id, student_id, submission_url) VALUES (?, ?, ?)',
        [assignment_id, student_id, submission_url]
      );
      return result.insertId;
    }
  }

  async updateSubmission(id, submissionData) {
    const { submission_url } = submissionData;
    const [result] = await db.query(
      'UPDATE submissions SET submission_url = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [submission_url, id]
    );
    return result.affectedRows > 0;
  }

  async deleteSubmission(id) {
    const [result] = await db.query('DELETE FROM submissions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new SubmissionStore();

