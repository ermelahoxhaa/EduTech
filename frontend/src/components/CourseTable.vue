<template>
  <div class="dashboard-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <nav class="sidebar">
      <div class="sidebar-header">
        <h5 v-if="!isSidebarCollapsed"><i>EduTech Admin</i></h5>
        <h5 v-else><i>ET</i></h5>
      </div>
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i :class="isSidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>
      <ul class="nav-menu">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link" active-class="active">
            <i class="fas fa-home"></i>
            <span class="nav-text">Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="hasRole(['admin'])">
          <router-link to="/manage-users" class="nav-link" active-class="active">
            <i class="fas fa-users"></i>
            <span class="nav-text">Manage Users</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/course" class="nav-link" active-class="active">
            <i class="fas fa-book"></i>
            <span class="nav-text">Manage Courses</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/createnotification" class="nav-link" active-class="active">
            <i class="fas fa-bell"></i>
            <span class="nav-text">Notifications</span>
          </router-link>
        </li>
        <li class="nav-item logout-item">
          <a class="nav-link" href="#" @click.prevent="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            <span class="nav-text">Logout</span>
          </a>
        </li>
      </ul>
    </nav>

    <main class="main-content">
      <div class="content-header">
        <h2>Course Management</h2>
        <button @click="showAddCourse = true" class="btn-primary-custom">
          <i class="fas fa-plus"></i>
          <span>Add Course</span>
        </button>
      </div>

      <div v-if="showAddCourse || editingCourse" class="form-card">
        <div class="form-card-header">
          <h5>{{ editingCourse ? 'Edit' : 'Add New' }} Course</h5>
        </div>
        <div class="form-card-body">
          <form @submit.prevent="saveCourse">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Course Title</label>
                <input 
                  v-model="currentCourse.title" 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter course title" 
                  required 
                />
              </div>
              <div class="form-group">
                <label class="form-label">Teacher</label>
                <select v-model="currentCourse.teacher_id" class="form-select" required>
                  <option value="" disabled>Select Teacher</option>
                  <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }}
                  </option>
                </select>
              </div>
              <div class="form-group full-width">
                <label class="form-label">Description</label>
                <textarea 
                  v-model="currentCourse.description" 
                  class="form-control" 
                  rows="3" 
                  placeholder="Enter course description"
                ></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary-custom">
                {{ editingCourse ? 'Update' : 'Create' }} Course
              </button>
              <button type="button" class="btn-secondary-custom" @click="closeModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Teacher</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in courses" :key="course.id">
                <td data-label="ID">{{ course.id }}</td>
                <td data-label="Title" class="fw-semibold">{{ course.title }}</td>
                <td data-label="Description" class="text-muted">
                  {{ course.description ? (course.description.length > 50 ? course.description.substring(0, 50) + '...' : course.description) : 'No description' }}
                </td>
                <td data-label="Teacher">{{ getTeacherName(course.teacher_id) }}</td>
                <td data-label="Actions" class="actions-cell">
                  <button @click="editCourse(course)" class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="confirmDelete(course.id)" class="btn-icon btn-danger" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button @click="viewEnrollments(course)" class="btn-icon btn-primary" title="Manage Students">
                    <i class="fas fa-user-graduate"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="courses.length === 0">
                <td colspan="5" class="empty-state">No courses found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showEnrollments" class="enrollment-section">
        <div class="enrollment-header">
          <h3>Student Enrollments - {{ currentCourse.title }}</h3>
          <button @click="showEnrollments = false" class="btn-secondary-custom">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
        
        <div class="enrollment-grid">
          <div class="enrollment-card">
            <div class="enrollment-card-header">
              <h4>Enrolled Students</h4>
            </div>
            <div class="enrollment-card-body">
              <ul class="student-list">
                <li v-for="student in enrolledStudents" :key="'enrolled-'+student.id">
                  <span>{{ student.name }}</span>
                  <button @click="unenrollStudent(student.id)" class="btn-icon btn-danger btn-sm" title="Remove">
                    <i class="fas fa-user-minus"></i>
                  </button>
                </li>
                <li v-if="enrolledStudents.length === 0" class="empty-message">
                  No students enrolled yet
                </li>
              </ul>
            </div>
          </div>
          <div class="enrollment-card">
            <div class="enrollment-card-header">
              <h4>Available Students</h4>
            </div>
            <div class="enrollment-card-body">
              <ul class="student-list">
                <li v-for="student in availableStudents" :key="'available-'+student.id">
                  <span>{{ student.name }}</span>
                  <button @click="enrollStudent(student.id)" class="btn-icon btn-success btn-sm" title="Enroll">
                    <i class="fas fa-user-plus"></i>
                  </button>
                </li>
                <li v-if="availableStudents.length === 0" class="empty-message">
                  No available students
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

