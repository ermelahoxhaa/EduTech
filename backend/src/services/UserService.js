const UserDAO = require("../dao/UserDAO");

class UserService {
  async listUsers() {
    return await UserDAO.getAllUsers();
  }

  async listStudents() {
    return await UserDAO.getByRole("student");
  }

  async listTeachers() {
    return await UserDAO.getByRole("teacher");
  }
}

module.exports = new UserService();
