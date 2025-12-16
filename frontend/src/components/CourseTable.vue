<template>
  <div class="container py-4">
    <div class="card shadow-sm border-0">
      <div class="card-header d-flex align-items-center" style="background-color: #4F6466; color: white;">
        <button 
          @click="$router.push('/dashboard')" 
          class="btn btn-sm btn-outline-light me-3"
          title="Back to Dashboard"
        >
          <i class="bi bi-arrow-left"></i>
        </button>
        <h2 class="h4 mb-0">Course Management</h2>
        <button 
          @click="showAddCourse = true" 
          class="btn btn-outline-light ms-auto"
        >
          <i class="bi bi-plus-lg me-1"></i> Add Course
        </button>
      </div>
      
      <div class="card-body">
        <div v-if="showAddCourse || editingCourse" class="mb-5">
          <h3 class="h5 mb-4">{{ editingCourse ? 'Edit' : 'Add New' }} Course</h3>
          <form @submit.prevent="saveCourse" class="border p-4 rounded bg-light">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Course Title</label>
                <input 
                  v-model="currentCourse.title" 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter course title" 
                  required 
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Teacher</label>
                <select 
                  v-model="currentCourse.teacher_id" 
                  class="form-select" 
                  required
                >
                  <option value="" disabled>Select Teacher</option>
                  <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Description</label>
                <textarea 
                  v-model="currentCourse.description" 
                  class="form-control" 
                  rows="3" 
                  placeholder="Enter course description"
                ></textarea>
              </div>
              <div class="col-12">
                <div class="d-flex gap-2">
                  <button type="submit" class="btn text-white" style="background-color: #4F6466;">
                    {{ editingCourse ? 'Update' : 'Create' }} Course
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    @click="closeModal"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead style="background-color: #4F6466; color: white;">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Teacher</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in courses" :key="course.id" class="bg-white">
                <td>{{ course.id }}</td>
                <td class="fw-semibold">{{ course.title }}</td>
                <td class="text-muted">
                  {{ course.description ? (course.description.length > 50 ? course.description.substring(0, 50) + '...' : course.description) : 'No description' }}
                </td>
                <td>{{ getTeacherName(course.teacher_id) }}</td>
                <td class="text-nowrap text-end">
                  <button 
                    @click="editCourse(course)" 
                    class="btn btn-sm btn-outline-secondary me-1"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button 
                    @click="confirmDelete(course.id)" 
                    class="btn btn-sm btn-outline-danger me-1"
                    title="Delete"
                  >
                    Delete
                  </button>
                  <button 
                    @click="viewEnrollments(course)" 
                    class="btn btn-sm text-white"
                    style="background-color: #4F6466;"
                    title="Manage Students"
                  >
                    Students
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


        <div v-if="showEnrollments" class="mt-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 mb-0">Student Enrollments - {{ currentCourse.title }}</h3>
            <button @click="showEnrollments = false" class="btn btn-sm btn-outline-secondary">
              <i class="bi bi-x-lg"></i> Close
            </button>
          </div>
          
          <div class="row">
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header bg-light">
                  <h4 class="h6 mb-0">Enrolled Students</h4>
                </div>
                <div class="card-body p-0">
                  <ul class="list-group list-group-flush">
                    <li v-for="student in enrolledStudents" :key="'enrolled-'+student.id" class="list-group-item d-flex justify-content-between align-items-center">
                      {{ student.name }}
                      <button 
                        @click="unenrollStudent(student.id)" 
                        class="btn btn-sm btn-outline-danger"
                        title="Remove student"
                      >
                        <i class="bi bi-person-dash"></i>
                      </button>
                    </li>
                    <li v-if="enrolledStudents.length === 0" class="list-group-item text-muted text-center py-3">
                      No students enrolled yet
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-6 mt-3 mt-md-0">
              <div class="card h-100">
                <div class="card-header bg-light">
                  <h4 class="h6 mb-0">Available Students</h4>
                </div>
                <div class="card-body p-0">
                  <ul class="list-group list-group-flush">
                    <li v-for="student in availableStudents" :key="'available-'+student.id" class="list-group-item d-flex justify-content-between align-items-center">
                      {{ student.name }}
                      <button 
                        @click="enrollStudent(student.id)" 
                        class="btn btn-sm text-white"
                        style="background-color: #4F6466;"
                        title="Enroll student"
                      >
                        <i class="bi bi-person-plus"></i>
                      </button>
                    </li>
                    <li v-if="availableStudents.length === 0" class="list-group-item text-muted text-center py-3">
                      No available students
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