export default {
  name: 'CourseManagement',
  setup() {
    const { isAuthenticated, hasRole, checkAuth, logout } = useAuth()
    const router = useRouter()
    return { isAuthenticated, hasRole, checkAuth, router, logout }
  },
  data() {
    return {
      courses: [],
      teachers: [],
      students: [],
      enrolledStudents: [],
      currentCourse: {
        id: null,
        title: '',
        description: '',
        teacher_id: ''
      },
      showAddCourse: false,
      editingCourse: null,
      showEnrollments: false,
      currentCourseId: null,
      isSidebarCollapsed: false,
      apiBaseUrl: 'http://localhost:5000/api'
    }
  },
  computed: {
    availableStudents() {
      if (!this.students.length || !this.enrolledStudents.length) return this.students
      const enrolledIds = new Set(this.enrolledStudents.map(s => s.id))
      return this.students.filter(student => !enrolledIds.has(student.id))
    }
  },
  async created() {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)

    if (!this.isAuthenticated) {
      const isAuth = await this.checkAuth()
      if (!isAuth) {
        this.router.push('/login')
        return
      }
    }

    if (!this.hasRole(['admin', 'teacher'])) {
      alert('You do not have permission to access this page.')
      this.router.push('/dashboard')
      return
    }

    await this.fetchData()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize)
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    checkScreenSize() {
      this.isSidebarCollapsed = window.innerWidth < 992
    },
    async handleLogout() {
      await this.logout()
    },
    async fetchData() {
      try {
        const [coursesRes, teachersRes, studentsRes] = await Promise.all([
          this.apiRequest('GET', '/courses'),
          this.apiRequest('GET', '/users/teachers'),
          this.apiRequest('GET', '/users/students')
        ])
        
        this.courses = coursesRes.data || []
        this.teachers = teachersRes.data || []
        this.students = studentsRes.data || []
      } catch (error) {
        console.error('Error in fetchData:', error)
        alert(`Failed to load data: ${error.message}`)
      }
    },
    async apiRequest(method, endpoint, data = null) {
      try {
        const url = `${this.apiBaseUrl}${endpoint}`
        const token = localStorage.getItem('token')
        
        const config = {
          method,
          url,
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }

        if (token) {
          config.headers['x-auth-token'] = token
        }

        if (data) {
          config.data = data
        }

        const response = await axios(config)
        return response
      } catch (error) {
        if (error.response?.status === 401) {
          alert('Your session has expired. Please login again.')
          this.router.push('/login')
        }
        throw error
      }
    },
    getTeacherName(teacherId) {
      const teacher = this.teachers.find(t => t.id === teacherId)
      return teacher ? teacher.name : 'N/A'
    },
    editCourse(course) {
      this.currentCourse = { ...course }
      this.editingCourse = true
      this.showAddCourse = true
    },
    async saveCourse() {
      try {
        const method = this.editingCourse ? 'PUT' : 'POST'
        const endpoint = this.editingCourse 
          ? `/courses/${this.currentCourse.id}`
          : '/courses'

        await this.apiRequest(method, endpoint, this.currentCourse)
        
        this.closeModal()
        await this.fetchData()
      } catch (error) {
        alert(`Failed to save course: ${error.response?.data?.error || error.message}`)
      }
    },
    async confirmDelete(courseId) {
      if (confirm('Are you sure you want to delete this course?')) {
        try {
          await this.apiRequest('DELETE', `/courses/${courseId}`)
          await this.fetchData()
        } catch (error) {
          alert(`Failed to delete course: ${error.response?.data?.error || error.message}`)
        }
      }
    },
    async viewEnrollments(course) {
      this.currentCourse = { ...course }
      this.currentCourseId = course.id
      try {
        const response = await this.apiRequest('GET', `/courses/${course.id}/enrollments`)
        this.enrolledStudents = response.data || []
        this.showEnrollments = true
      } catch (error) {
        alert(`Failed to load enrollments: ${error.response?.data?.error || error.message}`)
      }
    },
    async enrollStudent(studentId) {
      try {
        await this.apiRequest('POST', `/courses/${this.currentCourseId}/enroll`, { studentId })
        await this.viewEnrollments(this.currentCourse)
      } catch (error) {
        alert(`Failed to enroll student: ${error.response?.data?.error || error.message}`)
      }
    },
    async unenrollStudent(studentId) {
      try {
        await this.apiRequest('DELETE', `/courses/${this.currentCourseId}/enroll/${studentId}`)
        await this.viewEnrollments(this.currentCourse)
      } catch (error) {
        alert(`Failed to unenroll student: ${error.response?.data?.error || error.message}`)
      }
    },
    closeModal() {
      this.showAddCourse = false
      this.editingCourse = null
      this.currentCourse = {
        id: null,
        title: '',
        description: '',
        teacher_id: ''
      }
    }
  }
}
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.sidebar {
  width: 250px;
  min-width: 250px;
  background-color: #4F6466;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar-collapsed .sidebar {
  width: 70px;
  min-width: 70px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-header h5 {
  margin: 0;
  font-style: italic;
  white-space: nowrap;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4F6466;
  border: 2px solid white;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  z-index: 1001;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: #3a4a4b;
}

.nav-menu {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nav-item {
  margin: 0.25rem 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.sidebar-collapsed .nav-link {
  justify-content: center;
  padding: 0.75rem;
}

.sidebar-collapsed .nav-text {
  display: none;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: #3a4a4b;
  font-weight: 500;
}

.nav-link i {
  width: 20px;
  text-align: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.logout-item {
  margin-top: auto;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 0.5rem;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .main-content {
  margin-left: 70px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.content-header h2 {
  color: #4F6466;
  font-weight: 600;
  margin: 0;
}

.btn-primary-custom {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #4F6466;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary-custom:hover {
  background-color: #3a4a4b;
  transform: translateY(-1px);
}

.btn-secondary-custom {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: transparent;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary-custom:hover {
  background-color: #f8f9fa;
}

.form-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.form-card-header {
  background-color: #4F6466;
  color: white;
  padding: 1rem 1.5rem;
}

.form-card-header h5 {
  margin: 0;
  font-weight: 600;
}

.form-card-body {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-control,
.form-select {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: #4F6466;
  box-shadow: 0 0 0 0.25rem rgba(79, 100, 102, 0.25);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.table-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background-color: #4F6466;
  color: white;
}

.data-table th {
  padding: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-align: left;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.fw-semibold {
  font-weight: 600;
}

.text-muted {
  color: #6c757d;
}

.text-end {
  text-align: right;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: #f8f9fa;
  color: #4F6466;
}

.btn-icon.btn-danger {
  color: #dc3545;
}

.btn-icon.btn-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-icon.btn-primary {
  color: #4F6466;
}

.btn-icon.btn-primary:hover {
  background-color: #4F6466;
  border-color: #4F6466;
  color: white;
}

.btn-icon.btn-success {
  color: #198754;
}

.btn-icon.btn-success:hover {
  background-color: #198754;
  border-color: #198754;
  color: white;
}

.btn-icon.btn-sm {
  width: 30px;
  height: 30px;
  font-size: 0.8rem;
}

.empty-state {
  text-align: center;
  color: #6c757d;
  padding: 2rem !important;
}

.enrollment-section {
  margin-top: 2rem;
}

.enrollment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.enrollment-header h3 {
  color: #4F6466;
  font-weight: 600;
  margin: 0;
}

.enrollment-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.enrollment-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  overflow: hidden;
}

.enrollment-card-header {
  background-color: #f8f9fa;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.enrollment-card-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #4F6466;
}

.enrollment-card-body {
  padding: 0;
}

.student-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.student-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #eee;
}

.student-list li:last-child {
  border-bottom: none;
}

.student-list li.empty-message {
  justify-content: center;
  color: #6c757d;
  padding: 1.5rem;
}

@media (max-width: 992px) {
  .sidebar-toggle {
    display: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: auto;
  }

  .enrollment-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }

  .content-header {
    flex-direction: column;
    align-items: stretch;
  }

  .content-header h2 {
    font-size: 1.25rem;
  }

  .btn-primary-custom {
    justify-content: center;
  }

  .data-table thead {
    display: none;
  }

  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: block;
    width: 100%;
  }

  .data-table tr {
    margin-bottom: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .data-table td {
    text-align: right;
    padding: 0.75rem 1rem;
    padding-left: 40%;
    position: relative;
    border-bottom: 1px solid #eee;
  }

  .data-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 1rem;
    width: 40%;
    text-align: left;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.7rem;
    color: #6c757d;
  }

  .data-table td:last-child {
    border-bottom: 0;
  }

  .actions-cell {
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .sidebar-collapsed .sidebar {
    width: 60px;
    min-width: 60px;
  }

  .sidebar-collapsed .main-content {
    margin-left: 60px;
  }

  .main-content {
    padding: 1rem;
  }

  .form-card-body {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary-custom,
  .btn-secondary-custom {
    width: 100%;
    justify-content: center;
  }

  .enrollment-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
