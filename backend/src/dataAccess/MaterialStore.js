import db from '../db.js';

class MaterialStore {
  async getAllMaterials() {
    const [rows] = await db.query('SELECT * FROM materials');
    return rows;
  }

  async getMaterialById(id) {
    const [rows] = await db.query('SELECT * FROM materials WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async getMaterialsByCourseId(courseId) {
    const [rows] = await db.query('SELECT * FROM materials WHERE course_id = ? ORDER BY created_at DESC', [courseId]);
    return rows;
  }

  async createMaterial(materialData) {
    const { title, type, url, course_id } = materialData;
    const [result] = await db.query(
      'INSERT INTO materials (title, type, url, course_id) VALUES (?, ?, ?, ?)',
      [title, type, url, course_id]
    );
    return result.insertId;
  }

  async updateMaterial(id, materialData) {
    const { title, type, url } = materialData;
    const [result] = await db.query(
      'UPDATE materials SET title = ?, type = ?, url = ? WHERE id = ?',
      [title, type, url, id]
    );
    return result.affectedRows > 0;
  }

  async deleteMaterial(id) {
    const [result] = await db.query('DELETE FROM materials WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new MaterialStore();

