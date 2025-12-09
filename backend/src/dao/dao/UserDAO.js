const db = require("../config/db");

class UserDAO {
  getAllUsers() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getByRole(role) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE role=?", [role], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = new UserDAO();
