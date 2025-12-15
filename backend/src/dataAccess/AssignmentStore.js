import db from '../db.js';

class AssignmentStore {
  async getAllAssignments() {
    const [rows] = await db.query('SELECT * FROM assignments');
    return rows;
  }

  async getAssignmentById(id) {
    const [rows] = await db.query('SELECT * FROM assignments WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async getAssignmentsByCourseId(courseId) {
    const [rows] = await db.query('SELECT * FROM assignments WHERE course_id = ?', [courseId]);
    return rows;
  }

  async createAssignment(assignmentData) {
    const { title, description, course_id, due_date, max_score } = assignmentData;
    const [result] = await db.query(
      'INSERT INTO assignments (title, description, course_id, due_date, max_score) VALUES (?, ?, ?, ?, ?)',
      [title, description, course_id, due_date, max_score]
    );
    return result.insertId;
  }

  async updateAssignment(id, assignmentData) {
    const { title, description, due_date, max_score } = assignmentData;
    const [result] = await db.query(
      'UPDATE assignments SET title = ?, description = ?, due_date = ?, max_score = ? WHERE id = ?',
      [title, description, due_date, max_score, id]
    );
    return result.affectedRows > 0;
  }

  async deleteAssignment(id) {
    const [result] = await db.query('DELETE FROM assignments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new AssignmentStore();