export default {
  name: 'CourseManagement',
  setup() {
    const { isAuthenticated, user, hasRole, checkAuth } = useAuth();
    const router = useRouter();
    return { isAuthenticated, user, hasRole, checkAuth, router };
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
      apiBaseUrl: 'http://localhost:5000/api' 
    };
  },
  computed: {
    availableStudents() {
      if (!this.students.length || !this.enrolledStudents.length) return this.students;
      const enrolledIds = new Set(this.enrolledStudents.map(s => s.id));
      return this.students.filter(student => !enrolledIds.has(student.id));
    }
  },
  async created() {
    if (!this.isAuthenticated) {
      const isAuth = await this.checkAuth();
      if (!isAuth) {
        this.router.push('/login');
        return;
      }
    }

    if (!this.hasRole(['admin', 'teacher'])) {
      alert('You do not have permission to access this page.');
      this.router.push('/dashboard');
      return;
    }

    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        console.log('Fetching data...');
        const [coursesRes, teachersRes, studentsRes] = await Promise.all([
          this.apiRequest('GET', '/courses'),
          this.apiRequest('GET', '/users/teachers'),
          this.apiRequest('GET', '/users/students')
        ]);
        
        console.log('Data fetched successfully');
        this.courses = coursesRes.data || [];
        this.teachers = teachersRes.data || [];
        this.students = studentsRes.data || [];
      } catch (error) {
        console.error('Error in fetchData:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        alert(`Failed to load data: ${error.message}. Check console for details.`);
      }
    },

    async apiRequest(method, endpoint, data = null) {
      try {
        const url = `${this.apiBaseUrl}${endpoint}`;
        console.log(`${method} ${url}`, data ? { data } : '');
        
        const token = localStorage.getItem('token');
        
        const config = {
          method,
          url,
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        };

        if (token) {
          config.headers['x-auth-token'] = token;
        }

        if (data) {
          config.data = data;
        }

        const response = await axios(config);
        return response;
      } catch (error) {
        console.error(`API Error (${method} ${endpoint}):`, {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        if (error.response?.status === 401) {
          alert('Your session has expired. Please login again.');
          this.router.push('/login');
        }
        
        throw error;
      }
    },

    getTeacherName(teacherId) {
      const teacher = this.teachers.find(t => t.id === teacherId);
      return teacher ? teacher.name : 'N/A';
    },

    editCourse(course) {
      this.currentCourse = { ...course };
      this.editingCourse = true;
      this.showAddCourse = true;
    },

    async saveCourse() {
      try {
        const method = this.editingCourse ? 'PUT' : 'POST';
        const endpoint = this.editingCourse 
          ? `/courses/${this.currentCourse.id}`
          : '/courses';

        await this.apiRequest(method, endpoint, this.currentCourse);
        
        this.closeModal();
        await this.fetchData();
      } catch (error) {
        console.error('Error saving course:', error);
        alert(`Failed to save course: ${error.response?.data?.error || error.message}`);
      }
    },

    async confirmDelete(courseId) {
      if (confirm('Are you sure you want to delete this course?')) {
        try {
          await this.apiRequest('DELETE', `/courses/${courseId}`);
          await this.fetchData();
        } catch (error) {
          console.error('Error deleting course:', error);
          alert(`Failed to delete course: ${error.response?.data?.error || error.message}`);
        }
      }
    },

    async viewEnrollments(course) {
      this.currentCourse = { ...course };
      this.currentCourseId = course.id;
      try {
        const response = await this.apiRequest('GET', `/courses/${course.id}/enrollments`);
        this.enrolledStudents = response.data || [];
        this.showEnrollments = true;
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        alert(`Failed to load enrollments: ${error.response?.data?.error || error.message}`);
      }
    },

    async enrollStudent(studentId) {
      try {
        await this.apiRequest('POST', `/courses/${this.currentCourseId}/enroll`, { studentId });
        await this.viewEnrollments(this.currentCourse);
      } catch (error) {
        console.error('Error enrolling student:', error);
        alert(`Failed to enroll student: ${error.response?.data?.error || error.message}`);
      }
    },

    async unenrollStudent(studentId) {
      try {
        await this.apiRequest('DELETE', `/courses/${this.currentCourseId}/enroll/${studentId}`);
        await this.viewEnrollments(this.currentCourse);
      } catch (error) {
        console.error('Error unenrolling student:', error);
        alert(`Failed to unenroll student: ${error.response?.data?.error || error.message}`);
      }
    },

    closeModal() {
      this.showAddCourse = false;
      this.editingCourse = null;
      this.currentCourse = {
        id: null,
        title: '',
        description: '',
        teacher_id: ''
      };
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
  overflow: hidden;
}

.card-header {
  border-bottom: none;
  font-weight: 600;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: all 0.2s;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.btn-outline-secondary {
  border-color: #dee2e6;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
}

.form-control:focus, .form-select:focus {
  border-color: #4F6466;
  box-shadow: 0 0 0 0.25rem rgba(79, 100, 102, 0.25);
}

.list-group-item {
  padding: 0.75rem 1.25rem;
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
  border-radius: 0.25rem;
}

@media (max-width: 767.98px) {
  .table-responsive {
    border: 0;
  }
  
  .table thead {
    display: none;
  }
  
  .table, .table tbody, .table tr, .table td {
    display: block;
    width: 100%;
  }
  
  .table tr {
    margin-bottom: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
  }
  
  .table td {
    text-align: right;
    padding-left: 50%;
    position: relative;
    border-bottom: 1px solid #dee2e6;
  }
  
  .table td::before {
    content: attr(data-label);
    position: absolute;
    left: 1rem;
    width: 50%;
    padding-right: 1rem;
    text-align: left;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #6c757d;
  }
  
  .table td:last-child {
    border-bottom: 0;
    text-align: right;
  }
  
  .table td:last-child::before {
    display: none;
  }
  
  .table td .btn {
    margin: 0.25rem;
  }
}
</style>
