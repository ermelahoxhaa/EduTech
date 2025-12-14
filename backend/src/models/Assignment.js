const db = require('../db');

class Assignment {
  static async create(assignmentData) {
    const { title, description, course_id, due_date, max_score } = assignmentData;
    const [result] = await db.execute(
      'INSERT INTO assignments (title, description, course_id, due_date, max_score) VALUES (?, ?, ?, ?, ?)',
      [title, description, course_id, due_date, max_score]
    );
    return this.getById(result.insertId);
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM assignments WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByCourseId(courseId) {
    const [rows] = await db.execute('SELECT * FROM assignments WHERE course_id = ?', [courseId]);
    return rows;
  }

  static async update(id, assignmentData) {
    const { title, description, due_date, max_score } = assignmentData;
    await db.execute(
      'UPDATE assignments SET title = ?, description = ?, due_date = ?, max_score = ? WHERE id = ?',
      [title, description, due_date, max_score, id]
    );
    return this.getById(id);
  }

  static async delete(id) {
    await db.execute('DELETE FROM assignments WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Assignment;
