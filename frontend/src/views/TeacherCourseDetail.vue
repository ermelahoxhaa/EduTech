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
                <button @click="openMaterialModal" class="btn-primary">
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
                    <button @click.stop="viewMaterial(material, $event)" class="material-link-btn">
                      <i class="fas fa-eye"></i> View Material
                    </button>
                  </div>
                  <div class="material-actions">
                    <button @click="editMaterial(material)" class="btn-icon" title="Edit Material">
                      <i class="fas fa-edit"></i> Edit
                    </button>
                    <button @click="deleteMaterial(material.id)" class="btn-icon-danger" title="Delete Material">
                      <i class="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'assignments'" class="tab-content">
              <div class="section-header">
                <div>
                  <h2>📝 Assignments</h2>
                  <p class="section-subtitle">Create and manage assignments for your students</p>
                </div>
                <button @click="openAssignmentModal" class="btn-primary">
                  <i class="fas fa-plus"></i> Create Assignment
                </button>
              </div>

              <div v-if="assignments.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No Assignments Yet</h3>
                <p>Create your first assignment by clicking the "Create Assignment" button above.</p>
              </div>

              <div v-else class="assignments-list">
                <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
                  <div class="assignment-header">
                    <div class="assignment-title-section">
                      <h3>{{ assignment.title }}</h3>
                      <span class="assignment-status-badge" :class="getAssignmentStatusClass(assignment)">
                        {{ getAssignmentStatusText(assignment) }}
                      </span>
                    </div>
                    <div class="assignment-actions">
                      <button @click="editAssignment(assignment)" class="btn-icon" title="Edit Assignment">
                        <i class="fas fa-edit"></i> Edit
                      </button>
                      <button @click="confirmDeleteAssignment(assignment.id)" class="btn-icon-danger" title="Delete Assignment">
                        <i class="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                  <div class="assignment-request-section">
                    <h4 class="assignment-request-label">Assignment Request:</h4>
                    <p class="assignment-description">{{ assignment.description || 'No description provided.' }}</p>
                  </div>
                  <div class="assignment-meta">
                    <div class="meta-item">
                      <i class="fas fa-calendar-alt"></i>
                      <div class="meta-content">
                        <span class="meta-label">Deadline:</span>
                        <span class="meta-value">{{ formatDate(assignment.due_date) }}</span>
                      </div>
                    </div>
                    <div class="meta-item">
                      <i class="fas fa-star"></i>
                      <div class="meta-content">
                        <span class="meta-label">Max Score:</span>
                        <span class="meta-value">{{ assignment.max_score || 100 }} points</span>
                      </div>
                    </div>
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
                          @change="updateGrade(student.id, assignment.id, $event && $event.target ? $event.target.value : '')"
                          class="grade-input"
                          min="0"
                          :max="assignment && assignment.max_score ? assignment.max_score : 100"
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


    <div v-if="showAssignmentModal" class="assignment-modal-overlay" @click.self="closeAssignmentModal">
      <div class="assignment-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingAssignment ? 'Edit' : 'Create' }} Assignment</h3>
          <button @click="closeAssignmentModal" class="close-btn" type="button">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAssignment">
            <div class="form-group">
              <label for="assignment-title">
                <i class="fas fa-heading"></i> Assignment Title <span class="required">*</span>
              </label>
              <input 
                id="assignment-title"
                v-model="assignmentForm.title" 
                type="text" 
                required 
                placeholder="e.g., Chapter 5 Homework, Midterm Project" 
                class="form-input"
              />
              <small class="form-help">Enter a clear and descriptive title for the assignment</small>
            </div>
            
            <div class="form-group">
              <label for="assignment-request">
                <i class="fas fa-file-alt"></i> Assignment Request <span class="required">*</span>
              </label>
              <textarea 
                id="assignment-request"
                v-model="assignmentForm.description" 
                rows="6" 
                required 
                placeholder="Describe what students need to do for this assignment. Include instructions, requirements, and any specific guidelines..."
                class="form-textarea"
              ></textarea>
              <small class="form-help">Provide detailed instructions and requirements for students</small>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="assignment-deadline">
                  <i class="fas fa-calendar-alt"></i> Deadline <span class="required">*</span>
                </label>
                <input 
                  id="assignment-deadline"
                  v-model="assignmentForm.due_date" 
                  type="datetime-local" 
                  required 
                  class="form-input"
                  :min="getCurrentDateTime()"
                />
                <small class="form-help">Select the date and time when the assignment is due</small>
              </div>
              <div class="form-group">
                <label for="assignment-max-score">
                  <i class="fas fa-star"></i> Max Score <span class="required">*</span>
                </label>
                <input 
                  id="assignment-max-score"
                  v-model="assignmentForm.max_score" 
                  type="number" 
                  min="1" 
                  max="1000"
                  required 
                  placeholder="100" 
                  class="form-input"
                />
                <small class="form-help">Maximum points students can earn (e.g., 100)</small>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="closeAssignmentModal" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">
                <i class="fas fa-check"></i> {{ editingAssignment ? 'Update' : 'Create' }} Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showMaterialModal" class="material-modal-overlay" @click.self="closeMaterialModal">
    <div class="material-modal" @click.stop>
      <div class="material-modal-header">
        <h3>{{ editingMaterial ? 'Edit' : 'Add' }} Material</h3>
        <button @click="closeMaterialModal" class="material-close-btn" type="button">&times;</button>
      </div>
      <div class="material-modal-body">
        <form @submit.prevent="saveMaterial" enctype="multipart/form-data">
          <div class="material-form-group">
            <label>Title</label>
            <input v-model="materialForm.title" type="text" required placeholder="Material title" />
          </div>
          <div class="material-form-group">
            <label>Type</label>
            <select v-model="materialForm.type" required>
              <option value="">Select Type</option>
              <option value="PDF">PDF Document</option>
              <option value="Link">External Link</option>
              <option value="Video">Video</option>
              <option value="Document">Document</option>
            </select>
          </div>
          <div v-if="!editingMaterial" class="material-form-group">
            <label>Upload Method</label>
            <div class="upload-method-options">
              <label class="radio-option">
                <input type="radio" v-model="materialForm.uploadMethod" value="url" />
                <span>Enter URL</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="materialForm.uploadMethod" value="file" />
                <span>Upload File</span>
              </label>
            </div>
          </div>
          <div v-if="materialForm.uploadMethod === 'url'" class="material-form-group">
            <label>URL / Link</label>
            <input v-model="materialForm.url" type="url" :required="materialForm.uploadMethod === 'url'" placeholder="https://..." />
          </div>
          <div v-if="materialForm.uploadMethod === 'file' && !editingMaterial" class="material-form-group">
            <label>Select File</label>
            <div class="file-upload-wrapper">
              <input 
                ref="fileInput"
                type="file" 
                @change="handleFileSelect"
                accept=".pdf,.doc,.docx,.txt,.mp4,.avi,.mov,.jpg,.jpeg,.png"
                class="file-input"
                :required="!editingMaterial"
              />
              <div v-if="materialForm.file" class="file-info">
                <i class="fas fa-file"></i>
                <span>{{ materialForm.file.name }}</span>
                <span class="file-size">({{ formatFileSize(materialForm.file.size) }})</span>
              </div>
              <button 
                v-if="!materialForm.file" 
                type="button" 
                @click="openFileBrowser" 
                class="btn-browse"
              >
                <i class="fas fa-folder-open"></i> Browse Files
              </button>
            </div>
          </div>
          <div v-if="editingMaterial && materialForm.url" class="material-form-group">
            <label>Current URL</label>
            <div class="file-info">
              <i class="fas fa-link"></i>
              <span>{{ materialForm.url }}</span>
            </div>
            <p class="edit-note">Note: File uploads cannot be changed. You can only update the URL for external links.</p>
          </div>
          <div class="material-form-actions">
            <button type="button" @click="closeMaterialModal" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">{{ editingMaterial ? 'Update' : 'Add' }} Material</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-if="showViewMaterialModal && viewingMaterial" class="material-modal-overlay" @click.self="closeViewMaterialModal">
    <div class="material-view-modal" @click.stop>
      <div class="material-modal-header">
        <h3>{{ viewingMaterial && viewingMaterial.title ? viewingMaterial.title : 'Material' }}</h3>
        <button @click="closeViewMaterialModal" class="material-close-btn" type="button">&times;</button>
      </div>
      <div class="material-view-body">
        <div class="material-view-info">
          <span class="material-type-badge">{{ viewingMaterial.type }}</span>
          <a v-if="isExternalLink(viewingMaterial.url)" :href="viewingMaterial.url" target="_blank" class="external-link-btn">
            <i class="fas fa-external-link-alt"></i> Open in New Tab
          </a>
        </div>
        <div class="material-content-viewer">
          <div v-if="viewingMaterial && viewingMaterial.type === 'PDF'" class="pdf-viewer">
            <iframe 
              v-if="viewingMaterial.url && getMaterialUrl(viewingMaterial.url)"
              :src="getMaterialUrl(viewingMaterial.url)" 
              class="material-iframe"
              frameborder="0"
            ></iframe>
            <div v-else class="material-error">
              <p>PDF URL not available</p>
            </div>
          </div>
          <div v-else-if="viewingMaterial && viewingMaterial.type === 'Video'" class="video-viewer">
            <video v-if="viewingMaterial.url && getMaterialUrl(viewingMaterial.url)" :src="getMaterialUrl(viewingMaterial.url)" controls class="material-video">
              Your browser does not support the video tag.
            </video>
            <div v-else class="material-error">
              <p>Video URL not available</p>
            </div>
          </div>
          <div v-else-if="viewingMaterial && viewingMaterial.type === 'Link'" class="link-viewer">
            <iframe 
              v-if="viewingMaterial.url"
              :src="viewingMaterial.url" 
              class="material-iframe"
              frameborder="0"
            ></iframe>
            <div v-else class="material-error">
              <p>Link URL not available</p>
            </div>
          </div>
          <div v-else-if="viewingMaterial" class="document-viewer">
            <iframe 
              v-if="viewingMaterial.url && getMaterialUrl(viewingMaterial.url)"
              :src="getMaterialUrl(viewingMaterial.url)" 
              class="material-iframe"
              frameborder="0"
            ></iframe>
            <div v-else class="material-error">
              <p>Document URL not available</p>
            </div>
          </div>
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
      showViewMaterialModal: false,
      viewingMaterial: null,
      editingMaterial: null,
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
        url: '',
        file: null,
        uploadMethod: 'url'
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

        const [courseRes, assignmentsRes, materialsRes, enrollmentsRes, studentsRes] = await Promise.all([
          axios.get(`${this.apiBaseUrl}/courses/${courseId}`, { headers, withCredentials: true }).catch(() => ({ data: null })),
          axios.get(`${this.apiBaseUrl}/assignments/course/${courseId}`, { headers, withCredentials: true }).catch(() => ({ data: { data: [] } })),
          axios.get(`${this.apiBaseUrl}/materials/course/${courseId}`, { headers, withCredentials: true }).catch(() => ({ data: { data: [] } })),
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
        this.materials = materialsRes.data?.data || materialsRes.data || [];
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
      if (typeof course !== 'object') return 'Course';
      
      let title = course.title || '';
      if (!title) return 'Course';
      
      title = title.trim();
      
      if (title.includes('Course Title Teacher Description')) {
        title = title.replace('Course Title Teacher Description', '').trim();
      }
      
      if (title.includes('Teacher')) {
        const parts = title.split('Teacher');
        title = parts[0].trim();
      }
      
      if (title.includes('Description')) {
        const parts = title.split('Description');
        title = parts[0].trim();
      }
      
      const words = title.split(/\s+/);
      if (words.length > 0 && words[0]) {
        return words[0];
      }
      
      return title || 'Course';
    },
    getCourseDescription(course) {
      if (!course) return '';
      if (typeof course === 'string') return '';
      if (typeof course !== 'object') return '';
      
      const desc = course.description || '';
      return desc.trim();
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
    handleFileSelect(event) {
      if (!event || !event.target || !event.target.files) return;
      const file = event.target.files[0];
      if (file) {
        this.materialForm.file = file;
        const fileName = file.name || '';
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        if (!this.materialForm.type || this.materialForm.type === '') {
          if (fileExtension === 'pdf') {
            this.materialForm.type = 'PDF';
          } else if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
            this.materialForm.type = 'Video';
          } else {
            this.materialForm.type = 'Document';
          }
        }
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
    async saveMaterial() {
      try {
        const token = localStorage.getItem('token');
        const courseId = this.route.params.id;
        let materialData;

        if (this.editingMaterial) {
          const headers = { 'x-auth-token': token };
          materialData = {
            title: this.materialForm.title,
            type: this.materialForm.type,
            url: this.materialForm.url
          };

          await axios.put(`${this.apiBaseUrl}/materials/${this.editingMaterial.id}`, materialData, { headers, withCredentials: true });
          await this.fetchCourseData();
          this.closeMaterialModal();
          alert('Material updated successfully!');
        } else {
          if (this.materialForm.uploadMethod === 'file' && this.materialForm.file) {
            const formData = new FormData();
            formData.append('title', this.materialForm.title);
            formData.append('type', this.materialForm.type);
            formData.append('course_id', courseId);
            formData.append('file', this.materialForm.file);

            const headers = {
              'x-auth-token': token,
              'Content-Type': 'multipart/form-data'
            };

            await axios.post(`${this.apiBaseUrl}/materials/upload`, formData, { headers, withCredentials: true });
          } else {
            const headers = { 'x-auth-token': token };
            materialData = {
              title: this.materialForm.title,
              type: this.materialForm.type,
              url: this.materialForm.url,
              course_id: courseId
            };

            await axios.post(`${this.apiBaseUrl}/materials`, materialData, { headers, withCredentials: true });
          }

          await this.fetchCourseData();
          this.closeMaterialModal();
          alert('Material added successfully!');
        }
      } catch (error) {
        console.error('Error saving material:', error);
        alert(`Failed to ${this.editingMaterial ? 'update' : 'add'} material: ` + (error.response?.data?.error || error.message));
      }
    },
    async deleteMaterial(materialId) {
      if (!confirm('Are you sure you want to delete this material?')) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };
        await axios.delete(`${this.apiBaseUrl}/materials/${materialId}`, { headers, withCredentials: true });
        await this.fetchCourseData();
        alert('Material deleted successfully!');
      } catch (error) {
        console.error('Error deleting material:', error);
        alert('Failed to delete material: ' + (error.response?.data?.error || error.message));
      }
    },
    openMaterialModal() {
      this.showViewMaterialModal = false;
      this.viewingMaterial = null;
      this.editingMaterial = null;
      this.materialForm = { title: '', type: '', url: '', file: null, uploadMethod: 'url' };
      this.showMaterialModal = true;
    },
    editMaterial(material) {
      if (!material) return;
      this.editingMaterial = { ...material };
      this.materialForm = {
        title: material.title || '',
        type: material.type || '',
        url: material.url || '',
        file: null,
        uploadMethod: material.url && (material.url.startsWith('http://') || material.url.startsWith('https://')) ? 'url' : (material.url && material.url.startsWith('/uploads/') ? 'file' : 'url')
      };
      this.showViewMaterialModal = false;
      this.viewingMaterial = null;
      this.showMaterialModal = true;
    },
    closeMaterialModal() {
      this.showMaterialModal = false;
      this.editingMaterial = null;
      this.materialForm = { title: '', type: '', url: '', file: null, uploadMethod: 'url' };
    },
    openFileBrowser() {
      if (!this.showMaterialModal) return;
      this.$nextTick(() => {
        const fileInput = this.$refs.fileInput;
        if (fileInput && typeof fileInput.click === 'function') {
          try {
            fileInput.click();
          } catch (error) {
            console.warn('Error opening file browser:', error);
          }
        }
      });
    },
    viewMaterial(material, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (!material) return;
      this.viewingMaterial = { ...material };
      this.showViewMaterialModal = true;
      this.showMaterialModal = false;
    },
    closeViewMaterialModal() {
      this.showViewMaterialModal = false;
      this.viewingMaterial = null;
    },
    getMaterialUrl(url) {
      if (!url) return '';
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      if (url.startsWith('/uploads/')) {
        return `${this.apiBaseUrl.replace('/api', '')}${url}`;
      }
      return url;
    },
    isExternalLink(url) {
      if (!url) return false;
      return url.startsWith('http://') || url.startsWith('https://');
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
    openAssignmentModal() {
      this.editingAssignment = null;
      this.assignmentForm = { title: '', description: '', due_date: '', max_score: 100 };
      this.showAssignmentModal = true;
    },
    closeAssignmentModal() {
      this.showAssignmentModal = false;
      this.editingAssignment = null;
      this.assignmentForm = { title: '', description: '', due_date: '', max_score: 100 };
    },
    getCurrentDateTime() {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    },
    getAssignmentStatusText(assignment) {
      if (!assignment || !assignment.due_date) return 'Active';
      const dueDate = new Date(assignment.due_date);
      const now = new Date();
      if (now > dueDate) {
        return 'Past Due';
      }
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 3) {
        return 'Due Soon';
      }
      return 'Active';
    },
    getAssignmentStatusClass(assignment) {
      const status = this.getAssignmentStatusText(assignment);
      return {
        'status-active': status === 'Active',
        'status-due-soon': status === 'Due Soon',
        'status-past-due': status === 'Past Due'
      };
    },
    getGrade(studentId, assignmentId) {
      return this.grades[`${studentId}_${assignmentId}`] || '';
    },
    updateGrade(studentId, assignmentId, grade) {
      if (!studentId || !assignmentId) return;
      const key = `${studentId}_${assignmentId}`;
      if (grade === '' || grade === null || grade === undefined) {
        delete this.grades[key];
      } else {
        this.grades[key] = grade;
      }
    },
    calculateFinalGrade(studentId) {
      if (!studentId || !Array.isArray(this.assignments)) return '-';
      let total = 0;
      let count = 0;
      this.assignments.forEach(assignment => {
        if (!assignment || !assignment.id) return;
        const grade = this.grades[`${studentId}_${assignment.id}`];
        if (grade !== undefined && grade !== null && grade !== '') {
          const numGrade = parseFloat(grade);
          if (!isNaN(numGrade)) {
            total += numGrade;
            count++;
          }
        }
      });
      return count > 0 ? (total / count).toFixed(1) : '-';
    },
    viewStudentGrades(student) {
      if (!student || !student.name) return;
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

.material-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
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
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.assignment-title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.assignment-header h3 {
  font-size: 1.3rem;
  color: #1a1a2e;
  margin: 0;
}

.assignment-status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-due-soon {
  background: #fef3c7;
  color: #92400e;
}

.status-past-due {
  background: #fee2e2;
  color: #991b1b;
}

.assignment-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #dee2e6;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f8f9fa;
  color: #4F6466;
  border-color: #4F6466;
}

.assignment-request-section {
  background: #ffffff;
  border-left: 3px solid #4F6466;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.assignment-request-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4F6466;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.assignment-description {
  color: #1a1a2e;
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.assignment-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.meta-item i {
  color: #4F6466;
  font-size: 1.1rem;
}

.meta-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.meta-value {
  color: #1a1a2e;
  font-weight: 600;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.95rem;
}

.form-group label i {
  color: #4F6466;
}

.required {
  color: #dc3545;
  font-weight: 700;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4F6466;
  box-shadow: 0 0 0 3px rgba(79, 100, 102, 0.1);
}

.form-help {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #6c757d;
  font-style: italic;
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

<style>
.material-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.6) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 999999 !important;
  width: 100vw !important;
  height: 100vh !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.material-modal {
  background: white !important;
  border-radius: 12px !important;
  width: 90% !important;
  max-width: 600px !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  z-index: 1000000 !important;
  position: relative !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.material-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.material-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a1a2e;
}

.material-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-close-btn:hover {
  color: #1a1a2e;
}

.material-modal-body {
  padding: 1.5rem;
}

.material-form-group {
  margin-bottom: 1rem;
}

.material-form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1a1a2e;
}

.material-form-group input,
.material-form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.material-form-group input:focus,
.material-form-group select:focus {
  outline: none;
  border-color: #4F6466;
}

.material-form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.upload-method-options {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  transition: all 0.2s;
}

.radio-option:hover {
  border-color: #4F6466;
  background: #f8f9fa;
}

.radio-option input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

.radio-option input[type="radio"]:checked + span {
  color: #4F6466;
  font-weight: 600;
}

.radio-option span {
  user-select: none;
}

.file-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.btn-browse {
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
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
}

.btn-browse:hover {
  background: #3a4a4b;
  transform: translateY(-1px);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 2px dashed #4F6466;
  border-radius: 8px;
  color: #1a1a2e;
}

.file-info i {
  font-size: 1.5rem;
  color: #4F6466;
}

.file-info span {
  font-weight: 500;
}

.file-size {
  color: #6c757d;
  font-size: 0.9rem;
}

.material-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4F6466;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.material-link-btn:hover {
  background: #3a4a4b;
  transform: translateY(-1px);
}

.material-view-modal {
  background: white;
  border-radius: 12px;
  width: 95%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  z-index: 100000;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.material-view-body {
  display: flex;
  flex-direction: column;
  height: calc(90vh - 80px);
  overflow: hidden;
}

.material-view-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.material-type-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #4F6466;
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.external-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #4F6466;
  border: 2px solid #4F6466;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
}

.external-link-btn:hover {
  background: #4F6466;
  color: white;
}

.material-content-viewer {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.material-iframe {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
}

.material-video {
  width: 100%;
  height: 100%;
  max-height: calc(90vh - 200px);
  object-fit: contain;
}

.pdf-viewer,
.document-viewer,
.link-viewer,
.video-viewer {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.material-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  color: #6c757d;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .material-view-modal {
    width: 98%;
    max-height: 95vh;
  }

  .material-view-body {
    height: calc(95vh - 80px);
  }

  .material-iframe,
  .material-video {
    min-height: 400px;
  }

  .material-view-info {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .external-link-btn {
    width: 100%;
    justify-content: center;
  }
}

.assignment-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.6) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 999999 !important;
  width: 100vw !important;
  height: 100vh !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.assignment-modal {
  background: white !important;
  border-radius: 12px !important;
  width: 90% !important;
  max-width: 700px !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  z-index: 1000000 !important;
  position: relative !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.assignment-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.assignment-modal .modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a1a2e;
}

.assignment-modal .close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assignment-modal .close-btn:hover {
  color: #1a1a2e;
}

.assignment-modal .modal-body {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .assignment-modal {
    width: 98%;
    max-height: 95vh;
  }
}
</style>

