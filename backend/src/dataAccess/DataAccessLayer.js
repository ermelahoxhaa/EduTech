import UserStore from './UserStore.js';
import CourseStore from './CourseStore.js';
import NotificationStore from './NotificationStore.js';
import AssignmentStore from './AssignmentStore.js';
import MaterialStore from './MaterialStore.js';

class DataAccessLayer {
  constructor() {
    this.userStore = UserStore;
    this.courseStore = CourseStore;
    this.notificationStore = NotificationStore;
    this.assignmentStore = AssignmentStore;
    this.materialStore = MaterialStore;
  }

  async getUser(id) {
    return await this.userStore.getUserById(id);
  }

  async getAllUsers() {
    return await this.userStore.getAllUsers();
  }

  async getUserByEmail(email) {
    return await this.userStore.getUserByEmail(email);
  }

  async getUsersByRole(role) {
    return await this.userStore.getUsersByRole(role);
  }

  async createUser(userData) {
    return await this.userStore.createUser(userData);
  }

  async updateUser(id, userData) {
    return await this.userStore.updateUser(id, userData);
  }

  async deleteUser(id) {
    return await this.userStore.deleteUser(id);
  }

  async getCourses() {
    return await this.courseStore.getAllCourses();
  }

  async getCourse(id) {
    return await this.courseStore.getCourseById(id);
  }

  async createCourse(courseData) {
    return await this.courseStore.createCourse(courseData);
  }

  async updateCourse(id, courseData) {
    return await this.courseStore.updateCourse(id, courseData);
  }

  async deleteCourse(id) {
    return await this.courseStore.deleteCourse(id);
  }

  async getCourseEnrollments(courseId) {
    return await this.courseStore.getCourseEnrollments(courseId);
  }

  async enrollStudent(courseId, studentId) {
    return await this.courseStore.enrollStudent(courseId, studentId);
  }

  async unenrollStudent(courseId, studentId) {
    return await this.courseStore.unenrollStudent(courseId, studentId);
  }

  async getStudentCourses(studentId) {
    return await this.courseStore.getStudentCourses(studentId);
  }

  async getTeacherCourses(teacherId) {
    return await this.courseStore.getTeacherCourses(teacherId);
  }

  async getNotifications() {
    return await this.notificationStore.getAllNotifications();
  }

  async getNotification(id) {
    return await this.notificationStore.getNotificationById(id);
  }

  async createNotification(notificationData) {
    return await this.notificationStore.createNotification(notificationData);
  }

  async updateNotification(id, notificationData) {
    return await this.notificationStore.updateNotification(id, notificationData);
  }

  async deleteNotification(id) {
    return await this.notificationStore.deleteNotification(id);
  }

  async getAssignments() {
    return await this.assignmentStore.getAllAssignments();
  }

  async getAssignment(id) {
    return await this.assignmentStore.getAssignmentById(id);
  }

  async getAssignmentsByCourseId(courseId) {
    return await this.assignmentStore.getAssignmentsByCourseId(courseId);
  }

  async createAssignment(assignmentData) {
    return await this.assignmentStore.createAssignment(assignmentData);
  }

  async updateAssignment(id, assignmentData) {
    return await this.assignmentStore.updateAssignment(id, assignmentData);
  }

  async deleteAssignment(id) {
    return await this.assignmentStore.deleteAssignment(id);
  }

  async getMaterials() {
    return await this.materialStore.getAllMaterials();
  }

  async getMaterial(id) {
    return await this.materialStore.getMaterialById(id);
  }

  async getMaterialsByCourseId(courseId) {
    return await this.materialStore.getMaterialsByCourseId(courseId);
  }

  async createMaterial(materialData) {
    return await this.materialStore.createMaterial(materialData);
  }

  async updateMaterial(id, materialData) {
    return await this.materialStore.updateMaterial(id, materialData);
  }

  async deleteMaterial(id) {
    return await this.materialStore.deleteMaterial(id);
  }
}

export default new DataAccessLayer();

