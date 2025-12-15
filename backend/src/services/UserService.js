import DataAccessLayer from '../dataAccess/DataAccessLayer.js';

class UserService {
  async listUsers() {
    return await DataAccessLayer.getAllUsers();
  }

  async listStudents() {
    return await DataAccessLayer.getUsersByRole("student");
  }

  async listTeachers() {
    return await DataAccessLayer.getUsersByRole("teacher");
  }

  async getUserById(id) {
    return await DataAccessLayer.getUser(id);
  }
}

export default new UserService();
