import db from '../db.js';

class UserStore {
  async getAllUsers() {
    const [rows] = await db.query('SELECT id, name, email, role FROM users');
    return rows;
  }

  async getUserById(id) {
    const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async getUserByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  async getUsersByRole(role) {
    const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE role = ?', [role]);
    return rows;
  }

  async createUser(userData) {
    const { name, email, password, role = 0 } = userData;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return result.insertId;
  }

  async updateUser(id, userData) {
    const { name, email, password, role } = userData;
    let query = 'UPDATE users SET name = ?, email = ?';
    const params = [name, email];

    if (role !== undefined) {
      query += ', role = ?';
      params.push(role);
    }

    if (password) {
      query += ', password = ?';
      params.push(password);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.query(query, params);
    return result.affectedRows > 0;
  }

  async deleteUser(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new UserStore();

