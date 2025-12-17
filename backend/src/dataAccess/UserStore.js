import db, { promisePool } from '../db.js';

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
    const { name, email, password, role = 'student' } = userData;
    
    if (!['admin', 'teacher', 'student', 'parent'].includes(role)) {
      throw new Error('Invalid role');
    }
    
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
    const connection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [userRows] = await connection.execute('SELECT role FROM users WHERE id = ?', [id]);
      if (userRows.length === 0) {
        await connection.rollback();
        connection.release();
        return false;
      }
      
      const user = userRows[0];
      
      if (user.role === 'teacher') {
        await connection.execute('UPDATE courses SET teacher_id = NULL WHERE teacher_id = ?', [id]);
      }
      
      await connection.execute('DELETE FROM course_enrollments WHERE student_id = ?', [id]);
      
      const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);
      
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
}

export default new UserStore();

