<template>
  <div class="teacher-course-page">
    <main class="page-main">
      <div class="main-container">
        <div class="course-header-section">
          <div class="header-top">
            <button @click="goBack" class="btn-back">
              <i class="fas fa-arrow-left"></i> Back to Courses
            </button>
            <button @click="handleLogout" class="btn-logout">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
          <div v-if="course" class="course-info">
            <h1>{{ getCourseTitle(course) }}</h1>
            <p class="course-description">{{ getCourseDescription(course) }}</p>
            <div class="course-stats">
              <div class="stat-item">
                <span class="stat-value">{{ enrolledStudents.length }}</span>
                <span class="stat-label">Enrolled Students</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ assignments.length }}</span>
                <span class="stat-label">Assignments</span>
              </div>
            </div>
          </div>
        </div>

        <div class="tabs-section">
          <div class="tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              :class="['tab-button', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <i :class="tab.icon"></i>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <div class="content-section">
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading course data...</p>
          </div>

          <div v-else>
            <div v-if="activeTab === 'enrollments'" class="tab-content">
              <div class="section-header">
                <h2>👥 Student Enrollments</h2>
                <p class="section-subtitle">Manage which students are enrolled in this course</p>
              </div>

              <div class="enrollment-grid">
                <div class="enrollment-card">
                  <div class="enrollment-card-header">
                    <h3>Enrolled Students</h3>
                    <span class="badge-count">{{ enrolledStudents.length }}</span>
                  </div>
                  <div class="enrollment-card-body">
                    <div v-if="enrolledStudents.length === 0" class="empty-message">
                      <div class="empty-icon-small">👥</div>
                      <p>No students enrolled yet</p>
                    </div>
                    <ul v-else class="student-list">
                      <li v-for="student in enrolledStudents" :key="'enrolled-'+student.id" class="student-item">
                        <div class="student-info">
                          <span class="student-name">{{ student.name }}</span>
                          <span class="student-email">{{ student.email }}</span>
                        </div>
                        <button @click="unenrollStudent(student.id)" class="btn-icon-danger btn-sm" title="Remove Student">
                          <i class="fas fa-user-minus"></i> Remove
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="enrollment-card">
                  <div class="enrollment-card-header">
                    <h3>Available Students</h3>
                    <span class="badge-count">{{ availableStudents.length }}</span>
                  </div>
                  <div class="enrollment-card-body">
                    <div v-if="availableStudents.length === 0" class="empty-message">
                      <div class="empty-icon-small">✅</div>
                      <p>All students are enrolled</p>
                    </div>
                    <ul v-else class="student-list">
                      <li v-for="student in availableStudents" :key="'available-'+student.id" class="student-item">
                        <div class="student-info">
                          <span class="student-name">{{ student.name }}</span>
                          <span class="student-email">{{ student.email }}</span>
                        </div>
                        <button @click="enrollStudent(student.id)" class="btn-icon-success btn-sm" title="Enroll Student">
                          <i class="fas fa-user-plus"></i> Enroll
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'materials'" class="tab-content">
              <div class="section-header">
                <h2>📚 Course Materials</h2>
                <button @click="showMaterialModal = true" class="btn-primary">
                  <i class="fas fa-plus"></i> Add Material
                </button>
              </div>

              <div v-if="materials.length === 0" class="empty-state">
                <div class="empty-icon">📄</div>
                <h3>No Materials Yet</h3>
                <p>Add learning materials like PDFs, links, or documents for your students.</p>
              </div>

              <div v-else class="materials-grid">
                <div v-for="material in materials" :key="material.id" class="material-card">
                  <div class="material-icon">{{ getMaterialIcon(material.type) }}</div>
                  <div class="material-content">
                    <h3>{{ material.title }}</h3>
                    <p class="material-type">{{ material.type }}</p>
                    <a v-if="material.url" :href="material.url" target="_blank" class="material-link">
                      View Material <i class="fas fa-external-link-alt"></i>
                    </a>
                  </div>
                  <button @click="deleteMaterial(material.id)" class="btn-icon-danger">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'assignments'" class="tab-content">
              <div class="section-header">
                <h2>📝 Assignments</h2>
                <button @click="showAssignmentModal = true" class="btn-primary">
                  <i class="fas fa-plus"></i> Create Assignment
                </button>
              </div>

              <div v-if="assignments.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No Assignments Yet</h3>
                <p>Create assignments for your students to complete.</p>
              </div>

              <div v-else class="assignments-list">
                <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
                  <div class="assignment-header">
                    <h3>{{ assignment.title }}</h3>
                    <div class="assignment-actions">
                      <button @click="editAssignment(assignment)" class="btn-icon">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="confirmDeleteAssignment(assignment.id)" class="btn-icon-danger">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p class="assignment-description">{{ assignment.description }}</p>
                  <div class="assignment-meta">
                    <span class="meta-item">
                      <i class="fas fa-calendar"></i>
                      Due: {{ formatDate(assignment.due_date) }}
                    </span>
                    <span class="meta-item">
                      <i class="fas fa-star"></i>
                      Max Score: {{ assignment.max_score }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'grades'" class="tab-content">
              <div class="section-header">
                <h2>📊 Grades</h2>
              </div>

              <div v-if="enrolledStudents.length === 0" class="empty-state">
                <div class="empty-icon">👥</div>
                <h3>No Students Enrolled</h3>
                <p>Students need to be enrolled in this course before you can set grades.</p>
              </div>

              <div v-else class="grades-table-container">
                <table class="grades-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th v-for="assignment in assignments" :key="assignment.id" class="assignment-column">
                        {{ assignment.title }}
                      </th>
                      <th>Final Grade</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in enrolledStudents" :key="student.id">
                      <td class="student-name">{{ student.name }}</td>
                      <td v-for="assignment in assignments" :key="assignment.id">
                        <input 
                          type="number" 
                          :value="getGrade(student.id, assignment.id)"
                          @change="updateGrade(student.id, assignment.id, $event.target.value)"
                          class="grade-input"
                          min="0"
                          :max="assignment.max_score"
                          placeholder="0"
                        />
                      </td>
                      <td class="final-grade">{{ calculateFinalGrade(student.id) }}</td>
                      <td>
                        <button @click="viewStudentGrades(student)" class="btn-icon">
                          <i class="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showMaterialModal" class="modal-overlay" @click.self="closeMaterialModal">
      <div class="modal">
        <div class="modal-header">
          <h3>Add Material</h3>
          <button @click="closeMaterialModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveMaterial">
            <div class="form-group">
              <label>Title</label>
              <input v-model="materialForm.title" type="text" required placeholder="Material title" />
            </div>
            <div class="form-group">
              <label>Type</label>
              <select v-model="materialForm.type" required>
                <option value="">Select Type</option>
                <option value="PDF">PDF Document</option>
                <option value="Link">External Link</option>
                <option value="Video">Video</option>
                <option value="Document">Document</option>
              </select>
            </div>
            <div class="form-group">
              <label>URL / Link</label>
              <input v-model="materialForm.url" type="url" required placeholder="https://..." />
            </div>
            <div class="form-actions">
              <button type="button" @click="closeMaterialModal" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Add Material</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showAssignmentModal" class="modal-overlay" @click.self="closeAssignmentModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingAssignment ? 'Edit' : 'Create' }} Assignment</h3>
          <button @click="closeAssignmentModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAssignment">
            <div class="form-group">
              <label>Title</label>
              <input v-model="assignmentForm.title" type="text" required placeholder="Assignment title" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="assignmentForm.description" rows="4" required placeholder="Assignment description"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Due Date</label>
                <input v-model="assignmentForm.due_date" type="datetime-local" required />
              </div>
              <div class="form-group">
                <label>Max Score</label>
                <input v-model="assignmentForm.max_score" type="number" min="1" required placeholder="100" />
              </div>
            </div>
            <div class="form-actions">
              <button type="button" @click="closeAssignmentModal" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">{{ editingAssignment ? 'Update' : 'Create' }} Assignment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: 'TeacherCourseDetail',
  setup() {
    const { user, isAuthenticated, checkAuth, hasRole, logout } = useAuth();
    const router = useRouter();
    const route = useRoute();
    return { user, isAuthenticated, checkAuth, hasRole, router, route, logout };
  },
  data() {
    return {
      course: null,
      assignments: [],
      materials: [],
      enrolledStudents: [],
      availableStudents: [],
      grades: {},
      loading: true,
      activeTab: 'enrollments',
      showMaterialModal: false,
      showAssignmentModal: false,
      editingAssignment: null,
      tabs: [
        { id: 'enrollments', label: 'Enrollments', icon: 'fas fa-users' },
        { id: 'materials', label: 'Materials', icon: 'fas fa-book' },
        { id: 'assignments', label: 'Assignments', icon: 'fas fa-tasks' },
        { id: 'grades', label: 'Grades', icon: 'fas fa-chart-line' }
      ],
      materialForm: {
        title: '',
        type: '',
        url: ''
      },
      assignmentForm: {
        title: '',
        description: '',
        due_date: '',
        max_score: 100
      },
      apiBaseUrl: 'http://localhost:5000/api'
    };
  },
  async created() {
    if (!this.isAuthenticated) {
      const isAuth = await this.checkAuth();
      if (!isAuth) {
        this.router.push('/login');
        return;
      }
    }

    if (!this.hasRole(['teacher'])) {
      this.router.push('/my-teaching-courses');
      return;
    }

    await this.fetchCourseData();
  },
  methods: {
    async fetchCourseData() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };
        const courseId = this.route.params.id;

        const [courseRes, assignmentsRes, enrollmentsRes, studentsRes] = await Promise.all([
          axios.get(`${this.apiBaseUrl}/courses/${courseId}`, { headers, withCredentials: true }).catch(() => ({ data: null })),
          axios.get(`${this.apiBaseUrl}/assignments/course/${courseId}`, { headers, withCredentials: true }).catch(() => ({ data: { data: [] } })),
          axios.get(`${this.apiBaseUrl}/courses/${courseId}/enrollments`, { headers, withCredentials: true }).catch(() => ({ data: [] })),
          axios.get(`${this.apiBaseUrl}/users/students`, { headers, withCredentials: true }).catch(() => ({ data: [] }))
        ]);

        if (courseRes.data) {
          this.course = {
            id: courseRes.data.id,
            title: courseRes.data.title || '',
            description: courseRes.data.description || '',
            teacher_id: courseRes.data.teacher_id,
            student_count: courseRes.data.student_count || 0
          };
        }
        this.assignments = assignmentsRes.data?.data || assignmentsRes.data || [];
        this.enrolledStudents = enrollmentsRes.data || [];
        const allStudents = studentsRes.data || [];
        
        const enrolledIds = new Set(this.enrolledStudents.map(s => s.id));
        this.availableStudents = allStudents.filter(student => !enrolledIds.has(student.id));
      } catch (error) {
        console.error('Error fetching course data:', error);
        alert('Failed to load course data');
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.router.push('/my-teaching-courses');
    },
    getCourseTitle(course) {
      if (!course) return 'Course';
      if (typeof course === 'string') return course;
      return course.title || 'Course';
    },
    getCourseDescription(course) {
      if (!course) return 'Manage course materials, assignments, and grades.';
      if (typeof course === 'string') return course;
      const desc = course.description || '';
      if (desc.includes('Teacher') && desc.includes('Description')) {
        const parts = desc.split('Description');
        return parts.length > 1 ? parts[1].trim() : desc;
      }
      return desc || 'Manage course materials, assignments, and grades.';
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getMaterialIcon(type) {
      const icons = {
        'PDF': '📄',
        'Link': '🔗',
        'Video': '🎥',
        'Document': '📝'
      };
      return icons[type] || '📚';
    },
    async saveMaterial() {
      try {
        this.materials.push({
          id: Date.now(),
          ...this.materialForm,
          course_id: this.route.params.id
        });
        
        this.closeMaterialModal();
        alert('Material added successfully!');
      } catch (error) {
        alert('Failed to add material');
      }
    },
    deleteMaterial(materialId) {
      if (confirm('Are you sure you want to delete this material?')) {
        this.materials = this.materials.filter(m => m.id !== materialId);
      }
    },
    closeMaterialModal() {
      this.showMaterialModal = false;
      this.materialForm = { title: '', type: '', url: '' };
    },
    async saveAssignment() {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };
        const courseId = this.route.params.id;

        const assignmentData = {
          ...this.assignmentForm,
          course_id: courseId
        };

        if (this.editingAssignment) {
          await axios.put(`${this.apiBaseUrl}/assignments/${this.editingAssignment.id}`, assignmentData, { headers, withCredentials: true });
        } else {
          await axios.post(`${this.apiBaseUrl}/assignments`, assignmentData, { headers, withCredentials: true });
        }

        await this.fetchCourseData();
        this.closeAssignmentModal();
        alert(`Assignment ${this.editingAssignment ? 'updated' : 'created'} successfully!`);
      } catch (error) {
        alert(`Failed to ${this.editingAssignment ? 'update' : 'create'} assignment`);
      }
    },
    editAssignment(assignment) {
      this.editingAssignment = assignment;
      this.assignmentForm = {
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : '',
        max_score: assignment.max_score
      };
      this.showAssignmentModal = true;
    },
    async confirmDeleteAssignment(assignmentId) {
      if (confirm('Are you sure you want to delete this assignment?')) {
        try {
          const token = localStorage.getItem('token');
          const headers = { 'x-auth-token': token };
          await axios.delete(`${this.apiBaseUrl}/assignments/${assignmentId}`, { headers, withCredentials: true });
          await this.fetchCourseData();
          alert('Assignment deleted successfully!');
        } catch (error) {
          alert('Failed to delete assignment');
        }
      }
    },
    closeAssignmentModal() {
      this.showAssignmentModal = false;
      this.editingAssignment = null;
      this.assignmentForm = { title: '', description: '', due_date: '', max_score: 100 };
    },
    getGrade(studentId, assignmentId) {
      return this.grades[`${studentId}_${assignmentId}`] || '';
    },
    updateGrade(studentId, assignmentId, grade) {
      this.grades[`${studentId}_${assignmentId}`] = grade;
    },
    calculateFinalGrade(studentId) {
      let total = 0;
      let count = 0;
      this.assignments.forEach(assignment => {
        const grade = this.grades[`${studentId}_${assignment.id}`];
        if (grade) {
          total += parseFloat(grade);
          count++;
        }
      });
      return count > 0 ? (total / count).toFixed(1) : '-';
    },
    viewStudentGrades(student) {
      alert(`Viewing grades for ${student.name}`);
    },
    async enrollStudent(studentId) {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };
        const courseId = this.route.params.id;

        await axios.post(
          `${this.apiBaseUrl}/courses/${courseId}/enroll`,
          { studentId },
          { headers, withCredentials: true }
        );

        await this.fetchCourseData();
        alert('Student enrolled successfully!');
      } catch (error) {
        console.error('Error enrolling student:', error);
        alert('Failed to enroll student: ' + (error.response?.data?.error || error.message));
      }
    },
    async unenrollStudent(studentId) {
      if (!confirm('Are you sure you want to remove this student from the course?')) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };
        const courseId = this.route.params.id;

        await axios.delete(
          `${this.apiBaseUrl}/courses/${courseId}/enroll/${studentId}`,
          { headers, withCredentials: true }
        );

        await this.fetchCourseData();
        alert('Student removed from course successfully!');
      } catch (error) {
        console.error('Error unenrolling student:', error);
        alert('Failed to remove student: ' + (error.response?.data?.error || error.message));
      }
    },
    async handleLogout() {
      await this.logout();
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.teacher-course-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

.page-main {
  padding: 2rem;
  padding-top: 120px;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  color: #4F6466;
  border: 1px solid #4F6466;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #4F6466;
  color: white;
}

.course-header-section {
  background: linear-gradient(135deg, #4F6466 0%, #3a4a4b 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.course-info {
  width: 100%;
}

.course-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.course-info .course-description {
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.course-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.tabs-section {
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background: #f8f9fa;
  color: #4F6466;
}

.tab-button.active {
  background: #4F6466;
  color: white;
}

.content-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.enrollment-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.enrollment-card {
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.enrollment-card-header {
  background: #4F6466;
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.enrollment-card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.badge-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.enrollment-card-body {
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
}

.student-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.student-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.student-name {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.95rem;
}

.student-email {
  font-size: 0.85rem;
  color: #6c757d;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-icon-small {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.empty-message p {
  margin: 0;
  font-size: 0.9rem;
}

.btn-icon-success {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #198754;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon-success:hover {
  background: #157347;
  transform: translateY(-1px);
}

.btn-icon-success.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}

.btn-icon-danger.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #4F6466;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #3a4a4b;
  transform: translateY(-1px);
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.material-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.material-icon {
  font-size: 2.5rem;
}

.material-content {
  flex: 1;
}

.material-content h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: #1a1a2e;
}

.material-type {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.material-link {
  color: #4F6466;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
}

.material-link:hover {
  text-decoration: underline;
}

.btn-icon-danger {
  background: transparent;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-icon-danger:hover {
  background: #fee2e2;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-card {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.assignment-header h3 {
  font-size: 1.2rem;
  color: #1a1a2e;
}

.assignment-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: transparent;
  border: 1px solid #dee2e6;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f8f9fa;
  color: #4F6466;
}

.assignment-description {
  color: #6c757d;
  margin-bottom: 1rem;
}

.assignment-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.grades-table-container {
  overflow-x: auto;
}

.grades-table {
  width: 100%;
  border-collapse: collapse;
}

.grades-table th {
  background: #4F6466;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.grades-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.grade-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  text-align: center;
}

.grade-input:focus {
  outline: none;
  border-color: #4F6466;
}

.student-name {
  font-weight: 600;
  color: #1a1a2e;
}

.final-grade {
  font-weight: 700;
  color: #4F6466;
}

.empty-state {
  text-align: center;
  padding: 4rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
}

.empty-state p {
  color: #6c757d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1a1a2e;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4F6466;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-secondary {
  padding: 0.75rem 1.25rem;
  background: transparent;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

.loading-container {
  text-align: center;
  padding: 4rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #4F6466;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-main {
    padding: 1rem;
    padding-top: 100px;
  }
  
  .main-container {
    max-width: 100%;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-back,
  .btn-logout {
    width: 100%;
    justify-content: center;
    white-space: nowrap;
  }
  
  .course-info h1 {
    font-size: clamp(1.25rem, 4vw, 1.5rem);
  }
  
  .course-info p {
    font-size: clamp(0.9rem, 2vw, 1rem);
  }

  .tabs {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tab-button {
    flex: 1;
    min-width: 120px;
    font-size: 0.85rem;
    padding: 0.65rem 0.75rem;
  }

  .course-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .enrollment-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .student-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .btn-icon-success.btn-sm,
  .btn-icon-danger.btn-sm {
    width: 100%;
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .grades-table-container {
    font-size: 0.85rem;
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .page-main {
    padding: 0.75rem;
    padding-top: 90px;
  }
  
  .course-header-section {
    padding: 1.25rem;
  }
  
  .course-info h1 {
    font-size: clamp(1.1rem, 4vw, 1.25rem);
  }
  
  .tab-button {
    font-size: 0.8rem;
    padding: 0.6rem 0.65rem;
    min-width: 100px;
  }
  
  .tab-button span {
    display: none;
  }
  
  .tab-button i {
    margin: 0;
  }
}
</style>

